import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'framer-motion';
import {
  Compass, Sparkles, Gift, CreditCard, Award, ShieldCheck,
  ChevronRight, CheckCircle2, Star,
  Phone, Calendar, MapPin, Hotel, Train, Plane,
  FileCheck2, Banknote, ArrowRight, Menu, X, MessageCircle,
  Download, Lock, BarChart3, Eye, Target, TrendingUp, Crown,
  Video, Camera, Send, Tv, Share2, FileText,
  BadgeCheck, Zap, Bot, Fingerprint, Scan,
  Heart, Globe, Users, Rocket, Wallet, History, IndianRupee, Info, AlertTriangle,
  Coins, ArrowUpDown, Shield, HeartHandshake
} from 'lucide-react';



/* ---------- Data ---------- */
const NAV = [
  { id: 'about', label: 'About' },
  { id: 'how', label: 'How It Works' },
  { id: 'plans', label: 'Plans' },
  { id: 'intl-plans', label: 'International' },
  { id: 'luckydraw', label: 'Lucky Draw' },
  { id: 'credits', label: 'Credits' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'services', label: 'Services' },
  { id: 'audit', label: 'Transparency' },
  { id: 'contact', label: 'Contact' },
];

const PLANS = [
  {
    name: 'Silver', price: 499, tagline: 'Smart Starter', icon: Star,
    color: 'from-slate-500 to-slate-700', glow: 'slate',
    tourValue: 3000, duration: '2N / 3D', discountCredits: 1, discountValue: 500,
    paidDiscount: 'Member rate', insurance: 'Payable', nameChange: 'Not available',
    image: '/images/sundarbans_mangrove_1779521789593.png',
    imageLabel: 'Sundarbans · Boat Safari',
    destinations: ['Sundarbans (Boat Safari + Tiger Reserve)', 'Bakkhali (Beach Escape)', 'Mousuni Island (Sea & Camping)', 'Mukutmanipur (Dam, Hills & Lake)'],
    benefits: ['1 Weekly Reward Draw entry', 'Winner tour value up to ₹3,000', '1 × ₹500 discount credit if not selected', 'Member-only rates on paid tours', '12-month subscription validity', 'Pickup & drop from selected points'],
  },
  {
    name: 'Emerald', price: 799, tagline: 'Balanced Choice', icon: Award,
    color: 'from-teal-400 to-emerald-600', glow: 'teal',
    tourValue: 5000, duration: '2N / 3D', discountCredits: 2, discountValue: 1000,
    paidDiscount: 'Member rate', insurance: '50% off', nameChange: 'One time',
    image: '/images/darjeeling_tea_1779521805614.png',
    imageLabel: 'Darjeeling · Tea Gardens',
    destinations: ['Darjeeling (Toy Train + Tiger Hill Sunrise)', 'Dooars (Jungle Safari + Tea Gardens)', 'Puri + Konark (Jagannath + Sun Temple)', 'Vizag + Araku Valley (Beach + Hills)'],
    benefits: ['1 Weekly Reward Draw entry', 'Winner tour value up to ₹5,000', '2 × ₹500 discount credits if not selected', 'Member-only rates on paid tours', 'Travel insurance at 50% off', 'One-time family name change allowed'],
  },
  {
    name: 'Platinum', price: 1499, tagline: 'Premium Experience', icon: Crown,
    color: 'from-indigo-400 via-purple-500 to-fuchsia-500', glow: 'purple',
    featured: true, tourValue: 10000, duration: '3N / 4D',
    discountCredits: 4, discountValue: 2000,
    paidDiscount: 'Member rate', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/kashmir_dal_lake_1779521728036.png',
    imageLabel: 'Kashmir · Dal Lake',
    destinations: ['Kashmir (Srinagar · Gulmarg · Pahalgam)', 'Rajasthan (Jaipur · Udaipur · Jaisalmer)', 'Kerala (Munnar · Alleppey · Kovalam)', 'Himachal (Shimla · Manali Circuit)'],
    benefits: ['1 Weekly Reward Draw entry', 'Winner tour value up to ₹10,000', '4 × ₹500 discount credits if not selected', 'Member-only rates on paid tours', 'Complimentary travel insurance', 'Two family name changes allowed', 'Priority quarterly tour batching'],
  },
];

const INTL_PLANS = [
  {
    name: 'Explorer', price: 4999, tagline: 'International Starter', icon: Globe,
    color: 'from-sky-400 to-blue-600', glow: 'blue',
    tourValue: 25000, duration: '3N / 4D', discountCredits: 5, discountValue: 2500,
    paidDiscount: 'Member rate', insurance: '50% off', nameChange: 'One time',
    image: '/images/dubai_skyline_1779539448313.png',
    imageLabel: 'Dubai · Skyline & Dunes',
    destinations: ['Dubai (Burj Khalifa · Desert Safari · Marina)', 'Thailand (Bangkok · Pattaya · Floating Market)', 'Sri Lanka (Colombo · Kandy · Sigiriya)', 'Nepal (Kathmandu · Pokhara · Chitwan)'],
    benefits: ['1 Monthly Reward Draw entry', 'Winner tour value up to ₹25,000', '5 × ₹500 discount credits if not selected', 'Member-only rates on international tours', 'Travel insurance at 50% off', 'One-time name change allowed', 'Visa assistance included'],
  },
  {
    name: 'Voyager', price: 7999, tagline: 'Premium Explorer', icon: Plane,
    color: 'from-emerald-400 to-teal-600', glow: 'teal',
    featured: true, tourValue: 50000, duration: '4N / 5D', discountCredits: 8, discountValue: 4000,
    paidDiscount: 'VIP rate', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/singapore_skyline_1779539502293.png',
    imageLabel: 'Singapore · City of Future',
    destinations: ['Singapore (Gardens by the Bay · Sentosa · Marina Bay)', 'Malaysia (Kuala Lumpur · Langkawi · Genting)', 'Bali (Ubud · Kuta · Tanah Lot · Uluwatu)', 'Vietnam (Hanoi · Ha Long Bay · Ho Chi Minh)'],
    benefits: ['1 Monthly Reward Draw entry', 'Winner tour value up to ₹50,000', '8 × ₹500 discount credits if not selected', 'VIP rates on all international tours', 'Complimentary travel insurance', 'Two name changes allowed', 'Visa assistance + Airport lounge access', 'Priority tour batching'],
  },
  {
    name: 'Globetrotter', price: 14999, tagline: 'Ultimate World Pass', icon: Rocket,
    color: 'from-rose-400 via-pink-500 to-violet-600', glow: 'pink',
    tourValue: 100000, duration: '5N / 6D', discountCredits: 15, discountValue: 7500,
    paidDiscount: 'VIP rate', insurance: 'Included free', nameChange: 'Unlimited',
    image: '/images/maldives_overwater_1779539482305.png',
    imageLabel: 'Maldives · Paradise',
    destinations: ['Maldives (Overwater Villa · Snorkeling · Sunset Cruise)', 'Europe (Paris · Switzerland · Rome · Barcelona)', 'Turkey (Istanbul · Cappadocia · Pamukkale)', 'Japan (Tokyo · Kyoto · Osaka · Mount Fuji)'],
    benefits: ['1 Monthly Reward Draw entry', 'Winner tour value up to ₹1,00,000', '15 × ₹500 discount credits if not selected', 'VIP rates on all international tours', 'Premium travel insurance', 'Unlimited name changes', 'Full visa processing + Airport lounge', 'Dedicated travel concierge', 'Priority booking & upgrades'],
  },
];

const SERVICES = [
  { icon: Compass, title: 'Customized Tour Packages', desc: 'AI-curated itineraries built around your pace, interests, and travel style.' },
  { icon: Hotel, title: 'Hotel Booking', desc: 'Curated stays from boutique hideaways to five-star retreats, worldwide.' },
  { icon: Train, title: 'Train Ticket Booking', desc: 'Seamless IRCTC reservations with confirmed berths and instant PNR updates.' },
  { icon: Plane, title: 'Flight Ticket Booking', desc: 'Best fares across domestic and international carriers with flexible options.' },
  { icon: FileCheck2, title: 'Visa Application', desc: 'End-to-end documentation, interview prep, and embassy coordination.' },
  { icon: Banknote, title: 'Currency Exchange', desc: 'Competitive forex rates with doorstep delivery and zero hidden fees.' },
];

const AUDIT_REPORTS = [
  { week: 'Week 42 · 2026', status: 'Published', date: '19 Oct 2026' },
  { week: 'Week 41 · 2026', status: 'Published', date: '12 Oct 2026' },
  { week: 'Week 40 · 2026', status: 'Published', date: '05 Oct 2026' },
  { week: 'Week 39 · 2026', status: 'Published', date: '28 Sep 2026' },
];

const DESTINATIONS = [
  { name: 'Kashmir', tag: 'Srinagar · Gulmarg · Pahalgam', duration: '4N/5D', rating: 4.9, season: 'Mar – Oct', img: '/images/kashmir_dal_lake_1779521728036.png' },
  { name: 'Rajasthan Royal', tag: 'Jaipur · Udaipur · Jaisalmer', duration: '5N/6D', rating: 4.8, season: 'Oct – Mar', img: '/images/rajasthan_palace_1779521744228.png' },
  { name: 'Kerala', tag: 'Munnar · Alleppey · Kovalam', duration: '4N/5D', rating: 4.9, season: 'Sep – Mar', img: '/images/kerala_houseboat_1779521772928.png' },
  { name: 'Himachal', tag: 'Shimla · Manali · Solang', duration: '4N/5D', rating: 4.7, season: 'Mar – Jun', img: '/images/himachal_hills.png' },
  { name: 'Darjeeling', tag: 'Tiger Hill · Tea Gardens', duration: '3N/4D', rating: 4.8, season: 'Mar – May', img: '/images/darjeeling_tea_1779521805614.png' },
  { name: 'Sundarbans', tag: 'Tiger Reserve · Boat Safari', duration: '2N/3D', rating: 4.6, season: 'Oct – Mar', img: '/images/sundarbans_mangrove_1779521789593.png' },
  { name: 'Goa Beaches', tag: 'North · South · Island Hopping', duration: '3N/4D', rating: 4.7, season: 'Nov – Feb', img: '/images/goa_beaches.png' },
  { name: 'Tropical Coast', tag: 'Palm Beaches · Sunsets', duration: '3N/4D', rating: 4.8, season: 'Year-round', img: '/images/tropical_coast.png' },
];

const WINNERS_DATA = [
  { name: 'Ananya Das', plan: 'Platinum', dest: 'Kashmir', week: 'Week 42', img: '/images/winner_ananya_das.png', destImg: '/images/kashmir_dal_lake_1779521728036.png' },
  { name: 'Rajesh Kumar', plan: 'Emerald', dest: 'Darjeeling', week: 'Week 41', img: '/images/winner_rajesh_kumar.png', destImg: '/images/darjeeling_tea_1779521805614.png' },
  { name: 'Priya Sen', plan: 'Silver', dest: 'Sundarbans', week: 'Week 40', img: '/images/winner_priya_sen.png', destImg: '/images/sundarbans_mangrove_1779521789593.png' },
  { name: 'Arjun Roy', plan: 'Platinum', dest: 'Kerala', week: 'Week 39', img: '/images/winner_arjun_roy.png', destImg: '/images/kerala_houseboat_1779521772928.png' },
  { name: 'Meera Bose', plan: 'Emerald', dest: 'Rajasthan', week: 'Week 38', img: '/images/winner_meera_bose.png', destImg: '/images/rajasthan_palace_1779521744228.png' },
  { name: 'Subhadeep Ghosh', plan: 'Platinum', dest: 'Himachal', week: 'Week 37', img: '/images/winner_subhadeep_ghosh.png', destImg: '/images/himachal_hills.png' },
];

const JOURNEY_IMAGES = [
  { src: '/images/happy_travelers_family_1779521684057.png', label: 'Happy Beduine Families' },
  { src: '/images/rajasthan_palace_1779521744228.png', label: 'Royal Rajasthan Tours' },
  { src: '/images/kerala_houseboat_1779521772928.png', label: 'Kerala Backwaters' },
  { src: '/images/sundarbans_mangrove_1779521789593.png', label: 'Sundarbans Safari' },
];

