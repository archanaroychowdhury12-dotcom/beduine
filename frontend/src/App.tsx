import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import {
  CustomCursor,
  LandingContent,
  RouteFallback,
  StickySubscribeButton,
} from './pages/subscription-page/SubscriptionLandingPage';
import { FloatingButtons, Footer, MobileSticky, Navbar } from './pages/subscription-page/LandingShell';
import { TermsAndConditions } from './pages/subscription-page/TermsAndConditions';

const LoginPage = lazy(() => import('./LoginPage'));
const RegistrationPage = lazy(() => import('./RegistrationPage'));
const DashboardPage = lazy(() => import('./DashboardPage'));
const AdminPage = lazy(() => import('./AdminPage'));
const AdminLoginPage = lazy(() => import('./AdminLoginPage'));
const ErrorPage = lazy(() => import('./ErrorPage'));
const PaidTourPage = lazy(() => import('./pages/main-website-tour-page/MainWebsiteTourPage'));
const PublicWinnersPage = lazy(() => import('./pages/PublicWinnersPage'));
const VerifyCouponPage = lazy(() => import('./components/VerifyCouponPage'));

const LegalCenterPage = lazy(() => import('./app/legal/page'));
const PrivacyPolicyPage = lazy(() => import('./app/privacy-policy/page'));
const PaymentPolicyPage = lazy(() => import('./app/payment-policy/page'));
const RefundPolicyPage = lazy(() => import('./app/refund-policy/page'));
const CancellationPolicyPage = lazy(() => import('./app/cancellation-policy/page'));
const MembershipRulesPage = lazy(() => import('./app/membership-rules/page'));
const WebsiteDisclaimerPage = lazy(() => import('./app/website-disclaimer/page'));
const CookiePolicyPage = lazy(() => import('./app/cookie-policy/page'));
const AffiliateAgentPolicyPage = lazy(() => import('./app/affiliate-agent-policy/page'));
const GrievanceRedressalPage = lazy(() => import('./app/grievance-redressal/page'));

import { CookieConsentBanner, CookieModalTrigger } from './components/legal/CookieConsentBanner';
import { DemoBanner } from './components/demo/DemoBanner';
import { supabase } from './utils/supabaseClient';
import { getRegistrationPlanFromSearch } from './utils/registrationPlanParams';
import { getStaticLandingUrl, shouldOpenStaticLanding } from './utils/staticLandingRoute';
import {
  APP_ROUTES,
  buildLoginRedirect,
  getPostAuthView,
  getProtectedRouteRedirect,
  isProtectedView,
  normalizeNextPath,
} from './utils/appRoutes';
import { canAccessAdmin, canUseDemoTools } from './services/accessControl';
import { notify } from './services/uiFeedback';
import { loadProfileRecord, mapSupabaseUser } from './utils/userMapper';
import { AppUser, SupabaseRawUser } from './types';
import { FeedbackProvider } from './components/ui/FeedbackProvider';

type AppView =
  | 'landing' | 'login' | 'register' | 'terms' | 'dashboard' | 'paid-tour' | 'winners' | 'error'
  | 'legal' | 'privacy-policy' | 'payment-policy' | 'terms-and-conditions' | 'refund-policy'
  | 'cancellation-policy' | 'membership-rules' | 'website-disclaimer'
  | 'cookie-policy' | 'affiliate-agent-policy' | 'grievance-redressal' | 'verify-coupon'
  | 'admin'
  | 'admin-login';


