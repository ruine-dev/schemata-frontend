import { z } from 'zod';
import { TableSchema } from './table';

export const DatabaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  vendor: z.string(),
  tables: TableSchema.array(),
});

export type DatabaseProps = z.infer<typeof DatabaseSchema>;
