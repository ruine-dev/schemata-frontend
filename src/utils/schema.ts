import { encode, decode } from 'universal-base64url';
import { SchemaSchema, SchemaType } from '@/schemas/base';

export function emptySchemaFactory(): SchemaType {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled',
    vendor: 'MYSQL:8.0',
    tables: [],
    groups: [],
    positions: [],
    relations: [],
  };
}

export function schemaToBase64Url(schema: SchemaType): string {
  const encoded = encode(JSON.stringify(schema));

  return encoded;
}

export function base64UrlToSchema(base64UrlString: string): SchemaType {
  const decoded = decode(base64UrlString);

  const json = JSON.parse(decoded);

  return SchemaSchema.parse(json);
}