const coerceAppView = (slug: string) => slug as AppView;
const ROUTE_VIEW_BY_PATH: Record<string, AppView> = {
  [APP_ROUTES.club.slice(1)]: 'landing',
  [APP_ROUTES.login.slice(1)]: 'login',
  [APP_ROUTES.register.slice(1)]: 'register',
  [APP_ROUTES.dashboard.slice(1)]: 'dashboard',
  [APP_ROUTES.paidTour.slice(1)]: 'paid-tour',
  [APP_ROUTES.winners.slice(1)]: 'winners',
  [APP_ROUTES.subscriptionCheckout.slice(1)]: 'register',
  [APP_ROUTES.tourCheckout.slice(1)]: 'paid-tour',
  terms: 'terms',
  legal: 'legal',
  'privacy-policy': 'privacy-policy',
  'payment-policy': 'payment-policy',
  'terms-and-conditions': 'terms-and-conditions',
  'refund-policy': 'refund-policy',
  'cancellation-policy': 'cancellation-policy',
  'membership-rules': 'membership-rules',
  'website-disclaimer': 'website-disclaimer',
  'cookie-policy': 'cookie-policy',
  'affiliate-agent-policy': 'affiliate-agent-policy',
  'grievance-redressal': 'grievance-redressal',
  'verify-coupon': 'verify-coupon',
  admin: 'admin',
  'admin-login': 'admin-login',
};
const PUBLIC_CHROME_VIEWS: AppView[] = [
  'landing',
  'winners',
  'terms',
  'legal',
  'privacy-policy',
  'payment-policy',
  'terms-and-conditions',
  'refund-policy',
  'cancellation-policy',
  'membership-rules',
  'website-disclaimer',
  'cookie-policy',
  'affiliate-agent-policy',
  'grievance-redressal',
];

function getRouteKey(pathname: string): string {
  return pathname.replace(/^\/|\/$/g, '');
}

function getViewForPath(pathname: string): AppView {
  const routeKey = getRouteKey(pathname);
  if (!routeKey) {
    return 'landing';
  }

  return ROUTE_VIEW_BY_PATH[routeKey] || 'error';
}
/* ---------- App ---------- */

