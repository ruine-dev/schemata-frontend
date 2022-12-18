import { z } from 'zod';
import { TableNodeSchema } from './table';

export const DatabaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tables: TableNodeSchema.array(),
});

export type DatabaseProps = z.infer<typeof DatabaseSchema>;
