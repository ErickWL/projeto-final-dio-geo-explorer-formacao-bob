import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { safePath } from './paths.mjs';

const querySchema = z.object({
  tecnologia: z.string().trim().min(1).max(80).regex(/^[\p{L}\p{N} .+#.-]+$/u).optional(),
}).strict();

export async function readCatalog() {
  const catalogPath = safePath('data', 'trilhas_dio.json');
  const raw = await readFile(catalogPath, 'utf8');
  return JSON.parse(raw);
}

export async function findTrails(input) {
  const { tecnologia } = querySchema.parse(input ?? {});
  const catalog = await readCatalog();
  if (!tecnologia) return catalog.trilhas;
  const needle = tecnologia.toLocaleLowerCase();
  return catalog.trilhas.filter((trail) =>
    trail.tecnologia.some((item) => item.toLocaleLowerCase() === needle),
  );
}

export { querySchema };
