import { localSchemaQuery } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/base';
import { emptySchemaFactory } from '@/utils/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

export function useSaveLocalSchema() {
  const queryClient = useQueryClient();

  return useMutation<SchemaType, unknown, SchemaType | ((currentSchema: SchemaType) => SchemaType)>(
    async (newSchema) => {
      if (typeof newSchema === 'function') {
        let currentSchema = await localforage.getItem<SchemaType>('schema');

        if (!currentSchema) {
          currentSchema = emptySchemaFactory();
        }

        return await localforage.setItem<SchemaType>('schema', newSchema(currentSchema));
      }

      return await localforage.setItem<SchemaType>('schema', newSchema);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(localSchemaQuery());
      },
    },
  );
}
