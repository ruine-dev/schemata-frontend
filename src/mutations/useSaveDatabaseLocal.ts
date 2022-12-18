import { useMutation } from '@tanstack/react-query';
import localforage from 'localforage';
import { DatabaseProps } from '../schemas/database';

export function useSaveDatabaseLocal() {
  return useMutation<DatabaseProps, unknown, DatabaseProps>(async (newDatabase) => {
    return await localforage.setItem<DatabaseProps>('database', newDatabase);
  });
}