/* ---------- Helpers ---------- */
function Reveal({ children, delay = 0, y = 30 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function GoldCheck({ size = 18, variant = 'gold' }: { size?: number; variant?: 'gold' | 'cyan' | 'violet' }) {
  const checkClass = variant === 'cyan' ? 'cyan-check' : variant === 'violet' ? 'violet-check' : 'gold-check';
  return (
    <span className={`inline-flex items-center justify-center rounded-full ${checkClass} shrink-0`} style={{ width: size, height: size }}>
      <CheckCircle2 className="text-cosmos" style={{ width: size * 0.7, height: size * 0.7 }} strokeWidth={3} />
    </span>
  );
}

function FloatingIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div className="relative" initial={{ y: 0 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
      {children}
    </motion.div>
  );
}

/* ---------- Star Field ---------- */
function StarField({ count = 80 }: { count?: number }) {
  const stars = useMemo(() => Array.from({ length: count }).map(() => ({
    top: Math.random() * 100, left: Math.random() * 100,
    delay: Math.random() * 3, size: Math.random() * 1.5 + 0.5,
  })), [count]);
  return (
    <div className="star-field">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
}

function AuroraBackground({ variant = 'cyan' }: { variant?: 'cyan' | 'gold' }) {
  return <div className={`aurora ${variant === 'gold' ? 'aurora-gold' : ''}`} />;
}

function GradientMesh() {
  return <div className="gradient-mesh"><span /><span /><span /></div>;
}

/* ---------- Floating Orbs (animated background) ---------- */
function FloatingOrbs({ count = 5, variant = 'mixed' }: { count?: number; variant?: 'cyan' | 'gold' | 'mixed' }) {
  const orbs = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const colors = variant === 'cyan' ? ['#00D9FF', '#67E8F9'] : variant === 'gold' ? ['#2DD4BF', '#8B5CF6'] : ['#00D9FF', '#2DD4BF', '#A855F7', '#67E8F9', '#8B5CF6'];
    return {
      id: i,
      size: 200 + Math.random() * 300,
      top: Math.random() * 80,
      left: Math.random() * 80,
      color: colors[i % colors.length],
      delay: i * 2,
      duration: 15 + Math.random() * 10,
    };
  }), [count, variant]);
  return (
    <div className="floating-orbs">
      {orbs.map((o) => (
        <div key={o.id} className="orb-particle" style={{
          width: `${o.size}px`, height: `${o.size}px`,
          top: `${o.top}%`, left: `${o.left}%`,
          background: o.color,
          animationDelay: `${o.delay}s`,
          animationDuration: `${o.duration}s`,
        }} />
      ))}
    </div>
  );
}

/* ---------- Wave Background (animated SVG waves) ---------- */
function WaveBackground({ color = 'cyan' }: { color?: 'cyan' | 'gold' | 'mixed' }) {
  const stroke = color === 'cyan' ? '#00D9FF' : color === 'gold' ? '#8B5CF6' : '#A855F7';
  return (
    <div className="wave-bg">
      <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M0,150 C240,220 480,80 720,150 C960,220 1200,80 1440,150 L1440,300 L0,300 Z" fill="url(#wave-grad)" opacity="0.5" />
        <path d="M0,180 C240,250 480,110 720,180 C960,250 1200,110 1440,180 L1440,300 L0,300 Z" fill={stroke} opacity="0.15" />
        <path d="M0,210 C240,280 480,140 720,210 C960,280 1200,140 1440,210 L1440,300 L0,300 Z" fill={stroke} opacity="0.1" />
      </svg>
    </div>
  );
}

/* ---------- Morphing Blobs ---------- */
function MorphBlobs() {
  return (
    <>
      <div className="morph-blob" style={{ width: '500px', height: '500px', top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(0,217,255,0.3), transparent 70%)', animationDelay: '0s' }} />
      <div className="morph-blob" style={{ width: '400px', height: '400px', bottom: '10%', right: '-5%', background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)', animationDelay: '5s' }} />
      <div className="morph-blob" style={{ width: '450px', height: '450px', top: '40%', left: '30%', background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)', animationDelay: '10s' }} />
    </>
  );
}

/* ---------- Flowing Lines ---------- */
function FlowingLines({ count = 5 }: { count?: number }) {
  return (
    <div className="flow-lines">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flow-line" style={{ top: `${15 + i * 18}%`, animationDelay: `${i * 1.5}s`, animationDuration: `${6 + i}s`, transform: `rotate(${-5 + i * 3}deg)` }} />
      ))}
    </div>
  );
}

function KineticText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="kinetic-mask">
          <span className="kinetic-word inline-block mr-[0.25em]" style={{ animationDelay: `${delay + wi * 0.08}s`, animationPlayState: inView ? 'running' : 'paused', opacity: inView ? undefined : 0 }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

/* Particle Burst Button */
function ParticleButton({ children, onClick, variant = 'gold', className = '', ...rest }: any) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: 16 }).map((_, i) => ({
        id: Date.now() + i, x: e.clientX - rect.left, y: e.clientY - rect.top,
        angle: (i / 16) * Math.PI * 2 + Math.random() * 0.4,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 900);
    }
    onClick?.(e);
  };
  const btnClass = variant === 'gold' ? 'glow-cta' : 'glow-cta-cyan';
  return (
    <button ref={btnRef} data-magnetic onClick={handleClick} className={`relative overflow-visible ${btnClass} ${className}`} {...rest}>
      {children}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span key={p.id} className="particle-burst"
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{ x: p.x + Math.cos(p.angle) * (60 + Math.random() * 30), y: p.y + Math.sin(p.angle) * (60 + Math.random() * 30), opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        ))}
      </AnimatePresence>
    </button>
  );
}

function StaggerText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className="stagger-letter" style={{ animationDelay: `${delay + i * 0.05}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

function TiltCard({ children, className = '', intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * intensity;
    const rotX = -((y - cy) / cy) * intensity;
    setStyle({ transform: `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)` });
  };
  const onLeave = () => setStyle({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' });
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-card ${className}`} style={style}>{children}</div>;
}

function LiquidFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden>
      <defs>
        <filter id="liquid-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" seed="3">
            <animate attributeName="baseFrequency" dur="15s" values="0.015 0.02; 0.02 0.025; 0.015 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </defs>
    </svg>
  );
}

/* Custom Cursor */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100, magnetX = 0, magnetY = 0, hovering = false;
    let prevX = -100, prevY = -100;
    let currentAngle = 45;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI + 90;
        currentAngle = angleDeg;
        prevX = mouseX;
        prevY = mouseY;
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
      if (planeRef.current) {
        planeRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }
    };
    const onMouseDown = () => {
      document.body.classList.add('cursor-clicked');
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
            {/* Left Wing */}
            <path d="M32 20 L8 40 L8 44 L32 32 Z" fill="url(#wing-grad-left)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Right Wing */}
            <path d="M32 20 L56 40 L56 44 L32 32 Z" fill="url(#wing-grad-right)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Left Engine */}
            <rect x="17.5" y="32" width="3.5" height="9" rx="1.5" fill="url(#gold-grad)" stroke="#E2E8F0" strokeWidth="0.5" transform="rotate(-5 19 36)"/>
            {/* Right Engine */}
            <rect x="43" y="32" width="3.5" height="9" rx="1.5" fill="url(#gold-grad)" stroke="#E2E8F0" strokeWidth="0.5" transform="rotate(5 45 36)"/>
            {/* Fuselage (Body) */}
            <path d="M32 8 C34 8 35 12 35 20 L35 48 C35 52 33 54 32 54 C31 54 29 52 29 48 L29 20 C29 12 30 8 32 8 Z" fill="url(#body-grad)" stroke="#00B4D8" strokeWidth="0.75"/>
            {/* Cockpit Window */}
            <path d="M29.5 14.5 C29.5 14.5 32 12.5 34.5 14.5 C34.5 14.5 34 15.5 32 16 C30 15.5 29.5 14.5 29.5 14.5 Z" fill="url(#glass-grad)"/>
            {/* Left Tail Stabilizer */}
            <path d="M32 46 L20 52 L20 55 L32 50 Z" fill="url(#wing-grad-left)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Right Tail Stabilizer */}
            <path d="M32 46 L44 52 L44 55 L32 50 Z" fill="url(#wing-grad-right)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Vertical Tail Fin */}
            <path d="M32 42 L32 53 L33.5 53 L32.5 42 Z" fill="url(#gold-grad)"/>
          </svg>
        </div>
      </div>
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const [scale, setScale] = useState(0);
  useEffect(() => sx.on('change', (v) => setScale(v)), [sx]);
  return <div className="scroll-progress" style={{ width: `${scale * 100}%` }} />;
}

