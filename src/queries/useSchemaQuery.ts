import { SchemaType } from '@/schemas/base';
import { emptySchemaFactory } from '@/utils/schema';
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

export async function fetchLocalSchema(id?: SchemaType['id']): Promise<SchemaType> {
  const schema = await localforage.getItem<SchemaType>(`schema-${id}`);

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

export function localSchemaQuery(id?: SchemaType['id']) {
  return {
    queryKey: ['schema', id],
    queryFn: async () => await fetchLocalSchema(id),
  };
}

export function useLocalSchemaQuery(id?: SchemaType['id']) {
  return useQuery(localSchemaQuery(id));
}

export function useSchemaQuery(id: SchemaType['id']) {
  return useQuery(schemaQuery(id));
}
