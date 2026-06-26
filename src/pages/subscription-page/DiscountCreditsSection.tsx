import { useState } from 'react';
import { 
  Sparkles, CreditCard, CheckCircle2, Fingerprint, ShieldCheck, 
  Star, Crown, ChevronRight 
} from 'lucide-react';
import { Reveal, TiltCard, GoldCheck, KineticText, FloatingIcon } from './SubscriptionHelpers';

export function DiscountCreditsSection() {
  const [activeTab, setActiveTab] = useState<'domestic' | 'intl'>('domestic');

  const credits = [
    { type: 'TRC', name: 'Travel Reward Credit', icon: Sparkles, accent: 'cyan',
      desc: '1 Credit is issued per subscription. This credit acts as a token that the user manually spends on the mobile app/web portal on Sunday to lock their participation in that week\'s travel reward selection.',
      rule: '1 Credit = 1 Entry in the weekly Travel Reward selection',
      details: ['Automatically added upon payment verification', 'Used every Sunday to activate draw entry', 'Ticket ID confirmed and locked for that week', 'No extra credits can be purchased - fair chance for all'] },
    { type: 'DC', name: 'Discount Credits', icon: CreditCard, accent: 'teal',
      desc: 'These act as the protective floor for non-winners. If a user does not win, these credits allow them to claim a flat discount off per tour booking.',
      rule: '1 Tour Booking = 1 Discount Credit applied',
      details: [
        'Domestic members receive ₹500-value Domestic Discount Credits.',
        'International members receive ₹5,000-value International Discount Credits.',
        'Domestic and International credits cannot be cross-used.',
        'Credits valid for 12 months (up to subscription expiry)'
      ] },
  ];

  const domesticCredits = [
    { plan: 'Silver', price: '₹499', ldc: '1', dc: '1 × ₹500', total: '₹500', color: 'from-slate-500 to-slate-700', image: '/images/sundarbans_mangrove_1779521789593.png' },
    { plan: 'Gold', price: '₹799', ldc: '1', dc: '2 × ₹500', total: '₹1,000', color: 'from-teal-400 to-emerald-600', image: '/images/darjeeling_tea_1779521805614.png' },
    { plan: 'Platinum', price: '₹1,499', ldc: '1', dc: '4 × ₹500', total: '₹2,000', color: 'from-neon-gold to-gold-deep', image: '/images/kashmir_dal_lake_1779521728036.png' },
  ];

  const intlCredits = [
    { plan: 'Silver', price: '₹4,999', ldc: '1', dc: '1 × ₹5,000', total: '₹5,000', color: 'from-sky-400 to-blue-600', image: '/images/nepal.png' },
    { plan: 'Gold', price: '₹7,999', ldc: '1', dc: '2 × ₹5,000', total: '₹10,000', color: 'from-emerald-400 to-teal-600', image: '/images/thailand.png' },
    { plan: 'Platinum', price: '₹14,999', ldc: '1', dc: '4 × ₹5,000', total: '₹20,000', color: 'from-cyan via-cyan-bright to-cyan-deep', image: '/images/vietnam.png' },
  ];

  const currentCredits = activeTab === 'domestic' ? domesticCredits : intlCredits;

  return (
    <section id="credits" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Credit Architecture <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Two credits," />
              <br /><span className="gold-shimmer"><KineticText text="zero risk." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber receives two types of credits - one for the thrill of the draw, one as your guaranteed safety net. Win or not, you always gain.</p>
          </div>
        </Reveal>

        {/* Three Columns including Holographic pass */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {credits.map((c, i) => (
            <Reveal key={c.type} delay={i * 0.15}>
              <TiltCard className="h-full" intensity={5}>
                <div className={`rounded-3xl p-8 border h-full tilt-inner flex flex-col relative overflow-hidden transition-all duration-500 ${c.accent === 'cyan' ? 'glass glass-glow-cyan border-[#18D7F2]/25 shadow-lg shadow-[#18D7F2]/5' : 'glass-gold glass-glow-gold border-[#F7B500]/25 shadow-lg shadow-[#F7B500]/5'}`}>
                  {/* Ambient soft background glow */}
                  <div className={`absolute -top-20 -left-20 w-44 h-44 rounded-full blur-[80px] pointer-events-none opacity-30 ${c.accent === 'cyan' ? 'bg-[#18D7F2]' : 'bg-[#F7B500]'}`} />

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <FloatingIcon delay={i * 0.5}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${c.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/40' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/40'}`}>
                        <c.icon className="w-8 h-8 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div>
                      <div className={`font-mono text-xs font-black tracking-widest ${c.accent === 'cyan' ? 'text-[#18D7F2]' : 'text-[#F7B500]'}`}>{c.type}</div>
                      <div className="font-display text-xl font-black text-white tracking-wide">{c.name}</div>
                    </div>
                  </div>

                  {/* Rule badge - Full Black and Stylish */}
                  <div className={`rounded-xl p-3 mb-5 border backdrop-blur-md relative z-10 ${c.accent === 'cyan' ? 'bg-[#18D7F2]/8 border-[#18D7F2]/20 text-[#18D7F2]' : 'bg-[#F7B500]/8 border-[#F7B500]/20 text-[#F7B500]'}`}>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="font-extrabold text-white tracking-tight">{c.rule}</span>
                    </div>
                  </div>

                  {/* Visual illustration slot */}
                  {c.type === 'TRC' ? (
                    /* Travel Reward Token Image */
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40 bg-slate-950 shrink-0">
                      {/* Sweeping glare reflection effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-card-shine pointer-events-none z-10" />
                      <img src="/images/lucky_draw_token.png" alt="Travel Reward Token" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-[2]" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-between z-[3]">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono tracking-widest text-[#18D7F2] font-black bg-slate-950/60 px-2 py-0.5 rounded border border-[#18D7F2]/30 shadow-md">
                            REWARD TOKEN
                          </span>
                          <span className="text-[#18D7F2] font-mono text-[9px] flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded border border-[#18D7F2]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#18D7F2] animate-pulse" /> active
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-mono text-xl tracking-widest mb-1 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            WEEKLY DRAW
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 font-bold">
                            <span>TRC UNIT</span>
                            <span>EXP: Sunday 8PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Discount Credit Voucher (CSS Holographic Card - Dark Premium) */
                    <div className="relative rounded-2xl overflow-hidden border border-[#F7B500]/30 group shadow-2xl mb-6 h-40 bg-gradient-to-br from-slate-900 via-[#0B1F2E] to-slate-950 flex flex-col justify-between p-5 shrink-0">
                      {/* Sweeping glare reflection effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-card-shine pointer-events-none z-10" />

                      {/* Ticket punch cuts */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#030C15] border-r border-[#F7B500]/25 z-20 pointer-events-none" />
                      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#030C15] border-l border-[#F7B500]/25 z-20 pointer-events-none" />
                      
                      {/* Ticket tear line */}
                      <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t border-dashed border-[#F7B500]/20 z-0 pointer-events-none" />

                      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-[#F7B500]/5 blur-xl pointer-events-none" />
                      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-teal-500/5 blur-xl pointer-events-none" />

                      <div className="flex justify-between items-start relative z-10">
                        <span className="text-[9px] font-mono tracking-widest text-[#F7B500] font-black bg-slate-950/60 px-2 py-0.5 rounded border border-[#F7B500]/30 shadow-md">
                          DISCOUNT VOUCHER
                        </span>
                        <span className="text-[#F7B500] font-mono text-[9px] font-bold flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded border border-[#F7B500]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F7B500] animate-pulse" /> redeemable
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-2 relative z-10">
                        <div className="text-left">
                          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Value</div>
                          <div className="text-3xl font-display font-black text-[#F7B500] tracking-tight leading-none drop-shadow-[0_0_8px_rgba(247,181,0,0.35)]">
                            ₹500
                          </div>
                        </div>
                        <div className="h-10 w-px border-l border-dashed border-slate-700/40" />
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Applicable on</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            Domestic Tours
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-semibold relative z-10 pt-2 border-t border-slate-800">
                        <span>SECURE CREDITS</span>
                        <span className="text-white/80">100% SECURED</span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-1 font-medium relative z-10">{c.desc}</p>

                  <ul className="space-y-2.5 pt-5 border-t border-slate-line relative z-10">
                    {c.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-slate-200 font-semibold">
                        <GoldCheck size={15} variant={c.accent === 'cyan' ? 'cyan' : 'gold'} />
                        <span className="text-slate-300 font-medium">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          {/* Third Column: Interactive Holographic Member Pass */}
          <Reveal delay={0.3}>
            <TiltCard className="h-full" intensity={5}>
              <div className="rounded-3xl p-8 border h-full tilt-inner flex flex-col justify-between overflow-hidden relative transition-all duration-500 border-teal-500/20 glass glass-glow-teal shadow-lg shadow-teal-500/5">
                {/* Ambient soft background glow */}
                <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full blur-[80px] pointer-events-none opacity-30 bg-[#00C7A3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan to-teal-deep shadow-lg shadow-cyan/20">
                      <Fingerprint className="w-8 h-8 text-cosmos" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-black tracking-widest text-[#00C7A3]">// BEDUINE DIGITAL PASS</div>
                      <div className="font-display text-xl font-black text-white tracking-wide">BEDUINE Member Pass</div>
                    </div>
                  </div>

                  {/* Digital Pass Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40 bg-slate-950 shrink-0">
                    {/* Sweeping glare reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-card-shine pointer-events-none z-10" />
                    
                    <img src="/images/credit_card_holographic_1779521713449.png" alt="Holographic Credit Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 z-[2]" />
                    
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-[3]">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono tracking-widest text-white font-black bg-slate-950/60 px-2 py-0.5 rounded border border-white/20 shadow-md">
                          MEMBER CLUB
                        </span>
                        
                        {/* Realistic Smart Chip */}
                        <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200/30 relative overflow-hidden flex flex-col justify-between p-1 shadow-md shadow-amber-500/20 opacity-90">
                          <div className="h-full w-full border-t border-b border-yellow-900/30 flex justify-between">
                            <div className="h-full w-[2px] bg-yellow-900/20" />
                            <div className="h-full w-[2px] bg-yellow-900/20" />
                            <div className="h-full w-[2px] bg-yellow-900/20" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-white font-mono text-base tracking-widest mb-1 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            BEDUINE PASS 2026
                          </div>
                          <div className="flex gap-4 text-[9px] font-mono text-slate-300">
                            <span>MEMBER PASS</span>
                            <span>EXP: 12 Months</span>
                          </div>
                        </div>
                        
                        {/* Barcode */}
                        <div className="flex gap-[1.5px] items-end h-5 opacity-60 shrink-0">
                          {[1.5, 3, 1, 4, 1.5, 2, 3, 1, 2.5, 1.5].map((w, index) => (
                            <div key={index} className="bg-white h-full" style={{ width: w }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium relative z-10">
                    Your virtual membership card stores your draw tokens and discount credits. Accessible instantly from your phone.
                  </p>
                </div>

                <div className="rounded-xl p-3.5 bg-slate-950/65 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300 font-semibold shadow-inner relative z-10">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan" /> Travel Reward Entry</span>
                  <div className="h-4 w-px bg-slate-800" />
                  <span className="text-[#00C7A3] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#00C7A3]" /> Guaranteed DC
                  </span>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>

        {/* Credit Comparison Table */}
        <Reveal>
          <div className="glass rounded-3xl p-6 lg:p-8 border border-slate-line mb-12">
            <div className="text-center mb-8">
              <div className="text-[11px] uppercase tracking-widest text-cyan font-semibold mb-2 font-mono">// Credit Allocation by Plan</div>
              <div className="font-display text-xl lg:text-2xl font-bold text-ink mb-6">What you get - guaranteed</div>

              {/* Premium Segmented Switcher */}
              <div className="inline-flex p-1 rounded-full bg-cosmos border border-slate-line/50 shadow-inner">
                <button
                  onClick={() => setActiveTab('domestic')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold font-display tracking-wider transition-all duration-300 ${activeTab === 'domestic' ? 'bg-gradient-to-r from-neon-gold to-gold text-white shadow-md' : 'text-ink/60 hover:text-ink'}`}
                >
                  Domestic Plans
                </button>
                <button
                  onClick={() => setActiveTab('intl')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold font-display tracking-wider transition-all duration-300 ${activeTab === 'intl' ? 'bg-gradient-to-r from-cyan to-cyan-deep text-white shadow-md' : 'text-ink/60 hover:text-ink'}`}
                >
                  International Plans
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-line">
                    <th className="py-3 px-4 text-left text-[10px] uppercase tracking-widest text-ink/50 font-mono">Plan</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-ink/50 font-mono">Price</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-cyan font-mono">LDC</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-cyan font-mono">Discount Credits</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-emerald-600 font-mono">Min Value</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCredits.map((r) => (
                    <tr key={r.plan} className="border-b border-slate-line/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.plan}
                              className="w-10 h-10 rounded-full object-cover border border-cyan/30 shadow-md shadow-cyan/10"
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center shadow-sm`}>
                              <Star className="w-4 h-4 text-white/80" />
                            </div>
                          )}
                          <span className="font-display font-bold text-ink">{r.plan}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-display font-bold text-ink">{r.price}</td>
                      <td className="py-4 px-4 text-center"><span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-xs font-semibold">{r.ldc}</span></td>
                      <td className="py-4 px-4 text-center"><span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-xs font-semibold">{r.dc}</span></td>
                      <td className="py-4 px-4 text-center font-display font-bold text-emerald-600">{r.total}</td>
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
                  "Every Sunday, BEDUINE runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
                </p>
              </div>
              <a href="#plans"><button className="px-8 py-4 bg-gradient-to-r from-neon-gold to-gold-deep text-cosmos font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"><Crown className="w-5 h-5" />Subscribe Now<ChevronRight className="w-5 h-5" /></button></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
