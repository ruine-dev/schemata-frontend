import { z } from 'zod';
import { BigIntColumnSchema } from './bigint';
import { BinaryColumnSchema } from './binary';
import { BitColumnSchema } from './bit';
import { BlobColumnSchema } from './blob';
import { BooleanColumnSchema } from './boolean';
import { CharColumnSchema } from './char';
import { DateColumnSchema } from './date';
import { DateTimeColumnSchema } from './datetime';
import { DecimalColumnSchema } from './decimal';
import { DoubleColumnSchema } from './double';
import { EnumColumnSchema } from './enum';
import { FloatColumnSchema } from './float';
import { GeometryColumnSchema } from './geometry';
import { GeometryCollectionColumnSchema } from './geometrycollection';
import { IntegerColumnSchema } from './integer';
import { JsonColumnSchema } from './json';
import { LineStringColumnSchema } from './linestring';
import { LongBlobColumnSchema } from './longblob';
import { MediumBlobColumnSchema } from './mediumblob';
import { MediumIntColumnSchema } from './mediumint';
import { MultiLineStringColumnSchema } from './multilinestring';
import { MultiPointColumnSchema } from './multipoint';
import { MultiPolygonColumnSchema } from './multipolygon';
import { PointColumnSchema } from './point';
import { PolygonColumnSchema } from './polygon';
import { SetColumnSchema } from './set';
import { SmallIntColumnSchema } from './smallint';
import { TimeColumnSchema } from './time';
import { TimestampColumnSchema } from './timestamp';
import { TinyBlobColumnSchema } from './tinyblob';
import { TinyIntColumnSchema } from './tinyint';
import { VarcharColumnSchema } from './varchar';
import { YearColumnSchema } from './year';

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