/* ============ 3-SECOND CINEMATIC INTRO ============ */
function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1900);
    const t4 = setTimeout(() => setPhase(4), 2700);
    const t5 = setTimeout(() => onComplete(), 3100);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const radius = 400 + Math.random() * 200;
    return { id: i, startX: Math.cos(angle) * radius, startY: Math.sin(angle) * radius, isCyan: i % 3 === 0, delay: i * 0.015 };
  }), []);

  return (
    <motion.div className="fixed inset-0 z-[300] bg-cosmos overflow-hidden cinematic-stage" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <StarField count={120} />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Shockwaves */}
      <AnimatePresence>
        {phase === 2 && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="intro-shockwave" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="intro-shockwave" style={{ animationDelay: '0.3s' }} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="intro-flash" />
          </>
        )}
      </AnimatePresence>

      {/* Phase 1: Particle swarm */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {particles.map((p) => (
            <motion.div key={p.id}
              initial={{ x: p.startX, y: p.startY, scale: 0, opacity: 0 }}
              animate={{ x: [p.startX, p.startX * 0.3, 0], y: [p.startY, p.startY * 0.3, 0], scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
              className={`intro-particle ${p.isCyan ? 'intro-particle-cyan' : ''}`} />
          ))}
        </div>
      )}

      {/* Phase 2: 3D Compass + SAFAR */}
      <AnimatePresence>
        {phase >= 2 && phase < 4 && (
          <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 3D rotating compass */}
            <motion.div initial={{ rotateY: -180, rotateX: 20, scale: 0.3, opacity: 0 }} animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mb-10" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, ease: 'linear', repeat: Infinity }} className="relative">
                <div className="absolute -inset-10 rounded-full border border-gold/30" style={{ boxShadow: '0 0 60px rgba(255,209,102,0.4)' }} />
                <div className="absolute -inset-20 rounded-full border border-cyan/20" />
                <div className="absolute -inset-32 rounded-full border border-gold/10" />
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(circle, rgba(255,209,102,0.3) 0%, rgba(139,105,20,0.1) 70%, transparent 100%)', boxShadow: '0 0 80px rgba(255,209,102,0.5), inset 0 0 40px rgba(255,209,102,0.3)' }}>
                  <div className="absolute inset-2 rounded-full border-2 border-gold/60 z-20 pointer-events-none" />
                  <div className="absolute inset-6 rounded-full border border-cyan/40 z-20 pointer-events-none" />
                  <img src="/images/office_logo.png" alt="Beduine Logo" className="w-full h-full object-cover scale-105 relative z-10" />
                </div>
                <div className="orbit absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan" style={{ ['--r' as any]: '80px', boxShadow: '0 0 15px #00D9FF' }} />
                <div className="orbit absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold" style={{ ['--r' as any]: '140px', animationDelay: '-5s', boxShadow: '0 0 12px #FFD166' }} />
              </motion.div>
            </motion.div>

            {/* SAFAR 3D text */}
            <motion.div initial={{ y: 60, opacity: 0, scale: 0.7, rotateX: -40 }} animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-display text-7xl lg:text-9xl font-bold tracking-[0.3em] intro-text-3d" style={{ transformStyle: 'preserve-3d' }}>
              SAFAR
            </motion.div>

            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '300px', opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-6" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: "jo yaad rahe" */}
      <AnimatePresence>
        {phase >= 3 && phase < 4 && (
          <motion.div key="phase3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0.5, opacity: 0, y: -120 }} animate={{ scale: 1, opacity: 1, y: -120 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-display text-7xl lg:text-9xl font-bold tracking-[0.3em] intro-text-3d">SAFAR</motion.div>
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '300px', opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-serif italic text-4xl lg:text-6xl gold-shimmer mt-6">jo yaad rahe</motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }} className="mt-8 text-xs uppercase tracking-[0.5em] text-cyan/80 font-mono">· Beduine Tour & Travels ·</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: Exit */}
      <AnimatePresence>
        {phase >= 4 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-cosmos" />}
      </AnimatePresence>

      <button onClick={onComplete} className="absolute bottom-8 right-8 px-4 py-2 rounded-full glass text-ink/60 hover:text-ink text-xs uppercase tracking-widest z-10 border border-slate-line">Skip Intro →</button>
    </motion.div>
  );
}

/* ---------- Navbar ---------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className={`glass rounded-2xl transition-all duration-500 ${scrolled ? 'neon-border-cyan' : ''}`}>
          <div className="flex items-center justify-between px-4 lg:px-6 h-14 lg:h-16">
            <a href="#top" className="flex items-center gap-2.5" data-magnetic>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos">
                <img src="/images/office_logo.png" alt="Beduine Logo" className="w-full h-full object-cover scale-105" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base font-bold text-ink tracking-tight">BEDUINE</div>
                <div className="text-[9px] uppercase tracking-[0.22em] neon-cyan">Tour & Travels</div>
              </div>
            </a>
            <nav className="hidden lg:flex items-center gap-8">
              {NAV.map((n) => <a key={n.id} href={`#${n.id}`} data-magnetic className="text-sm text-ink/80 hover:neon-cyan transition-all font-medium">{n.label}</a>)}
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              <a href="https://wa.me/918768903565?text=Hello%20Beduine%2C%20I%20want%20to%20inquire%20about%20my%20membership." target="_blank" rel="noreferrer" data-magnetic className="text-sm text-ink/75 hover:text-ink transition-colors font-medium px-3 py-2">Member Login</a>
              <a href="#plans"><ParticleButton variant="cyan" className="px-4 py-2 rounded-full font-semibold text-sm inline-flex items-center gap-1.5">Choose Plan <ArrowRight className="w-3.5 h-3.5" /></ParticleButton></a>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="lg:hidden text-ink p-2" onClick={() => setOpen(!open)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-slate-line">
                <div className="px-4 py-3 flex flex-col gap-1">
                  {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="py-2.5 text-ink/90 text-sm font-medium">{n.label}</a>)}
                  <a href="#plans" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos font-semibold text-sm">Choose Plan <ArrowRight className="w-4 h-4" /></a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}


/* ---------- Hero ---------- */
const HERO_SLIDES = [
  {
    image: '/images/beduine_travel_hero_1779521651766.png',
    tagline: 'Beduine Tour & Travels',
    title1: 'Journeys that',
    title2: 'stay with you.',
    desc: 'A futuristic travel subscription that combines AI-curated journeys, weekly reward draws, and guaranteed travel credits.',
  },
  {
    image: '/images/kashmir_dal_lake_1779521728036.png',
    tagline: 'Kashmir Paradise',
    title1: 'Misty Peaks &',
    title2: 'Shikara Rides.',
    desc: 'Unwind in the pristine valleys of Srinagar, ride through the snows of Gulmarg, and stay in premium houseboats.',
  },
  {
    image: '/images/kerala_houseboat_1779521772928.png',
    tagline: 'Kerala Backwaters',
    title1: 'Green Valleys &',
    title2: 'Houseboat Stays.',
    desc: "Float down the quiet backwaters of Alleppey and walk through Munnar's sprawling, aromatic tea plantations.",
  },
  {
    image: '/images/darjeeling_tea_1779521805614.png',
    tagline: 'Himalayan Beauty',
    title1: 'Sunrise over Gold',
    title2: 'Mountain Peaks.',
    desc: 'Watch the sunrise paint Kanchenjunga from Tiger Hill and travel on the historic Himalayan Toy Train.',
  },
  {
    image: '/images/dubai_skyline_1779539448313.png',
    tagline: 'Dubai Metropolis',
    title1: 'Modern Wonders &',
    title2: 'Golden Dunes.',
    desc: 'Gaze out from the heights of Burj Khalifa, cruise the Marina, and enjoy a traditional desert safari sunset.',
  },
  {
    image: '/images/singapore_skyline_1779539502293.png',
    tagline: 'Futuristic Singapore',
    title1: 'Gardens by the Bay',
    title2: 'City Wonder.',
    desc: 'Explore the spectacular supertrees, walk the modern skyline, and enjoy the beautiful theme parks of Sentosa.',
  },
  {
    image: '/images/rajasthan_palace_1779521744228.png',
    tagline: 'Royal Rajasthan',
    title1: 'Majestic Forts &',
    title2: 'Heritage Palaces.',
    desc: 'Step into history with royal palaces in Udaipur, ancient forts in Jaipur, and camps under the stars in Jaisalmer.',
  },
  {
    image: '/images/maldives_overwater_1779539482305.png',
    tagline: 'Maldives Paradise',
    title1: 'Overwater Villas &',
    title2: 'Coral Reefs.',
    desc: 'Relax on powder-white sands, stay over crystal waters, and snorkel with colorful marine life in tropical warmth.',
  },
];

function Hero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5400);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[currentSlideIndex];

  return (
    <section id="top" className="relative min-h-screen flex items-center bg-cosmos overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlideIndex}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt={slide.tagline} className="w-full h-full object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos/30 via-transparent to-cosmos/50 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cosmos/50 via-transparent to-transparent z-[2]" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-15 z-[1]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-32 pb-24 w-full z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 text-left text-ink flex flex-col justify-center">
          <div className="min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
                className="flex flex-col text-left"
              >
                <div className="mb-2">
                  <span className="font-pacifico text-3xl md:text-4xl text-cyan-deep drop-shadow-[0_1px_2px_rgba(0,180,216,0.2)]">
                    {slide.tagline}
                  </span>
                </div>
                <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.0] text-ink uppercase">
                  {slide.title1}<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-deep to-cyan">{slide.title2}</span>
                </h1>
                <p className="text-sm sm:text-base text-ink/80 mt-4 max-w-xl leading-relaxed font-medium">
                  {slide.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a href="#plans" className="cursor-pointer">
              <button className="px-8 py-4 bg-cyan hover:bg-cyan-deep text-white font-bold rounded-full shadow-lg hover:shadow-cyan/30 hover:-translate-y-0.5 transition-all text-base flex items-center gap-2 uppercase tracking-wider group cursor-pointer border-none">
                Book Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>

          <div className="relative h-48 mt-6 w-full hidden sm:block">
            <motion.div initial={{ opacity: 0, x: -30, rotate: -20 }} animate={{ opacity: 1, x: 0, rotate: -12 }} transition={{ duration: 1, delay: 0.5 }} className="absolute left-0 bottom-2 bg-white p-3 pb-5 shadow-2xl rounded-sm w-44 border border-slate-200">
              <img src="/images/kashmir_dal_lake_1779521728036.png" alt="Kashmir Dal Lake" className="w-full h-28 object-cover rounded-sm" />
              <div className="text-[11px] text-slate-800 font-pacifico mt-2 text-center">Kashmir Dal Lake</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30, rotate: 20 }} animate={{ opacity: 1, x: 140, rotate: 6 }} transition={{ duration: 1, delay: 0.7 }} className="absolute bottom-4 bg-white p-3 pb-5 shadow-2xl rounded-sm w-44 border border-slate-200 z-10">
              <img src="/images/darjeeling_tea_1779521805614.png" alt="Darjeeling Tea" className="w-full h-28 object-cover rounded-sm" />
              <div className="text-[11px] text-slate-800 font-pacifico mt-2 text-center">Darjeeling Tea</div>
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[480px]">
          <div className="w-[280px] h-[430px] sm:w-[300px] sm:h-[450px] rounded-[150px] border-[10px] border-white shadow-2xl overflow-hidden relative bg-sky-200 z-20">
            <img src="/images/maldives_overwater_1779539482305.png" alt="Maldives overwater villa" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-400/20 via-transparent to-transparent pointer-events-none" />
          </div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-4 top-16 w-72 h-72 z-30 pointer-events-none">
            <img src="/images/airplane_nobg.png" alt="Airplane" className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.2)]" style={{ transform: 'rotate(45deg) scale(1.15)' }} />
          </motion.div>
          <motion.div animate={{ x: [-15, 15, -15] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} className="absolute -left-12 bottom-20 w-44 h-14 bg-white/95 rounded-full blur-[3px] shadow-lg z-[25] opacity-90" />
          <motion.div animate={{ x: [15, -15, 15] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-8 top-12 w-48 h-14 bg-white/90 rounded-full blur-[4px] shadow-lg z-[35] opacity-90" />
          <motion.div animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute left-6 top-32 z-[35] pointer-events-none">
            <Heart className="w-12 h-12 text-rose-500 fill-rose-500 filter drop-shadow-[0_4px_8px_rgba(244,63,94,0.3)]" />
          </motion.div>
          <motion.div animate={{ y: [0, -16, 0], rotate: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute right-2 bottom-24 z-[35] pointer-events-none">
            <Heart className="w-14 h-14 text-cyan fill-cyan filter drop-shadow-[0_4px_8px_rgba(0,180,216,0.3)]" />
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }} className="absolute right-16 bottom-6 z-[35] pointer-events-none">
            <Heart className="w-10 h-10 text-cyan fill-cyan filter drop-shadow-[0_4px_8px_rgba(14,165,233,0.3)]" />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ink/40 text-[10px] tracking-[0.3em] uppercase">
        <span>Scroll</span><div className="w-px h-10 bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}

function LegacyHero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
      <LiquidFilter />
      <StarField count={100} />
      <AuroraBackground variant="cyan" />
      <GradientMesh />
      <FloatingOrbs count={4} variant="mixed" />
      <FlowingLines count={4} />
      <WaveBackground color="mixed" />

      {/* Cinematic background */}
      <div className="absolute inset-0">
        <motion.div initial={{ scale: 1.2, opacity: 0, filter: 'blur(30px)' }} animate={loaded ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}} transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0" style={{ filter: 'url(#liquid-filter)' }}>
          <img src="/images/beduin_travel_hero_1779521651766.png" alt="Beduine Travel Hero" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos/90 via-void/80 to-cosmos" />
        <div className="absolute inset-0 bg-gradient-to-r from-cosmos via-cosmos/70 to-transparent" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-70" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[400px] rounded-full bg-cyan/15 blur-[120px]" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-neon-gold/10 blur-[120px]" />

      <div className="hero-floating-picture" aria-hidden="true">
        <img src="/images/beduine-floating-plane.png" alt="" />
      </div>

      <div className="absolute top-1/2 right-1/4 hidden lg:block" style={{ width: 200, height: 200 }}>
        <div className="absolute inset-0 rounded-full border border-cyan/20" />
        <div className="absolute inset-6 rounded-full border border-neon-gold/20" />
        <div className="orbit absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyan" style={{ ['--r' as any]: '100px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-32 pb-24 w-full z-10">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-cyan text-cyan text-xs uppercase tracking-widest font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-soft-pulse" />
            <span>AI-Powered · 100% Transparent · Blockchain-Verified</span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-[6.5rem] font-bold text-ink leading-[0.95] tracking-tight">
            <StaggerText text="Safar jo" delay={0.6} className="block" />
            <span className="block gold-shimmer mt-2"><StaggerText text="yaad rahe." delay={1.2} /></span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 2, ease: [0.22, 1, 0.36, 1] }} className="mt-8 text-lg lg:text-xl text-ink/80 max-w-2xl leading-relaxed">
            A <span className="neon-cyan font-semibold">futuristic travel subscription</span> that combines AI-curated journeys, weekly reward draws, and guaranteed travel credits.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 2.3 }} className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#plans"><ParticleButton variant="gold" className="group inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full font-bold text-base lg:text-lg"><Sparkles className="w-5 h-5" />Choose Your Plan. Try Your Luck. Travel Beyond Limits.<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></ParticleButton></a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.6 }} className="mt-14 grid grid-cols-3 gap-4 lg:gap-10 max-w-2xl">
            {[{ n: '100%', l: 'Operational Integrity' }, { n: '50+', l: 'Curated Destinations' }, { n: '12 mo', l: 'Subscription Life' }].map((s) => (
              <div key={s.l} className="border-l-2 border-cyan/50 pl-4">
                <div className="font-display text-2xl lg:text-4xl font-bold text-ink tabular">{s.n}</div>
                <div className="text-[11px] lg:text-xs text-ink/60 mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ink/40 text-[10px] tracking-[0.3em] uppercase">
        <span>Scroll</span><div className="w-px h-10 bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}

/* ---------- Trust Strip ---------- */
function TrustStrip() {
  const items = [
    { icon: ShieldCheck, t: 'RNG Certified' }, { icon: Lock, t: 'End-to-End Encrypted' },
    { icon: FileText, t: 'Public Audit Reports' }, { icon: Fingerprint, t: 'Biometric Verified' },
    { icon: Bot, t: 'AI-Powered Curation' },
  ];
  return (
    <section className="relative py-10 border-y border-slate-line bg-cosmos/60 scanline z-10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {items.map((it) => (
            <div key={it.t} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-9 h-9 rounded-lg glass-cyan flex items-center justify-center shrink-0"><it.icon className="w-4 h-4 text-cyan" /></div>
              <div className="text-xs lg:text-sm text-ink/75 font-medium">{it.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------- About Us / Mission / Vision ---------- */
function AboutUs() {
  const pillars = [
    { icon: Heart, title: 'Our Mission', accent: 'cyan', image: '/images/about_mission.png',
      text: 'Transform travel into an accessible, reliable, and rewarding experience for everyone. We offer carefully crafted tours that balance culture, comfort and adventure — delivering a subscription model where members enjoy weekly lucky draws and guaranteed discounts.',
      points: ['Curated tours for every traveller', 'Subscription model with guaranteed value', 'A trusted partner in creating memories'] },
    { icon: Globe, title: 'Our Vision', accent: 'teal', image: '/images/about_vision.png',
      text: 'Revolutionize the travel industry with a sustainable, inclusive, and transparent model. Expand across India with a franchise and agent-driven network — integrating cutting-edge technology for seamless subscriptions and tour management.',
      points: ['Pan-India franchise network', 'Technology-first transparency', 'From domestic roots to global journeys'] },
    { icon: Users, title: 'Our Promise', accent: 'violet', image: '/images/about_promise.png',
      text: 'Every subscriber gets more value than their subscription fee — whether they win or not. We believe travel is not just about visiting destinations — it\'s about building stories, emotions, and connections that last a lifetime.',
      points: ['Winners enjoy luxury tours free', 'Non-winners always get assured discounts', 'Fair, transparent, community-driven'] },
  ];
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-void overflow-hidden">
      <StarField count={50} />
      <AuroraBackground variant="gold" />
      <FloatingOrbs count={4} variant="mixed" />
      <MorphBlobs />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-neon-gold/10 blur-[120px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-cyan/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> About Beduine <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Safar jo" />
              <br /><span className="gold-shimmer"><KineticText text="yaad rahe." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed max-w-2xl mx-auto">Beduine Tour & Travels is a customer-first travel company dedicated to crafting memorable journeys across India and beyond. We combine curated itineraries, transparent pricing, and a unique subscription model that rewards every member.</p>
          </div>
        </Reveal>

        {/* Pillar Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <TiltCard className="h-full" intensity={6}>
                <div className={`glass rounded-3xl overflow-hidden border border-slate-line ${p.accent === 'cyan' ? 'hover:neon-border-cyan' : p.accent === 'gold' ? 'hover:neon-border-gold' : 'hover:neon-border-violet'} transition-all h-full tilt-inner flex flex-col group`}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <FloatingIcon delay={i * 0.5}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-violet shadow-cyan/30' : p.accent === 'teal' ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal/30' : 'bg-gradient-to-br from-violet to-fuchsia-500 shadow-violet/30'}`}>
                          <p.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} />
                        </div>
                      </FloatingIcon>
                    </div>
                    <Rocket className="absolute top-4 right-4 w-5 h-5 text-ink/20" />
                  </div>
                  <div className="p-8 pt-5 flex-1 flex flex-col">
                    <h3 className="font-display text-xl font-bold text-ink mb-3">{p.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed mb-5 flex-1">{p.text}</p>
                    <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                      {p.points.map((pt) => <li key={pt} className="flex items-center gap-2.5 text-sm text-ink/80"><GoldCheck size={16} variant={p.accent as any} /><span>{pt}</span></li>)}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Address & Website strip with Office Setup Image */}
        <Reveal>
          <div className="mt-14 glass-gold rounded-3xl overflow-hidden border border-neon-gold/40 neon-border-gold shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <div className="p-6 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-neon-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                    <MapPin className="w-3.5 h-3.5" /> Registered Office
                  </div>
                  <h3 className="font-display text-2xl lg:text-4xl font-bold text-ink leading-tight mb-4">
                    Fulia, Nadia,<br />West Bengal — 741402
                  </h3>
                  <p className="text-sm text-ink/75 leading-relaxed mb-6">
                    Step inside Beduine Tour & Travels. Visit our head office in Fulia for customized tour planning, group holiday bookings, or to grab a hot cup of tea while we design your next memory.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-line/50">
                  <a href="https://www.beduine.in" target="_blank" rel="noreferrer" data-magnetic className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-cyan/50 text-cyan text-sm font-semibold hover:bg-cyan/10 transition-all"><Globe className="w-4 h-4" />www.beduine.in</a>
                  <a href="tel:+918768903565" data-magnetic className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-neon-gold/50 text-neon-gold text-sm font-semibold hover:bg-neon-gold/10 transition-all"><Phone className="w-4 h-4" />+91 87689 03565</a>
                </div>
              </div>
              <div className="relative min-h-[300px] lg:min-h-full overflow-hidden group">
                <img src="/images/office_setup.png" alt="Beduine Fulia Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/30 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 z-10 p-4 glass rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="text-xs text-neon-gold font-mono">// Fulia HQ Setup</div>
                  <div className="font-display font-semibold text-white text-sm mt-0.5">Welcome to Beduine Tour & Travels</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    { n: '01', icon: CreditCard, title: 'Choose Your Subscription', desc: 'Pick Silver, Gold, or Platinum — each valid for 12 months.', details: ['12-month validity', 'Digital dashboard', 'Instant credit allocation'], img: '/images/beduin_travel_hero_1779521651766.png' },
    { n: '02', icon: Target, title: 'Enter the Weekly Draw', desc: 'Every Sunday, eligible subscribers enter a verified draw for a fully-paid luxury tour.', details: ['Certified RNG process', 'Live-streamed selection', 'Publicly archived results'], img: '/images/lucky_draw_ticket_1779521667122.png' },
    { n: '03', icon: Gift, title: 'Win Tour — or Use Credit', desc: 'Selected members get a luxury journey. Everyone else gets guaranteed credits.', details: ['Luxury tour covered', '₹500 – ₹2,000 in credits', 'Never empty-handed'], img: '/images/happy_travelers_family_1779521684057.png' },
  ];
  return (
    <section id="how" className="relative py-24 lg:py-32 cosmic-bg overflow-hidden">
      <StarField count={50} />
      <AuroraBackground variant="cyan" />
      <FloatingOrbs count={5} variant="cyan" />
      <MorphBlobs />
      <FlowingLines count={4} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[120px]" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> The Protocol <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="A subscription built on" />
              <br /><span className="gradient-neon"><KineticText text="guaranteed value." delay={0.4} /></span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <TiltCard className="h-full" intensity={6}>
                <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner">
                  {/* Step image */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/60 to-transparent" />
                    <div className="absolute top-3 left-4 font-display text-5xl font-bold text-cyan/30 tabular">{s.n}</div>
                    <div className="absolute top-3 right-3">
                      <FloatingIcon delay={i * 0.5}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-lg shadow-cyan/30"><s.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} /></div>
                      </FloatingIcon>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed mb-5">{s.desc}</p>
                    <ul className="space-y-2 pt-5 border-t border-slate-line">
                      {s.details.map((d) => <li key={d} className="flex items-center gap-2.5 text-sm text-ink/80"><GoldCheck size={16} /><span>{d}</span></li>)}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 glass-gold rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <FloatingIcon><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shrink-0 shadow-lg shadow-neon-gold/40"><ShieldCheck className="w-7 h-7 text-cosmos" strokeWidth={2.2} /></div></FloatingIcon>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-widest neon-gold font-semibold mb-1">Our Commitment</div>
              <div className="font-display text-xl lg:text-2xl font-bold text-ink">100% Operational Integrity.</div>
              <p className="text-sm text-ink/70 mt-2">Every draw uses a certified RNG. Every result is live-streamed and archived. Every member receives documented, verifiable value.</p>
            </div>
            <a href="#audit" data-magnetic className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-neon-gold/50 text-neon-gold text-sm font-semibold hover:bg-neon-gold/10 transition-all shrink-0">View Audit Archive <ArrowRight className="w-4 h-4" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Plan Card ---------- */
function PlanCard({ plan, index, onSelectPlan }: { plan: typeof PLANS[number]; index: number; onSelectPlan: (planName: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setImgStyle({ transform: `scale(1.15) translate(${(x - 0.5) * -20}px, ${(y - 0.5) * -20}px)` });
  };
  const onLeave = () => setImgStyle({ transform: 'scale(1) translate(0,0)' });

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard intensity={6}>
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner ${plan.featured ? 'border-2 border-neon-gold/60 neon-border-gold bg-gradient-to-b from-abyss to-void' : 'glass border border-slate-line hover:neon-border-cyan'}`}>
          {plan.featured && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-gold via-cyan to-neon-gold z-10" />}
          {plan.featured && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Crown className="w-3 h-3 fill-current" /> Premium Choice</div>}

          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-abyss to-void">
            <div className={`tilt-img absolute inset-0 bg-cover bg-center transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-85'}`} style={{ ...imgStyle, backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/25 to-transparent" />
            <div className="relative p-7 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-cyan-deep uppercase tracking-widest font-bold drop-shadow-sm">{plan.tagline}</div>
                  <div className="font-display text-3xl font-bold text-ink mt-0.5 drop-shadow-sm">{plan.name}</div>
                </div>
                <plan.icon className="w-10 h-10 text-neon-gold drop-shadow-md" strokeWidth={1.8} />
              </div>
              <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs text-neon-gold font-semibold drop-shadow-sm">
                <MapPin className="w-3.5 h-3.5" /> {plan.imageLabel}
              </motion.div>
            </div>
          </div>

          <div className="p-7 border-b border-slate-line">
            <div className="flex items-baseline gap-1">
              <span className="text-neon-gold text-lg font-semibold">₹</span>
              <span className="font-display text-5xl font-bold text-ink tabular">{plan.price}</span>
              <span className="text-ink/50 text-sm">/ 12 mo</span>
            </div>
            <div className="mt-2 text-sm text-ink/60">Winner tour value up to <b className="neon-gold">₹{plan.tourValue.toLocaleString('en-IN')}</b> · {plan.duration}</div>
          </div>

          <div className="p-7 border-b border-slate-line">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-cyan" /><div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold">Winner Destinations</div></div>
            <ul className="space-y-2">{plan.destinations.map((d) => <li key={d} className="flex items-start gap-2 text-sm text-ink/80"><GoldCheck size={15} /><span>{d}</span></li>)}</ul>
          </div>

          <div className="p-7 space-y-2.5">{plan.benefits.map((b) => <div key={b} className="flex items-start gap-2.5 text-sm text-ink/80"><GoldCheck size={16} /><span>{b}</span></div>)}</div>

          <div className="px-7 pb-5">
            <div className="grid grid-cols-2 gap-2">
              {[{ l: 'Discount Credits', v: `${plan.discountCredits} × ₹500` }, { l: 'Paid Tour Off', v: `Up to ${plan.paidDiscount}` }, { l: 'Insurance', v: plan.insurance }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="glass-light rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-ink/50">{c.l}</div>
                  <div className="text-xs font-semibold text-ink mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            <ParticleButton 
              onClick={() => onSelectPlan(plan.name)} 
              variant={plan.featured ? 'gold' : 'cyan'} 
              className="block text-center w-full py-3.5 rounded-full font-bold"
            >
              {plan.featured ? 'Lock Platinum Entry' : `Choose ${plan.name}`}
            </ParticleButton>
            <div className="text-center text-[11px] text-ink/45 mt-3 font-mono">// 12-mo validity · pickup included</div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function Plans({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <section id="plans" className="relative py-24 lg:py-32 bg-void overflow-hidden">
      <StarField count={60} />
      <AuroraBackground variant="gold" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-neon-gold/10 blur-[120px]" />
      <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-cyan/10 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Domestic Plans <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Choose your plan." />
              <br /><span className="gold-shimmer"><KineticText text="Travel beyond limits." delay={0.4} /></span>
            </h2>
          </div>
        </Reveal>

        {/* Subscription Rules & Benefits Banner */}
        <Reveal>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl glass-cyan border border-cyan/20 shadow-xl shadow-slate-200/50 mb-12 max-w-3xl mx-auto overflow-hidden group text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-cyan/10 blur-xl" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-cyan-deep flex items-center justify-center shrink-0 shadow-lg shadow-cyan/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-left text-xs sm:text-sm leading-relaxed relative z-10 text-ink">
              <div className="font-semibold text-cyan-deep uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Subscription Rules & Benefits
              </div>
              <div className="text-ink/80 mt-1">
                <span className="text-rose-600 font-bold">No Cash Refunds.</span> Active subscribers are automatically entered into weekly draws to win a <span className="text-cyan-deep font-bold">fully-paid tour package</span>. If you don't win, 100% of your subscription fee accumulates as <span className="text-cyan-deep font-bold">Discount Credits</span> to book future tours.
              </div>
            </div>
          </motion.div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PLANS.map((p, i) => (
            <PlanCard key={p.name} plan={p} index={i} onSelectPlan={onSelectPlan} />
          ))}
        </div>

        <Reveal>
          <div className="mt-14 glass rounded-2xl p-6 lg:p-8 border border-slate-line">
            <div className="text-center text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-5">Included in every domestic plan</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[{ i: Calendar, t: '12 Months Validity', d: 'Full subscription coverage' }, { i: MapPin, t: 'Pickup & Drop', d: 'From selected points' }, { i: Award, t: 'Quarterly Tours', d: 'Batched travel cycles' }, { i: BarChart3, t: 'Digital Dashboard', d: 'Track credits & draws' }].map((b) => (
                <div key={b.t} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass-cyan text-cyan flex items-center justify-center shrink-0 border border-slate-line"><b.i className="w-5 h-5" /></div>
                  <div><div className="font-semibold text-ink text-sm">{b.t}</div><div className="text-xs text-ink/55">{b.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- International Plans ---------- */
function IntlPlanCard({ plan, index, onSelectPlan }: { plan: typeof INTL_PLANS[number]; index: number; onSelectPlan: (planName: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setImgStyle({ transform: `scale(1.15) translate(${(x - 0.5) * -20}px, ${(y - 0.5) * -20}px)` });
  };
  const onLeave = () => setImgStyle({ transform: 'scale(1) translate(0,0)' });

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard intensity={6}>
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner ${plan.featured ? 'border-2 border-emerald-400/60 neon-border-cyan bg-gradient-to-b from-abyss to-void' : 'glass border border-slate-line hover:neon-border-cyan'}`}>
          {plan.featured && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan to-emerald-400 z-10" />}
          {plan.featured && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Plane className="w-3 h-3 fill-current" /> Best Value</div>}

          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-abyss to-void">
            <div className={`tilt-img absolute inset-0 bg-cover bg-center transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-85'}`} style={{ ...imgStyle, backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/25 to-transparent" />
            <div className="relative p-7 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-cyan-deep uppercase tracking-widest font-bold drop-shadow-sm">{plan.tagline}</div>
                  <div className="font-display text-3xl font-bold text-ink mt-0.5 drop-shadow-sm">{plan.name}</div>
                </div>
                <plan.icon className="w-10 h-10 text-cyan drop-shadow-md" strokeWidth={1.8} />
              </div>
              <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs text-cyan font-semibold drop-shadow-sm">
                <Plane className="w-3.5 h-3.5" /> {plan.imageLabel}
              </motion.div>
            </div>
          </div>

          <div className="p-7 border-b border-slate-line">
            <div className="flex items-baseline gap-1">
              <span className="text-cyan text-lg font-semibold">₹</span>
              <span className="font-display text-5xl font-bold text-ink tabular">{plan.price.toLocaleString('en-IN')}</span>
              <span className="text-ink/50 text-sm">/ 12 mo</span>
            </div>
            <div className="mt-2 text-sm text-ink/60">Winner tour value up to <b className="neon-cyan">₹{plan.tourValue.toLocaleString('en-IN')}</b> · {plan.duration}</div>
          </div>

          <div className="p-7 border-b border-slate-line">
            <div className="flex items-center gap-2 mb-3"><Plane className="w-4 h-4 text-cyan" /><div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold">International Destinations</div></div>
            <ul className="space-y-2">{plan.destinations.map((d) => <li key={d} className="flex items-start gap-2 text-sm text-ink/80"><GoldCheck size={15} variant="cyan" /><span>{d}</span></li>)}</ul>
          </div>

          <div className="p-7 space-y-2.5">{plan.benefits.map((b) => <div key={b} className="flex items-start gap-2.5 text-sm text-ink/80"><GoldCheck size={16} variant="cyan" /><span>{b}</span></div>)}</div>

          <div className="px-7 pb-5">
            <div className="grid grid-cols-2 gap-2">
              {[{ l: 'Discount Credits', v: `${plan.discountCredits} × ₹500` }, { l: 'Tour Discount', v: `Up to ${plan.paidDiscount}` }, { l: 'Insurance', v: plan.insurance }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="glass-light rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-ink/50">{c.l}</div>
                  <div className="text-xs font-semibold text-ink mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            <ParticleButton 
              onClick={() => onSelectPlan(plan.name)} 
              variant={plan.featured ? 'cyan' : 'gold'} 
              className="block text-center w-full py-3.5 rounded-full font-bold"
            >
              {plan.featured ? '✈ Lock Voyager Entry' : `Choose ${plan.name}`}
            </ParticleButton>
            <div className="text-center text-[11px] text-ink/45 mt-3 font-mono">// 12-mo validity · visa assist included</div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function InternationalPlans({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <section id="intl-plans" className="relative py-24 lg:py-32 bg-cosmos overflow-hidden">
      <StarField count={70} />
      <AuroraBackground variant="cyan" />
      <FloatingOrbs count={6} variant="cyan" />
      <MorphBlobs />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-cyan/15 blur-[120px]" />
      <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-violet/10 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> International Packages <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Explore the world." />
              <br /><span className="gradient-neon"><KineticText text="No boundaries." delay={0.4} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Unlock premium international destinations with visa assistance, airport lounge access, and world-class travel experiences.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {INTL_PLANS.map((p, i) => (
            <IntlPlanCard key={p.name} plan={p} index={i} onSelectPlan={onSelectPlan} />
          ))}
        </div>

        <Reveal>
          <div className="mt-14 glass rounded-2xl p-6 lg:p-8 border border-slate-line neon-border-cyan">
            <div className="text-center text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-5">Included in every international plan</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[{ i: Calendar, t: '12 Months Validity', d: 'Full subscription coverage' }, { i: FileCheck2, t: 'Visa Assistance', d: 'End-to-end documentation' }, { i: Plane, t: 'Airport Lounge', d: 'Premium access included' }, { i: ShieldCheck, t: 'Travel Insurance', d: 'International coverage' }].map((b) => (
                <div key={b.t} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass-cyan text-cyan flex items-center justify-center shrink-0 border border-cyan/30"><b.i className="w-5 h-5" /></div>
                  <div><div className="font-semibold text-ink text-sm">{b.t}</div><div className="text-xs text-ink/55">{b.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-cosmos overflow-hidden">
      <StarField count={40} />
      <GradientMesh />
      <FloatingOrbs count={4} variant="mixed" />
      <MorphBlobs />
      <WaveBackground color="cyan" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Services <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="End-to-end travel," />
              <br /><span className="gradient-neon"><KineticText text="handled." delay={0.4} /></span>
            </h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <TiltCard intensity={5}>
                <div className="glass rounded-2xl p-7 border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner">
                  <FloatingIcon delay={i * 0.3}><div className="w-14 h-14 rounded-2xl glass-cyan flex items-center justify-center mb-5 border border-slate-line"><s.icon className="w-7 h-7 text-cyan" strokeWidth={1.8} /></div></FloatingIcon>
                  <h3 className="font-display text-lg font-bold text-ink mb-2">{s.title}</h3>
                  <p className="text-sm text-ink/65 leading-relaxed">{s.desc}</p>
                  <div className="mt-5 pt-5 border-t border-slate-line flex items-center gap-2 text-xs font-semibold neon-cyan">Learn more <ArrowRight className="w-3.5 h-3.5" /></div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Transparency ---------- */
function Transparency() {
  return (
    <section id="audit" className="relative py-24 lg:py-32 bg-void overflow-hidden">
      <StarField count={50} />
      <AuroraBackground variant="cyan" />
      <FloatingOrbs count={5} variant="cyan" />
      <FlowingLines count={5} />
      <div className="absolute inset-0 grid-pattern opacity-40 grid-pulse" />
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Transparency Engine <div className="w-8 h-px bg-neon-gold" /></div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight">
                <KineticText text="Every draw," />
                <br /><span className="gold-shimmer"><KineticText text="fully documented." delay={0.3} /></span>
              </h2>
              <p className="mt-6 text-ink/70 text-lg leading-relaxed">Trust isn't claimed — it's proven. Our weekly reward draws use certified RNG, are live-streamed, and are archived as downloadable audit reports.</p>
              <div className="mt-8 space-y-4">
                {[{ icon: Eye, t: 'Live-streamed draws', d: 'Every Sunday at 6 PM on YouTube & Facebook.' }, { icon: FileText, t: 'Public audit reports', d: 'PDF / CSV with verified draw records and winner list.' }, { icon: Lock, t: 'Verifiable coupons', d: 'Unique QR / UUID codes — impossible to duplicate.' }, { icon: TrendingUp, t: 'Fair selection process', d: 'Results are reviewed and published through official channels.' }].map((f, i) => (
                  <Reveal key={f.t} delay={i * 0.08}>
                    <div className="flex items-start gap-4">
                      <FloatingIcon delay={i * 0.4}><div className="w-11 h-11 rounded-xl glass-gold flex items-center justify-center shrink-0 border border-slate-line"><f.icon className="w-5 h-5 text-neon-gold" /></div></FloatingIcon>
                      <div><div className="font-display font-bold text-ink">{f.t}</div><div className="text-sm text-ink/65 mt-0.5">{f.d}</div></div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="glass rounded-3xl p-6 lg:p-8 border border-slate-line neon-border-cyan">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-1 font-mono">// Digital Audit Archive</div>
                  <div className="font-display text-xl font-bold text-ink">Recent Draw Reports</div>
                </div>
                <FloatingIcon><div className="w-10 h-10 rounded-xl glass-cyan flex items-center justify-center border border-cyan/30"><Scan className="w-5 h-5 text-cyan" /></div></FloatingIcon>
              </div>
              <div className="space-y-3">
                {AUDIT_REPORTS.map((r) => (
                  <div key={r.week} className="glass-light rounded-xl p-4 border border-slate-line hover:neon-border-gold transition-all">
                    <div className="flex items-center justify-between mb-2"><div className="font-display font-semibold text-ink text-sm">{r.week}</div><div className="text-[10px] text-ink/50 font-mono">{r.date}</div></div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div><div className="text-[9px] uppercase tracking-widest text-ink/50">Status</div><div className="text-sm font-semibold neon-gold tabular">{r.status}</div></div>
                      <div><div className="text-[9px] uppercase tracking-widest text-ink/50">Format</div><div className="text-sm font-semibold text-ink tabular">PDF</div></div>
                    </div>
                    <button data-magnetic className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-neon-gold/10 border border-slate-line hover:border-neon-gold/40 text-xs font-semibold text-ink hover:text-neon-gold transition-all"><Download className="w-3.5 h-3.5" /> Download Report (PDF)</button>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-line text-center">
                <button className="text-xs font-semibold neon-cyan hover:text-cyan-bright inline-flex items-center gap-1.5 font-mono">&gt; view_full_archive() <ArrowRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Lucky Draw Execution Strategy ---------- */
function LuckyDrawSystem() {
  const phases = [
    { n: '01', icon: Scan, title: 'Data Verification', accent: 'cyan',
      desc: 'All subscription logins made up to Saturday 11:59 PM are collected. Every participant is assigned a unique ticket ID.',
      details: ['Duplicate entries & unverified payments are programmatically purged', 'Invalid accounts are filtered before pool freeze', 'Final subscriber list is frozen for that week\'s draw'] },
    { n: '02', icon: Bot, title: 'Random Selection Engine', accent: 'teal',
      desc: 'A secure Random Number Generator (RNG) system selects the winning ticket IDs with full transparency.',
      details: ['Uses Random.org or audit-locked in-house script', 'Selection streamed live or recorded with screen-share', 'Visible on Facebook & YouTube channels'] },
    { n: '03', icon: FileText, title: 'Reports & Audits', accent: 'violet',
      desc: 'A comprehensive draw report containing all pool metrics is compiled weekly and archived.',
      details: ['PDF/CSV with total pool, winning IDs & timestamps', 'RNG seed logs included for verification', 'Archived for transparent internal & external audits'] },
    { n: '04', icon: Send, title: 'Winner Announcement', accent: 'cyan',
      desc: 'Winners are announced every Sunday evening across all company channels with unique digital coupons.',
      details: ['Website Winners Page + Social Media posts', 'SMS & Email notification with coupon code', 'Unique QR/UUID codes — impossible to duplicate'] },
  ];

  const schedule = [
    { quarter: 'Jan – Mar', tour: 'July', color: 'from-cyan to-blue-500', img: '/images/sundarbans_mangrove_1779521789593.png' },
    { quarter: 'Apr – Jun', tour: 'October', color: 'from-teal-400 to-emerald-600', img: '/images/darjeeling_tea_1779521805614.png' },
    { quarter: 'Jul – Sep', tour: 'January', color: 'from-violet to-purple-500', img: '/images/kashmir_dal_lake_1779521728036.png' },
    { quarter: 'Oct – Dec', tour: 'April', color: 'from-emerald-400 to-teal-500', img: '/images/kerala_houseboat_1779521772928.png' },
  ];

  return (
    <section id="luckydraw" className="relative py-24 lg:py-32 bg-cosmos overflow-hidden">
      <StarField count={70} />
      <AuroraBackground variant="cyan" />
      <FloatingOrbs count={6} variant="mixed" />
      <MorphBlobs />
      <FlowingLines count={5} />
      <div className="absolute inset-0 grid-pattern opacity-40 grid-pulse" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-cyan/15 blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-violet/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Lucky Draw Protocol <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="How the draw" />
              <br /><span className="gradient-neon"><KineticText text="actually works." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every Sunday, eligible subscribers enter a verified lucky draw. The customer journey stays simple: enter, watch, and receive your result securely.</p>
          </div>
        </Reveal>

        {/* Customer draw overview */}
        <Reveal>
          <div className="glass-gold rounded-3xl p-6 lg:p-10 border border-neon-gold/40 mb-16 neon-border-gold">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-[11px] uppercase tracking-widest neon-gold font-semibold mb-2 font-mono">// Weekly Draw Experience</div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">Simple, secure, and verified.</div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Members can follow the draw experience clearly. Results are checked, documented, and shared through official Beduine channels.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {['Eligible entries', 'Verified selection', 'Official result'].map((item) => (
                    <div key={item} className="glass-light rounded-xl p-3 border border-slate-line text-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-ink">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-line" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gold-grad)" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 90 * 0.72} ${Math.PI * 90 * 0.28}`} />
                    <defs><linearGradient id="gold-grad"><stop offset="0%" stopColor="#00D9FF" /><stop offset="100%" stopColor="#FFD166" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ShieldCheck className="w-12 h-12 text-neon-gold mb-2" />
                    <div className="text-[10px] uppercase tracking-widest text-ink/50 mt-1">Verified Draw</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-ink/50">Clear result updates for every member</div>
                  <div className="text-[10px] text-ink/40 mt-1 font-mono">Official channels only</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tour Scheduling Cycle */}
        <Reveal>
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2">Tour Scheduling Cycle</div>
              <div className="font-display text-2xl lg:text-3xl font-bold text-ink">When do winners travel?</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {schedule.map((s, i) => (
                <Reveal key={s.quarter} delay={i * 0.1}>
                  <div className="glass rounded-2xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all text-center group">
                    {/* Destination preview image */}
                    <div className="relative h-28 overflow-hidden">
                      <img src={s.img} alt={s.tour} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />
                      <div className={`absolute top-2 right-2 w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                        <Calendar className="w-4 h-4 text-cosmos" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-ink/50 uppercase tracking-widest mb-1 font-mono">Winners from</div>
                      <div className="font-display text-lg font-bold text-ink">{s.quarter}</div>
                      <div className="my-2 flex justify-center"><ArrowRight className="w-4 h-4 text-neon-gold rotate-90" /></div>
                      <div className="text-xs text-ink/50 uppercase tracking-widest mb-1 font-mono">Travel in</div>
                      <div className="font-display text-lg font-bold neon-gold">{s.tour}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 4-Phase Execution Process */}
        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <TiltCard className="h-full" intensity={5}>
                <div className="glass rounded-3xl p-7 border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="font-display text-4xl font-bold text-cyan/20 tabular">{p.n}</div>
                    <FloatingIcon delay={i * 0.3}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/30' : p.accent === 'teal' ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal/30' : 'bg-gradient-to-br from-violet to-fuchsia-500 shadow-violet/30'}`}>
                        <p.icon className="w-7 h-7 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ink/65 leading-relaxed mb-5">{p.desc}</p>

                  {/* Micro-illustration slot */}
                  {p.n === '01' && (
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/10 mb-5 h-28 bg-white/5 flex flex-col justify-between p-3.5 font-mono text-[9px] text-ink/70">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent pointer-events-none" />
                      <div className="absolute inset-x-0 h-0.5 bg-cyan/30 blur-[1px] animate-bounce top-0" style={{ animationDuration: '4s' }} />
                      <div className="flex justify-between items-center text-[8px] uppercase tracking-wider text-cyan border-b border-slate-line/50 pb-1.5 font-bold">
                        <span>Database Pool</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Verification</span>
                      </div>
                      <div className="space-y-1 my-1.5 flex-1 justify-center flex flex-col">
                        <div className="flex justify-between items-center"><span>User BD-92841: Verified payment</span><span className="text-emerald-500 font-bold">PASS</span></div>
                        <div className="flex justify-between items-center"><span>User BD-38104: Duplicate account</span><span className="text-rose-500 font-bold">PURGED</span></div>
                        <div className="flex justify-between items-center"><span>User BD-47201: Active subscriber</span><span className="text-emerald-500 font-bold">PASS</span></div>
                      </div>
                      <div className="text-[8px] text-ink/40 text-right mt-1 border-t border-slate-line/30 pt-1">
                        Pool freeze: Saturday 11:59 PM
                      </div>
                    </div>
                  )}

                  {p.n === '02' && (
                    <div className="relative rounded-2xl overflow-hidden border border-teal-500/10 mb-5 h-28 bg-white/5 flex items-center justify-between p-4">
                      <div className="absolute inset-0 bg-gradient-to-b from-teal/5 to-transparent pointer-events-none" />
                      <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                          className="absolute inset-0 rounded-full border border-dashed border-teal-500/40" />
                        <div className="absolute w-12 h-12 rounded-full border border-teal-500/20 bg-cosmos flex items-center justify-center shadow-lg shadow-teal-500/10">
                          <Bot className="w-6 h-6 text-teal" />
                        </div>
                      </div>
                      <div className="flex-1 pl-4 flex flex-col justify-center text-left font-mono">
                        <div className="text-[8px] uppercase tracking-wider text-teal font-bold mb-1">RNG selection</div>
                        <div className="text-lg font-black text-ink tracking-tight font-display leading-none">BD-47201</div>
                        <div className="text-[8px] text-ink/50 mt-1 uppercase tracking-widest">Entropy: Verified</div>
                      </div>
                    </div>
                  )}

                  {p.n === '03' && (
                    <div className="relative rounded-2xl overflow-hidden border border-violet-500/10 mb-5 h-28 bg-white/5 flex flex-col justify-between p-3.5 font-mono text-[9px] text-ink/70">
                      <div className="absolute inset-0 bg-gradient-to-b from-violet/5 to-transparent pointer-events-none" />
                      <div className="flex justify-between items-center text-[8px] uppercase tracking-wider text-violet border-b border-slate-line/50 pb-1.5 font-bold">
                        <span>Audit Logs</span>
                        <span>SECURE RECORD</span>
                      </div>
                      <div className="my-1.5 flex items-center gap-3">
                        <FileText className="w-10 h-10 text-violet/70 shrink-0" strokeWidth={1.5} />
                        <div className="text-left font-mono">
                          <div className="text-ink font-semibold">WeeklyReport_W42.pdf</div>
                          <div className="text-[8px] text-ink/50">SHA-256: 8a76baff...fe2f2eba</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[8px] text-ink/50 border-t border-slate-line/30 pt-1">
                        <span>Total Pool: 1,492 entries</span>
                        <span className="text-emerald-500 font-bold flex items-center gap-0.5">● Certified</span>
                      </div>
                    </div>
                  )}

                  {p.n === '04' && (
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/10 mb-5 h-28 bg-white/5 flex flex-col justify-between p-3.5 text-center">
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 to-transparent pointer-events-none" />
                      <div className="text-[8px] uppercase tracking-wider text-cyan font-bold font-mono">Live Announcement</div>
                      <div className="my-1 flex flex-col items-center">
                        <div className="text-[10px] font-display font-bold text-ink flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full border border-emerald-500/15">
                          <Crown className="w-3.5 h-3.5 fill-current animate-bounce" /> Congratulations Winner!
                        </div>
                      </div>
                      <div className="text-[8px] text-ink/50 uppercase tracking-widest font-mono">
                        SMS & Email notifications dispatched
                      </div>
                    </div>
                  )}
                  <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                    {p.details.map((d) => <li key={d} className="flex items-start gap-2.5 text-sm text-ink/80"><GoldCheck size={15} /><span>{d}</span></li>)}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Customer-end draw UX */}
        <Reveal>
          <div className="mt-16 glass rounded-3xl p-6 lg:p-10 border border-slate-line neon-border-cyan">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2 font-mono">// Customer-End Draw Experience</div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">You don't just wait — you <span className="gradient-neon">participate.</span></div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Every Sunday, subscribers log in to their Beduine account, use their Lucky Draw Credit to enter, and see results instantly. The draw is triggered by the system itself — not secretly by the company.</p>
                <div className="space-y-3">
                  {[
                    { step: '1', t: 'Log in on Sunday', d: 'Open your Beduine app or web portal' },
                    { step: '2', t: 'Activate your entry', d: 'Use your 1 Lucky Draw Credit to lock your ticket' },
                    { step: '3', t: 'Watch the draw', d: 'Digital scratch card or RNG animation reveals results' },
                    { step: '4', t: 'Instant result', d: 'Win → Tour coupon | Not selected → Discount credits confirmed' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center shrink-0 text-cosmos font-bold text-sm">{s.step}</div>
                      <div><div className="font-semibold text-ink text-sm">{s.t}</div><div className="text-xs text-ink/55">{s.d}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-line group shadow-2xl h-[320px]">
                <img src="/images/lucky_draw_ticket_1779521667122.png" alt="Lucky Draw Ticket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/50 to-cosmos/25" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-[10px] font-bold uppercase tracking-widest border border-cyan/20">Active Draw</span>
                    <span className="text-xs font-mono neon-gold font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3 animate-spin" /> Verifiable</span>
                  </div>
                  
                  <div className="glass rounded-xl p-4 border border-neon-gold/30 backdrop-blur-md">
                    <div className="text-center mb-3">
                      <div className="font-display text-sm font-semibold neon-gold tracking-wide">🏆 WEEKLY DRAW WINNER</div>
                      <div className="text-xs text-ink/75 mt-0.5">Congratulations! Your entry won a free luxury tour.</div>
                    </div>
                    <div className="glass rounded-lg p-2.5 border border-neon-gold/20 bg-cosmos/80 text-center font-mono">
                      <div className="text-[9px] uppercase tracking-widest text-ink/40">Coupon Code</div>
                      <div className="text-lg font-bold neon-cyan tracking-wider">BEDWIN-JULY-12345</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                    <span>Ticket ID: BD-98421-2026</span>
                    <span>Verified: Oct 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* SMS Example */}
        <Reveal>
          <div className="mt-8 glass-light rounded-xl p-5 border border-slate-line max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg glass-cyan flex items-center justify-center"><MessageCircle className="w-4 h-4 text-cyan" /></div>
              <div className="text-[10px] uppercase tracking-widest neon-cyan font-semibold">Sample Winner SMS</div>
            </div>
            <div className="glass rounded-xl p-4 border border-cyan/20 text-sm text-ink/80 leading-relaxed font-mono">
              ✓ Congratulations <span className="neon-gold">[Name]</span>! You are a Beduine Lucky Draw Winner! Your coupon: <span className="neon-cyan">BEDWIN-JULY-12345</span>. Call <span className="text-ink">+91 8768903565</span> for details.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Credit Architecture System ---------- */
/* ---------- Credit Architecture System ---------- */
function CreditArchitecture() {
  const credits = [
    { type: 'LDC', name: 'Lucky Draw Credit', icon: Sparkles, accent: 'cyan',
      desc: '1 Credit is issued per subscription. This credit acts as a token that the user manually spends on the mobile app/web portal on Sunday to lock their participation in that week\'s draw.',
      rule: '1 Credit = 1 Entry in the weekly Lucky Draw',
      details: ['Automatically added upon payment verification', 'Used every Sunday to activate draw entry', 'Ticket ID confirmed and locked for that week', 'No extra credits can be purchased — fair chance for all'] },
    { type: 'DC', name: 'Discount Credits', icon: CreditCard, accent: 'teal',
      desc: 'These act as the protective floor for non-winners. If a user does not win, these credits allow them to claim a flat ₹500 off per domestic tour booking.',
      rule: '1 Domestic Tour Booking = 1 Discount Credit applied',
      details: ['Silver: 1 DC → ₹500 off on 1 tour', 'Emerald: 2 DC → ₹500 × 2 = ₹1,000 off on 2 tours', 'Platinum: 4 DC → ₹500 × 4 = ₹2,000 off on 4 tours', 'Credits visible on your digital dashboard'] },
  ];

  const creditTable = [
    { plan: 'Silver', price: '₹499', ldc: '1', dc: '1 × ₹500', total: '₹500', color: 'from-slate-500 to-slate-700' },
    { plan: 'Emerald', price: '₹799', ldc: '1', dc: '2 × ₹500', total: '₹1,000', color: 'from-teal-400 to-emerald-600' },
    { plan: 'Platinum', price: '₹1,499', ldc: '1', dc: '4 × ₹500', total: '₹2,000', color: 'from-indigo-400 to-purple-500' },
  ];

  return (
    <section id="credits" className="relative py-24 lg:py-32 bg-void overflow-hidden">
      <StarField count={50} />
      <AuroraBackground variant="gold" />
      <FloatingOrbs count={5} variant="gold" />
      <FlowingLines count={4} />
      <WaveBackground color="gold" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-neon-gold/15 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Credit Architecture <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Two credits," />
              <br /><span className="gold-shimmer"><KineticText text="zero risk." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber receives two types of credits — one for the thrill of the draw, one as your guaranteed safety net. Win or not, you always gain.</p>
          </div>
        </Reveal>

        {/* Three Columns including Holographic pass */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {credits.map((c, i) => (
            <Reveal key={c.type} delay={i * 0.15}>
              <TiltCard className="h-full" intensity={5}>
                <div className={`rounded-3xl p-8 border h-full tilt-inner flex flex-col ${c.accent === 'cyan' ? 'glass neon-border-cyan border-cyan/30' : 'glass-gold neon-border-gold border-neon-gold/30'}`}>
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <FloatingIcon delay={i * 0.5}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${c.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/40' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/40'}`}>
                        <c.icon className="w-8 h-8 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div>
                      <div className={`font-mono text-xs font-bold tracking-wider ${c.accent === 'cyan' ? 'neon-cyan' : 'neon-gold'}`}>{c.type}</div>
                      <div className="font-display text-xl font-bold text-ink">{c.name}</div>
                    </div>
                  </div>

                  {/* Rule badge */}
                  <div className={`rounded-xl p-3 mb-5 ${c.accent === 'cyan' ? 'glass-cyan' : 'glass-gold'}`}>
                    <div className={`text-sm font-semibold ${c.accent === 'cyan' ? 'neon-cyan' : 'neon-gold'}`}>⚡ {c.rule}</div>
                  </div>

                  {/* Visual illustration slot */}
                  {c.type === 'LDC' ? (
                    /* Lucky Draw Token Image */
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40 bg-cosmos shrink-0">
                      <img src="/images/lucky_draw_token.png" alt="Lucky Draw Token" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono tracking-widest text-cyan font-bold">
                            LUCKY TOKEN
                          </span>
                          <span className="text-cyan/80 font-mono text-[9px]">
                            &gt;_ active
                          </span>
                        </div>
                        <div>
                          <div className="text-cyan font-mono text-xl tracking-widest mb-1 font-bold">
                            WEEKLY DRAW
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-cyan-deep/80 font-semibold">
                            <span>LDC UNIT</span>
                            <span>EXP: Sunday 8PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Discount Credit Voucher (CSS Holographic Card) */
                    <div className="relative rounded-2xl overflow-hidden border border-teal-500/20 group shadow-2xl mb-6 h-40 bg-gradient-to-br from-teal-500/5 via-cosmos to-teal-500/10 flex flex-col justify-between p-5 shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-400/5 to-transparent pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <span className="text-[10px] font-mono tracking-widest text-teal-600 font-bold">
                          DISCOUNT VOUCHER
                        </span>
                        <span className="text-teal-600/80 font-mono text-[9px] animate-pulse">
                          ● redeemable
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-2 relative z-10">
                        <div className="text-left">
                          <div className="text-[10px] uppercase tracking-widest text-ink/40 font-mono">Value</div>
                          <div className="text-3xl font-display font-black text-teal-600 tracking-tight leading-none font-sans">
                            ₹500
                          </div>
                        </div>
                        <div className="h-10 w-px border-l border-dashed border-teal-500/30" />
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-widest text-ink/40 font-mono">Applicable on</div>
                          <div className="text-xs font-bold text-ink mt-0.5">
                            Domestic Tours
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-teal-700/80 font-semibold relative z-10 pt-2 border-t border-teal-500/10">
                        <span>SECURE CREDITS</span>
                        <span>100% SECURED</span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-ink/65 leading-relaxed mb-6 flex-1">{c.desc}</p>

                  <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                    {c.details.map((d) => <li key={d} className="flex items-start gap-2.5 text-sm text-ink/80"><GoldCheck size={15} /><span>{d}</span></li>)}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          {/* Third Column: Interactive Holographic Member Pass */}
          <Reveal delay={0.3}>
            <TiltCard className="h-full" intensity={5}>
              <div className="rounded-3xl p-8 border h-full tilt-inner flex flex-col justify-between overflow-hidden relative transition-all duration-500 border-teal-500/30 glass shadow-teal-500/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan to-teal-deep shadow-lg shadow-cyan/20">
                      <Fingerprint className="w-8 h-8 text-cosmos" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold tracking-wider text-cyan">// BEDUINE DIGITAL PASS</div>
                      <div className="font-display text-xl font-bold text-ink">Beduine Member Pass</div>
                    </div>
                  </div>
                  
                  {/* Digital Pass Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40">
                    <img src="/images/credit_card_holographic_1779521713449.png" alt="Holographic Credit Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono tracking-widest text-white font-bold">
                          MEMBER CLUB
                        </span>
                        <span className="text-white/80 font-mono text-[9px]">
                          &gt;_ active
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-mono text-base tracking-widest mb-1">
                          •••• •••• •••• 2026
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-white/90">
                          <span>MEMBER PASS</span>
                          <span>EXP: 12 Months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-ink/70 leading-relaxed mb-6">
                    Your virtual membership card stores your draw tokens and discount credits. Accessible instantly from your phone.
                  </p>
                </div>
                
                <div className="rounded-xl p-3 bg-white/5 border border-slate-line flex items-center justify-between text-xs font-mono text-ink/80">
                  <span>Lucky Draw entry included</span>
                  <span className="text-emerald-500 font-bold">
                    Guaranteed Discounts
                  </span>
                </div>
              </div>
            </TiltCard>
          </Reveal>

        </div>

        {/* Credit Comparison Table */}
        <Reveal>
          <div className="glass rounded-3xl p-6 lg:p-8 border border-slate-line mb-12">
            <div className="text-center mb-6">
              <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2 font-mono">// Credit Allocation by Plan</div>
              <div className="font-display text-xl lg:text-2xl font-bold text-ink">What you get — guaranteed</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-line">
                    <th className="py-3 px-4 text-left text-[10px] uppercase tracking-widest text-ink/50 font-mono">Plan</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-ink/50 font-mono">Price</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest neon-cyan font-mono">LDC</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest neon-gold font-mono">Discount Credits</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-emerald-400 font-mono">Min Value</th>
                  </tr>
                </thead>
                <tbody>
                  {creditTable.map((r) => (
                    <tr key={r.plan} className="border-b border-slate-line/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                            <Star className="w-4 h-4 text-white/80" />
                          </div>
                          <span className="font-display font-bold text-ink">{r.plan}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-display font-bold text-ink">{r.price}</td>
                      <td className="py-4 px-4 text-center"><span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-xs font-semibold">{r.ldc}</span></td>
                      <td className="py-4 px-4 text-center"><span className="px-2.5 py-1 rounded-full glass-gold text-neon-gold text-xs font-semibold">{r.dc}</span></td>
                      <td className="py-4 px-4 text-center font-display font-bold text-emerald-400">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Value Proposition Banner */}
        <Reveal>
          <div className="glass-gold rounded-2xl p-6 lg:p-8 border border-neon-gold/40 neon-border-gold">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <FloatingIcon>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shadow-2xl shadow-neon-gold/50 shrink-0">
                  <ShieldCheck className="w-10 h-10 text-cosmos" />
                </div>
              </FloatingIcon>
              <div className="flex-1">
                <div className="font-display text-xl lg:text-2xl font-bold text-ink mb-2">The Ultimate Value Proposition</div>
                <p className="text-lg text-ink/80 leading-relaxed font-serif italic gold-shimmer">
                  "Every Sunday, Beduine runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
                </p>
              </div>
              <a href="#plans"><ParticleButton variant="gold" className="px-8 py-4 rounded-full font-bold text-base shrink-0 inline-flex items-center gap-2"><Crown className="w-5 h-5" />Choose Your Plan<ChevronRight className="w-5 h-5" /></ParticleButton></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Non-Winner Guarantee Section ---------- */
function NonWinnerGuarantee() {
  const roiCards = [
    {
      plan: 'Silver', price: 499, dc: 1, dcValue: 500, roi: 100,
      color: 'from-slate-400 to-slate-600', glow: 'slate',
      image: '/images/sundarbans_mangrove_1779521789593.png',
      tours: ['Sundarbans Boat Safari', 'Bakkhali Beach', 'Mousuni Island', 'Mukutmanipur'],
      example: { 
        name: 'Riya Das', 
        avatar: '/images/winner_priya_sen.png',
        story: 'Riya subscribed to Silver for ₹499. She didn\'t win the draw, but used her 1 Discount Credit to get ₹500 off her Sundarbans trip. She saved ₹1 more than she paid!' 
      },
    },
    {
      plan: 'Gold', price: 799, dc: 2, dcValue: 1000, roi: 125,
      color: 'from-amber-400 to-yellow-600', glow: 'gold',
      image: '/images/darjeeling_tea_1779521805614.png',
      tours: ['Darjeeling', 'Dooars Safari', 'Puri + Konark', 'Vizag + Araku Valley'],
      example: { 
        name: 'Arjun Roy', 
        avatar: '/images/winner_arjun_roy.png',
        story: 'Arjun paid ₹799 for Gold. He didn\'t win, but used his 2 DCs on two separate tours — ₹500 off each. Total savings: ₹1,000 on a ₹799 investment!' 
      },
    },
    {
      plan: 'Platinum', price: 1499, dc: 4, dcValue: 2000, roi: 133,
      color: 'from-indigo-400 via-purple-500 to-fuchsia-500', glow: 'purple',
      image: '/images/kashmir_dal_lake_1779521728036.png',
      tours: ['Kashmir', 'Rajasthan Royal', 'Kerala Backwaters', 'Shimla-Manali'],
      example: { 
        name: 'Priya Sen', 
        avatar: '/images/winner_ananya_das.png',
        story: 'Priya invested ₹1,499 in Platinum. She didn\'t win, but received 4 DCs — ₹500 off on 4 different tours = ₹2,000 total savings. That\'s 133% return!' 
      },
    },
  ];

  const faqs = [
    { q: 'What if I never win the lucky draw?', a: 'You still receive your full Discount Credits (DC). Each DC gives you ₹500 off on any domestic tour. Your subscription cost is always recovered — guaranteed.' },
    { q: 'Can I use multiple DCs on one tour?', a: 'No — 1 DC per tour booking. But you can use them on separate tours throughout your 12-month subscription period.' },
    { q: 'Do Discount Credits expire?', a: 'DCs are valid for the entire 12-month subscription period. Use them anytime within that window.' },
    { q: 'What happens if I DO win?', a: 'Winners get a fully paid tour (₹3,000–₹10,000 value depending on plan) with pickup, drop, hotel, and meals included. You travel free!' },
  ];

  return (
    <section id="nonwinner" className="relative py-24 lg:py-32 bg-cosmos overflow-hidden">
      <StarField count={60} />
      <AuroraBackground variant="gold" />
      <FloatingOrbs count={5} variant="gold" />
      <MorphBlobs />
      <FlowingLines count={4} />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-neon-gold/15 blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Non-Winner Guarantee <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Didn't win?" />
              <br /><span className="gold-shimmer"><KineticText text="You still win." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber gets guaranteed value back through Discount Credits (DC). Each DC = ₹500 flat discount on any domestic tour. Your subscription cost is always fully recovered — and then some.</p>
          </div>
        </Reveal>

        {/* ₹499 = ₹500 Guarantee Badge */}
        <Reveal>
          <div className="glass-gold rounded-3xl p-8 lg:p-12 border border-neon-gold/40 mb-16 neon-border-gold text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-neon-gold/15 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative z-10">
              <FloatingIcon>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shadow-2xl shadow-neon-gold/50 mx-auto mb-6">
                  <Shield className="w-10 h-10 text-cosmos" />
                </div>
              </FloatingIcon>
              <div className="font-display text-4xl lg:text-6xl font-bold text-ink mb-4">
                ₹499 <span className="neon-gold">=</span> ₹500
              </div>
              <p className="text-lg text-ink/70 max-w-xl mx-auto leading-relaxed">Every ₹499 in your subscription maps directly to ₹500 of real tour discount value. <span className="text-neon-gold font-semibold">Zero loss. Guaranteed.</span></p>
              <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-semibold">100%+ Value Recovery on Every Plan</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3-Column ROI Cards */}
        <Reveal>
          <div className="text-center mb-8">
            <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2 font-mono">// Plan-wise Breakdown</div>
            <div className="font-display text-2xl lg:text-3xl font-bold text-ink">What non-winners <span className="gradient-neon">actually receive</span></div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {roiCards.map((card, i) => (
            <Reveal key={card.plan} delay={i * 0.1}>
              <TiltCard className="h-full" intensity={5}>
                <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all h-full tilt-inner flex flex-col group">
                  {/* Visual Header Image */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-abyss to-void">
                    <img src={card.image} alt={card.plan} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-display text-lg font-bold text-ink drop-shadow-sm">{card.plan}</div>
                        <div className="text-[10px] text-ink/60 font-mono">₹{card.price} / 12 months</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                    {/* Amount Paid → Value Received */}
                    <div className="rounded-xl p-4 glass-light border border-slate-line mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-center">
                          <div className="text-[9px] uppercase tracking-widest text-ink/40 mb-1">You Pay</div>
                          <div className="font-display text-lg font-bold text-ink">₹{card.price}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neon-gold" />
                        <div className="text-center">
                          <div className="text-[9px] uppercase tracking-widest text-ink/40 mb-1">You Get Back</div>
                          <div className="font-display text-lg font-bold text-emerald-400">₹{card.dcValue.toLocaleString()}</div>
                        </div>
                      </div>
                      {/* ROI Progress Bar */}
                      <div className="relative h-3 rounded-full bg-slate-300/40 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(card.roi, 150)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-neon-gold"
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[9px] text-ink/40 font-mono">0%</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{card.roi}% ROI</span>
                      </div>
                    </div>

                    {/* DC Breakdown */}
                    <div className="rounded-xl p-3 glass-gold border border-neon-gold/20 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-neon-gold" />
                        <span className="text-sm font-bold text-neon-gold">{card.dc} Discount Credit{card.dc > 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-xs text-ink/60 leading-relaxed">
                        = {card.dc} × ₹500 = <span className="text-emerald-400 font-bold">₹{card.dcValue.toLocaleString()} off</span> on {card.dc} domestic tour{card.dc > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Applicable Destinations */}
                    <div className="flex-1">
                      <div className="text-[9px] uppercase tracking-widest text-ink/40 mb-2 font-mono">Use DC on these tours</div>
                      <ul className="space-y-1.5">
                        {card.tours.map((t) => (
                          <li key={t} className="flex items-center gap-2 text-xs text-ink/70">
                            <GoldCheck size={13} /><span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Real-Life Scenario Cards */}
        <Reveal>
          <div className="text-center mb-8">
            <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2 font-mono">// Real Scenarios</div>
            <div className="font-display text-2xl lg:text-3xl font-bold text-ink">See how non-winners <span className="gold-shimmer">still benefit</span></div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {roiCards.map((card, i) => (
            <Reveal key={`scenario-${card.plan}`} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 border border-slate-line hover:neon-border-gold transition-all h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative">
                      <img src={card.example.avatar} alt={card.example.name} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md group-hover:scale-105 transition-transform" />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm text-white`}>
                        <HeartHandshake className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-ink text-sm">{card.example.name}</div>
                      <div className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">{card.plan} Subscriber</div>
                    </div>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed mb-4 italic font-serif">"{card.example.story}"</p>
                </div>
                <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">Net ROI: {card.roi}% — Paid ₹{card.price}, got ₹{card.dcValue.toLocaleString()} value</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FAQ Mini-Section */}
        <Reveal>
          <div className="glass rounded-3xl p-6 lg:p-8 border border-slate-line">
            <div className="text-center mb-8">
              <div className="text-[11px] uppercase tracking-widest neon-gold font-semibold mb-2 font-mono">// Frequently Asked Questions</div>
              <div className="font-display text-xl lg:text-2xl font-bold text-ink">Common questions about non-winner benefits</div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="glass-light rounded-2xl p-5 border border-slate-line hover:neon-border-cyan transition-all h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-cosmos text-xs font-bold">Q</span>
                      </div>
                      <div className="font-display font-bold text-ink text-sm leading-snug">{faq.q}</div>
                    </div>
                    <div className="pl-10 text-sm text-ink/65 leading-relaxed">{faq.a}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Value Proposition Callout */}
        <Reveal>
          <div className="mt-12 glass-gold rounded-2xl p-6 lg:p-8 border border-neon-gold/40 neon-border-gold">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <FloatingIcon>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 shrink-0">
                  <HeartHandshake className="w-8 h-8 text-cosmos" />
                </div>
              </FloatingIcon>
              <div className="flex-1">
                <div className="font-display text-lg lg:text-xl font-bold text-ink mb-1">The Beduine Promise</div>
                <p className="text-ink/80 leading-relaxed font-serif italic gold-shimmer text-lg">
                  "Every Sunday, Beduine runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
                </p>
              </div>
              <a href="#plans"><ParticleButton variant="gold" className="px-6 py-3 rounded-full font-bold text-sm shrink-0 inline-flex items-center gap-2"><Crown className="w-4 h-4" />Choose Plan<ChevronRight className="w-4 h-4" /></ParticleButton></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Destinations Showcase ---------- */
function Destinations() {
  return (
    <section id="destinations" className="relative py-24 lg:py-32 bg-void overflow-hidden">
      <StarField count={60} />
      <FloatingOrbs count={6} variant="mixed" />
      <AuroraBackground variant="gold" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Destinations <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Where we take" />
              <br /><span className="gold-shimmer"><KineticText text="you." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg">Hand-picked journeys across India — each one a cinematic experience, not just a trip.</p>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATIONS.map((d, i) => (
            <Reveal key={d.name} delay={(i % 4) * 0.08}>
              <TiltCard intensity={5}>
                <div className="group relative h-80 rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all tilt-inner">
                  <div className="absolute inset-0 slow-zoom">
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cosmos/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                    <div className="px-3 py-1.5 rounded-full glass-gold text-neon-gold text-[10px] font-bold uppercase tracking-widest">{d.duration}</div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full glass text-ink text-xs"><Star className="w-3 h-3 fill-gold text-gold" /> {d.rating}</div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                    <div className="text-[10px] uppercase tracking-widest neon-cyan font-semibold mb-1.5 font-mono">// Best: {d.season}</div>
                    <h3 className="font-display text-2xl font-bold text-ink">{d.name}</h3>
                    <p className="text-xs text-ink/70 mt-0.5">{d.tag}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-neon-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore itinerary <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Corner shine */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-neon-gold/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Winners Wall (Auto-scrolling carousel) ---------- */
function Winners() {
  const [seconds, setSeconds] = useState(5 * 24 * 3600 + 7 * 3600 + 23 * 60 + 45);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 7 * 24 * 3600)), 1000);
    return () => clearInterval(id);
  }, []);
  const t = { d: Math.floor(seconds / 86400), h: Math.floor((seconds % 86400) / 3600), m: Math.floor((seconds % 3600) / 60), s: seconds % 60 };

  return (
    <section className="relative py-24 lg:py-32 bg-cosmos overflow-hidden">
      <StarField count={70} />
      <FloatingOrbs count={5} variant="cyan" />
      <MorphBlobs />
      <WaveBackground color="mixed" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-soft-pulse" />Live Winners Wall</div>
              <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
                <KineticText text="Real people." />
                <br /><span className="gold-shimmer"><KineticText text="Real wins." delay={0.3} /></span>
              </h2>
            </div>
            <div className="glass-gold rounded-2xl p-5 flex items-center gap-5 breathe-glow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-gold to-gold-deep text-cosmos flex items-center justify-center"><Zap className="w-6 h-6" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-widest neon-gold font-semibold">Next Draw In</div>
                <div className="font-display text-2xl font-bold text-ink tabular flex gap-1 mt-1">
                  <span>{String(t.d).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">D</span></span>:
                  <span>{String(t.h).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">H</span></span>:
                  <span>{String(t.m).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">M</span></span>:
                  <span>{String(t.s).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">S</span></span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="relative overflow-hidden -mx-5 lg:-mx-8 px-5 lg:px-8">
          <div className="flex gap-5 marquee-track" style={{ width: 'max-content' }}>
            {[...WINNERS_DATA, ...WINNERS_DATA, ...WINNERS_DATA].map((w, i) => (
              <div key={i} className="w-96 glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all group">
                <div className="relative h-52 overflow-hidden">
                  <img src={w.destImg} alt={w.dest} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/40 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Award className="w-3 h-3" /> {w.plan} Winner</div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={w.img} alt={w.name} className="w-12 h-12 rounded-full border-2 border-neon-gold object-cover shadow-lg" loading="lazy" />
                    <div>
                      <div className="font-display font-bold text-ink">{w.name}</div>
                      <div className="text-xs text-ink/70">Won · {w.dest}</div>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink/50 font-mono">{w.week}</span>
                    <span className="neon-gold font-semibold flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Journey Section (Image collage) ---------- */
function Journey() {
  return (
    <section className="relative py-24 lg:py-32 bg-void overflow-hidden">
      <StarField count={40} />
      <FloatingOrbs count={4} variant="gold" />
      <FlowingLines count={6} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Our Journey <div className="w-8 h-px bg-cyan" /></div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight">
                <KineticText text="Crafting memories," />
                <br /><span className="gradient-neon"><KineticText text="one journey at a time." delay={0.3} /></span>
              </h2>
              <p className="mt-6 text-ink/70 text-lg leading-relaxed">From the misty peaks of Kashmir to the sun-drenched beaches of Goa — every trip we craft becomes a chapter in your life's most beautiful story.</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[{ n: '10K+', l: 'Happy Travelers' }, { n: '50+', l: 'Destinations' }, { n: '100%', l: 'Verified' }].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-4 border border-slate-line">
                    <div className="font-display text-2xl lg:text-3xl font-bold neon-gold tabular">{s.n}</div>
                    <div className="text-[10px] uppercase tracking-widest text-ink/60 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Image collage with parallax */}
          <Reveal delay={0.2}>
            <div className="relative h-[500px] lg:h-[600px]">
              {/* Decorative rotating ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rotate-slow opacity-30 hidden lg:block">
                <div className="absolute inset-0 rounded-full border border-gold/30" />
                <div className="absolute inset-10 rounded-full border border-cyan/20" />
                <div className="absolute inset-20 rounded-full border border-gold/20" />
              </div>

              {/* Image 1 - large */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute top-0 left-0 w-3/5 h-3/5 rounded-3xl overflow-hidden border border-slate-line neon-border-cyan shadow-2xl parallax-drift">
                <img src={JOURNEY_IMAGES[0].src} alt={JOURNEY_IMAGES[0].label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full glass text-ink text-[10px] uppercase tracking-widest">{JOURNEY_IMAGES[0].label}</div>
              </motion.div>

              {/* Image 2 */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute top-[35%] right-0 w-1/2 h-2/5 rounded-3xl overflow-hidden border border-slate-line neon-border-gold shadow-2xl parallax-drift" style={{ animationDelay: '3s' }}>
                <img src={JOURNEY_IMAGES[1].src} alt={JOURNEY_IMAGES[1].label} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full glass text-ink text-[10px] uppercase tracking-widest">{JOURNEY_IMAGES[1].label}</div>
              </motion.div>

              {/* Image 3 - small floating */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }} className="absolute bottom-0 left-[20%] w-2/5 h-1/3 rounded-3xl overflow-hidden border border-slate-line shadow-2xl animate-float-gentle">
                <img src={JOURNEY_IMAGES[2].src} alt={JOURNEY_IMAGES[2].label} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>

              {/* Floating badge */}
              <motion.div initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="absolute top-[25%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shadow-2xl shadow-neon-gold/40 animate-float-gentle" style={{ animationDelay: '1s' }}>
                <div className="text-center text-cosmos">
                  <div className="font-display font-bold text-lg">5★</div>
                  <div className="text-[9px] uppercase tracking-widest font-semibold">Trusted</div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA Banner ---------- */
function CTABanner() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-cosmos relative overflow-hidden">
      <StarField count={60} />
      <AuroraBackground variant="gold" />
      <FloatingOrbs count={5} variant="gold" />
      <MorphBlobs />
      <WaveBackground color="gold" />
      <FlowingLines count={4} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neon-gold/10 blur-[120px]" />
      <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center z-10">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-neon-gold text-[11px] uppercase tracking-widest font-semibold mb-6"><Zap className="w-3.5 h-3.5" /> Lock Your Entry</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
            <KineticText text="Your next story begins" />
            <br /><span className="gold-shimmer"><KineticText text="with a single subscription." delay={0.4} /></span>
          </h2>
          <p className="mt-6 text-lg text-ink/70 max-w-2xl mx-auto">Join thousands of travelers who trust Beduine for AI-curated journeys, transparent draws, and guaranteed value.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="#plans"><ParticleButton variant="gold" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base"><Crown className="w-5 h-5" /> Lock Your Entry <ChevronRight className="w-5 h-5" /></ParticleButton></a>
            <a href="tel:+918768903565" data-magnetic><ParticleButton variant="cyan" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold"><Phone className="w-4 h-4" /> +91 87689 03565</ParticleButton></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const company = ['About Beduine', 'Our Story', 'Leadership', 'Careers', 'Press & Media'];
  const trust = ['Operational Integrity', 'Digital Audit Archive', 'Lucky Draw Rules', 'Regulatory Compliance', 'RNG Certification'];
  const support = ['Help Center', 'Refund Policy', 'Terms of Service', 'Privacy Policy', 'Grievance Officer'];
  return (
    <footer className="bg-cosmos border-t border-slate-line pt-16 pb-10 relative">
      <StarField count={30} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 pb-12 border-b border-slate-line">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos">
                <img src="/images/office_logo.png" alt="Beduine Logo" className="w-full h-full object-cover scale-105" />
              </div>
              <div><div className="font-display text-xl font-bold text-ink">BEDUINE</div><div className="text-[10px] uppercase tracking-[0.22em] neon-cyan">Tour & Travels</div></div>
            </div>
            <p className="font-serif italic text-neon-gold text-lg mb-3">Safar jo yaad rahe.</p>
            <p className="text-sm text-ink/60 leading-relaxed max-w-sm mb-6">India's subscription-first travel company — built on transparency, guaranteed value, and journeys that live forever.</p>
            <div className="flex items-start gap-3 p-4 glass-light rounded-xl border border-slate-line">
              <MapPin className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
              <div className="text-sm text-ink/75 leading-relaxed"><div className="font-semibold text-ink">Registered Office</div>Fulia, Nadia,<br />West Bengal, India<br />Pin — 741402</div>
            </div>
          </div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest">Company</div><ul className="space-y-2.5">{company.map((l) => <li key={l}><a href="#" data-magnetic className="text-sm text-ink/60 hover:neon-cyan transition-all">{l}</a></li>)}</ul></div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest">Trust</div><ul className="space-y-2.5">{trust.map((l) => <li key={l}><a href="#" data-magnetic className="text-sm text-ink/60 hover:neon-cyan transition-all">{l}</a></li>)}</ul></div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest">Support</div><ul className="space-y-2.5">{support.map((l) => <li key={l}><a href="#" data-magnetic className="text-sm text-ink/60 hover:neon-cyan transition-all">{l}</a></li>)}</ul></div>
          <div className="lg:col-span-2">
            <div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-neon-gold" /> Audit Archive</div>
            <ul className="space-y-2.5">
              {AUDIT_REPORTS.map((a) => <li key={a.week}><a href="#" data-magnetic className="group flex items-center gap-2 text-sm text-ink/60 hover:neon-gold transition-all"><Download className="w-3 h-3 opacity-50 group-hover:opacity-100" /><span className="text-xs font-mono">{a.week}</span></a></li>)}
              <li className="pt-2"><a href="#audit" className="text-xs font-semibold neon-cyan inline-flex items-center gap-1 font-mono">&gt; full_archive() <ArrowRight className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink/50 uppercase tracking-widest">Connect</span>
            <div className="flex gap-2">{[Video, Camera, Send, Tv, Share2].map((Icon, i) => <a key={i} href="#" data-magnetic className="w-9 h-9 rounded-lg glass-light flex items-center justify-center hover:neon-border-cyan transition-all border border-slate-line"><Icon className="w-4 h-4" /></a>)}</div>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink/45">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-neon-gold" /> RNG Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-cyan" /> E2E Encrypted</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-neon-gold" /> Audited</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-line text-center text-xs text-ink/40 font-mono">© 2026 Beduine Tour & Travels. · <a href="#" className="hover:neon-cyan">terms</a> · <a href="#" className="hover:neon-cyan">privacy</a> · <a href="#" className="hover:neon-cyan">refunds</a></div>
      </div>
    </footer>
  );
}

function FloatingButtons() {
  return (
    <div className="hidden lg:flex fixed right-6 bottom-6 flex-col gap-3 z-40">
      <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" data-magnetic className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform" title="WhatsApp" style={{ width: 52, height: 52 }}><MessageCircle className="w-5 h-5" /></a>
      <a href="tel:+918768903565" data-magnetic className="w-13 h-13 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep text-cosmos flex items-center justify-center shadow-xl shadow-neon-gold/40 hover:scale-110 transition-transform" title="Call" style={{ width: 52, height: 52 }}><Phone className="w-5 h-5" /></a>
    </div>
  );
}

function MobileSticky() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-4">
      <div className="glass rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/60 border border-slate-line">
        <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <a href="tel:+918768903565" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl glass-light border border-slate-line text-ink text-xs font-bold"><Phone className="w-4 h-4" /> Call</a>
        <a href="#plans" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-neon-gold to-gold text-cosmos text-xs font-bold"><Crown className="w-4 h-4" /> Join</a>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const handleSelectPlan = useCallback((planName: string) => {
    const text = `Hello Beduine, I want to subscribe to the ${planName} plan. Please guide me on the payment process.`;
    const whatsappUrl = `https://wa.me/918768903565?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  return (
    <div className="min-h-screen bg-cosmos text-ink relative">
      <AnimatePresence>{!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}</AnimatePresence>
      <ScrollProgress />
      <CustomCursor />
      <div className="noise fixed inset-0 pointer-events-none z-30" />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <AboutUs />
        <Journey />
        <HowItWorks />
        <Plans onSelectPlan={handleSelectPlan} />
        <InternationalPlans onSelectPlan={handleSelectPlan} />
        <LuckyDrawSystem />
        <CreditArchitecture />
        <NonWinnerGuarantee />
        <Destinations />
        <Winners />
        <Services />
        <Transparency />
        <CTABanner />
      </main>
      <Footer />
      <FloatingButtons />
      <MobileSticky />
    </div>
  );
}
