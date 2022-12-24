import { z } from 'zod';

export const TableColumnTypeEnum = z.enum([
  'varchar',
  'int',
  'date',
  'datetime',
  'enum',
  'timestamp',
  'boolean',
  'json',
  'set',
  'text',
]);

export type TableColumnType = z.infer<typeof TableColumnTypeEnum>;

export const TableColumnSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .trim()
    .max(128, { message: 'Maximum length is 128 characters' })
    .regex(/^$|^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: 'Please enter valid column name' }),
  type: TableColumnTypeEnum,
  isPrimaryKey: z.boolean(),
});

export type TableColumnProps = z.infer<typeof TableColumnSchema>;

export const TableSchema = z.object({
  name: z.string().trim().max(64, { message: 'Maximum length is 64 characters' }),
  columns: TableColumnSchema.array(),
});

export type TableProps = z.infer<typeof TableSchema>;

export const TableWithIdSchema = TableSchema.extend({
  id: z.string().uuid(),
});

export type TableWithIdProps = z.infer<typeof TableWithIdSchema>;

export const TableNodeSchema = z.object({
  id: z.string().uuid(),
  data: TableSchema,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
});

export type TableNodeProps = z.infer<typeof TableNodeSchema>;
