import { CreateColumnType, TableTypeWithoutId } from '@/schemas/base';
import { useReactFlow } from 'reactflow';

export function useAddTableColumn() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (columnPayload: CreateColumnType) => {
    const { tableId, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: [
                ...node.data.columns,
                {
                  id: crypto.randomUUID(),
                  ...newColumn,
                },
              ],
            },
          };
        }

        return node;
      });
    });
  };
}
