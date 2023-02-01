import { uniqueArrayElement } from '@/utils/zod';
import { z } from 'zod';
import {
  BaseColumnAttributeEnum,
  BaseColumnSchema,
  BaseCreateColumnSchema,
  BaseUpdateColumnSchema,
} from './base';

export const BaseVarcharColumnSchema = z.object({
  type: z.literal('VARCHAR'),
  length: z.number().int().min(1).max(65535).catch(255).optional(),
  attributes: uniqueArrayElement(BaseColumnAttributeEnum.array()),
});

export const VarcharColumnSchema = BaseColumnSchema.merge(BaseVarcharColumnSchema);

export type VarcharColumnType = z.infer<typeof VarcharColumnSchema>;

export const CreateVarcharColumnSchema = BaseCreateColumnSchema.merge(BaseVarcharColumnSchema);

export const UpdateVarcharColumnSchema = BaseUpdateColumnSchema.merge(BaseVarcharColumnSchema);
