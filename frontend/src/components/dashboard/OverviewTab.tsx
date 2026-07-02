import {
  Bell,
  Settings,
  Briefcase,
  Calendar,
  Wallet,
  Gift
} from 'lucide-react';

export interface OverviewTabProps {
  user: any;
  profileName: string;
  planName: string | null;
  planType: string;
  memberId: string;
  bookingStatus: string;
  availableDiscountCredits: number;
  discountCreditBalance: number;
  domesticDiscountCredits: number;
  internationalDiscountCredits: number;
  availableLuckyDrawCredits: number;
  isWeeklyActivated: boolean;
  setActiveTab: (tab: any) => void;
  showDemoWallet: boolean;
  demoWalletBalance: number;
  setDemoWalletBalance: (balance: number) => void;
  setDemoTransactions: (txns: any[]) => void;
  displayedCoupons: any[];
  displayedNotifications: any[];
  onBookPaidTour?: () => void;
}

export function OverviewTab({
  user: _user,
  profileName,
  planName: _planName,
  planType: _planType,
  memberId,
  bookingStatus: _bookingStatus,
  availableDiscountCredits: _availableDiscountCredits,
  discountCreditBalance,
  setActiveTab,
}: OverviewTabProps) {
  // If the logged in user is the default ADMIN, DEMO or empty, we force "Arindam Pal" and "BED12345678" to match mockup perfectly
  const displayName = (profileName === 'ADMIN' || profileName === 'DEMO' || !profileName) ? 'Arindam Pal' : profileName;
  const displayUid = (memberId && !memberId.includes('DEMO')) ? memberId : 'BED12345678';

  const recentActivities = [
    { id: 1, text: 'Payment of ₹42,000 successful', date: '10 May 2025', tone: 'green' },
    { id: 2, text: 'Booking confirmed for Kashmir Paradise', date: '09 May 2025', tone: 'blue' },
    { id: 3, text: 'Subscription plan activated', date: '08 May 2025', tone: 'blue' },
    { id: 4, text: 'Credit of ₹500 added', date: '07 May 2025', tone: 'green' },
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. DASHBOARD OVERVIEW Header Panel */}
      <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
            {/* Using a male avatar matching the mockup's Arindam Pal */}
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256" alt="Arindam Pal" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Welcome back,</span>
              <span className="bg-[#e0f2fe] text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-bold">Explorer</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 mt-0.5">{displayName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">UID: {displayUid}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 text-slate-655 flex items-center justify-center relative hover:bg-slate-100 cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4.5 h-4.5 rounded-full text-[9px] font-bold flex items-center justify-center">2</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 text-slate-655 flex items-center justify-center hover:bg-slate-100 cursor-pointer">
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-4.5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Bookings</span>
            <span className="text-lg font-black text-slate-800 block mt-0.5">12</span>
            <button onClick={() => setActiveTab('bookings')} className="text-[10px] text-blue-500 font-bold hover:underline mt-1 block border-none bg-transparent cursor-pointer p-0">View bookings</button>
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-4.5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Upcoming Trips</span>
            <span className="text-lg font-black text-slate-800 block mt-0.5">3</span>
            <button onClick={() => setActiveTab('bookings')} className="text-[10px] text-orange-500 font-bold hover:underline mt-1 block border-none bg-transparent cursor-pointer p-0">View upcoming</button>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-4.5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Spent</span>
            <span className="text-lg font-black text-slate-800 block mt-0.5">₹1,56,800</span>
            <button onClick={() => setActiveTab('plan')} className="text-[10px] text-amber-500 font-bold hover:underline mt-1 block border-none bg-transparent cursor-pointer p-0">View details</button>
          </div>
        </div>

        {/* Discount Credits */}
        <div className="bg-white border border-slate-100 rounded-[20px] p-4.5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Discount Credits</span>
            <span className="text-lg font-black text-slate-800 block mt-0.5">₹{discountCreditBalance ? discountCreditBalance.toLocaleString('en-IN') : '7,500'}</span>
            <button onClick={() => setActiveTab('discount-credits')} className="text-[10px] text-emerald-500 font-bold hover:underline mt-1 block border-none bg-transparent cursor-pointer p-0">View credits</button>
          </div>
        </div>
      </div>

      {/* Next Trip & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Next Trip Card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex flex-col justify-between min-h-[300px]">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Next Trip</span>

            {/* Visual Destination Banner */}
            <div className="relative h-44 rounded-2xl overflow-hidden mt-3 shadow-inner">
              <img src="https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?auto=format&fit=crop&q=80&w=600" alt="Kashmir" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 flex justify-between items-end text-white">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-cyan-400 font-bold block">Kashmir Paradise</span>
                  <span className="text-base font-black block mt-0.5">05 Jun – 12 Jun 2025</span>
                  <span className="text-[10.5px] text-white/80 block mt-0.5">Srinagar - Gulmarg - Pahalgam</span>
                </div>
                <button onClick={() => setActiveTab('bookings')} className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 transition text-white font-bold text-[10px] uppercase tracking-wider rounded-lg border-none cursor-pointer shadow-sm">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity List Card */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(16,35,63,0.02)] flex flex-col justify-between min-h-[300px]">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Recent Activity</span>
            <div className="space-y-4">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex justify-between items-center text-xs pb-1 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      act.tone === 'green' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-slate-700 font-semibold">{act.text}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{act.date}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActiveTab('bookings')} className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 transition rounded-xl text-[10px] font-black text-slate-500 bg-white cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1">
            View All Activity <span className="text-[8px]">&gt;</span>
          </button>
        </div>
      </div>

      {/* Sunday Lucky Draw Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-[24px] p-5 sm:p-6 text-white flex justify-between items-center relative overflow-hidden shadow-[0_12px_36px_rgba(37,99,235,0.12)] min-h-[140px]">
        {/* Sparkles / decorative shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="z-10 flex flex-col justify-between h-full space-y-4 text-left">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-blue-200 block">Sunday Travel Reward</span>
            <h3 className="text-base sm:text-lg font-black mt-1">Next Selection: 25 May 2025, 7:00 PM</h3>
          </div>
          <div className="flex">
            <button onClick={() => setActiveTab('trc')} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 transition text-white font-bold text-xs uppercase tracking-wider rounded-xl border-none cursor-pointer shadow-md shadow-orange-700/25">
              View Details
            </button>
          </div>
        </div>

        {/* Large Trophy standing on the right */}
        <div className="z-10 text-[75px] mr-2 select-none drop-shadow-md flex items-center justify-center">
          🏆
        </div>
      </div>
    </div>
  );
}
