import { Canvas } from '@/components/Canvas';
import { useDatabaseQuery } from '@/queries/useDatabaseQuery';
import { useParams } from '@tanstack/react-router';

export function Editor() {
  const { databaseId } = useParams();

  const { data: database, isLoading, isSuccess } = useDatabaseQuery(databaseId);

  if (isLoading) {
    return 'Loading';
  }

  if (isSuccess) {
    return <Canvas database={database} />;
  }
}
