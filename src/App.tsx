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
const ErrorPage = lazy(() => import('./ErrorPage'));
const PaidTourPage = lazy(() => import('./pages/main-website-tour-page/MainWebsiteTourPage'));
const VerifyCouponPage = lazy(() => import('./components/VerifyCouponPage'));

const LegalCenterPage = lazy(() => import('./app/legal/page'));
const PrivacyPolicyPage = lazy(() => import('./app/privacy-policy/page'));
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

const mapSupabaseUser = (supabaseUser: any) => {
  const fullName = supabaseUser.user_metadata?.full_name || 
                   supabaseUser.user_metadata?.name || 
                   supabaseUser.email?.split('@')[0] || 
                   'Traveler User';
  const email = supabaseUser.email || '';
  const mobile = supabaseUser.phone || supabaseUser.user_metadata?.phone || '';
  
  let dob = supabaseUser.user_metadata?.dob || '';
  let preferredLanguage = supabaseUser.user_metadata?.preferredLanguage || 'English';
  let dietaryPreferences = supabaseUser.user_metadata?.dietaryPreferences || 'None';
  let accessibilityRequirements = supabaseUser.user_metadata?.accessibilityRequirements || 'None';
  let savedTravelers = supabaseUser.user_metadata?.savedTravelers || [];
  let savedPickups = supabaseUser.user_metadata?.savedPickups || [];
  
  if (email.includes('arunasish')) {
    dob = dob || '1989-05-12';
    preferredLanguage = preferredLanguage || 'Bengali';
    dietaryPreferences = dietaryPreferences || 'Non-Vegetarian';
    if (savedTravelers.length === 0) {
      savedTravelers = [
        { id: 't-aru-1', firstName: 'Ankita', lastName: 'Roychowdhury', email: 'ankita.roy@gmail.com', phone: '+91 94330 54321', ageGroup: 'Adult', relationship: 'Spouse' },
        { id: 't-aru-2', firstName: 'Dilip', lastName: 'Roychowdhury', email: 'dilip.roy@gmail.com', phone: '+91 94330 98765', ageGroup: 'Senior', relationship: 'Father' }
      ];
    }
    if (savedPickups.length === 0) {
      savedPickups = [
        { id: 'p-aru-1', type: 'hotel', hotelName: 'ITC Royal Bengal, Kolkata', customAddress: '', label: 'ITC Royal Bengal (Saved)' },
        { id: 'p-aru-2', type: 'hotel', hotelName: 'Kolkata Airport Arrival Gate', customAddress: '', label: 'Kolkata Airport (Saved)' }
      ];
    }
  } else if (email.includes('rahul.sen')) {
    dob = dob || '1994-08-15';
    preferredLanguage = preferredLanguage || 'Bengali';
    dietaryPreferences = dietaryPreferences || 'Vegetarian';
    if (savedTravelers.length === 0) {
      savedTravelers = [
        { id: 't-rah-1', firstName: 'Priya', lastName: 'Sen', email: 'priya.sen@gmail.com', phone: '+91 98765 11111', ageGroup: 'Adult', relationship: 'Spouse' },
        { id: 't-rah-2', firstName: 'Rakesh', lastName: 'Sen', email: 'rakesh.sen@gmail.com', phone: '+91 98765 22222', ageGroup: 'Child', relationship: 'Son' }
      ];
    }
    if (savedPickups.length === 0) {
      savedPickups = [
        { id: 'p-rah-1', type: 'manual', hotelName: '', customAddress: 'Salt Lake Sector V, Block EP & GP, Kolkata', label: 'Salt Lake Office (Saved)' },
        { id: 'p-rah-2', type: 'hotel', hotelName: 'Srinagar Airport Gate 2', customAddress: '', label: 'Srinagar Airport (Saved)' }
      ];
    }
  }

  const record = supabaseUser.user_metadata?.subscription_payment_record;
  const hasActiveRecord = record && record.transaction_id && record.payment_status === 'success';

  const planName = hasActiveRecord ? record.planName : null;
  const planPrice = hasActiveRecord ? record.planPrice : null;
  const planType = hasActiveRecord ? record.planType : null;
  const subscriptionStatus = hasActiveRecord ? 'active' : 'inactive';
  const real_wallet_balance = supabaseUser.user_metadata?.real_wallet_balance ?? 0;
  const demo_wallet_balance = supabaseUser.user_metadata?.demo_wallet_balance ?? 0;
  const is_demo_user = supabaseUser.user_metadata?.is_demo_user ?? (email.includes('demo') || email.includes('test') || email.includes('admin') || email.includes('arunasish'));
  const ledger = supabaseUser.user_metadata?.ledger || [];
  const demo_transactions = supabaseUser.user_metadata?.demo_transactions || [];

  let color = 'from-slate-400 via-slate-500 to-slate-700';
  let glow = 'rgba(148, 163, 184, 0.4)';
  if (planName) {
    const pName = planName.toLowerCase();
    if (pName.includes('platinum')) {
      color = 'from-amber-400 via-yellow-500 to-amber-600';
      glow = 'rgba(245, 158, 11, 0.4)';
    } else if (pName.includes('gold')) {
      color = 'from-teal-400 via-emerald-500 to-emerald-600';
      glow = 'rgba(16, 185, 129, 0.4)';
    }
  }

  return {
    id: supabaseUser.id,
    fullName,
    email,
    mobile,
    city: supabaseUser.user_metadata?.city || '',
    memberId: `BDN-${supabaseUser.id.slice(0, 4).toUpperCase()}-2026`,
    planName,
    planPrice,
    planType,
    subscriptionStatus,
    real_wallet_balance,
    demo_wallet_balance,
    is_demo_user,
    ledger,
    demo_transactions,
    subscription_payment_record: record || null,
    subscription_source: hasActiveRecord ? (record.subscription_source || supabaseUser.user_metadata?.subscription_source) : null,
    color,
    glow,
    drawToken: `TRC-${Math.floor(100000 + Math.random() * 900000)}`,
    dob,
    preferredLanguage,
    dietaryPreferences,
    accessibilityRequirements,
    savedTravelers,
    savedPickups,
    supabaseUser
  };
};

