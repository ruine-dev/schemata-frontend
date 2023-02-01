import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseTinyIntColumnSchema = z.object({
  type: z.literal('TINYINT'),
  length: z.number().int().min(1).max(4).catch(4).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const TinyIntColumnSchema = BaseColumnSchema.merge(BaseTinyIntColumnSchema);

export const CreateTinyIntColumnSchema = BaseCreateColumnSchema.merge(BaseTinyIntColumnSchema);

export const UpdateTinyIntColumnSchema = BaseUpdateColumnSchema.merge(BaseTinyIntColumnSchema);
