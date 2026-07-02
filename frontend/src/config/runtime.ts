export const isProductionHost = () => {
  if (typeof window === 'undefined') return false;
  return /(^|\.)beduine\.in$/i.test(window.location.hostname) || import.meta.env.PROD;
};

export const isDemoModeAllowed = () => {
  return import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true' && !isProductionHost();
};
