import { Canvas } from '@/components/Canvas';
import { useLocalDatabaseQuery } from '@/queries/useDatabaseQuery';

export function Editor() {
  const { data: database, isLoading, isSuccess } = useLocalDatabaseQuery();

  if (isLoading) {
    return 'Loading';
  }

  if (isSuccess) {
    return <Canvas database={database} />;
  }

  throw Error('Failed to load database');
}
