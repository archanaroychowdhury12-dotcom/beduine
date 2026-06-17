import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ShieldCheck, Mail, Phone, Lock, User, Eye, EyeOff, Sparkles, Globe, Plane, Heart, ArrowRight
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
  const [showPassword, setShowPassword] = useState(false);

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
    if (viewMode === 'login') {
      if (!customEmail.endsWith('@gmail.com') && !customEmail.includes('@')) {
        alert('Please enter a valid Gmail address.');
        return;
      }
      handleSelectAccount(customEmail.split('@')[0], customEmail);
    } else {
      if (customStep === 1) {
        if (!customEmail.endsWith('@gmail.com') && !customEmail.includes('@')) {
          alert('Please enter a valid Gmail address.');
          return;
        }
        setViewMode('signup-auth');
        setCustomStep(2);
      } else {
        if (!customName.trim()) {
          alert('Please enter your full name.');
          return;
        }
        handleSelectAccount(customName, customEmail);
      }
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneStep === 1) {
      if (phoneNumber.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }
      setOtpSent(true);
      setPhoneStep(2);
    } else if (phoneStep === 2) {
      if (phoneOtp.length < 4) {
        alert('Please enter the 4-digit OTP.');
        return;
      }
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
    handleSelectAccount('Traveler User', 'user@social.com');
  };

  return (
    <section 
      className="min-h-screen relative overflow-x-hidden flex flex-col justify-start select-none" 
      style={{ 
        backgroundImage: "url('/images/login_bg_clouds.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay for soft blending */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      {/* Back button - absolute positioned */}
      <div className="absolute top-24 left-4 sm:top-28 sm:left-6 lg:left-8 z-20">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-[#FF6B6B] transition-colors bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 hover:border-slate-300 cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col lg:flex-row pt-36 lg:pt-40 pb-12 items-center justify-between">
        
        {/* Left Column (Copy & Illustration) */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center relative pb-12 lg:pb-0 overflow-hidden pr-6">
          <div className="z-10 max-w-md text-left">
            <h1 className="font-serif text-[54px] xl:text-[62px] font-bold text-[#16233A] leading-[1.08] tracking-tight">
              Pack your <br />
              <span className="italic font-normal text-[#FF6B6B] lowercase">dreams.</span> <br />
              We'll plan the <br />
              journey.
            </h1>
            
            <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-[280px] mt-6">
              Smart planning, handpicked experiences, unforgettable memories — all in one place.
            </p>

            <div className="flex flex-col gap-3.5 mt-8">
              {/* Stat 1 */}
              <div className="flex items-center gap-4 bg-white/45 backdrop-blur-md border border-white/60 rounded-[24px] p-4 w-[220px] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-red-100 flex items-center justify-center text-[#FF6B6B]">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-800">120+</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destinations</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4 bg-white/45 backdrop-blur-md border border-white/60 rounded-[24px] p-4 w-[220px] shadow-sm">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-red-100 flex items-center justify-center text-[#FF6B6B]">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-800">98%</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Happy Travelers</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Large open suitcase resting on clouds with radial mask for seamless blend */}
          <div className="absolute right-[-80px] bottom-0 w-[480px] xl:w-[540px] pointer-events-none select-none z-[1] hidden lg:block">
            <img 
              src="/images/login_suitcase.png" 
              alt="Vintage Travel Suitcase" 
              className="w-full h-auto object-contain"
              style={{
                maskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 80%)'
              }}
            />
          </div>

          {/* Dotted flight path - contained inside left column */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2] hidden lg:block">
            <svg className="w-full h-full" style={{ filter: 'drop-shadow(0px 2px 8px rgba(196, 149, 106, 0.12))' }}>
              <path 
                d="M 50,420 Q 200,300 280,320 T 380,150" 
                fill="transparent" 
                stroke="#C4956A" 
                strokeWidth="1.5" 
                strokeDasharray="4 6" 
                className="opacity-30"
              />
            </svg>
            <motion.div 
              className="absolute text-[#C4956A]/50"
              style={{ left: '280px', top: '320px' }}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Plane className="w-4 h-4 rotate-[35deg]" />
            </motion.div>
          </div>

          {/* Circular stamp bottom center - adjusted position */}
          <div className="absolute left-[35%] bottom-4 z-10 hidden lg:flex flex-col items-center justify-center pointer-events-none opacity-80">
            <div className="w-24 h-24 rounded-full border border-dashed border-[#C4956A]/40 flex flex-col items-center justify-center relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text className="text-[7.5px] font-bold fill-[#C4956A] uppercase tracking-[0.1em] font-mono">
                  <textPath xlinkHref="#circlePath" startOffset="0%">
                    • Curated with Care • Beduine Travel
                  </textPath>
                </text>
              </svg>
              <div className="flex flex-col items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#C4956A] opacity-75" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Frosted Glass Auth Card) */}
        <div className="w-full lg:w-[45%] flex items-center justify-center z-10 relative">
          <div className="w-full max-w-[480px] rounded-[38px] border border-white/60 bg-white/40 backdrop-blur-xl shadow-[0_24px_60px_rgba(196,149,106,0.12)] p-9 relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {viewMode === 'register' ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
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
                </motion.div>
              ) : (
                <motion.div
                  key="auth-forms"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Top Paper Airplane Icon inside circle */}
                  <div className="flex justify-start">
                    <div className="w-10 h-10 rounded-full bg-[#FF6B6B]/10 flex items-center justify-center p-2.5">
                      <Plane className="w-full h-full text-[#FF6B6B] rotate-45" />
                    </div>
                  </div>

                  {/* Header Title */}
                  <div className="text-left">
                    <h2 className="font-display text-2xl font-black text-slate-800 tracking-tight leading-tight uppercase">
                      {viewMode === 'signup-auth' ? 'YOUR GATEWAY TO\nNEW ADVENTURES' : 'YOUR GATEWAY TO\nUNFORGETTABLE JOURNEYS'}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed font-semibold">
                      {viewMode === 'signup-auth'
                        ? 'Sign up to start your travel journey with BEDUINE. Your dream destination is just a click away!'
                        : 'Ready to embark on your next adventure? Log in now and let Beduine take you there. Your dream destination is just a click away!'}
                    </p>
                  </div>

                  {/* Tab Selector: Email / Phone OTP */}
                  <div className="flex gap-2 border border-slate-200/50 p-1.5 rounded-[18px] bg-white/60 backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('email')}
                      className={`flex-1 py-3 rounded-[14px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border-none ${
                        authMethod === 'email'
                          ? 'bg-rose-50/70 border border-[#FF6B6B]/20 text-[#FF6B6B] shadow-sm shadow-[#FF6B6B]/5 font-extrabold'
                          : 'bg-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> EMAIL
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('phone')}
                      className={`flex-1 py-3 rounded-[14px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all border-none ${
                        authMethod === 'phone'
                          ? 'bg-rose-50/70 border border-[#FF6B6B]/20 text-[#FF6B6B] shadow-sm shadow-[#FF6B6B]/5 font-extrabold'
                          : 'bg-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" /> PHONE OTP
                    </button>
                  </div>

                  {/* Form Submission */}
                  {authMethod === 'email' ? (
                    <form onSubmit={handleCustomSubmit} className="space-y-4">
                      {customStep === 1 ? (
                        <div className="space-y-4 text-left">
                          <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="loginEmail">Email</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="email"
                                id="loginEmail"
                                required
                                placeholder="Input email"
                                value={customEmail}
                                onChange={(e) => setCustomEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border border-slate-200/80 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] transition-all focus:ring-2 focus:ring-[#FF6B6B]/10 placeholder:text-slate-400"
                              />
                            </div>
                          </div>

                          {viewMode === 'login' && (
                            <div>
                              <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="loginPassword">Password</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  id="loginPassword"
                                  placeholder="••••••••••"
                                  defaultValue="password123"
                                  className="w-full pl-11 pr-11 py-4 rounded-xl bg-white border border-slate-200/80 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] transition-all focus:ring-2 focus:ring-[#FF6B6B]/10 placeholder:text-slate-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          )}

                          {viewMode === 'login' && (
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <label className="flex items-center gap-2 text-slate-500 cursor-pointer font-semibold">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-[#FF6B6B] cursor-pointer" />
                                <span>Remember me</span>
                              </label>
                              <button type="button" className="text-slate-450 hover:text-[#FF6B6B] font-bold cursor-pointer bg-transparent border-none transition-colors">
                                Forgot your password?
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-left">
                          <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="loginName">Your Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              id="loginName"
                              required
                              placeholder="e.g. Rahul Sen"
                              value={customName}
                              onChange={(e) => setCustomName(e.target.value)}
                              className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border border-slate-200/80 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] transition-all focus:ring-2 focus:ring-[#FF6B6B]/10 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-4 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-all duration-350 hover:shadow-lg hover:shadow-[#A855F7]/15 hover:scale-[1.01] active:scale-[0.99] border-none"
                        style={{
                          background: 'linear-gradient(90deg, #FF6B6B 0%, #8B5CF6 100%)',
                        }}
                      >
                        <span>
                          {viewMode === 'login' 
                            ? 'Log In' 
                            : customStep === 1 ? 'Next' : 'Create Account'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                      {phoneStep === 1 && (
                        <div className="text-left">
                          <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="phoneInput">Mobile Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-bold font-mono">+91</span>
                            <input
                              type="tel"
                              id="phoneInput"
                              required
                              maxLength={10}
                              placeholder="9876543210"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                              className="w-full pl-20 pr-4 py-4 rounded-xl bg-white border border-slate-200/80 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] transition-all focus:ring-2 focus:ring-[#FF6B6B]/10 font-mono placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      )}
                      {phoneStep === 2 && (
                        <div className="text-left">
                          <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="otpInput">Enter OTP</label>
                          <p className="text-[10px] text-[#FF6B6B] font-bold mb-2">✓ OTP sent to +91 {phoneNumber}</p>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              id="otpInput"
                              required
                              maxLength={4}
                              placeholder="Enter 4-digit OTP"
                              value={phoneOtp}
                              onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border border-slate-200/80 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] transition-all focus:ring-2 focus:ring-[#FF6B6B]/10 font-mono tracking-[0.4em] text-center placeholder:text-slate-400"
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
                        <div className="text-left">
                          <p className="text-[10px] text-emerald-600 mb-3 flex items-center gap-1 font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" /> Phone verified successfully!
                          </p>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5" htmlFor="phoneNameInput">Your Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              id="phoneNameInput"
                              required
                              placeholder="e.g. Rahul Sen"
                              value={phoneName}
                              onChange={(e) => setPhoneName(e.target.value)}
                              className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border border-slate-200/80 text-slate-800 text-sm outline-none focus:border-[#FF6B6B] transition-all focus:ring-2 focus:ring-[#FF6B6B]/10 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-4 text-white font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 transition-all duration-350 hover:shadow-lg hover:shadow-[#A855F7]/15 hover:scale-[1.01] active:scale-[0.99] border-none"
                        style={{
                          background: 'linear-gradient(90deg, #FF6B6B 0%, #8B5CF6 100%)',
                        }}
                      >
                        <span>{phoneStep === 1 ? 'Send OTP' : phoneStep === 2 ? 'Verify OTP' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}

                  {/* Or separator */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-slate-200/80 flex-1" />
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-sans">Or</span>
                    <div className="h-px bg-slate-200/80 flex-1" />
                  </div>

                  {/* Social Buttons */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setShowGoogleModal(true)}
                      className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-750 font-bold hover:bg-slate-50 flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm border border-slate-200/80 text-[11px] uppercase tracking-wider hover:border-slate-300"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.883-6.437-6.437s2.882-6.437 6.437-6.437c1.558 0 2.977.557 4.088 1.487l3.056-3.056C19.263 2.223 15.974 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.898 0 10.871-4.212 10.871-11.24 0-.768-.068-1.513-.193-1.955H12.24z"
                        />
                      </svg>
                      SIGN IN WITH GOOGLE
                    </button>

                    <button
                      type="button"
                      onClick={handleFacebookLogin}
                      className="w-full py-3.5 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm border-none text-[11px] uppercase tracking-wider hover:brightness-110"
                      style={{ background: '#1877F2' }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      SIGN IN WITH FACEBOOK
                    </button>
                  </div>

                  {/* Switch Links */}
                  <div className="pt-4 border-t border-slate-200/50 text-center text-[11px] font-semibold font-sans">
                    {viewMode === 'signup-auth' ? (
                      <div>
                        <span className="text-slate-400">Already have an account? </span>
                        <button
                          type="button"
                          onClick={() => { setViewMode('login'); setCustomStep(1); }}
                          className="text-[#FF6B6B] hover:underline cursor-pointer bg-transparent border-none font-bold"
                        >
                          Login Here
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-400">New to Beduine? </span>
                        <button
                          type="button"
                          onClick={() => { setViewMode('signup-auth'); setCustomStep(1); }}
                          className="text-[#FF6B6B] hover:underline cursor-pointer bg-transparent border-none font-bold"
                        >
                          Create an Account
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-semibold pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Secure Authentication • SSL Encrypted</span>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

      {/* Decorative Bottom Left Leaves */}
      <div className="absolute left-0 bottom-0 w-32 md:w-48 opacity-25 pointer-events-none select-none z-10">
        <svg viewBox="0 0 100 100" className="w-full h-auto text-emerald-800/30 fill-current">
          <path d="M 0,100 C 30,70 60,80 80,60 C 90,50 85,30 90,10 C 70,25 50,30 30,20 C 15,30 10,60 0,100 Z" />
          <path d="M 0,100 Q 40,50 80,60" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
          <path d="M 20,80 Q 25,60 30,58" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
          <path d="M 40,70 Q 50,45 55,42" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Google Account Selector Simulation Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-sm w-full border border-slate-200/80 shadow-2xl relative"
            >
              <h3 className="text-base font-bold text-slate-800 mb-1">Choose a Google Account</h3>
              <p className="text-xs text-slate-400 mb-5">to sign in to BEDUINE Dashboard</p>

              <div className="space-y-2.5">
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B6B] to-[#3B82F6] flex items-center justify-center font-bold text-white text-sm">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800">{acc.name}</span>
                      <span className="block text-[10px] text-slate-450 font-mono">{acc.email}</span>
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
