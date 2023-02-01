import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBooleanColumnSchema = z.object({
  type: z.literal('BOOLEAN'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BooleanColumnSchema = BaseColumnSchema.merge(BaseBooleanColumnSchema);

export const CreateBooleanColumnSchema = BaseCreateColumnSchema.merge(BaseBooleanColumnSchema);

export const UpdateBooleanColumnSchema = BaseUpdateColumnSchema.merge(BaseBooleanColumnSchema);
