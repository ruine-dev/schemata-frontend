import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDateTimeColumnSchema = z.object({
  type: z.literal('DATETIME'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DateTimeColumnSchema = BaseColumnSchema.merge(BaseDateTimeColumnSchema);

export const CreateDateTimeColumnSchema = BaseCreateColumnSchema.merge(BaseDateTimeColumnSchema);

export const UpdateDateTimeColumnSchema = BaseUpdateColumnSchema.merge(BaseDateTimeColumnSchema);
