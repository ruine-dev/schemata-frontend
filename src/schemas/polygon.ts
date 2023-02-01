import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BasePolygonColumnSchema = z.object({
  type: z.literal('POLYGON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const PolygonColumnSchema = BaseColumnSchema.merge(BasePolygonColumnSchema);

export const CreatePolygonColumnSchema = BaseCreateColumnSchema.merge(BasePolygonColumnSchema);

export const UpdatePolygonColumnSchema = BaseUpdateColumnSchema.merge(BasePolygonColumnSchema);
