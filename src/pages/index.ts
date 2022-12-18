import { QueryClient } from '@tanstack/react-query';
import { createRouteConfig, createReactRouter } from '@tanstack/react-router';
import { databaseQuery } from '@/queries/useDatabaseQuery';
import { EmptyEditor } from './EmptyEditor';
import { Editor } from './Editor';

export function router(queryClient: QueryClient) {
  const rootRoute = createRouteConfig();

  return createReactRouter({
    routeConfig: rootRoute.addChildren([
      rootRoute.createRoute({
        path: '/',
        component: EmptyEditor,
      }),
      rootRoute.createRoute({
        path: '$databaseId',
        component: Editor,
        async loader({ params }) {
          const { databaseId } = params;

          const query = databaseQuery(databaseId);

          return {
            database:
              queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query)),
          };
        },
      }),
    ]),
  });
}
