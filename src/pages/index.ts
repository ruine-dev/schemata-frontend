import { fetchLocalDatabase, localDatabaseQuery } from '@/queries/useDatabaseQuery';
import { DatabaseProps, DatabaseSchema } from '@/schemas/database';
import { base64UrlToDatabase, emptyDatabaseFactory } from '@/utils/database';
import { QueryClient } from '@tanstack/react-query';
import { createRouteConfig, createReactRouter } from '@tanstack/react-router';
import localforage from 'localforage';
import { z } from 'zod';
import { Editor } from './Editor';

export const rootRoute = createRouteConfig();

function routeConfig(queryClient: QueryClient) {
  return rootRoute.addChildren([
    rootRoute.createRoute({
      path: '/',
      component: Editor,
      async loader({ search }) {
        const { schema: base64Schema } = search;

        const { queryKey } = localDatabaseQuery();

        const existingDatabase =
          queryClient.getQueryData<DatabaseProps>(queryKey) ??
          (await queryClient.prefetchQuery(queryKey, fetchLocalDatabase));

        const database: DatabaseProps = base64Schema
          ? base64UrlToDatabase(base64Schema)
          : existingDatabase ?? emptyDatabaseFactory();

        await localforage.setItem<DatabaseProps>('database', database);

        queryClient.setQueryData(queryKey, database);

        return {
          database,
        };
      },
      validateSearch: z.object({
        schema: z.string().optional(),
      }).parse,
    }),
  ]);
}

export function router(queryClient: QueryClient) {
  return createReactRouter({
    routeConfig: routeConfig(queryClient),
  });
}
