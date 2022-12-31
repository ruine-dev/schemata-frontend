import { fetchLocalSchema, localSchemaQuery } from '@/queries/useSchemaQuery';
import { SchemaType } from '@/schemas/base';
import { base64UrlToSchema, emptySchemaFactory } from '@/utils/schema';
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

        const database: SchemaType = base64Schema
          ? base64UrlToSchema(base64Schema)
          : emptySchemaFactory();

        await localforage.setItem<SchemaType>('schema', database);

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
