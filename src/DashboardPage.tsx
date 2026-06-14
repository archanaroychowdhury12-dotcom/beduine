import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Download, Crown, LogOut, Ticket, Calendar, Check, AlertCircle,
  MapPin, Star, Zap, Shield, TrendingUp, Users,
  ChevronRight, Phone, MoreVertical, User, Edit, Heart
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
  const [profileAvatar, setProfileAvatar] = useState<string | null>(user?.avatar || null);
  const [dashboardBg, setDashboardBg] = useState<string>(() => {
    return localStorage.getItem('beduine_dashboard_bg') || '/images/dashboard_bg.jpg';
  });

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
      alert('Profile details updated successfully.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Background image size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setDashboardBg(base64Data);
        localStorage.setItem('beduine_dashboard_bg', base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = () => {
    setDashboardBg('/images/dashboard_bg.jpg');
    localStorage.removeItem('beduine_dashboard_bg');
  };

  const handleSimulateDraw = () => {
    setIsSimulatingDraw(true);
    setSimulationResult(null);
    setTimeout(() => {
      setIsSimulatingDraw(false);
      const rand = Math.random();
      if (rand < 0.15) {
        setSimulationResult('Congratulations! Selected for Kashmir (Platinum Tier)');
      } else if (rand < 0.4) {
        setSimulationResult('Selected for Digha Weekend Escape (Silver Tier)');
      } else {
        setSimulationResult('Draw trial finished: Rs.500 Discount Credit guaranteed!');
      }
    }, 2500);
  };

  const planName = user?.planName || 'Unsubscribed';
  const isSubscribed = planName && planName !== 'Unsubscribed' && planName !== '';
  const displayPlan = isSubscribed ? planName : 'No Active Plan';
  const voucherCount = planName?.toLowerCase()?.includes('platinum') ? 4 : planName?.toLowerCase()?.includes('gold') ? 2 : 1;

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Compass },
    { id: 'draws', label: 'Lucky Draw', icon: Ticket },
    { id: 'bookings', label: 'Book Travel', icon: Plane },
    { id: 'credits', label: 'Discount Credits', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen pt-20 lg:pt-24 pb-10 relative overflow-hidden bg-[#FAF9F6]">
      {/* Dashboard Background Image (Clear) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={dashboardBg} 
          alt="Dashboard Background" 
          className="w-full h-full object-cover object-center"
        />
      </div>


      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10">

        {/* TOP NAV BAR */}
        <motion.div
          initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 px-2"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #F7B500, #D99100)' }}>
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide" style={{ color: '#1E3147' }}>Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:block font-bold" style={{ color: '#1E3147' }}>{profileName}</span>
            <Phone className="w-4 h-4 cursor-pointer hover:text-[#F7B500] transition-colors" style={{ color: '#5F6E7E' }} />
            <User className="w-4 h-4 cursor-pointer hover:text-[#F7B500] transition-colors" style={{ color: '#5F6E7E' }} />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-[#F7B500] transition-colors" style={{ color: '#5F6E7E' }} />
          </div>
        </motion.div>

        {/* MAIN 3-COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-[220px_1fr_280px] gap-5">

          {/* LEFT SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-1.5 travel-soft-card p-4 h-fit sticky top-28 backdrop-blur-xl"
          >
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-3 py-3 mb-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden border bg-white flex items-center justify-center p-1" style={{ borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                <img src="/images/bedune_logo_cropped.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight block animate-pulse text-[#FF6B4A]">BEDUINE</span>
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
                      ? 'font-bold text-white shadow-sm travel-gradient-button'
                      : 'font-medium text-slate-600 hover:bg-orange-50/70 bg-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Extra Nav */}
            <div className="border-t mt-3 pt-3 space-y-1" style={{ borderColor: 'rgba(255, 107, 107, 0.12)' }}>
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
                    className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm border-none ${
                      isActive ? 'font-bold text-white travel-gradient-button' : 'font-medium text-slate-600 hover:bg-orange-50/70 bg-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} /> {item.label}
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
              <div className="rounded-xl overflow-hidden relative group cursor-pointer border border-slate-100 h-[105px] shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80"
                  alt="Dubai Marina"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-2.5" style={{ background: 'linear-gradient(to top, rgba(30,49,71,0.85) 0%, rgba(30,49,71,0.15) 100%)' }}>
                  <span className="text-[8px] text-[#F7B500] uppercase tracking-widest font-black font-mono">Next Week Draw</span>
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
                    isActive ? 'text-white shadow-sm travel-gradient-button' : 'text-slate-500 bg-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT */}
          <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {/* Profile Summary Card (Mockup Inspired Centered Layout) */}
            <div className="travel-wave-card mb-5">
              
              {/* Header Curve Banner */}
              <div className="travel-coral-header flex flex-col justify-center items-center">
                <div className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-white/70">Beduine Profile</div>
                <div className="text-white font-extrabold text-base tracking-wide mt-2 relative z-10">Member Summary</div>
              </div>

              {/* Centered Avatar and Info Wrapper */}
              <div className="flex flex-col items-center -mt-10 px-6 pb-6 text-center relative z-10">
                {/* Avatar */}
                <div className="relative mb-3">
                  <div className="w-[84px] h-[84px] rounded-full p-[3px] bg-white shadow-md">
                    <div className="w-full h-full rounded-full p-[2px] travel-gradient-button">
                      {profileAvatar ? (
                        <img 
                          src={profileAvatar} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black uppercase text-white bg-transparent">
                          {profileName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse border-2 border-white bg-[#00A676]">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Name & Plan info */}
                <h3 className="text-lg font-bold text-slate-800 mb-0.5">{profileName || 'Member'}</h3>
                <span className="travel-pill px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-4 inline-block animate-pulse">
                  {displayPlan}
                </span>

                {/* Three Stats Cards (Exactly like the mockup profile) */}
                <div className="grid grid-cols-3 gap-3 w-full my-4">
                  {/* Card 1 (Vouchers) - solid orange */}
                  <div 
                    onClick={() => setActiveTab('credits')}
                    className="travel-stat-card travel-stat-card--coral p-3.5 text-center cursor-pointer" 
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-white/95" />
                    <span className="text-[8px] uppercase tracking-wider block text-white/80 font-mono">Credits</span>
                    <span className="text-sm font-black block mt-0.5">Rs.{voucherCount * 500}</span>
                  </div>

                  {/* Card 2 (Draw Entries) - white/frosted */}
                  <div 
                    onClick={() => setActiveTab('draws')}
                    className="travel-stat-card travel-stat-card--ocean p-3.5 text-center cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 mx-auto mb-1 text-[#0077B6]" />
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400 font-mono">Entries</span>
                    <span className="text-sm font-black block mt-0.5 text-slate-800">{isSubscribed ? '3 Wks' : 'N/A'}</span>
                  </div>

                  {/* Card 3 (Win Odds) - white/frosted */}
                  <div 
                    onClick={() => setActiveTab('lucky-status')}
                    className="travel-stat-card travel-stat-card--teal p-3.5 text-center cursor-pointer"
                  >
                    <Heart className="w-4 h-4 mx-auto mb-1 text-[#00A676]" />
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400 font-mono">Odds</span>
                    <span className="text-sm font-black block mt-0.5 text-slate-800">{isSubscribed ? '15.4%' : 'N/A'}</span>
                  </div>
                </div>

                {/* Capsule Button & Extra Meta */}
                <div className="w-full pt-2 mt-2 border-t border-slate-100 flex flex-col gap-2.5">
                  <button 
                    onClick={() => setActiveTab('draws')}
                    className="w-full py-2.5 rounded-full text-xs font-bold cursor-pointer travel-gradient-button"
                  >
                    Enter Lucky Draw Simulator
                  </button>
                  <p className="text-[9px] text-slate-400 font-mono">{profileEmail || profileMobile} - Member ID: {user?.memberId || 'BDN-9022-X'}</p>
                </div>

              </div>

            </div>

            {/* TAB CONTENT */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Upcoming Trips Progress */}
                    <div className="travel-soft-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" style={{ color: '#FF6B6B' }} /> Upcoming Trips
                        </h3>
                        <span className="text-xs text-slate-400">Your travel journey</span>
                      </div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-3xl font-black text-slate-800">{isSubscribed ? 1 : 0}</span>
                        <span className="text-sm text-slate-400">/ 4 quarterly trips</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3">Your current tier: <strong style={{ color: '#FF6B6B' }}>{displayPlan}</strong> - Earn miles on every booking</p>
                      {/* Progress Bar */}
                      <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-4">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: isSubscribed ? '25%' : '5%' }}
                          transition={{ duration: 1.2, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #FF6B6B, #F97316)' }}
                        />
                      </div>
                      {/* Quick Action Buttons */}
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                          { label: 'Manage Booking', icon: Calendar },
                          { label: 'Add Guest', icon: Users },
                          { label: 'View Itinerary', icon: MapPin },
                        ].map((btn, i) => {
                          const Icon = btn.icon;
                          return (
                            <a key={i} href="https://wa.me/918768903565" target="_blank" rel="noreferrer"
                              className="p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer no-underline"
                            >
                              <Icon className="w-3.5 h-3.5" /> {btn.label}
                            </a>
                          );
                        })}
                      </div>

                      {/* Wavy Activity Chart (Exactly like the mockup line chart) */}
                      <div className="pt-5 border-t border-slate-100/80">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Weekly Active Draw Odds Trend</span>
                        <div className="relative h-28 w-full">
                          {/* Background vertical bar lines */}
                          <div className="absolute inset-0 flex justify-between px-4 pointer-events-none">
                            {Array.from({ length: 6 }).map((_, idx) => (
                              <div key={idx} className="w-[1.5px] h-full bg-slate-100/60 flex flex-col justify-end">
                                <div className="w-full h-[30%] bg-slate-200/50 rounded-t" />
                              </div>
                            ))}
                          </div>
                          
                          {/* SVG Wavy Curve */}
                          <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Area Fill */}
                            <path 
                              d="M 0 80 Q 50 30 100 60 T 200 40 T 300 70 L 300 100 L 0 100 Z" 
                              fill="url(#chart-glow)" 
                            />
                            {/* Line Path */}
                            <path 
                              d="M 0 80 Q 50 30 100 60 T 200 40 T 300 70" 
                              fill="none" 
                              stroke="#FF6B6B" 
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                          </svg>

                          {/* Marker Point 1 */}
                          <div className="absolute left-[33%] top-[49px] w-2.5 h-2.5 rounded-full bg-white border-[3px] border-[#FF6B6B] shadow-sm" />
                          <div className="absolute left-[24%] top-[14px] bg-[#FF6B6B] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#FF6B6B]">
                            Draw WK-22
                          </div>

                          {/* Marker Point 2 */}
                          <div className="absolute left-[66%] top-[29px] w-2.5 h-2.5 rounded-full bg-white border-[3px] border-[#FF6B6B] shadow-sm animate-pulse" />
                          <div className="absolute left-[58%] top-[-5px] bg-[#FF7E40] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-[#FF7E40]">
                            Active WK-23
                          </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="flex justify-between px-2 mt-1 text-[9px] font-bold text-slate-400 font-mono">
                          <span>June 1</span>
                          <span>June 5</span>
                          <span>June 9</span>
                          <span>June 14</span>
                        </div>
                      </div>
                    </div>

                    {/* Plan Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Plan Tier', value: displayPlan, icon: Crown, color: '#FF6B4A', cardClass: 'travel-stat-card--coral' },
                        { label: 'Plan Status', value: isSubscribed ? 'Active' : 'Inactive', icon: Shield, color: '#0077B6', cardClass: 'travel-stat-card--ocean' },
                        { label: 'Draw Token', value: user?.drawToken || 'N/A', icon: Ticket, color: '#00A676', cardClass: 'travel-stat-card--teal' },
                      ].map((card, i) => {
                        const Icon = card.icon;
                        return (
                          <div key={i} className={`travel-stat-card ${card.cardClass} p-5 relative overflow-hidden`}>
                            <div className="absolute top-3 right-3 opacity-20"><Icon className="w-10 h-10" style={{ color: i === 0 ? '#FFFFFF' : card.color }} /></div>
                            <span className={`text-[9px] uppercase tracking-wider font-mono block ${i === 0 ? 'text-white/80' : 'text-slate-500'}`}>{card.label}</span>
                            <span className={`text-lg font-bold block mt-1 ${i === 0 ? 'text-white' : 'text-slate-800'}`}>{card.value}</span>
                            <span className={`text-[10px] block mt-1 font-semibold ${i === 0 ? 'text-white/85' : ''}`} style={i === 0 ? undefined : { color: card.color }}>Active</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Actions & Digital Ticket */}
                    <div className="travel-soft-card p-6">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: '#FF7E40' }} /> Quick Actions & Vouchers
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { title: 'Discount Voucher', desc: 'Rs.500 vouchers for paid trips', icon: Gift, color: '#FF6B6B' },
                          { title: 'Name Change Policy', desc: 'Platinum: unlimited family adjustments', icon: Users, color: '#0077B6' },
                          { title: 'Quarterly Tours', desc: 'Curated destinations each cycle', icon: MapPin, color: '#FF8E53' },
                          { title: 'ROI Guarantee', desc: '100% voucher safety net', icon: TrendingUp, color: '#FF6B6B' },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="travel-action-tile flex items-start gap-3 p-3 rounded-xl transition-colors">
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
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50" style={{ border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                            <Download className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">Digital Boarding Ticket</span>
                            <span className="text-[10px] text-slate-400">Keep for checkout confirmation</span>
                          </div>
                        </div>
                        <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer travel-gradient-button travel-gradient-button--ocean">
                          Download
                        </button>
                      </div>
                    </div>

                    {/* Destination Gallery */}
                    <div className="travel-soft-card p-6">
                      <h3 className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: '#1E3147' }}>
                        <Plane className="w-4 h-4" style={{ color: '#FF6B6B' }} /> Explore Subscribed Destinations
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">Subscriber-favorite travel highlights included in your lucky draw entries</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Kashmir Valley', desc: 'Misty Pines & Houseboats', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Darjeeling Hills', desc: 'Tea Gardens & Toy Train', img: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Puri Golden Beach', desc: 'Sun Temples & Waves', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' },
                          { name: 'Sundarbans Forest', desc: 'Royal Mangrove Safari', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80' },
                        ].map((dest, i) => (
                          <div key={i} className="rounded-xl overflow-hidden border border-slate-200/60 relative group cursor-pointer h-[120px]">
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
                {activeTab === 'credits' && (
                  <div className="space-y-5">
                    <div className="travel-soft-card p-6">
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <CreditCard className="w-5 h-5" style={{ color: '#FF6B6B' }} /> My Discount Credits
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Guaranteed value recovery - redeem on paid tours</p>

                      {/* Balance */}
                      <div className="travel-blue-wave rounded-2xl p-6 text-center mb-5 border border-white/30">
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
                        <span className="text-[10px] uppercase tracking-wider font-mono block text-white/85 font-bold">TOTAL WALLET BALANCE</span>
                        <span className="text-4xl font-black block mt-1 text-white">Rs.{voucherCount * 500}</span>
                        <span className="text-xs text-white/90 mt-1 block font-medium">Available for paid bookings</span>
                      </div>

                      {/* Voucher Cards */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        {Array.from({ length: voucherCount }).map((_, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                            className={`travel-stat-card p-5 relative overflow-hidden ${idx % 2 === 0 ? 'travel-stat-card--ocean' : 'travel-stat-card--teal'}`}
                          >
                            {/* Ticket Notches - changed to match new page background #FFF8F6 */}
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#FFF8F6', borderRight: '1px solid rgba(255, 107, 107, 0.15)' }} />
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: '#FFF8F6', borderLeft: '1px solid rgba(255, 107, 107, 0.15)' }} />

                            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20" />
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm travel-gradient-button">
                                  <Zap className="w-2.5 h-2.5 animate-pulse" /> ACTIVE
                                </span>
                                <div className="text-3xl font-black text-slate-800 mt-2">Rs.500</div>
                              </div>
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
                                <Gift className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex justify-between items-center text-xs">
                              <span className="text-slate-400">Code: <strong className="font-mono text-slate-600">BDN-{idx + 1}04</strong></span>
                              <span className="font-bold flex items-center gap-1" style={{ color: '#10b981' }}><Check className="w-3 h-3" /> Unused</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl text-xs flex items-start gap-2" style={{ backgroundColor: '#FFF5F2', border: '1px solid rgba(255, 107, 107, 0.25)' }}>
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#FF6B6B' }} />
                        <span style={{ color: '#E64A19' }}><strong>Redemption:</strong> 1 voucher (Rs.500) per person per booking. Valid 12 months.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DRAWS */}
                {activeTab === 'draws' && (
                  <div className="space-y-5">
                    <div className="travel-soft-card p-6">
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Ticket className="w-5 h-5" style={{ color: '#FF6B6B' }} /> Lucky Draw Status
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Transparent digital draws - view entries & simulate</p>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Token Card */}
                        <div className="travel-stat-card travel-stat-card--ocean p-5 space-y-4">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-bold">ACTIVE DRAW TOKEN</span>
                            <span className="text-3xl font-black tracking-widest font-mono mt-1 block" style={{ background: 'linear-gradient(135deg, #0077B6, #00A676)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.drawToken || 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 border-t pt-3" style={{ borderColor: 'rgba(255, 107, 107, 0.12)' }}>
                            <span>Upcoming Draw:</span>
                            <span className="font-bold flex items-center gap-1" style={{ color: '#FF7E40' }}>
                              <Calendar className="w-3.5 h-3.5" style={{ color: '#FF7E40' }} /> Next Sunday
                            </span>
                          </div>
                          <div className="text-[10px] leading-relaxed p-3 rounded-xl" style={{ background: '#FFF8F6', border: '1px solid rgba(255, 107, 107, 0.15)', color: '#1E3147' }}>
                            <strong>Note:</strong> Draws are 100% transparent. Winners travel free. Non-selected retain full voucher credits.
                          </div>
                        </div>

                        {/* Simulator */}
                        <div className="travel-stat-card travel-stat-card--teal p-5 border-2 border-dashed flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                              <Sparkles className="w-4 h-4 text-[#00A676]" /> RNG Test Simulator
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">Simulate a mock draw to see how our system works</p>
                          </div>
                          <div className="my-4 min-h-[55px] flex items-center justify-center">
                            {isSimulatingDraw ? (
                              <div className="flex flex-col items-center gap-2 text-xs font-mono text-[#0077B6]">
                                <Compass className="w-7 h-7 animate-spin" />
                                <span className="animate-pulse">GENERATING...</span>
                              </div>
                            ) : simulationResult ? (
                              <div className="text-center p-3 rounded-xl text-xs font-semibold leading-relaxed bg-white border border-slate-100 text-slate-700 shadow-sm">
                                {simulationResult}
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500">Ready to simulate</span>
                            )}
                          </div>
                          <button onClick={handleSimulateDraw} disabled={isSimulatingDraw}
                            className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer travel-gradient-button travel-gradient-button--ocean"
                          >
                            Launch Mock Draw
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOOKINGS */}
                {activeTab === 'bookings' && (
                  <div className="space-y-5">
                    <div className="travel-soft-card p-6">
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Plane className="w-5 h-5" style={{ color: '#FF6B6B' }} /> Book Your Travel
                      </h2>
                      <p className="text-xs text-slate-400 mb-5">Submit requests and apply discount vouchers</p>

                      <p className="text-sm text-slate-500 leading-relaxed mb-5">
                        Choose from <strong className="text-slate-700">Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand</strong> - vouchers applied automatically.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20want%20to%20book%20a%20tour%20package%20using%20my%20member%20discount%20vouchers."
                          target="_blank" rel="noreferrer"
                          className="p-5 rounded-2xl border hover:shadow-md transition-all flex items-center justify-between group no-underline border-l-4 border-l-[#FF6B6B]"
                          style={{ background: 'linear-gradient(135deg, rgba(255,107,107,0.06), rgba(255,255,255,0.95))', borderColor: 'rgba(255, 107, 107, 0.2)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-inner animate-pulse" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
                              <Plane className="w-5 h-5" style={{ color: '#FF6B6B' }} />
                            </div>
                            <div>
                              <span className="block text-sm font-bold text-slate-700">Book Paid Tour</span>
                              <span className="block text-[10px] text-slate-400">Apply vouchers to save</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF6B6B] group-hover:translate-x-1 transition-all" />
                        </a>

                        <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20have%20questions%20about%20the%20upcoming%20Sunday%20lucky%20draw%20schedule."
                          target="_blank" rel="noreferrer"
                          className="p-5 rounded-2xl border hover:shadow-md transition-all flex items-center justify-between group no-underline border-l-4 border-l-[#0077B6]"
                          style={{ background: 'linear-gradient(135deg, rgba(0,119,182,0.08), rgba(255,255,255,0.95))', borderColor: 'rgba(0, 119, 182, 0.2)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-inner" style={{ background: 'rgba(0, 119, 182, 0.1)' }}>
                              <Ticket className="w-5 h-5 text-[#0077B6]" />
                            </div>
                            <div>
                              <span className="block text-sm font-bold text-slate-700">Draw Support</span>
                              <span className="block text-[10px] text-slate-400">Inquire about rules</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0077B6] group-hover:translate-x-1 transition-all" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* EDIT PROFILE */}
                {activeTab === 'edit-profile' && (
                  <div className="space-y-5">
                    <div className="travel-soft-card p-6">
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Edit className="w-5 h-5" style={{ color: '#FF6B6B' }} /> Edit Profile Details
                      </h2>
                      <p className="text-xs text-slate-400 mb-6">Manage your account information, upload your profile picture, and configure preferences</p>

                      <div className="flex flex-col md:flex-row gap-8 items-start w-full">
                        {/* Profile Photo Upload Section */}
                        <div className="travel-soft-card flex flex-col items-center gap-3 shrink-0 p-5">
                          <span className="text-xs font-bold uppercase" style={{ color: '#1E3147' }}>Profile Picture</span>
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-full p-[3px] shadow-md travel-blue-wave">
                              {profileAvatar ? (
                                <img src={profileAvatar} alt="Avatar Preview" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black uppercase text-[#0B1F2E] bg-white">
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
                            <label className="px-4 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all text-center travel-gradient-button">
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

                        {/* Dashboard Background Upload Section */}
                        <div className="travel-soft-card flex flex-col items-center gap-3 shrink-0 p-5">
                          <span className="text-xs font-bold uppercase" style={{ color: '#1E3147' }}>Dashboard Background</span>
                          <div className="relative group">
                            <div className="w-40 h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
                              <img src={dashboardBg} alt="Background Preview" className="w-full h-full object-cover" />
                            </div>
                            <label className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <span className="text-[10px] text-white font-bold text-center px-2">Click to Change</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBgChange}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="flex flex-col gap-1.5 w-full items-center">
                            <label className="px-4 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all text-center travel-gradient-button travel-gradient-button--ocean">
                              Select Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleBgChange}
                                className="hidden"
                              />
                            </label>
                            {dashboardBg !== '/images/dashboard_bg.jpg' && (
                              <button
                                onClick={handleResetBg}
                                className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer border-none bg-transparent"
                              >
                                Reset to Default
                              </button>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400">JPG, PNG up to 5MB</span>
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
                              className={`travel-input-focus w-full px-4 py-2.5 rounded-xl border outline-none text-sm text-slate-700 bg-white ${
                                errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'
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
                              className={`travel-input-focus w-full px-4 py-2.5 rounded-xl border outline-none text-sm text-slate-700 bg-white ${
                                errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'
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
                              className={`travel-input-focus w-full px-4 py-2.5 rounded-xl border outline-none text-sm text-slate-700 bg-white ${
                                errors.mobile ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'
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
                              className="travel-input-focus w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 bg-white resize-none"
                            />
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={handleSaveProfile}
                              className="px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer travel-gradient-button"
                            >
                              Save Profile Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* LUCKY STATUS */}
                {activeTab === 'lucky-status' && (
                  <div className="space-y-5">
                    <div className="travel-soft-card p-6">
                      <h2 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: '#1E3147' }}>
                        <Heart className="w-5 h-5 text-[#FF6B6B]" /> Lucky Status & History
                      </h2>
                      <p className="text-xs text-slate-400 mb-6">Track your weekly draw participations and success odds</p>

                      <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {[
                          { label: 'Weekly Draw Odds', value: '15.4% Win Rate', desc: 'Average selector likelihood', cardClass: 'travel-stat-card--coral' },
                          { label: 'Total Draws Entered', value: '3 Entries', desc: 'Active weeks count', cardClass: 'travel-stat-card--ocean' },
                          { label: 'Draw Ticket status', value: 'Verified Active', desc: 'Ready for next Sunday', cardClass: 'travel-stat-card--teal' },
                        ].map((stat, i) => (
                          <div key={i} className={`travel-stat-card ${stat.cardClass} p-4`}>
                            <span className={`text-[9px] uppercase tracking-wider font-mono font-bold block ${i === 0 ? 'text-white/80' : 'text-slate-500'}`}>{stat.label}</span>
                            <span className={`text-base font-bold block mt-1 ${i === 0 ? 'text-white' : 'text-slate-800'}`}>{stat.value}</span>
                            <span className={`text-[10px] block mt-0.5 ${i === 0 ? 'text-white/75' : 'text-slate-400'}`}>{stat.desc}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className="text-sm font-bold text-slate-700 mb-3">Participation History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[620px] text-left text-xs border-collapse">
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
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap" style={{ backgroundColor: '#FFF5F2', color: '#E64A19', borderColor: 'rgba(255, 107, 107, 0.25)' }}>
                                  Not Selected - Voucher Issued
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-3 font-semibold text-slate-700">WK-21</td>
                              <td className="py-3">May 31, 2026</td>
                              <td className="py-3 font-mono">BDN-7612-A</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap" style={{ backgroundColor: '#FFF5F2', color: '#E64A19', borderColor: 'rgba(255, 107, 107, 0.25)' }}>
                                  Not Selected - Voucher Issued
                                </span>
                              </td>
                            </tr>
                            <tr className="bg-sky-50/50">
                              <td className="py-3 font-semibold text-[#E64A19]">WK-23</td>
                              <td className="py-3 text-[#E64A19] font-medium">June 14, 2026</td>
                              <td className="py-3 font-mono text-[#E64A19] font-semibold">{user?.drawToken || 'Pending'}</td>
                              <td className="py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white border-none animate-pulse whitespace-nowrap shadow-sm travel-gradient-button">
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

          {/* RIGHT SIDEBAR: UPCOMING TRIPS */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="hidden lg:flex flex-col gap-5"
          >
            {/* Live Co-Traveler Tracker (Mockup Inspired Right Map Screen) */}
            <div className="travel-map-card mb-2">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h4 className="text-sm font-bold font-sans flex items-center gap-1.5" style={{ color: '#1E3147' }}>
                  <MapPin className="w-4 h-4 text-[#0077B6]" /> Co-Travelers Live Map
                </h4>
                <span className="text-[10px] bg-[#00A676]/15 text-[#008E6A] px-2 py-0.5 rounded-full font-bold animate-pulse">Live</span>
              </div>
              
              <div className="p-3">
                {/* Generated Beautiful Map Image with Dynamic Overlaid Pins */}
                <div className="travel-map-frame rounded-xl overflow-hidden h-[200px] relative bg-[#0B1528]">
                  <img 
                    src="/images/co_travelers_map.png" 
                    alt="Live Tracker Map" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

                  {/* Pulsing Pin Points */}
                  {/* Pin 1: Nancy */}
                  <div className="absolute left-[30%] top-[25%] flex flex-col items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7E40] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E64A19]"></span>
                    </span>
                    <div className="bg-slate-900/90 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md mt-1 border border-slate-750">
                      Nancy (Kashmir)
                    </div>
                  </div>

                  {/* Pin 2: Nattasha (User) */}
                  <div className="absolute left-[65%] top-[55%] flex flex-col items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A676] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00A676]"></span>
                    </span>
                    <div className="bg-slate-900/90 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md mt-1 border border-slate-750">
                      {profileName || 'Nattasha'} (Puri)
                    </div>
                  </div>

                  {/* Pin 3: Jhon Martin */}
                  <div className="absolute left-[20%] top-[80%] flex flex-col items-center">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0077B6] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0077B6]"></span>
                    </span>
                    <div className="bg-slate-900/90 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md mt-1 border border-slate-750">
                      Jhon (Sundarbans)
                    </div>
                  </div>

                </div>
              </div>

              {/* Map Footer Action Button */}
              <div className="px-3 pb-3 pt-1">
                <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer"
                  className="w-full py-2.5 rounded-full text-xs font-bold text-slate-700 bg-white/90 border border-slate-200 shadow-sm hover:shadow-md hover:bg-white flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer no-underline"
                >
                  Friends Near By
                </a>
              </div>
            </div>

            {/* Membership Card */}
            <div className="travel-blue-wave rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
              <Crown className="w-6 h-6 text-[#F7B500] mx-auto mb-2 relative z-10 animate-bounce" />
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
