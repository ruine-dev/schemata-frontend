import { z } from 'zod';
import { Edge } from 'reactflow';
import { ColumnType } from './column';
import { TableSchema } from './table';

export const IndexSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['INDEX', 'PRIMARY_KEY', 'UNIQUE_INDEX']),
  columns: z.array(z.string().uuid()),
});

export type IndexType = z.infer<typeof IndexSchema>;

export const RelationActionEnum = z.enum(['CASCADE', 'RESTRICT', 'SET_NULL', 'NO_ACTION']);

export const RelationSchema = z.object({
  id: z.string().uuid(),
  // catch for backward compat
  name: z.string().catch('fk'),
  source: z.object({
    columnId: z.string().uuid(),
    tableId: z.string().uuid(),
  }),
  target: z.object({
    columnId: z.string().uuid(),
    tableId: z.string().uuid(),
  }),
  // catch for backward compat
  actions: z
    .object({
      onDelete: RelationActionEnum,
      onUpdate: RelationActionEnum,
    })
    .catch({
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    }),
});

export type RelationType = z.infer<typeof RelationSchema>;

export const CreateRelationSchema = RelationSchema.omit({
  id: true,
});

export type CreateRelationType = z.infer<typeof CreateRelationSchema>;

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

export type RelationEdgeType = Edge<EdgeType>;

export const GroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  color: z.object({
    background: z.string(),
    border: z.string(),
  }),
});

export const PositionSchema = z.object({
  itemId: z.string().uuid(),
  groupId: z.string().uuid().optional(),
  x: z.number(),
  y: z.number(),
});

export type PositionType = z.infer<typeof PositionSchema>;

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

export type EdgeType = {
  name: RelationType['name'];
  sourceColumnId: ColumnType['id'];
  targetColumnId: ColumnType['id'];
  actions: RelationType['actions'];
};
