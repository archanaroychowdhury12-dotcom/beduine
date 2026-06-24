import { useState, useEffect } from 'react';
import { Award, Zap, BadgeCheck, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal, KineticText } from './SubscriptionHelpers';
import ScatteredShowcase from '../../ScatteredShowcase';
import { DESTINATIONS, WINNERS_DATA } from '../../data/siteData';

/* ---------- Interactive Route Map ---------- */
interface MapHotspot {
  name: string;
  x: number;
  y: number;
  location: string;
  price: string;
  category: 'escapes' | 'trails' | 'royal' | 'intl';
  img: string;
}

const MAP_HOTSPOTS: MapHotspot[] = [
  { name: 'Kashmir', x: 350, y: 75, location: 'Kashmir', price: '₹32,999', category: 'trails', img: '/images/kashmir_dal_lake_1779521728036.png' },
  { name: 'Rajasthan Royal', x: 290, y: 190, location: 'Rajasthan', price: '₹21,999', category: 'royal', img: '/images/rajasthan_palace_1779521744228.png' },
  { name: 'Goa', x: 310, y: 350, location: 'Goa', price: '₹18,999', category: 'royal', img: '/images/goa_beaches.png' },
  { name: 'Kerala Backwaters', x: 340, y: 440, location: 'Kerala', price: '₹19,499', category: 'royal', img: '/images/kerala_houseboat_1779521772928.png' },
  { name: 'Darjeeling', x: 470, y: 195, location: 'West Bengal', price: '₹17,499', category: 'trails', img: '/images/darjeeling_tea_1779521805614.png' },
  { name: 'Sundarbans', x: 495, y: 235, location: 'West Bengal', price: '₹12,499', category: 'escapes', img: '/images/sundarbans_mangrove_premium.png' },
  { name: 'Dubai', x: 90, y: 220, location: 'Dubai, UAE', price: '₹52,999', category: 'intl', img: '/images/dubai_skyline_1779539448313.png' },
  { name: 'Singapore', x: 740, y: 430, location: 'Singapore', price: '₹59,999', category: 'intl', img: '/images/singapore_skyline_1779539502293.png' },
  { name: 'Maldives', x: 330, y: 485, location: 'Maldives', price: '₹79,999', category: 'intl', img: '/images/maldives_overwater_1779539482305.png' },
  { name: 'Thailand', x: 670, y: 310, location: 'Thailand', price: '₹45,999', category: 'intl', img: '/images/thailand.png' },
];

