import React from 'react';
import { Car, Building2, MapPin, HelpCircle, BadgeInfo, Check } from 'lucide-react';
import { PickupInfo } from '../../types';

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  perPerson: boolean;
  icon: string;
}

export const ADD_ONS: AddOn[] = [
  { id: 'ac_vehicle', name: 'AC Vehicle Upgrade', description: 'Upgrade your transfers to an air-conditioned premium vehicle.', price: 1200, perPerson: false, icon: 'ac_vehicle' },
  { id: 'insurance', name: 'Travel Insurance Cover', description: 'Full emergency medical cover, luggage, and trip delay insurance.', price: 399, perPerson: true, icon: 'insurance' },
  { id: 'tour_guide', name: 'Personal Tour Guide', description: 'A dedicated certified local guide for your travel group.', price: 1500, perPerson: false, icon: 'tour_guide' },
  { id: 'meal_plan', name: 'Premium Meal Upgrade', description: 'All major meals upgraded to premium local restaurant menus.', price: 1200, perPerson: true, icon: 'meal_plan' },
  { id: 'special_assist', name: 'Special Wheelchair Assistance', description: 'Priority boarding and physical assistance at all boat/watchtower points.', price: 0, perPerson: false, icon: 'special_assist' },
  { id: 'extra_luggage', name: 'Extra Luggage Allowance', description: 'Carry up to 2 extra bags per traveler.', price: 500, perPerson: false, icon: 'extra_luggage' },
  { id: 'airport_transfer', name: 'Airport Private Transfer', description: 'Direct pickup or drop from airport to jetty/hotel.', price: 1800, perPerson: false, icon: 'airport_transfer' }
];

interface PickupSectionProps {
  pickup: PickupInfo;
  setPickup: React.Dispatch<React.SetStateAction<PickupInfo>>;
  destinationName: string;
  currentUser?: any;
  addOnsSelected: string[];
  onToggleAddOn: (id: string) => void;
  travelerCount: number;
}

