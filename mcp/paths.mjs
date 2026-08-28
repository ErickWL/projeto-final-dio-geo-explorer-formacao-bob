import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '..');
const bases = Object.freeze({
  mcp: fs.realpathSync(path.join(projectRoot, 'mcp')),
  data: fs.realpathSync(path.join(projectRoot, 'DIO_explorer', 'data')),
});

function isInside(base, target) {
  return target === base || target.startsWith(`${base}${path.sep}`);
}

export function safePath(baseName, relativePath) {
  const base = bases[baseName];
  if (!base || typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new Error('Invalid protected path');
  }

  const candidate = path.resolve(base, relativePath);
  let realCandidate;
  try {
    realCandidate = fs.realpathSync(candidate);
  } catch {
    throw new Error('Protected path does not exist');
  }

  if (!isInside(base, realCandidate)) {
    throw new Error('Path escapes protected directory');
  }
  return realCandidate;
}

export function protectedBases() {
  return { ...bases };
}
