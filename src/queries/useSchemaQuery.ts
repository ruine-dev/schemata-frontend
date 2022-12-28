import { SchemaType } from '@/schemas/base';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';

export async function fetchSchema(id: SchemaType['id']): Promise<SchemaType> {
  const { data: schema } = await axios.get<SchemaType>('/');

  if (!schema) {
    throw Error(`Schema with ID ${id} not found`);
  }

  return schema;
}

export async function fetchLocalSchema(): Promise<SchemaType> {
  const schema = await localforage.getItem<SchemaType>('schema');

  if (!schema) {
    throw Error('Local schema not found');
  }

  return schema;
}

export function schemaQuery(id: SchemaType['id']) {
  return {
    queryKey: ['schema', id],
    queryFn: async () => await fetchSchema(id),
  };
}

export function localSchemaQuery() {
  return {
    queryKey: ['localSchema'],
    queryFn: fetchLocalSchema,
  };
}

export function useLocalSchemaQuery() {
  return useQuery(localSchemaQuery());
}

export function useSchemaQuery(id: SchemaType['id']) {
  return useQuery(schemaQuery(id));
}
