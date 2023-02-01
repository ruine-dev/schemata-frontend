import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseBlobColumnSchema = z.object({
  type: z.enum(['BLOB', 'TEXT']),
  length: z.number().int().min(1).max(65536).catch(65536).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const BlobColumnSchema = BaseColumnSchema.merge(BaseBlobColumnSchema);

export const CreateBlobColumnSchema = BaseCreateColumnSchema.merge(BaseBlobColumnSchema);

export const UpdateBlobColumnSchema = BaseUpdateColumnSchema.merge(BaseBlobColumnSchema);
