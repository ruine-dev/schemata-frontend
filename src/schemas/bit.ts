import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBitColumnSchema = z.object({
  type: z.literal('BIT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BitColumnSchema = BaseColumnSchema.merge(BaseBitColumnSchema);

export const CreateBitColumnSchema = BaseCreateColumnSchema.merge(BaseBitColumnSchema);

export const UpdateBitColumnSchema = BaseUpdateColumnSchema.merge(BaseBitColumnSchema);
