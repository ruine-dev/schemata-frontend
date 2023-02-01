import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseLongBlobColumnSchema = z.object({
  type: z.enum(['LONGBLOB', 'LONGTEXT']),
  length: z.number().int().min(1).max(4294967296).catch(4294967296).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const LongBlobColumnSchema = BaseColumnSchema.merge(BaseLongBlobColumnSchema);

export const CreateLongBlobColumnSchema = BaseCreateColumnSchema.merge(BaseLongBlobColumnSchema);

export const UpdateLongBlobColumnSchema = BaseUpdateColumnSchema.merge(BaseLongBlobColumnSchema);
