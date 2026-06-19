import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import {
  CinematicIntro,
  CustomCursor,
  LandingContent,
  RouteFallback,
  StickySubscribeButton,
} from './components/landing/LandingExperience';
import { FloatingButtons, Footer, MobileSticky, Navbar } from './components/landing/LandingShell';
import { TermsAndConditions } from './components/landing/TermsAndConditions';

const LoginPage = lazy(() => import('./LoginPage'));
const RegistrationPage = lazy(() => import('./RegistrationPage'));
const DashboardPage = lazy(() => import('./DashboardPage'));
const ErrorPage = lazy(() => import('./ErrorPage'));
const PaidTourPage = lazy(() => import('./PaidTourPage'));

const LegalCenterPage = lazy(() => import('./app/legal/page'));
const PrivacyPolicyPage = lazy(() => import('./app/privacy-policy/page'));
const TermsAndConditionsPage = lazy(() => import('./app/terms-and-conditions/page'));
const RefundPolicyPage = lazy(() => import('./app/refund-policy/page'));
const CancellationPolicyPage = lazy(() => import('./app/cancellation-policy/page'));
const MembershipRulesPage = lazy(() => import('./app/membership-rules/page'));
const WebsiteDisclaimerPage = lazy(() => import('./app/website-disclaimer/page'));
const CookiePolicyPage = lazy(() => import('./app/cookie-policy/page'));
const AffiliateAgentPolicyPage = lazy(() => import('./app/affiliate-agent-policy/page'));
const GrievanceRedressalPage = lazy(() => import('./app/grievance-redressal/page'));

import { CookieConsentBanner, CookieModalTrigger } from './components/legal/CookieConsentBanner';

/* ---------- App ---------- */

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const [view, setView] = useState<
    'landing' | 'login' | 'register' | 'terms' | 'dashboard' | 'paid-tour' | 'error' |
    'legal' | 'privacy-policy' | 'terms-and-conditions' | 'refund-policy' |
    'cancellation-policy' | 'membership-rules' | 'website-disclaimer' |
    'cookie-policy' | 'affiliate-agent-policy' | 'grievance-redressal'
  >('landing');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('Silver');
  const [prefilledData, setPrefilledData] = useState<any>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');

  const handleSetView = useCallback((newView: any) => {
    setView(newView);
    const path = newView === 'landing' ? '/' : `/${newView}`;
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectPlan = useCallback((planName: string) => {
    setSelectedPlanName(planName);
    setPrefilledData(null);
    if (currentUser) {
      handleSetView('register');
    } else {
      setPendingPlan(planName);
      setLoginInitialMode('login');
      handleSetView('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUser, handleSetView]);

  useEffect(() => {
    const handleLocationChange = (isInitial = false) => {
      const path = window.location.pathname.replace(/^\/|\/$/g, '');
      const validViews = [
        'landing', 'login', 'register', 'terms', 'dashboard', 'paid-tour', 'error',
        'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy',
        'cancellation-policy', 'membership-rules', 'website-disclaimer',
        'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal'
      ];
      const isPolicyPath = [
        'terms', 'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy',
        'cancellation-policy', 'membership-rules', 'website-disclaimer',
        'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal'
      ].includes(path);

      if (isInitial && isPolicyPath) {
        setView('landing');
        if (window.location.pathname !== '/') {
          window.history.replaceState(null, '', '/');
        }
      } else if (!path) {
        setView('landing');
      } else if (validViews.includes(path)) {
        setView(path as any);
      } else {
        setView('error');
      }
    };

    handleLocationChange(true);
    const onPopState = () => handleLocationChange(false);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);


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

  return (
    <div className="min-h-screen bg-cosmos text-ink relative">
      <AnimatePresence>{!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}</AnimatePresence>
      
      {introComplete && view !== 'paid-tour' && <CustomCursor />}

      {/* Main page content container - invisible during intro to prevent menu leak, then fades in beautifully */}
      <div className={`transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {view !== 'paid-tour' && <div className="noise fixed inset-0 pointer-events-none z-30" />}
        {['landing', 'terms', 'legal', 'privacy-policy', 'terms-and-conditions', 'refund-policy', 'cancellation-policy', 'membership-rules', 'website-disclaimer', 'cookie-policy', 'affiliate-agent-policy', 'grievance-redressal'].includes(view) && (
          <Navbar 
            view={view} 
            setView={setView} 
            currentUser={currentUser} 
            setCurrentUser={setCurrentUser}
            setLoginInitialMode={setLoginInitialMode}
            introComplete={introComplete}
          />
        )}

        <main className="relative z-10 flex flex-col gap-0">
          <Suspense fallback={<RouteFallback />}>
          {view === 'landing' ? (
            <LandingContent onSelectPlan={handleSelectPlan} />
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
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                if (pendingPlan) {
                  setSelectedPlanName(pendingPlan);
                  handleSetView('register');
                  setPendingPlan(null);
                } else {
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
            />
          ) : view === 'paid-tour' ? (
            <PaidTourPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
          ) : view === 'terms' ? (
            <div className="pt-24 lg:pt-32 pb-16 min-h-[70vh] flex flex-col items-center">
              <div className="max-w-4xl w-full px-5">
                <button
                  onClick={() => {
                    handleSetView('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mb-8 inline-flex items-center gap-2 text-sm text-[#0096C7] hover:text-[#00B4D8] font-bold transition-all focus:outline-none"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                </button>
                <div className="glass rounded-3xl p-6 lg:p-12 border border-slate-line/80 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-neon-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <TermsAndConditions />
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      handleSetView('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="glow-cta px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform inline-flex items-center gap-2"
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
          ) : view === 'terms-and-conditions' ? (
            <TermsAndConditionsPage onNavigate={handleSetView} />
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
