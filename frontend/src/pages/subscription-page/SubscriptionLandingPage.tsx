import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown, CheckCircle2, CreditCard } from 'lucide-react';
import { demoWalletService } from '../../services/demoWalletService';
import { supabase } from '../../utils/supabaseClient';
import { getPlanPrice, getPlanName } from '../../data/siteData';
import { ScrollRoundedSection, ParticleButton } from './SubscriptionHelpers';
import { SubscriptionHero, TrustStrip } from './SubscriptionHero';
import { AboutUs, Journey, HowItWorks, Transparency } from './SubscriptionBenefits';
import { Plans, InternationalPlans } from './SubscriptionPlans';
import { TravelRewardSystem, NonWinnerGuarantee } from './LuckyDrawSection';
import { DiscountCreditsSection } from './DiscountCreditsSection';
import { Destinations, Winners } from './MemberDashboardPreview';
import { WinnerReviews } from './WinnerReviews';
import { SubscriptionCTA } from './SubscriptionCTA';
import { SubscriptionFAQ } from './SubscriptionFAQ';
import { isDemoModeAllowed } from '@/config/runtime';
import { canUseDemoTools } from '../../services/accessControl';
import { notify } from '@/services/uiFeedback';


/* ---------- CinematicIntro Component ---------- */
export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay with sound was blocked. Fallback to silent/muted playback.", error);
          video.muted = true;
          video.play().catch((err) => {
            console.error("Muted playback failed too:", err);
            setVideoError(true);
          });
        });
      }
    }

    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[300] bg-black overflow-hidden flex items-center justify-center" 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.6 }}
    >
      {!videoError ? (
        <video
          ref={videoRef}
          src="/images/Beduine_Logo_Last_Clean_Sound_Adjusted.mp4"
          playsInline
          className="w-full h-full object-contain bg-black"
          style={{ transform: 'scale(1.12) translateY(-6%)' }}
          onEnded={onComplete}
          onError={() => setVideoError(true)}
        />
      ) : (
        <div className="text-center text-[#D8E4EA] font-mono text-sm">
          Loading BEDUINE experience...
        </div>
      )}

      <button 
        onClick={onComplete} 
        className="absolute bottom-8 right-8 px-4 py-2 rounded-full glass text-white/60 hover:text-white text-xs uppercase tracking-widest z-[310] border border-white/10"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}

