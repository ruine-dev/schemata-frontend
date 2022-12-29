import { BaseColumnSchema, TableTypeWithoutId } from '@/schemas/base';
import { useReactFlow } from 'reactflow';
import { z } from 'zod';

export const ValidateUniqueTableColumnSchema = BaseColumnSchema.pick({ name: true }).extend({
  tableId: z.string().uuid(),
});

export type ValidateUniqueTableColumnSchemaType = z.infer<typeof ValidateUniqueTableColumnSchema>;

export function useValidateUniqueTableColumn() {
  const reactFlowInstance = useReactFlow<TableTypeWithoutId>();

  return (columnPayload: ValidateUniqueTableColumnSchemaType) => {
    const { tableId, name } = columnPayload;

    const node = reactFlowInstance.getNode(tableId);

    if (!node) {
      throw Error(`Table with id ${tableId} not found`);
    }

    const duplicate = node.data.columns.find(
      (column) => column.name.toLowerCase() === name.toLowerCase(),
    );

    return !duplicate;
  };
}
