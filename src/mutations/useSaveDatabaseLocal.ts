import { localDatabaseQuery } from '@/queries/useDatabaseQuery';
import { emptyDatabaseFactory } from '@/utils/database';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';
import { DatabaseProps } from '../schemas/database';

export function useSaveDatabaseLocal() {
  const queryClient = useQueryClient();

  return useMutation<
    DatabaseProps,
    unknown,
    DatabaseProps | ((currentDatabase: DatabaseProps) => DatabaseProps)
  >(
    async (newDatabase) => {
      if (typeof newDatabase === 'function') {
        let currentDatabase = await localforage.getItem<DatabaseProps>('database');

        if (!currentDatabase) {
          currentDatabase = emptyDatabaseFactory();
        }

        return await localforage.setItem<DatabaseProps>('database', newDatabase(currentDatabase));
      }

      return await localforage.setItem<DatabaseProps>('database', newDatabase);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries(localDatabaseQuery());
      },
    },
  );
}
