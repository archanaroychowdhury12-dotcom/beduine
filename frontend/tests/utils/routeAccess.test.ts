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

  it('preserves safe registration query params through login redirects', () => {
    expect(getProtectedRouteRedirect('/register?plan=Gold', false)).toEqual({
      view: 'login',
      nextPath: '/register?plan=Gold',
    });
    expect(buildLoginRedirect('/register?plan=Gold')).toBe(
      '/login?next=%2Fregister%3Fplan%3DGold',
    );
    expect(getPostAuthView('/register?plan=Gold')).toBe('register');
  });

  it('keeps paid-tour deep links public', () => {
    expect(getProtectedRouteRedirect('/paid-tour#customize', false)).toBeNull();
  });

  it('rejects external and protocol-relative next paths', () => {
    expect(normalizeNextPath('/landing')).toBe('/landing');
    expect(getPostAuthView('/landing')).toBe('landing');
    expect(getPostAuthView('/paid-tour?tour=digha')).toBe('paid-tour');
    expect(normalizeNextPath('https://evil.example')).toBeNull();
    expect(normalizeNextPath('//evil.example')).toBeNull();
    expect(getProtectedRouteRedirect('https://evil.example', false)).toBeNull();
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
