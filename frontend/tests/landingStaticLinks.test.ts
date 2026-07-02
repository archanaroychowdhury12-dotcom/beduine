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

describe('Beduine static landing links', () => {
  it('resolves static assets from the landing page folder when opened from the root URL', () => {
    expect(landingHtml).toContain('<base href="/Beduine_Landing-Page/">');
  });

  it('keeps the simplified public navbar and member CTAs', () => {
    expect(landingHtml).toContain('href="#home" class="nav-link active">Home</a>');
    expect(landingHtml).toContain('href="/paid-tour" class="nav-link">Tours</a>');
    expect(landingHtml).toContain('href="/paid-tour#destinations" class="nav-link">Destinations</a>');
    expect(landingHtml).toContain('href="/winners" class="nav-link">Winners</a>');
    expect(landingHtml).toContain('href="/login?next=/landing" class="nav-link">BEDUINE CLUB</a>');
    expect(landingHtml).toContain('href="#location" class="nav-link">Contact</a>');
    expect(landingHtml).toContain('href="/login?next=/landing" class="btn-primary btn-join-club">');
    expect(landingHtml).not.toContain('href="team.html" class="nav-link">Our Team</a>');
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

  it('renders the "Why Choose Beduine" section', () => {
    expect(landingHtml).toContain('id="why-us"');
    expect(landingHtml).toContain('Why Choose <span>Beduine?</span>');
    expect(landingHtml).toContain('Travel More. Save More. Get Rewarded.');
    expect(landingHtml).toContain('Curated Travel Experiences');
    expect(landingHtml).toContain('Savings on Future Trips');
    expect(landingHtml).toContain('class="why-bento"');
    expect(landingHtml).toContain('class="bento-card');
    expect(landingHtml).toContain('src="assets/why_choose_beduine.png"');
  });

  it('renders the standalone Our Team page (team.html)', () => {
    expect(teamHtml).toContain('<title>Our Team | Beduine Tour and Travels</title>');
    expect(teamHtml).toContain('href="team.html" class="nav-link active">Our Team</a>');
    expect(teamHtml).toContain('Meet Our <span>Team</span>');
    expect(teamHtml).toContain('Cristiano Ronaldo');
    expect(teamHtml).toContain('Lionel Messi');
  });
});
