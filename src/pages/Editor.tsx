import { Canvas } from '@/components/Canvas';
import { useLocalSchemaQuery } from '@/queries/useSchemaQuery';

export function Editor() {
  const { data: schema, isLoading, isSuccess } = useLocalSchemaQuery();

  if (isLoading) {
    return 'Loading';
  }

  if (isSuccess) {
    return <Canvas schema={schema} />;
  }

  throw Error('Failed to load database');
}
