export const APP_ROUTES = {
  home: '/',
  club: '/landing',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  paidTour: '/paid-tour',
  winners: '/winners',
  adminLogin: '/admin-login',
  admin: '/admin',
  subscriptionCheckout: '/checkout/subscription',
  tourCheckout: '/checkout/tour',
} as const;

const protectedViews = new Set([
  APP_ROUTES.club.slice(1),
  APP_ROUTES.register.slice(1),
  APP_ROUTES.dashboard.slice(1),
  APP_ROUTES.subscriptionCheckout.slice(1),
  APP_ROUTES.tourCheckout.slice(1),
]);

const postAuthViews = new Map<string, string>([
  [APP_ROUTES.club, 'landing'],
  [APP_ROUTES.register, 'register'],
  [APP_ROUTES.dashboard, 'dashboard'],
  [APP_ROUTES.paidTour, 'paid-tour'],
  [APP_ROUTES.subscriptionCheckout, 'register'],
  [APP_ROUTES.tourCheckout, 'paid-tour'],
]);

const allowedNextPaths = new Set(postAuthViews.keys());

export type ProtectedRouteRedirect = {
  view: 'login';
  nextPath: string;
};

export function isProtectedView(view: string): boolean {
  return protectedViews.has(view);
}

export function normalizeNextPath(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return null;
  }

  const pathname = value.split(/[?#]/)[0];
  return allowedNextPaths.has(pathname) ? value : null;
}

export function buildLoginRedirect(nextPath: string): string {
  const safeNextPath = normalizeNextPath(nextPath) || APP_ROUTES.dashboard;
  return `${APP_ROUTES.login}?next=${encodeURIComponent(safeNextPath)}`;
}

export function getProtectedRouteRedirect(
  view: string,
  isAuthenticated: boolean,
): ProtectedRouteRedirect | null {
  if (!isProtectedView(view) || isAuthenticated) {
    return null;
  }

  return {
    view: 'login',
    nextPath: `/${view}`,
  };
}

export function getPostAuthView(nextPath: string | null): string {
  const safeNextPath = normalizeNextPath(nextPath);
  if (!safeNextPath) {
    return 'dashboard';
  }

  const pathname = safeNextPath.split(/[?#]/)[0];
  return postAuthViews.get(pathname) || 'dashboard';
}
