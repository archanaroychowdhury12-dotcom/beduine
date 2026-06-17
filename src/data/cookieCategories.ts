export interface CookieCategory {
  id: 'essential' | 'functional' | 'analytics' | 'marketing';
  name: string;
  description: string;
  required: boolean;
  cookies: Array<{
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }>;
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function properly. They enable core functionality such as user authentication, page security, and preference settings. They cannot be disabled.',
    required: true,
    cookies: [
      { name: 'beduine_session', purpose: 'Maintains user session state and authentication.', duration: 'Session', provider: 'Beduine Tour & Travels' },
      { name: 'cookie_consent_v1', purpose: 'Stores the user\'s cookie consent preferences.', duration: '1 Year', provider: 'Beduine Tour & Travels' },
      { name: 'csrf_token', purpose: 'Prevents Cross-Site Request Forgery attacks.', duration: 'Session', provider: 'Beduine Tour & Travels' }
    ]
  },
  {
    id: 'functional',
    name: 'Functional Cookies',
    description: 'Functional cookies allow the website to remember choices you make (such as your language or region preference) and provide enhanced, more personal features.',
    required: false,
    cookies: [
      { name: 'preferred_lang', purpose: 'Remembers the user\'s preferred language (e.g. English, Hindi, Bengali).', duration: '1 Year', provider: 'Beduine Tour & Travels' },
      { name: 'theme_mode', purpose: 'Saves dark or light UI layout preference.', duration: 'Persistent', provider: 'Beduine Tour & Travels' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'These cookies collect information about how visitors use our website, such as which pages are visited most often. All information is aggregated and anonymous.',
    required: false,
    cookies: [
      { name: '_ga', purpose: 'Used by Google Analytics to distinguish users and session statistics.', duration: '2 Years', provider: 'Google' },
      { name: '_gid', purpose: 'Used by Google Analytics to store and update page view counts.', duration: '24 Hours', provider: 'Google' }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'These cookies track your browsing activity across websites to deliver advertisements and promotional campaigns tailored to your interests.',
    required: false,
    cookies: [
      { name: '_fbp', purpose: 'Used by Meta Pixel to track conversions and optimize ad delivery.', duration: '3 Months', provider: 'Meta' },
      { name: 'ads_conversion', purpose: 'Tracks successful booking conversions after clicking marketing links.', duration: '30 Days', provider: 'Beduine Tour & Travels' }
    ]
  }
];
