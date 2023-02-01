import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiPointColumnSchema = z.object({
  type: z.literal('MULTIPOINT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiPointColumnSchema = BaseColumnSchema.merge(BaseMultiPointColumnSchema);

export const CreateMultiPointColumnSchema = BaseCreateColumnSchema.merge(
  BaseMultiPointColumnSchema,
);

export const UpdateMultiPointColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMultiPointColumnSchema,
);
