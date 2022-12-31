import { Canvas } from '@/components/Canvas';
import { useLocalSchemaQuery } from '@/queries/useSchemaQuery';
import { emptySchemaFactory } from '@/utils/schema';
import { useQueryClient } from '@tanstack/react-query';
import { useMatch } from '@tanstack/react-router';
import localforage from 'localforage';
import { useEffect } from 'react';

const starterSchema = emptySchemaFactory();

export function Editor() {
  const queryClient = useQueryClient();
  const { loaderData } = useMatch('/');

  const {
    data: schema,
    isLoading,
    isSuccess,
  } = useLocalSchemaQuery(loaderData.schema?.id ?? starterSchema.id);

  useEffect(() => {
    localforage.clear();

    localforage.setItem(`schema-${starterSchema.id}`, starterSchema);
    queryClient.setQueryData(['schema', starterSchema.id], starterSchema);
  }, []);

  if (isLoading) {
    return 'Loading';
  }

  if (isSuccess) {
    return <Canvas schema={schema} />;
  }

  throw Error('Failed to load schema');
}
