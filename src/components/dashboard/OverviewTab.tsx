import { 
  Crown, Calendar, Shield, CheckCircle2, Sparkles, CreditCard, 
  Plane, Clock, Tag, Compass, Bell, Plus, ArrowRight, Info 
} from 'lucide-react';
import { demoWalletService } from '../../services/demoWalletService';
import { supabase } from '../../utils/supabaseClient';

export interface OverviewTabProps {
  user: any;
  profileName: string;
  planName: string | null;
  planType: string;
  memberId: string;
  bookingStatus: 'Pending Confirmation' | 'Cancelled';
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
  user,
  profileName,
  planName,
  planType,
  memberId,
  bookingStatus,
  availableDiscountCredits,
  discountCreditBalance,
  domesticDiscountCredits,
  internationalDiscountCredits,
  availableLuckyDrawCredits,
  isWeeklyActivated,
  setActiveTab,
  showDemoWallet,
  demoWalletBalance,
  setDemoWalletBalance,
  setDemoTransactions,
  displayedCoupons,
  displayedNotifications,
  onBookPaidTour
}: OverviewTabProps) {

  const renderInactiveOverview = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Header and Demo Balance Container */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="text-left">
            <h1 className="text-slate-800 text-4xl font-black mt-1 leading-tight tracking-tight">
              <span className="block text-slate-500 font-medium text-lg leading-normal font-sans">Welcome back,</span>
              <span className="flex items-center gap-2 font-sans">{profileName} 👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium font-sans">
              Start your journey with Beduine and unlock amazing travel rewards.
            </p>
          </div>

          {/* Demo Balance Widget */}
          {showDemoWallet && (
            <div className="relative shrink-0 w-full md:w-72 bg-white border border-slate-200/80 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-4 text-left z-20 font-sans">
              {/* Target Indicator dot at top-right corner to match screenshot */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Demo Balance:</span>
                    <span className="text-[15px] font-extrabold text-blue-600">₹{demoWalletBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2.5 space-y-1.5">
                <button
                  onClick={async () => {
                    const amountStr = prompt("Enter amount to add to Demo Wallet:", "5000");
                    if (amountStr) {
                      const amount = parseFloat(amountStr);
                      if (!isNaN(amount) && amount > 0) {
                        const res = await demoWalletService.addDemoBalance(user.id, amount);
                        if (res.success) {
                          setDemoWalletBalance(res.balance);
                          const txns = await demoWalletService.getDemoTransactions(user.id);
                          setDemoTransactions(txns);
                          await supabase.auth.updateUser({
                            data: {
                              demo_wallet_balance: res.balance,
                              demo_transactions: txns
                            }
                          });
                          alert(res.message);
                        } else {
                          alert(res.message);
                        }
                      } else {
                        alert("Invalid amount entered.");
                      }
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-400" />
                  <span>Add Demo Balance</span>
                </button>
                <button
                  onClick={() => setActiveTab('credits')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>View Logs</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Big Banner Card */}
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-left relative overflow-hidden bg-gradient-to-br from-white to-slate-50/20">
          <div className="w-40 h-40 shrink-0 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden p-2">
            <img src="/images/login_suitcase.png" alt="Travel Luggage" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3.5 flex-1 font-sans">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              Your travel membership is not active yet.
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
              Subscribe to a plan to unlock TRC, Discount Credits, member benefits and weekly reward participation.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('subscription')}
                className="px-5 py-2.5 bg-[#FF6B6B] hover:bg-[#FF8E53] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-200 cursor-pointer border-none flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Plans <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 hover:border-slate-300"
              >
                How It Works <Info className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
          {/* Card 1: Subscription Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Subscription Status</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">No Active Subscription</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Choose a plan to get started and enjoy exclusive benefits.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-[#FF6B6B] border border-rose-100 uppercase tracking-wide">
                  Inactive
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: TRC */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-emerald-550" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Travel Reward Credit (TRC)</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">No TRC Available</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                TRC will be issued after successful subscription purchase.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                  0 TRC
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Discount Credits */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Discount Credits</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">No Discount Credits</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Discount Credits will be added after subscription activation.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-500 border border-indigo-100 uppercase tracking-wide">
                  0 CREDITS
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Membership Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-sky-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Membership Status</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">Inactive</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Your membership will become active after payment success.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-sky-600 border border-sky-100 uppercase tracking-wide">
                  Inactive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!planName) {
    return renderInactiveOverview();
  }

  return (
    <div className="space-y-6">
      {/* Sub Header Title inside Main content column */}
      <div className="text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] font-mono block">Dashboard Home</span>
        <h1 className="text-slate-800 font-serif text-3xl font-black mt-1 leading-tight">Welcome back, {profileName}!</h1>
      </div>

      {/* 9 overview grid status cards as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Active Plan */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Active Plan</span>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Crown className="w-4.5 h-4.5 text-[#FF6B6B]" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-800 leading-tight uppercase">
            {planName || "No active subscription yet."}
          </div>
          <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
            {planName ? `${planType} Membership` : "Inactive"}
          </div>
        </div>

        {/* Card 2: Subscription Validity */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Subscription Validity</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-emerald-550" />
            </div>
          </div>
          {planName ? (
            <>
              <div className="text-[11px] font-bold text-slate-700 leading-normal">
                <div>Start: <strong className="text-slate-900 font-bold">June 20, 2026</strong></div>
                <div className="mt-0.5">Expiry: <strong className="text-[#FF6B6B]">June 20, 2027</strong></div>
              </div>
              <div className="text-[9px] text-emerald-600 font-bold uppercase mt-1 tracking-wider">Annual Renewal</div>
            </>
          ) : (
            <div className="text-sm font-bold text-slate-755 leading-tight mt-1">No active subscription yet.</div>
          )}
        </div>

        {/* Card 3: Membership Status */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Membership Status</span>
            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-[#00D4F5]" />
            </div>
          </div>
          {planName ? (
            <>
              <div className="text-lg font-black text-slate-800 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Verified Active
              </div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">ID: {memberId}</div>
            </>
          ) : (
            <>
              <div className="text-lg font-black text-slate-800 flex items-center gap-1.5 mt-1">
                Inactive
              </div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">ID: Inactive</div>
            </>
          )}
        </div>

        {/* Card 4: Weekly Participation Status */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Travel Reward Status</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-purple-500" />
            </div>
          </div>
          {!planName || availableLuckyDrawCredits === 0 ? (
            <div className="text-sm font-bold text-slate-700 leading-tight mt-1">No Travel Reward Credit available.</div>
          ) : isWeeklyActivated ? (
            <>
              <div className="text-base font-black text-emerald-600 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> WK-23 Locked
              </div>
              <div className="text-[9px] text-slate-455 mt-1.5 font-bold uppercase tracking-wider font-mono">Cut-off Sunday 8:00 PM</div>
            </>
          ) : (
            <>
              <div className="text-sm font-bold text-slate-700 leading-tight">Pending Activation</div>
              <button
                onClick={() => {
                  setActiveTab('weekly-participation');
                  setTimeout(() => {
                    const btn = document.getElementById('activate-weekly-btn');
                    if (btn) btn.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="mt-1.5 px-3 py-1 rounded-full text-[9px] font-bold text-white bg-[#FF6B6B] border-none cursor-pointer hover:opacity-90 inline-block shadow-sm"
              >
                Activate Entry
              </button>
            </>
          )}
        </div>

        {/* Card 5: Discount-Credit Balance */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Discount Balance</span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5 text-indigo-500" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-800 leading-tight">
            {availableDiscountCredits > 0 ? `₹${discountCreditBalance.toLocaleString('en-IN')}` : "No Discount Credits available."}
          </div>
          {availableDiscountCredits > 0 ? (
            <div className="text-[9.5px] text-indigo-500 font-bold mt-1 uppercase tracking-wider font-mono">
              {domesticDiscountCredits} Dom (₹500) & {internationalDiscountCredits} Intl (₹5,000) active
            </div>
          ) : null}
        </div>

        {/* Card 6: Pending Bookings */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Pending Bookings</span>
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
              <Plane className="w-4.5 h-4.5 text-amber-500" />
            </div>
          </div>
          {bookingStatus === 'Pending Confirmation' ? (
            <>
              <div className="text-base font-bold text-slate-800">Puri Beach Escape</div>
              <div className="inline-flex items-center gap-1 mt-1 text-[8.5px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 font-mono">
                <Clock className="w-2.5 h-2.5" /> Under Review
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-black text-slate-400 mt-1">No Pending Bookings</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">All Clear</div>
            </>
          )}
        </div>

        {/* Card 7: Coupon Status */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Coupon Status</span>
            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center">
              <Tag className="w-4.5 h-4.5 text-pink-500" />
            </div>
          </div>
          {planName ? (
            <>
              <div className="text-base font-black text-slate-805">{displayedCoupons.filter(c => c.status === 'Active').length} Coupons Available</div>
              <div className="text-[9px] text-[#FF6B6B] font-bold uppercase mt-1 tracking-wider">WELCOME10 Active</div>
            </>
          ) : (
            <>
              <div className="text-base font-black text-slate-400 mt-1">No Coupons Available</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">0 Vouchers</div>
            </>
          )}
        </div>

        {/* Card 8: Next Scheduled Activity */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Next Activity</span>
            <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center">
              <Compass className="w-4.5 h-4.5 text-cyan-500" />
            </div>
          </div>
          <div className="text-[11px] font-bold text-slate-700 leading-normal">
            <div>Weekly Selection: <strong className="text-slate-900 font-bold">Sunday 8:00 PM</strong></div>
            <div className="mt-0.5">Pre-travel Call: <strong className="text-slate-900 font-bold">July 02, 2026</strong></div>
          </div>
        </div>

        {/* Card 9: Recent Notifications feed preview */}
        <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Recent Alerts</span>
            <Bell className="w-4 h-4 text-slate-350 shrink-0" />
          </div>
          <div className="space-y-1.5 text-[10px] text-slate-500 leading-normal">
            {displayedNotifications.slice(0, 2).map((n) => (
              <div key={n.id} className="flex items-start gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] mt-1 shrink-0" />
                <p className="truncate font-semibold"><strong className="text-slate-700">{n.title}:</strong> {n.message}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('notifications')} className="text-[9px] text-[#00D4F5] hover:underline font-bold uppercase mt-2.5 tracking-wider block border-none bg-transparent">
            View All Alerts
          </button>
        </div>
      </div>

      {/* WhatsApp Helpdesk Banner Card inside Main panel column */}
      <div className="bg-slate-900 border border-white/5 shadow-[0_10px_35px_rgba(0,0,0,0.12)] rounded-[28px] p-5 sm:p-7 text-white text-left font-sans">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#138A8A] to-[#00D4F5] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#138A8A]/25">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">Customer Helpdesk</span>
              <span className="text-sm font-extrabold text-white">Need customized itineraries or booking vouchers? Chat instantly.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center px-5 py-3 rounded-full text-xs font-bold text-white bg-[#138A8A] hover:bg-[#0e6d6d] shadow-md shadow-[#138A8A]/10 cursor-pointer no-underline border-none">
              WhatsApp Support
            </a>
            <button onClick={onBookPaidTour} className="flex-1 md:flex-none px-5 py-3 rounded-full text-xs font-bold text-[#1E3147] bg-white hover:bg-slate-100 shadow-md cursor-pointer border-none">
              Book Paid Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
