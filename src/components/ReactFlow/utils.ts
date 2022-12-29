import { Position, internalsSymbol, Node, Edge } from 'reactflow';

// returns the position (top,right,bottom or right) passed node compared to
function getParams(sourceNode: Node, targetNode: Node, relatedEdge: Edge) {
  const centerA = getNodeCenter(sourceNode);
  const centerB = getNodeCenter(targetNode);

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position;

  // when the horizontal difference between the nodes is bigger, we use Position.Left or Position.Right for the handle
  // if (horizontalDiff > verticalDiff) {
  position = centerA.x > centerB.x ? Position.Left : Position.Right;
  // } else {
  // here the vertical difference between the nodes is bigger, so we use Position.Top or Position.Bottom for the handle
  // position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  // }

  const [x, y] = getHandleCoordsByPosition(sourceNode, position, relatedEdge);
  return [x, y, position];
}

function getHandleCoordsByPosition(sourceNode: Node, handlePosition: Position, relatedEdge: Edge) {
  const sourceHandleId = relatedEdge.sourceHandle?.split('-').slice(0, -2).join('-');
  const targetHandleId = relatedEdge.targetHandle?.split('-').slice(0, -1).join('-');

  // all handles are from type source, that's why we use handleBounds.source here
  const handle = sourceNode?.[internalsSymbol]?.handleBounds?.source?.find((h) => {
    const hId = h.id?.split('-').slice(0, -2).join('-');
    return h.position === handlePosition && (hId === sourceHandleId || hId === targetHandleId);
  });

  let offsetX = (handle?.width ?? 0) / 2;
  let offsetY = (handle?.height ?? 0) / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle?.width ?? 0;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle?.height ?? 0;
      break;
  }

  const x = (sourceNode?.positionAbsolute?.x ?? 0) + (handle?.x ?? 0) + offsetX;
  const y = (sourceNode?.positionAbsolute?.y ?? 0) + (handle?.y ?? 0) + offsetY;

  return [x, y];
}

function getNodeCenter(node: Node) {
  return {
    x: (node?.positionAbsolute?.x ?? 0) + (node?.width ?? 0) / 2,
    y: (node?.positionAbsolute?.y ?? 0) + (node?.height ?? 0) / 2,
  };
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(sourceNode: Node, targetNode: Node, relatedEdge: Edge) {
  const [sx, sy, sourcePos] = getParams(sourceNode, targetNode, relatedEdge);
  const [tx, ty, targetPos] = getParams(targetNode, sourceNode, relatedEdge);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
