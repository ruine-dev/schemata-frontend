import { z } from 'zod';
import { BaseColumnSchema } from './base';

export const DeleteColumnSchema = BaseColumnSchema.pick({ id: true }).extend({
  tableId: z.string().uuid(),
});

export type DeleteColumnType = z.infer<typeof DeleteColumnSchema>;
