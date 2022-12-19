import { Node, useReactFlow } from 'reactflow';
import { z } from 'zod';
import { TableColumnSchema, TableProps } from '@/schemas/table';

export const DeleteTableColumnSchema = TableColumnSchema.pick({ id: true }).extend({
  tableId: z.string(),
});

export type DeleteTableColumnSchemaType = z.infer<typeof DeleteTableColumnSchema>;

export function useDeleteTableColumn() {
  const reactFlowInstance = useReactFlow();

  return (columnPayload: DeleteTableColumnSchemaType) => {
    const { tableId, id } = columnPayload;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) => {
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
