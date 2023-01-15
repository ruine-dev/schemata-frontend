import { z } from 'zod';
import { Edge, Node } from 'reactflow';
import { uniqueArrayElement } from '@/utils/zod';

export const ColumnTypeEnum = z.enum([
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

export const ColumnTypeWithValuesEnum = z.enum(['ENUM', 'SET']);

export const ColumnTypeWithLengthEnum = z.enum([
  'CHAR',
  'VARCHAR',
  'BINARY',
  'TINYBLOB',
  'TINYTEXT',
  'BLOB',
  'TEXT',
  'MEDIUMBLOB',
  'MEDIUMTEXT',
  'LONGBLOB',
  'LONGTEXT',
  'TINYINT',
  'MEDIUMINT',
  'INTEGER',
  'BIGINT',
]);

export const IndexSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['INDEX', 'PRIMARY_KEY', 'UNIQUE_INDEX']),
  columns: z.array(z.string().uuid()),
});

export type IndexType = z.infer<typeof IndexSchema>;

export const RelationActionEnum = z.enum(['CASCADE', 'RESTRICT', 'SET_NULL', 'NO_ACTION']);

export const RelationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  source: z.object({
    columnId: z.string().uuid(),
    tableId: z.string().uuid(),
  }),
  target: z.object({
    columnId: z.string().uuid(),
    tableId: z.string().uuid(),
  }),
  actions: z.object({
    onDelete: RelationActionEnum,
    onUpdate: RelationActionEnum,
  }),
});

export type RelationType = z.infer<typeof RelationSchema>;

export const CreateRelationSchema = RelationSchema.omit({ id: true });

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

