import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { ScrollRoundedSection, ParticleButton } from './SubscriptionHelpers';
import { SubscriptionHero, TrustStrip } from './SubscriptionHero';
import { AboutUs, Journey, HowItWorks, Services, Transparency } from './SubscriptionBenefits';
import { Plans, InternationalPlans } from './SubscriptionPlans';
import { TravelRewardSystem, NonWinnerGuarantee } from './LuckyDrawSection';
import { DiscountCreditsSection } from './DiscountCreditsSection';
import { Destinations, Winners } from './MemberDashboardPreview';
import { SubscriptionCTA } from './SubscriptionCTA';
import { SubscriptionFAQ } from './SubscriptionFAQ';

const LANDING_BACKGROUND_VIDEO = '/images/landing_background_video.mp4';

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
export function LandingContent({ onSelectPlan, setView }: { onSelectPlan: (planName: string) => void; setView: (v: any) => void }) {
  return (
    <>
      <SubscriptionHero setView={setView} />
      <TrustStrip />

      <div className="relative video-bg-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/beduine_travel_hero_1779521651766.png"
          className="fixed inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            zIndex: 0,
            transform: 'translate3d(0, 0, 0) scale(2.8)',
            backfaceVisibility: 'hidden',
            willChange: 'transform'
          }}
        >
          <source src={LANDING_BACKGROUND_VIDEO} type="video/mp4" />
        </video>
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `
              linear-gradient(180deg, rgba(3,12,22,0.35) 0%, rgba(3,12,22,0.24) 24%, rgba(3,12,22,0.2) 62%, rgba(3,12,22,0.35) 100%)
            `,
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 28%, rgba(24,215,242,0.07) 0%, rgba(8,31,45,0.04) 38%, transparent 82%)',
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 lg:gap-12">
          <ScrollRoundedSection><AboutUs /></ScrollRoundedSection>
          <ScrollRoundedSection><Journey /></ScrollRoundedSection>
          <ScrollRoundedSection><HowItWorks /></ScrollRoundedSection>
          <ScrollRoundedSection><Plans onSelectPlan={onSelectPlan} /></ScrollRoundedSection>
          <ScrollRoundedSection><InternationalPlans onSelectPlan={onSelectPlan} /></ScrollRoundedSection>
          <ScrollRoundedSection><TravelRewardSystem /></ScrollRoundedSection>
          <ScrollRoundedSection><DiscountCreditsSection /></ScrollRoundedSection>
          <ScrollRoundedSection><NonWinnerGuarantee /></ScrollRoundedSection>
          <Destinations />
          <ScrollRoundedSection><Winners /></ScrollRoundedSection>
          <ScrollRoundedSection><Services /></ScrollRoundedSection>
          <ScrollRoundedSection><Transparency /></ScrollRoundedSection>
          <ScrollRoundedSection><SubscriptionCTA onSelectPlan={onSelectPlan} /></ScrollRoundedSection>
          <ScrollRoundedSection><SubscriptionFAQ /></ScrollRoundedSection>
        </div>
      </div>
    </>
  );
}

/* ---------- StickySubscribeButton Component ---------- */
export function StickySubscribeButton({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <button
      onClick={() => onSelectPlan('Silver')}
      className="choose-btn hidden lg:inline-flex cursor-pointer border-none bg-transparent p-0"
    >
      <ParticleButton variant="gold" className="px-5 py-3 rounded-full font-bold text-sm shadow-xl shadow-neon-gold/30 flex items-center gap-1.5 hover:scale-110 transition-transform">
        <Crown className="w-4 h-4" /> Subscribe Now
      </ParticleButton>
    </button>
  );
}

export { RouteFallback } from './SubscriptionHelpers';
