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
const teamHtml = readFileSync(
  resolve(process.cwd(), 'Beduine_Landing-Page/team.html'),
  'utf8',
);
const landingCopyScript = readFileSync(
  resolve(process.cwd(), 'scripts/copy-static-landing.mjs'),
  'utf8',
);

describe('Beduine static landing links', () => {
  it('resolves static assets from the landing page folder when opened from the root URL', () => {
    expect(landingHtml).toContain('<base href="/Beduine_Landing-Page/">');
  });

  it('keeps the simplified public navbar and member CTAs', () => {
    expect(landingHtml).toContain('href="#home" class="nav-link active">Home</a>');
    expect(landingHtml).not.toContain('href="/paid-tour" class="nav-link">Tours</a>');
    expect(landingHtml).not.toContain('href="/paid-tour#destinations" class="nav-link">Destinations</a>');
    expect(landingHtml).not.toContain('href="/winners" class="nav-link">Winners</a>');
    expect(landingHtml).toContain('href="team.html" class="nav-link">Our Team</a>');
    expect(landingHtml).toContain('href="/login?next=/landing" class="nav-link">BEDUINE CLUB</a>');
    expect(landingHtml).toContain('href="#location" class="nav-link">Contact</a>');
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-primary btn-join-club">');
  });

  it('routes club and plan CTAs correctly', () => {
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-primary btn-large">Join Beduine Club</a>');
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-primary btn-large btn-cta-main">JOIN BEDUINE CLUB</a>');
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-plan-outline btn-blue" data-plan="Silver">');
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-plan-filled btn-orange" data-plan="Gold">');
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-plan-outline btn-purple" data-plan="Platinum">');
  });

  it('routes travel booking CTAs to paid tours', () => {
    expect(landingHtml).toContain('href="/paid-tour#customize"');
    expect(landingHtml).toContain('href="/paid-tour#customize" class="btn-outline-dark">Customize Tour</a>');
    expect(landingHtml).toContain('href="/paid-tour#customize" class="btn-blue-primary btn-large">Customize Tour</a>');
  });

  it('does not block CTA navigation with the old mock alert', () => {
    expect(landingScript).not.toContain('preventDefault');
    expect(landingScript).not.toContain('alert(`Thank you for choosing Beduine!');
  });

  it('does not publish celebrity placeholder profiles as Beduine staff', () => {
    for (const placeholder of ['Cristiano Ronaldo', 'Neymar Jr', 'Lionel Messi', 'Kylian Mbapp']) {
      expect(teamHtml).not.toContain(placeholder);
    }
  });

  it('excludes editable and backup artifacts from the static production copy', () => {
    expect(landingCopyScript).toContain("name.includes('.editable.')");
    expect(landingCopyScript).toContain("name.endsWith('.bak')");
  });
});
