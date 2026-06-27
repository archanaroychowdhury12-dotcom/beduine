import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown, MapPin, Wallet, Plane, Sparkles } from 'lucide-react';
import { Reveal, TiltCard, GoldCheck, KineticText, ParticleButton } from './SubscriptionHelpers';
import { PLANS, INTL_PLANS } from '../../data/siteData';

/* ---------- Custom AI-Tech Premium Icon ---------- */
function AIIcon({ type }: { type: string }) {
  switch (type) {
    case 'calendar':
      return (
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M12 14v4M10 16h4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'mappin':
      return (
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'award':
      return (
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case 'barchart':
      return (
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case 'filecheck':
      return (
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <polyline points="9 15 11 17 15 13" />
        </svg>
      );
    case 'plane':
      return (
        <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M12 22V12" />
          <path d="M12 12L7.5 7.5M12 12l4.5-4.5" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- PlanCard Component ---------- */
function PlanCard({ plan, index, onSelectPlan, selectedPlanId, showDemoWallet }: { plan: typeof PLANS[number]; index: number; onSelectPlan: (planName: string) => void; selectedPlanId?: string; showDemoWallet?: boolean }) {
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
  const creditValue = plan.discountValue.toLocaleString('en-IN');
  const isComingSoon = plan.name !== 'Silver' && !showDemoWallet;

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard intensity={6}>
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner bg-gradient-to-b from-slate-950 to-slate-900 border ${
          selectedPlanId === plan.name
            ? 'border-4 border-[#FF6B6B] shadow-2xl shadow-rose-500/20'
            : plan.featured
              ? 'border-2 border-neon-gold/80 shadow-2xl shadow-neon-gold/10'
              : 'border-slate-800/80 hover:border-cyan/50 hover:shadow-2xl hover:shadow-cyan/5'
        }`}>
          {plan.featured && !isComingSoon && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-gold via-cyan to-neon-gold z-10" />}
          {plan.featured && !isComingSoon && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Crown className="w-3 h-3 fill-current" /> Premium Choice</div>}
          {isComingSoon && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">Coming Soon</div>}

          <div className="relative h-48 overflow-hidden bg-slate-950">
            <div className={`tilt-img absolute inset-0 bg-cover bg-center transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-80'}`} style={{ ...imgStyle, backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="relative p-7 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-cyan-deep uppercase tracking-widest font-bold">{plan.tagline}</div>
                  <div className="font-display text-3xl font-black text-white mt-0.5">{plan.name}</div>
                </div>
                <plan.icon className="w-10 h-10 text-neon-gold" strokeWidth={1.8} />
              </div>
              <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs text-neon-gold font-bold">
                <MapPin className="w-3.5 h-3.5" /> {plan.imageLabel}
              </motion.div>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80 relative overflow-visible">
            <div className="flex items-baseline gap-1">
              <span className="text-neon-gold text-lg font-bold">₹</span>
              <span className="font-display text-5xl font-black text-white tracking-tight tabular">{plan.price}</span>
              <span className="text-slate-400 font-extrabold text-sm">/ 12 mo</span>
            </div>
            <div className="mt-2 text-sm text-slate-300 font-bold">Selected member tour value up to <span className="font-extrabold text-white">₹{plan.tourValue.toLocaleString('en-IN')}</span> - {plan.duration}</div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm font-black leading-snug text-emerald-100">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span>Pay ₹{plan.price.toLocaleString('en-IN')}. If not selected, use ₹{creditValue} as travel credit.</span>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-cyan" /><div className="text-[11px] uppercase tracking-widest text-cyan font-bold">Selection Destinations</div></div>
            <ul className="space-y-2">{plan.destinations.map((d) => <li key={d} className="flex items-start gap-2 text-sm text-slate-200 font-bold"><GoldCheck size={15} /><span>{d}</span></li>)}</ul>
          </div>

          <div className="p-7 space-y-2.5">{plan.benefits.slice(0, 4).map((b) => <div key={b} className="flex items-start gap-2.5 text-sm text-slate-200 font-bold"><GoldCheck size={16} /><span>{b}</span></div>)}</div>

          <div className="px-7 pb-5">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: 'Discount Credits', v: `₹ ${plan.discountValue.toLocaleString('en-IN')}` }, { l: 'Paid Tour Off', v: `Up to ${plan.paidDiscount}` }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{c.l}</div>
                  <div className="text-xs font-black text-slate-100 mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            {isComingSoon ? (
              <button
                disabled
                className="block text-center w-full py-3.5 rounded-full font-bold bg-white/5 border border-white/10 text-slate-500 text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            ) : (
              <ParticleButton
                onClick={() => onSelectPlan(plan.name)}
                variant={selectedPlanId === plan.name ? 'gold' : plan.featured ? 'gold' : 'cyan'}
                className="block text-center w-full py-3.5 rounded-full font-bold"
              >
                {selectedPlanId === plan.name ? `Selected ${plan.name}` : `Subscribe ${plan.name}`}
              </ParticleButton>
            )}
            <div className="text-center text-[11px] text-slate-400 font-bold mt-3 font-mono">// 12-mo validity - pickup included</div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/* ---------- IntlPlanCard Component ---------- */
function IntlPlanCard({ plan, index, onSelectPlan, selectedPlanId, showDemoWallet }: { plan: typeof INTL_PLANS[number]; index: number; onSelectPlan?: (planName: string) => void; selectedPlanId?: string; showDemoWallet?: boolean }) {
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
  const creditValue = plan.discountValue.toLocaleString('en-IN');

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard intensity={6}>
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner bg-gradient-to-b from-slate-950 to-slate-900 border ${
          selectedPlanId === `${plan.name}_Int`
            ? 'border-4 border-[#FF6B6B] shadow-2xl shadow-rose-500/20'
            : plan.featured
              ? 'border-2 border-emerald-400/80 shadow-2xl shadow-cyan/10'
              : 'border-slate-800/80 hover:border-cyan/50 hover:shadow-2xl hover:shadow-cyan/5'
        }`}>
          {plan.featured && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan to-emerald-400 z-10" />}
          {!showDemoWallet && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">Coming Soon</div>}

          <div className="relative h-48 overflow-hidden bg-slate-950">
            <div className={`tilt-img absolute inset-0 bg-cover bg-center transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-80'}`} style={{ ...imgStyle, backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="relative p-7 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-cyan-deep uppercase tracking-widest font-bold">{plan.tagline}</div>
                  <div className="font-display text-3xl font-black text-white mt-0.5">{plan.name}</div>
                </div>
                <plan.icon className="w-10 h-10 text-cyan" strokeWidth={1.8} />
              </div>
              <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs text-cyan font-bold">
                <Plane className="w-3.5 h-3.5" /> {plan.imageLabel}
              </motion.div>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80">
            <div className="flex items-baseline gap-1">
              <span className="text-cyan text-lg font-bold">₹</span>
              <span className="font-display text-5xl font-black text-white tracking-tight tabular">{plan.price.toLocaleString('en-IN')}</span>
              <span className="text-slate-400 font-extrabold text-sm">/ 12 mo</span>
            </div>
            <div className="mt-2 text-sm text-slate-300 font-bold">Selected member tour value up to <span className="font-extrabold text-white">₹{plan.tourValue.toLocaleString('en-IN')}</span> - {plan.duration}</div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan/25 bg-cyan/10 p-3 text-sm font-black leading-snug text-cyan-bright">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Pay ₹{plan.price.toLocaleString('en-IN')}. If not selected, use ₹{creditValue} as travel credit.</span>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80">
            <div className="flex items-center gap-2 mb-3"><Plane className="w-4 h-4 text-cyan" /><div className="text-[11px] uppercase tracking-widest text-cyan font-bold">International Destinations</div></div>
            <ul className="space-y-2">{plan.destinations.map((d) => <li key={d} className="flex items-start gap-2 text-sm text-slate-200 font-bold"><GoldCheck size={15} variant="cyan" /><span>{d}</span></li>)}</ul>
          </div>

          <div className="p-7 space-y-2.5">{plan.benefits.slice(0, 4).map((b) => <div key={b} className="flex items-start gap-2.5 text-sm text-slate-200 font-bold"><GoldCheck size={16} variant="cyan" /><span>{b}</span></div>)}</div>

          <div className="px-7 pb-5">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: 'Discount Credits', v: `₹ ${plan.discountValue.toLocaleString('en-IN')}` }, { l: 'Tour Discount', v: plan.paidDiscount.startsWith('Up to') ? plan.paidDiscount : `Up to ${plan.paidDiscount}` }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{c.l}</div>
                  <div className="text-xs font-black text-slate-100 mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            {showDemoWallet && onSelectPlan ? (
              <ParticleButton
                onClick={() => onSelectPlan(`${plan.name}_Int`)}
                variant={selectedPlanId === `${plan.name}_Int` ? 'gold' : plan.featured ? 'gold' : 'cyan'}
                className="block text-center w-full py-3.5 rounded-full font-bold"
              >
                {selectedPlanId === `${plan.name}_Int` ? `Selected ${plan.name} Int` : `Subscribe ${plan.name} Int`}
              </ParticleButton>
            ) : (
              <button
                disabled
                className="block text-center w-full py-3.5 rounded-full font-bold bg-white/5 border border-white/10 text-slate-500 text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
            <div className="text-center text-[11px] text-slate-400 font-bold mt-3 font-mono">// 12-mo validity - visa assist included</div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/* ---------- Domestic Plans Wrapper ---------- */
export function Plans({ onSelectPlan, selectedPlanId, showDemoWallet }: { onSelectPlan: (planName: string) => void; selectedPlanId?: string; showDemoWallet?: boolean }) {
  return (
    <section id="plans" className="relative py-14 lg:py-20 overflow-hidden">
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
            className="relative flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl glass-cyan border border-cyan/20 shadow-xl shadow-black/55 mb-12 max-w-3xl mx-auto overflow-hidden group text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-cyan/10 blur-xl" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-cyan-deep flex items-center justify-center shrink-0 shadow-lg shadow-cyan/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-left text-xs sm:text-sm leading-relaxed relative z-10 text-ink">
              <div className="font-semibold text-cyan-deep uppercase tracking-widest flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-deep animate-pulse" />
                Subscription Rules & Benefits
              </div>
              <div className="text-ink/75 mt-1">
                <span className="font-semibold text-rose-700">No Cash Refunds.</span> Every active plan joins the weekly selection. If you are not selected, your plan value turns into <span className="font-semibold text-ink">travel credits</span> for future bookings.
              </div>
            </div>
          </motion.div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PLANS.map((p, i) => (
            <PlanCard key={p.name} plan={p} index={i} onSelectPlan={onSelectPlan} selectedPlanId={selectedPlanId} showDemoWallet={showDemoWallet} />
          ))}
        </div>

        <Reveal>
          <div className="mt-14 glass rounded-2xl p-6 lg:p-8 border border-slate-line">
            <div className="text-center text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-5">Included in every domestic plan</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[{ type: 'calendar', t: '12 Months Validity', d: 'Full subscription coverage' }, { type: 'mappin', t: 'Pickup & Drop', d: 'From selected points' }, { type: 'award', t: 'Quarterly Tours', d: 'Batched travel cycles' }, { type: 'barchart', t: 'Digital Dashboard', d: 'Track credits & selections' }].map((b) => (
                <div key={b.t} className="flex items-center gap-3.5">
                  <AIIcon type={b.type} />
                  <div><div className="font-bold text-white text-sm">{b.t}</div><div className="text-xs text-slate-400 mt-0.5">{b.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- International Plans Wrapper ---------- */
export function InternationalPlans({ onSelectPlan, selectedPlanId, showDemoWallet }: { onSelectPlan: (planName: string) => void; selectedPlanId?: string; showDemoWallet?: boolean }) {
  return (
    <section id="intl-plans" className="relative py-14 lg:py-20 overflow-hidden">
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
            <IntlPlanCard key={p.name} plan={p} index={i} onSelectPlan={onSelectPlan} selectedPlanId={selectedPlanId} showDemoWallet={showDemoWallet} />
          ))}
        </div>

        <Reveal>
          <div className="mt-14 glass rounded-2xl p-6 lg:p-8 border border-slate-line neon-border-cyan">
            <div className="text-center text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-5">Included in every international plan</div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[{ type: 'calendar', t: '12 Months Validity', d: 'Full subscription coverage' }, { type: 'filecheck', t: 'Visa Assistance', d: 'End-to-end documentation' }, { type: 'plane', t: 'Airport Lounge', d: 'Premium access included' }].map((b) => (
                <div key={b.t} className="flex items-center gap-3.5">
                  <AIIcon type={b.type} />
                  <div><div className="font-bold text-white text-sm">{b.t}</div><div className="text-xs text-slate-400 mt-0.5">{b.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
