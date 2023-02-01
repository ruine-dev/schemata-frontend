import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDoubleColumnSchema = z.object({
  type: z.literal('DOUBLE'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DoubleColumnSchema = BaseColumnSchema.merge(BaseDoubleColumnSchema);

export const CreateDoubleColumnSchema = BaseCreateColumnSchema.merge(BaseDoubleColumnSchema);

export const UpdateDoubleColumnSchema = BaseUpdateColumnSchema.merge(BaseDoubleColumnSchema);
