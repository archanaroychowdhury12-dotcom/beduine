import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Mail, Phone, Lock, User
} from 'lucide-react';
import { WelcomeScreen } from '@/components/ui/onboarding-welcome-screen';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: any) => void;
  initialMode?: 'login' | 'register';
  onRedirectToRegister?: () => void;
}

export default function LoginPage({ onBack, onLoginSuccess, initialMode = 'login' }: LoginPageProps) {
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'signup-auth'>(initialMode);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customStep, setCustomStep] = useState(1); // 1: Email, 2: Name/Details

  // Phone OTP states
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [phoneStep, setPhoneStep] = useState(1); // 1: Number, 2: OTP, 3: Name
  const [otpSent, setOtpSent] = useState(false);
  if (otpSent) { /* dummy read to avoid TS6133 */ }

  const handleSelectAccount = (name: string, email: string, mobile?: string) => {
    const mockUser = {
      fullName: name,
      email: email,
      mobile: mobile || '',
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

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneStep === 1) {
      if (phoneNumber.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      // Simulate sending OTP
      setOtpSent(true);
      setPhoneStep(2);
    } else if (phoneStep === 2) {
      if (phoneOtp.length < 4) {
        alert('Please enter the 4-digit OTP.');
        return;
      }
      // Simulate OTP verification
      setPhoneStep(3);
    } else {
      if (!phoneName.trim()) {
        alert('Please enter your full name.');
        return;
      }
      handleSelectAccount(phoneName, '', phoneNumber);
    }
  };

  const handleFacebookLogin = () => {
    // Simulate Facebook login
    handleSelectAccount('Facebook User', 'user@facebook.com');
  };

  return (
    <section className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center bg-[#FFF8F6]">
      {/* Travel Background Image (Clear) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/travel_login_bg.jpg" 
          alt="Travel Background" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Atmospheric highlights on top */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-25 bg-[#FF6B6B]/20 z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full filter blur-[120px] pointer-events-none opacity-20 bg-[#8B5CF6]/15 z-[1]" />

      {/* Back button */}
      <div className="max-w-md w-full mb-6 z-10">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFF] hover:text-[#FF6B6B] transition-colors bg-black/35 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 cursor-pointer backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </div>

      <motion.div
        key={viewMode}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 90 }}
        className="max-w-md w-full z-10 bg-white/85 backdrop-blur-2xl border border-white/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(30,49,71,0.18)] relative"
      >
        {viewMode === 'register' ? (
          <WelcomeScreen
            imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=compress&cs=tinysrgb&w=800&q=80"
            title={
              <>
                Welcome to <span className="text-[#FF6B6B] font-black">Beduine</span>
              </>
            }
            description="Create your membership account to receive weekly eligible entry access, fixed travel Discount Credits, and curated destination benefits."
            buttonText="Create Your Account"
            onButtonClick={() => setViewMode('signup-auth')}
            secondaryActionText="Already have an account? Login Here"
            onSecondaryActionClick={() => setViewMode('login')}
          />
        ) : (
          <div className="p-8">
            {/* Animated Brand Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/80 shadow-lg shadow-black/10 bg-white flex items-center justify-center p-2 mx-auto mb-4">
                <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="font-display text-2xl font-black text-slate-800 uppercase tracking-tight">BEDUINE</h2>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#FF6B6B] font-extrabold font-mono">Tour & Travels</p>
              <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                Choose Your Plan. Try Your Luck. Travel Beyond Limits.
              </p>
            </div>

            {/* Action Form / Buttons */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 text-center mb-1">
                  {viewMode === 'signup-auth' ? 'Create Your Account' : 'User Account Login'}
                </h3>
                <p className="text-[11px] text-slate-400 text-center">
                  {viewMode === 'signup-auth' 
                    ? 'Sign up with Gmail, Facebook, or Phone Number to create your travel profile.'
                    : 'Sign in using your Google, Facebook, or Phone OTP to access your dashboard.'}
                </p>
              </div>

              {/* Social Login Buttons */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-3.5 px-4 rounded-full bg-white text-slate-800 font-bold hover:bg-slate-50/50 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm border border-slate-200 text-sm hover:border-slate-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437s2.882-6.437 6.437-6.437c1.558 0 2.977.557 4.088 1.487l3.056-3.056C19.263 2.223 15.974 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 10.871-11.24 0-.768-.068-1.513-.193-1.955H12.24z"
                  />
                </svg>
                {viewMode === 'signup-auth' ? 'Sign Up with Google / Gmail' : 'Sign In with Google / Gmail'}
              </button>

              <button
                type="button"
                onClick={handleFacebookLogin}
                className="w-full py-3.5 px-4 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm border-none text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {viewMode === 'signup-auth' ? 'Sign Up with Facebook' : 'Sign In with Facebook'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400">
                  Or continue with
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Tab toggle: Email / Phone */}
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                    authMethod === 'email'
                      ? 'bg-rose-50/50 border-[#FF6B6B] text-[#FF6B6B] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                    authMethod === 'phone'
                      ? 'bg-rose-50/50 border-[#FF6B6B] text-[#FF6B6B] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" /> Phone OTP
                </button>
              </div>

              {/* Email Method */}
              {authMethod === 'email' && (
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  {customStep === 1 ? (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="loginEmail">Gmail Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          id="loginEmail"
                          required
                          placeholder="your.email@gmail.com"
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:bg-white transition-all focus:ring-2 focus:ring-[#FF6B6B]/15 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="loginName">Your Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          id="loginName"
                          required
                          placeholder="e.g. Rahul Sen"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:bg-white transition-all focus:ring-2 focus:ring-[#FF6B6B]/15 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 text-white font-bold rounded-full text-xs uppercase tracking-wider border-none cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] shadow-md shadow-rose-200/50"
                    style={{ background: 'linear-gradient(135deg, #FF6B6B, #8B5CF6)' }}
                  >
                    {customStep === 1 
                      ? 'Next' 
                      : viewMode === 'signup-auth' ? 'Create Account' : 'Log In'}{' '}
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </form>
              )}

              {/* Phone OTP Method */}
              {authMethod === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  {phoneStep === 1 && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="phoneInput">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono">+91</span>
                        <input
                          type="tel"
                          id="phoneInput"
                          required
                          maxLength={10}
                          placeholder="9876543210"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-20 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:bg-white transition-all focus:ring-2 focus:ring-[#FF6B6B]/15 font-mono placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}
                  {phoneStep === 2 && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="otpInput">Enter OTP</label>
                      <p className="text-[10px] text-[#FF6B6B] font-bold mb-2">✓ OTP sent to +91 {phoneNumber}</p>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          id="otpInput"
                          required
                          maxLength={6}
                          placeholder="Enter 4-digit OTP"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:bg-white transition-all focus:ring-2 focus:ring-[#FF6B6B]/15 font-mono tracking-[0.4em] text-center placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setPhoneStep(1); setPhoneOtp(''); setOtpSent(false); }}
                        className="text-[10px] text-[#FF6B6B] font-bold hover:underline mt-2 cursor-pointer bg-transparent border-none"
                      >
                        ← Change Number
                      </button>
                    </div>
                  )}
                  {phoneStep === 3 && (
                    <div>
                      <p className="text-[10px] text-emerald-600 mb-3 flex items-center gap-1 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Phone verified successfully!</p>
                      <label className="block text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2" htmlFor="phoneNameInput">Your Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          id="phoneNameInput"
                          required
                          placeholder="e.g. Rahul Sen"
                          value={phoneName}
                          onChange={(e) => setPhoneName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] focus:bg-white transition-all focus:ring-2 focus:ring-[#FF6B6B]/15 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-3 text-white font-bold rounded-full text-xs uppercase tracking-wider border-none cursor-pointer flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] shadow-md shadow-rose-200/50"
                    style={{ background: 'linear-gradient(135deg, #FF6B6B, #8B5CF6)' }}
                  >
                    {phoneStep === 1 ? 'Send OTP' : phoneStep === 2 ? 'Verify OTP' : 'Create Account'}{' '}
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </form>
              )}

              {/* Modern bottom action toggle */}
              <div className="pt-5 border-t border-slate-200 mt-6 flex flex-col items-center w-full">
                {viewMode === 'signup-auth' ? (
                  <div className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-250/30 shadow-sm hover:border-slate-300 transition-all">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#FF6B6B] uppercase tracking-widest font-mono font-black">Existing Subscriber?</span>
                      <span className="text-xs text-slate-700 font-bold mt-0.5">Already have an account?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('login')}
                      className="px-5 py-2 rounded-full text-xs font-bold text-white transition-all hover:scale-[1.05] active:scale-[0.98] cursor-pointer shadow-md border-none flex items-center gap-1 hover:brightness-110"
                      style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)' }}
                    >
                      Login Here
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-250/30 shadow-sm hover:border-slate-300 transition-all">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#8B5CF6] uppercase tracking-widest font-mono font-black">New Traveler?</span>
                      <span className="text-xs text-slate-700 font-bold mt-0.5">Don't have an account?</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewMode('signup-auth')}
                      className="px-5 py-2 rounded-full text-xs font-bold text-white transition-all hover:scale-[1.05] active:scale-[0.98] cursor-pointer shadow-md border border-white/10 hover:border-white/20 flex items-center gap-1 hover:brightness-110"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #C084FC)' }}
                    >
                      Sign Up Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security strip */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-center gap-3 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B6B]" /> Secure Authentication (Google OAuth, Facebook, OTP)
            </div>
          </div>
        )}
      </motion.div>

      {/* Google Selector Modal Simulation */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl relative"
            >
              <h3 className="text-base font-bold text-slate-800 mb-1">Choose a Google Account</h3>
              <p className="text-xs text-slate-400 mb-5">to sign in to BEDUINE Dashboard</p>
              
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
                    className="w-full text-left p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#FF6B6B]/40 hover:bg-slate-100/50 transition-all flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B6B] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-sm">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800">{acc.name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{acc.email}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 text-right">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer border-none bg-transparent font-bold"
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
