import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Mail, Key
} from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginPage({ onBack, onLoginSuccess }: LoginPageProps) {
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customStep, setCustomStep] = useState(1); // 1: Email, 2: Name/Details

  const handleSelectAccount = (name: string, email: string) => {
    const mockUser = {
      fullName: name,
      email: email,
      mobile: '',
      city: '',
      memberId: `BDN-${Math.floor(1000 + Math.random() * 9000)}-2026`,
      planName: '', // Unsubscribed initially unless updated
      planPrice: '',
      planType: '',
      color: 'from-slate-400 via-slate-500 to-slate-700',
      glow: 'rgba(148, 163, 184, 0.4)',
      drawToken: `LDC-${Math.floor(100000 + Math.random() * 900000)}`
    };
    onLoginSuccess(mockUser);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStep === 1) {
      if (!customEmail.endsWith('@gmail.com') && !customEmail.includes('@')) {
        alert('Please enter a valid Gmail address.');
        return;
      }
      setCustomStep(2);
    } else {
      if (!customName.trim()) {
        alert('Please enter your full name.');
        return;
      }
      handleSelectAccount(customName, customEmail);
    }
  };

  return (
    <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center bg-cosmos">
      {/* Dynamic atmospheric background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-20 bg-cyan" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-15 bg-violet" />

      {/* Back button */}
      <div className="max-w-md w-full mb-6 z-10">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#7E919D] hover:text-[#18D7F2] transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 90 }}
        className="max-w-md w-full z-10 bg-[#081F2E]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative"
      >
        {/* Animated Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos flex items-center justify-center p-2 mx-auto mb-4">
            <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">BEDUINE</h2>
          <p className="text-[9px] uppercase tracking-[0.25em] text-cyan font-bold font-mono">Tour & Travels</p>
          <p className="text-xs text-ink/60 mt-3 max-w-xs mx-auto">
            Choose Your Plan. Try Your Luck. Travel Beyond Limits.
          </p>
        </div>

        {/* Action Form / Buttons */}
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-bold text-white text-center mb-1">User Account Login</h3>
            <p className="text-[11px] text-ink/50 text-center">Sign in using your Google account or email credentials to access your active subscription draws and discount wallet dashboard.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-4 px-4 rounded-full bg-white text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg hover:scale-[1.02] border-none text-sm relative overflow-hidden"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437s2.882-6.437 6.437-6.437c1.558 0 2.977.557 4.088 1.487l3.056-3.056C19.263 2.223 15.974 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 10.871-11.24 0-.768-.068-1.513-.193-1.955H12.24z"
              />
            </svg>
            Sign In with Google / Gmail
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[9px] uppercase font-mono tracking-widest text-ink/40">Or Enter Gmail</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Manual Input form */}
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            {customStep === 1 ? (
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="loginEmail">Gmail Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                  <input
                    type="email"
                    id="loginEmail"
                    required
                    placeholder="your.email@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#051520]/60 border border-white/10 text-white text-sm outline-none focus:border-cyan transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="loginName">Your Full Name</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                  <input
                    type="text"
                    id="loginName"
                    required
                    placeholder="e.g. Rahul Sen"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#051520]/60 border border-white/10 text-white text-sm outline-none focus:border-cyan transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 premium-register-btn text-white font-bold rounded-full text-xs uppercase tracking-wider border-none cursor-pointer flex items-center justify-center gap-1.5"
            >
              {customStep === 1 ? 'Next' : 'Authorize & Log In'} <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>
        </div>

        {/* Security strip */}
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-ink/45">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan" /> Secure Google Authentication (OAuth)
        </div>
      </motion.div>

      {/* Google Selector Modal Simulation */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-3xl p-6 max-w-sm w-full border border-white/15 shadow-2xl relative"
            >
              <h3 className="text-base font-bold text-white mb-2">Choose a Google Account</h3>
              <p className="text-xs text-ink/60 mb-5">to sign in to BEDUINE Dashboard</p>
              
              <div className="space-y-3">
                {[
                  { name: 'Arunasish Roychowdhury', email: 'arunasish.roy@gmail.com' },
                  { name: 'Rahul Sen', email: 'rahul.sen99@gmail.com' },
                  { name: 'Guest Traveler', email: 'traveler.guest@gmail.com' }
                ].map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => {
                      handleSelectAccount(acc.name, acc.email);
                      setShowGoogleModal(false);
                    }}
                    className="w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan/40 hover:bg-white/10 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan to-blue-500 flex items-center justify-center font-bold text-cosmos text-sm">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white">{acc.name}</span>
                      <span className="block text-[10px] text-ink/50 font-mono">{acc.email}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 text-right">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-ink hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
