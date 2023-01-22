import { localSchemaQuery } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/base';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

export function useSaveLocalSchema(id: SchemaType['id']) {
  const queryClient = useQueryClient();

  return useMutation<SchemaType, unknown, SchemaType | ((currentSchema: SchemaType) => SchemaType)>(
    async (newSchema) => {
      let currentSchema = await localforage.getItem<SchemaType>(`schema-${id}`);

      if (!currentSchema) {
        const queryDataSchema = queryClient.getQueryData<SchemaType>(['schema', id]);

        if (!queryDataSchema) {
          throw Error('Schema not found');
        }

        currentSchema = queryDataSchema;
      }

      if (typeof newSchema === 'function') {
        return await localforage.setItem<SchemaType>(`schema-${id}`, {
          ...newSchema(currentSchema),
          name: newSchema.name || currentSchema.name,
        });
      }

      return await localforage.setItem<SchemaType>(`schema-${id}`, {
        ...newSchema,
        name: newSchema.name || currentSchema.name,
      });
    },
    {
      onSuccess({ id }) {
        queryClient.invalidateQueries(localSchemaQuery(id));
        queryClient.invalidateQueries(localSchemaQuery());
      },
    },
  );
}
