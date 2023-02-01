import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTimeColumnSchema = z.object({
  type: z.literal('TIME'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TimeColumnSchema = BaseColumnSchema.merge(BaseTimeColumnSchema);

export const CreateTimeColumnSchema = BaseCreateColumnSchema.merge(BaseTimeColumnSchema);

export const UpdateTimeColumnSchema = BaseUpdateColumnSchema.merge(BaseTimeColumnSchema);
