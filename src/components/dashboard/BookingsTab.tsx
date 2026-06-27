import React from 'react';
import { 
  Plane, Route, CheckCircle2, Share2, Check, Copy, 
  Bell, Trash2, Phone, MessageCircle, ChevronRight
} from 'lucide-react';
import { CustomTourForm } from '../../pages/main-website-tour-page/custom-tour/CustomTourForm';
import { CustomTourDetailPanel } from '../../pages/main-website-tour-page/custom-tour/CustomTourDetailPanel';
import { CustomTourRequest } from '../../types';

// ==================== TOUR BOOKINGS TAB ====================

export interface BookingsTabProps {
  activePlan: string | null;
  bookingStatus: 'Pending Confirmation' | 'Cancelled';
  handleCancelBooking: () => void;
  onBookPaidTour?: () => void;
}

export function BookingsTab({
  activePlan,
  bookingStatus,
  handleCancelBooking,
  onBookPaidTour
}: BookingsTabProps) {
  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-sans">
        <div>
          <h2 className="text-base font-black flex items-center gap-2 text-slate-805 uppercase tracking-wide">
            <Plane className="w-5 h-5 text-[#FF6B6B]" /> My Tour Bookings
          </h2>
          <p className="text-xs text-slate-400">View active tour itineraries, booking confirmations, and vouchers</p>
        </div>
        <button onClick={onBookPaidTour} className="px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer text-white bg-[#FF6B6B] hover:opacity-95 shadow-md shadow-orange-500/15 border-none transition-all">
          Book New Tour
        </button>
      </div>

      {/* Current Active Tour Card */}
      {activePlan ? (
        <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow font-sans">
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <img src="/images/gokarna_beach_card.png" alt="Puri Beach" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
              {bookingStatus}
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D4F5] font-black">Upcoming Destination</span>
              <h3 className="text-lg font-black tracking-wide mt-0.5">Puri Beach Escape (3N/4D)</h3>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">DEPARTURE</span>
                <span className="font-bold text-slate-805 mt-0.5 block">Sept 14, 2026</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">TRAVELERS</span>
                <span className="font-bold text-slate-805 mt-0.5 block">2 Adults</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">PICKUP ADDRESS</span>
                <span className="font-bold text-slate-805 mt-0.5 block truncate">Requested Assistance</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">TOTAL AMOUNT</span>
                <span className="font-bold text-slate-900 mt-0.5 block font-black">₹4,000 (Credits Applied)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold font-mono">BOOKING ID: BDN-PURI-901B</span>
              <div className="flex gap-2">
                {bookingStatus === 'Pending Confirmation' && (
                  <button
                    onClick={handleCancelBooking}
                    className="px-4 py-2 rounded-xl text-[10px] font-bold text-red-505 bg-red-50/50 border border-red-100 hover:bg-red-100 cursor-pointer"
                  >
                    Cancel Booking &amp; Reinstate Credit
                  </button>
                )}
                <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-[10px] font-bold text-slate-650 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 cursor-pointer no-underline">
                  Chat With Guide
                </a>
                {bookingStatus !== 'Cancelled' && (
                  <button className="px-4 py-2 rounded-xl text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-900 border-none cursor-pointer">
                    Download Voucher
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30">
          No bookings available. Please purchase a subscription to book a tour.
        </div>
      )}
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
  handleDashboardCustomRequestSubmit: (req: CustomTourRequest) => void;
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
        <Share2 className="w-5 h-5 text-[#FF6B6B]" /> Referrals &amp; Rewards
      </h2>
      <p className="text-xs text-slate-400">Invite friends to Beduine membership plans and earn discount credits</p>

      {!activePlan ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30 font-sans">
          Referral rewards and logs are only available for active Beduine members. Please subscribe to a plan.
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
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Rewards Earned</span>
              <span className="block text-2xl font-black text-[#FF6B6B] mt-1">
                {referralsList.filter(r => r.status === 'Completed').length > 0
                  ? `₹${(referralsList.filter(r => r.status === 'Completed').length * 500).toLocaleString('en-IN')}`
                  : 'No rewards'}
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
                    <th className="py-2.5">Reward Status</th>
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
  const faqs = [
    { q: 'How does the weekly member selection work?', a: 'Every Sunday at 8:00 PM, our RNG algorithm selects active subscribers for free curated tour rewards. Silver plan includes 1 TRC (Travel Reward Credit) for weekly reward participation, Gold includes 1 TRC, and Platinum includes 1 TRC. If not selected, value protection discount credits are credited to your wallet.' },
    { q: 'What is Beduine Value Protection Policy?', a: 'If you subscribe and are not selected in the weekly selections, we issue ₹500 value Discount Credits. These non-cash credits are fully valid for booking any of our domestic and international paid tour packages, protecting the complete value of your subscription.' },
    { q: 'Can I change my name on the booking voucher?', a: 'Name change rules depend on your membership tier. Gold plan allows one name change, Platinum allows two, and Silver does not support name changes. Inquiries can be requested via WhatsApp.' },
    { q: 'How do I redeem my Discount Credit vouchers?', a: 'Simply go to "Book Travel", select your destination and date, and apply your active Discount Credit voucher code. Vouchers are applied to base package subtotals automatically.' }
  ];

  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-805 uppercase tracking-wide">
        <Phone className="w-5 h-5 text-[#FF6B6B]" /> Help &amp; Customer Support
      </h2>
      <p className="text-xs text-slate-400">Get assistance with travel bookings, vouchers, or membership upgrades</p>

      {/* Call support grid */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2 font-sans">
        {/* WhatsApp Support card */}
        <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/10 hover:shadow-md transition-shadow flex items-start gap-4 no-underline cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-805">Live WhatsApp Chat</span>
            <span className="block text-[11px] text-slate-505 mt-1 leading-normal">Connect directly with a support manager. Response in under 10 minutes.</span>
            <span className="block text-[10px] text-emerald-600 font-extrabold mt-3 uppercase tracking-wider font-mono">+91 87689 03565</span>
          </div>
        </a>

        {/* Voice helpline card */}
        <a href="tel:+917929085086" className="p-5 rounded-xl border border-sky-100 bg-sky-50/10 hover:shadow-md transition-shadow flex items-start gap-4 no-underline cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[#00D4F5] text-white flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-805">Voice Support Call</span>
            <span className="block text-[11px] text-slate-505 mt-1 leading-normal">Call our customer helpline desk. Direct calls available 10:00 AM – 7:00 PM.</span>
            <span className="block text-[10px] text-[#00D4F5] font-extrabold mt-3 uppercase tracking-wider font-mono">+91 79290 85086</span>
          </div>
        </a>
      </div>

      {/* support form query */}
      <form onSubmit={handleSupportSubmit} className="space-y-4 pt-4 border-t border-slate-100 font-sans">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submit a Support Ticket</h3>
        
        {supportSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Thank you! Your ticket query was sent successfully. Our team will contact you shortly.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Name</label>
            <input
              type="text"
              readOnly
              value={profileName}
              className="w-full px-4 py-3 rounded-xl border border-slate-150 outline-none text-xs text-slate-500 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Query Category</label>
            <select
              value={supportQuery.category}
              onChange={(e) => setSupportQuery({ ...supportQuery, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-750 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
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
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Query Message</label>
          <textarea
            rows={2}
            placeholder="Describe your issue or query details..."
            value={supportQuery.message}
            onChange={(e) => setSupportQuery({ ...supportQuery, message: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
            required
          />
        </div>
        <button type="submit" className="px-6 py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none transition-colors">
          SendMessage
        </button>
      </form>

      {/* Collapsible FAQ accordion list */}
      <div className="pt-6 border-t border-slate-100 space-y-3 font-sans">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all">
              <summary className="flex justify-between items-center p-4 text-xs font-bold text-slate-850 cursor-pointer list-none">
                <span>{faq.q}</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed font-semibold border-t pt-2.5">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
