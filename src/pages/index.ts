import { SchemaType } from '@/schemas/base';
import { base64UrlToSchema } from '@/utils/schema';
import { QueryClient } from '@tanstack/react-query';
import { createRouteConfig, createReactRouter } from '@tanstack/react-router';
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

        const schema: SchemaType | null = base64Schema ? base64UrlToSchema(base64Schema) : null;

        return {
          schema,
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