function InteractiveMap() {
  const [hoveredHotspot, setHoveredHotspot] = useState<MapHotspot | null>(null);
  
  const hubs = [
    { name: 'Delhi', x: 360, y: 150 },
    { name: 'Kolkata', x: 465, y: 225 },
  ];

  const handleHotspotClick = (name: string) => {
    const el = document.getElementById('destinations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('scroll-to-destination', { detail: { name } }));
    }, 450);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-12 p-6 rounded-3xl border border-white/10 bg-slate-950/30 backdrop-blur-xl shadow-2xl overflow-hidden group">
      <style>{`
        @keyframes routeDash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .route-path-animated {
          animation: routeDash 2.5s linear infinite;
        }
      `}</style>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="text-left">
          <h3 className="font-display text-lg lg:text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#18D7F2] animate-spin-slow" /> Interactive Route Map
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Track flight & safari routes connecting our hubs to domestic and international hotspots. Click a destination to explore.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400 justify-start">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#18D7F2]" /> Central Hubs</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Hotspots</span>
        </div>
      </div>

      <div className="relative aspect-[800/500] w-full bg-slate-950/50 rounded-2xl border border-white/5 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={(i + 1) * 50} x2="800" y2={(i + 1) * 50} stroke="rgba(24, 215, 242, 0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`v-${i}`} x1={(i + 1) * 50} y1="0" x2={(i + 1) * 50} y2="500" stroke="rgba(24, 215, 242, 0.08)" strokeWidth="0.5" strokeDasharray="4 4" />
          ))}
        </svg>

        <svg viewBox="0 0 800 500" className="w-full h-full relative z-10 select-none">
          {MAP_HOTSPOTS.map((h, i) => {
            const hub = (h.x < 420 && h.name !== 'Kerala Backwaters' && h.name !== 'Maldives') ? hubs[0] : hubs[1];
            const cx = (hub.x + h.x) / 2;
            const cy = Math.min(hub.y, h.y) - 40;
            return (
              <g key={`route-${i}`}>
                <path
                  d={`M ${hub.x} ${hub.y} Q ${cx} ${cy} ${h.x} ${h.y}`}
                  fill="none"
                  stroke={hoveredHotspot?.name === h.name ? 'rgba(24, 215, 242, 0.4)' : 'rgba(255, 255, 255, 0.03)'}
                  strokeWidth={hoveredHotspot?.name === h.name ? 2.5 : 1}
                  className="transition-all duration-300"
                />
                <path
                  d={`M ${hub.x} ${hub.y} Q ${cx} ${cy} ${h.x} ${h.y}`}
                  fill="none"
                  stroke={h.category === 'intl' ? '#18D7F2' : '#F59E0B'}
                  strokeWidth="1.2"
                  strokeDasharray="6, 8"
                  opacity={hoveredHotspot?.name === h.name ? 0.9 : 0.28}
                  className="route-path-animated transition-all duration-300"
                  style={{
                    strokeDashoffset: hoveredHotspot?.name === h.name ? -50 : 0
                  }}
                />
              </g>
            );
          })}

          {hubs.map((hub) => (
            <g key={`hub-${hub.name}`}>
              <circle cx={hub.x} cy={hub.y} r="12" fill="rgba(24, 215, 242, 0.12)" stroke="rgba(24, 215, 242, 0.4)" strokeWidth="1" />
              <circle cx={hub.x} cy={hub.y} r="6" fill="#18D7F2" />
              <text x={hub.x} y={hub.y - 16} textAnchor="middle" className="font-mono text-[9px] font-bold fill-[#18D7F2] tracking-widest uppercase">
                {hub.name} Hub
              </text>
            </g>
          ))}

          {MAP_HOTSPOTS.map((h) => {
            const isHovered = hoveredHotspot?.name === h.name;
            const markerColor = h.category === 'intl' ? '#18D7F2' : '#F59E0B';
            return (
              <g
                key={`hotspot-${h.name}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredHotspot(h)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={() => handleHotspotClick(h.name)}
              >
                <circle cx={h.x} cy={h.y} r="22" fill="transparent" />
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={isHovered ? 16 : 8}
                  fill="transparent"
                  stroke={markerColor}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-300 opacity-60"
                  style={{
                    transformOrigin: `${h.x}px ${h.y}px`,
                    animation: isHovered ? 'none' : 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }}
                />
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={isHovered ? 6 : 4}
                  fill={markerColor}
                  className="transition-all duration-300"
                  style={{
                    boxShadow: `0 0 10px ${markerColor}`
                  }}
                />
                <text
                  x={h.x}
                  y={h.y + 16}
                  textAnchor="middle"
                  className={`font-display text-[9px] font-bold transition-all duration-300 ${
                    isHovered ? 'fill-white font-black scale-105' : 'fill-slate-400 opacity-75'
                  }`}
                  style={{
                    transformOrigin: `${h.x}px ${h.y}px`,
                  }}
                >
                  {h.name}
                </text>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {hoveredHotspot && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute z-20 pointer-events-none select-none max-w-[220px] rounded-2xl border border-white/15 overflow-hidden shadow-2xl"
              style={{
                left: hoveredHotspot.x > 500 ? hoveredHotspot.x - 240 : hoveredHotspot.x + 20,
                top: hoveredHotspot.y > 320 ? hoveredHotspot.y - 140 : hoveredHotspot.y - 40,
                background: 'rgba(3, 12, 22, 0.96)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.8), 0 0 15px rgba(24, 215, 242, 0.15)',
                backdropFilter: 'blur(15px)'
              }}
            >
              <div className="relative h-24 w-full">
                <img src={hoveredHotspot.img} alt={hoveredHotspot.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[8px] font-mono font-bold uppercase tracking-wider text-slate-350">
                  {hoveredHotspot.category}
                </span>
              </div>
              <div className="p-3 text-left">
                <h4 className="font-display font-black text-white text-xs leading-tight">{hoveredHotspot.name}</h4>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px]">
                  <span className="text-slate-400 font-semibold">{hoveredHotspot.location}</span>
                  <span className="font-mono text-[#18D7F2] font-bold bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/30">
                    {hoveredHotspot.price}
                  </span>
                </div>
                <div className="mt-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center">
                  ⚡ Click to Scroll and View
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

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

        {/* Interactive Travel Map */}
        <Reveal>
          <InteractiveMap />
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
