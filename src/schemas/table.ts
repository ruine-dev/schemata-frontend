import { Node } from 'reactflow';
import { z } from 'zod';
import { IndexSchema } from './base';
import { ColumnSchema } from './column';

export const TableSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().max(64),
  columns: ColumnSchema.array(),
  indexes: IndexSchema.array(),
});

export type TableType = z.infer<typeof TableSchema>;

export const TableWithoutIdSchema = TableSchema.omit({ id: true });

export type TableWithoutIdType = z.infer<typeof TableWithoutIdSchema>;

export const TableWithOptionalIdSchema = TableSchema.extend({ id: z.string().uuid().optional() });

export type TableWithOptionalIdType = z.infer<typeof TableWithOptionalIdSchema>;

export type TableNodeType = Node<TableWithoutIdType>;
