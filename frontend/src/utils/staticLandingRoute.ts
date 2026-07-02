export const STATIC_LANDING_PATH = '/Beduine_Landing-Page/index.html';

export function shouldOpenStaticLanding(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}

export function getStaticLandingUrl(search = '', hash = ''): string {
  return `${STATIC_LANDING_PATH}${search}${hash}`;
}
