import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BasePointColumnSchema = z.object({
  type: z.literal('POINT'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const PointColumnSchema = BaseColumnSchema.merge(BasePointColumnSchema);

export const CreatePointColumnSchema = BaseCreateColumnSchema.merge(BasePointColumnSchema);

export const UpdatePointColumnSchema = BaseUpdateColumnSchema.merge(BasePointColumnSchema);
