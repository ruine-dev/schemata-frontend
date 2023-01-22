import { EdgeType, IndexType, TableWithoutIdType } from '@/schemas/base';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { Edge, useReactFlow } from 'reactflow';

export function useHandleEdgeMarker() {
  const reactFlowInstance = useReactFlow<TableWithoutIdType, EdgeType>();

  return (edge: Edge, indexes?: IndexType[]) => {
    const sourceColumnId = edge.sourceHandle ? getColumnIdFromHandleId(edge.sourceHandle) : '';

    const sourceNode = reactFlowInstance.getNode(edge.source);

    const finalIndexes: IndexType[] = indexes ?? sourceNode?.data.indexes ?? [];

    const isOneToOne = !!finalIndexes.find(
      (index) => index.type === 'UNIQUE_INDEX' && index.columns.includes(sourceColumnId),
    );

    return {
      markerStart: isOneToOne ? 'one' : 'many',
      markerEnd: 'one',
    };
  };
}
