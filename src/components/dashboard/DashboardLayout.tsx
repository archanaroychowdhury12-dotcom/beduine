import React from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, LogOut, Bell, ChevronLeft, ArrowRight, Phone, Compass, Star, ShieldCheck, Shield 
} from 'lucide-react';

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
  dashboardBg,
  showDemoWallet,
  onGoToAdmin,
  onLogout,
  onBack,
  planName,
  sidebarItems,
  children
}: DashboardLayoutProps) {

  const DESTINATIONS = [
    { name: 'Kashmir Valley', desc: 'Majestic Lakes', img: '/images/kashmir_valley_card.png' },
    { name: 'Darjeeling Hills', desc: 'Tea Gardens', img: '/images/darjeeling_hills_card.png' },
    { name: 'Puri-Gokarna Beach', desc: 'Serene Coastline', img: '/images/gokarna_beach_card.png' },
    { name: 'Sundarbans Forest', desc: 'Misty Mangroves', img: '/images/sundarbans_forest_card.png' }
  ];

  return (
    <div 
      className="min-h-screen pt-2 lg:pt-3 pb-10 relative overflow-x-hidden text-slate-808 bg-[#F8FAFC]"
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

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SUB HEADER: Back Button & User Info / Notifications */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-3.5 px-4 gap-4"
        >
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/80 shadow-sm text-xs font-bold text-slate-750 hover:text-[#FF6B6B] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF6B6B]" />
              <span>Back to Home</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-2 rounded-full border border-white/80 shadow-sm">
            <span className="text-xs font-bold text-slate-800">{profileName}</span>
            <div className="w-px h-3.5 bg-slate-300" />
            <Bell onClick={() => setActiveTab('notifications')} className="w-4 h-4 cursor-pointer text-slate-600 hover:text-[#FF6B6B] transition-colors" />
            {profileAvatar ? (
              <img 
                onClick={() => setActiveTab('profile')} 
                src={profileAvatar} 
                alt="Avatar" 
                className="w-5.5 h-5.5 rounded-full cursor-pointer object-cover border border-[#FF6B6B]/20 hover:border-[#FF6B6B] hover:scale-105 active:scale-95 transition-all shadow-sm"
              />
            ) : (
              <div 
                onClick={() => setActiveTab('profile')} 
                className="w-5.5 h-5.5 rounded-full cursor-pointer flex items-center justify-center bg-gradient-to-tr from-[#FF6B6B] to-[#00D4F5] hover:from-[#FF6B6B] hover:to-[#FF6B6B] text-[10px] font-black text-white uppercase select-none transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                {profileName?.charAt(0) || 'R'}
              </div>
            )}
          </div>
        </motion.div>

        {/* MAIN 3-COLUMN LAYOUT */}
        <div className="grid md:grid-cols-[1fr_320px] lg:grid-cols-[280px_1fr_320px] xl:grid-cols-[300px_1fr_340px] gap-6 lg:gap-7 items-start">

          {/* ==================== LEFT COLUMN: SIDEBAR ==================== */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-2 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] p-6.5 rounded-[30px] sticky top-4 max-h-[92vh] overflow-y-auto animate-fadeIn text-left"
          >
            {/* Logo and company headers */}
            <div className="flex items-center gap-3.5 px-2.5 py-2 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-orange-100 bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
                <img src="/images/bedune_logo_transparent.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-black tracking-wide block text-[#FF6B6B] leading-none">BEDUINE</span>
                <span className="text-[9.5px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono leading-none mt-1.5">Tour &amp; Travels</span>
              </div>
            </div>

            {/* Admin Command Center Link */}
            {showDemoWallet && onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="w-full mb-4 px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200 border-none text-[13.5px] font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Admin Command Center</span>
              </button>
            )}

            {/* Menu Header category */}
            <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 font-mono">
              Dashboard Menu
            </div>

            {/* 11 Navigation Tab Links list */}
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 border-none text-[13.5px] ${
                      isActive
                        ? 'font-bold bg-[#FF6B6B]/10 text-[#FF6B6B]'
                        : 'font-medium text-slate-500 hover:bg-orange-50/40 bg-transparent hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B6B]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#FF6B6B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="w-full mt-4 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-[13.5px] font-bold border-none bg-transparent hover:bg-red-50/50 hover:translate-x-0.5 text-red-500"
            >
              <LogOut className="w-4 h-4 text-red-400" /> Log Out
            </button>
          </motion.aside>

          {/* ==================== MOBILE MENU OPTIONS HORIZONTAL SCROLLABLE BAR ==================== */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 px-1 scrollbar-hide">
            {showDemoWallet && onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all text-xs font-black border-none shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all text-xs font-bold border-none shadow-sm ${
                    isActive ? 'text-white bg-[#FF6B6B]' : 'text-slate-500 bg-white border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white text-[#FF6B6B]' : 'bg-[#FF6B6B] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={onLogout}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-red-500 bg-white border border-slate-100 hover:bg-red-50/20 text-xs font-bold border-none shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>

          {/* ==================== CENTER COLUMN: TABS CONTAINER ==================== */}
          <motion.main 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            {children}
          </motion.main>

          {/* ==================== RIGHT COLUMN: HOTSPOTS AND WIDGETS ==================== */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {!planName ? (
              <>
                {/* Start Your Journey */}
                <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1 space-y-1.5 font-sans">
                    <h3 className="text-sm sm:text-base font-black text-slate-808 leading-tight">Start Your Journey</h3>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Choose a subscription plan and begin your travel story today.
                    </p>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#FF8E53] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-100 cursor-pointer border-none flex items-center gap-1.5 mt-2.5 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      View Subscription Plans <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="w-20 h-20 shrink-0 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden p-1 shadow-sm">
                    <img src="/images/passport_journey.png" alt="Passport" className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Popular Destinations */}
                <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4 font-sans">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Popular Destinations</h3>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="text-[10px] font-bold text-blue-500 hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4 font-sans">
                    {/* Destination 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src="/images/kashmir_dal_lake_1779521728036.png" alt="Kashmir Valley" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-808">Kashmir Valley</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                          <Compass className="w-2.5 h-2.5 text-slate-400" /> Paradise on Earth
                        </div>
                      </div>
                    </div>
                    {/* Destination 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src="/images/goa_beaches.png" alt="Goa Beaches" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-808">Goa Beaches</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                          <Compass className="w-2.5 h-2.5 text-slate-400" /> Sun, Sand & Serenity
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help? */}
                <div className="bg-sky-50/40 border border-sky-100/60 shadow-[0_4px_20px_rgba(59,130,246,0.02)] rounded-[24px] p-5 text-left flex items-center gap-4 hover:shadow-md transition-shadow font-sans">
                  <div className="w-10 h-10 rounded-full bg-white border border-sky-100 flex items-center justify-center shrink-0 shadow-sm text-blue-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs font-black text-slate-808">Need Help?</h4>
                    <p className="text-[10px] text-slate-505 leading-none font-medium">We are here for you!</p>
                    <button
                      onClick={() => setActiveTab('support')}
                      className="text-[10px] font-bold text-blue-600 hover:underline bg-transparent border-none cursor-pointer mt-1.5 flex items-center gap-0.5 p-0"
                    >
                      Contact Support <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Barcelona Hotspot card */}
                <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left hover:shadow-md transition-shadow flex flex-col gap-4">
                  <div className="flex items-center justify-between font-sans">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#FF8E53]" /> Featured Hotspot
                    </h4>
                    <span className="text-[9px] bg-sky-50 text-[#00D4F5] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Handpicked</span>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden h-40 relative bg-slate-900 group cursor-pointer shadow-inner">
                    <img 
                      src="/images/barcelona_hotspot.png" 
                      alt="Barcelona" 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-sm font-black uppercase tracking-wider">Barcelona</div>
                      <div className="text-[10px] font-bold opacity-85 mt-0.5">The Mediterranean Jewel</div>
                    </div>
                  </div>

                  <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%252520want%252520to%252520book%252520a%252520tour%25252520to%2525252520Barcelona." target="_blank" rel="noreferrer"
                    className="w-full py-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] hover:border-slate-300 active:scale-[0.99] cursor-pointer no-underline"
                  >
                    Book This Tour <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Elite membership benefits card */}
                <div className="bg-gradient-to-r from-[#00D4F5] to-[#3B82F6] rounded-[24px] p-5 sm:p-6 text-center relative overflow-hidden text-white shadow-md hover:shadow-lg transition-all duration-300">
                  <Crown className="w-6 h-6 text-yellow-300 mx-auto mb-2.5 animate-bounce" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1.5">Selected • Beduine Elite Member</h4>
                  <p className="text-[10px] text-white/80 leading-relaxed font-semibold">Exclusive entry credits, weekly selection eligibility and name changes protected.</p>
                  <div className="mt-4 pt-2.5 border-t border-white/20">
                    <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="text-[9.5px] font-bold text-white uppercase tracking-wider underline hover:opacity-90">
                      Discount Credits: Always Active
                    </a>
                  </div>
                </div>

                {/* Destinations card list */}
                <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3 font-sans">
                    <span className="text-xs font-black text-slate-705 flex items-center gap-1.5 uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-[#FF8E53]" /> Explore Destinations
                    </span>
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className="text-[9.5px] font-bold text-[#3B82F6] hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider"
                    >
                      View All
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mb-4">
                    Explore popular travel highlights included in your membership plans
                  </p>

                  <div className="flex flex-col gap-2.5 font-sans">
                    {DESTINATIONS.map((dest, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-slate-200/50 relative group cursor-pointer h-16 shadow-sm">
                        <img
                          src={dest.img}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 text-left">
                          <span className="block text-[11px] font-bold leading-tight">{dest.name}</span>
                          <span className="block text-[8px] text-slate-350 leading-tight mt-0.5">{dest.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.aside>

        </div>

        {/* ==================== PREMIUM FOOTER BAR ==================== */}
        <div className="mt-8 pt-5 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-[10px] font-medium font-sans">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-505 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-slate-700 font-extrabold text-[10px]">100% Secure Payments</span>
                <span className="block text-slate-400 text-[8.5px] font-medium mt-0.5">Your payment is safe with us</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-505 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-slate-700 font-extrabold text-[10px]">Best Price Guarantee</span>
                <span className="block text-slate-400 text-[8.5px] font-medium mt-0.5">We offer the best prices</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-slate-700 font-extrabold text-[10px]">24/7 Customer Support</span>
                <span className="block text-slate-400 text-[8.5px] font-medium mt-0.5">We are always here to help</span>
              </div>
            </div>
          </div>
          <div className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] font-mono">
            © 2025 Beduine Tour & Travels. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
