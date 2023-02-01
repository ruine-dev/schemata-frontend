import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseDecimalColumnSchema = z.object({
  type: z.literal('DECIMAL'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const DecimalColumnSchema = BaseColumnSchema.merge(BaseDecimalColumnSchema);

export const CreateDecimalColumnSchema = BaseCreateColumnSchema.merge(BaseDecimalColumnSchema);

export const UpdateDecimalColumnSchema = BaseUpdateColumnSchema.merge(BaseDecimalColumnSchema);
