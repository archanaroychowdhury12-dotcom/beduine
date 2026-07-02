import React, { useEffect } from 'react';
import { BookingConfirmation } from '../../types';
import { CheckCircle2, Calendar, MapPin, Users, Download, Eye, Sparkles, PhoneCall, Mail, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ConfirmationScreenProps {
  confirmation: BookingConfirmation;
  onViewReceipt: () => void;
  onResetBooking: () => void;
  onReturnHome: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  confirmation,
  onViewReceipt,
  onResetBooking,
  onReturnHome
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { bookingId, tour, selectedDate, travelers, pricing, paymentPlan, isPrivateTour, pickup, specialRequests } = confirmation;
  const leadTraveler = travelers[0] || { firstName: 'BEDUINE', lastName: 'Traveler', email: 'support@beduine.in', phone: '+91 87689 03565' };
  const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 text-left">
      {/* Top Victory Celebration Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Advance Payment Confirmed & Secured</span>
          </div>

          <h1 className="font-serif-premium text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Thank You, <span className="text-amber-400">{leadTraveler.firstName}</span>!
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Your premium expedition has been successfully locked in. We have dispatched your official VIP Tour Pass and payment invoice to <span className="text-amber-400 font-extrabold">{leadTraveler.email}</span>.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-around gap-4 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block tracking-wider">Official Booking ID</span>
              <span className="text-xl font-extrabold text-amber-400">{bookingId}</span>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block tracking-wider">Advance Paid Now</span>
              <span className="text-xl font-extrabold text-white">{formatINR(paymentPlan?.advanceDueNow || pricing.totalPayable)}</span>
              {paymentPlan && <span className="block text-[10px] text-slate-400 mt-0.5">Balance due later: {formatINR(paymentPlan.balanceDueLater)}</span>}
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-800"></div>
            <div>
              <span className="text-[10px] text-slate-400 font-sans font-bold uppercase block tracking-wider">Payment Status</span>
              <span className="text-sm font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded">256-bit Verified</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onViewReceipt}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide uppercase transition-all transform hover:-translate-y-1 shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>View & Download VIP Receipt / Pass</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors flex items-center justify-center space-x-2 border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Print Page Overview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Breakdown Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {/* Expedition Spec */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-premium text-2xl font-bold text-slate-900">Expedition Overview</h3>
              <span className="text-xs text-slate-500">Scheduled Departure Specification</span>
            </div>
          </div>

          <div className="space-y-4 text-sm font-semibold text-slate-700">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase block tracking-wider">Tour Name</span>
              <span className="text-base font-extrabold text-slate-900 font-serif-premium">{tour.name}</span>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{tour.destination}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-600">
              <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-600">
              <Users className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{travelers.length} Registered Traveler{travelers.length > 1 ? 's' : ''} ({isPrivateTour ? 'Private VIP Edition' : 'Premium Small Group'})</span>
            </div>
          </div>
        </div>

        {/* Chauffeur Pickup Spec */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-premium text-2xl font-bold text-slate-900">Ground Transfers Spec</h3>
              <span className="text-xs text-slate-500">Private Chauffeur Greetings</span>
            </div>
          </div>

          <div className="space-y-4 text-sm font-semibold text-slate-700">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase block tracking-wider">Pickup Location / Hotel Strategy</span>
              <span className="text-sm font-bold text-slate-900">
                {pickup.type === 'hotel' ? `Partner Hotel: ${pickup.hotelName}` : pickup.type === 'manual' ? `Custom Address: ${pickup.customAddress}` : 'Traveler arranging own arrival'}
              </span>
            </div>

            {pickup.dropoffDifferent && (
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block tracking-wider">Drop-Off Destination</span>
                <span className="text-sm font-bold text-slate-900">{pickup.dropoffLocation}</span>
              </div>
            )}

            {pickup.specialInstructions && (
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block tracking-wider">Special Pickup Instructions</span>
                <span className="text-sm italic text-slate-600">"{pickup.specialInstructions}"</span>
              </div>
            )}

            {specialRequests && (
              <div className="pt-2">
                <span className="text-xs text-amber-600 font-bold uppercase block tracking-wider flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" /> Special Dietary / Celebration Notes Recorded
                </span>
                <span className="text-xs italic text-slate-600 block mt-0.5">"{specialRequests}"</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Traveler Roster Breakdown Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-serif-premium text-2xl font-bold text-slate-900 pb-3 border-b border-slate-100">
          Confirmed Travelers Roster ({travelers.length})
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {travelers.map((tr, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                #{idx + 1}
              </div>
              <div className="truncate">
                <span className="font-extrabold text-slate-900 text-sm block truncate">{tr.firstName} {tr.lastName}</span>
                <span className="text-xs text-slate-500 block">{tr.ageGroup} Traveler {idx === 0 && '| Lead Contact'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Support Box */}
      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-amber-900 uppercase tracking-widest block flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" /> 24/7 VIP Expedition Support Desk
          </span>
          <h4 className="font-serif-premium text-2xl font-bold text-amber-950">Have questions about your chauffeur greeting?</h4>
          <p className="text-xs text-amber-800/90 max-w-xl">
            Our private logistics team operates around the clock. Quote your Booking Ref <span className="font-mono font-bold">{bookingId}</span> whenever you contact our personal trip concierges.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <a
            href="tel:+918768903565"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white rounded-2xl font-extrabold text-sm flex items-center space-x-2 transition-colors shadow"
          >
            <PhoneCall className="w-4 h-4" />
            <span>+91 87689 03565</span>
          </a>
          <a
            href="mailto:support@beduine.in"
            className="px-6 py-3.5 bg-white hover:bg-amber-100 text-amber-950 rounded-2xl font-bold text-sm flex items-center space-x-2 transition-colors border border-amber-300 shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Email Support</span>
          </a>
        </div>
      </div>

      {/* Bottom Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
        <button
          onClick={onReturnHome}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-colors flex items-center space-x-2"
        >
          <span>Return to Dashboard</span>
        </button>

        <button
          onClick={onResetBooking}
          className="px-6 py-3 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-sm rounded-2xl transition-colors flex items-center space-x-2 group"
        >
          <span>Book Another Paid Guided Tour</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
