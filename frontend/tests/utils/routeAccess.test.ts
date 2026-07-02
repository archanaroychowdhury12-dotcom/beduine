import { describe, expect, it } from 'vitest';
import {
  buildLoginRedirect,
  getProtectedRouteRedirect,
  getPostAuthView,
  normalizeNextPath,
} from '@/utils/appRoutes';

describe('production route policy', () => {
  it('protects club, registration, dashboard, and checkout', () => {
    for (const view of [
      'landing',
      'register',
      'dashboard',
      'checkout/subscription',
      'checkout/tour',
    ]) {
      expect(getProtectedRouteRedirect(view, false)).toEqual({
        view: 'login',
        nextPath: `/${view}`,
      });
    }
  });

  it('rejects external and protocol-relative next paths', () => {
    expect(normalizeNextPath('/landing')).toBe('/landing');
    expect(getPostAuthView('/landing')).toBe('landing');
    expect(getPostAuthView('/paid-tour?tour=digha')).toBe('paid-tour');
    expect(normalizeNextPath('https://evil.example')).toBeNull();
    expect(normalizeNextPath('//evil.example')).toBeNull();
    expect(getPostAuthView('https://evil.example')).toBe('dashboard');
    expect(getPostAuthView('//evil.example')).toBe('dashboard');
  });

  it('encodes the login destination', () => {
    expect(buildLoginRedirect('/paid-tour?tour=digha')).toBe(
      '/login?next=%2Fpaid-tour%3Ftour%3Ddigha',
    );
    expect(getPostAuthView(null)).toBe('dashboard');
  });
});
