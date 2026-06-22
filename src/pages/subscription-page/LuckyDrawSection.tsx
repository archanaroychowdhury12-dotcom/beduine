import { 
  Scan, Bot, FileText, Send, Calendar, ArrowRight, ShieldCheck, 
  CheckCircle2, Sparkles, Star, MessageCircle
} from 'lucide-react';
import { Reveal, TiltCard, GoldCheck, KineticText, FloatingIcon } from './SubscriptionHelpers';

export function TravelRewardSystem() {
  const phases = [
    { n: '01', icon: Scan, title: 'Data Verification', accent: 'cyan',
      img: '/images/transparency_verification.png',
      desc: 'All subscription logins made up to Saturday 11:59 PM are collected. Every participant is assigned a unique ticket ID.',
      details: ['Duplicate entries & unverified payments are programmatically purged', 'Invalid accounts are filtered before pool freeze', 'Final subscriber list is frozen for that week\'s draw'] },
    { n: '02', icon: Bot, title: 'Random Selection Engine', accent: 'teal',
      img: '/images/transparency_rng.png',
      desc: 'A secure Random Number Generator (RNG) system selects the winning ticket IDs with full transparency.',
      details: ['Uses Random.org or audit-locked in-house script', 'Selection streamed live or recorded with screen-share', 'Visible on Facebook & YouTube channels'] },
    { n: '03', icon: FileText, title: 'Reports & Audits', accent: 'gold',
      img: '/images/transparency_audit.png',
      desc: 'A comprehensive draw report containing all pool metrics is compiled weekly and archived.',
      details: ['PDF/CSV with total pool, winning IDs & timestamps', 'RNG seed logs included for verification', 'Archived for transparent internal & external audits'] },
    { n: '04', icon: Send, title: 'Winner Announcement', accent: 'cyan',
      img: '/images/transparency_winner.png',
      desc: 'Winners are announced every Sunday evening across all company channels with unique digital coupons.',
      details: ['Website Winners Page + Social Media posts', 'SMS & Email notification with coupon code', 'Unique QR/UUID codes - impossible to duplicate'] },
  ];

  const schedule = [
    { quarter: 'Jan - Mar', tour: 'July', color: 'from-cyan to-blue-500', img: '/images/sundarbans_mangrove_1779521789593.png' },
    { quarter: 'Apr - Jun', tour: 'October', color: 'from-teal-400 to-emerald-600', img: '/images/darjeeling_tea_1779521805614.png' },
    { quarter: 'Jul - Sep', tour: 'January', color: 'from-neon-gold to-gold-deep', img: '/images/kashmir_dal_lake_1779521728036.png' },
    { quarter: 'Oct - Dec', tour: 'April', color: 'from-emerald-400 to-teal-500', img: '/images/kerala_houseboat_1779521772928.png' },
  ];

  return (
    <section id="luckydraw" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Travel Reward Protocol <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="How the draw" />
              <br /><span className="gradient-neon"><KineticText text="actually works." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every Sunday, eligible subscribers enter a verified travel reward selection. The customer journey stays simple: enter, watch, and receive your result securely.</p>
          </div>
        </Reveal>

        {/* Customer draw overview */}
        <Reveal>
          <div className="glass-gold rounded-3xl p-6 lg:p-10 border border-neon-gold/40 mb-16 neon-border-gold">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-[11px] uppercase tracking-widest neon-gold font-semibold mb-2 font-mono">// Weekly Draw Experience</div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">Simple, secure, and verified.</div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Members can follow the draw experience clearly. Results are checked, documented, and shared through official BEDUINE channels.</p>
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
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gold-grad-luckydraw)" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 90 * 0.72} ${Math.PI * 90 * 0.28}`} />
                    <defs><linearGradient id="gold-grad-luckydraw"><stop offset="0%" stopColor="#00D9FF" /><stop offset="100%" stopColor="#FFD166" /></linearGradient></defs>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060c10] via-[#060c10]/40 to-transparent" />
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
                    <div className="font-display text-4xl font-extrabold text-cyan/30 tabular">{p.n}</div>
                    <FloatingIcon delay={i * 0.3}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/30' : p.accent === 'teal' ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal/30' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/30'}`}>
                        <p.icon className="w-7 h-7 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-black text-slate-900">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed mb-5">{p.desc}</p>

                  {/* Real Photo illustration */}
                  <div className="relative rounded-2xl overflow-hidden mb-5 h-36 bg-cosmos shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover opacity-90" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />

                    {/* Floating badge inside picture */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-void/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-line/50 text-[10px] font-mono text-ink">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${p.n === '01' ? 'bg-cyan' : p.n === '02' ? 'bg-teal-500' : p.n === '03' ? 'bg-neon-gold' : 'bg-cyan'}`} />
                        {p.n === '01' ? 'Verification Live' : p.n === '02' ? 'Secure Entropy' : p.n === '03' ? 'Certified Logs' : 'Winner Declared'}
                      </span>
                      <span className="font-bold opacity-60">Step {p.n}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                    {p.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-ink/80">
                        <GoldCheck size={15} variant={p.accent === 'cyan' ? 'cyan' : 'gold'} />
                        <span>{d}</span>
                      </li>
                    ))}
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
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">You don't just wait - you <span className="gradient-neon">participate.</span></div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Every Sunday, subscribers log in to their BEDUINE account, use their Travel Reward Credit to enter, and see results instantly. The selection is triggered by the system itself - not secretly by the company.</p>
                <div className="space-y-3">
                  {[
                    { step: '1', t: 'Log in on Sunday', d: 'Open your BEDUINE app or web portal' },
                    { step: '2', t: 'Activate your entry', d: 'Use your 1 Travel Reward Credit to lock your ticket' },
                    { step: '3', t: 'Watch the draw', d: 'Digital scratch card or RNG animation reveals results' },
                    { step: '4', t: 'Instant result', d: 'Win -> Tour coupon | Not selected -> Discount credits confirmed' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-cyan-deep flex items-center justify-center shrink-0 text-cosmos font-bold text-sm">{s.step}</div>
                      <div><div className="font-semibold text-ink text-sm">{s.t}</div><div className="text-xs text-ink/55">{s.d}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-line group shadow-2xl h-[320px]">
                <img src="/images/lucky_draw_ticket_1779521667122.png" alt="Travel Reward Ticket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/50 to-cosmos/25" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-[10px] font-bold uppercase tracking-widest border border-cyan/20">Active Draw</span>
                    <span className="text-xs font-mono neon-gold font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3 animate-spin" /> Verifiable</span>
                  </div>

                  <div className="glass rounded-xl p-4 border border-neon-gold/30 backdrop-blur-md">
                    <div className="text-center mb-3">
                      <div className="font-display text-sm font-semibold neon-gold tracking-wide">WEEKLY DRAW WINNER</div>
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
              Congratulations <span className="neon-gold">[Name]</span>! You are a BEDUINE Travel Reward Winner! Your coupon: <span className="neon-cyan">BEDWIN-JULY-12345</span>. Call <span className="text-ink">+91 8768903565</span> for details.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function NonWinnerGuarantee() {
  const roiCards = [
    {
      plan: 'Silver', price: 499, dc: 1, dcValue: 500, roi: 100,
      color: 'from-slate-400 to-slate-600', glow: 'slate',
      image: '/images/sundarbans_mangrove_1779521789593.png',
      tours: ['Sundarban', 'Digha', 'Mousuni Island', 'Purulia'],
      example: {
        name: 'Riya Das',
        avatar: '/images/winner_priya_sen.png',
        story: 'Riya subscribed to Silver for ₹499. She didn\'t win the draw, but used her 1 Discount Credit to get ₹500 off her Sundarban trip. She saved ₹1 more than she paid!'
      },
    },
    {
      plan: 'Gold', price: 799, dc: 2, dcValue: 1000, roi: 125,
      color: 'from-teal-400 to-emerald-600', glow: 'teal',
      image: '/images/darjeeling_tea_1779521805614.png',
      tours: ['Darjeeling', 'Dooars', 'Puri', 'Daring Bari'],
      example: {
        name: 'Arjun Roy',
        avatar: '/images/winner_arjun_roy.png',
        story: 'Arjun paid ₹799 for Gold. He didn\'t win, but used his 2 DCs on two separate tours - ₹500 off each. Total savings: ₹1,000 on a ₹799 subscription!'
      },
    },
    {
      plan: 'Platinum', price: 1499, dc: 4, dcValue: 2000, roi: 133,
      color: 'from-neon-gold via-gold to-gold-deep', glow: 'gold',
      image: '/images/kashmir_dal_lake_1779521728036.png',
      tours: ['Kashmir', 'Goa', 'Sikkim', 'Himachal (Shimla+Manali)'],
      example: {
        name: 'Priya Sen',
        avatar: '/images/winner_ananya_das.png',
        story: 'Priya subscribed to Platinum for ₹1,499. She didn\'t win, but received 4 DCs - ₹500 off on 4 different tours = ₹2,000 total savings. That\'s 133% value recovery!'
      },
    },
  ];

  return (
    <section id="non-winner" className="relative py-14 lg:py-20 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> No-Loss Security <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Didn't win?" />
              <br /><span className="gold-shimmer"><KineticText text="You still win." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Our Non-Winner Guarantee protects your membership value. If you don't win a travel reward draw, you get your full plan value back in discount credits. Check out how subscribers recover up to 133% of their costs.</p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8">
          {roiCards.map((card, index) => (
            <Reveal key={card.plan} delay={index * 0.15}>
              <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all duration-300 h-full flex flex-col justify-between p-6">
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-6 bg-slate-950">
                    <img src={card.image} alt={card.plan} className="w-full h-full object-cover opacity-80" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-white/60 text-[10px] uppercase font-mono tracking-widest">Plan Shield</div>
                      <div className="text-xl font-display font-black text-white">{card.plan} Shield</div>
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink mb-3">{card.plan} Plan ROI Example</h3>
                  <div className="flex items-center gap-1.5 mb-5 font-mono text-xs font-black text-slate-500 uppercase tracking-widest">// Supported tours</div>
                  <ul className="space-y-2 mb-6">
                    {card.tours.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-ink/80 font-semibold">
                        <GoldCheck size={14} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-line/50 pt-5 mb-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={card.example.avatar} alt={card.example.name} className="w-9 h-9 rounded-full object-cover border border-neon-gold shadow-md" loading="lazy" />
                      <div>
                        <div className="font-display font-bold text-ink text-sm">{card.example.name}</div>
                        <div className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">{card.plan} Subscriber</div>
                      </div>
                    </div>
                    <p className="text-sm text-ink/70 leading-relaxed italic font-serif">"{card.example.story}"</p>
                  </div>
                </div>

                <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">Value Back: {card.roi}% - Paid ₹{card.price}, got ₹{card.dcValue.toLocaleString()} value</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
