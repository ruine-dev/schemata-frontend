import { EdgeType, TableWithoutIdType } from '@/schemas/base';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { Edge, useReactFlow } from 'reactflow';

export function useHandleEdgeMarker() {
  const reactFlowInstance = useReactFlow<TableWithoutIdType, EdgeType>();

  return (edge: Edge) => {
    const sourceColumnId = edge.sourceHandle ? getColumnIdFromHandleId(edge.sourceHandle) : '';

    const sourceNode = reactFlowInstance.getNode(edge.source);

    const isOneToOne = !!sourceNode?.data.indexes.find(
      (index) => index.type === 'UNIQUE_INDEX' && index.columns.includes(sourceColumnId),
    );

    return {
      markerStart: isOneToOne ? 'one' : 'many',
      markerEnd: 'one',
    };
  };
}
