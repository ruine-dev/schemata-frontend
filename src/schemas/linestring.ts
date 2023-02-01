import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

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
