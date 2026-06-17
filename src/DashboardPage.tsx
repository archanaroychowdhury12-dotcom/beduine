import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Download, Crown, LogOut, Ticket, Calendar, Check,
  MapPin, Star, Zap, Shield, TrendingUp, Users,
  ChevronRight, User, Edit, Heart, Bell, ChevronLeft
} from 'lucide-react';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
  onBookPaidTour?: () => void;
}

const DEFAULT_DASHBOARD_BG = '/images/chatgpt_dashboard_bg.png';
const DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg_v2';
const LEGACY_DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg';

export default function DashboardPage({ user, onLogout, onBookPaidTour }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'draws' | 'bookings' | 'edit-profile' | 'lucky-status'>('overview');
  const [isSimulatingDraw, setIsSimulatingDraw] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const [profileName, setProfileName] = useState(user?.fullName || 'Rahul Sen');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'rahul.sen@example.com');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '9876543210');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(user?.avatar || null);
  const [dashboardBg, setDashboardBg] = useState<string>(() => {
    const saved = localStorage.getItem(DASHBOARD_BG_STORAGE_KEY);
    if (!saved || !saved.startsWith('data:image/')) {
      return DEFAULT_DASHBOARD_BG;
    }
    return saved;
  });

  const DESTINATIONS = [
    { name: 'Kashmir Valley', desc: 'Majestic Lakes', img: '/images/kashmir_valley_card.png' },
    { name: 'Darjeeling Hills', desc: 'Tea Gardens', img: '/images/darjeeling_hills_card.png' },
    { name: 'Puri-Gokarna Beach', desc: 'Serene Coastline', img: '/images/gokarna_beach_card.png' },
    { name: 'Sundarbans Forest', desc: 'Misty Mangroves', img: '/images/sundarbans_forest_card.png' }
  ];

  // Edit states
  const [editName, setEditName] = useState(user?.fullName || 'Rahul Sen');
  const [editEmail, setEditEmail] = useState(user?.email || 'rahul.sen@example.com');
  const [editMobile, setEditMobile] = useState(user?.mobile || '9876543210');
  const [editAddress, setEditAddress] = useState(user?.address || '');

  // Error states
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; mobile?: string } = {};

    if (!editName.trim()) {
      newErrors.name = 'Full name is required';
    } else if (editName.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(editEmail.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

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
        localStorage.setItem(DASHBOARD_BG_STORAGE_KEY, base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = () => {
    setDashboardBg(DEFAULT_DASHBOARD_BG);
    localStorage.removeItem(DASHBOARD_BG_STORAGE_KEY);
    localStorage.removeItem(LEGACY_DASHBOARD_BG_STORAGE_KEY);
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
        setSimulationResult('Selection preview finished: fixed 500-value Discount Credit remains available.');
      }
    }, 2500);
  };

  const planName = user?.planName || 'Unsubscribed';
  const isSubscribed = planName && planName !== 'Unsubscribed' && planName !== '';
  const displayPlan = isSubscribed ? planName : 'ACTIVE PLAN';
  const voucherCount = planName?.toLowerCase()?.includes('platinum') ? 4 : planName?.toLowerCase()?.includes('gold') ? 2 : 1;

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Compass },
    { id: 'draws', label: 'Member Selection', icon: Ticket },
    { id: 'bookings', label: 'Book Travel', icon: Plane },
    { id: 'credits', label: 'Discount Credits', icon: CreditCard },
  ];

  return (
    <div 
      className="min-h-screen pt-24 lg:pt-28 pb-10 relative overflow-x-hidden"
      style={{ 
        backgroundImage: `url('${dashboardBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Semi-transparent soft overlay to ensure maximum readability */}
      <div className="absolute inset-0 bg-[#EAF7FB]/25 backdrop-blur-[3px] pointer-events-none z-0" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">

        {/* SUB HEADER: User Info & Notification Icons (Under fixed Navbar) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end mb-5 px-4 gap-4"
        >
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/80 shadow-sm">
            <span className="text-xs font-bold text-slate-800">{profileName}</span>
            <div className="w-px h-3 bg-slate-300" />
            <Bell className="w-3.5 h-3.5 cursor-pointer text-slate-500 hover:text-[#FF6B6B] transition-colors" />
            <User className="w-3.5 h-3.5 cursor-pointer text-slate-500 hover:text-[#FF6B6B] transition-colors" />
          </div>
        </motion.div>

        {/* MAIN 3-COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-[230px_1fr_310px] gap-6 items-start">

          {/* ==================== LEFT COLUMN: SIDEBAR ==================== */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-1 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 rounded-[28px] sticky top-28"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-2.5 py-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-orange-100 bg-white flex items-center justify-center p-1.5 shadow-sm">
                <img src="/images/bedune_logo_transparent.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight block text-[#FF6B6B]">BEDUINE</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono">Tour & Travels</span>
              </div>
            </div>

            {/* Menu Navigation */}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-250 border-none text-sm ${
                    isActive
                      ? 'font-bold bg-[#FF6B6B]/10 text-[#FF6B6B]'
                      : 'font-medium text-slate-500 hover:bg-orange-50/50 bg-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B6B]' : 'text-slate-450'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Sub Menu */}
            <div className="border-t border-slate-100 mt-4 pt-4 space-y-1">
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
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm border-none ${
                      isActive
                        ? 'font-bold bg-[#FF6B6B]/10 text-[#FF6B6B]'
                        : 'font-medium text-slate-500 hover:bg-orange-50/50 bg-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B6B]' : 'text-slate-450'}`} /> {item.label}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="w-full mt-6 px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-sm font-bold border-none bg-transparent hover:bg-red-50/50"
              style={{ color: '#D66A5D' }}
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>

            {/* Sidebar Dubai Banner */}
            <div className="mt-6 p-0.5">
              <div className="rounded-2xl overflow-hidden relative group cursor-pointer border border-slate-100/80 h-[115px] shadow-sm">
                <img
                  src="/images/dubai_sidebar_banner.png"
                  alt="Dubai Marina"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-3" style={{ background: 'linear-gradient(to top, rgba(30,49,71,0.85) 0%, rgba(30,49,71,0.1) 100%)' }}>
                  <span className="text-[7.5px] text-[#F7B500] uppercase tracking-widest font-black font-mono">Next Big Adventure</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-white text-xs font-bold leading-tight">Dubai Marina Sands</span>
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-slate-800">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Mobile Menu Options */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-2 px-1">
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
                    isActive ? 'text-white shadow-sm bg-[#FF6B6B]' : 'text-slate-500 bg-white shadow-sm border border-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {item.label}
                </button>
              );
            })}
          </div>

          {/* ==================== CENTER COLUMN: MAIN CONTENT ==================== */}
          <motion.main 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            {/* PROFILE MEMBER SUMMARY CARD */}
            <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] overflow-hidden relative p-8">
              {/* Header Curve SVG Watermark */}
              <div className="absolute top-0 right-0 w-[260px] h-full pointer-events-none select-none opacity-25">
                <svg className="w-full h-full text-[#00D4F5]" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,0 Q60,30 100,0 L100,100 L0,100 Z" fill="currentColor" opacity="0.08" />
                  <path d="M0,0 Q60,50 100,10" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Title Header */}
              <div className="text-center w-full pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono block">Profile Overview</span>
                <h2 className="text-slate-800 font-black text-lg tracking-wide mt-1 uppercase">Member Summary</h2>
              </div>

              {/* Centered Profile Avatar */}
              <div className="flex flex-col items-center mt-3 text-center w-full">
                {/* Crown & Avatar circle */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="w-[84px] h-[84px] rounded-full p-[3px] bg-white shadow-md border border-slate-100 flex items-center justify-center relative">
                    <div className="w-full h-full rounded-full bg-[#0A1D37] flex flex-col items-center justify-center relative overflow-hidden">
                      {profileAvatar ? (
                        <img 
                          src={profileAvatar} 
                          alt="Profile Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full relative">
                          <Crown className="w-4 h-4 text-[#F7B500] absolute top-2.5" />
                          <span className="text-2xl font-black text-white mt-4 uppercase">
                            {profileName?.charAt(0) || 'R'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md border-2 border-white bg-emerald-500">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                </div>

                {/* Profile Name */}
                <h3 className="text-lg font-bold text-slate-800 mb-0.5">{profileName}</h3>
                <span className="bg-[#FF6B6B] text-white px-3.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-5 inline-block">
                  {displayPlan}
                </span>

                {/* Stats Cards (Mockup styling) */}
                <div className="grid grid-cols-3 gap-4 w-full mt-2 mb-4">
                  {/* Credits Box (Cyan-Blue Gradient) */}
                  <div 
                    onClick={() => setActiveTab('credits')}
                    className="rounded-2xl bg-gradient-to-r from-[#00D4F5] to-[#3B82F6] text-white p-4 text-center cursor-pointer shadow-sm hover:opacity-95 transition-all"
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1 text-white/90" />
                    <span className="text-[8px] uppercase tracking-wider block text-white/80 font-bold font-mono">Credits</span>
                    <span className="text-base font-black block mt-0.5">{voucherCount}DC</span>
                    <span className="text-[7.5px] block text-white/70 font-medium">One Unit of Credit</span>
                  </div>

                  {/* Invite Status */}
                  <div 
                    onClick={() => setActiveTab('draws')}
                    className="rounded-2xl bg-white border border-slate-100 p-4 text-center cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <Gift className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400 font-bold font-mono">Invite Status</span>
                    <span className="text-base font-black block mt-0.5 text-slate-800">N/A</span>
                  </div>

                  {/* Referrals */}
                  <div 
                    onClick={() => setActiveTab('lucky-status')}
                    className="rounded-2xl bg-white border border-slate-100 p-4 text-center cursor-pointer shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <Compass className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                    <span className="text-[8px] uppercase tracking-wider block text-slate-400 font-bold font-mono">Referrals</span>
                    <span className="text-base font-black block mt-0.5 text-slate-800">N/A</span>
                  </div>
                </div>

                {/* Action button & footer info */}
                <div className="w-full pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2.5">
                  <button 
                    onClick={() => setActiveTab('draws')}
                    className="w-full py-3 rounded-full text-xs font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] shadow-md shadow-orange-500/10 cursor-pointer hover:opacity-95 transition-opacity border-none"
                  >
                    Open Weekly Selection Preview
                  </button>
                  <p className="text-[9px] text-slate-400 font-bold font-mono">
                    {profileEmail}{profileMobile ? ` • ${profileMobile}` : ''} &nbsp;•&nbsp; Member ID: 809-1864-230A
                  </p>
                </div>
              </div>
            </div>

            {/* TAB PANELS CONTAINER */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                
                {/* OVERVIEW PANEL */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Upcoming Trips Stat */}
                    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 sm:p-7 text-left">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                          <Plane className="w-4 h-4 text-[#00D4F5]" /> Upcoming Trips
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your travel journey</span>
                      </div>
                      
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-black text-slate-800">{isSubscribed ? 1 : 0}</span>
                        <span className="text-xs text-slate-400 font-bold">/ 4 quarterly trips</span>
                      </div>
                      
                      <p className="text-xs text-slate-400 mb-3.5">
                        Your current tier: <strong className="text-[#FF6B6B]">{displayPlan}</strong> — Earn miles on every booking
                      </p>

                      {/* Progress Bar */}
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-5">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: isSubscribed ? '25%' : '5%' }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full bg-[#00D4F5]"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                          { label: 'Manage Booking', icon: Calendar },
                          { label: 'Add Guest', icon: Users },
                          { label: 'View Itinerary', icon: MapPin },
                        ].map((btn, i) => {
                          const Icon = btn.icon;
                          return (
                            <a key={i} href="https://wa.me/918768903565" target="_blank" rel="noreferrer"
                              className="p-3 rounded-xl border border-slate-200/80 hover:border-[#00D4F5]/35 hover:bg-[#EAF7FB]/30 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-slate-500 hover:text-[#00D4F5] cursor-pointer no-underline"
                            >
                              <Icon className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{btn.label}</span>
                            </a>
                          );
                        })}
                      </div>

                      {/* Weekly entry activity trend (Graph) */}
                      <div className="pt-6 border-t border-slate-100">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Weekly Entry Activity Trend</span>
                        
                        <div className="relative h-28 w-full mt-2">
                          {/* Background vertical bar grid */}
                          <div className="absolute inset-0 flex justify-between px-3 pointer-events-none">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <div key={idx} className="w-[1px] h-full bg-slate-100/70" />
                            ))}
                          </div>

                          {/* SVG Wavy Line (Sky Blue color) */}
                          <svg className="w-full h-full absolute inset-0" viewBox="0 0 300 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chart-cyan-glow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#00D4F5" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#00D4F5" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path 
                              d="M 0 85 Q 75 35 150 70 T 300 50 L 300 100 L 0 100 Z" 
                              fill="url(#chart-cyan-glow)" 
                            />
                            <path 
                              d="M 0 85 Q 75 35 150 70 T 300 50" 
                              fill="none" 
                              stroke="#00D4F5" 
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>

                          {/* Marker 1 */}
                          <div className="absolute left-[33%] top-[54px] w-2 h-2 rounded-full bg-white border-2 border-[#00D4F5] shadow-sm" />
                          <div className="absolute left-[24%] top-[18px] bg-[#00D4F5] text-white text-[8px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded shadow-sm">
                            Entry: 320
                          </div>

                          {/* Marker 2 */}
                          <div className="absolute left-[66%] top-[45px] w-2 h-2 rounded-full bg-white border-2 border-[#00D4F5] shadow-sm animate-pulse" />
                          <div className="absolute left-[58%] top-[8px] bg-[#00D4F5] text-white text-[8px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded shadow-sm">
                            Entry: 512
                          </div>
                        </div>

                        {/* X-axis labels */}
                        <div className="flex justify-between px-1.5 mt-2 text-[9px] font-bold text-slate-400 font-mono">
                          <span>Jun 1</span>
                          <span>Jun 8</span>
                          <span>Jun 15</span>
                          <span>Jun 22</span>
                          <span>Jun 29</span>
                        </div>
                      </div>
                    </div>

                    {/* Plan Status widgets (Three Columns White Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'PLAN TIER', value: displayPlan, icon: Crown, color: '#F7B500', desc: 'Inclusive', bgCircle: 'bg-amber-50' },
                        { label: 'PLAN STATUS', value: isSubscribed ? 'Active' : 'Inactive', icon: Shield, color: '#FF6B6B', desc: 'Inactive', bgCircle: 'bg-red-50' },
                        { label: 'MEMBER ID', value: 'LDC-781998', icon: Ticket, color: '#00D4F5', desc: 'Inclusive', bgCircle: 'bg-sky-50' }
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[24px] p-5 relative overflow-hidden text-left">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">{item.label}</span>
                              <div className={`w-8 h-8 rounded-full ${item.bgCircle} flex items-center justify-center`}>
                                <Icon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                            </div>
                            <div className="text-base font-black text-slate-800">{item.value}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{item.desc}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Actions & Vouchers (White Card 2x2 Grid) */}
                    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 sm:p-7 text-left">
                      <h3 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-[#FF8E53]" /> Quick Actions & Vouchers
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-3.5">
                        {[
                          { title: 'Discount Voucher', desc: '10% off on select tour packages', icon: Gift, color: '#FF6B6B', bg: 'bg-rose-50/50' },
                          { title: 'Name Change Policy', desc: 'Update your name for fully refundable', icon: Users, color: '#3B82F6', bg: 'bg-blue-50/50' },
                          { title: 'Quarterly Tours', desc: 'Curated destinations ready to go', icon: MapPin, color: '#FF8E53', bg: 'bg-orange-50/50' },
                          { title: 'Value Protection', desc: 'Non-cash credit validity roll', icon: TrendingUp, color: '#FF6B6B', bg: 'bg-rose-50/50' },
                        ].map((item, i) => {
                          const Icon = item.icon;
                          return (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-2xl border border-slate-100 bg-white/50 hover:bg-slate-50 transition-colors">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                                <Icon className="w-4 h-4" style={{ color: item.color }} />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-700 block">{item.title}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{item.desc}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Download Footer */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-50 border border-rose-100">
                            <Download className="w-4 h-4 text-[#FF6B6B]" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-700 block">Digital Boarding Voucher</span>
                            <span className="text-[10px] text-slate-400 font-semibold">Keep for checkout confirmation</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => window.print()} 
                          className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer text-white bg-[#1E3147] hover:bg-slate-800 transition-colors border-none"
                        >
                          Download All
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* DISCOUNT CREDITS PANEL */}
                {activeTab === 'credits' && (
                  <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 text-left">
                    <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
                      <CreditCard className="w-5 h-5 text-[#FF6B6B]" /> My Discount Credits
                    </h2>
                    <p className="text-xs text-slate-400 mb-5">Non-cash credit value protection for paid tours</p>

                    <div className="bg-gradient-to-r from-[#00D4F5] to-[#3B82F6] rounded-2xl p-6 text-center mb-6 relative overflow-hidden text-white shadow-md">
                      <span className="text-[10px] uppercase tracking-wider font-mono block text-white/80 font-bold">TOTAL WALLET BALANCE</span>
                      <span className="text-4xl font-black block mt-1 text-white">{voucherCount} DC</span>
                      <span className="text-xs text-white/95 mt-1.5 block font-semibold">500-value each, available for paid bookings</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {Array.from({ length: voucherCount }).map((_, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                          className={`rounded-[24px] border border-slate-100 p-5 relative overflow-hidden bg-white shadow-sm`}
                        >
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-r border-slate-100" />
                          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-l border-slate-100" />

                          <div className="flex justify-between items-start">
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
                                <Zap className="w-2.5 h-2.5 animate-pulse" /> ACTIVE
                              </span>
                              <div className="text-2xl font-black text-slate-800 mt-2">500-value</div>
                            </div>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-50">
                              <Gift className="w-4 h-4 text-[#FF6B6B]" />
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex justify-between items-center text-xs">
                            <span className="text-slate-400">Code: <strong className="font-mono text-slate-600">BDN-{idx + 1}04</strong></span>
                            <span className="font-bold flex items-center gap-1 text-emerald-500"><Check className="w-3 h-3" strokeWidth={3} /> Unused</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MEMBER SELECTION STATUS PANEL */}
                {activeTab === 'draws' && (
                  <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 text-left">
                    <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
                      <Ticket className="w-5 h-5 text-[#FF6B6B]" /> Member Selection Status
                    </h2>
                    <p className="text-xs text-slate-400 mb-5">Weekly member selection records and entry preview</p>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="rounded-[24px] border border-slate-100 p-5 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block font-bold">ACTIVE ENTRY TOKEN</span>
                          <span className="text-3xl font-black tracking-widest font-mono mt-1.5 block text-[#00D4F5]">{user?.drawToken || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-3 mt-4">
                          <span>Upcoming Selection:</span>
                          <span className="font-bold text-[#FF8E53] flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Next Sunday
                          </span>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-100 p-5 bg-white shadow-sm flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-emerald-500" /> RNG Test Simulator
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Preview how the weekly selection system works using our RNG simulator.</p>
                        </div>
                        <div className="my-3 min-h-[50px] flex items-center justify-center">
                          {isSimulatingDraw ? (
                            <div className="flex flex-col items-center gap-2 text-xs font-mono text-[#3B82F6]">
                              <Compass className="w-6 h-6 animate-spin text-[#3B82F6]" />
                              <span className="animate-pulse">GENERATING...</span>
                            </div>
                          ) : simulationResult ? (
                            <div className="text-center p-2 rounded-xl text-xs font-bold leading-relaxed bg-slate-50 text-slate-650">
                              {simulationResult}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Ready to simulate</span>
                          )}
                        </div>
                        <button onClick={handleSimulateDraw} disabled={isSimulatingDraw}
                          className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer text-white bg-[#00D4F5] border-none shadow-sm hover:opacity-95"
                        >
                          Launch Preview
                        </button>
                      </div>
                    </div>

                    {/* Footer Notes */}
                    <div className="mt-5 pt-4 border-t border-slate-100 grid md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        Selection cycles close every Saturday 11:59 PM
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium md:justify-end">
                        <Shield className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        Simulation does not affect your entries
                      </div>
                    </div>
                  </div>
                )}

                {/* BOOK TRAVEL PANEL */}
                {activeTab === 'bookings' && (
                  <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 text-left">
                    <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
                      <Plane className="w-5 h-5 text-[#FF6B6B]" /> Book Your Travel
                    </h2>
                    <p className="text-xs text-slate-400 mb-5">Submit request with your discount credits</p>

                    <p className="text-sm text-slate-500 leading-relaxed mb-5">
                      Choose from <strong className="text-slate-700">Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand</strong>.
                      Vouchers are applied automatically.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={onBookPaidTour}
                        className="p-5 rounded-2xl border hover:shadow-md transition-all flex flex-col items-center text-center group no-underline bg-[#FF6B6B]/5 border-slate-200 gap-3 cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden">
                          <img src="/images/book_paid_tour_icon.png" alt="Book Paid Tour" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-700">Book Paid Tour</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Use your discount credits to book premium tours.</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#FF6B6B] flex items-center justify-center mt-1">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </button>

                      <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer"
                        className="p-5 rounded-2xl border hover:shadow-md transition-all flex flex-col items-center text-center group no-underline bg-[#3B82F6]/5 border-slate-200 gap-3"
                      >
                        <div className="w-20 h-20 rounded-2xl overflow-hidden">
                          <img src="/images/selection_support_icon.png" alt="Selection Support" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-700">Selection Support</span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">Need help with selection or have questions?</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center mt-1">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </a>
                    </div>

                    {/* Footer info */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                      Requests are reviewed weekly. Selected entries will be notified via email and dashboard.
                    </div>
                  </div>
                )}

                {/* EDIT PROFILE PANEL */}
                {activeTab === 'edit-profile' && (
                  <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 text-left">
                    <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
                      <Edit className="w-5 h-5 text-[#FF6B6B]" /> Edit Profile Details
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">Manage account details, profile picture, and background</p>

                    <div className="flex flex-col md:flex-row gap-6 items-start w-full">
                      {/* Avatar upload */}
                      <div className="bg-white border border-slate-150 p-4 rounded-2xl flex flex-col items-center gap-3 shrink-0 shadow-sm w-full md:w-[180px]">
                        <span className="text-xs font-bold text-slate-700 uppercase">Profile Pic</span>
                        <div className="relative group">
                          <div className="w-20 h-20 rounded-full p-[3px] shadow-md bg-gradient-to-tr from-[#FF6B6B] to-[#00D4F5]">
                            {profileAvatar ? (
                              <img src={profileAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <div className="w-full h-full rounded-full flex items-center justify-center text-2xl font-black text-white bg-slate-800 uppercase">
                                {editName?.charAt(0) || 'R'}
                              </div>
                            )}
                          </div>
                          <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-[9px] text-white font-bold text-center px-1">Upload</span>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                          </label>
                        </div>
                        <button onClick={() => setProfileAvatar(null)} className="text-[9px] text-red-500 font-bold hover:underline cursor-pointer border-none bg-transparent">Remove</button>
                      </div>

                      {/* Background upload */}
                      <div className="bg-white border border-slate-150 p-4 rounded-2xl flex flex-col items-center gap-3 shrink-0 shadow-sm w-full md:w-[200px]">
                        <span className="text-xs font-bold text-slate-700 uppercase">Dashboard BG</span>
                        <div className="relative group w-36 h-20 rounded-xl overflow-hidden border">
                          <img src={dashboardBg} alt="Background" className="w-full h-full object-cover" />
                          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-[9px] text-white font-bold px-1">Change BG</span>
                            <input type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
                          </label>
                        </div>
                        <button onClick={handleResetBg} className="text-[9px] text-red-500 font-bold hover:underline cursor-pointer border-none bg-transparent">Reset</button>
                      </div>

                      {/* Profile details fields */}
                      <div className="flex-1 space-y-4 w-full">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                          <input
                            type="text;;"
                            value={editName}
                            onChange={(e) => {
                              setEditName(e.target.value);
                              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                            }}
                            className={`w-full px-3 py-2.5 rounded-xl border outline-none text-xs text-slate-700 bg-white ${
                              errors.name ? 'border-red-405' : 'border-slate-200'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => {
                              setEditEmail(e.target.value);
                              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
                          <input
                            type="tel"
                            value={editMobile}
                            onChange={(e) => {
                              setEditMobile(e.target.value);
                              if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address</label>
                          <textarea
                            rows={2}
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none"
                          />
                        </div>
                        <button onClick={handleSaveProfile} className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer text-white bg-[#FF6B6B] border-none shadow-sm hover:opacity-95">Save Changes</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* LUCKY STATUS PANEL */}
                {activeTab === 'lucky-status' && (
                  <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[32px] p-6 text-left">
                    <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
                      <Heart className="w-5 h-5 text-[#FF6B6B]" /> Lucky Status & History
                    </h2>
                    <p className="text-xs text-slate-400 mb-5">Track your weekly eligible entries and active status</p>

                    <div className="grid sm:grid-cols-3 gap-3.5 mb-6">
                      {[
                        { label: 'Selection Schedule', value: 'Every Sunday', desc: 'Weekly selection cycle', bg: 'bg-rose-50/50' },
                        { label: 'Total Weekly Entries', value: '3 Entries', desc: 'Active weeks count', bg: 'bg-sky-50/50' },
                        { label: 'Entry Ticket Status', value: 'Verified Active', desc: 'Ready for next Sunday', bg: 'bg-emerald-50/50' }
                      ].map((item, i) => (
                        <div key={i} className={`p-4 rounded-[20px] border border-slate-100 bg-white shadow-sm`}>
                          <span className="text-[9px] font-black text-[#FF6B6B] uppercase tracking-widest block font-mono">{item.label}</span>
                          <span className="text-sm font-black text-slate-850 block mt-1">{item.value}</span>
                          <span className="text-[9.5px] text-slate-400 mt-0.5 block font-semibold">{item.desc}</span>
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Participation History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                            <th className="py-2.5">Week ID</th>
                            <th className="py-2.5">Selection Date</th>
                            <th className="py-2.5">Ticket ID</th>
                            <th className="py-2.5">Result / Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                          <tr className="bg-sky-50/20">
                            <td className="py-3 font-bold text-[#FF6B6B]">WK-23</td>
                            <td className="py-3 font-bold">June 14, 2026</td>
                            <td className="py-3 font-mono text-[#00D4F5] font-bold">{user?.drawToken || 'LDC-828253'}</td>
                            <td className="py-3"><span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] animate-pulse shadow-sm">Active Entry for Sunday</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-700">WK-22</td>
                            <td className="py-3">June 07, 2026</td>
                            <td className="py-3 font-mono">{user?.drawToken || 'LDC-828253'}</td>
                            <td className="py-3"><span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-[#FF6B6B] border border-rose-100">Not Selected - Voucher Issued</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-700">WK-21</td>
                            <td className="py-3">May 31, 2026</td>
                            <td className="py-3 font-mono">BDN-7612-A</td>
                            <td className="py-3"><span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-[#FF6B6B] border border-rose-100">Not Selected - Voucher Issued</span></td>
                          </tr>
                          <tr>
                            <td className="py-3 font-bold text-slate-700">WK-20</td>
                            <td className="py-3">May 24, 2026</td>
                            <td className="py-3 font-mono">BDN-5521-C</td>
                            <td className="py-3"><span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-[#FF6B6B] border border-rose-100">Not Selected - Voucher Issued</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                      <span className="text-[10px] text-slate-400 font-medium">Showing latest 4 records</span>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.main>

          {/* ==================== RIGHT COLUMN: WIDGETS ==================== */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Featured Hotspot widget */}
            <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[28px] overflow-hidden text-left">
              <div className="flex items-center justify-between px-5 pt-4.5 pb-1.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-sans">
                  <Star className="w-4 h-4 text-[#FF8E53]" /> Featured Hotspot
                </h4>
                <span className="text-[8.5px] bg-[#EAF7FB] text-[#00D4F5] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Handpicked</span>
              </div>
              
              <div className="p-3">
                <div className="rounded-xl overflow-hidden h-[180px] relative bg-slate-900 group cursor-pointer shadow-inner">
                  <img 
                    src="/images/barcelona_hotspot.png" 
                    alt="Barcelona" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
                  
                  {/* Bottom title info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs font-black uppercase tracking-wider">Barcelona</div>
                    <div className="text-[10px] font-bold opacity-80 mt-0.5">The Mediterranean Jewel</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-3 pb-3 pt-0.5">
                <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20want%20to%20book%20a%20tour%20package%20to%20Barcelona." target="_blank" rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer no-underline"
                >
                  Book This Tour <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Membership card widget (Cyan-Blue gradient) */}
            <div className="bg-gradient-to-r from-[#00D4F5] to-[#3B82F6] rounded-[24px] p-5 text-center relative overflow-hidden text-white shadow-md">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />
              <Crown className="w-5 h-5 text-[#F7B500] mx-auto mb-2 relative z-10 animate-bounce" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1.5 relative z-10">Selected • Beduine Elite Member</h4>
              <p className="text-[9.5px] text-white/85 leading-relaxed relative z-10 font-medium">Exclusive access, curated stays, and elevated travel privileges.</p>
              <div className="mt-3.5 pt-2 border-t border-white/20">
                <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="text-[9px] font-bold text-white uppercase tracking-wider underline hover:opacity-90">
                  Discount Credits: Always Active
                </a>
              </div>
            </div>

            {/* Explore Subscribed Destinations widget (Moved to right column) */}
            <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[28px] p-5 text-left">
              <div className="flex justify-between items-center mb-3.5">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-[#FF8E53]" /> Explore Subscribed Destinations
                </span>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="text-[10px] font-bold text-[#3B82F6] hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider"
                >
                  View All
                </button>
              </div>

              {/* Subtitle */}
              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed mb-4">
                Subscribe-favorite travel highlights included in your weekly eligible entries
              </p>

              {/* Vertical destinations list */}
              <div className="flex flex-col gap-2.5">
                {DESTINATIONS.map((dest, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200/50 relative group cursor-pointer h-[75px] shadow-sm">
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white z-10 text-left">
                      <span className="block text-[11px] font-bold leading-tight">{dest.name}</span>
                      <span className="block text-[8px] text-slate-350 leading-tight mt-0.5">{dest.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination controls widget */}
              <div className="flex items-center justify-between mt-4.5 pt-3 border-t border-slate-100">
                <div className="flex gap-1.5">
                  <button className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 cursor-pointer">
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 cursor-pointer">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className={`w-1 h-1 rounded-full ${idx === 0 ? 'bg-[#FF6B6B] w-2.5' : 'bg-slate-250'}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

        </div>
      </div>
    </div>
  );
}
