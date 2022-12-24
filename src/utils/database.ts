import { decode, encode } from 'universal-base64url';
import { DatabaseProps, DatabaseSchema } from '../schemas/database';

export function emptyDatabaseFactory(): DatabaseProps {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled',
    tables: [],
  };
}

export function databaseToBase64Url(database: DatabaseProps): string {
  const encoded = encode(JSON.stringify(database));

  return encoded;
}

export function base64UrlToDatabase(base64UrlString: string): DatabaseProps {
  const decoded = decode(base64UrlString);

  const json = JSON.parse(decoded);

  return DatabaseSchema.parse(json);
}
