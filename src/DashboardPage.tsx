import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Download, Crown, LogOut, Ticket, Calendar, Check, AlertCircle,
  MapPin, Star, Zap, Shield, TrendingUp, Clock, Users
} from 'lucide-react';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'draws' | 'bookings'>('overview');
  const [isSimulatingDraw, setIsSimulatingDraw] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleSimulateDraw = () => {
    setIsSimulatingDraw(true);
    setSimulationResult(null);
    setTimeout(() => {
      setIsSimulatingDraw(false);
      // Random result simulation
      const rand = Math.random();
      if (rand < 0.15) {
        setSimulationResult(`🎉 Congratulations! Selected for Kashmir (Platinum Tier)`);
      } else if (rand < 0.4) {
        setSimulationResult(`🏖️ Selected for Digha Weekend Escape (Silver Tier)`);
      } else {
        setSimulationResult(`💰 Draw trial finished: ₹500 Discount Credit guaranteed in account!`);
      }
    }, 2500);
  };

  const planName = user?.planName || 'Unsubscribed';
  const isSubscribed = planName && planName !== 'Unsubscribed' && planName !== '';
  const displayPlan = isSubscribed ? planName : 'No Active Plan';

  return (
    <div className="min-h-screen pt-24 lg:pt-28 pb-20 relative text-ink px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #0B1120 0%, #0D1B2A 30%, #1B2838 60%, #0B1120 100%)' }}>
      
      {/* Decorative Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan/20 via-blue-500/10 to-transparent rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-violet/15 via-purple-500/10 to-transparent rounded-full filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-neon-gold/8 via-orange-500/5 to-transparent rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ═══════════════ TOP WELCOME BANNER ═══════════════ */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-6 lg:p-8 mb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(24,215,242,0.15) 0%, rgba(139,92,246,0.12) 50%, rgba(247,181,0,0.1) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Animated shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none" style={{ animationDuration: '3s' }} />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {/* Avatar with gradient ring */}
              <div className="relative">
                <div className="w-[72px] h-[72px] rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #18D7F2, #8B5CF6, #F7B500)' }}>
                  <div className="w-full h-full rounded-full bg-[#0D1B2A] flex items-center justify-center text-white text-2xl font-black uppercase">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0D1B2A] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">{user?.fullName}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-mono">
                    <Shield className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                <p className="text-sm text-white/50 font-mono mt-0.5">{user?.email || user?.mobile}</p>
                <p className="text-[10px] text-white/30 mt-1 font-mono">Member since {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-5 py-3 rounded-2xl text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(247,181,0,0.15), rgba(247,181,0,0.05))', border: '1px solid rgba(247,181,0,0.2)' }}>
                <span className="block text-[8px] uppercase tracking-wider text-neon-gold/70 font-mono">MEMBERSHIP ID</span>
                <span className="text-sm font-black text-neon-gold font-mono tracking-wider">{user?.memberId}</span>
              </div>
              <button 
                onClick={onLogout}
                className="px-5 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════ QUICK STATS CARDS ═══════════════ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Plan Tier', value: displayPlan, sub: isSubscribed ? 'Active' : 'Subscribe Now', icon: Crown, gradient: 'from-amber-500/20 via-orange-500/10 to-transparent', borderColor: 'border-amber-500/20', iconColor: 'text-amber-400', valueColor: 'text-amber-300' },
            { label: 'Draw Token', value: user?.drawToken || 'N/A', sub: 'Next: Sunday', icon: Ticket, gradient: 'from-cyan/20 via-blue-500/10 to-transparent', borderColor: 'border-cyan/20', iconColor: 'text-cyan', valueColor: 'text-cyan' },
            { label: 'Voucher Credits', value: isSubscribed ? `₹${(planName?.toLowerCase()?.includes('platinum') ? 4 : planName?.toLowerCase()?.includes('gold') ? 2 : 1) * 500}` : '₹0', sub: 'Redeemable', icon: Gift, gradient: 'from-emerald-500/20 via-green-500/10 to-transparent', borderColor: 'border-emerald-500/20', iconColor: 'text-emerald-400', valueColor: 'text-emerald-400' },
            { label: 'Validity', value: '12 Months', sub: 'From activation', icon: Clock, gradient: 'from-violet/20 via-purple-500/10 to-transparent', borderColor: 'border-violet/20', iconColor: 'text-violet', valueColor: 'text-violet' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} backdrop-blur-sm hover:scale-[1.03] transition-transform cursor-default`}
              >
                <div className="absolute top-3 right-3 opacity-20">
                  <Icon className={`w-10 h-10 ${stat.iconColor}`} />
                </div>
                <span className="text-[9px] uppercase tracking-wider text-white/40 font-mono block">{stat.label}</span>
                <span className={`text-lg font-black ${stat.valueColor} mt-1 block tracking-tight`}>{stat.value}</span>
                <span className="text-[10px] text-white/40 block mt-1">{stat.sub}</span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══════════════ MAIN LAYOUT: SIDEBAR + CONTENT ═══════════════ */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Tabs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 shrink-0"
          >
            {[
              { id: 'overview', label: 'Dashboard', icon: Compass, color: 'from-cyan to-blue-500' },
              { id: 'credits', label: 'Discount Credits', icon: CreditCard, color: 'from-emerald-400 to-green-500' },
              { id: 'draws', label: 'Lucky Draw', icon: Ticket, color: 'from-violet to-purple-500' },
              { id: 'bookings', label: 'Book Travel', icon: Plane, color: 'from-amber-400 to-orange-500' },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer whitespace-nowrap lg:whitespace-normal relative overflow-hidden ${
                    isActive 
                      ? 'border-white/15 text-white font-bold shadow-lg' 
                      : 'bg-white/3 border-white/5 text-white/60 hover:bg-white/5 hover:border-white/10 hover:text-white/80'
                  }`}
                  style={isActive ? { background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))` } : undefined}
                >
                  {isActive && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${tab.color} rounded-r-full`} />
                  )}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? `bg-gradient-to-br ${tab.color} shadow-md` : 'bg-white/5'}`}>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50'}`} />
                  </div>
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}

            {/* Promo Card */}
            <div className="hidden lg:block mt-4 p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(24,215,242,0.15), rgba(247,181,0,0.1))', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Star className="w-5 h-5 text-neon-gold mb-2" />
              <h4 className="text-xs font-bold text-white mb-1">Upgrade Your Plan</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">Unlock more destinations, extra vouchers & priority draws.</p>
              <div className="mt-3 w-full h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan to-violet" />
              </div>
            </div>
          </motion.div>

          {/* Content Panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/8 p-6 lg:p-8 shadow-2xl relative overflow-hidden"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
              >
                
                {/* ═══ 1. OVERVIEW TAB ═══ */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
                        Active Subscription
                      </h2>
                      <p className="text-xs text-white/40 mt-1 ml-10">Your current Beduine membership plan and benefits.</p>
                    </div>

                    {/* Plan Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(247,181,0,0.12), rgba(247,181,0,0.04))', border: '1px solid rgba(247,181,0,0.15)' }}>
                        <div className="absolute top-3 right-3 opacity-15"><Crown className="w-12 h-12 text-neon-gold" /></div>
                        <span className="text-[9px] uppercase tracking-wider text-neon-gold/60 font-mono block">PLAN TIER</span>
                        <span className="text-lg font-black text-neon-gold mt-1 block uppercase">{displayPlan}</span>
                        <span className="text-[10px] text-white/40 block mt-1 font-semibold uppercase">{user?.planType === 'domestic' ? 'Domestic (India)' : user?.planType === 'international' ? 'International' : '—'}</span>
                      </div>

                      <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-400/60 font-mono block">PLAN STATUS</span>
                        <span className="text-lg font-black text-emerald-400 mt-1 block">{isSubscribed ? 'Active' : 'Inactive'}</span>
                        <span className="text-[10px] text-white/40 block mt-1">Expires: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>

                      <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(24,215,242,0.12), rgba(24,215,242,0.04))', border: '1px solid rgba(24,215,242,0.15)' }}>
                        <span className="text-[9px] uppercase tracking-wider text-cyan/60 font-mono block">DRAW ENTRIES</span>
                        <span className="text-lg font-black text-cyan mt-1 block">{isSubscribed ? '1 Token' : 'None'}</span>
                        <span className="text-[10px] text-cyan/60 block mt-1 font-mono tracking-wider">{user?.drawToken || '—'}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(24,215,242,0.06))', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-neon-gold" /> Quick Actions & Vouchers</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { title: 'Discount Voucher Credit', desc: '₹500 vouchers credited to your wallet for paid trips.', icon: Gift, color: 'text-emerald-400' },
                          { title: 'Name Change Policy', desc: 'Platinum plans support unlimited family name adjustments.', icon: Users, color: 'text-violet' },
                          { title: 'Quarterly Tours', desc: 'Batched travel cycles with curated destinations.', icon: MapPin, color: 'text-cyan' },
                          { title: 'ROI Guarantee', desc: 'Non-winners get full voucher value — 100% safety net.', icon: TrendingUp, color: 'text-neon-gold' },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                <Icon className={`w-4 h-4 ${item.color}`} />
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-white/90 block">{item.title}</span>
                                <span className="text-[10px] text-white/40 leading-relaxed">{item.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Digital Ticket */}
                    <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1" style={{ background: 'linear-gradient(135deg, rgba(24,215,242,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Digital Boarding Ticket</h4>
                          <p className="text-xs text-white/40">Keep your ticket for confirmation at checkout.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-white/80 font-bold flex items-center gap-1.5 transition-colors cursor-pointer hover:border-cyan/30"
                      >
                        <Download className="w-4 h-4" /> Download Ticket
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══ 2. CREDITS TAB ═══ */}
                {activeTab === 'credits' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"><CreditCard className="w-4 h-4 text-white" /></div>
                        My Discount Credits
                      </h2>
                      <p className="text-xs text-white/40 mt-1 ml-10">Guaranteed value recovery — redeem vouchers on paid tour packages.</p>
                    </div>

                    {/* Total Balance */}
                    <div className="p-6 rounded-2xl text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(24,215,242,0.1))', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400/60 font-mono">TOTAL WALLET BALANCE</span>
                      <div className="text-4xl font-black text-emerald-400 mt-1">₹{(planName?.toLowerCase()?.includes('platinum') ? 4 : planName?.toLowerCase()?.includes('gold') ? 2 : 1) * 500}</div>
                      <span className="text-xs text-white/40 mt-1 block">Available for redemption on paid bookings</span>
                    </div>

                    {/* Vouchers Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Array.from({ length: user?.planName?.toLowerCase()?.includes('platinum') ? 4 : user?.planName?.toLowerCase()?.includes('gold') ? 2 : 1 }).map((_, idx) => (
                        <motion.div 
                          key={idx} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-5 rounded-2xl relative overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
                          style={{ background: 'linear-gradient(135deg, rgba(24,215,242,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-[9px] text-emerald-400 font-mono font-semibold uppercase">
                                <Zap className="w-3 h-3" /> ACTIVE VOUCHER
                              </span>
                              <div className="text-2xl font-black text-white mt-2">₹500</div>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-gold/20 to-amber-500/10 flex items-center justify-center">
                              <Gift className="w-5 h-5 text-neon-gold" />
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                            <span className="text-white/40">Code: <strong className="font-mono text-white/80">BDN-VOUCH-{idx + 1}04</strong></span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Unused</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl text-xs flex items-start gap-2" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)' }}>
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div className="text-amber-300/80">
                        <strong>Redemption Rule:</strong> 1 voucher (₹500) can be redeemed per person per paid tour booking. Credits valid for 12 months.
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ 3. DRAWS TAB ═══ */}
                {activeTab === 'draws' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-purple-500 flex items-center justify-center"><Ticket className="w-4 h-4 text-white" /></div>
                        Lucky Draw Status
                      </h2>
                      <p className="text-xs text-white/40 mt-1 ml-10">View your entries and participate in transparent digital draws.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Token Card */}
                      <div className="p-5 rounded-2xl space-y-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(24,215,242,0.08))', border: '1px solid rgba(139,92,246,0.15)' }}>
                        <div>
                          <span className="text-[10px] text-white/40 uppercase font-mono tracking-wider block">ACTIVE DRAW TOKEN</span>
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan via-violet to-neon-gold tracking-widest font-mono mt-1 block">{user?.drawToken || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-white/60 border-t border-white/5 pt-3">
                          <span>Upcoming Draw:</span>
                          <span className="font-semibold text-white flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-cyan" /> Next Sunday
                          </span>
                        </div>
                        
                        <div className="text-[10px] leading-relaxed p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.1)', color: 'rgba(251,191,36,0.8)' }}>
                          ⚠️ <strong>Please Note:</strong> Draws are 100% transparent and verified. Winners travel free. Non-selected retain full voucher credits.
                        </div>
                      </div>

                      {/* Draw Simulator */}
                      <div className="p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(24,215,242,0.08), rgba(139,92,246,0.06))', border: '1px solid rgba(24,215,242,0.15)' }}>
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-violet/5 rounded-full blur-xl pointer-events-none" />
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-1"><Sparkles className="w-4 h-4 text-neon-gold" /> RNG Test Simulator</h3>
                          <p className="text-[11px] text-white/40 mt-1">Simulate a mock draw to see how our verified system operates.</p>
                        </div>

                        <div className="my-4 min-h-[60px] flex items-center justify-center">
                          {isSimulatingDraw ? (
                            <div className="flex flex-col items-center gap-2 text-xs text-cyan font-mono">
                              <Compass className="w-8 h-8 animate-spin text-cyan" />
                              <span className="animate-pulse">GENERATING MOCK DRAW...</span>
                            </div>
                          ) : simulationResult ? (
                            <div className="text-center p-3 rounded-xl text-xs text-white font-semibold leading-relaxed" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              {simulationResult}
                            </div>
                          ) : (
                            <span className="text-xs text-white/30">Ready to test simulator</span>
                          )}
                        </div>

                        <button
                          onClick={handleSimulateDraw}
                          disabled={isSimulatingDraw}
                          className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-[1.02] text-white"
                          style={{ background: 'linear-gradient(135deg, #8B5CF6, #18D7F2)' }}
                        >
                          ✨ Launch Mock Draw
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══ 4. BOOKINGS TAB ═══ */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-black text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Plane className="w-4 h-4 text-white" /></div>
                        Book Your Travel
                      </h2>
                      <p className="text-xs text-white/40 mt-1 ml-10">Submit a tour package request and apply your discount wallet credits.</p>
                    </div>

                    <div className="p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-sm text-white/60 leading-relaxed">
                        Choose from our curated packages — <strong className="text-white/80">Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand</strong> — and our agents will apply your active member vouchers automatically to reduce costs.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <a 
                          href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20want%20to%20book%20a%20tour%20package%20using%20my%20member%20discount%20vouchers." 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-4 rounded-xl flex items-center justify-between group transition-all hover:scale-[1.02]"
                          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.15)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                              <Plane className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="text-left">
                              <span className="block text-xs font-bold text-white">Book Paid Tour</span>
                              <span className="block text-[10px] text-white/40">Apply vouchers to save</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                        </a>

                        <a 
                          href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20have%20questions%20about%20the%20upcoming%20Sunday%20lucky%20draw%20schedule." 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-4 rounded-xl flex items-center justify-between group transition-all hover:scale-[1.02]"
                          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.04))', border: '1px solid rgba(139,92,246,0.15)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet/15 flex items-center justify-center">
                              <Ticket className="w-5 h-5 text-violet" />
                            </div>
                            <div className="text-left">
                              <span className="block text-xs font-bold text-white">Draw Support Info</span>
                              <span className="block text-[10px] text-white/40">Inquire about rules</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-violet group-hover:translate-x-1 transition-all" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
