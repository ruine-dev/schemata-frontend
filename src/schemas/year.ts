import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseYearColumnSchema = z.object({
  type: z.literal('YEAR'),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const YearColumnSchema = BaseColumnSchema.merge(BaseYearColumnSchema);

export const CreateYearColumnSchema = BaseCreateColumnSchema.merge(BaseYearColumnSchema);

export const UpdateYearColumnSchema = BaseUpdateColumnSchema.merge(BaseYearColumnSchema);
