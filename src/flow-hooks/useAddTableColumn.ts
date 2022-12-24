import { Node, useReactFlow } from 'reactflow';
import { z } from 'zod';
import { TableColumnSchema, TableProps } from '@/schemas/table';

export const AddTableColumnSchema = TableColumnSchema.omit({ id: true }).extend({
  tableId: z.string(),
});
export type AddTableColumnSchemaType = z.infer<typeof AddTableColumnSchema>;

export function useAddTableColumn() {
  const reactFlowInstance = useReactFlow();

  return (columnPayload: AddTableColumnSchemaType) => {
    const { tableId, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) => {
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
