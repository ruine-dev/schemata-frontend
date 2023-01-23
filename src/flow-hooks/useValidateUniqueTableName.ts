import { TableSchema, TableWithoutIdType } from '@/schemas/base';
import { useReactFlow } from 'reactflow';
import { z } from 'zod';

export const ValidateUniqueTableNameSchema = TableSchema.pick({ id: true, name: true });

export type ValidateUniqueTableNameType = z.infer<typeof ValidateUniqueTableNameSchema>;

export function useValidateUniqueTableName() {
  const reactFlowInstance = useReactFlow<TableWithoutIdType>();

  return (tablePayload: ValidateUniqueTableNameType) => {
    const { id, name } = tablePayload;

    const duplicate = reactFlowInstance
      .getNodes()
      .find((node) => node.id !== id && node.data.name.toLowerCase() === name.toLowerCase());

    return !duplicate;
  };
}
