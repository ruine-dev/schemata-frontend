import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseJsonColumnSchema = z.object({
  type: z.literal('JSON'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const JsonColumnSchema = BaseColumnSchema.merge(BaseJsonColumnSchema);

export const CreateJsonColumnSchema = BaseCreateColumnSchema.merge(BaseJsonColumnSchema);

export const UpdateJsonColumnSchema = BaseUpdateColumnSchema.merge(BaseJsonColumnSchema);
