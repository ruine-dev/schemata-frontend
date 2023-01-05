import { Canvas } from '@/components/Canvas';
import { EditorStateProvider } from '@/contexts/EditorStateContext';
import { useLocalSchemaQuery } from '@/queries/useSchemaQuery';
import { emptySchemaFactory } from '@/utils/schema';
import { useQueryClient } from '@tanstack/react-query';
import { useMatch } from '@tanstack/react-router';
import localforage from 'localforage';
import { useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';

const starterSchema = emptySchemaFactory();

export function Editor() {
  const queryClient = useQueryClient();
  const { loaderData } = useMatch('/');

  const initialSchema = loaderData.schema ?? starterSchema;

  const { data: schema, isLoading, isSuccess } = useLocalSchemaQuery(initialSchema.id);

  useEffect(() => {
    localforage.clear();

    localforage.setItem(`schema-${initialSchema.id}`, initialSchema);
    queryClient.setQueryData(['schema', initialSchema.id], initialSchema);
  }, []);

  if (isLoading) {
    return 'Loading';
  }

  if (isSuccess) {
    return (
      <ReactFlowProvider>
        <EditorStateProvider schema={schema}>
          <Canvas schema={schema} />
        </EditorStateProvider>
      </ReactFlowProvider>
    );
  }

  throw Error('Failed to load schema');
}
