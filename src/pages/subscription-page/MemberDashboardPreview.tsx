import { useState, useEffect } from 'react';
import { Award, Zap, BadgeCheck } from 'lucide-react';
import { Reveal, KineticText } from './SubscriptionHelpers';
import ScatteredShowcase from '../../ScatteredShowcase';
import { DESTINATIONS, WINNERS_DATA } from '../../data/siteData';

export function Destinations() {
  return (
    <section id="destinations" className="relative py-14 lg:py-20 bg-cosmos">
      {/* Cosmic background glows (isolated overflow container) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-950/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-gold/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4">
              <div className="w-8 h-px bg-neon-gold" /> Destinations <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Explore Cinematic" />
              <br />
              <span className="gold-shimmer">
                <KineticText text="Travel Journeys" delay={0.3} />
              </span>
            </h2>
            <p className="mt-6 text-slate-300/80 text-lg leading-relaxed">
              Scroll through handpicked destinations crafted for unforgettable journeys.
            </p>
          </div>
        </Reveal>

        {/* Total Destinations Count */}
        <Reveal>
          <div className="flex justify-center mb-12 pb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/60 border border-slate-800/85 text-xs font-bold text-slate-400 select-none shadow-xl backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="font-mono uppercase tracking-wider">{DESTINATIONS.length} Cinematic Destinations</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 3D Scattered Scroll Showcase */}
      <ScatteredShowcase destinations={DESTINATIONS} />
    </section>
  );
}

export function Winners() {
  const [seconds, setSeconds] = useState(5 * 24 * 3600 + 7 * 3600 + 23 * 60 + 45);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 7 * 24 * 3600)), 1000);
    return () => clearInterval(id);
  }, []);
  const t = { d: Math.floor(seconds / 86400), h: Math.floor((seconds % 86400) / 3600), m: Math.floor((seconds % 3600) / 60), s: seconds % 60 };

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Award className="w-3 h-3" /> {w.plan} Winner</div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={w.img} alt={w.name} className="w-12 h-12 rounded-full border-2 border-neon-gold object-cover shadow-lg" loading="lazy" />
                    <div>
                      <div className="font-display font-bold text-ink">{w.name}</div>
                      <div className="text-xs text-ink/70">Won - {w.dest}</div>
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
