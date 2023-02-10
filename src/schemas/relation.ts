import { Edge } from 'reactflow';
import { z } from 'zod';
import { ColumnType } from './column';

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

export type EdgeType = {
  name: RelationType['name'];
  sourceColumnId: ColumnType['id'];
  targetColumnId: ColumnType['id'];
  actions: RelationType['actions'];
};

export type RelationEdgeType = Edge<EdgeType>;
