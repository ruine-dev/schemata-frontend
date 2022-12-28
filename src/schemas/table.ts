import { z } from 'zod';

export const TableColumnTypeEnum = z.enum([
  // String
  'CHAR',
  'VARCHAR',
  'BINARY',
  'VARBINARY',
  'TINYBLOB',
  'TINYTEXT',
  'TEXT',
  'BLOB',
  'MEDIUMTEXT',
  'MEDIUMBLOB',
  'LONGTEXT',
  'LONGBLOB',
  'ENUM',
  'SET',
  // Numeric
  'BIT',
  'TINYINT',
  'BOOLEAN',
  'SMALLINT',
  'MEDIUMINT',
  'INTEGER',
  'BIGINT',
  'FLOAT',
  'DOUBLE',
  'DOUBLE PRECISION',
  'DECIMAL',
  // Date and time
  'DATETIME',
  'DATE',
  'TIMESTAMP',
  'TIME',
  'YEAR',
  // Spatial
  'GEOMETRY',
  'POINT',
  'LINESTRING',
  'POLYGON',
  'MULTIPOINT',
  'MULTILINESTRING',
  'MULTIPOLYGON',
  'GEOMETRYCOLLECTION',
  'JSON',
]);

export type TableColumnTypeUnion = z.infer<typeof TableColumnTypeEnum>;

export const TableColumnSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .trim()
    .max(128, { message: 'Maximum length is 128 characters' })
    .regex(/^$|^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: 'Please enter valid column name' }),
  type: TableColumnTypeEnum,
  isPrimaryKey: z.boolean(),
  attributes: z.set(z.union([z.literal('UNSIGNED'), z.literal('x')])),
});

export type TableColumnType = z.infer<typeof TableColumnSchema>;

export const TableIndexSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  columns: z.array(z.string().uuid()),
});

export type TableIndexProps = z.infer<typeof TableIndexSchema>;

export const TableRelationSchema = z.object({
  id: z.string().uuid(),
  source: z.object({ columnId: z.string().uuid() }),
  target: z.object({
    tableId: z.string().uuid(),
    columnId: z.string().uuid(),
  }),
});

export type TableRelationProps = z.infer<typeof TableRelationSchema>;

export const TableSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().max(64, { message: 'Maximum length is 64 characters' }),
  columns: TableColumnSchema.array(),
  indexes: TableIndexSchema.array(),
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

export const transformTableNodeToNode = TableNodeSchema.transform((tableNode) => {
  return {
    id: tableNode.id,
    data: tableNode.data,
    type: 'table',
    position: {
      x: tableNode.position.x,
      y: tableNode.position.y,
    },
  };
});

// export const TableRelationSchema = z.object({
//   id: z.string().uuid(),
//   source: z.object({
//     tableId: z.string().uuid(),
//     columnId: z.string().uuid(),
//   }),
//   target: z.object({
//     tableId: z.string().uuid(),
//     columnId: z.string().uuid(),
//   }),
// });

// export type TableRelationProps = z.infer<typeof TableRelationSchema>;

// export const transformTableRelationToEdge = TableRelationSchema.transform((relation) => {
//   return {
//     id: relation.id,
//     type: 'smoothstep',
//     source: relation.source.tableId,
//     target: relation.target.tableId,
//     sourceHandle: relation.source.columnId,
//     targetHandle: relation.target.columnId,
//   };
// });
