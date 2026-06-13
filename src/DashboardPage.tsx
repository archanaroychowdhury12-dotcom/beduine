import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Download, Crown, LogOut, Ticket, Calendar, Check, AlertCircle,
  MapPin, Star, Zap, Shield, TrendingUp, Clock, Users,
  ChevronRight, Phone, MoreVertical, User, Edit, Award, Heart,
  Megaphone, Lock, BarChart3
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
      const rand = Math.random();
      if (rand < 0.15) {
        setSimulationResult(`🎉 Congratulations! Selected for Kashmir (Platinum Tier)`);
      } else if (rand < 0.4) {
        setSimulationResult(`🏖️ Selected for Digha Weekend Escape (Silver Tier)`);
      } else {
        setSimulationResult(`💰 Draw trial finished: ₹500 Discount Credit guaranteed!`);
      }
    }, 2500);
  };

  const planName = user?.planName || 'Unsubscribed';
  const isSubscribed = planName && planName !== 'Unsubscribed' && planName !== '';
  const displayPlan = isSubscribed ? planName : 'No Active Plan';
  const voucherCount = planName?.toLowerCase()?.includes('platinum') ? 4 : planName?.toLowerCase()?.includes('gold') ? 2 : 1;

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Compass },
    { id: 'credits', label: 'Discount Credits', icon: CreditCard },
    { id: 'draws', label: 'Lucky Draw', icon: Ticket },
    { id: 'bookings', label: 'Book Travel', icon: Plane },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-10" style={{ background: 'linear-gradient(135deg, #eefcfb 0%, #f7f0ff 40%, #fff3ec 80%, #f0fdfa 100%)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* ═══ TOP NAV BAR ═══ */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ABAB5, #08979D)' }}>
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700 tracking-wide">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:block">{user?.fullName}</span>
            <Phone className="w-4 h-4 text-slate-400 cursor-pointer hover:text-teal-600 transition-colors" />
            <User className="w-4 h-4 text-slate-400 cursor-pointer hover:text-teal-600 transition-colors" />
            <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer hover:text-teal-600 transition-colors" />
          </div>
        </motion.div>

        {/* ═══ MAIN 3-COLUMN LAYOUT ═══ */}
        <div className="grid lg:grid-cols-[220px_1fr_280px] gap-5">

          {/* ──────── LEFT SIDEBAR ──────── */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-1.5 rounded-2xl p-4 shadow-sm border border-teal-100/50 h-fit sticky top-28"
            style={{ background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 253, 250, 0.9) 100%)', backdropFilter: 'blur(8px)' }}
          >
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-3 py-3 mb-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-teal-200 bg-white flex items-center justify-center p-1">
                <img src="/images/bedune_logo_cropped.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 tracking-tight block" style={{ color: '#0ABAB5' }}>BEDUINE</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-mono">Tour Tracker</span>
              </div>
            </div>

            {/* Nav Items */}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200 border-none text-sm ${
                    isActive 
                      ? 'font-bold text-white shadow-md' 
                      : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 bg-transparent'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #0ABAB5, #08979D)', boxShadow: '0 4px 15px rgba(10,186,181,0.3)' } : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Extra Nav */}
            <div className="border-t border-slate-100 mt-3 pt-3 space-y-1">
              {[
                { icon: Edit, label: 'Edit Profile' },
                { icon: Award, label: 'Loyalty Points' },
                { icon: Heart, label: 'Lucky Status' },
                { icon: Megaphone, label: 'Promoted' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={i} className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 border-none bg-transparent">
                    <Icon className="w-4 h-4" /> {item.label}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="w-full mt-4 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm font-bold text-red-400 hover:bg-red-50 border-none bg-transparent"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </motion.aside>

          {/* Mobile Tab Bar */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all text-xs font-bold border-none ${
                    isActive ? 'text-white shadow-md' : 'text-slate-500 bg-white'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #0ABAB5, #08979D)' } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </button>
              );
            })}
          </div>

          {/* ──────── MAIN CONTENT ──────── */}
          <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            
            {/* Profile Summary Card */}
            <div className="rounded-2xl shadow-sm border border-teal-100/40 p-6 mb-5" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 50%, #faf5ff 100%)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">Profile Summary</h2>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-[90px] h-[90px] rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #0ABAB5, #F7B500, #0ABAB5)' }}>
                    <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black uppercase" style={{ background: 'linear-gradient(135deg, #e0f7f6, #f0faf9)', color: '#0ABAB5' }}>
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md" style={{ background: '#0ABAB5' }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3 className="text-base font-bold text-slate-800">Verified Membership ID</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold border" style={{ borderColor: '#0ABAB5', color: '#0ABAB5' }}>
                      {displayPlan}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {['Active', 'Verified', 'Member'].map((tag, i) => (
                      <span key={i} className="text-xs text-slate-400">{tag}</span>
                    ))}
                    {isSubscribed && <span className="text-xs flex items-center gap-1" style={{ color: '#0ABAB5' }}><Heart className="w-3 h-3" /> Subscribed</span>}
                  </div>

                  <p className="text-xs font-bold text-slate-600 mb-0.5">Prized Subscription Plan ID</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{user?.email || user?.mobile} • Member ID: <strong className="text-slate-600 font-mono">{user?.memberId}</strong></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-slate-100/60">
                <button 
                  onClick={() => setActiveTab('credits')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.03] shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  💎 Loyalty Points
                </button>
                <button 
                  onClick={() => setActiveTab('credits')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold border border-teal-200 cursor-pointer transition-all hover:scale-[1.03] flex items-center gap-1.5 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)', color: '#08979D' }}
                >
                  <CreditCard className="w-3.5 h-3.5 text-teal-600" /> Discount Credits
                </button>
                <button 
                  onClick={() => setActiveTab('draws')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.03] shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
                >
                  🎰 Lucky Draw
                </button>
              </div>
            </div>

            {/* ═══ TAB CONTENT ═══ */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >

                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Upcoming Trips Progress */}
                    <div className="rounded-2xl shadow-sm border border-teal-100/40 p-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" style={{ color: '#0ABAB5' }} /> Upcoming Trips
                        </h3>
                        <span className="text-xs text-slate-400">Your travel journey</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-black text-slate-800">{isSubscribed ? 1 : 0}</span>
                        <span className="text-sm text-slate-400">/ 4 quarterly trips</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">Your current tier: <strong style={{ color: '#0ABAB5' }}>{displayPlan}</strong> — Earn miles on every booking</p>
                      {/* Progress Bar */}
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-4">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: isSubscribed ? '25%' : '5%' }}
                          transition={{ duration: 1.2, delay: 0.3 }}
                          className="h-full rounded-full" 
                          style={{ background: 'linear-gradient(90deg, #F7B500, #0ABAB5)' }} 
                        />
                      </div>
                      {/* Quick Action Buttons */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Manage Booking', icon: Calendar },
                          { label: 'Add Guest', icon: Users },
                          { label: 'View Itinerary', icon: MapPin },
                        ].map((btn, i) => {
                          const Icon = btn.icon;
                          return (
                            <a key={i} href="https://wa.me/918768903565" target="_blank" rel="noreferrer"
                              className="p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-teal-700 cursor-pointer no-underline"
                            >
                              <Icon className="w-3.5 h-3.5" /> {btn.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Plan Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Plan Tier', value: displayPlan, icon: Crown, color: '#F7B500', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: 'border-amber-100' },
                        { label: 'Plan Status', value: isSubscribed ? 'Active' : 'Inactive', icon: Shield, color: '#10b981', bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: 'border-emerald-100' },
                        { label: 'Draw Token', value: user?.drawToken || 'N/A', icon: Ticket, color: '#0ABAB5', bg: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)', border: 'border-teal-100' },
                      ].map((card, i) => {
                        const Icon = card.icon;
                        return (
                          <div key={i} className={`rounded-2xl border ${card.border} shadow-sm p-5 relative overflow-hidden`} style={{ background: card.bg }}>
                            <div className="absolute top-3 right-3 opacity-20"><Icon className="w-10 h-10" style={{ color: card.color }} /></div>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono block">{card.label}</span>
                            <span className="text-lg font-bold text-slate-800 block mt-1">{card.value}</span>
                            <span className="text-[10px] block mt-1" style={{ color: card.color }}>● Active</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Actions & Digital Ticket */}
                    <div className="rounded-2xl shadow-sm border border-violet-100/50 p-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)' }}>
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: '#F7B500' }} /> Quick Actions & Vouchers
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { title: 'Discount Voucher', desc: '₹500 vouchers for paid trips', icon: Gift, color: '#10b981' },
                          { title: 'Name Change Policy', desc: 'Platinum: unlimited family adjustments', icon: Users, color: '#8b5cf6' },
                          { title: 'Quarterly Tours', desc: 'Curated destinations each cycle', icon: MapPin, color: '#0ABAB5' },
                          { title: 'ROI Guarantee', desc: '100% voucher safety net', icon: TrendingUp, color: '#F7B500' },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}15` }}>
                                <Icon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <div>
                                <span className="text-xs font-semibold text-slate-700 block">{item.title}</span>
                                <span className="text-[10px] text-slate-400">{item.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Digital Ticket */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#0ABAB515' }}>
                            <Download className="w-4 h-4" style={{ color: '#0ABAB5' }} />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">Digital Boarding Ticket</span>
                            <span className="text-[10px] text-slate-400">Keep for checkout confirmation</span>
                          </div>
                        </div>
                        <button onClick={() => window.print()} className="px-4 py-2 rounded-lg border border-teal-200 hover:border-teal-400 text-xs font-bold text-teal-700 hover:text-teal-900 transition-all cursor-pointer shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa, #ccfbf1)' }}>
                          Download
                        </button>
                      </div>
                    </div>

                    {/* Membership Footer */}
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" style={{ color: '#F7B500' }} /> Beduine Travel Membership
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                )}

                {/* ── CREDITS ── */}
                {activeTab === 'credits' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl shadow-sm border border-teal-100/40 p-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}>
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                        <CreditCard className="w-5 h-5" style={{ color: '#0ABAB5' }} /> My Discount Credits
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Guaranteed value recovery — redeem on paid tours</p>

                      {/* Balance */}
                      <div className="rounded-2xl p-6 text-center mb-5 border" style={{ background: 'linear-gradient(135deg, #ccfbf1 0%, #e0f2fe 100%)', borderColor: '#99f6e4' }}>
                        <span className="text-[10px] uppercase tracking-wider font-mono block text-teal-700 font-bold">TOTAL WALLET BALANCE</span>
                        <span className="text-4xl font-black block mt-1 text-teal-800">₹{voucherCount * 500}</span>
                        <span className="text-xs text-slate-500 mt-1 block">Available for paid bookings</span>
                      </div>

                      {/* Voucher Cards */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        {Array.from({ length: voucherCount }).map((_, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className="p-5 rounded-2xl border border-teal-100/50 shadow-sm hover:shadow-md hover:border-teal-300 transition-all relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}
                          >
                            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20" style={{ background: '#0ABAB5' }} />
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                                  <Zap className="w-3 h-3" /> ACTIVE
                                </span>
                                <div className="text-2xl font-black text-slate-800 mt-2">₹500</div>
                              </div>
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fef3c7' }}>
                                <Gift className="w-4 h-4" style={{ color: '#d97706' }} />
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                              <span className="text-slate-400">Code: <strong className="font-mono text-slate-600">BDN-{idx + 1}04</strong></span>
                              <span className="font-bold flex items-center gap-1" style={{ color: '#10b981' }}><Check className="w-3 h-3" /> Unused</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl text-xs flex items-start gap-2" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                        <span className="text-amber-700"><strong>Redemption:</strong> 1 voucher (₹500) per person per booking. Valid 12 months.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DRAWS ── */}
                {activeTab === 'draws' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl shadow-sm border border-violet-100/40 p-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)' }}>
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                        <Ticket className="w-5 h-5" style={{ color: '#0ABAB5' }} /> Lucky Draw Status
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Transparent digital draws — view entries & simulate</p>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Token Card */}
                        <div className="p-5 rounded-2xl border border-teal-100 space-y-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #f0fdfa, #e0f2fe)' }}>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-bold">ACTIVE DRAW TOKEN</span>
                            <span className="text-2xl font-black tracking-widest font-mono mt-1 block text-teal-800">{user?.drawToken || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 border-t border-teal-200/50 pt-3">
                            <span>Upcoming Draw:</span>
                            <span className="font-bold text-teal-700 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-teal-600" /> Next Sunday
                            </span>
                          </div>
                          <div className="text-[10px] leading-relaxed p-3 rounded-xl" style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309' }}>
                            ⚠️ <strong>Note:</strong> Draws are 100% transparent. Winners travel free. Non-selected retain full voucher credits.
                          </div>
                        </div>

                        {/* Simulator */}
                        <div className="p-5 rounded-2xl border-2 border-dashed flex flex-col justify-between" style={{ borderColor: '#a78bfa', background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)' }}>
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-purple-600" /> RNG Test Simulator
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">Simulate a mock draw to see how our system works</p>
                          </div>
                          <div className="my-4 min-h-[55px] flex items-center justify-center">
                            {isSimulatingDraw ? (
                              <div className="flex flex-col items-center gap-2 text-xs font-mono" style={{ color: '#0ABAB5' }}>
                                <Compass className="w-7 h-7 animate-spin" />
                                <span className="animate-pulse">GENERATING...</span>
                              </div>
                            ) : simulationResult ? (
                              <div className="text-center p-3 rounded-xl text-xs font-semibold leading-relaxed bg-white border border-slate-100 text-slate-700 shadow-sm">
                                {simulationResult}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300">Ready to simulate</span>
                            )}
                          </div>
                          <button onClick={handleSimulateDraw} disabled={isSimulatingDraw}
                            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer text-white border-none transition-all hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #0ABAB5, #08979D)' }}
                          >
                            ✨ Launch Mock Draw
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── BOOKINGS ── */}
                {activeTab === 'bookings' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl shadow-sm border border-teal-100/40 p-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)' }}>
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                        <Plane className="w-5 h-5" style={{ color: '#0ABAB5' }} /> Book Your Travel
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Submit requests and apply discount vouchers</p>

                      <p className="text-sm text-slate-500 leading-relaxed mb-5">
                        Choose from <strong className="text-slate-700">Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand</strong> — vouchers applied automatically.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20want%20to%20book%20a%20tour%20package%20using%20my%20member%20discount%20vouchers." 
                          target="_blank" rel="noreferrer"
                          className="p-5 rounded-2xl border border-slate-100 hover:border-teal-300 hover:shadow-md transition-all flex items-center justify-between group no-underline"
                          style={{ background: 'linear-gradient(135deg, #f0faf9, #ffffff)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#10b98115' }}>
                              <Plane className="w-5 h-5" style={{ color: '#10b981' }} />
                            </div>
                            <div>
                              <span className="block text-sm font-bold text-slate-700">Book Paid Tour</span>
                              <span className="block text-[10px] text-slate-400">Apply vouchers to save</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                        </a>

                        <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20have%20questions%20about%20the%20upcoming%20Sunday%20lucky%20draw%20schedule."
                          target="_blank" rel="noreferrer"
                          className="p-5 rounded-2xl border border-slate-100 hover:border-teal-300 hover:shadow-md transition-all flex items-center justify-between group no-underline"
                          style={{ background: 'linear-gradient(135deg, #f5f3ff, #ffffff)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#8b5cf615' }}>
                              <Ticket className="w-5 h-5" style={{ color: '#8b5cf6' }} />
                            </div>
                            <div>
                              <span className="block text-sm font-bold text-slate-700">Draw Support</span>
                              <span className="block text-[10px] text-slate-400">Inquire about rules</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.main>

          {/* ──────── RIGHT SIDEBAR: UPCOMING TRIPS ──────── */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="hidden lg:flex flex-col gap-5"
          >
            {/* Trip Card 1 */}
            <div className="rounded-2xl shadow-sm border border-sky-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h4 className="text-sm font-bold text-slate-700 font-sans">Upcoming Trip</h4>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-xl overflow-hidden h-[150px] relative group cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80" 
                    alt="Mountain destination" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg backdrop-blur-md bg-black/40 border border-white/15">
                    <span className="text-white text-xs font-bold block">Kashmir Valley</span>
                    <span className="text-[9px] text-white/75 block">Next scheduled departure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Card 2 */}
            <div className="rounded-2xl shadow-sm border border-orange-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)' }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h4 className="text-sm font-bold text-slate-700 font-sans">Upcoming Trip</h4>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-xl overflow-hidden h-[150px] relative group cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" 
                    alt="Beach destination" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg backdrop-blur-md bg-black/40 border border-white/15">
                    <span className="text-white text-xs font-bold block">Puri Beach</span>
                    <span className="text-[9px] text-white/75 block">Popular weekend getaway</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Card */}
            <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0ABAB5 0%, #6366f1 50%, #d946ef 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}>
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
              <Crown className="w-6 h-6 text-white/90 mx-auto mb-2 relative z-10" />
              <h4 className="text-sm font-bold text-white mb-1 relative z-10">Beduine Elite Member</h4>
              <p className="text-[10px] text-white/85 leading-relaxed relative z-10">Exclusive travel benefits, transparent lucky draws & guaranteed vouchers</p>
              <div className="mt-3 w-full h-1 rounded-full bg-white/20 overflow-hidden relative z-10">
                <div className="h-full w-1/2 rounded-full bg-white/80" />
              </div>
            </div>
          </motion.aside>

        </div>
      </div>
    </div>
  );
}
