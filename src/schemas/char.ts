import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseCharColumnSchema = z.object({
  type: z.literal('CHAR'),
  length: z.number().int().min(1).max(255).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const CharColumnSchema = BaseColumnSchema.merge(BaseCharColumnSchema);

export const CreateCharColumnSchema = BaseCreateColumnSchema.merge(BaseCharColumnSchema);

export const UpdateCharColumnSchema = BaseUpdateColumnSchema.merge(BaseCharColumnSchema);