/* ---------- CustomCursor Component ---------- */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100, magnetX = 0, magnetY = 0, hovering = false;
    let prevX = -100, prevY = -100;
    let currentAngle = 45;
    
    let targetScaleX = 1, targetScaleY = 1;
    let currentScaleX = 1, currentScaleY = 1;
    
    const trailPositions = Array.from({ length: 30 }, () => ({ x: -100, y: -100 }));
    
    interface SparkData {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      active: boolean;
    }
    const sparkData: SparkData[] = Array.from({ length: 8 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, alpha: 0, active: false
    }));

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      let velocity = Math.sqrt(dx * dx + dy * dy);
      
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI + 90;
        currentAngle = angleDeg;
        prevX = mouseX;
        prevY = mouseY;
        
        const speedScale = Math.min(velocity * 0.035, 0.25);
        targetScaleX = 1 - speedScale * 0.45;
        targetScaleY = 1 + speedScale * 0.75;
      } else {
        targetScaleX = 1;
        targetScaleY = 1;
      }
      
      const target = e.target as HTMLElement | null;
      const magnet = (target && typeof target.closest === 'function') ? target.closest('[data-magnetic]') : null;
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        magnetX = (rect.left + rect.width / 2 - mouseX) * 0.25;
        magnetY = (rect.top + rect.height / 2 - mouseY) * 0.25;
        if (!hovering) { document.body.classList.add('cursor-hover'); hovering = true; }
      } else {
        magnetX *= 0.85; magnetY *= 0.85;
        if (hovering) { document.body.classList.remove('cursor-hover'); hovering = false; }
      }
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX + magnetX}px, ${mouseY + magnetY}px, 0)`;
      }
    };
    
    const onMouseDown = () => {
      document.body.classList.add('cursor-clicked');
      sparkData.forEach((spark, i) => {
        spark.x = mouseX;
        spark.y = mouseY;
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 4 + Math.random() * 6;
        spark.vx = Math.cos(angle) * speed;
        spark.vy = Math.sin(angle) * speed;
        spark.alpha = 1;
        spark.active = true;
      });
    };
    
    const onMouseUp = () => {
      document.body.classList.remove('cursor-clicked');
    };
    
    let raf = 0;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      
      currentScaleX += (targetScaleX - currentScaleX) * 0.15;
      currentScaleY += (targetScaleY - currentScaleY) * 0.15;
      
      targetScaleX += (1 - targetScaleX) * 0.08;
      targetScaleY += (1 - targetScaleY) * 0.08;

      if (planeRef.current) {
        planeRef.current.style.transform = `rotate(${currentAngle}deg) scale(${currentScaleX}, ${currentScaleY})`;
      }
      
      trailPositions.unshift({ x: mouseX + magnetX, y: mouseY + magnetY });
      trailPositions.pop();
      
      const trailDots = document.querySelectorAll('.cursor-trail-dot') as NodeListOf<HTMLDivElement>;
      trailDots.forEach((dot, i) => {
        const pos = trailPositions[(i + 1) * 3];
        if (pos && dot) {
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        }
      });
      
      const sparks = document.querySelectorAll('.cursor-spark') as NodeListOf<HTMLDivElement>;
      sparks.forEach((dot, i) => {
        const data = sparkData[i];
        if (data.active) {
          data.x += data.vx;
          data.y += data.vy;
          data.vx *= 0.90;
          data.vy *= 0.90;
          data.alpha -= 0.035;
          if (data.alpha <= 0) {
            data.active = false;
            dot.style.opacity = '0';
          } else {
            dot.style.opacity = String(data.alpha);
            dot.style.transform = `translate3d(${data.x}px, ${data.y}px, 0) scale(${data.alpha * 1.6})`;
          }
        }
      });

      raf = requestAnimationFrame(loop);
    };
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    loop();
    
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(raf);
    };
  }, []);
  
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const size = 9 - i * 1.4;
        return (
          <div
            key={i}
            className="cursor-trail-dot"
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
              background: i % 2 === 0 ? 'rgba(24, 215, 242, 0.4)' : 'rgba(247, 181, 0, 0.3)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9997,
              willChange: 'transform',
              filter: 'blur(0.5px)'
            }}
          />
        );
      })}

      {Array.from({ length: 8 }).map((_, i) => {
        const size = 6;
        return (
          <div
            key={i}
            className="cursor-spark"
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
              background: i % 2 === 0 ? '#18D7F2' : '#F7B500',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9999,
              willChange: 'transform',
              opacity: 0,
              boxShadow: i % 2 === 0 ? '0 0 8px #18D7F2' : '0 0 8px #F7B500'
            }}
          />
        );
      })}

      <div ref={dotRef} className="cursor-dot">
        <div ref={planeRef} className="airplane-wrapper">
          <svg viewBox="0 0 64 64" width="36" height="36" className="realistic-airplane">
            <defs>
              <linearGradient id="wing-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC"/>
                <stop offset="100%" stopColor="#94A3B8"/>
              </linearGradient>
              <linearGradient id="wing-grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC"/>
                <stop offset="100%" stopColor="#94A3B8"/>
              </linearGradient>
              <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBD5E1"/>
                <stop offset="35%" stopColor="#FFFFFF"/>
                <stop offset="65%" stopColor="#FFFFFF"/>
                <stop offset="100%" stopColor="#94A3B8"/>
              </linearGradient>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF"/>
                <stop offset="50%" stopColor="#0D9488"/>
                <stop offset="100%" stopColor="#0F766E"/>
              </linearGradient>
              <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B"/>
                <stop offset="100%" stopColor="#00B4D8"/>
              </linearGradient>
            </defs>
            <path d="M32 20 L8 40 L8 44 L32 32 Z" fill="url(#wing-grad-left)" stroke="#00B4D8" strokeWidth="0.5"/>
            <path d="M32 20 L56 40 L56 44 L32 32 Z" fill="url(#wing-grad-right)" stroke="#00B4D8" strokeWidth="0.5"/>
            
            <circle cx="19.25" cy="42" r="1.5" fill="#18D7F2">
              <animate attributeName="r" values="1.2;2.2;1.2" dur="0.15s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.15s" repeatCount="indefinite" />
            </circle>
            <circle cx="44.75" cy="42" r="1.5" fill="#18D7F2">
              <animate attributeName="r" values="1.2;2.2;1.2" dur="0.15s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.15s" repeatCount="indefinite" />
            </circle>

            <rect x="17.5" y="32" width="3.5" height="9" rx="1.5" fill="url(#gold-grad)" stroke="#E2E8F0" strokeWidth="0.5" transform="rotate(-5 19 36)"/>
            <rect x="43" y="32" width="3.5" height="9" rx="1.5" fill="url(#gold-grad)" stroke="#E2E8F0" strokeWidth="0.5" transform="rotate(5 45 36)"/>
            <path d="M32 8 C34 8 35 12 35 20 L35 48 C35 52 33 54 32 54 C31 54 29 52 29 48 L29 20 C29 12 30 8 32 8 Z" fill="url(#body-grad)" stroke="#00B4D8" strokeWidth="0.75"/>
            <path d="M29.5 14.5 C29.5 14.5 32 12.5 34.5 14.5 C34.5 14.5 34 15.5 32 16 C30 15.5 29.5 14.5 29.5 14.5 Z" fill="url(#glass-grad)"/>
            <path d="M32 46 L20 52 L20 55 L32 50 Z" fill="url(#wing-grad-left)" stroke="#00B4D8" strokeWidth="0.5"/>
            <path d="M32 46 L44 52 L44 55 L32 50 Z" fill="url(#wing-grad-right)" stroke="#00B4D8" strokeWidth="0.5"/>
            <path d="M32 42 L32 53 L33.5 53 L32.5 42 Z" fill="url(#gold-grad)"/>
          </svg>
        </div>
      </div>
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner" />
      </div>
    </>
  );
}

/* ---------- LandingContent Component ---------- */
export function LandingContent({ 
  onSelectPlan, 
  setView, 
  currentUser, 
  setCurrentUser: _setCurrentUser 
}: { 
  onSelectPlan: (planName: string) => void; 
  setView: (v: any) => void; 
  currentUser: any; 
  setCurrentUser: (user: any) => void;
}) {
  const isDemoWalletEnabled = isDemoModeAllowed();
  const showDemoWallet = isDemoWalletEnabled && (!currentUser || canUseDemoTools(currentUser));

  // Selected plan state for testing checkout on this page
  const [selectedPlanId] = useState<string>('Silver');
  const [paymentMethod, setPaymentMethod] = useState<'real_payment' | 'demo_wallet'>(
    isDemoWalletEnabled ? 'demo_wallet' : 'real_payment'
  );
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  // Sync demo wallet states
  const [demoWalletBalance, setDemoWalletBalance] = useState<number>(() => currentUser?.demo_wallet_balance ?? 0);

  useEffect(() => {
    setDemoWalletBalance(currentUser?.demo_wallet_balance ?? 0);
  }, [currentUser]);

  useEffect(() => {
    const handleBalanceChanged = (e: CustomEvent) => {
      setDemoWalletBalance(e.detail.balance);
    };
    window.addEventListener('demoBalanceChanged', handleBalanceChanged as EventListener);
    return () => {
      window.removeEventListener('demoBalanceChanged', handleBalanceChanged as EventListener);
    };
  }, []);

  const handleCheckout = async () => {
    if (!currentUser) {
      notify.info("Please login or register to test checkout flow.");
      setView('login');
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await demoWalletService.checkoutSubscription(currentUser.id, selectedPlanId, paymentMethod);
      setCheckoutLoading(false);
      if (res.success) {
        setCheckoutSuccess(res);
        if (res.user) {
          _setCurrentUser(res.user);
          await supabase.auth.updateUser({
            data: res.user.user_metadata ?? {}
          });
        }
        notify.info(res.message || "Demo payment successful. Subscription activated for testing.");
      } else {
        notify.info(res.message);
      }
    } catch (e: any) {
      setCheckoutLoading(false);
      notify.info(e.message || 'Checkout failed');
    }
  };

  const isSufficient = demoWalletBalance >= (getPlanPrice(selectedPlanId) || 0);

  const checkoutPanel = (
    checkoutSuccess ? (
      <div className="bg-slate-900/90 border border-slate-800 shadow-xl rounded-[28px] p-6 text-center space-y-5 text-white backdrop-blur-md">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-md border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-black text-white">Demo Payment Successful</h2>
          <p className="text-[10px] text-slate-350 mt-1.5 font-bold">Demo payment successful. Subscription activated for testing.</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left space-y-1.5 text-[10px] font-mono text-slate-300">
          <div>Plan: <strong className="text-white">{getPlanName(selectedPlanId)}</strong></div>
          <div>Price: <strong className="text-white">₹{getPlanPrice(selectedPlanId)}</strong></div>
          <div>Payment: <strong className="text-emerald-400 uppercase">{paymentMethod.replace('_', ' ')}</strong></div>
        </div>
        <button
          onClick={() => {
            setCheckoutSuccess(null);
            setView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-2 w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer border-none"
        >
          Go to Dashboard
        </button>
      </div>
    ) : (
      <div className="bg-slate-900/90 border border-slate-800 shadow-xl rounded-[28px] p-6 text-white space-y-4 text-left backdrop-blur-md">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" /> Subscription Checkout
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Test payment activation for the selected plan</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-[10px]">
          <div className="flex justify-between font-bold text-slate-300">
            <span>Selected Plan Price:</span>
            <span className="text-[#FF6B6B] uppercase font-black">{getPlanName(selectedPlanId) || selectedPlanId}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-350">
            <span>Required Amount:</span>
            <span className="text-white font-extrabold">₹{getPlanPrice(selectedPlanId)}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-350 border-t border-white/10 pt-2">
            <span>Current Demo Wallet Balance:</span>
            <span className={isSufficient ? 'text-emerald-400 font-extrabold' : 'text-red-400 font-extrabold'}>₹{demoWalletBalance}</span>
          </div>
          <div className="pt-1.5 text-center">
            {isSufficient ? (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wide">
                ✓ Balance Sufficient
              </span>
            ) : (
              <span className="inline-block px-2 py-1 rounded-lg text-[8.5px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 uppercase tracking-wide leading-relaxed">
                ✗ Insufficient demo balance. Please add demo balance to test this subscription.
              </span>
            )}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2.5">
          <span className="block text-[9px] uppercase font-mono text-slate-400 tracking-wider font-bold">Choose Payment Method</span>
          <div className="grid grid-cols-1 gap-2">
            <label
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border-2 transition-all cursor-pointer bg-white/5 ${
                paymentMethod === 'real_payment' ? 'border-[#FF6B6B] bg-orange-500/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="payment-landing"
                checked={paymentMethod === 'real_payment'}
                onChange={() => setPaymentMethod('real_payment')}
                className="accent-[#FF6B6B]"
              />
              <div>
                <span className="text-[10px] font-bold text-white block">Real Payment</span>
                <span className="text-[8.5px] text-slate-400 block mt-0.5">Simulate payment gateway purchase</span>
              </div>
            </label>

            <label
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border-2 transition-all cursor-pointer bg-white/5 ${
                paymentMethod === 'demo_wallet' ? 'border-[#00D4F5] bg-sky-500/5' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="payment-landing"
                checked={paymentMethod === 'demo_wallet'}
                onChange={() => setPaymentMethod('demo_wallet')}
                className="accent-[#00D4F5]"
              />
              <div>
                <span className="text-[10px] font-bold text-white block">Demo Wallet Payment</span>
                <span className="text-[8.5px] text-slate-400 block mt-0.5">Deduct from ₹{demoWalletBalance} Test Balance</span>
              </div>
            </label>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading || (paymentMethod === 'demo_wallet' && !isSufficient)}
          className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-full transition-all cursor-pointer shadow-lg border-none ${
            paymentMethod === 'demo_wallet' && !isSufficient
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : paymentMethod === 'demo_wallet'
                ? 'bg-indigo-650 hover:bg-indigo-700 shadow-indigo-500/25'
                : 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6] hover:from-[#FF8E53] hover:to-[#8B5CF6] shadow-rose-500/25'
          }`}
        >
          {checkoutLoading ? 'Processing Checkout...' : `Pay ₹${getPlanPrice(selectedPlanId)} & Activate`}
        </button>
      </div>
    )
  );

  return (
    <>
      <SubscriptionHero setView={setView} />
      <TrustStrip />

      <div className="relative video-bg-container">
        <img
          src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Travel Background"
          className="fixed inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            zIndex: 0,
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'rgba(3, 12, 22, 0.76)',
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 28%, rgba(24,215,242,0.08) 0%, rgba(8,31,45,0.04) 38%, transparent 82%)',
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 lg:gap-12">
          <ScrollRoundedSection><AboutUs /></ScrollRoundedSection>
          <ScrollRoundedSection><Journey /></ScrollRoundedSection>
          <ScrollRoundedSection><HowItWorks /></ScrollRoundedSection>

          {showDemoWallet ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
              <ScrollRoundedSection>
                <Plans 
                  onSelectPlan={onSelectPlan} 
                  selectedPlanId={selectedPlanId} 
                  showDemoWallet={showDemoWallet} 
                />
              </ScrollRoundedSection>
              <ScrollRoundedSection>
                <InternationalPlans 
                  onSelectPlan={onSelectPlan} 
                  selectedPlanId={selectedPlanId} 
                  showDemoWallet={showDemoWallet} 
                />
              </ScrollRoundedSection>

              {selectedPlanId && (
                <div className="max-w-md mx-auto pt-4 pb-8">
                  {checkoutPanel}
                </div>
              )}
            </div>
          ) : (
            <>
              <ScrollRoundedSection><Plans onSelectPlan={onSelectPlan} /></ScrollRoundedSection>
              <ScrollRoundedSection><InternationalPlans onSelectPlan={onSelectPlan} /></ScrollRoundedSection>
            </>
          )}

          <ScrollRoundedSection><TravelRewardSystem /></ScrollRoundedSection>
          <ScrollRoundedSection><DiscountCreditsSection /></ScrollRoundedSection>
          <ScrollRoundedSection><NonWinnerGuarantee /></ScrollRoundedSection>
          <Destinations />
          <ScrollRoundedSection><Winners /></ScrollRoundedSection>
          <ScrollRoundedSection><WinnerReviews /></ScrollRoundedSection>
          <ScrollRoundedSection><Transparency /></ScrollRoundedSection>
          <ScrollRoundedSection><SubscriptionCTA onSelectPlan={onSelectPlan} /></ScrollRoundedSection>
          <ScrollRoundedSection><SubscriptionFAQ /></ScrollRoundedSection>
        </div>
      </div>
    </>
  );
}

/* ---------- StickySubscribeButton Component ---------- */
export function StickySubscribeButton({ onSelectPlan: _onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <ParticleButton
      onClick={() => {
        const el = document.getElementById('plans');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }}
      variant="gold"
      className="choose-btn hidden cursor-pointer items-center gap-1.5 rounded-full border-none px-5 py-3 text-sm font-bold shadow-xl shadow-neon-gold/30 transition-transform hover:scale-110 lg:inline-flex"
    >
      <Crown className="w-4 h-4" /> Subscribe Now
    </ParticleButton>
  );
}

export { RouteFallback } from './SubscriptionHelpers';
