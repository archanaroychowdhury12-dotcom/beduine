import { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { COOKIE_CATEGORIES } from '../../data/cookieCategories';

interface CookiePreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: Record<string, boolean>) => void;
}

export function CookiePreferenceModal({ isOpen, onClose, onSave }: CookiePreferenceModalProps) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('beduine_cookie_consent_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPrefs(parsed.categories || {
          essential: true,
          functional: false,
          analytics: false,
          marketing: false
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    if (id === 'essential') return;
    setPrefs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    const consentObj = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      categories: prefs
    };
    localStorage.setItem('beduine_cookie_consent_v1', JSON.stringify(consentObj));
    onSave(prefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-line/80 shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan/10 to-transparent rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-deep" />
            <h3 className="font-display font-bold text-lg text-[#10233F]">Cookie Preference Center</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-500 cursor-pointer border-none"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1">
          <p className="text-xs text-[#728091] font-mono leading-relaxed">
            We use cookies to improve your travel searching experience. Customize your cookie settings below. Essential cookies are necessary to operate the booking system.
          </p>

          <div className="space-y-4">
            {COOKIE_CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-start gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-bold text-sm text-[#10233F]">{cat.name}</span>
                    {cat.required && (
                      <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#728091] leading-relaxed mb-3">{cat.description}</p>
                  
                  {/* Expanded cookie list */}
                  <div className="bg-white/80 border border-slate-100 rounded-xl p-2.5">
                    <div className="text-[10px] font-bold text-[#10233F] font-mono mb-1.5">Cookies used:</div>
                    <div className="grid gap-2">
                      {cat.cookies.map(ck => (
                        <div key={ck.name} className="flex justify-between items-start text-[10px] font-mono border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                          <div>
                            <span className="font-bold text-cyan-deep">{ck.name}</span>
                            <span className="text-slate-400 mx-1">({ck.provider})</span>
                            <div className="text-slate-500 mt-0.5">{ck.purpose}</div>
                          </div>
                          <span className="text-slate-500 shrink-0">{ck.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={cat.required}
                  onClick={() => handleToggle(cat.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    prefs[cat.id] ? 'bg-cyan-deep' : 'bg-slate-200'
                  } ${cat.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      prefs[cat.id] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => {
              const allOn = { essential: true, functional: true, analytics: true, marketing: true };
              setPrefs(allOn);
            }}
            className="flex-1 py-2.5 text-xs font-bold text-[#10233F] bg-slate-100 rounded-full hover:bg-slate-200 transition-all cursor-pointer border-none"
          >
            Allow All
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-cyan-deep rounded-full hover:bg-[#007A94] transition-all cursor-pointer border-none shadow-md shadow-cyan-950/10"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
