import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseFloatColumnSchema = z.object({
  type: z.literal('FLOAT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const FloatColumnSchema = BaseColumnSchema.merge(BaseFloatColumnSchema);

export const CreateFloatColumnSchema = BaseCreateColumnSchema.merge(BaseFloatColumnSchema);

export const UpdateFloatColumnSchema = BaseUpdateColumnSchema.merge(BaseFloatColumnSchema);
