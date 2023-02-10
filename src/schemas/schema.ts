import { z } from 'zod';
import { GroupSchema } from './group';
import { PositionSchema } from './position';
import { RelationSchema } from './relation';
import { TableSchema } from './table';

export const SchemaSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().max(64),
  vendor: z.enum(['MYSQL:8.0']),
  tables: TableSchema.array(),
  groups: GroupSchema.array(),
  positions: PositionSchema.array(),
  relations: RelationSchema.array(),
});

export type SchemaType = z.infer<typeof SchemaSchema>;
