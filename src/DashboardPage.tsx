import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Download, Crown, LogOut, Ticket, Calendar, Check, AlertCircle,
  MapPin, Star, Zap, Shield, TrendingUp, Clock, Users,
  ChevronRight, Phone, MoreVertical, User, Edit, Award, Heart,
  Lock, BarChart3
} from 'lucide-react';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'draws' | 'bookings' | 'edit-profile' | 'lucky-status'>('overview');
  const [isSimulatingDraw, setIsSimulatingDraw] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const [profileName, setProfileName] = useState(user?.fullName || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(user?.avatar || null);

  // Edit states (to commit only on Save)
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editMobile, setEditMobile] = useState(user?.mobile || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');

  // Error states
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; mobile?: string } = {};
    
    // Name validation
    if (!editName.trim()) {
      newErrors.name = 'Full name is required';
    } else if (editName.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(editEmail.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!editMobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(editMobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      setProfileName(editName);
      setProfileEmail(editEmail);
      setProfileMobile(editMobile);
      setProfileAddress(editAddress);
      alert('✅ Profile details updated successfully!');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('❌ Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="min-h-screen pt-20 lg:pt-24 pb-10" style={{ backgroundColor: '#F7F3ED' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* ═══ TOP NAV BAR ═══ */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}>
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide" style={{ color: '#1E3147' }}>Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block font-bold" style={{ color: '#1E3147' }}>{profileName}</span>
            <Phone className="w-4 h-4 cursor-pointer hover:text-[#138A8A] transition-colors" style={{ color: '#5F6E7E' }} />
            <User className="w-4 h-4 cursor-pointer hover:text-[#138A8A] transition-colors" style={{ color: '#5F6E7E' }} />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-[#138A8A] transition-colors" style={{ color: '#5F6E7E' }} />
          </div>
        </motion.div>

        {/* ═══ MAIN 3-COLUMN LAYOUT ═══ */}
        <div className="grid lg:grid-cols-[220px_1fr_280px] gap-5">

          {/* ──────── LEFT SIDEBAR ──────── */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-1.5 rounded-2xl p-4 shadow-sm border h-fit sticky top-28"
            style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF', backdropFilter: 'blur(8px)' }}
          >
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-3 py-3 mb-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden border bg-white flex items-center justify-center p-1" style={{ borderColor: '#E7DCCF' }}>
                <img src="/images/bedune_logo_cropped.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight block animate-pulse" style={{ color: '#138A8A' }}>BEDUINE</span>
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
                      ? 'font-bold text-white shadow-sm' 
                      : 'font-medium hover:bg-[#F7F3ED] bg-transparent'
                  }`}
                  style={{
                    backgroundColor: isActive ? '#138A8A' : 'transparent',
                    color: isActive ? '#FAF2E6' : '#5F6E7E'
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? '#FAF2E6' : '#5F6E7E' }} />
                  {item.label}
                </button>
              );
            })}

            {/* Extra Nav */}
            <div className="border-t mt-3 pt-3 space-y-1" style={{ borderColor: '#E7DCCF' }}>
              {[
                { id: 'edit-profile', icon: Edit, label: 'Edit Profile' },
                { id: 'lucky-status', icon: Heart, label: 'Lucky Status' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className="w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm font-medium border-none"
                    style={{
                      backgroundColor: isActive ? '#138A8A' : 'transparent',
                      color: isActive ? '#FAF2E6' : '#5F6E7E'
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? '#FAF2E6' : '#5F6E7E' }} /> {item.label}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="w-full mt-4 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm font-bold border-none bg-transparent hover:bg-red-50/50"
              style={{ color: '#D66A5D' }}
            >
              <LogOut className="w-4 h-4" style={{ color: '#D66A5D' }} /> Log Out
            </button>

            {/* Sidebar Featured Destination Banner */}
            <div className="mt-4 p-1">
              <div className="rounded-xl overflow-hidden relative group cursor-pointer border border-[#E7DCCF] h-[105px] shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80" 
                  alt="Dubai Marina" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-2.5" style={{ background: 'linear-gradient(to top, rgba(30,49,71,0.85) 0%, rgba(30,49,71,0.15) 100%)' }}>
                  <span className="text-[8px] text-[#C89C53] uppercase tracking-widest font-black font-mono">Next Week Draw</span>
                  <span className="text-white text-xs font-bold leading-tight">Dubai Marina Sands</span>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Mobile Tab Bar */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-2">
            {[
              ...sidebarItems,
              { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
              { id: 'lucky-status', label: 'Lucky Status', icon: Heart },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all text-xs font-bold border-none ${
                    isActive ? 'text-white shadow-sm' : 'text-slate-500 bg-white'
                  }`}
                  style={isActive ? { background: 'linear-gradient(135deg, #138A8A, #0E6F70)' } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </button>
              );
            })}
          </div>

          {/* ──────── MAIN CONTENT ──────── */}
          <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            
            {/* Profile Summary Card */}
            <div className="rounded-2xl shadow-sm border p-6 mb-5" style={{ backgroundColor: '#E6D1B1', borderColor: '#E7DCCF' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold" style={{ color: '#1E3147' }}>Profile Summary</h2>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-[90px] h-[90px] rounded-full p-[3px]" style={{ background: 'linear-gradient(135deg, #138A8A, #C89C53, #138A8A)' }}>
                    {profileAvatar ? (
                      <img 
                        src={profileAvatar} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black uppercase" style={{ background: '#F7F3ED', color: '#1E3147' }}>
                        {profileName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse" style={{ background: '#138A8A' }}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3 className="text-base font-bold" style={{ color: '#1E3147' }}>Verified Membership ID</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold border" style={{ backgroundColor: '#F3E7D3', borderColor: '#C89C53', color: '#6E542C' }}>
                      {displayPlan}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {['Active', 'Verified', 'Member'].map((tag, i) => (
                      <span key={i} className="text-xs font-semibold" style={{ color: '#5F6E7E' }}>{tag}</span>
                    ))}
                    {isSubscribed && <span className="text-xs flex items-center gap-1 font-bold" style={{ color: '#138A8A' }}><Heart className="w-3 h-3" /> Subscribed</span>}
                  </div>

                  <p className="text-xs font-bold mb-0.5" style={{ color: '#1E3147' }}>Prized Subscription Plan ID</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#5F6E7E' }}>{profileEmail || profileMobile} • Member ID: <strong className="font-mono text-slate-800">{user?.memberId}</strong></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t" style={{ borderColor: '#E7DCCF' }}>
                <button 
                  onClick={() => setActiveTab('credits')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold border cursor-pointer transition-all hover:scale-[1.03] flex items-center gap-1.5 shadow-sm bg-white"
                  style={{ borderColor: '#E7DCCF', color: '#1E3147' }}
                >
                  <CreditCard className="w-3.5 h-3.5" style={{ color: '#138A8A' }} /> Discount Credits
                </button>
                <button 
                  onClick={() => setActiveTab('draws')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.03] shadow-md"
                  style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}
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
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
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
                          style={{ background: 'linear-gradient(90deg, #C89C53, #138A8A)' }} 
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
                        { label: 'Plan Tier', value: displayPlan, icon: Crown, color: '#C89C53', bg: '#FAF2E6', border: 'border-[#E7DCCF]' },
                        { label: 'Plan Status', value: isSubscribed ? 'Active' : 'Inactive', icon: Shield, color: '#138A8A', bg: '#FAF2E6', border: 'border-[#E7DCCF]' },
                        { label: 'Draw Token', value: user?.drawToken || 'N/A', icon: Ticket, color: '#138A8A', bg: '#FAF2E6', border: 'border-[#E7DCCF]' },
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
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
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
                        <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-white text-xs font-bold transition-all cursor-pointer shadow-md hover:scale-[1.03] border-none" style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}>
                          Download
                        </button>
                      </div>
                    </div>

                    {/* Destination Gallery */}
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
                      <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: '#1E3147' }}>
                        <Plane className="w-4 h-4" style={{ color: '#138A8A' }} /> Explore Subscribed Destinations
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">Subscriber-favorite travel highlights included in your lucky draw entries</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Kashmir Valley', desc: 'Misty Pines & Houseboats', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Darjeeling Hills', desc: 'Tea Gardens & Toy Train', img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Puri Golden Beach', desc: 'Sun Temples & Waves', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Sundarbans Forest', desc: 'Royal Mangrove Safari', img: 'https://images.unsplash.com/photo-1627581176214-cb985ea846fa?auto=format&fit=crop&w=300&q=80' },
                        ].map((dest, i) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-[#E7DCCF] relative group cursor-pointer h-[120px]">
                            <img 
                              src={dest.img} 
                              alt={dest.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(30,49,71,0.85) 0%, rgba(30,49,71,0.15) 100%)' }} />
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col">
                              <span className="text-[11px] font-bold text-white leading-tight">{dest.name}</span>
                              <span className="text-[8px] text-slate-300 leading-tight mt-0.5">{dest.desc}</span>
                            </div>
                          </div>
                        ))}
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
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <CreditCard className="w-5 h-5" style={{ color: '#138A8A' }} /> My Discount Credits
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Guaranteed value recovery — redeem on paid tours</p>

                      {/* Balance */}
                      <div className="rounded-2xl p-6 text-center mb-5 border" style={{ background: 'linear-gradient(135deg, #FAF2E6, #FBF9F5)', borderColor: '#E7DCCF' }}>
                        <span className="text-[10px] uppercase tracking-wider font-mono block text-teal-700 font-bold">TOTAL WALLET BALANCE</span>
                        <span className="text-4xl font-black block mt-1 text-teal-800">₹{voucherCount * 500}</span>
                        <span className="text-xs text-slate-500 mt-1 block">Available for paid bookings</span>
                      </div>

                      {/* Voucher Cards */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        {Array.from({ length: voucherCount }).map((_, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className="p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                            style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}
                          >
                            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20" style={{ background: '#138A8A' }} />
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: '#F3E7D3', color: '#138A8A' }}>
                                  <Zap className="w-3 h-3" /> ACTIVE
                                </span>
                                <div className="text-2xl font-black text-slate-800 mt-2">₹500</div>
                              </div>
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(217, 178, 111, 0.15)' }}>
                                <Gift className="w-4 h-4" style={{ color: '#C89C53' }} />
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                              <span className="text-slate-400">Code: <strong className="font-mono text-slate-600">BDN-{idx + 1}04</strong></span>
                              <span className="font-bold flex items-center gap-1" style={{ color: '#10b981' }}><Check className="w-3 h-3" /> Unused</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl text-xs flex items-start gap-2" style={{ backgroundColor: '#F3E7D3', border: '1px solid #C89C53' }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#138A8A' }} />
                        <span style={{ color: '#1E3147' }}><strong>Redemption:</strong> 1 voucher (₹500) per person per booking. Valid 12 months.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── DRAWS ── */}
                {activeTab === 'draws' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Ticket className="w-5 h-5" style={{ color: '#138A8A' }} /> Lucky Draw Status
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Transparent digital draws — view entries & simulate</p>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Token Card */}
                        <div className="p-5 rounded-2xl border space-y-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #FAF2E6, #FBF9F5)', borderColor: '#E7DCCF' }}>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-bold">ACTIVE DRAW TOKEN</span>
                            <span className="text-2xl font-black tracking-widest font-mono mt-1 block text-teal-800">{user?.drawToken || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 border-t pt-3" style={{ borderColor: '#E7DCCF' }}>
                            <span>Upcoming Draw:</span>
                            <span className="font-bold text-teal-700 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-teal-600" /> Next Sunday
                            </span>
                          </div>
                          <div className="text-[10px] leading-relaxed p-3 rounded-xl" style={{ background: '#F7F3ED', border: '1px solid #E7DCCF', color: '#1E3147' }}>
                            ⚠️ <strong>Note:</strong> Draws are 100% transparent. Winners travel free. Non-selected retain full voucher credits.
                          </div>
                        </div>

                        {/* Simulator */}
                        <div className="p-5 rounded-2xl border-2 border-dashed flex flex-col justify-between" style={{ borderColor: '#E7DCCF', background: 'linear-gradient(135deg, #FAF2E6, #F7F3ED)' }}>
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
                            style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}
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
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Plane className="w-5 h-5" style={{ color: '#138A8A' }} /> Book Your Travel
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Submit requests and apply discount vouchers</p>

                      <p className="text-sm text-slate-500 leading-relaxed mb-5">
                        Choose from <strong className="text-slate-700">Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand</strong> — vouchers applied automatically.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20want%20to%20book%20a%20tour%20package%20using%20my%20member%20discount%20vouchers." 
                          target="_blank" rel="noreferrer"
                          className="p-5 rounded-2xl border hover:shadow-md transition-all flex items-center justify-between group no-underline"
                          style={{ background: 'linear-gradient(135deg, #FAF2E6, #FBF9F5)', borderColor: '#E7DCCF' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(20,140,140,0.1)' }}>
                              <Plane className="w-5 h-5" style={{ color: '#138A8A' }} />
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
                          className="p-5 rounded-2xl border hover:shadow-md transition-all flex items-center justify-between group no-underline"
                          style={{ background: 'linear-gradient(135deg, #FAF2E6, #F7F3ED)', borderColor: '#E7DCCF' }}
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
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#C89C53] group-hover:translate-x-1 transition-all" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EDIT PROFILE ── */}
                {activeTab === 'edit-profile' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Edit className="w-5 h-5" style={{ color: '#138A8A' }} /> Edit Profile Details
                      </h2>
                      <p className="text-xs text-slate-400 mb-6">Manage your account information, upload your profile picture, and configure preferences</p>
                      
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Photo Upload Section */}
                        <div className="flex flex-col items-center gap-3 shrink-0 p-5 rounded-2xl border" style={{ backgroundColor: '#F3E7D3', borderColor: '#E7DCCF' }}>
                          <span className="text-xs font-bold uppercase" style={{ color: '#1E3147' }}>Profile Picture</span>
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-full p-[3px] shadow-md" style={{ background: 'linear-gradient(135deg, #138A8A, #C89C53)' }}>
                              {profileAvatar ? (
                                <img src={profileAvatar} alt="Avatar Preview" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black uppercase text-teal-800 bg-white">
                                  {editName?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                            
                            {/* Upload overlay */}
                            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <span className="text-[10px] text-white font-bold text-center px-2">Click to Upload</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                          
                          <div className="flex flex-col gap-1.5 w-full items-center">
                            <label className="px-4 py-1.5 rounded-full text-[10px] font-bold text-teal-700 bg-teal-100/60 border border-teal-200 cursor-pointer hover:bg-teal-100 transition-all text-center">
                              Select Image
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleAvatarChange} 
                                className="hidden" 
                              />
                            </label>
                            {profileAvatar && (
                              <button 
                                onClick={() => setProfileAvatar(null)}
                                className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer border-none bg-transparent"
                              >
                                Remove Photo
                              </button>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400">JPG, PNG up to 2MB</span>
                        </div>

                        {/* Fields Form */}
                        <div className="flex-1 space-y-4 w-full max-w-md">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input 
                              type="text" 
                              value={editName} 
                              onChange={(e) => {
                                setEditName(e.target.value);
                                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm text-slate-700 bg-white transition-all ${
                                errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
                              }`} 
                            />
                            {errors.name && <span className="text-[10px] font-semibold text-red-500 mt-1 block">{errors.name}</span>}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                            <input 
                              type="email" 
                              value={editEmail} 
                              onChange={(e) => {
                                setEditEmail(e.target.value);
                                if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm text-slate-700 bg-white transition-all ${
                                errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
                              }`} 
                            />
                            {errors.email && <span className="text-[10px] font-semibold text-red-500 mt-1 block">{errors.email}</span>}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                            <input 
                              type="tel" 
                              value={editMobile} 
                              onChange={(e) => {
                                setEditMobile(e.target.value);
                                if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                              }}
                              className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm text-slate-700 bg-white transition-all ${
                                errors.mobile ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-teal-500 focus:ring-teal-500'
                              }`} 
                            />
                            {errors.mobile && <span className="text-[10px] font-semibold text-red-500 mt-1 block">{errors.mobile}</span>}
                          </div>
                          
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Communication Address</label>
                            <textarea 
                              rows={3} 
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              placeholder="Enter your address..." 
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-teal-500 outline-none text-sm text-slate-700 bg-white resize-none"
                            />
                          </div>
                          
                          <div className="pt-2">
                            <button 
                              onClick={handleSaveProfile}
                              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.02] shadow-md"
                              style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}
                            >
                              Save Profile Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* ── LUCKY STATUS ── */}
                {activeTab === 'lucky-status' && (
                  <div className="space-y-5">
                    <div className="rounded-2xl shadow-sm border p-6" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Heart className="w-5 h-5 text-rose-500" /> Lucky Status & History
                      </h2>
                      <p className="text-xs text-slate-400 mb-6">Track your weekly draw participations and success odds</p>

                      <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {[
                          { label: 'Weekly Draw Odds', value: '15.4% Win Rate', desc: 'Average selector likelihood', color: '#C89C53', bg: '#FAF2E6', border: 'border-[#E7DCCF]' },
                          { label: 'Total Draws Entered', value: '3 Entries', desc: 'Active weeks count', color: '#138A8A', bg: '#FAF2E6', border: 'border-[#E7DCCF]' },
                          { label: 'Draw Ticket status', value: 'Verified Active', desc: 'Ready for next Sunday', color: '#138A8A', bg: '#FAF2E6', border: 'border-[#E7DCCF]' },
                        ].map((stat, i) => (
                          <div key={i} className={`p-4 rounded-xl border ${stat.border} shadow-sm`} style={{ background: stat.bg }}>
                            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-mono font-bold block">{stat.label}</span>
                            <span className="text-base font-bold text-slate-800 block mt-1">{stat.value}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{stat.desc}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className="text-sm font-bold text-slate-700 mb-3">Participation History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="py-2.5">Week ID</th>
                              <th className="py-2.5">Draw Date</th>
                              <th className="py-2.5">Ticket ID</th>
                              <th className="py-2.5">Result / Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            <tr>
                              <td className="py-3 font-semibold text-slate-700">WK-22</td>
                              <td className="py-3">June 07, 2026</td>
                              <td className="py-3 font-mono">{user?.drawToken || 'BDN-7822-M'}</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ backgroundColor: '#F3E7D3', color: '#1E3147', borderColor: '#C89C53' }}>
                                  Not Selected — Voucher Issued
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-slate-700">WK-21</td>
                              <td className="py-3">May 31, 2026</td>
                              <td className="py-3 font-mono">BDN-7612-A</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ backgroundColor: '#F3E7D3', color: '#1E3147', borderColor: '#C89C53' }}>
                                  Not Selected — Voucher Issued
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-teal-50/20">
                              <td className="py-3 font-semibold text-teal-800">WK-23</td>
                              <td className="py-3 text-teal-800 font-medium">June 14, 2026</td>
                              <td className="py-3 font-mono text-teal-800 font-semibold">{user?.drawToken || 'Pending'}</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white border animate-pulse" style={{ backgroundColor: '#138A8A', borderColor: '#138A8A' }}>
                                  Active Entry for Sunday
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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
            <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h4 className="text-sm font-bold font-sans" style={{ color: '#1E3147' }}>Upcoming Trip</h4>
                <ChevronRight className="w-4 h-4" style={{ color: '#138A8A' }} />
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-xl overflow-hidden h-[150px] relative group cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80" 
                    alt="Mountain destination" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div 
                    className="absolute inset-0 flex flex-col justify-end p-3.5"
                    style={{ background: 'linear-gradient(to top, rgba(30,49,71,0.82), rgba(30,49,71,0.08))' }}
                  >
                    <span className="text-white text-xs font-bold block">Kashmir Valley</span>
                    <span className="text-[9px] text-white/75 block">Next scheduled departure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Card 2 */}
            <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ backgroundColor: '#FAF2E6', borderColor: '#E7DCCF' }}>
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h4 className="text-sm font-bold font-sans" style={{ color: '#1E3147' }}>Upcoming Trip</h4>
                <ChevronRight className="w-4 h-4" style={{ color: '#C89C53' }} />
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-xl overflow-hidden h-[150px] relative group cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" 
                    alt="Beach destination" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div 
                    className="absolute inset-0 flex flex-col justify-end p-3.5"
                    style={{ background: 'linear-gradient(to top, rgba(30,49,71,0.82), rgba(30,49,71,0.08))' }}
                  >
                    <span className="text-white text-xs font-bold block">Puri Beach</span>
                    <span className="text-[9px] text-white/75 block">Popular weekend getaway</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Card */}
            <div className="rounded-2xl p-5 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #C89C53, #B9873F, #9F7134)', boxShadow: '0 8px 30px rgba(200,156,83,0.25)' }}>
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
