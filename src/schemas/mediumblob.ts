import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMediumBlobColumnSchema = z.object({
  type: z.enum(['MEDIUMBLOB', 'MEDIUMTEXT']),
  length: z.number().int().min(1).max(16777216).catch(16777216).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MediumBlobColumnSchema = BaseColumnSchema.merge(BaseMediumBlobColumnSchema);

export const CreateMediumBlobColumnSchema = BaseCreateColumnSchema.merge(
  BaseMediumBlobColumnSchema,
);

export const UpdateMediumBlobColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMediumBlobColumnSchema,
);
