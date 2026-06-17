import React from 'react';
import { ArrowRightLeft, Building2, Car, HelpCircle, MapPin } from 'lucide-react';
import { PickupInfo } from '../../types';

interface PickupSectionProps {
  pickup: PickupInfo;
  setPickup: React.Dispatch<React.SetStateAction<PickupInfo>>;
  destinationName: string;
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

export const PickupSection: React.FC<PickupSectionProps> = ({ pickup, setPickup, destinationName }) => {
  const destinationKey = Object.keys(PICKUP_POINTS).find((key) => destinationName.includes(key)) || 'Sundarbans';
  const pickupPoints = PICKUP_POINTS[destinationKey];

  const updateField = (field: keyof PickupInfo, value: any) => {
    setPickup((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="step-5" className="py-16 scroll-mt-24 border-t border-slate-200/80 text-left">
      <div className="space-y-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600">
          <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">5</span>
          <span>Pickup & Drop-Off</span>
        </div>
        <h2 className="font-serif-premium text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Customize Pickup and Ground Transfers
        </h2>
        <p className="text-slate-600 text-sm max-w-2xl">
          Choose a BEDUINE suggested meeting point or enter your own hotel, home, station, airport, or custom address.
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center space-x-2">
            <Car className="w-4 h-4 text-amber-500" />
            <span>Select Pickup Type</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { type: 'hotel' as const, label: 'Suggested Pickup Point', icon: Building2 },
              { type: 'manual' as const, label: 'Manual Address', icon: MapPin },
              { type: 'none' as const, label: 'I Will Reach Myself', icon: HelpCircle },
            ].map((item) => {
              const Icon = item.icon;
              const selected = pickup.type === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => updateField('type', item.type)}
                  className={`p-4 rounded-2xl text-left font-bold text-sm transition-all border flex items-center space-x-3 cursor-pointer ${
                    selected
                      ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-lg'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {pickup.type === 'hotel' && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">
              Suggested pickup points for {destinationKey}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pickupPoints.map((point) => (
                <button
                  key={point}
                  type="button"
                  onClick={() => updateField('hotelName', point)}
                  className={`p-4 rounded-2xl border text-left text-sm font-bold transition-all cursor-pointer ${
                    pickup.hotelName === point
                      ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-amber-300'
                  }`}
                >
                  {point}
                </button>
              ))}
            </div>
          </div>
        )}

        {pickup.type === 'manual' && (
          <div className="space-y-3 animate-fadeIn">
            <label className="block text-xs font-black uppercase text-slate-500 tracking-wider">
              Manual pickup address
            </label>
            <textarea
              value={pickup.customAddress || ''}
              onChange={(event) => updateField('customAddress', event.target.value)}
              placeholder="Enter hotel name, home address, railway station, airport terminal, or landmark."
              rows={4}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        )}

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={() => updateField('dropoffDifferent', !pickup.dropoffDifferent)}
            className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-black text-slate-800">
              <ArrowRightLeft className="w-4 h-4 text-amber-500" />
              Drop-off location is different
            </span>
            <span className={`w-12 h-6 rounded-full transition-colors relative ${pickup.dropoffDifferent ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${pickup.dropoffDifferent ? 'translate-x-6' : ''}`} />
            </span>
          </button>

          {pickup.dropoffDifferent && (
            <input
              type="text"
              value={pickup.dropoffLocation || ''}
              onChange={(event) => updateField('dropoffLocation', event.target.value)}
              placeholder="Enter final drop-off location"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          )}

          <textarea
            value={pickup.specialInstructions || ''}
            onChange={(event) => updateField('specialInstructions', event.target.value)}
            placeholder="Pickup notes, timing preference, elderly traveler support, luggage details, etc."
            rows={3}
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </section>
  );
};
