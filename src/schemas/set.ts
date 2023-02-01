import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseSetColumnSchema = z.object({
  type: z.literal('SET'),
  values: uniqueArrayElement(z.string().array().nonempty()),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const SetColumnSchema = BaseColumnSchema.merge(BaseSetColumnSchema);

export const CreateSetColumnSchema = BaseCreateColumnSchema.merge(BaseSetColumnSchema);

export const UpdateSetColumnSchema = BaseUpdateColumnSchema.merge(BaseSetColumnSchema);
