import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Route, Tag, Trophy, ShieldCheck, Gem, 
  CreditCard, FileCheck2, Wallet, Gift, ArrowRight, Eye, FileText, 
  Lock, TrendingUp, Scan, Download 
} from 'lucide-react';
import { Reveal, TiltCard, GoldCheck, KineticText, FloatingIcon, SubSectionBadge } from './SubscriptionHelpers';
import { SERVICES, JOURNEY_IMAGES, JOURNEY_FLOATS, AUDIT_REPORTS } from '../../data/siteData';

/* ---------- About Us / Mission / Vision ---------- */
export function AboutUs() {


  const pillars = [
    {
      num: '01',
      icon: Route,
      title: 'Curated Itineraries',
      text: 'Every plan is crafted thoughtfully by travel experts to balance culture, comfort, and discovery.',
    },
    {
      num: '02',
      icon: Tag,
      title: 'Transparent Benefits',
      text: 'Every plan tells the truth—no hidden costs, no messy add-ons, just genuine value.',
    },
    {
      num: '03',
      icon: Trophy,
      title: 'Winner Experiences',
      text: 'Handpicked destinations, quality stays, unique activities, and premium experiences designed to feel special.',
    },
    {
      num: '04',
      icon: ShieldCheck,
      title: 'Guaranteed Credits',
      text: 'If we miss our promise, credits are yours— no excuses, applicable on future trips. Simple, fair, and travel-friendly.',
    },
  ];

  return (
    <section id="about" className="relative bg-transparent overflow-hidden">
      {/* ── Intro Band with Misty Forest Background ── */}
      <div className="relative py-20 lg:py-28 border-b border-white/5">
        {/* Background image overlay container */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/images/about_forest_bg.png"
            alt="Misty Forest"
            className="w-full h-full object-cover opacity-35 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-[#030C16]/85 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030C16]/40 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          {/* Label */}
          <Reveal>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#18D7F2] font-extrabold">About Beduine</span>
              <div className="w-12 h-px bg-[#18D7F2]/35" />
            </div>
          </Reveal>

          {/* Big headline + body two-col */}
          <Reveal>
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start mb-16 relative">
              {/* Vertical floating timeline separator dot */}
              <div className="hidden lg:block absolute left-[53%] top-1/2 -translate-y-1/2 w-8 h-px bg-[#18D7F2]/20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#18D7F2] ring-4 ring-[#18D7F2]/20" />
              </div>

              <div>
                <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                  Safar jo<br />
                  <span className="font-serif italic text-gold-accent bg-clip-text bg-gradient-to-r from-gold-accent via-[#C89C53] to-[#B97800]">yaad rahe.</span>
                </h2>
                <div className="text-sm italic font-semibold text-[#18D7F2] mt-6 max-w-sm">
                  Journeys that stay in the heart long after the destination is surpassed.
                </div>
              </div>

              <div className="space-y-6 text-slate-300">
                <p className="text-lg font-bold leading-relaxed text-white">
                  BEDUINE Tour &amp; Travels is a customer-first travel company dedicated to crafting journeys that truly matter.
                </p>
                <p className="text-sm leading-relaxed font-semibold text-slate-400">
                  We believe travel is a feeling—planning, a seamless escape, or an unforgettable memory. Our mission is simple: to make every trip curated, transparent, and exceptionally memorable.
                </p>
                <p className="text-sm leading-relaxed font-semibold text-slate-400">
                  Our subscription model blends exclusive early-bird access, transparent benefits, and seamless planning so every journey feels personal, rewarding, and stress-free.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Horizontal glass indicators */}
          <Reveal>
            <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-md px-8 py-6 flex flex-wrap md:flex-nowrap justify-around items-center gap-6 shadow-xl shadow-black/20 my-16 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                { icon: Gem, title: 'Subscription + Travel', desc: 'More value. More journeys.' },
                { icon: Route, title: 'Curated Escapes', desc: 'Expertly designed itineraries.' },
                { icon: ShieldCheck, title: 'Travel Guarantee', desc: 'Guaranteed credits, zero risk.' },
              ].map((item) => (
                <div key={item.title} className="flex-1 min-w-[200px] text-center p-4 first:pt-0 md:first:pt-4 first:border-t-0 md:first:border-l-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18D7F2] to-cyan flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#18D7F2]/10">
                    <item.icon className="w-5 h-5 text-cosmos" />
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-1 font-semibold">{item.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Pillars Grid Section ── */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-24 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <SubSectionBadge text="Core Philosophy" theme="gold" />
            <h3 className="font-display text-3xl lg:text-4xl font-extrabold text-white mt-4 leading-tight">
              Four pillars of every travel experience
            </h3>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.1}>
              <TiltCard intensity={6} className="h-full">
                <div className="glass rounded-3xl p-6 border border-white/5 hover:border-[#18D7F2]/30 transition-all duration-300 h-full flex flex-col justify-between tilt-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#18D7F2]/5 to-transparent blur-md pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#18D7F2]/10 border border-[#18D7F2]/20 flex items-center justify-center group-hover:bg-[#18D7F2]/20 transition-all duration-300">
                        <p.icon className="w-5 h-5 text-[#18D7F2]" />
                      </div>
                      <span className="font-display text-4xl font-black text-white/10 tracking-tight group-hover:text-[#18D7F2]/10 transition-colors duration-300">{p.num}</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-white mb-2">{p.title}</h4>
                    <p className="text-sm text-slate-400 font-semibold leading-relaxed">{p.text}</p>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HowItWorks ---------- */
export function HowItWorks() {
  const steps = [
    { n: '01', icon: CreditCard, title: 'Choose Your Plan', desc: 'Select from our Silver, Gold, or Platinum tiers (domestic & international plans).', details: ['12-month validity', 'Clear credit options', '18+ membership only'], img: '/images/beduin_travel_hero_1779521651766.png' },
    { n: '02', icon: FileCheck2, title: 'Complete Verification', desc: 'Securely submit your inquiry and confirm age requirements to activate benefits.', details: ['WhatsApp Activation', '18+ age verification', 'Secure processing'], img: '/images/office_setup.png' },
    { n: '03', icon: Wallet, title: 'Get Your Credits', desc: 'Get your Travel Reward Credit (TRC) token and Discount Credits (DCs) loaded.', details: ['1 TRC token received', '₹500 discount credits', 'Value floor guaranteed'], img: '/images/lucky_draw_ticket_1779521667122.png' },
    { n: '04', icon: Gift, title: 'Travel & Save', desc: 'Enjoy weekly promotional winner benefits or apply discount credits on paid bookings.', details: ['Weekly winner draws', '₹500 off per booking', 'Non-cash travel benefits'], img: '/images/happy_family_travelers.png' },
  ];
  return (
    <section id="how" className="relative py-14 lg:py-20 overflow-hidden">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <TiltCard className="h-full" intensity={6}>
                <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner">
                  {/* Step image */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060c10] via-[#060c10]/60 to-transparent" />
                    <div className="absolute top-3 left-4 font-display text-5xl font-bold text-cyan/30 tabular">{s.n}</div>
                    <div className="absolute top-3 right-3">
                      <FloatingIcon delay={i * 0.5}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${i % 2 === 0 ? 'from-cyan to-cyan-deep' : 'from-neon-gold to-gold-deep'} flex items-center justify-center shadow-lg ${i % 2 === 0 ? 'shadow-cyan/30' : 'shadow-neon-gold/30'}`}><s.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} /></div>
                      </FloatingIcon>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed mb-5 min-h-[60px]">{s.desc}</p>
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

/* ---------- Services ---------- */
export function Services() {
  return (
    <section id="services" className="relative py-14 lg:py-20 overflow-hidden">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <TiltCard intensity={4}>
                <div className="glass rounded-2xl p-5 border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner flex flex-col justify-between group">
                  <div>
                    {/* Premium Card Header Image */}
                    <div className="relative h-44 rounded-xl overflow-hidden mb-5 z-0">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                      {/* Dark gradient shadow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />

                      {/* Floating icon badge */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <div className="w-10 h-10 rounded-xl glass-cyan flex items-center justify-center border border-slate-line/80 shadow-lg backdrop-blur-md">
                          <s.icon className="w-5 h-5 text-cyan animate-pulse" strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-ink mb-2 transition-colors duration-300 group-hover:text-cyan">
                      {s.title}
                    </h3>
                    <p className="text-sm text-ink/65 leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-line/40 flex items-center gap-2 text-xs font-semibold neon-cyan">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
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
export function Transparency() {
  const features = [
    { icon: Eye,       t: 'Live-streamed draws',      d: 'Every Sunday at 6 PM on YouTube & Facebook.',              color: 'from-cyan-500 to-[#00F5D4]', glow: 'rgba(0,245,212,0.25)' },
    { icon: FileText,  t: 'Public audit reports',     d: 'PDF / CSV with verified draw records and winner list.',      color: 'from-amber-400 to-amber-600',   glow: 'rgba(245,158,11,0.25)' },
    { icon: Lock,      t: 'Verifiable coupons',       d: 'Unique QR / UUID codes - impossible to duplicate.',          color: 'from-sky-500 to-cyan-600', glow: 'rgba(34,211,238,0.25)' },
    { icon: TrendingUp,t: 'Fair selection process',   d: 'Results reviewed and published through official channels.',  color: 'from-teal-400 to-emerald-500', glow: 'rgba(16,185,129,0.25)' },
  ];

  return (
    <section id="audit" className="audit-polish relative py-14 lg:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        {/* Section Header */}
        <Reveal>
          <div className="text-center mb-12">
            <SubSectionBadge text="Transparency Engine" theme="gold" />
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mt-4">
              <KineticText text="Every draw," />
              <br /><span className="gold-shimmer"><KineticText text="fully documented." delay={0.3} /></span>
            </h2>
            <p className="mt-4 text-white/80 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Trust isn't claimed - it's proven. Our weekly reward draws use certified RNG, are live-streamed, and archived as downloadable audit reports.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Feature pills */}
          <Reveal>
            <div className="space-y-4">
              {features.map((f, i) => (
                <Reveal key={f.t} delay={i * 0.09}>
                  <div className="audit-feature-card flex items-start gap-4 rounded-2xl bg-black/50 border border-white/10 p-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-white/20 transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0 shadow-lg`}
                      style={{ boxShadow: `0 0 18px ${f.glow}` }}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-sm leading-snug">{f.t}</div>
                      <div className="text-white/65 text-sm mt-0.5 leading-relaxed">{f.d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Right: Audit report card */}
          <Reveal delay={0.15}>
            <div className="audit-report-card rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
                <div>
                  <SubSectionBadge text="Digital Audit Archive" theme="cyan" />
                  <div className="font-display text-lg font-bold text-white mt-2">Recent Draw Reports</div>
                </div>
                <FloatingIcon>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-[#00F5D4] flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Scan className="w-5 h-5 text-white" />
                  </div>
                </FloatingIcon>
              </div>

              {/* Report rows */}
              <div className="p-4 space-y-3">
                {AUDIT_REPORTS.map((r) => (
                  <div key={r.week} className="audit-report-row flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 hover:border-amber-400/30 hover:bg-white/8 transition-all p-3 group">
                    {/* Status dot */}
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-white text-sm">{r.week}</div>
                      <div className="text-white/45 text-[11px] font-mono">{r.date}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{r.status}</span>
                      <button className="audit-download-btn w-7 h-7 rounded-lg bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 flex items-center justify-center transition-all group-hover:border-amber-400/40" aria-label={`Download ${r.week} audit report`}>
                        <Download className="w-3.5 h-3.5 text-white/50 group-hover:text-amber-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 pt-2 border-t border-white/8">
                <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-[#00F5D4]/10 border border-cyan-500/25 hover:border-cyan-400/50 text-[#00F5D4] text-xs font-bold font-mono tracking-widest hover:bg-cyan-500/15 transition-all">
                  &gt; view_full_archive() <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Journey ---------- */
export function Journey() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCardStyle = (index: number) => {
    const isHovered = hoveredIndex === index;
    const isAnyHovered = hoveredIndex !== null;

    // Stacked state (default overlapping fan stack at the center)
    const stackedOffsets = isMobile ? [
      { x: -15, y: -25, rotate: -5, z: 20 },
      { x: 20, y: -10, rotate: 4, z: 15 },
      { x: -5, y: 10, rotate: -2, z: 25 },
      { x: -30, y: 35, rotate: -8, z: 10 },
      { x: 30, y: 25, rotate: 6, z: 12 }
    ] : [
      { x: -30, y: -45, rotate: -8, z: 20 },
      { x: 35, y: -20, rotate: 6, z: 15 },
      { x: -10, y: 15, rotate: -3, z: 25 },
      { x: -50, y: 60, rotate: -10, z: 10 },
      { x: 55, y: 45, rotate: 9, z: 12 }
    ];

    // Fanned state offsets - gorgeous distribution spread in space
    const fannedOffsets = isMobile ? [
      { x: -65, y: -65, rotate: -10, z: 10 },
      { x: 65, y: -55, rotate: 8, z: 12 },
      { x: -45, y: 65, rotate: -5, z: 14 },
      { x: 45, y: 75, rotate: 5, z: 16 },
      { x: 0, y: 5, rotate: 0, z: 20 }
    ] : [
      { x: -140, y: -100, rotate: -12, z: 10 },
      { x: 140, y: -80, rotate: 10, z: 12 },
      { x: -80, y: 100, rotate: -5, z: 14 },
      { x: 80, y: 120, rotate: 6, z: 16 },
      { x: 0, y: 10, rotate: 0, z: 20 }
    ];

    let baseX = isDeckHovered ? fannedOffsets[index].x : stackedOffsets[index].x;
    let baseY = isDeckHovered ? fannedOffsets[index].y : stackedOffsets[index].y;
    let baseRotate = isDeckHovered ? fannedOffsets[index].rotate : stackedOffsets[index].rotate;
    let zIndex = isDeckHovered ? fannedOffsets[index].z : stackedOffsets[index].z;

    if (isHovered) {
      return {
        x: baseX,
        y: baseY - 30, // floats up
        rotate: 0,
        scale: 1.18,
        zIndex: 100,
        opacity: 1,
        filter: 'brightness(1.1) saturate(1.15)'
      };
    }

    if (isAnyHovered) {
      return {
        x: baseX,
        y: baseY,
        rotate: baseRotate,
        scale: 0.9,
        zIndex,
        opacity: 0.8,
        filter: 'brightness(0.95) saturate(1.0)'
      };
    }

    return {
      x: baseX,
      y: baseY,
      rotate: baseRotate,
      scale: 1,
      zIndex,
      opacity: 1,
      filter: 'brightness(1.05) saturate(1.1)'
    };
  };

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Our Journey <div className="w-8 h-px bg-cyan" /></div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight">
                <KineticText text="Crafting memories," />
                <br /><span className="gradient-neon"><KineticText text="one journey at a time." delay={0.3} /></span>
              </h2>
              <p className="mt-6 text-white/80 text-lg leading-relaxed">From the misty peaks of Kashmir to the sun-drenched beaches of Goa - every trip we craft becomes a chapter in your life's most beautiful story.</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[{ n: '10K+', l: 'Happy Travelers' }, { n: '50+', l: 'Destinations' }, { n: '100%', l: 'Verified' }].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-4 border border-slate-line">
                    <div className="font-display text-2xl lg:text-3xl font-bold neon-gold tabular">{s.n}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Dynamic 3D fanning-out gallery deck */}
          <Reveal delay={0.2}>
            <div
              className="relative h-[550px] lg:h-[650px] flex items-center justify-center select-none"
              onMouseEnter={() => setIsDeckHovered(true)}
              onMouseLeave={() => {
                setIsDeckHovered(false);
                setHoveredIndex(null);
              }}
              onTouchStart={() => setIsDeckHovered(true)}
            >
              {/* Decorative rotating ring behind the cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rotate-slow opacity-25 hidden lg:block pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-gold/30" />
                <div className="absolute inset-10 rounded-full border border-cyan/20" />
                <div className="absolute inset-20 rounded-full border border-gold/20" />
              </div>

              {/* Text instruction overlay */}
              <div className="absolute top-4 text-center z-10 w-full pointer-events-none transition-opacity duration-300">
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-white/50 uppercase bg-black/45 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                  {isDeckHovered ? 'Tap or hover cards to reveal' : 'Hover or tap to expand gallery'}
                </span>
              </div>

              {JOURNEY_IMAGES.map((img, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <motion.div
                    key={img.label}
                    animate={getCardStyle(i)}
                    transition={{
                      type: 'spring',
                      stiffness: isHovered ? 260 : 120,
                      damping: isHovered ? 20 : 18
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex(hoveredIndex === i ? null : i)}
                    className={`absolute w-[200px] h-[285px] lg:w-[250px] lg:h-[355px] left-1/2 top-1/2 -ml-[100px] -mt-[142px] lg:-ml-[125px] lg:-mt-[177px] rounded-3xl overflow-hidden border bg-slate-900 cursor-pointer shadow-2xl transition-all duration-300 group
                      ${img.theme === 'cyan' ? 'border-cyan/20 hover:border-cyan/80' : img.theme === 'gold' ? 'border-amber-400/20 hover:border-amber-400/80' : 'border-cyan/20 hover:border-cyan/80'}
                    `}
                  >
                    <motion.div
                      className="absolute -inset-4"
                      animate={(hoveredIndex !== null || isDeckHovered) ? {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        transition: { type: 'spring', stiffness: 200, damping: 20 }
                      } : {
                        x: JOURNEY_FLOATS[i].x,
                        y: JOURNEY_FLOATS[i].y,
                        rotate: JOURNEY_FLOATS[i].rotate,
                        scale: JOURNEY_FLOATS[i].scale,
                        transition: {
                          duration: JOURNEY_FLOATS[i].duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (i % 4) * 0.25
                        }
                      }}
                    >
                      {/* Image */}
                      <img
                        src={img.src}
                        alt={img.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Bottom-focused shadow gradient for contrast readability of text, keeping the top half bright and saturated */}
                      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10" />
                    </motion.div>

                    {/* Content overlays */}
                    <div className="absolute inset-x-0 bottom-0 p-4 pt-12 z-20 flex flex-col justify-end pointer-events-none">
                      <span className={`text-[9px] font-bold uppercase tracking-widest font-mono mb-1 w-fit px-2 py-0.5 rounded-md bg-black/45 border
                        ${img.theme === 'cyan' ? 'text-cyan border-cyan/20' : img.theme === 'gold' ? 'text-neon-gold border-amber-500/20' : 'text-cyan border-cyan/20'}
                      `}>
                        {img.badge}
                      </span>
                      <h4 className="font-display font-bold text-white text-sm sm:text-base leading-snug">
                        {img.label}
                      </h4>
                      <p className="text-[11px] text-white/70 mt-1 leading-snug opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-12 transition-all duration-300 overflow-hidden">
                        {img.desc}
                      </p>
                    </div>

                    {/* Hover indicator corner border */}
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-3xl transition-colors pointer-events-none" />
                  </motion.div>
                );
              })}

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-[80%] lg:top-[75%] right-[10%] lg:right-[15%] w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shadow-2xl shadow-neon-gold/40 z-30 animate-float-gentle pointer-events-none"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-center text-cosmos">
                  <div className="font-display font-bold text-lg">5-star</div>
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
