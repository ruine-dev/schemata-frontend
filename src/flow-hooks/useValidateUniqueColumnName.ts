import { BaseColumnSchema } from '@/schemas/base';
import { TableWithoutIdType } from '@/schemas/table';
import { useReactFlow } from 'reactflow';
import { z } from 'zod';

export const ValidateUniqueColumnNameSchema = BaseColumnSchema.pick({
  id: true,
  name: true,
}).extend({
  tableId: z.string().uuid(),
});

export type ValidateUniqueColumnNameType = z.infer<typeof ValidateUniqueColumnNameSchema>;

export function useValidateUniqueColumnName() {
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (columnPayload: ValidateUniqueColumnNameType) => {
    const { id, name, tableId } = columnPayload;

    const node = reactFlowInstance.getNode(tableId);

    if (!node) {
      throw Error(`Table with id ${tableId} not found`);
    }

    const duplicate = node.data.columns.find(
      (column) => column.id !== id && column.name.toLowerCase() === name.toLowerCase(),
    );

    return !duplicate;
  };
}