export const BaseCharColumnSchema = z.object({
  type: z.literal('CHAR'),
  length: z.number().int().min(1).max(255).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const CharColumnSchema = BaseColumnSchema.merge(BaseCharColumnSchema);

export const CreateCharColumnSchema = BaseCreateColumnSchema.merge(BaseCharColumnSchema);

export const UpdateCharColumnSchema = BaseUpdateColumnSchema.merge(BaseCharColumnSchema);

export const BaseVarcharColumnSchema = z.object({
  type: z.literal('VARCHAR'),
  length: z.number().int().min(1).max(65535).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const VarcharColumnSchema = BaseColumnSchema.merge(BaseVarcharColumnSchema);

export type VarcharColumnType = z.infer<typeof VarcharColumnSchema>;

export const CreateVarcharColumnSchema = BaseCreateColumnSchema.merge(BaseVarcharColumnSchema);

export const UpdateVarcharColumnSchema = BaseUpdateColumnSchema.merge(BaseVarcharColumnSchema);

export const BaseBinaryColumnSchema = z.object({
  type: z.enum(['BINARY', 'VARBINARY']),
  length: z.number().int().min(1).max(255).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BinaryColumnSchema = BaseColumnSchema.merge(BaseBinaryColumnSchema);

export const CreateBinaryColumnSchema = BaseCreateColumnSchema.merge(BaseBinaryColumnSchema);

export const UpdateBinaryColumnSchema = BaseUpdateColumnSchema.merge(BaseBinaryColumnSchema);

export const BaseTinyBlobColumnSchema = z.object({
  type: z.enum(['TINYBLOB', 'TINYTEXT']),
  length: z.number().int().min(1).max(255).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TinyBlobColumnSchema = BaseColumnSchema.merge(BaseTinyBlobColumnSchema);

export const CreateTinyBlobColumnSchema = BaseCreateColumnSchema.merge(BaseTinyBlobColumnSchema);

export const UpdateTinyBlobColumnSchema = BaseUpdateColumnSchema.merge(BaseTinyBlobColumnSchema);

export const BaseBlobColumnSchema = z.object({
  type: z.enum(['BLOB', 'TEXT']),
  length: z.number().int().min(1).max(65536).catch(65536).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BlobColumnSchema = BaseColumnSchema.merge(BaseBlobColumnSchema);

export const CreateBlobColumnSchema = BaseCreateColumnSchema.merge(BaseBlobColumnSchema);

export const UpdateBlobColumnSchema = BaseUpdateColumnSchema.merge(BaseBlobColumnSchema);

export const BaseMediumBlobColumnSchema = z.object({
  type: z.enum(['MEDIUMBLOB', 'MEDIUMTEXT']),
  length: z.number().int().min(1).max(16777216).catch(16777216).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MediumBlobColumnSchema = BaseColumnSchema.merge(BaseMediumBlobColumnSchema);

export const CreateMediumBlobColumnSchema = BaseCreateColumnSchema.merge(
  BaseMediumBlobColumnSchema,
);

export const UpdateMediumBlobColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMediumBlobColumnSchema,
);

export const BaseLongBlobColumnSchema = z.object({
  type: z.enum(['LONGBLOB', 'LONGTEXT']),
  length: z.number().int().min(1).max(4294967296).catch(4294967296).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const LongBlobColumnSchema = BaseColumnSchema.merge(BaseLongBlobColumnSchema);

export const CreateLongBlobColumnSchema = BaseCreateColumnSchema.merge(BaseLongBlobColumnSchema);

export const UpdateLongBlobColumnSchema = BaseUpdateColumnSchema.merge(BaseLongBlobColumnSchema);

export const BaseEnumColumnSchema = z.object({
  type: z.literal('ENUM'),
  values: uniqueArrayElement(z.string().array().nonempty()),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const EnumColumnSchema = BaseColumnSchema.merge(BaseEnumColumnSchema);

export const CreateEnumColumnSchema = BaseCreateColumnSchema.merge(BaseEnumColumnSchema);

export const UpdateEnumColumnSchema = BaseUpdateColumnSchema.merge(BaseEnumColumnSchema);

export const BaseSetColumnSchema = z.object({
  type: z.literal('SET'),
  values: uniqueArrayElement(z.string().array().nonempty()),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const SetColumnSchema = BaseColumnSchema.merge(BaseSetColumnSchema);

export const CreateSetColumnSchema = BaseCreateColumnSchema.merge(BaseSetColumnSchema);

export const UpdateSetColumnSchema = BaseUpdateColumnSchema.merge(BaseSetColumnSchema);

export const BaseBitColumnSchema = z.object({
  type: z.literal('BIT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BitColumnSchema = BaseColumnSchema.merge(BaseBitColumnSchema);

export const CreateBitColumnSchema = BaseCreateColumnSchema.merge(BaseBitColumnSchema);

export const UpdateBitColumnSchema = BaseUpdateColumnSchema.merge(BaseBitColumnSchema);

export const BaseBooleanColumnSchema = z.object({
  type: z.literal('BOOLEAN'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BooleanColumnSchema = BaseColumnSchema.merge(BaseBooleanColumnSchema);

export const CreateBooleanColumnSchema = BaseCreateColumnSchema.merge(BaseBooleanColumnSchema);

export const UpdateBooleanColumnSchema = BaseUpdateColumnSchema.merge(BaseBooleanColumnSchema);

export const BaseTinyIntColumnSchema = z.object({
  type: z.literal('TINYINT'),
  length: z.number().int().min(1).max(4).catch(4).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TinyIntColumnSchema = BaseColumnSchema.merge(BaseTinyIntColumnSchema);

export const CreateTinyIntColumnSchema = BaseCreateColumnSchema.merge(BaseTinyIntColumnSchema);

export const UpdateTinyIntColumnSchema = BaseUpdateColumnSchema.merge(BaseTinyIntColumnSchema);

export const BaseSmallIntColumnSchema = z.object({
  type: z.literal('SMALLINT'),
  length: z.number().int().min(1).max(5).catch(5).optional(),
  attributes: uniqueArrayElement(z.union([BaseColumnAttributeEnum, SignabilityAttribute]).array()),
});

export const SmallIntColumnSchema = BaseColumnSchema.merge(BaseSmallIntColumnSchema);

export const CreateSmallIntColumnSchema = BaseCreateColumnSchema.merge(BaseSmallIntColumnSchema);

export const UpdateSmallIntColumnSchema = BaseUpdateColumnSchema.merge(BaseSmallIntColumnSchema);

export const BaseMediumIntColumnSchema = z.object({
  type: z.literal('MEDIUMINT'),
  length: z.number().int().min(1).max(9).catch(9).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MediumIntColumnSchema = BaseColumnSchema.merge(BaseMediumIntColumnSchema);

export const CreateMediumIntColumnSchema = BaseCreateColumnSchema.merge(BaseMediumIntColumnSchema);

export const UpdateMediumIntColumnSchema = BaseUpdateColumnSchema.merge(BaseMediumIntColumnSchema);

export const BaseIntegerColumnSchema = z.object({
  type: z.literal('INTEGER'),
  length: z.number().int().min(1).max(11).catch(11).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const IntegerColumnSchema = BaseColumnSchema.merge(BaseIntegerColumnSchema);

export const CreateIntegerColumnSchema = BaseCreateColumnSchema.merge(BaseIntegerColumnSchema);

export const UpdateIntegerColumnSchema = BaseUpdateColumnSchema.merge(BaseIntegerColumnSchema);

export const BaseBigIntColumnSchema = z.object({
  type: z.literal('BIGINT'),
  length: z.number().int().min(1).max(20).catch(20).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BigIntColumnSchema = BaseColumnSchema.merge(BaseBigIntColumnSchema);

export const CreateBigIntColumnSchema = BaseCreateColumnSchema.merge(BaseBigIntColumnSchema);

export const UpdateBigIntColumnSchema = BaseUpdateColumnSchema.merge(BaseBigIntColumnSchema);

export const BaseFloatColumnSchema = z.object({
  type: z.literal('FLOAT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const FloatColumnSchema = BaseColumnSchema.merge(BaseFloatColumnSchema);

export const CreateFloatColumnSchema = BaseCreateColumnSchema.merge(BaseFloatColumnSchema);

export const UpdateFloatColumnSchema = BaseUpdateColumnSchema.merge(BaseFloatColumnSchema);

export const BaseDoubleColumnSchema = z.object({
  type: z.literal('DOUBLE'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DoubleColumnSchema = BaseColumnSchema.merge(BaseDoubleColumnSchema);

export const CreateDoubleColumnSchema = BaseCreateColumnSchema.merge(BaseDoubleColumnSchema);

export const UpdateDoubleColumnSchema = BaseUpdateColumnSchema.merge(BaseDoubleColumnSchema);

export const BaseDecimalColumnSchema = z.object({
  type: z.literal('DECIMAL'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DecimalColumnSchema = BaseColumnSchema.merge(BaseDecimalColumnSchema);

export const CreateDecimalColumnSchema = BaseCreateColumnSchema.merge(BaseDecimalColumnSchema);

export const UpdateDecimalColumnSchema = BaseUpdateColumnSchema.merge(BaseDecimalColumnSchema);

export const BaseDateTimeColumnSchema = z.object({
  type: z.literal('DATETIME'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DateTimeColumnSchema = BaseColumnSchema.merge(BaseDateTimeColumnSchema);

export const CreateDateTimeColumnSchema = BaseCreateColumnSchema.merge(BaseDateTimeColumnSchema);

export const UpdateDateTimeColumnSchema = BaseUpdateColumnSchema.merge(BaseDateTimeColumnSchema);

export const BaseDateColumnSchema = z.object({
  type: z.literal('DATE'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DateColumnSchema = BaseColumnSchema.merge(BaseDateColumnSchema);

export const CreateDateColumnSchema = BaseCreateColumnSchema.merge(BaseDateColumnSchema);

export const UpdateDateColumnSchema = BaseUpdateColumnSchema.merge(BaseDateColumnSchema);

export const BaseTimestampColumnSchema = z.object({
  type: z.literal('TIMESTAMP'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TimestampColumnSchema = BaseColumnSchema.merge(BaseTimestampColumnSchema);

export const CreateTimestampColumnSchema = BaseCreateColumnSchema.merge(BaseTimestampColumnSchema);

export const UpdateTimestampColumnSchema = BaseUpdateColumnSchema.merge(BaseTimestampColumnSchema);

export const BaseTimeColumnSchema = z.object({
  type: z.literal('TIME'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TimeColumnSchema = BaseColumnSchema.merge(BaseTimeColumnSchema);

export const CreateTimeColumnSchema = BaseCreateColumnSchema.merge(BaseTimeColumnSchema);

export const UpdateTimeColumnSchema = BaseUpdateColumnSchema.merge(BaseTimeColumnSchema);

export const BaseYearColumnSchema = z.object({
  type: z.literal('YEAR'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const YearColumnSchema = BaseColumnSchema.merge(BaseYearColumnSchema);

export const CreateYearColumnSchema = BaseCreateColumnSchema.merge(BaseYearColumnSchema);

export const UpdateYearColumnSchema = BaseUpdateColumnSchema.merge(BaseYearColumnSchema);

export const BaseGeometryColumnSchema = z.object({
  type: z.literal('GEOMETRY'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const GeometryColumnSchema = BaseColumnSchema.merge(BaseGeometryColumnSchema);

export const CreateGeometryColumnSchema = BaseCreateColumnSchema.merge(BaseGeometryColumnSchema);

export const UpdateGeometryColumnSchema = BaseUpdateColumnSchema.merge(BaseGeometryColumnSchema);

export const BasePointColumnSchema = z.object({
  type: z.literal('POINT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const PointColumnSchema = BaseColumnSchema.merge(BasePointColumnSchema);

export const CreatePointColumnSchema = BaseCreateColumnSchema.merge(BasePointColumnSchema);

export const UpdatePointColumnSchema = BaseUpdateColumnSchema.merge(BasePointColumnSchema);

export const BaseLineStringColumnSchema = z.object({
  type: z.literal('LINESTRING'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const LineStringColumnSchema = BaseColumnSchema.merge(BaseLineStringColumnSchema);

export const CreateLineStringColumnSchema = BaseCreateColumnSchema.merge(
  BaseLineStringColumnSchema,
);

export const UpdateLineStringColumnSchema = BaseUpdateColumnSchema.merge(
  BaseLineStringColumnSchema,
);

export const BasePolygonColumnSchema = z.object({
  type: z.literal('POLYGON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const PolygonColumnSchema = BaseColumnSchema.merge(BasePolygonColumnSchema);

export const CreatePolygonColumnSchema = BaseCreateColumnSchema.merge(BasePolygonColumnSchema);

export const UpdatePolygonColumnSchema = BaseUpdateColumnSchema.merge(BasePolygonColumnSchema);

export const BaseMultiPointColumnSchema = z.object({
  type: z.literal('MULTIPOINT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiPointColumnSchema = BaseColumnSchema.merge(BaseMultiPointColumnSchema);

export const CreateMultiPointColumnSchema = BaseCreateColumnSchema.merge(
  BaseMultiPointColumnSchema,
);

export const UpdateMultiPointColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMultiPointColumnSchema,
);

export const BaseMultiLineStringColumnSchema = z.object({
  type: z.literal('MULTILINESTRING'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiLineStringColumnSchema = BaseColumnSchema.merge(BaseMultiLineStringColumnSchema);

export const CreateMultiLineStringColumnSchema = BaseCreateColumnSchema.merge(
  BaseMultiLineStringColumnSchema,
);

export const UpdateMultiLineStringColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMultiLineStringColumnSchema,
);

export const BaseMultiPolygonColumnSchema = z.object({
  type: z.literal('MULTIPOLYGON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiPolygonColumnSchema = BaseColumnSchema.merge(BaseMultiPolygonColumnSchema);

export const CreateMultiPolygonColumnSchema = BaseCreateColumnSchema.merge(
  BaseMultiPolygonColumnSchema,
);

export const UpdateMultiPolygonColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMultiPolygonColumnSchema,
);

export const BaseGeometryCollectionColumnSchema = z.object({
  type: z.literal('GEOMETRYCOLLECTION'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const GeometryCollectionColumnSchema = BaseColumnSchema.merge(
  BaseGeometryCollectionColumnSchema,
);

export const CreateGeometryCollectionColumnSchema = BaseCreateColumnSchema.merge(
  BaseGeometryCollectionColumnSchema,
);

export const UpdateGeometryCollectionColumnSchema = BaseUpdateColumnSchema.merge(
  BaseGeometryCollectionColumnSchema,
);

export const BaseJsonColumnSchema = z.object({
  type: z.literal('JSON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const JsonColumnSchema = BaseColumnSchema.merge(BaseJsonColumnSchema);

export const CreateJsonColumnSchema = BaseCreateColumnSchema.merge(BaseJsonColumnSchema);

export const UpdateJsonColumnSchema = BaseUpdateColumnSchema.merge(BaseJsonColumnSchema);

export const ColumnSchema = z.discriminatedUnion('type', [
  CharColumnSchema,
  VarcharColumnSchema,
  BinaryColumnSchema,
  TinyBlobColumnSchema,
  BlobColumnSchema,
  MediumBlobColumnSchema,
  LongBlobColumnSchema,
  EnumColumnSchema,
  SetColumnSchema,
  BitColumnSchema,
  BooleanColumnSchema,
  TinyIntColumnSchema,
  SmallIntColumnSchema,
  MediumIntColumnSchema,
  IntegerColumnSchema,
  BigIntColumnSchema,
  FloatColumnSchema,
  DoubleColumnSchema,
  DecimalColumnSchema,
  DateTimeColumnSchema,
  DateColumnSchema,
  TimestampColumnSchema,
  TimeColumnSchema,
  YearColumnSchema,
  GeometryColumnSchema,
  LineStringColumnSchema,
  PointColumnSchema,
  PolygonColumnSchema,
  MultiPointColumnSchema,
  MultiLineStringColumnSchema,
  MultiPolygonColumnSchema,
  GeometryCollectionColumnSchema,
  JsonColumnSchema,
]);

export type ColumnType = z.infer<typeof ColumnSchema>;

export const CreateColumnSchema = z.discriminatedUnion('type', [
  CreateCharColumnSchema,
  CreateVarcharColumnSchema,
  CreateBinaryColumnSchema,
  CreateTinyBlobColumnSchema,
  CreateBlobColumnSchema,
  CreateMediumBlobColumnSchema,
  CreateLongBlobColumnSchema,
  CreateEnumColumnSchema,
  CreateSetColumnSchema,
  CreateBitColumnSchema,
  CreateBooleanColumnSchema,
  CreateTinyIntColumnSchema,
  CreateSmallIntColumnSchema,
  CreateMediumIntColumnSchema,
  CreateIntegerColumnSchema,
  CreateBigIntColumnSchema,
  CreateFloatColumnSchema,
  CreateDoubleColumnSchema,
  CreateDecimalColumnSchema,
  CreateDateTimeColumnSchema,
  CreateDateColumnSchema,
  CreateTimestampColumnSchema,
  CreateTimeColumnSchema,
  CreateYearColumnSchema,
  CreateGeometryColumnSchema,
  CreateLineStringColumnSchema,
  CreatePointColumnSchema,
  CreatePolygonColumnSchema,
  CreateMultiPointColumnSchema,
  CreateMultiLineStringColumnSchema,
  CreateMultiPolygonColumnSchema,
  CreateGeometryCollectionColumnSchema,
  CreateJsonColumnSchema,
]);

export type CreateColumnType = z.infer<typeof CreateColumnSchema>;

export const UpdateColumnSchema = z.discriminatedUnion('type', [
  UpdateCharColumnSchema,
  UpdateVarcharColumnSchema,
  UpdateBinaryColumnSchema,
  UpdateTinyBlobColumnSchema,
  UpdateBlobColumnSchema,
  UpdateMediumBlobColumnSchema,
  UpdateLongBlobColumnSchema,
  UpdateEnumColumnSchema,
  UpdateSetColumnSchema,
  UpdateBitColumnSchema,
  UpdateBooleanColumnSchema,
  UpdateTinyIntColumnSchema,
  UpdateSmallIntColumnSchema,
  UpdateMediumIntColumnSchema,
  UpdateIntegerColumnSchema,
  UpdateBigIntColumnSchema,
  UpdateFloatColumnSchema,
  UpdateDoubleColumnSchema,
  UpdateDecimalColumnSchema,
  UpdateDateTimeColumnSchema,
  UpdateDateColumnSchema,
  UpdateTimestampColumnSchema,
  UpdateTimeColumnSchema,
  UpdateYearColumnSchema,
  UpdateGeometryColumnSchema,
  UpdateLineStringColumnSchema,
  UpdatePointColumnSchema,
  UpdatePolygonColumnSchema,
  UpdateMultiPointColumnSchema,
  UpdateMultiLineStringColumnSchema,
  UpdateMultiPolygonColumnSchema,
  UpdateGeometryCollectionColumnSchema,
  UpdateJsonColumnSchema,
]);

export type UpdateColumnType = z.infer<typeof UpdateColumnSchema>;

export const DeleteColumnSchema = BaseColumnSchema.pick({ id: true }).extend({
  tableId: z.string().uuid(),
});

export type DeleteColumnType = z.infer<typeof DeleteColumnSchema>;

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

export type EdgeType = { sourceColumnId: ColumnType['id']; targetColumnId: ColumnType['id'] };
