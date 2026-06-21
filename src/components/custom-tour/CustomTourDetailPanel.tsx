import React, { useState } from 'react';
import { CustomTourRequest } from '../../types';
import { customTourService } from '../../services/customTourService';
import { DemoAdminControls } from './DemoAdminControls';
import {
  Check, Clock, ShieldAlert, CreditCard, ShieldCheck,
  MessageSquare, X
} from 'lucide-react';

interface CustomTourDetailPanelProps {
  request: CustomTourRequest;
  onClose: () => void;
  onRefresh: () => void;
  onContactSupport?: () => void;
}

export const CustomTourDetailPanel: React.FC<CustomTourDetailPanelProps> = ({
  request: initialRequest,
  onClose,
  onRefresh,
  onContactSupport
}) => {
  const [request, setRequest] = useState<CustomTourRequest>(initialRequest);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');

  const handleStateUpdate = (updated: CustomTourRequest) => {
    setRequest(updated);
    onRefresh(); // Trigger parent refresh
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await customTourService.addRevision(request.id, revisionMessage);
      setRequest(updated);
      setRevisionMessage('');
      setShowRevisionForm(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptQuotation = async () => {
    setIsSubmitting(true);
    try {
      const accepted = await customTourService.acceptQuotation(request.id);
      const paymentPending = await customTourService.moveToPaymentPending(accepted.id);
      setRequest(paymentPending);
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessPayment = async () => {
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const updated = await customTourService.confirmMockPayment(request.id);
        setRequest(updated);
        onRefresh();
      } catch (err: any) {
        alert(err.message);
      } finally {
        setIsSubmitting(false);
      }
    }, 1200);
  };

  // Find active quotation
  const activeQuotation = request.quotations.find(q => q.id === request.currentQuotationId);

  // Status mapping to indices (1 to 5)
  const getStatusStep = (status: string): number => {
    switch (status) {
      case 'Under Review':
        return 1;
      case 'Revision Requested':
        return 1;
      case 'Quotation Sent':
        return 2;
      case 'Quotation Accepted':
        return 3;
      case 'Payment Pending':
        return 4;
      case 'Payment Failed':
        return 4;
      case 'Confirmed Booking':
        return 5;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(request.status);
  const formatPrice = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const steps = [
    { title: 'Submitted', desc: 'Request submitted' },
    { title: 'Curating', desc: 'Review & Itinerary construction' },
    { title: 'Quotation', desc: 'Approve or revise quote' },
    { title: 'Checkout', desc: 'Complete payments' },
    { title: 'Voucher', desc: 'Booking confirmed' }
  ];

  return (
    <div className="bg-slate-50 rounded-[32px] p-6 max-h-[85vh] overflow-y-auto space-y-6 border border-slate-200/50 shadow-2xl relative text-left">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
              Request Details - {request.destination}
            </h2>
            <span className="font-mono text-xs font-bold text-slate-400">({request.displayCode})</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
            Submitted on {request.submissionDate} • Updated on {request.updatedAt}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-650 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stepper Timeline */}
      <div className="bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-3xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum || request.status === 'Confirmed Booking';
            const isActive = currentStep === stepNum && request.status !== 'Confirmed Booking';
            
            return (
              <div key={idx} className="flex-1 flex items-start sm:items-center gap-3 sm:gap-2 w-full">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200' 
                      : isActive 
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-200 animate-pulse'
                        : 'bg-slate-100 text-slate-450 border border-slate-200'
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-wide block leading-none ${
                      isActive ? 'text-amber-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {st.title}
                    </span>
                    <span className="text-[9px] text-slate-400 leading-normal block sm:hidden">
                      {st.desc}
                    </span>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-[2px] mx-2 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-100'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Admin Controls Block */}
      <DemoAdminControls request={request} onUpdate={handleStateUpdate} />

      {/* Main Grid: Request Data vs Interactive Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Side: Summary of customer inputs */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 space-y-4 shadow-sm text-left">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Submitted Requirements</h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Trip Scope</span>
              <span className="font-bold text-slate-750">{request.tripType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Departure From</span>
              <span className="font-bold text-slate-750">{request.departureCity}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Dates Preference</span>
              <span className="font-bold text-slate-750">
                {request.flexibleDates 
                  ? `Flexible in ${request.flexibleMonth}` 
                  : `${request.travelStartDate} to ${request.travelEndDate}`
                }
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Length</span>
              <span className="font-bold text-slate-750">{request.durationNights} Nights</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Rooms Required</span>
              <span className="font-bold text-slate-750">{request.rooms} {request.rooms === 1 ? 'Room' : 'Rooms'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Travelers count</span>
              <span className="font-bold text-slate-750">
                {request.adults} Adults
                {request.children > 0 && `, ${request.children} Children`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Hotel Preference</span>
              <span className="font-bold text-slate-750">{request.hotelCategory}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Transport Preference</span>
              <span className="font-bold text-slate-750">{request.transportPreference}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Meal Preference</span>
              <span className="font-bold text-slate-750">{request.mealPreference}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Preferred Budget</span>
              <span className="font-bold text-amber-600 font-mono">{formatPrice(request.budget)}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase block mb-1">Target Activities</span>
            <div className="flex flex-wrap gap-1.5">
              {request.activities.map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 border text-[10px] font-bold text-slate-600">
                  {a}
                </span>
              ))}
            </div>
          </div>

          {request.specialRequirements && (
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Special Requirements</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed mt-1">
                {request.specialRequirements}
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-[10.5px]">
            <div>
              <span className="text-slate-400 block uppercase text-[9px]">Contact Email</span>
              <span className="font-semibold text-slate-650">{request.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[9px]">Contact Phone</span>
              <span className="font-semibold text-slate-650">+91 {request.phone}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Stepper Actions / Curated Quotation Card */}
        <div className="space-y-4">
          
          {/* Status Alert Banners */}
          {request.status === 'Under Review' && (
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex gap-3 text-left">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-850 uppercase block">Under Admin Review</span>
                <p className="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">
                  Our agents are currently evaluating flight and hotel capacities. We will prepare and publish a custom quotation shortly.
                </p>
              </div>
            </div>
          )}

          {request.status === 'Revision Requested' && (
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5 flex gap-3 text-left">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-850 uppercase block">Revision Under Review</span>
                <p className="text-[10.5px] text-slate-500 leading-relaxed mt-0.5">
                  Your revision suggestions have been logged. Our specialists are curating a revised quote (v{request.quotations.length + 1}) for you.
                </p>
              </div>
            </div>
          )}

          {/* Active Quotation Review Panel */}
          {activeQuotation && (request.status === 'Quotation Sent' || request.status === 'Quotation Accepted' || request.status === 'Payment Pending' || request.status === 'Confirmed Booking') && (
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> Curated Tour Quotation (v{activeQuotation.version})
                </span>
                <span className="text-sm font-black text-[#0096C7] font-mono">
                  {formatPrice(activeQuotation.totalPrice)}
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-3.5 leading-relaxed">
                <div>
                  <span className="text-[9.5px] text-slate-400 uppercase block">Hotel Selection</span>
                  <span className="font-extrabold text-slate-750 block">{activeQuotation.hotelName}</span>
                  <span className="text-[9.5px] text-slate-450 block font-bold">({activeQuotation.hotelCategory})</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 uppercase block">Vehicle Assigned</span>
                  <span className="font-semibold text-slate-700">{activeQuotation.vehicleAssigned}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 uppercase block">Included Meals</span>
                  <span className="font-semibold text-slate-700">{activeQuotation.mealsIncluded}</span>
                </div>
                <div>
                  <span className="text-[9.5px] text-slate-400 uppercase block">Curated Daily Itinerary</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{activeQuotation.itineraryDetails}</p>
                </div>
              </div>

              {/* Quotation Action Buttons */}
              {request.status === 'Quotation Sent' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowRevisionForm(true)}
                    className="flex-1 py-3 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-650 rounded-2xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    Request Revision
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleAcceptQuotation}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-transform hover:-translate-y-0.5 shadow-md shadow-orange-100 cursor-pointer disabled:opacity-50"
                  >
                    Accept &amp; Pay
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Revision Form Modal/Block */}
          {showRevisionForm && (
            <form onSubmit={handleRequestRevision} className="bg-slate-100/60 rounded-3xl p-5 border border-slate-200/50 space-y-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Specify revision requests
                </span>
                <button
                  type="button"
                  onClick={() => setShowRevisionForm(false)}
                  className="text-[10px] font-extrabold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <textarea
                rows={3}
                required
                value={revisionMessage}
                onChange={(e) => setRevisionMessage(e.target.value)}
                placeholder="Describe changes (e.g. Upgrade hotels to 5 Star, reduce duration by 1 night, include flights from Kolkata...)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-extrabold uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                Submit Feedback
              </button>
            </form>
          )}

          {/* Mock checkout payment portal */}
          {request.status === 'Payment Pending' && activeQuotation && (
            <div className="bg-white rounded-3xl p-5 border border-slate-150 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100 text-left">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <CreditCard className="w-4.5 h-4.5 text-[#0096C7]" /> Secure Demo Checkout
                </span>
                <span className="text-[9.5px] text-slate-400 font-bold uppercase mt-1 block">
                  Processing custom quotation v{activeQuotation.version}
                </span>
              </div>

              {/* Payment Warning Disclaimer */}
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-rose-800 text-[10px] leading-relaxed font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span>DEMO CHECKOUT ONLY</span>
                  <p className="font-normal text-rose-600 mt-0.5">
                    No real money will be charged. Payment gateway webhooks and formal invoice generation will be connected during the production phase.
                  </p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <span className="text-[9.5px] text-slate-450 uppercase block font-black">Select Payment Mode</span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['upi', 'card', 'wallet'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method as any)}
                      className={`py-2 rounded-xl text-[10px] font-extrabold capitalize cursor-pointer border transition-all ${
                        paymentMethod === method
                          ? 'border-[#0096C7] bg-[#0096C7]/5 text-[#0086B3]'
                          : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {method === 'upi' ? 'UPI / GPay' : method === 'card' ? 'Debit/Credit Card' : 'Net Banking'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                <span className="text-slate-450 font-bold uppercase text-[9.5px]">Amount Payable</span>
                <span className="text-base font-black text-[#0096C7] font-mono">
                  {formatPrice(activeQuotation.totalPrice)}
                </span>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleProcessPayment}
                className="w-full py-3 bg-[#0096C7] hover:bg-[#0086B3] text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-cyan-100 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Processing Payment...' : 'Demo Pay & Confirm'}
              </button>
            </div>
          )}

          {/* Booking Confirmation / Travel Voucher */}
          {request.status === 'Confirmed Booking' && activeQuotation && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              
              {/* Demo Mode Badge */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-[10px] text-amber-850 font-bold">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span>Frontend Demo Mode</span>
                  <p className="font-normal text-slate-500 mt-0.5">This travel voucher is simulated. Booking data is saved in your local browser session storage.</p>
                </div>
              </div>

              <div className="pb-3 border-b border-dashed border-slate-200 text-left flex justify-between items-center">
                <div>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block">
                    Confirmed Travel Voucher
                  </span>
                  <span className="font-mono text-xs font-black text-slate-800 block mt-0.5">
                    {request.bookingId}
                  </span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 text-[8.5px] font-black border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                  Confirmed
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 leading-relaxed">
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block">Destination</span>
                    <span className="font-bold text-slate-750">{request.destination}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block">Client Name</span>
                    <span className="font-bold text-slate-750">{request.userName || 'Rahul Sen'}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block font-medium">Travel Dates</span>
                    <span className="font-bold text-slate-750">
                      {request.flexibleDates ? `Flexible: ${request.flexibleMonth}` : `${request.travelStartDate} to ${request.travelEndDate}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block font-medium">Travellers</span>
                    <span className="font-bold text-slate-750">
                      {request.adults} Adults{request.children > 0 ? `, ${request.children} Children` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block font-medium">Voucher Code</span>
                    <span className="font-mono font-bold text-slate-650">{request.voucherCode}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block font-medium">Meals Preference</span>
                    <span className="font-semibold text-slate-750">
                      {activeQuotation.mealsIncluded || request.mealPreference}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block font-medium">Booking Status</span>
                    <span className="font-bold text-emerald-600">Confirmed</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 uppercase block font-medium">Payment Status</span>
                    <span className="font-bold text-emerald-600">Successful (Paid)</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-[11px]">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Hotel Resort</span>
                    <span className="font-bold text-slate-750">{activeQuotation.hotelName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Assigned Transport</span>
                    <span className="font-semibold text-slate-750">{activeQuotation.vehicleAssigned}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
                    <span className="text-[9px] text-slate-450 font-bold uppercase">Total Price</span>
                    <span className="font-black text-[#0096C7] font-mono text-sm">{formatPrice(activeQuotation.totalPrice)}</span>
                  </div>
                </div>

                {/* QR Code Payload (Google Charts QR Generator API) */}
                <div className="pt-3 border-t border-dashed border-slate-200 flex flex-col items-center gap-2">
                  <img
                    src={`https://chart.googleapis.com/chart?chs=120x120&cht=qr&chl=DEMO-VERIFY%3A${request.bookingId}`}
                    alt="Voucher Verification QR"
                    className="w-28 h-28 object-contain border border-slate-100 rounded-xl p-1 bg-white"
                  />
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                    Scan to Verify Voucher
                  </span>
                </div>

                {/* Action buttons */}
                <div className="pt-3 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Print Voucher
                  </button>
                  {onContactSupport && (
                    <button
                      type="button"
                      onClick={onContactSupport}
                      className="flex-1 py-2.5 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-650 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer"
                    >
                      Contact Support
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
};
