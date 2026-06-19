import { useState, useEffect } from 'react';
import { ShieldCheck, Settings } from 'lucide-react';
import { CookiePreferenceModal } from './CookiePreferenceModal';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Disabled automatic display of cookie/privacy consent banner on landing page load.
    // The banner/modal should only be shown when specifically requested by the user.
    /*
    const consent = localStorage.getItem('beduine_cookie_consent_v1');
    if (!consent) {
      // Small delay for natural entrance animation
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    */
  }, []);

  const handleAcceptAll = () => {
    const allPrefs = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    const consentObj = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      categories: allPrefs
    };
    localStorage.setItem('beduine_cookie_consent_v1', JSON.stringify(consentObj));
    setVisible(false);
    // Optional: dispatch custom event to notify analytics trackers
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  const handleRejectOptional = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    const consentObj = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      categories: essentialOnly
    };
    localStorage.setItem('beduine_cookie_consent_v1', JSON.stringify(consentObj));
    setVisible(false);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  const handlePreferencesSaved = (_prefs: Record<string, boolean>) => {
    setVisible(false);
    window.dispatchEvent(new Event('cookie_consent_updated'));
  };

  if (!visible) {
    return (
      <CookiePreferenceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handlePreferencesSaved}
      />
    );
  }

  return (
    <>
      <div className="no-print fixed bottom-0 inset-x-0 z-999 z-50 p-4 sm:p-5 select-none animate-fadeIn">
        <div className="max-w-6xl mx-auto rounded-[24px] border border-slate-line bg-white/94 backdrop-blur-md shadow-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-cyan/5 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-deep/10 flex items-center justify-center text-cyan-deep shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-display font-bold text-sm text-[#10233F] mb-1">Your privacy choices</h4>
              <p className="text-xs text-[#728091] leading-relaxed max-w-3xl">
                We use essential cookies to operate and secure this website. With your permission, we may also use analytics and marketing cookies to understand website usage and provide relevant travel offers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-[#10233F] bg-white hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cookie Settings</span>
            </button>
            <button
              onClick={handleRejectOptional}
              className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-[#10233F] bg-white hover:bg-slate-50 transition-all cursor-pointer focus:outline-none"
            >
              Reject Optional
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-cyan-deep hover:bg-[#007A94] transition-all cursor-pointer border-none shadow-md shadow-cyan-950/10"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      <CookiePreferenceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handlePreferencesSaved}
      />
    </>
  );
}

// Function to programmatically open cookie preference modal from elsewhere (like footer links)
export function openCookiePreferenceModal() {
  const customEvent = new CustomEvent('open_cookie_preferences');
  window.dispatchEvent(customEvent);
}

export function CookieModalTrigger({ children }: { children: React.ReactNode }) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setModalOpen(true);
    window.addEventListener('open_cookie_preferences', handleOpen);
    return () => window.removeEventListener('open_cookie_preferences', handleOpen);
  }, []);

  return (
    <>
      <span onClick={() => setModalOpen(true)} className="cursor-pointer">
        {children}
      </span>
      <CookiePreferenceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {}}
      />
    </>
  );
}
