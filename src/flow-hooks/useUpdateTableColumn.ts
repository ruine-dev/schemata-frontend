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
    const { tableId, name, ...newColumn } = columnPayload;

    reactFlowInstance.setNodes((currentNodes: Node<TableProps>[]) => {
      return currentNodes.map((node) => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              columns: node.data.columns.map((column) => {
                if (column.id === newColumn.id) {
                  return {
                    name: name || 'untitled',
                    ...newColumn,
                  };
                }
                return column;
              }),
            },
          };
        }

        return node;
      });
    });
  };
}
