import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const landingHtml = readFileSync(
  resolve(process.cwd(), 'Beduine_Landing-Page/index.html'),
  'utf8',
);
const landingScript = readFileSync(
  resolve(process.cwd(), 'Beduine_Landing-Page/script.js'),
  'utf8',
);

describe('Beduine static landing links', () => {
  it('resolves static assets from the landing page folder when opened from the root URL', () => {
    expect(landingHtml).toContain('<base href="/Beduine_Landing-Page/">');
  });

  it('routes registration CTAs to the registration page', () => {
    expect(landingHtml).toContain('href="/register" class="btn-primary">Join Now</a>');
    expect(landingHtml).toContain('href="/register" class="btn-primary btn-large">JOIN BEDUINE CLUB</a>');
    expect(landingHtml).toContain('href="/register" class="btn-primary btn-large btn-cta-main"');
  });

  it('routes subscription plan CTAs with the selected plan', () => {
    expect(landingHtml).toContain('href="/register?plan=Silver" class="btn-plan btn-silver" data-plan="Silver"');
    expect(landingHtml).toContain('href="/register?plan=Gold" class="btn-plan btn-gold" data-plan="Gold"');
    expect(landingHtml).toContain('href="/register?plan=Platinum" class="btn-plan btn-platinum" data-plan="Platinum"');
  });

  it('routes travel booking CTAs to the paid-tour/customize flow', () => {
    expect(landingHtml).toContain('href="/paid-tour#customize" class="btn-outline btn-large"');
    expect(landingHtml).toContain('href="/paid-tour" class="btn-outline view-all-btn"');
  });

  it('does not block CTA navigation with the old mock alert', () => {
    expect(landingScript).not.toContain('preventDefault');
    expect(landingScript).not.toContain('alert(`Thank you for choosing Beduine!');
  });
});
