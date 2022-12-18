import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { databaseQuery } from '../queries/useDatabaseQuery';
import { DatabaseProps } from '../schemas/database';

export function useSaveDatabase() {
  const queryClient = useQueryClient();

  return useMutation<DatabaseProps, unknown, DatabaseProps>(
    async (newDatabase) => {
      return await axios.post('', newDatabase);
    },
    {
      onSuccess(data) {
        const query = databaseQuery(data.id);

        queryClient.invalidateQueries(query.queryKey);
      },
    },
  );
}
