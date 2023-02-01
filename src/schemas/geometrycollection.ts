import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

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
