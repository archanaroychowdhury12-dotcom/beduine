import React from 'react';
import { BookingConfirmation } from '../../types';
import { Compass, X, Printer, CheckCircle2, QrCode, Calendar, MapPin, Users, Award, Car, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ confirmation, onClose }) => {
  const { bookingId, tour, selectedDate, travelers, pricing, paymentPlan, isPrivateTour, confirmedAt, pickup } = confirmation;
  const leadTraveler = travelers[0] || { firstName: 'BEDUINE', lastName: 'Traveler', email: 'support@beduine.in', phone: '+91 87689 03565' };
  const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 text-slate-800 text-left">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between p-6 bg-slate-900 text-white print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-premium font-black text-xl tracking-tight block">BEDUINE</span>
              <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase block">Official Tour Pass & Receipt</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-90 transition-opacity flex items-center space-x-2 shadow cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Pass</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-10">
          {/* Header ID and QR Simulation */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b-2 border-slate-900">
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest text-amber-600 uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                Confirmed Paid Guided Expedition
              </span>
              <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-950">
                VIP Boarding Pass & Invoice
              </h2>
              <span className="text-xs text-slate-500 font-mono block">Issued Date: {new Date(confirmedAt).toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <QrCode className="w-20 h-20 text-slate-900" />
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Booking Ref ID</span>
                <span className="text-2xl font-black font-mono text-slate-900 block">{bookingId}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% Paid & Secured
                </span>
              </div>
            </div>
          </div>

          {/* Expedition Details Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-900 text-white">
            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Scheduled Departure
              </span>
              <span className="text-base font-black tracking-tight block">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs text-slate-400 block">{tour.durationDays} Days / {tour.durationNights} Nights</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Primary Destination
              </span>
              <span className="text-base font-black tracking-tight block truncate" title={tour.destination}>
                {tour.destination}
              </span>
              <span className="text-xs text-slate-400 block">Pace: {tour.difficultyLevel}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Participants Spec
              </span>
              <span className="text-base font-black tracking-tight block">
                {travelers.length} Registered Traveler{travelers.length > 1 ? 's' : ''}
              </span>
              <span className="text-xs text-emerald-400 font-bold block">{isPrivateTour ? 'Exclusive VIP Private Upgrade' : 'Premium Small Group'}</span>
            </div>
          </div>

          {/* Travelers and Pickup split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-slate-200">
            {/* Registered Travelers */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Traveler Information Manifest</h4>
              <div className="space-y-2">
                {travelers.map((tr, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl font-semibold text-sm">
                    <span>{i + 1}. {tr.firstName} {tr.lastName}</span>
                    <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded shadow-sm">{tr.ageGroup} {i === 0 && ' (Lead)'}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-xs text-slate-500">
                <span className="font-bold text-slate-700 block">Contact Dispatched To:</span>
                <span>{leadTraveler.email} | {leadTraveler.phone}</span>
              </div>
            </div>

            {/* Ground Logistics details */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-500" /> Private Ground Chauffeur Info
              </h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Greeting Strategy</span>
                  <span className="text-slate-600">
                    {pickup.type === 'hotel' ? `Partner Lobby: ${pickup.hotelName}` : pickup.type === 'manual' ? `Airport / Address: ${pickup.customAddress}` : 'Traveler independent arrival'}
                  </span>
                </div>
                {pickup.dropoffDifferent && (
                  <div>
                    <span className="font-bold text-slate-800 block">Final Drop-Off</span>
                    <span className="text-slate-600">{pickup.dropoffLocation}</span>
                  </div>
                )}
                {pickup.specialInstructions && (
                  <div>
                    <span className="font-bold text-slate-800 block">Special Chauffeur Note</span>
                    <span className="text-slate-600 italic">"{pickup.specialInstructions}"</span>
                  </div>
                )}
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 flex items-center space-x-2 text-xs text-amber-900">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Certified Tour Expert: {tour.guideExpertise}</span>
              </div>
            </div>
          </div>

          {/* Final Financial Breakdown Table */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">Financial Transmittal Summary</h4>
            
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-sm font-medium">
                <thead className="bg-slate-100 text-xs font-black text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Cost Component</th>
                    <th className="py-3 px-4 text-right">Unit Rate</th>
                    <th className="py-3 px-4 text-right">Participants</th>
                    <th className="py-3 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Base Guided Expedition</td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatINR(pricing.basePricePerPerson)}</td>
                    <td className="py-3.5 px-4 text-right">{pricing.travelerCount}</td>
                    <td className="py-3.5 px-4 text-right font-bold font-mono">{formatINR(pricing.subtotalBase)}</td>
                  </tr>

                  {isPrivateTour && (
                    <tr className="bg-amber-50/40">
                      <td className="py-3.5 px-4 font-bold text-amber-900">Private VIP Tour Upgrade</td>
                      <td className="py-3.5 px-4 text-right font-mono">{formatINR(tour.groupSize.privateSurchargePerPerson)}</td>
                      <td className="py-3.5 px-4 text-right">{pricing.travelerCount}</td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono text-amber-900">+{formatINR(pricing.privateSurchargeTotal)}</td>
                    </tr>
                  )}

                  {pricing.memberDiscountTotal !== undefined && pricing.memberDiscountTotal > 0 && (
                    <tr className="bg-emerald-50/70 text-emerald-900 font-bold">
                      <td className="py-3.5 px-4">Member Tour Discount ({pricing.memberDiscountPercent}%)</td>
                      <td className="py-3.5 px-4 text-right font-mono">-</td>
                      <td className="py-3.5 px-4 text-right">-</td>
                      <td className="py-3.5 px-4 text-right font-mono">-{formatINR(pricing.memberDiscountTotal)}</td>
                    </tr>
                  )}

                  {pricing.discountCreditsTotal !== undefined && pricing.discountCreditsTotal > 0 && (
                    <tr className="bg-emerald-50/70 text-emerald-900 font-bold">
                      <td className="py-3.5 px-4">Plan Credits Discount ({pricing.appliedDiscountCredits} applied)</td>
                      <td className="py-3.5 px-4 text-right font-mono">-</td>
                      <td className="py-3.5 px-4 text-right">-</td>
                      <td className="py-3.5 px-4 text-right font-mono">-{formatINR(pricing.discountCreditsTotal)}</td>
                    </tr>
                  )}

                  {pricing.insuranceTotal !== undefined && pricing.insuranceTotal > 0 && (
                    <tr className="bg-slate-100/60 text-slate-800 font-bold">
                      <td className="py-3.5 px-4">Comprehensive Travel Insurance</td>
                      <td className="py-3.5 px-4 text-right font-mono">-</td>
                      <td className="py-3.5 px-4 text-right">-</td>
                      <td className="py-3.5 px-4 text-right font-mono">+{formatINR(pricing.insuranceTotal)}</td>
                    </tr>
                  )}

                  {pricing.appliedVoucher && (
                    <tr className="bg-emerald-50 text-emerald-900 font-bold">
                      <td className="py-3.5 px-4">Promotional Voucher Redemption ({pricing.appliedVoucher.code})</td>
                      <td className="py-3.5 px-4 text-right font-mono">-</td>
                      <td className="py-3.5 px-4 text-right">-</td>
                      <td className="py-3.5 px-4 text-right font-mono">-{formatINR(pricing.voucherDiscountAmount)}</td>
                    </tr>
                  )}

                  <tr>
                    <td className="py-3.5 px-4 text-slate-600">Service Fee & Local Residence Tax (5%)</td>
                    <td className="py-3.5 px-4 text-right font-mono">-</td>
                    <td className="py-3.5 px-4 text-right">-</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">{formatINR(pricing.serviceFeeOrTax)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-900 text-white font-black text-base font-serif-premium">
                  <tr>
                    <td colSpan={3} className="py-4 px-4 uppercase tracking-wider">Total Transmitted Payable Amount</td>
                    <td className="py-4 px-4 text-right text-amber-400 font-mono text-xl">{formatINR(paymentPlan?.advanceDueNow || pricing.totalPayable)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {paymentPlan && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-[10px] text-amber-700 font-black uppercase tracking-widest">Advance Payment Schedule</span>
                  <h4 className="text-sm font-black text-slate-900 mt-1">{paymentPlan.bookingTypeLabel}</h4>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Total Tour Cost</span>
                  <span className="font-mono font-black text-slate-950">{formatINR(paymentPlan.grandTotal)}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {paymentPlan.installments.map((row) => (
                  <div key={row.id} className="bg-white border border-amber-100 rounded-xl p-3 text-xs">
                    <div className="flex justify-between gap-2 font-black text-slate-900">
                      <span>{row.label} • {row.percentage}%</span>
                      <span className="font-mono">{formatINR(row.amount)}</span>
                    </div>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{row.dueLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and support bottom note */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>Refunds, if applicable, are processed within 15–30 working days after approval as per BEDUINE policy.</span>
            </div>
            <span>Need assistance? Help Desk: +91 87689 03565 | support@beduine.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
