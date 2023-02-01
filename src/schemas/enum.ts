import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseEnumColumnSchema = z.object({
  type: z.literal('ENUM'),
  values: uniqueArrayElement(z.string().array().nonempty()),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const EnumColumnSchema = BaseColumnSchema.merge(BaseEnumColumnSchema);

export const CreateEnumColumnSchema = BaseCreateColumnSchema.merge(BaseEnumColumnSchema);

export const UpdateEnumColumnSchema = BaseUpdateColumnSchema.merge(BaseEnumColumnSchema);
