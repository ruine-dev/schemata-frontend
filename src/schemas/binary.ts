import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBinaryColumnSchema = z.object({
  type: z.enum(['BINARY', 'VARBINARY']),
  length: z.number().int().min(1).max(255).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BinaryColumnSchema = BaseColumnSchema.merge(BaseBinaryColumnSchema);

export const CreateBinaryColumnSchema = BaseCreateColumnSchema.merge(BaseBinaryColumnSchema);

export const UpdateBinaryColumnSchema = BaseUpdateColumnSchema.merge(BaseBinaryColumnSchema);
