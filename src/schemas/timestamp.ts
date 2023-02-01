import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTimestampColumnSchema = z.object({
  type: z.literal('TIMESTAMP'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TimestampColumnSchema = BaseColumnSchema.merge(BaseTimestampColumnSchema);

export const CreateTimestampColumnSchema = BaseCreateColumnSchema.merge(BaseTimestampColumnSchema);

export const UpdateTimestampColumnSchema = BaseUpdateColumnSchema.merge(BaseTimestampColumnSchema);