export default function App() {
  const introComplete = true;

  useEffect(() => {
    if (shouldOpenStaticLanding(window.location.pathname)) {
      window.location.replace(getStaticLandingUrl(window.location.search, window.location.hash));
    }
  }, []);

  const [view, setView] = useState<AppView>(() => getViewForPath(window.location.pathname));
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [pendingNextPath, setPendingNextPath] = useState<string | null>(() => new URLSearchParams(window.location.search).get('next'));
  const [selectedPlanName, setSelectedPlanName] = useState<string>(() => {
    return getRegistrationPlanFromSearch(window.location.search)
      || sessionStorage.getItem('pendingPlanName')
      || 'Silver';
  });
  const [prefilledData, setPrefilledData] = useState<Partial<AppUser> | null>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');

  const hydrateAuthenticatedUser = useCallback(async (rawUser: SupabaseRawUser) => {
    const profile = await loadProfileRecord(rawUser.id);
    return mapSupabaseUser(rawUser, profile);
  }, []);

  const handleSetView = useCallback((newView: AppView, hash?: string) => {
    setView(newView);
    const path = `/${newView}${hash || ''}`;
    const currentFull = window.location.pathname + window.location.hash;
    if (currentFull !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const redirectToLoginForProtectedView = useCallback((nextPath: string) => {
    setPendingNextPath(nextPath);
    setLoginInitialMode('login');
    setView('login');
    const loginPath = buildLoginRedirect(nextPath);
    const currentFull = window.location.pathname + window.location.search;
    if (currentFull !== loginPath) {
      window.history.replaceState(null, '', loginPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const consumePostAuthRedirect = useCallback(() => {
    const requestedNextPath = pendingNextPath || new URLSearchParams(window.location.search).get('next');
    if (!requestedNextPath) return false;

    setPendingNextPath(null);

    const safeNextPath = normalizeNextPath(requestedNextPath);
    if (!safeNextPath) {
      handleSetView('dashboard');
      return true;
    }

    setView(getPostAuthView(safeNextPath) as AppView);
    if (window.location.pathname + window.location.search + window.location.hash !== safeNextPath) {
      window.history.replaceState(null, '', safeNextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }, [handleSetView, pendingNextPath]);

  const checkPendingPlanAndRedirect = useCallback(() => {
    const storedPending = sessionStorage.getItem('pendingPlanName') || pendingPlan;
    if (storedPending) {
      setSelectedPlanName(storedPending);
      handleSetView('register');
      setPendingPlan(null);
      sessionStorage.removeItem('pendingPlanName');
      return true;
    }
    return false;
  }, [pendingPlan, handleSetView]);

  // Supabase Auth listener
  useEffect(() => {
    let cancelled = false;

    const checkPendingPlanAndRedirectLocally = () => {
      const storedPending = sessionStorage.getItem('pendingPlanName');
      if (storedPending) {
        setSelectedPlanName(storedPending);
        handleSetView('register');
        sessionStorage.removeItem('pendingPlanName');
        return true;
      }
      return false;
    };

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const mapped = await hydrateAuthenticatedUser(session.user);
          if (cancelled) return;

          setCurrentUser(mapped);
          const redirectedToNext = consumePostAuthRedirect();
          const redirected = redirectedToNext || checkPendingPlanAndRedirectLocally();
          if (!redirected && window.location.pathname === APP_ROUTES.login) {
            handleSetView('dashboard');
          }
        } catch (error) {
          if (!cancelled) {
            setCurrentUser(null);
            notify.error(error instanceof Error ? error.message : 'Unable to load your profile.');
          }
        }
      }
    }).finally(() => {
      if (!cancelled) {
        setAuthReady(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      void (async () => {
        if (session?.user) {
          try {
            const mapped = await hydrateAuthenticatedUser(session.user);
            if (cancelled) return;

            setCurrentUser(mapped);
            if (event === 'SIGNED_IN') {
              const redirectedToNext = consumePostAuthRedirect();
              const redirected = redirectedToNext || checkPendingPlanAndRedirectLocally();
              if (!redirected && (window.location.pathname === APP_ROUTES.login || window.location.pathname === APP_ROUTES.register)) {
                handleSetView('dashboard');
              }
            }
          } catch (error) {
            if (!cancelled) {
              setCurrentUser(null);
              notify.error(error instanceof Error ? error.message : 'Unable to load your profile.');
            }
          }
        } else if (!cancelled) {
          setCurrentUser(null);
        }

        if (!cancelled) {
          setAuthReady(true);
        }
      })();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [consumePostAuthRedirect, handleSetView, hydrateAuthenticatedUser]);

  useEffect(() => {
    if (!authReady) return;

    const redirect = getProtectedRouteRedirect(
      window.location.pathname + window.location.search + window.location.hash,
      Boolean(currentUser),
    );
    if (redirect) {
      redirectToLoginForProtectedView(redirect.nextPath);
    }
  }, [authReady, currentUser, redirectToLoginForProtectedView, view]);

  const handleSelectPlan = useCallback((planName: string) => {
    setSelectedPlanName(planName);
    setPrefilledData(null);
    if (currentUser) {
      handleSetView('register');
    } else {
      setPendingPlan(planName);
      sessionStorage.setItem('pendingPlanName', planName);
      setLoginInitialMode('login');
      handleSetView('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUser, handleSetView]);

  useEffect(() => {
    const handleLocationChange = () => {
      const nextView = getViewForPath(window.location.pathname);
      setView(nextView);

      if (nextView === 'register') {
          const planFromQuery = getRegistrationPlanFromSearch(window.location.search);
          if (planFromQuery) {
            setSelectedPlanName(planFromQuery);
            setPendingPlan(null);
            sessionStorage.removeItem('pendingPlanName');
          }
      }
    };

    handleLocationChange();
    const onPopState = () => handleLocationChange();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Dynamic SEO Meta Update
  useEffect(() => {
    const metaTitles: Record<string, string> = {
      landing: 'Beduine Tour & Travels | Subscription Membership Plans',
      login: 'Login | Beduine Tour & Travels',
      register: 'Register & Subscribe | Beduine Tour & Travels',
      dashboard: 'Member Dashboard | Beduine Tour & Travels',
      'paid-tour': 'Book a Tour | Beduine Tour & Travels',
      winners: 'Public Winners | Beduine Tour & Travels',
      'verify-coupon': 'Verify Coupon | Beduine Tour & Travels',
      admin: 'Admin Portal | Beduine Tour & Travels',
      'admin-login': 'Admin Login | Beduine Tour & Travels',
      'privacy-policy': 'Privacy Policy | Beduine Tour & Travels',
      'payment-policy': 'Payment Policy | Beduine Tour & Travels',
      terms: 'Terms & Conditions | Beduine Tour & Travels',
      'terms-and-conditions': 'Terms & Conditions | Beduine Tour & Travels',
      'refund-policy': 'Refund Policy | Beduine Tour & Travels',
      'cancellation-policy': 'Cancellation Policy | Beduine Tour & Travels',
      'membership-rules': 'Membership Rules | Beduine Tour & Travels',
      'website-disclaimer': 'Website Disclaimer | Beduine Tour & Travels',
      'cookie-policy': 'Cookie Policy | Beduine Tour & Travels',
      'affiliate-agent-policy': 'Affiliate & Agent Policy | Beduine Tour & Travels',
      'grievance-redressal': 'Grievance Redressal | Beduine Tour & Travels',
      legal: 'Legal Center | Beduine Tour & Travels',
      error: 'Page Not Found | Beduine Tour & Travels'
    };

    const metaDescriptions: Record<string, string> = {
      landing: 'Join Beduine Tour & Travels subscription membership plans. Get TRC (Lucky Draw Credit) for weekly win-entry participation; Discount Credits unlock only for eligible non-winners after result publication.',
      login: 'Sign in to your Beduine Tour & Travels member account.',
      register: 'Choose your travel subscription plan, create an account, and start earning lucky draws.',
      dashboard: 'View your subscription details, wallet balance, lucky draw credits (TRC), and book your next tour.',
      'paid-tour': 'Explore and book premium domestic and international travel packages with your Discount Credits.',
      winners: 'View the public winners route for published Beduine weekly selection results.',
      'verify-coupon': 'Verify the authenticity of your Beduine tour coupon.',
      admin: 'Beduine Tour & Travels administrative management portal.',
      'admin-login': 'Restricted admin login for authorized Beduine operators only.',
      'privacy-policy': 'Read how Beduine Tour & Travels handles and protects your personal data.',
      'payment-policy': 'Payment schedules, cancellation charges, refund rules, credit adjustment, child policy, and general tour booking terms.',
      terms: 'Read the terms of service, subscription membership rules, and agreement for Beduine Tour & Travels.',
      'terms-and-conditions': 'Read the terms of service, subscription membership rules, and agreement for Beduine Tour & Travels.',
      'refund-policy': 'Read our refund policy for Beduine Tour & Travels subscriptions and tour bookings.',
      'cancellation-policy': 'Cancellation and rescheduling policy for Beduine Tour & Travels tour packages.',
      'membership-rules': 'Official rules and guidelines for Beduine travel subscription club membership.',
      'website-disclaimer': 'Legal disclaimer regarding information and services on the Beduine website.',
      'cookie-policy': 'Learn how Beduine Tour & Travels uses cookies to improve your browsing experience.',
      'affiliate-agent-policy': 'Policy and rules for Beduine Tour & Travels affiliates and authorized agents.',
      'grievance-redressal': 'Grievance redressal policy and contact information for Beduine Tour & Travels.',
      legal: 'Legal agreements, rules, and privacy disclosures for Beduine Tour & Travels members.',
      error: 'The requested page was not found.'
    };

    const currentTitle = metaTitles[view] || metaTitles.landing;
    const currentDesc = metaDescriptions[view] || metaDescriptions.landing;

    // Update document title
    document.title = currentTitle;

    // Update meta tags
    const updateMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const nameMatch = selector.match(/name="([^"]+)"/);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
        } else if (selector.startsWith('meta[property=')) {
          const propMatch = selector.match(/property="([^"]+)"/);
          if (propMatch) element.setAttribute('property', propMatch[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    updateMetaTag('meta[name="description"]', 'content', currentDesc);
    updateMetaTag('meta[property="og:title"]', 'content', currentTitle);
    updateMetaTag('meta[property="og:description"]', 'content', currentDesc);
    updateMetaTag('meta[name="twitter:title"]', 'content', currentTitle);
    updateMetaTag('meta[name="twitter:description"]', 'content', currentDesc);

    // Dynamic OG Image
    const ogImg = window.location.origin + '/images/og_image.png';
    updateMetaTag('meta[property="og:image"]', 'content', ogImg);
    updateMetaTag('meta[name="twitter:image"]', 'content', ogImg);
  }, [view]);


  // Manage body cursor visibility: default cursor during intro and the embedded tour site, hidden only for the custom landing cursor.
  useEffect(() => {
    if (!introComplete || view === 'paid-tour') {
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = 'none';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [introComplete, view]);

  const isDemoWalletEnabled = import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
  const showDemoBanner = isDemoWalletEnabled && (!currentUser || canUseDemoTools(currentUser)) && view !== 'admin' && view !== 'admin-login';
  const waitingForProtectedAuth = !authReady && isProtectedView(getRouteKey(window.location.pathname));

  return (
    <FeedbackProvider>
    <div className={`min-h-screen bg-cosmos text-ink relative ${showDemoBanner ? 'pt-9' : ''}`}>
      {showDemoBanner && <DemoBanner currentUser={currentUser} />}
      {/* Intro animation completely bypassed */}

      {introComplete && view !== 'paid-tour' && <CustomCursor />}

      {/* Main page content container - invisible during intro to prevent menu leak, then fades in beautifully */}
      <div className={`transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {view !== 'paid-tour' && <div className="noise fixed inset-0 pointer-events-none z-30" />}
        {PUBLIC_CHROME_VIEWS.includes(view) && (
          <Navbar 
            view={view} 
            setView={handleSetView} 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser}
            introComplete={introComplete}
          />
        )}

        <main className="relative z-10 flex flex-col gap-0">
          <Suspense fallback={<RouteFallback />}>
          {waitingForProtectedAuth ? (
            <RouteFallback />
          ) : view === 'landing' ? (
            <LandingContent onSelectPlan={handleSelectPlan} setView={handleSetView} currentUser={currentUser} setCurrentUser={setCurrentUser} />
          ) : view === 'login' ? (
            <LoginPage 
              initialMode={loginInitialMode}
              onRedirectToRegister={() => {
                handleSetView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                setPendingPlan(null);
                if (pendingNextPath === APP_ROUTES.club) {
                  setPendingNextPath(null);
                  window.location.href = APP_ROUTES.home;
                  return;
                }
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoginSuccess={(rawUser: SupabaseRawUser) => {
                void (async () => {
                  try {
                    const mapped = await hydrateAuthenticatedUser(rawUser);
                    setCurrentUser(mapped);
                    const redirectedToNext = consumePostAuthRedirect();
                    const redirected = redirectedToNext || checkPendingPlanAndRedirect();
                    if (!redirected) {
                      handleSetView('dashboard');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } catch (error) {
                    notify.error(error instanceof Error ? error.message : 'Unable to load your profile.');
                  }
                })();
              }}
            />
          ) : view === 'register' ? (
            <RegistrationPage 
              initialPlanName={selectedPlanName} 
              prefilledData={prefilledData}
              currentUser={currentUser}
              onRedirectToLogin={() => {
                setPendingPlan(selectedPlanName);
                handleSetView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                setPrefilledData(null);
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onRegisterSuccess={(userData: SupabaseRawUser) => {
                void (async () => {
                  try {
                    setCurrentUser(await hydrateAuthenticatedUser(userData));
                    handleSetView('dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } catch (error) {
                    notify.error(error instanceof Error ? error.message : 'Unable to load your profile.');
                  }
                })();
              }}
            />
          ) : view === 'dashboard' ? (
            <DashboardPage 
              user={currentUser} 
              onBookPaidTour={() => {
                handleSetView('paid-tour');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={() => {
                setCurrentUser(null);
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : view === 'admin-login' ? (
            <AdminLoginPage
              onBack={() => {
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAdminLoginSuccess={(userData: SupabaseRawUser) => {
                void (async () => {
                  try {
                    setCurrentUser(await hydrateAuthenticatedUser(userData));
                    handleSetView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } catch (error) {
                    notify.error(error instanceof Error ? error.message : 'Unable to load your profile.');
                  }
                })();
              }}
            />
          ) : view === 'admin' ? (
            canAccessAdmin(currentUser) ? (
            <AdminPage
              user={currentUser}
              onBack={() => {
                handleSetView('admin-login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={() => {
                setCurrentUser(null);
                handleSetView('admin-login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            ) : (
              <ErrorPage
                errorCode={403}
                errorTitle="Admin Login Required"
                errorMessage="This admin portal is fully separate from customer accounts. Please use authorized admin credentials."
                onGoHome={() => {
                  handleSetView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoBack={() => {
                  handleSetView('admin-login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )
          ) : view === 'paid-tour' ? (
            <PaidTourPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onNavigate={(v) => handleSetView(v as AppView)}
            />
          ) : view === 'winners' ? (
            <PublicWinnersPage />
          ) : (view === 'terms' || view === 'terms-and-conditions') ? (
            <div className="relative min-h-screen bg-[#030C15] pt-24 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-white flex flex-col items-center">
              {/* Background Graphic elements matching Beduine dashboard styles */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none no-print">
                <div className="absolute top-10 left-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-cyan/10 via-cyan/5 to-transparent blur-[80px]" />
                <div className="absolute bottom-10 right-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-rose-500/5 via-amber-500/5 to-transparent blur-[80px]" />
              </div>
              <div className="max-w-4xl w-full px-5 relative z-10 mx-auto">
                <button
                  onClick={() => {
                    handleSetView('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mb-8 inline-flex items-center gap-2 text-sm text-[#0096C7] hover:text-[#00B4D8] font-bold transition-all focus:outline-none cursor-pointer border-none bg-transparent"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                </button>
                <div className="rounded-3xl p-6 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden bg-slate-950/60 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-neon-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <TermsAndConditions />
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      handleSetView('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="glow-cta px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform inline-flex items-center gap-2 cursor-pointer border-none text-slate-900 bg-amber-400 hover:bg-amber-300"
                  >
                    Agree & Return Home <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : view === 'legal' ? (
            <LegalCenterPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'privacy-policy' ? (
            <PrivacyPolicyPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'payment-policy' ? (
            <PaymentPolicyPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'refund-policy' ? (
            <RefundPolicyPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'cancellation-policy' ? (
            <CancellationPolicyPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'membership-rules' ? (
            <MembershipRulesPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'website-disclaimer' ? (
            <WebsiteDisclaimerPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'cookie-policy' ? (
            <CookiePolicyPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'affiliate-agent-policy' ? (
            <AffiliateAgentPolicyPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'grievance-redressal' ? (
            <GrievanceRedressalPage onNavigate={(slug: string) => handleSetView(coerceAppView(slug))} />
          ) : view === 'verify-coupon' ? (
            <VerifyCouponPage />
          ) : (
            <ErrorPage
              onGoHome={() => {
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoBack={() => {
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
          </Suspense>
        </main>
        {PUBLIC_CHROME_VIEWS.includes(view) && (
          <Footer setView={handleSetView} />
        )}
        {view === 'landing' && <FloatingButtons />}
        {view === 'landing' && <MobileSticky onSelectPlan={handleSelectPlan} />}
        {view === 'landing' && <StickySubscribeButton onSelectPlan={handleSelectPlan} />}
        
        {/* Cookie Consent Banner and Preferences Modal trigger */}
        <CookieModalTrigger>
          <CookieConsentBanner />
        </CookieModalTrigger>
      </div>
    </div>
    </FeedbackProvider>
  );
}
