import { CSSProperties, useCallback } from 'react';
import { useStore, Position, getSmoothStepPath } from 'reactflow';

import { getEdgeParams } from './utils.js';

type SimpleFLoatingEdgeProps = {
  id: string;
  source: string;
  target: string;
  markerEnd?: string;
  style?: CSSProperties;
};

export function SimpleFloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
}: SimpleFLoatingEdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getSmoothStepPath({
    sourceX: sx as number,
    sourceY: sy as number,
    sourcePosition: sourcePos as Position,
    targetPosition: targetPos as Position,
    targetX: tx as number,
    targetY: ty as number,
    borderRadius: 24,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path stroke-2 stroke-slate-400"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}
