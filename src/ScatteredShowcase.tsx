import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useInView } from 'framer-motion';
import { Star, ArrowRight, MessageCircle, X, Calendar, MapPin, Plane, Eye } from 'lucide-react';

/* ===================== Types ===================== */
interface Destination {
  name: string;
  tag: string;
  duration: string;
  rating: number;
  season: string;
  img: string;
  category: string;
  planBadge: string;
}

interface ScatteredShowcaseProps {
  destinations: Destination[];
  activeTab: string;
}

/* ===================== Scatter Positions ===================== */
// Base scattered positions — percentage of viewport
const SCATTER_POSITIONS = [
  { x: -26, y: -14, rZ: -7, rY: -10 },
  { x: 24, y: 10, rZ: 5, rY: 8 },
  { x: -18, y: 18, rZ: 6, rY: -7 },
  { x: 28, y: -18, rZ: -4, rY: 10 },
  { x: -30, y: 5, rZ: 7, rY: -12 },
  { x: 20, y: -22, rZ: -6, rY: 6 },
  { x: -12, y: 22, rZ: 4, rY: -8 },
  { x: 26, y: 14, rZ: -3, rY: 11 },
  { x: -22, y: -8, rZ: 8, rY: -6 },
  { x: 15, y: 20, rZ: -5, rY: 9 },
  { x: -28, y: -20, rZ: 3, rY: -10 },
  { x: 24, y: -10, rZ: -7, rY: 7 },
];

// Retired positions (after card was active)
const RETIRED_POSITIONS = [
  { x: -38, y: -6, rZ: -11 },
  { x: 36, y: 10, rZ: 9 },
  { x: -28, y: 14, rZ: 7 },
  { x: 33, y: -8, rZ: -8 },
  { x: -34, y: 3, rZ: 10 },
  { x: 30, y: -16, rZ: -6 },
  { x: -16, y: 18, rZ: 5 },
  { x: 32, y: 6, rZ: -9 },
  { x: -32, y: -12, rZ: 8 },
  { x: 28, y: 16, rZ: -5 },
  { x: -26, y: -18, rZ: 4 },
  { x: 34, y: -4, rZ: -7 },
];

// Category accent colors
const CATEGORY_ACCENTS: Record<string, { glow: string; border: string; text: string; spotlight: string }> = {
  escapes: { glow: 'rgba(0, 217, 255, 0.3)', border: 'rgba(0, 217, 255, 0.35)', text: '#00D9FF', spotlight: 'rgba(0, 217, 255, 0.1)' },
  trails: { glow: 'rgba(52, 211, 153, 0.3)', border: 'rgba(52, 211, 153, 0.35)', text: '#34D399', spotlight: 'rgba(52, 211, 153, 0.1)' },
  royal: { glow: 'rgba(251, 191, 36, 0.3)', border: 'rgba(251, 191, 36, 0.35)', text: '#FBBF24', spotlight: 'rgba(251, 191, 36, 0.1)' },
  intl: { glow: 'rgba(167, 139, 250, 0.3)', border: 'rgba(167, 139, 250, 0.35)', text: '#A78BFA', spotlight: 'rgba(167, 139, 250, 0.1)' },
};

/* ===================== Particles ===================== */
function ParticleField({ count = 30 }: { count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 6,
      dur: 4 + Math.random() * 5,
      cyan: i % 3 === 0,
    })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.cyan ? 'rgba(0,217,255,0.6)' : 'rgba(13,148,136,0.35)',
            boxShadow: p.cyan ? '0 0 8px rgba(0,217,255,0.4)' : 'none',
          }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ===================== Progress Dots ===================== */
function ProgressDots({ total, active, names, onJump }: {
  total: number; active: number; names: string[]; onJump: (i: number) => void;
}) {
  return (
    <div className="absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <button key={i} onClick={() => onJump(i)} className="group flex items-center gap-2 cursor-pointer" aria-label={names[i]}>
          <span className={`text-[9px] font-mono font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
            i === active ? 'opacity-100 text-cyan-400' : 'opacity-0 group-hover:opacity-60 text-slate-400 translate-x-2 group-hover:translate-x-0'
          }`}>{names[i]}</span>
          <motion.div
            className="rounded-full shrink-0"
            animate={{
              width: i === active ? 14 : 5,
              height: i === active ? 14 : 5,
              background: i === active ? '#00D9FF' : i < active ? 'rgba(0,217,255,0.25)' : 'rgba(255,255,255,0.18)',
              boxShadow: i === active ? '0 0 14px rgba(0,217,255,0.6)' : 'none',
            }}
            transition={{ duration: 0.3 }}
          />
        </button>
      ))}
    </div>
  );
}

