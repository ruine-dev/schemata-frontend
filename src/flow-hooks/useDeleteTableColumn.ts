import { DeleteColumnType, TableTypeWithoutId } from '@/schemas/base';
import { useReactFlow } from 'reactflow';

export function useDeleteTableColumn() {
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
  };
}
