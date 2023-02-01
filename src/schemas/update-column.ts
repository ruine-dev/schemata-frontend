import { z } from 'zod';
import { UpdateBigIntColumnSchema } from './bigint';
import { UpdateBinaryColumnSchema } from './binary';
import { UpdateBitColumnSchema } from './bit';
import { UpdateBlobColumnSchema } from './blob';
import { UpdateBooleanColumnSchema } from './boolean';
import { UpdateCharColumnSchema } from './char';
import { UpdateDateColumnSchema } from './date';
import { UpdateDateTimeColumnSchema } from './datetime';
import { UpdateDecimalColumnSchema } from './decimal';
import { UpdateDoubleColumnSchema } from './double';
import { UpdateEnumColumnSchema } from './enum';
import { UpdateFloatColumnSchema } from './float';
import { UpdateGeometryColumnSchema } from './geometry';
import { UpdateGeometryCollectionColumnSchema } from './geometrycollection';
import { UpdateIntegerColumnSchema } from './integer';
import { UpdateJsonColumnSchema } from './json';
import { UpdateLineStringColumnSchema } from './linestring';
import { UpdateLongBlobColumnSchema } from './longblob';
import { UpdateMediumBlobColumnSchema } from './mediumblob';
import { UpdateMediumIntColumnSchema } from './mediumint';
import { UpdateMultiLineStringColumnSchema } from './multilinestring';
import { UpdateMultiPointColumnSchema } from './multipoint';
import { UpdateMultiPolygonColumnSchema } from './multipolygon';
import { UpdatePointColumnSchema } from './point';
import { UpdatePolygonColumnSchema } from './polygon';
import { UpdateSetColumnSchema } from './set';
import { UpdateSmallIntColumnSchema } from './smallint';
import { UpdateTimeColumnSchema } from './time';
import { UpdateTimestampColumnSchema } from './timestamp';
import { UpdateTinyBlobColumnSchema } from './tinyblob';
import { UpdateTinyIntColumnSchema } from './tinyint';
import { UpdateVarcharColumnSchema } from './varchar';
import { UpdateYearColumnSchema } from './year';

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
