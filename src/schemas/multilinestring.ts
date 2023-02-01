import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseMultiLineStringColumnSchema = z.object({
  type: z.literal('MULTILINESTRING'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const MultiLineStringColumnSchema = BaseColumnSchema.merge(BaseMultiLineStringColumnSchema);

export const CreateMultiLineStringColumnSchema = BaseCreateColumnSchema.merge(
  BaseMultiLineStringColumnSchema,
);

export const UpdateMultiLineStringColumnSchema = BaseUpdateColumnSchema.merge(
  BaseMultiLineStringColumnSchema,
);
