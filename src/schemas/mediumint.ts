import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMediumIntColumnSchema = z.object({
  type: z.literal('MEDIUMINT'),
  length: z.number().int().min(1).max(9).catch(9).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MediumIntColumnSchema = BaseColumnSchema.merge(BaseMediumIntColumnSchema);

export const CreateMediumIntColumnSchema = BaseCreateColumnSchema.merge(BaseMediumIntColumnSchema);

export const UpdateMediumIntColumnSchema = BaseUpdateColumnSchema.merge(BaseMediumIntColumnSchema);
