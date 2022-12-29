import { TableTypeWithoutId } from '@/schemas/base';
import { getColumnIdFromHandleId, getHandlePositionFromHandleId } from '@/utils/reactflow';
import { Edge, ReactFlowInstance } from 'reactflow';

type UseHandleEdgeMarkerParams = {
  reactFlowInstance: ReactFlowInstance<TableTypeWithoutId> | null;
};

export function useHandleEdgeMarker({ reactFlowInstance }: UseHandleEdgeMarkerParams) {
  return (edge: Edge) => {
    const targetColumnId = edge.targetHandle ? getColumnIdFromHandleId(edge.targetHandle) : '';

    const targetNode = reactFlowInstance?.getNode(edge.target);

    const isOneToOne = !!targetNode?.data.indexes.find(
      (index) => index.type === 'UNIQUE_INDEX' && index.columns.includes(targetColumnId),
    );

    return {
      markerStart: isOneToOne ? 'one' : 'many',
      markerEnd: 'one',
    };
  };
}