const PICKUP_POINTS: Record<string, string[]> = {
  Sundarbans: [
    'BEDUINE Kolkata Assistance Desk',
    'Science City Kolkata Pickup Point',
    'Esplanade Group Pickup Point',
    'Godkhali Jetty Meeting Point',
  ],
  Darjeeling: [
    'NJP Railway Station Pickup Point',
    'Bagdogra Airport Arrival Gate',
    'Siliguri Hotel Pickup',
    'Darjeeling Mall Road Drop Point',
  ],
  Puri: [
    'Puri Railway Station Pickup Point',
    'Bhubaneswar Airport Arrival Gate',
    'Puri Sea Beach Hotel Pickup',
    'Swargadwar Pickup Point',
  ],
  Kashmir: [
    'Srinagar Airport Pickup Point',
    'Dal Lake Gate Pickup',
    'Srinagar Hotel Pickup',
    'Houseboat Jetty Meeting Point',
  ],
  Dubai: [
    'Dubai International Airport Arrival Gate',
    'Dubai Marina Hotel Pickup',
    'Deira Hotel Pickup',
    'Bur Dubai Hotel Pickup',
  ],
  Thailand: [
    'Bangkok Airport Arrival Gate',
    'Pattaya Hotel Pickup',
    'Bangkok Sukhumvit Hotel Pickup',
    'Coral Island Tour Meeting Point',
  ],
};

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const PickupSection: React.FC<PickupSectionProps> = ({
  pickup,
  setPickup,
  destinationName,
  addOnsSelected,
  onToggleAddOn,
  travelerCount,
}) => {
  const destinationKey = Object.keys(PICKUP_POINTS).find((key) => destinationName.includes(key)) || 'Sundarbans';
  const pickupPoints = PICKUP_POINTS[destinationKey];

  const updateField = (field: keyof PickupInfo, value: any) => {
    setPickup((prev) => ({ ...prev, [field]: value }));
  };

  const getAddOnCost = (addOn: AddOn) => {
    return addOn.perPerson ? addOn.price * travelerCount : addOn.price;
  };

  // Add-ons Subtotal
  const addOnsSubtotal = ADD_ONS.filter((item) => addOnsSelected.includes(item.id)).reduce(
    (sum, item) => sum + getAddOnCost(item),
    0
  );

  return (
    <div className="space-y-8 text-left">
      
      {/* Pickup Section */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-0.5">Step 4 — Pickup & Add-ons</span>
          <h3 className="text-xl font-bold text-slate-900">Customize Ground Transfers</h3>
          <p className="text-xs text-slate-500 mt-1">Provide your pickup point or request help from our logistics team.</p>
        </div>

        {/* Pickup Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { type: 'hotel' as const, label: 'Suggested Point', icon: Building2 },
            { type: 'manual' as const, label: 'Manual Address', icon: MapPin },
            { type: 'assistance' as const, label: 'Request Help', icon: HelpCircle },
            { type: 'none' as const, label: 'Self Arrival', icon: Car },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = pickup.type === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => updateField('type', item.type)}
                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 h-24 cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/15 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-350'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold text-slate-800">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Suggested pickup point selection list */}
        {pickup.type === 'hotel' && (
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 animate-fadeIn shadow-sm">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Available Meeting Spots for {destinationKey}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pickupPoints.map((point) => (
                <button
                  key={point}
                  type="button"
                  onClick={() => updateField('hotelName', point)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    pickup.hotelName === point
                      ? 'border-amber-500 bg-amber-50/20 text-amber-955'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {point}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual Address Selector */}
        {pickup.type === 'manual' && (
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-4 animate-fadeIn shadow-sm">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Provide Detailed Address
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Street Address, Building Name / Hotel Name *"
                  value={pickup.customAddress || ''}
                  onChange={(e) => updateField('customAddress', e.target.value)}
                  className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Landmark"
                  value={pickup.landmark || ''}
                  onChange={(e) => updateField('landmark', e.target.value)}
                  className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="City *"
                  value={pickup.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Pincode *"
                  value={pickup.pincode || ''}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className="w-full bg-slate-50/50 py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Request Pickup Assistance */}
        {pickup.type === 'assistance' && (
          <div className="p-5 bg-amber-50/40 border border-amber-200 rounded-2xl space-y-3 animate-fadeIn text-xs text-slate-700">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <BadgeInfo className="w-4 h-4 text-amber-600" />
              <span>How Pickup Assistance Works</span>
            </h4>
            <p className="leading-relaxed">
              Our operations dispatch desk will contact you at your lead traveler phone number to coordinate the optimal pickup coordinate.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-[10px] font-bold text-slate-500 font-mono">
              <div>
                <span className="block text-slate-400">Assistance Fee</span>
                <span className="text-emerald-700">₹0 (Free / Complementary)</span>
              </div>
              <div>
                <span className="block text-slate-400">Response Window</span>
                <span className="text-slate-800">Within 2 hours of payment receipt</span>
              </div>
            </div>
          </div>
        )}

        {/* Dropoff Different Switch */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl gap-3">
          <span className="text-xs font-bold text-slate-700">Drop-off destination is different from pickup point</span>
          <button
            type="button"
            onClick={() => updateField('dropoffDifferent', !pickup.dropoffDifferent)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              pickup.dropoffDifferent ? 'bg-amber-500' : 'bg-slate-350'
            }`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
              pickup.dropoffDifferent ? 'translate-x-5' : ''
            }`} />
          </button>
        </div>

        {pickup.dropoffDifferent && (
          <input
            type="text"
            placeholder="Enter drop-off destination address *"
            value={pickup.dropoffLocation || ''}
            onChange={(e) => updateField('dropoffLocation', e.target.value)}
            className="w-full bg-slate-50/50 py-3 px-4 rounded-lg border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 animate-fadeIn"
          />
        )}

        {/* Pickup Notes */}
        <input
          type="text"
          placeholder="Pickup notes / preferences (e.g. need luggage helper, arrive before 8 AM) (Optional)"
          value={pickup.specialInstructions || ''}
          onChange={(e) => updateField('specialInstructions', e.target.value)}
          className="w-full bg-slate-50/50 py-3 px-4 rounded-lg border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 animate-fadeIn"
        />
      </div>

      {/* Add-ons Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Optional Expedition Add-ons</h4>
          <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            Subtotal: {formatINR(addOnsSubtotal)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ADD_ONS.map((addon) => {
            const isSelected = addOnsSelected.includes(addon.id);
            const totalCost = getAddOnCost(addon);

            return (
              <div
                key={addon.id}
                onClick={() => onToggleAddOn(addon.id)}
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer h-24 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/10 shadow-sm ring-2 ring-amber-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Checkbox circle */}
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 font-bold" />}
                </div>

                <div className="truncate flex-grow flex flex-col justify-between h-full text-left">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block truncate">{addon.name}</span>
                    <span className="text-[10px] text-slate-500 block leading-tight line-clamp-2 mt-0.5">
                      {addon.description}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-slate-700 pt-1 mt-1 border-t border-slate-50">
                    {formatINR(addon.price)} {addon.perPerson ? '/ person' : '/ group'}
                    {addon.perPerson && travelerCount > 1 && (
                      <span className="text-slate-400 font-semibold ml-1">(Total: {formatINR(totalCost)})</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
