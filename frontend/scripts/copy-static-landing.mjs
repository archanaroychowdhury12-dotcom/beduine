import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const source = resolve(projectRoot, 'Beduine_Landing-Page');
const target = resolve(projectRoot, 'dist', 'Beduine_Landing-Page');

if (!existsSync(source)) {
  throw new Error(`Static landing page folder not found: ${source}`);
}

mkdirSync(dirname(target), { recursive: true });
rmSync(target, { recursive: true, force: true });
cpSync(source, target, {
  recursive: true,
  filter(path) {
    const name = basename(path);
    return !name.includes('.editable.') && !name.endsWith('.bak');
  },
});
