import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const files = [
  'src/pages/subscription-page/SubscriptionCTA.tsx',
  'src/pages/subscription-page/SubscriptionLandingPage.tsx',
  'src/pages/subscription-page/LandingShell.tsx',
  'src/pages/subscription-page/SubscriptionFAQ.tsx',
];

describe('subscription CTA semantics', () => {
  it('does not nest ParticleButton inside another button or link as an interactive child', () => {
    for (const file of files) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf8');
      expect(source, file).not.toMatch(/<button[\s\S]{0,500}<ParticleButton/);
      expect(source, file).not.toMatch(/<a\b[\s\S]{0,300}<ParticleButton(?![^>]*\bas="span")/);
    }
  });
});
