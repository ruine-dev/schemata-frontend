import { CreateColumnSchema, CreateColumnType, TableTypeWithoutId } from '@/schemas/base';
import { useReactFlow } from 'reactflow';

export function useCreateColumn() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (columnPayload: CreateColumnType) => {
    const { tableId, ...newColumn } = CreateColumnSchema.parse(columnPayload);

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
