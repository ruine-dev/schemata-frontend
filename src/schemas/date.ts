import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDateColumnSchema = z.object({
  type: z.literal('DATE'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DateColumnSchema = BaseColumnSchema.merge(BaseDateColumnSchema);

export const CreateDateColumnSchema = BaseCreateColumnSchema.merge(BaseDateColumnSchema);

export const UpdateDateColumnSchema = BaseUpdateColumnSchema.merge(BaseDateColumnSchema);
