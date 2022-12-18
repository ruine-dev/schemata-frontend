import { v4 as uuidv4 } from 'uuid';
import { DatabaseProps } from '../schemas/database';

export function emtpyDatabaseFactory(): DatabaseProps {
  return {
    id: uuidv4(),
    name: 'Untitled',
    tables: [],
  };
}
