import React from 'react';
import { ChevronLeft, Grid3X3, LogOut, Plane, Settings } from 'lucide-react';

export interface DashboardLayoutProps {
  user: any;
  profileName: string;
  profileAvatar: string | null;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  dashboardBg: string;
  showDemoWallet: boolean;
  onGoToAdmin?: () => void;
  onLogout: () => void;
  onBack?: () => void;
  planName: string | null;
  sidebarItems: { id: string; label: string; icon: any; badge?: number }[];
  children: React.ReactNode;
}

export function DashboardLayout({
  profileName,
  profileAvatar,
  activeTab,
  setActiveTab,
  showDemoWallet,
  onGoToAdmin,
  onLogout,
  onBack,
  sidebarItems,
  children
}: DashboardLayoutProps) {
  const compactItems = sidebarItems.slice(0, 9);

  return (
    <div className="min-h-screen bg-[#f3f8ff] text-[#15345b] font-sans pb-20 lg:pb-0">
      {/* Background visual routes & planes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white via-[#eef7ff] to-transparent" />
        <Plane className="absolute right-8 top-8 h-9 w-9 rotate-[-18deg] text-[#0877db]/15" />
        <Plane className="absolute left-[42%] top-16 h-7 w-7 rotate-[18deg] text-[#f97316]/10" />
        <svg className="absolute right-20 top-11 h-24 w-96 text-[#9bd0f6]/40" viewBox="0 0 420 100" fill="none">
          <path d="M3 70C68 18 111 96 169 48C226 1 275 21 307 51C339 81 371 76 417 19" stroke="currentColor" strokeWidth="3" strokeDasharray="8 10" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative mx-auto grid max-w-[1800px] grid-cols-1 gap-4 p-3 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-4">
        {/* Sidebar Panel - Redesigned to match high-fidelity mockup */}
        <aside className="hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_35px_rgba(16,35,63,0.03)] lg:block sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto no-scrollbar flex flex-col justify-between">
          <div className="p-5 space-y-4">
            {/* Top Logo - Centered */}
            <div className="flex justify-center py-2">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-md bg-white shrink-0">
                <img src="/images/bedune_logo_cropped.png" alt="Beduine Logo" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Slogan - Centered */}
            <div className="text-center space-y-0.5">
              <p className="text-lg font-black uppercase tracking-wide leading-none text-[#0284c7]">YOUR JOURNEY.</p>
              <p className="text-lg font-black uppercase tracking-wide leading-none text-[#f97316]">OUR PROMISE.</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#65a30d] block pt-1">SAFAR JO YAD RAHE</p>
            </div>

            {/* Mountain Sea Illustration Container */}
            <div className="h-32 rounded-2xl overflow-hidden relative shadow-inner bg-sky-100">
              <svg viewBox="0 0 400 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
                <defs>
                  <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E0F2FE" />
                    <stop offset="100%" stopColor="#BAE6FD" />
                  </linearGradient>
                  <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                  <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#0369A1" />
                  </linearGradient>
                  <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="100%" stopColor="#0C4A6E" />
                  </linearGradient>
                </defs>
                <rect width="400" height="150" fill="url(#skyGrad)" />
                <circle cx="280" cy="50" r="25" fill="#FFF" opacity="0.85" />
                <circle cx="280" cy="50" r="35" fill="#FFF" opacity="0.25" />
                <path d="M-20 150 L80 60 L180 150 Z" fill="url(#mountainGrad1)" opacity="0.7" />
                <path d="M120 150 L220 70 L320 150 Z" fill="url(#mountainGrad1)" opacity="0.6" />
                <path d="M240 150 L310 90 L380 150 Z" fill="url(#mountainGrad1)" opacity="0.8" />
                <path d="M30 150 L140 45 L250 150 Z" fill="url(#mountainGrad2)" />
                <path d="M170 150 L270 55 L370 150 Z" fill="url(#mountainGrad2)" />
                <rect y="125" width="400" height="25" fill="url(#seaGrad)" />
                <path d="M0 128 Q100 125 200 128 T400 128" stroke="#38BDF8" strokeWidth="1.5" opacity="0.6" />
                <path d="M0 138 Q100 135 200 138 T400 138" stroke="#BAE6FD" strokeWidth="1.5" opacity="0.4" />
                <g transform="translate(100, 35) rotate(-10) scale(0.6)">
                  <path d="M0 10 C15 10 35 15 45 15 C50 15 55 12 58 10 C50 8 30 5 0 10 Z" fill="#0284C7" />
                  <path d="M15 10 L8 -8 L14 -8 L22 10 Z" fill="#F97316" />
                  <path d="M18 10 L28 25 L32 25 L24 10 Z" fill="#0284C7" />
                  <path d="M42 15 L48 22 L45 22 L38 15 Z" fill="#F97316" />
                </g>
                <g transform="translate(15, 128) scale(0.8)">
                  <path d="M0 0 Q-5 -25 -12 -50" stroke="#0F172A" strokeWidth="3" fill="none" />
                  <path d="M-12 -50 Q-25 -52 -35 -45" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                  <path d="M-12 -50 Q-28 -60 -25 -70" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                  <path d="M-12 -50 Q-12 -65 -2 -72" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                  <path d="M-12 -50 Q5 -55 12 -45" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                </g>
                <g transform="translate(375, 128) scale(0.9)">
                  <path d="M0 0 Q5 -30 15 -55" stroke="#0F172A" strokeWidth="3.5" fill="none" />
                  <path d="M15 -55 Q25 -52 35 -40" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                  <path d="M15 -55 Q28 -68 22 -75" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                  <path d="M15 -55 Q10 -70 0 -72" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                  <path d="M15 -55 Q-5 -58 -10 -45" stroke="#0F172A" strokeWidth="2.5" fill="none" />
                </g>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 to-transparent" />
            </div>

            {/* Blue Banner - 10. SIDEBAR MENU / NAVIGATION */}
            <div className="bg-[#0e70e3] text-white text-[10px] font-black py-2 px-3 text-center rounded-xl uppercase tracking-wider shadow-sm">
              10. SIDEBAR MENU / NAVIGATION
            </div>

            {/* Smaller Logo below banner */}
            <div className="flex justify-center py-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-white shrink-0">
                <img src="/images/bedune_logo_cropped.png" alt="Beduine Logo Small" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* White Card Enclosing Navigation Menu */}
            <nav className="bg-white border border-slate-100 rounded-[20px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-1">
              {showDemoWallet && onGoToAdmin && (
                <button
                  onClick={onGoToAdmin}
                  className="mb-2 flex w-full items-center gap-3 rounded-xl bg-orange-500 px-4 py-2.5 text-left text-xs font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  <Grid3X3 className="h-4.5 w-4.5" />
                  Admin Command
                </button>
              )}
              {compactItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#ff5500] text-white shadow-sm'
                        : 'bg-transparent text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-[#1d70b8]'}`} />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}

              <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-left text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="h-4.5 w-4.5 shrink-0 text-red-500" />
                Logout
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Explore Card */}
          <div className="p-4 border-t border-slate-50">
            <div className="relative overflow-hidden rounded-[20px] bg-slate-50 border border-slate-100 p-4 min-h-[140px] flex flex-col justify-between text-left">
              {/* Background image on the right */}
              <div className="absolute right-0 bottom-0 top-0 w-[45%] bg-[url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent w-[65%]" />
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-black text-[#1d70b8] uppercase tracking-wide block">Explore The World</span>
                <p className="text-[9px] text-slate-400 font-bold leading-normal">Amazing destinations<br/>await you.</p>
              </div>
              <button onClick={() => setActiveTab('bookings')} className="relative z-10 self-start px-4 py-2 bg-[#ff5500] hover:bg-orange-600 transition text-white font-bold text-[9px] uppercase tracking-wider rounded-xl border-none cursor-pointer">
                Book Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="min-w-0">
          {/* Mobile Header */}
          <div className="mb-3 flex items-center justify-between gap-3 rounded-[20px] border border-slate-100 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden text-left">
            {onBack && (
              <button onClick={onBack} className="rounded-full bg-slate-50 p-2 text-slate-600 border border-slate-100 hover:bg-slate-100">
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#00D4F5] to-[#FF6B6B] flex items-center justify-center shadow-sm">
                <Plane className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-black text-slate-800 tracking-wider">BEDUINE</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('profile')} className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <Settings className="h-4 w-4" />
              </button>
              {profileAvatar ? (
                <img src={profileAvatar} alt={profileName} className="h-8 w-8 rounded-full object-cover border" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white uppercase">
                  {profileName.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Page Tabs */}
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[20px] border border-slate-100 bg-white/95 px-2 py-2 shadow-lg backdrop-blur lg:hidden">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar justify-between">
          {compactItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex min-w-[64px] flex-col items-center gap-1 rounded-xl py-1.5 text-[9px] font-bold transition-all ${
                  isActive ? 'bg-orange-50 text-orange-500' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="max-w-[60px] truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
