import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseIntegerColumnSchema = z.object({
  type: z.literal('INTEGER'),
  length: z.number().int().min(1).max(11).catch(11).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const IntegerColumnSchema = BaseColumnSchema.merge(BaseIntegerColumnSchema);

export const CreateIntegerColumnSchema = BaseCreateColumnSchema.merge(BaseIntegerColumnSchema);

export const UpdateIntegerColumnSchema = BaseUpdateColumnSchema.merge(BaseIntegerColumnSchema);
