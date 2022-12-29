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
  const relatedEdge = useStore(
    useCallback(
      (store) => store.edges.find((edge) => edge.source === source && edge.target === target),
      [source, target],
    ),
  );

  if (!sourceNode || !targetNode || !relatedEdge) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
    relatedEdge,
  );

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
      className="react-flow__edge-path stroke-slate-400 stroke-2"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
}
