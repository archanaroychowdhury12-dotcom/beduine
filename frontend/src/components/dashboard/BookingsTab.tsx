import React from 'react';
import { 
  Plane, Route, CheckCircle2, Share2, Check, Copy, 
  Bell, Trash2
} from 'lucide-react';
import { CustomTourForm } from '../../pages/main-website-tour-page/custom-tour/CustomTourForm';
import { CustomTourDetailPanel } from '../../pages/main-website-tour-page/custom-tour/CustomTourDetailPanel';
import type { CustomTourRequest } from '../../types';
import type { CustomTourCreateInput } from '../../services/customTourService';

// ==================== TOUR BOOKINGS TAB ====================
import { CheckCircle, AlertCircle, Eye, Download, Search } from 'lucide-react';

export interface BookingsTabProps {
  activePlan: string | null;
  bookingStatus: 'Pending Confirmation' | 'Cancelled';
  handleCancelBooking: () => void;
  onBookPaidTour?: () => void;
}

export function BookingsTab({
  onBookPaidTour
}: BookingsTabProps) {
  const [activeBookingFilter, setActiveBookingFilter] = React.useState<'All' | 'Upcoming' | 'Completed' | 'Cancelled'>('All');

  const bookingsData = [
    { id: 'BK-2025-1557', name: 'Kashmir Paradise', date: '05 Jun 2025', amount: '₹42,000', status: 'Upcoming' },
    { id: 'BK-2025-1556', name: 'Goa Beach Holiday', date: '15 May 2025', amount: '₹18,000', status: 'Completed' },
    { id: 'BK-2025-1555', name: 'Kerala Backwaters', date: '22 May 2025', amount: '₹23,600', status: 'Completed' },
    { id: 'BK-2025-1554', name: 'Dubai Weekend Tour', date: '30 May 2025', amount: '₹73,900', status: 'Upcoming' },
    { id: 'BK-2025-1553', name: 'Darjeeling Group Tour', date: '28 Apr 2025', amount: '₹18,500', status: 'Completed' },
    { id: 'BK-2025-1548', name: 'Andaman Explorer', date: '10 Apr 2025', amount: '₹28,000', status: 'Cancelled' },
  ];

  const paymentsData = [
    { id: 'PAY-2025-0078', bookingId: 'BK-2025-1557', amount: '₹42,000', date: '10 May 2025', status: 'Success' },
    { id: 'PAY-2025-0077', bookingId: 'BK-2025-1555', amount: '₹23,600', date: '09 May 2025', status: 'Success' },
    { id: 'PAY-2025-0076', bookingId: 'BK-2025-1556', amount: '₹18,000', date: '15 Apr 2025', status: 'Success' },
    { id: 'PAY-2025-0075', bookingId: 'BK-2025-1554', amount: '₹18,500', date: '10 Apr 2025', status: 'Pending' },
    { id: 'PAY-2025-0074', bookingId: 'BK-2025-1548', amount: '₹28,000', date: '10 Apr 2025', status: 'Success' },
  ];

  const filteredBookings = bookingsData.filter((b) => {
    if (activeBookingFilter === 'All') return true;
    return b.status === activeBookingFilter;
  });

  return (
    <div className="space-y-8 text-left font-sans">
      {/* 2. MY BOOKINGS Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-805 uppercase tracking-wide">My Bookings</h2>
            <p className="text-xs text-slate-400">Manage your active, past, and upcoming travel bookings</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={onBookPaidTour} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition cursor-pointer border-none shadow-sm shadow-blue-200">
              Book New Tour
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-between items-center gap-3 mt-4">
          <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
            {(['All', 'Upcoming', 'Completed', 'Cancelled'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveBookingFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border-none ${
                  activeBookingFilter === filter
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 bg-transparent'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            <Search className="w-3.5 h-3.5" /> Filter
          </button>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto mt-4.5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Booking ID</th>
                <th className="py-3 px-2">Tour Name</th>
                <th className="py-3 px-2">Travel Date</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-655 font-medium">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-2 font-mono text-slate-500 select-all">{b.id}</td>
                  <td className="py-3 px-2 font-bold text-slate-800">{b.name}</td>
                  <td className="py-3 px-2 text-slate-500">{b.date}</td>
                  <td className="py-3 px-2 font-black text-slate-800">{b.amount}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                      b.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : b.status === 'Upcoming'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {b.status === 'Completed' ? <CheckCircle className="w-2.5 h-2.5" /> : b.status === 'Upcoming' ? <Plane className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] cursor-pointer inline-flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex justify-between items-center gap-4 mt-5 pt-3 border-t border-slate-50 text-xs text-slate-405 font-bold">
          <span>Showing 1 to {filteredBookings.length} of {filteredBookings.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 border border-slate-250 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 cursor-pointer">&lt;</button>
            <button className="px-3 py-1 bg-blue-650 text-white rounded-lg text-[10px] font-black border-none cursor-pointer">1</button>
            <button className="px-2.5 py-1 border border-slate-250 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 cursor-pointer">&gt;</button>
          </div>
        </div>
      </div>

      {/* 3. MY PAYMENTS Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-850 uppercase tracking-wide">My Payments</h2>
          <p className="text-xs text-slate-400">View transaction history, download invoices, and check pending dues</p>
        </div>

        {/* Payments KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              ✓
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Paid</span>
              <span className="text-base font-black text-slate-800 block mt-0.5">₹1,56,800</span>
            </div>
          </div>
          <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              !
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Amount</span>
              <span className="text-base font-black text-slate-800 block mt-0.5">₹18,500</span>
            </div>
          </div>
          <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
              ↺
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Refunded Amount</span>
              <span className="text-base font-black text-slate-800 block mt-0.5">₹5,000</span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto mt-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Payment ID</th>
                <th className="py-3 px-2">Booking ID</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Payment Date</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-655 font-medium">
              {paymentsData.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-2 font-mono text-slate-500 select-all">{p.id}</td>
                  <td className="py-3 px-2 font-mono text-slate-400">{p.bookingId}</td>
                  <td className="py-3 px-2 font-black text-slate-808">{p.amount}</td>
                  <td className="py-3 px-2 text-slate-500">{p.date}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 ${
                      p.status === 'Success'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-[#00D4F5] cursor-pointer border-none transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex justify-between items-center gap-4 mt-5 pt-3 border-t border-slate-50 text-xs text-slate-405 font-bold">
          <span>Showing 1 to 5 of 10 entries</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 border border-slate-250 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 cursor-pointer">&lt;</button>
            <button className="px-3 py-1 bg-blue-650 text-white rounded-lg text-[10px] font-black border-none cursor-pointer">1</button>
            <button className="px-3.5 py-1 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-600 cursor-pointer">2</button>
            <button className="px-2.5 py-1 border border-slate-250 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-500 cursor-pointer">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CUSTOM TOUR REQUESTS TAB ====================

export interface CustomToursTabProps {
  user: any;
  customRequestsList: CustomTourRequest[];
  setCustomRequestsList: (list: CustomTourRequest[]) => void;
  selectedCustomRequest: CustomTourRequest | null;
  setSelectedCustomRequest: (request: CustomTourRequest | null) => void;
  showNewRequestForm: boolean;
  setShowNewRequestForm: (show: boolean) => void;
  customRequestSuccess: boolean;
  setCustomRequestSuccess: (success: boolean) => void;
  customRequestSuccessData: CustomTourRequest | null;
  setCustomRequestSuccessData: (data: CustomTourRequest | null) => void;
  loadCustomRequests: () => Promise<void>;
  handleDashboardCustomRequestSubmit: (req: CustomTourCreateInput) => void;
}

export function CustomToursTab({
  user,
  customRequestsList,
  selectedCustomRequest,
  setSelectedCustomRequest,
  showNewRequestForm,
  setShowNewRequestForm,
  customRequestSuccess,
  customRequestSuccessData,
  loadCustomRequests,
  handleDashboardCustomRequestSubmit
}: CustomToursTabProps) {

  if (selectedCustomRequest) {
    return (
      <CustomTourDetailPanel
        request={selectedCustomRequest}
        onClose={() => setSelectedCustomRequest(null)}
        onRefresh={loadCustomRequests}
      />
    );
  }

  if (showNewRequestForm) {
    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-sans">
          <h2 className="text-base font-black flex items-center gap-2 text-slate-805 uppercase tracking-wide">
            <Route className="w-5 h-5 text-[#FF6B6B]" /> Customize Your Tour
          </h2>
          <button
            onClick={() => setShowNewRequestForm(false)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100 cursor-pointer"
          >
            Back to Request List
          </button>
        </div>
        <CustomTourForm
          currentUser={user}
          onSubmit={handleDashboardCustomRequestSubmit}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-805 uppercase tracking-wide">
            <Route className="w-5 h-5 text-[#FF6B6B]" /> Custom Tour Requests
          </h2>
          <p className="text-xs text-slate-400">Request custom itineraries, private vehicles, and special guides</p>
        </div>
        <button
          onClick={() => setShowNewRequestForm(true)}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-orange-100 cursor-pointer text-center"
        >
          Configure New Trip
        </button>
      </div>

      {customRequestSuccess && customRequestSuccessData && (
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2 font-sans">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-505" />
          <span>Request {customRequestSuccessData.displayCode} submitted successfully! Our desk is reviewing it.</span>
        </div>
      )}

      {/* Requests history */}
      <div className="pt-2 font-sans">
        <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-4">Request Log History</h3>
        
        {customRequestsList.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[24px] space-y-3">
            <Route className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-450">No custom tour requests found.</p>
            <button
              onClick={() => setShowNewRequestForm(true)}
              className="text-xs text-amber-600 hover:text-amber-700 font-bold"
            >
              Create your first customized tour request &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {customRequestsList.map((item) => {
              const isUnderReview = item.status === 'Under Review' || item.status === 'Revision Requested';
              const isQuote = item.status === 'Quotation Sent';
              const isAccepted = item.status === 'Quotation Accepted' || item.status === 'Payment Pending';
              const isConfirmed = item.status === 'Confirmed Booking';
              
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCustomRequest(item)}
                  className="p-4 rounded-[22px] border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300/80 transition-all flex justify-between items-center text-xs font-medium cursor-pointer shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800">{item.destination}</span>
                      <span className="font-mono text-slate-400 text-[10px] font-bold">({item.displayCode})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Submitted: {item.submissionDate} • {item.adults + item.children} Travelers • Budget: ₹{item.budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      isUnderReview 
                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                        : isQuote 
                          ? 'bg-sky-50 text-[#0096C7] border-sky-100 animate-pulse'
                          : isAccepted
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                            : isConfirmed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-slate-50 text-slate-505 border-slate-100'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block">
                      Last Update: {item.updatedAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== REFERRALS TAB ====================

export interface ReferralsTabProps {
  activePlan: string | null;
  referralCode: string;
  copyReferralLink: () => void;
  copiedReferral: boolean;
}

export function ReferralsTab({
  activePlan,
  referralCode,
  copyReferralLink,
  copiedReferral
}: ReferralsTabProps) {
  const referralsList = [
    { name: 'Amit Sen', date: 'June 05, 2026', plan: 'Silver Plan', reward: '₹500 Credit Issued', status: 'Completed' },
    { name: 'Sonia Das', date: 'June 14, 2026', plan: 'Gold Plan', reward: '₹500 Credit Pending', status: 'Pending Verification' }
  ];

  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-805 uppercase tracking-wide">
        <Share2 className="w-5 h-5 text-[#FF6B6B]" /> Referrals &amp; Winner Benefits
      </h2>
      <p className="text-xs text-slate-400">Invite friends to Beduine membership plans and earn discount credits</p>

      {!activePlan ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30 font-sans">
          Referral winner benefits and logs are only available for active Beduine members. Please subscribe to a plan.
        </div>
      ) : (
        <>
          {/* Copy referral link widget */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left font-sans">
            <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block font-mono">YOUR REFERRAL LINK</span>
            <div className="flex gap-2 mt-2 max-w-xl w-full">
              <input
                type="text"
                readOnly
                value={`https://beduine.in/signup?ref=${referralCode}`}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-505 bg-white font-mono"
              />
              <button
                onClick={copyReferralLink}
                className={`px-5 py-3 rounded-xl text-xs font-bold cursor-pointer text-white border-none shrink-0 transition-all flex items-center gap-1.5 ${
                  copiedReferral ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                {copiedReferral ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-2 block font-semibold">Invite friends: they get ₹100 off, you get a ₹500 Discount Credit voucher.</span>
          </div>

          {/* Metrics cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-sans">
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Total Referred</span>
              <span className="block text-2xl font-black text-slate-850 mt-1">{referralsList.length} Friends</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Successful Signups</span>
              <span className="block text-2xl font-black text-slate-850 mt-1">
                {referralsList.filter(r => r.status === 'Completed').length} Signup{referralsList.filter(r => r.status === 'Completed').length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Winner Benefits Earned</span>
              <span className="block text-2xl font-black text-[#FF6B6B] mt-1">
                {referralsList.filter(r => r.status === 'Completed').length > 0
                  ? `₹${(referralsList.filter(r => r.status === 'Completed').length * 500).toLocaleString('en-IN')}`
                  : 'No winner benefits'}
              </span>
            </div>
          </div>

          {/* Referrals list */}
          <div className="pt-4 font-sans">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Referred Friends Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5">Friend Name</th>
                    <th className="py-2.5">Signup Date</th>
                    <th className="py-2.5">Plan Purchased</th>
                    <th className="py-2.5">Winner Benefit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                  {referralsList.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3">{item.date}</td>
                      <td className="py-3">{item.plan}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {item.reward}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== NOTIFICATIONS TAB ====================

export interface NotificationsTabProps {
  displayedNotifications: any[];
  markAllNotificationsRead: () => void;
  deleteNotification: (id: number) => void;
}

export function NotificationsTab({
  displayedNotifications,
  markAllNotificationsRead,
  deleteNotification
}: NotificationsTabProps) {
  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h2 className="text-base font-black flex items-center gap-2 text-slate-805 uppercase tracking-wide">
            <Bell className="w-5 h-5 text-[#FF6B6B]" /> Notifications &amp; System Alerts
          </h2>
          <p className="text-xs text-slate-400">Read recent system updates, billing logs, and travel reward notifications</p>
        </div>
        <button onClick={markAllNotificationsRead} className="text-xs font-bold text-[#FF6B6B] hover:underline cursor-pointer border-none bg-transparent">
          Mark all as read
        </button>
      </div>

      {/* Notifications list logs */}
      <div className="space-y-3 pt-2 font-sans">
        {displayedNotifications.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 font-bold">No active notifications log. Check back later!</div>
        ) : (
          displayedNotifications.map((item) => (
            <div key={item.id} className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition-all relative ${
              item.read ? 'border-slate-100 bg-white opacity-85' : 'border-pink-100 bg-pink-50/5'
            }`}>
              {!item.read && <span className="absolute left-2.5 top-5 w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />}
              <div className="pl-2">
                <span className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400">{item.type} alert</span>
                <h4 className="text-sm font-bold text-slate-808 mt-1">{item.title}</h4>
                <p className="text-xs text-slate-505 mt-1 leading-relaxed">{item.message}</p>
                <span className="text-[9px] text-slate-400 block mt-2 font-mono">{item.time}</span>
              </div>
              <button onClick={() => deleteNotification(item.id)} className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-red-500 cursor-pointer border-none transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==================== SUPPORT TAB ====================
import { Plus } from 'lucide-react';

export interface SupportTabProps {
  profileName: string;
  supportQuery: { category: string; message: string };
  setSupportQuery: (query: { category: string; message: string }) => void;
  supportSuccess: boolean;
  handleSupportSubmit: (e: React.FormEvent) => void;
}

export function SupportTab({
  profileName,
  supportQuery,
  setSupportQuery,
  supportSuccess,
  handleSupportSubmit
}: SupportTabProps) {
  const [activeTicketFilter, setActiveTicketFilter] = React.useState<'All' | 'Open' | 'In Progress' | 'Closed'>('All');
  const [showNewTicketModal, setShowNewTicketModal] = React.useState(false);

  const ticketsData = [
    { id: 'SUP-2025-0012', subject: 'Payment not reflected', status: 'Open', date: '10 May 2025' },
    { id: 'SUP-2025-0011', subject: 'Booking confirmation', status: 'In Progress', date: '09 May 2025' },
    { id: 'SUP-2025-0010', subject: 'Lucky draw query', status: 'Closed', date: '08 May 2025' },
  ];

  const filteredTickets = ticketsData.filter((t) => {
    if (activeTicketFilter === 'All') return true;
    return t.status === activeTicketFilter;
  });

  return (
    <div className="space-y-8 text-left font-sans">
      {/* 8. SUPPORT TICKETS Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-805 uppercase tracking-wide">Support Tickets</h2>
            <p className="text-xs text-slate-400">View ticket query states, support history, and customer assistance logs</p>
          </div>
          <button
            onClick={() => setShowNewTicketModal(!showNewTicketModal)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold transition cursor-pointer border-none shadow-sm shadow-blue-200 flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> New Ticket
          </button>
        </div>

        {/* New Ticket Form (Conditional Overlay) */}
        {showNewTicketModal && (
          <div className="p-5 mt-4 border border-blue-100 bg-blue-50/10 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submit a Support Ticket</h3>
            
            {supportSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700">
                Ticket submitted successfully! A representative will connect shortly.
              </div>
            )}

            <form onSubmit={handleSupportSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Contact Name</label>
                  <input
                    type="text"
                    readOnly
                    value={profileName}
                    className="w-full px-3 py-2 rounded-xl border border-slate-150 outline-none text-xs text-slate-555 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Query Category</label>
                  <select
                    value={supportQuery.category}
                    onChange={(e) => setSupportQuery({ ...supportQuery, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-750 bg-white"
                  >
                    <option>Booking Queries</option>
                    <option>Refund Request</option>
                    <option>Upgrade Membership</option>
                    <option>Weekly Selection Help</option>
                    <option>Other Queries</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Query Message</label>
                <textarea
                  rows={2}
                  placeholder="Describe your issue or query details..."
                  value={supportQuery.message}
                  onChange={(e) => setSupportQuery({ ...supportQuery, message: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none transition-colors">
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer bg-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex justify-start bg-slate-50 p-1 rounded-xl border border-slate-100 mt-4 max-w-sm">
          {(['All', 'Open', 'In Progress', 'Closed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveTicketFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border-none flex-1 ${
                activeTicketFilter === filter
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Tickets Table */}
        <div className="overflow-x-auto mt-4.5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Ticket ID</th>
                <th className="py-3 px-2">Subject</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Updated On</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-655 font-medium">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-2 font-mono text-slate-500 select-all">{t.id}</td>
                  <td className="py-3 px-2 font-bold text-slate-800">{t.subject}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                      t.status === 'Open'
                        ? 'bg-[#e0f2fe] text-blue-700'
                        : t.status === 'In Progress'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-500">{t.date}</td>
                  <td className="py-3 px-2 text-right">
                    <button className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] cursor-pointer inline-flex items-center gap-1">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-50 text-xs text-slate-405 font-bold">
          <span>Showing 1 to {filteredTickets.length} of {filteredTickets.length} entries</span>
        </div>
      </div>

      {/* 9. SETTINGS Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-850 uppercase tracking-wide">Settings</h2>
          <p className="text-xs text-slate-400">Configure notifications, personal preferences, and security privacy parameters</p>
        </div>

        {/* Grid of 4 Settings Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Personal Settings */}
          <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Personal Settings</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Update your personal details, profile picture, and city address</p>
            </div>
            <button className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-655 bg-white cursor-pointer transition">
              Manage
            </button>
          </div>

          {/* Notification Settings */}
          <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Notification Settings</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Manage your notification channels, email alerts, and SMS settings</p>
            </div>
            <button className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-655 bg-white cursor-pointer transition">
              Manage
            </button>
          </div>

          {/* Privacy Settings */}
          <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Privacy Settings</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Manage your account security, passwords, and data sharing controls</p>
            </div>
            <button className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-black text-slate-655 bg-white cursor-pointer transition">
              Manage
            </button>
          </div>

          {/* Language dropdown */}
          <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-slate-50/20">
            <div>
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Language</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">Select your preferred default dashboard language</p>
            </div>
            <select className="w-full mt-4 py-2 px-3 border border-slate-200 rounded-lg text-[10px] font-black text-slate-655 bg-white outline-none">
              <option>English</option>
              <option>Bengali</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
