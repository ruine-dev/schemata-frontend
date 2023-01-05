import { TableWithoutIdType } from '@/schemas/base';
import { getColumnIdFromHandleId, getHandlePositionFromHandleId } from '@/utils/reactflow';
import { Edge, ReactFlowInstance, useReactFlow } from 'reactflow';

export function useHandleEdgeMarker() {
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

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
