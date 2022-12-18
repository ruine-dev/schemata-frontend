import { twMerge } from 'tailwind-merge';
import c from 'clsx';

export function clsx(...inputs: Parameters<typeof c>) {
  return twMerge(c(inputs));
}
