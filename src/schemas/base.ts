import { z } from 'zod';

export const IndexSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['INDEX', 'PRIMARY_KEY', 'UNIQUE_INDEX']),
  columns: z.array(z.string().uuid()),
});

export type IndexType = z.infer<typeof IndexSchema>;

export const VisibilityAttribute = z.union([z.literal('INVISIBLE'), z.literal('VISIBLE')]);
export const NullabilityAttribute = z.union([z.literal('NULLABLE'), z.literal('NOT_NULL')]);
export const SignabilityAttribute = z.union([z.literal('UNSIGNED'), z.literal('SIGNED')]);

export const BaseColumnAttributeEnum = z.union([VisibilityAttribute, NullabilityAttribute]);

export const BaseColumnSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().max(64),
  default: z.string().optional(),
  index: z.number().int(),
});

export const BaseCreateColumnSchema = BaseColumnSchema.omit({ id: true, index: true }).extend({
  index: z.number().int().optional(),
  tableId: z.string().uuid(),
});

export const BaseUpdateColumnSchema = BaseColumnSchema.extend({
  isPrimaryKey: z.boolean(),
  isUniqueIndex: z.boolean(),
  tableId: z.string().uuid(),
});
