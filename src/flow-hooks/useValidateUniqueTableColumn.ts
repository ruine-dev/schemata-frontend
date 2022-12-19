import { Node, useReactFlow } from 'reactflow';
import { z } from 'zod';
import { TableColumnSchema, TableProps } from '@/schemas/table';

export const ValidateUniqueTableColumnSchema = TableColumnSchema.pick({ name: true }).extend({
  tableId: z.string(),
});

export type ValidateUniqueTableColumnSchemaType = z.infer<typeof ValidateUniqueTableColumnSchema>;

export function useValidateUniqueTableColumn() {
  const reactFlowInstance = useReactFlow();

  return (columnPayload: ValidateUniqueTableColumnSchemaType) => {
    const { tableId, name } = columnPayload;

    const nodes: Node<TableProps>[] = reactFlowInstance.getNodes();

    const node = nodes.find((node) => node.id === tableId);

    if (!node) {
      throw Error(`Table with id ${tableId} not found`);
    }

    const duplicate = node.data.columns.find(
      (column) => column.name.toLowerCase() === name.toLowerCase(),
    );

    return !duplicate;
  };
}
