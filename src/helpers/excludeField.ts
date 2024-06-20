import { PrismaClient } from '@prisma/client';

type Models = Extract<PrismaClient[keyof PrismaClient], { fields: unknown }>;
export function excludeFields<T extends Models['fields']>(
  fields: T,
  exclude: (keyof T)[],
) {
  const keys = Object.keys(fields) as (keyof T)[];
  const excludeSet = new Set(exclude);
  const attributes: Partial<Record<keyof T[][number], boolean>> = {};
  for (const key of keys)
    if (excludeSet.has(key)) attributes[key] = false;
    else attributes[key] = true;
  return attributes;
}
