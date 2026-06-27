import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const vercelConfig = JSON.parse(
  readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'),
);
const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
);

describe('root landing page routing', () => {
  it('serves the static Beduine landing page for the site root', () => {
    expect(vercelConfig.rewrites[0]).toEqual({
      source: '/',
      destination: '/Beduine_Landing-Page/index.html',
    });
  });

  it('keeps React app routes behind the root landing rewrite', () => {
    expect(vercelConfig.rewrites.at(-1)).toEqual({
      source: '/(.*)',
      destination: '/index.html',
    });
  });

  it('copies the static landing page into the production build output', () => {
    expect(packageJson.scripts.build).toContain('vite build');
    expect(packageJson.scripts.build).toContain('node scripts/copy-static-landing.mjs');
  });
});
