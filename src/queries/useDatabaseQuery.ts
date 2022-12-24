import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import localforage from 'localforage';
import { DatabaseProps } from '../schemas/database';

export async function fetchDatabase(id: DatabaseProps['id']): Promise<DatabaseProps> {
  const { data: database } = await axios.get<DatabaseProps>('/');

  if (!database) {
    throw Error(`Database with ID ${id} not found`);
  }

  return database;
}

export async function fetchLocalDatabase(): Promise<DatabaseProps> {
  const database = await localforage.getItem<DatabaseProps>('database');

  if (!database) {
    throw Error('Local database not found');
  }

  return database;
}

export function databaseQuery(id: DatabaseProps['id']) {
  return {
    queryKey: ['database', id],
    queryFn: async () => await fetchDatabase(id),
  };
}

export function localDatabaseQuery() {
  return {
    queryKey: ['localDatabase'],
    queryFn: fetchLocalDatabase,
  };
}

export function useLocalDatabaseQuery() {
  return useQuery(localDatabaseQuery());
}

export function useDatabaseQuery(id: DatabaseProps['id']) {
  return useQuery(databaseQuery(id));
}