/* ---------- App ---------- */

export default function App() {
  const introComplete = true;

  useEffect(() => {
    if (shouldOpenStaticLanding(window.location.pathname)) {
      window.location.replace(getStaticLandingUrl(window.location.search, window.location.hash));
    }
  }, []);

  const [view, setView] = useState<
    'landing' | 'login' | 'register' | 'terms' | 'dashboard' | 'paid-tour' | 'error' |
    'legal' | 'privacy-policy' | 'terms-and-conditions' | 'refund-policy' |
    'cancellation-policy' | 'membership-rules' | 'website-disclaimer' |
    'cookie-policy' | 'affiliate-agent-policy' | 'grievance-redressal' | 'verify-coupon' |
    'admin'
  >(() => {
    const path = window.location.pathname.replace(/^\/|\/$/g, '');
    const validViews = [
      'landing', 'login', 'register', 'terms', 'dashboard', 'paid-tour', 'error',
      'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy',
      'cancellation-policy', 'membership-rules', 'website-disclaimer',
      'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal', 'verify-coupon',
      'admin'
    ];
    if (!path) return 'landing';
    if (validViews.includes(path)) return path as any;
    return 'error';
  });
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string>(() => {
    return getRegistrationPlanFromSearch(window.location.search)
      || sessionStorage.getItem('pendingPlanName')
      || 'Silver';
  });
  const [prefilledData, setPrefilledData] = useState<any>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');

  const handleSetView = useCallback((newView: any, hash?: string) => {
    setView(newView);
    const path = newView === 'landing' ? '/' : `/${newView}${hash || ''}`;
    const currentFull = window.location.pathname + window.location.hash;
    if (currentFull !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setCurrentUser(mapped);
        const redirected = checkPendingPlanAndRedirectLocally();
        if (!redirected && window.location.pathname === '/login') {
          handleSetView('dashboard');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const mapped = mapSupabaseUser(session.user);
        setCurrentUser(mapped);
        if (event === 'SIGNED_IN') {
          const redirected = checkPendingPlanAndRedirectLocally();
          if (!redirected && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
            handleSetView('dashboard');
          }
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSetView]);

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
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const validViews = [
        'landing', 'login', 'register', 'terms', 'dashboard', 'paid-tour', 'error',
        'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy',
        'cancellation-policy', 'membership-rules', 'website-disclaimer',
        'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal', 'verify-coupon',
        'admin'
      ];

      if (!path) {
        setView('landing');
      } else if (validViews.includes(path)) {
        setView(path as any);
        if (path === 'register') {
          const planFromQuery = getRegistrationPlanFromSearch(window.location.search);
          if (planFromQuery) {
            setSelectedPlanName(planFromQuery);
            setPendingPlan(null);
            sessionStorage.removeItem('pendingPlanName');
          }
        }
      } else {
        setView('error');
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
      'verify-coupon': 'Verify Coupon | Beduine Tour & Travels',
      admin: 'Admin Portal | Beduine Tour & Travels',
      'privacy-policy': 'Privacy Policy | Beduine Tour & Travels',
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
      landing: 'Join Beduine Tour & Travels subscription membership plans. Get fixed travel Discount Credits on paid tours, and TRC (Travel Reward Credit) tokens for weekly reward participation.',
      login: 'Sign in to your Beduine Tour & Travels member account.',
      register: 'Choose your travel subscription plan, create an account, and start earning travel rewards.',
      dashboard: 'View your subscription details, wallet balance, travel reward credits (TRC), and book your next tour.',
      'paid-tour': 'Explore and book premium domestic and international travel packages with your Discount Credits.',
      'verify-coupon': 'Verify the authenticity of your Beduine tour coupon.',
      admin: 'Beduine Tour & Travels administrative management portal.',
      'privacy-policy': 'Read how Beduine Tour & Travels handles and protects your personal data.',
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
  const isDemoOrAdminUser = currentUser?.is_demo_user || 
                            currentUser?.email?.includes('demo') || 
                            currentUser?.email?.includes('test') || 
                            currentUser?.email?.includes('admin') ||
                            currentUser?.email?.includes('arunasish');
  const showDemoBanner = isDemoWalletEnabled && (!currentUser || isDemoOrAdminUser);

  return (
    <div className={`min-h-screen bg-cosmos text-ink relative ${showDemoBanner ? 'pt-9' : ''}`}>
      <DemoBanner currentUser={currentUser} />
      {/* Intro animation completely bypassed */}

      {introComplete && view !== 'paid-tour' && <CustomCursor />}

      {/* Main page content container - invisible during intro to prevent menu leak, then fades in beautifully */}
      <div className={`transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {view !== 'paid-tour' && <div className="noise fixed inset-0 pointer-events-none z-30" />}
        {['landing', 'terms', 'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy', 'cancellation-policy', 'membership-rules', 'website-disclaimer', 'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal'].includes(view) && (
          <Navbar 
            view={view} 
            setView={handleSetView} 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser}
            setLoginInitialMode={setLoginInitialMode}
            introComplete={introComplete}
          />
        )}

        <main className="relative z-10 flex flex-col gap-0">
          <Suspense fallback={<RouteFallback />}>
          {view === 'landing' ? (
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
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoginSuccess={(rawUser) => {
                const mapped = mapSupabaseUser(rawUser);
                setCurrentUser(mapped);
                const redirected = checkPendingPlanAndRedirect();
                if (!redirected) {
                  handleSetView('dashboard');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
              onRegisterSuccess={(userData) => {
                setCurrentUser(userData);
                handleSetView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
              onGoToAdmin={() => {
                handleSetView('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : view === 'admin' ? (
            <AdminPage
              user={currentUser}
              onBack={() => {
                handleSetView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLogout={() => {
                setCurrentUser(null);
                handleSetView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : view === 'paid-tour' ? (
            <PaidTourPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onNavigate={(v) => handleSetView(v as any)}
            />
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
            <LegalCenterPage onNavigate={handleSetView} />
          ) : view === 'privacy-policy' ? (
            <PrivacyPolicyPage onNavigate={handleSetView} />
          ) : view === 'refund-policy' ? (
            <RefundPolicyPage onNavigate={handleSetView} />
          ) : view === 'cancellation-policy' ? (
            <CancellationPolicyPage onNavigate={handleSetView} />
          ) : view === 'membership-rules' ? (
            <MembershipRulesPage onNavigate={handleSetView} />
          ) : view === 'website-disclaimer' ? (
            <WebsiteDisclaimerPage onNavigate={handleSetView} />
          ) : view === 'cookie-policy' ? (
            <CookiePolicyPage onNavigate={handleSetView} />
          ) : view === 'affiliate-agent-policy' ? (
            <AffiliateAgentPolicyPage onNavigate={handleSetView} />
          ) : view === 'grievance-redressal' ? (
            <GrievanceRedressalPage onNavigate={handleSetView} />
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
        {['landing', 'terms', 'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy', 'cancellation-policy', 'membership-rules', 'website-disclaimer', 'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal'].includes(view) && (
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
  );
}
