import { Node, useReactFlow } from 'reactflow';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { TableColumnSchema, TableProps } from '@/schemas/table';

export const AddTableColumnSchema = TableColumnSchema.omit({ id: true }).extend({
  tableId: z.string(),
});
export type AddTableColumnSchemaType = z.infer<typeof AddTableColumnSchema>;

export function useAddTableColumn() {
  const reactFlowInstance = useReactFlow();

  return (columnPayload: AddTableColumnSchemaType) => {
    const { tableId, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) =>
      currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: [
                ...node.data.columns,
                {
                  id: uuidv4(),
                  ...newColumn,
                },
              ],
            },
          };
        }

        return node;
      }),
    );
  };
}
