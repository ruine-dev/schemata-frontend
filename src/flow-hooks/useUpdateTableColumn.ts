import { Node, useReactFlow } from 'reactflow';
import { z } from 'zod';
import { TableColumnSchema, TableProps } from '@/schemas/table';

export const UpdateTableColumnSchema = TableColumnSchema.extend({
  tableId: z.string(),
});
export type UpdateTableColumnSchemaType = z.infer<typeof UpdateTableColumnSchema>;

export function useUpdateTableColumn() {
  const reactFlowInstance = useReactFlow();

  return (columnPayload: UpdateTableColumnSchemaType) => {
    const { tableId, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) =>
      currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.map((column) => {
                if (column.id === newColumn.id) {
                  return newColumn;
                }
              }),
            },
          };
        }

        return node;
      }),
    );
  };
}
