import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseGeometryColumnSchema = z.object({
  type: z.literal('GEOMETRY'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const GeometryColumnSchema = BaseColumnSchema.merge(BaseGeometryColumnSchema);

export const CreateGeometryColumnSchema = BaseCreateColumnSchema.merge(BaseGeometryColumnSchema);

export const UpdateGeometryColumnSchema = BaseUpdateColumnSchema.merge(BaseGeometryColumnSchema);
