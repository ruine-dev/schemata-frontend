import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

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
