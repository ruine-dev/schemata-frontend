import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DatabaseProps } from '../schemas/database';

async function fetchDatabase(id: DatabaseProps['id']): Promise<DatabaseProps> {
  const { data: database } = await axios.get<DatabaseProps>('/');

  if (!database) {
    throw Error(`Database with ID ${id} not found`);
  }

  return database;
}

export function databaseQuery(id: DatabaseProps['id']) {
  return {
    queryKey: ['database', id],
    queryFn: async () => await fetchDatabase(id),
  };
}

export function useDatabaseQuery(id: DatabaseProps['id']) {
  return useQuery(databaseQuery(id));
}
