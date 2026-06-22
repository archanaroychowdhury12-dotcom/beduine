import React, { useState } from 'react';
import { CustomTourRequest } from '../../../types';
import { customTourService } from '../../../services/customTourService';
import { UserCheck, Send, AlertOctagon } from 'lucide-react';

interface DemoAdminControlsProps {
  request: CustomTourRequest;
  onUpdate: (updatedRequest: CustomTourRequest) => void;
}

export const DemoAdminControls: React.FC<DemoAdminControlsProps> = ({
  request,
  onUpdate
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(() => {
    // Default to the middle of estimate or budget
    return request.budget || Math.round((request.estimatedPriceRange.min + request.estimatedPriceRange.max) / 2);
  });
  const [hotelName, setHotelName] = useState('Radisson Blu Resort & Spa');
  const [vehicleAssigned, setVehicleAssigned] = useState('AC Toyota Innova (Private)');
  const [mealsIncluded, setMealsIncluded] = useState('Breakfast and Dinner (MAP)');
  const [itineraryDetails, setItineraryDetails] = useState(
    'Day 1: Arrival & Hotel Check-in. Day 2: Guided Full Day City Sightseeing Tour. Day 3: Excursion to Scenic Valleys. Day 4: Leisure day & local shopping. Day 5: Checkout & airport dropoff.'
  );

  const [loading, setLoading] = useState(false);

  // Checks VITE_DEMO_MODE. In development, we default to showing it to make validation easy.
  const isDemoMode = (import.meta as any).env?.VITE_DEMO_MODE === 'true' || (import.meta as any).env?.VITE_DEMO_MODE === true || (import.meta as any).env?.DEV;

  if (!isDemoMode) return null;

  const handleGenerateQuote = async () => {
    setLoading(true);
    try {
      const updated = await customTourService.addQuotation(request.id, {
        totalPrice,
        hotelName,
        hotelCategory: request.hotelCategory,
        vehicleAssigned,
        mealsIncluded,
        itineraryDetails,
        inclusions: ['Premium Accommodation', 'All transfers & tours in AC private vehicle', 'Daily meals as specified', 'Fuel & toll charges'],
        exclusions: ['Flight/Train fares unless mentioned', 'Entry ticket fees for sightseeing points', 'Laundry & personal tips']
      });
      onUpdate(updated);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const updated = await customTourService.cancelRequest(request.id);
      onUpdate(updated);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const canQuote = request.status === 'Under Review' || request.status === 'Revision Requested';
  const canCancel = request.status !== 'Confirmed Booking' && request.status !== 'Cancelled';

  return (
    <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-5 text-left space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-amber-600" /> Admin Simulator Controls
        </span>
        <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">
          Demo Mode Active
        </span>
      </div>

      <p className="text-[10.5px] text-slate-500 leading-relaxed">
        Use this panel to simulate actions taken by Beduine travel administrators (creating quotations, revisions, or cancellations) to test the customer-facing flow.
      </p>

      {canQuote && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5">
          <span className="text-[9.5px] font-black text-slate-450 uppercase tracking-wider block">
            Draft Quotation Content
          </span>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[9.5px] text-slate-450 uppercase mb-1">Total Quotation Price (INR)</label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-750 font-bold"
              />
            </div>
            <div>
              <label className="block text-[9.5px] text-slate-450 uppercase mb-1">Assigned Hotel</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-750 font-medium"
              />
            </div>
            <div>
              <label className="block text-[9.5px] text-slate-450 uppercase mb-1">Assigned Transport</label>
              <input
                type="text"
                value={vehicleAssigned}
                onChange={(e) => setVehicleAssigned(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-750 font-medium"
              />
            </div>
            <div>
              <label className="block text-[9.5px] text-slate-450 uppercase mb-1">Meals Included</label>
              <input
                type="text"
                value={mealsIncluded}
                onChange={(e) => setMealsIncluded(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-750 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9.5px] text-slate-450 uppercase mb-1">Itinerary Details</label>
            <textarea
              rows={2}
              value={itineraryDetails}
              onChange={(e) => setItineraryDetails(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs resize-none"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerateQuote}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Send Curated Quotation
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {canCancel && (
          <button
            type="button"
            disabled={loading}
            onClick={handleCancel}
            className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <AlertOctagon className="w-3.5 h-3.5" /> Cancel Request
          </button>
        )}
      </div>
    </div>
  );
};
