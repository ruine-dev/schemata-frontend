import { Canvas } from '@/components/Canvas';
import { emtpyDatabaseFactory } from '@/utils/database';

export function EmptyEditor() {
  const emptyDatabase = emtpyDatabaseFactory();

  return <Canvas database={emptyDatabase} />;
}
