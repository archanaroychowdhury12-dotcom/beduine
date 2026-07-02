import { describe, expect, it } from 'vitest';
import {
  getStaticLandingUrl,
  shouldOpenStaticLanding,
} from '../../src/utils/staticLandingRoute';

describe('static landing route helpers', () => {
  it('opens the static landing page for the site root', () => {
    expect(shouldOpenStaticLanding('/')).toBe(true);
    expect(shouldOpenStaticLanding('')).toBe(true);
  });

  it('does not intercept app routes', () => {
    expect(shouldOpenStaticLanding('/register')).toBe(false);
    expect(shouldOpenStaticLanding('/paid-tour')).toBe(false);
    expect(shouldOpenStaticLanding('/Beduine_Landing-Page/index.html')).toBe(false);
  });

  it('preserves query and hash when building the static landing URL', () => {
    expect(getStaticLandingUrl('?utm=ad', '#plans')).toBe('/Beduine_Landing-Page/index.html?utm=ad#plans');
  });
});
