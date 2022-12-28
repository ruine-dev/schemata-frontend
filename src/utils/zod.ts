import { z } from 'zod';

export function uniqueArrayElement<
  T extends z.ZodTypeAny,
  Cardinality extends z.ArrayCardinality,
  Schema extends z.ZodArray<T, Cardinality>,
>(schema: Schema) {
  return schema.transform((elements) => Array.from(new Set(elements)));
}