/* ===================== Detail Modal ===================== */
function DetailModal({ d, accent, onClose }: { d: Destination; accent: typeof CATEGORY_ACCENTS.escapes; onClose: () => void }) {
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  const wa = encodeURIComponent(`Hi Bedune! I'm interested in the ${d.name} package (${d.duration}). Please share details!`);
  const feats = d.tag.split('·').map(f => f.trim());

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        style={{ background: 'linear-gradient(180deg,rgba(8,14,24,0.95),rgba(3,7,18,0.98))', boxShadow: `0 0 80px ${accent.spotlight},0 40px 100px rgba(0,0,0,0.6)` }}
        initial={{ scale: 0.85, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <div className="relative h-64 lg:h-80 overflow-hidden rounded-t-3xl">
          <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
          <div className="absolute top-5 left-5 flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10">{d.duration}</span>
            <span className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-wider border" style={{ color: accent.text, borderColor: accent.border }}>{d.planBadge}</span>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="font-display text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-lg">{d.name}</h2>
          </div>
        </div>
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-amber-400 text-sm font-bold">{d.rating}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300 text-xs font-mono font-semibold">Best: {d.season}</span>
            </div>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-mono font-bold mb-3">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {feats.map(f => <span key={f} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/8 text-slate-200">{f}</span>)}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all" style={{ background: `linear-gradient(135deg,${accent.text},${accent.text}cc)`, color: '#030712', boxShadow: `0 0 30px ${accent.glow}` }}>
              <Eye className="w-4 h-4" /> View Package
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all cursor-pointer">
              <Plane className="w-4 h-4" /> Plan This Trip
            </button>
            <a href={`https://wa.me/918768903565?text=${wa}`} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500/90 text-white font-bold text-sm hover:bg-emerald-500 transition-all cursor-pointer">
              <MessageCircle className="w-4 h-4" /> Book on WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ===================== Single Scattered Card ===================== */
function ScatteredCard({
  d, index, total, isActive, isPast, accent, onSelect,
}: {
  d: Destination; index: number; total: number;
  isActive: boolean; isPast: boolean;
  accent: typeof CATEGORY_ACCENTS.escapes;
  onSelect: () => void;
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 720);

  useEffect(() => {
    const r = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  const sc = SCATTER_POSITIONS[index % SCATTER_POSITIONS.length];
  const rt = RETIRED_POSITIONS[index % RETIRED_POSITIONS.length];

  // Base positions in pixels
  const scX = (sc.x / 100) * vw;
  const scY = (sc.y / 100) * vh;
  const rtX = (rt.x / 100) * vw;
  const rtY = (rt.y / 100) * vh;

  // Floating orbit parameters — unique per card
  const floatAmpX = 14 + (index % 4) * 4;
  const floatAmpY = 10 + (index % 3) * 4;
  const floatAmpR = 1.5 + (index % 3) * 0.8;
  const floatDurX = 7 + (index % 5) * 1.1;
  const floatDurY = 8 + (index % 4) * 1.2;
  const floatDurR = 9 + (index % 3) * 1.4;

  // Floating keyframes for scattered cards
  const floatScatterX = [scX, scX + floatAmpX, scX - floatAmpX * 0.7, scX + floatAmpX * 0.5, scX];
  const floatScatterY = [scY, scY - floatAmpY, scY + floatAmpY * 0.8, scY - floatAmpY * 0.4, scY];
  const floatScatterR = [sc.rZ, sc.rZ + floatAmpR, sc.rZ - floatAmpR, sc.rZ + floatAmpR * 0.6, sc.rZ];

  // Floating keyframes for retired cards (smaller amplitude)
  const floatRetiredX = [rtX, rtX + floatAmpX * 0.5, rtX - floatAmpX * 0.4, rtX + floatAmpX * 0.3, rtX];
  const floatRetiredY = [rtY, rtY - floatAmpY * 0.5, rtY + floatAmpY * 0.4, rtY - floatAmpY * 0.3, rtY];
  const floatRetiredR = [rt.rZ, rt.rZ + floatAmpR * 0.5, rt.rZ - floatAmpR * 0.5, rt.rZ + floatAmpR * 0.3, rt.rZ];

  const feats = d.tag.split('·').map(f => f.trim());

  const zIdx = isActive ? 50 : isPast ? (10 + index) : (25 + (total - index));

  // Hover tilt
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.width / 2, cy = rect.height / 2;
    setTilt({
      x: -((e.clientY - rect.top - cy) / cy) * (isActive ? 8 : 4),
      y: ((e.clientX - rect.left - cx) / cx) * (isActive ? 8 : 4),
    });
  }, [isActive]);

  // Build animation + transition based on state
  const getAnimateAndTransition = () => {
    if (isActive) {
      return {
        animate: {
          x: hovered ? tilt.y * 0.5 : 0,
          y: hovered ? (tilt.x * 0.5 - 10) : 0,
          rotateZ: 0,
          rotateY: hovered ? tilt.y : 0,
          rotateX: hovered ? tilt.x : 0,
          scale: hovered ? 1.18 : 1.12,
          opacity: 1,
        },
        transition: {
          type: 'spring' as const,
          stiffness: 70,
          damping: 16,
          mass: 0.8,
        },
      };
    }

    if (isPast) {
      return {
        animate: {
          x: floatRetiredX,
          y: floatRetiredY,
          rotateZ: floatRetiredR,
          rotateY: 0,
          rotateX: 0,
          scale: 0.72,
          opacity: 0.3,
        },
        transition: {
          x: { duration: floatDurX * 1.3, repeat: Infinity, ease: 'easeInOut' as const },
          y: { duration: floatDurY * 1.3, repeat: Infinity, ease: 'easeInOut' as const },
          rotateZ: { duration: floatDurR * 1.3, repeat: Infinity, ease: 'easeInOut' as const },
          scale: { type: 'spring' as const, stiffness: 50, damping: 18 },
          opacity: { duration: 0.6 },
        },
      };
    }

    // Future / scattered — continuous float
    return {
      animate: {
        x: floatScatterX,
        y: floatScatterY,
        rotateZ: floatScatterR,
        rotateY: sc.rY,
        rotateX: 0,
        scale: 0.88,
        opacity: 0.55,
      },
      transition: {
        x: { duration: floatDurX, repeat: Infinity, ease: 'easeInOut' as const },
        y: { duration: floatDurY, repeat: Infinity, ease: 'easeInOut' as const },
        rotateZ: { duration: floatDurR, repeat: Infinity, ease: 'easeInOut' as const },
        rotateY: { type: 'spring' as const, stiffness: 50, damping: 18 },
        scale: { type: 'spring' as const, stiffness: 50, damping: 18 },
        opacity: { duration: 0.6 },
      },
    };
  };

  const { animate, transition } = getAnimateAndTransition();

  return (
    <motion.div
      ref={ref}
      className="absolute scattered-card-wrapper"
      style={{
        width: 'clamp(270px, 22vw, 350px)',
        height: 'clamp(370px, 30vw, 450px)',
        transformStyle: 'preserve-3d',
        zIndex: zIdx,
        cursor: 'pointer',
        willChange: 'transform, opacity',
      }}
      animate={animate}
      transition={transition}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      onClick={onSelect}
    >
      <div
        className="w-full h-full rounded-3xl overflow-hidden relative group"
        style={{
          background: 'rgba(8, 14, 24, 0.6)',
          border: `1px solid ${isActive ? accent.border : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isActive
            ? `0 0 60px ${accent.glow}, 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`
            : '0 12px 40px rgba(0,0,0,0.35)',
          filter: isActive ? 'blur(0px) brightness(1.1)' : isPast ? 'blur(3px) brightness(0.55)' : 'blur(1.5px) brightness(0.75)',
          transition: 'filter 0.7s ease, border-color 0.5s ease, box-shadow 0.6s ease',
        }}
      >
        {/* Image */}
        <div className="absolute inset-0">
          <img src={d.img} alt={d.name} className="w-full h-full object-cover transition-transform duration-700"
            style={{ transform: hovered && isActive ? 'scale(1.1)' : 'scale(1.02)' }} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent" />
          <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: isActive ? 0 : 0.4, background: '#030712' }} />
        </div>

        {/* Mouse spotlight (active only) */}
        {isActive && hovered && (
          <div className="absolute inset-0 pointer-events-none z-10" style={{
            background: `radial-gradient(400px circle at ${50 + tilt.y * 4}% ${50 + tilt.x * 4}%, ${accent.spotlight}, transparent 70%)`,
          }} />
        )}

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between z-10 pointer-events-none select-none">
          <div className="flex gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[9px] font-mono font-extrabold uppercase tracking-wider border border-white/10 shadow-lg">{d.duration}</span>
            <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[9px] font-mono font-extrabold uppercase tracking-wider shadow-lg border"
              style={{ color: accent.text, borderColor: accent.border }}>{d.planBadge}</span>
          </div>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-black border border-white/10 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {d.rating}
          </span>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5 z-10">
          <div className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold mb-1.5 flex items-center gap-1.5"
            style={{ color: accent.text, opacity: 0.85 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            // Season: {d.season}
          </div>
          <h3 className="font-display text-2xl font-black text-white leading-snug drop-shadow-md">{d.name}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {feats.map(f => (
              <span key={f} className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight bg-black/50 border border-white/5 text-slate-300">{f}</span>
            ))}
          </div>

          {/* CTA buttons — active only */}
          <AnimatePresence>
            {isActive && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, delay: 0.2 }} className="flex items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg cursor-pointer transition-transform hover:scale-105"
                  style={{ background: `linear-gradient(135deg,${accent.text},${accent.text}bb)`, color: '#030712', boxShadow: `0 0 20px ${accent.glow}` }}>
                  <Eye className="w-3 h-3" /> View Package
                </span>
                <a href={`https://wa.me/918768903565?text=${encodeURIComponent(`Hi Bedune! I'm interested in the ${d.name} package (${d.duration}). Please share details!`)}`}
                  target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/85 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg cursor-pointer transition-transform hover:scale-105">
                  <MessageCircle className="w-3 h-3" /> WhatsApp
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Glow ring — active only */}
        {isActive && (
          <motion.div className="absolute inset-0 rounded-3xl pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ boxShadow: `inset 0 0 0 1.5px ${accent.border}, 0 0 70px ${accent.glow}` }} />
        )}
      </div>
    </motion.div>
  );
}

/* ===================== Mobile Showcase ===================== */
function MobileShowcase({ destinations, accent, onSelect }: {
  destinations: Destination[]; accent: typeof CATEGORY_ACCENTS.escapes; onSelect: (d: Destination) => void;
}) {
  return (
    <div className="flex flex-col gap-5 py-4 px-2">
      {destinations.map((d, i) => {
        const feats = d.tag.split('·').map(f => f.trim());
        return (
          <MobileCardItem key={d.name} d={d} i={i} feats={feats} accent={accent} onSelect={() => onSelect(d)} />
        );
      })}
    </div>
  );
}

function MobileCardItem({ d, i, feats, accent, onSelect }: {
  d: Destination; i: number; feats: string[]; accent: typeof CATEGORY_ACCENTS.escapes; onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden cursor-pointer"
      style={{ border: `1px solid ${accent.border}`, boxShadow: `0 16px 50px rgba(0,0,0,0.35)` }}
      onClick={onSelect}>
      <div className="relative h-52 overflow-hidden">
        <img src={d.img} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/40 to-transparent" />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <div className="flex gap-1.5">
            <span className="px-2 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[8px] font-mono font-bold uppercase tracking-wider border border-white/10">{d.duration}</span>
            <span className="px-2 py-1 rounded-full bg-black/65 backdrop-blur-md text-[8px] font-mono font-bold uppercase tracking-wider border"
              style={{ color: accent.text, borderColor: accent.border }}>{d.planBadge}</span>
          </div>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-black border border-white/10">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {d.rating}
          </span>
        </div>
      </div>
      <div className="p-4 bg-[#0a0f1a]">
        <div className="text-[8px] uppercase tracking-[0.2em] font-mono font-bold mb-1 flex items-center gap-1.5" style={{ color: accent.text, opacity: 0.8 }}>
          <span className="w-1 h-1 rounded-full bg-current animate-pulse" /> Season: {d.season}
        </div>
        <h3 className="font-display text-xl font-black text-white">{d.name}</h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {feats.map(f => <span key={f} className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-white/5 border border-white/5 text-slate-400">{f}</span>)}
        </div>
        <div className="flex gap-2 mt-3">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider cursor-pointer"
            style={{ background: `linear-gradient(135deg,${accent.text},${accent.text}bb)`, color: '#030712' }}>
            <Eye className="w-3 h-3" /> View
          </span>
          <a href={`https://wa.me/918768903565?text=${encodeURIComponent(`Hi Bedune! Interested in ${d.name} (${d.duration}).`)}`}
            target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/85 text-white text-[9px] font-bold uppercase tracking-wider cursor-pointer">
            <MessageCircle className="w-3 h-3" /> WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ===================== MAIN COMPONENT ===================== */
export default function ScatteredShowcase({ destinations, activeTab }: ScatteredShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Destination | null>(null);

  const accent = CATEGORY_ACCENTS[activeTab] || CATEGORY_ACCENTS.escapes;

  useEffect(() => {
    const c = () => setIsMobile(window.innerWidth < 768);
    c(); window.addEventListener('resize', c);
    return () => window.removeEventListener('resize', c);
  }, []);

  // Reset on tab change
  useEffect(() => { setActiveIndex(0); }, [activeTab, destinations.length]);

  // Scroll tracking — maps container scroll progress to active card index
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const n = destinations.length;
    if (n <= 0) return;
    const idx = Math.min(n - 1, Math.floor(v * (n + 0.6)));
    setActiveIndex(Math.max(0, idx));
  });

  // Scroll track height — enough for each card to have a scroll "moment"
  const trackHeight = useMemo(() => {
    const h = destinations.length * 80 + 120;
    return Math.max(380, Math.min(900, h));
  }, [destinations.length]);

  // Jump to a specific card via progress dots
  const jumpToCard = useCallback((targetIdx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetScroll = window.scrollY + rect.top + (targetIdx / (destinations.length + 0.6)) * scrollableHeight;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [destinations.length]);

  if (isMobile) {
    return (
      <>
        <MobileShowcase destinations={destinations} accent={accent} onSelect={setSelectedCard} />
        <AnimatePresence>{selectedCard && <DetailModal d={selectedCard} accent={accent} onClose={() => setSelectedCard(null)} />}</AnimatePresence>
      </>
    );
  }

  return (
    <>
      {/* Tall scroll track — this creates the scroll range */}
      <div ref={containerRef} key={activeTab} className="relative" style={{ height: `${trackHeight}vh` }}>

        {/* Sticky viewport — pins to screen while user scrolls */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">

          {/* Section heading pinned inside viewport */}
          <div className="relative z-30 flex flex-col items-center justify-center pt-20 pb-4 pointer-events-none select-none">
            <motion.h2 key={`h-${activeTab}`}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="font-display text-3xl lg:text-5xl font-black text-white text-center leading-tight drop-shadow-lg">
              Explore Cinematic{' '}
              <span className="bg-clip-text text-transparent" style={{
                backgroundImage: `linear-gradient(135deg,${accent.text},#fff,${accent.text})`,
                backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite',
              }}>
                {{ escapes: 'Weekend Escapes', trails: 'Hill & Tea Trails', royal: 'Royal India Tours', intl: 'International Trips' }[activeTab] || 'Escapes'}
              </span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 0.15 }}
              className="text-slate-400 text-sm lg:text-base mt-2.5 text-center max-w-xl">
              Scroll through handpicked destinations crafted for unforgettable journeys.
            </motion.p>
          </div>

          {/* 3D Stage */}
          <div className="flex-1 relative">
            <ParticleField count={28} />

            {/* Spotlight glow behind active card */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
              animate={{ opacity: 0.9 }} transition={{ duration: 0.8 }}
              style={{ width: 650, height: 650, borderRadius: '50%', background: `radial-gradient(circle,${accent.spotlight},transparent 60%)`, filter: 'blur(60px)' }} />

            {/* Perspective container */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              <AnimatePresence mode="popLayout">
                {destinations.map((d, i) => (
                  <ScatteredCard key={d.name} d={d} index={i} total={destinations.length}
                    isActive={i === activeIndex} isPast={i < activeIndex} accent={accent}
                    onSelect={() => setSelectedCard(d)} />
                ))}
              </AnimatePresence>
            </div>

            {/* Progress dots */}
            <ProgressDots total={destinations.length} active={activeIndex}
              names={destinations.map(d => d.name)} onJump={jumpToCard} />

            {/* Counter badge */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none">
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                <span className="text-white/90 font-mono text-xs font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
                <div className="w-16 h-0.5 rounded-full bg-white/10 relative overflow-hidden">
                  <motion.div className="absolute inset-y-0 left-0 rounded-full"
                    animate={{ width: `${((activeIndex + 1) / destinations.length) * 100}%` }}
                    style={{ background: accent.text }} transition={{ duration: 0.4 }} />
                </div>
                <span className="text-white/40 font-mono text-xs font-bold">{String(destinations.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>{selectedCard && <DetailModal d={selectedCard} accent={accent} onClose={() => setSelectedCard(null)} />}</AnimatePresence>
    </>
  );
}
