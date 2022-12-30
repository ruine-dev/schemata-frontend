import { DeleteColumnType, TableTypeWithoutId } from '@/schemas/base';
import { getColumnIdFromHandleId } from '@/utils/reactflow';
import { useReactFlow } from 'reactflow';

export function useDeleteColumn(callback?: () => void) {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (columnPayload: DeleteColumnType) => {
    const { tableId, id } = columnPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.filter((column) => column.id !== id),
            },
          };
        }

        return node;
      });
    });

    reactFlowInstance.setEdges((currentEdges) => {
      return currentEdges.filter((edge) => {
        return (
          edge.targetHandle &&
          getColumnIdFromHandleId(edge.targetHandle) !== id &&
          edge.sourceHandle &&
          getColumnIdFromHandleId(edge.sourceHandle) !== id
        );
      });
    });

    callback?.();
  };
}
