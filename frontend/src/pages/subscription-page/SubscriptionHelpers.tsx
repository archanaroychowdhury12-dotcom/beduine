import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useInView, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';

/* ---------- Reveal Animation Helper ---------- */
export function Reveal({ children, delay = 0, y = 80 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale: 0.94, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Scroll Rounded Section Helper ---------- */
export function ScrollRoundedSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [radiusValue, setRadiusValue] = useState("90px");

  useEffect(() => {
    const handleResize = () => {
      setRadiusValue(window.innerWidth < 768 ? "32px" : "90px");
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const borderTopLeftRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], [radiusValue, "0px", "0px", "0px"]);
  const borderTopRightRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], [radiusValue, "0px", "0px", "0px"]);
  const borderBottomLeftRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], ["0px", "0px", "0px", radiusValue]);
  const borderBottomRightRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], ["0px", "0px", "0px", radiusValue]);

  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], [0.95, 1.0, 1.0, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1.0], [0.65, 1.0, 1.0, 0.65]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        scale,
        opacity,
        overflow: 'hidden',
        transformOrigin: 'center center'
      }}
      className="relative z-10 w-full"
    >
      {children}
    </motion.div>
  );
}

/* ---------- Route Fallback Helper ---------- */
export function RouteFallback() {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-5 text-center">
      <div className="glass rounded-2xl border border-slate-line px-6 py-5 text-sm font-bold text-ink/70">
        Loading BEDUINE workspace...
      </div>
    </div>
  );
}

/* ---------- SubSection Badge ---------- */
export function SubSectionBadge({ text, theme = 'cyan' }: { text: string; theme?: 'cyan' | 'gold' }) {
  const dotColor = theme === 'cyan' ? 'bg-[#00F5D4]' : 'bg-[#FBBF24]';
  const textColor = theme === 'cyan' ? 'text-[#00F5D4]' : 'text-amber-400';
  const slashColor = theme === 'cyan' ? 'text-[#00F5D4]' : 'text-amber-400';

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 border border-white/10 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest ${textColor} backdrop-blur-md shadow-lg`}>
      <span className={`${dotColor} w-1.5 h-1.5 rounded-full animate-pulse`} />
      <span className={slashColor}>//</span> {text}
    </div>
  );
}

/* ---------- Gold Check Icon ---------- */
export function GoldCheck({ size = 18, variant = 'gold', className = '' }: { size?: number; variant?: 'gold' | 'cyan'; className?: string }) {
  const checkClass = variant === 'cyan' ? 'cyan-check' : 'gold-check';
  return (
    <span className={`inline-flex items-center justify-center rounded-full ${checkClass} shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Check className="text-cosmos" style={{ width: size * 0.6, height: size * 0.6 }} strokeWidth={3.5} />
    </span>
  );
}

/* ---------- Floating Icon Animation Wrapper ---------- */
export function FloatingIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div className="relative" initial={{ y: 0 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
      {children}
    </motion.div>
  );
}

/* ---------- Star Field Animation Helper ---------- */
export function StarField({ count = 80 }: { count?: number }) {
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

/* ---------- Kinetic Text Masking Helper ---------- */
export function KineticText({ text, className = '', delay = 0, mode = 'char' }: { text: string; className?: string; delay?: number; mode?: 'word' | 'char' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (mode === 'char') {
    let charIndex = 0;
    return (
      <span ref={ref} className={className}>
        {text.split(' ').map((word, wi) => (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {word.split('').map((char) => {
              const ci = charIndex++;
              return (
                <span key={ci} className="kinetic-char-mask">
                  <span
                    className="kinetic-char"
                    style={{
                      animationDelay: `${delay + ci * 0.03}s`,
                      animationPlayState: inView ? 'running' : 'paused',
                      opacity: inView ? undefined : 0,
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
            {wi < text.split(' ').length - 1 && <span style={{ display: 'inline-block', width: '0.25em' }} />}
          </span>
        ))}
      </span>
    );
  }

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

/* ---------- Particle Burst Button ---------- */
export function ParticleButton({ children, onClick, variant = 'gold', className = '', as: Component = 'button', ...rest }: any) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  const btnRef = useRef<HTMLElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
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
  const btnClass = variant === 'gold' ? 'glow-cta' : variant === 'teal' ? 'glow-cta-teal' : 'glow-cta-cyan';
  return (
    <Component ref={btnRef} data-magnetic onClick={handleClick} className={`relative overflow-visible ${btnClass} ${className}`} {...rest}>
      {children}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span key={p.id} className="particle-burst"
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{ x: p.x + Math.cos(p.angle) * (60 + Math.random() * 30), y: p.y + Math.sin(p.angle) * (60 + Math.random() * 30), opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        ))}
      </AnimatePresence>
    </Component>
  );
}

/* ---------- Tilt Card Helper ---------- */
export function TiltCard({ children, className = '', intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
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
  const onLeave = () => {
    setStyle({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)', transition: 'transform 0.5s ease' });
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={style} className={`transition-transform duration-200 ease-out ${className}`}>
      {children}
    </div>
  );
}
