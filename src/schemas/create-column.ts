import { z } from 'zod';
import { CreateBigIntColumnSchema } from './bigint';
import { CreateBinaryColumnSchema } from './binary';
import { CreateBitColumnSchema } from './bit';
import { CreateBlobColumnSchema } from './blob';
import { CreateBooleanColumnSchema } from './boolean';
import { CreateCharColumnSchema } from './char';
import { CreateDateColumnSchema } from './date';
import { CreateDateTimeColumnSchema } from './datetime';
import { CreateDecimalColumnSchema } from './decimal';
import { CreateDoubleColumnSchema } from './double';
import { CreateEnumColumnSchema } from './enum';
import { CreateFloatColumnSchema } from './float';
import { CreateGeometryColumnSchema } from './geometry';
import { CreateGeometryCollectionColumnSchema } from './geometrycollection';
import { CreateIntegerColumnSchema } from './integer';
import { CreateJsonColumnSchema } from './json';
import { CreateLineStringColumnSchema } from './linestring';
import { CreateLongBlobColumnSchema } from './longblob';
import { CreateMediumBlobColumnSchema } from './mediumblob';
import { CreateMediumIntColumnSchema } from './mediumint';
import { CreateMultiLineStringColumnSchema } from './multilinestring';
import { CreateMultiPointColumnSchema } from './multipoint';
import { CreateMultiPolygonColumnSchema } from './multipolygon';
import { CreatePointColumnSchema } from './point';
import { CreatePolygonColumnSchema } from './polygon';
import { CreateSetColumnSchema } from './set';
import { CreateSmallIntColumnSchema } from './smallint';
import { CreateTimeColumnSchema } from './time';
import { CreateTimestampColumnSchema } from './timestamp';
import { CreateTinyBlobColumnSchema } from './tinyblob';
import { CreateTinyIntColumnSchema } from './tinyint';
import { CreateVarcharColumnSchema } from './varchar';
import { CreateYearColumnSchema } from './year';

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
