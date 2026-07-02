import { useEffect, useState } from 'react';
import { PickupInfo, TourPackage } from '../../../types';

const DEFAULT_PICKUP: PickupInfo = {
  type: 'hotel',
  hotelName: 'BEDUINE Kolkata Assistance Desk',
  customAddress: '',
  landmark: '',
  city: 'Kolkata',
  pincode: '700001',
  dropoffDifferent: false,
  dropoffLocation: '',
  specialInstructions: 'Please call before pickup confirmation.',
};

const PICKUP_DEFAULTS = [
  { match: ['Sundarbans', 'Puri'], hotelName: 'BEDUINE Kolkata Assistance Desk', city: 'Kolkata' },
  { match: ['Darjeeling'], hotelName: 'NJP Railway Station Pickup Point', city: 'Siliguri' },
  { match: ['Kashmir'], hotelName: 'Srinagar Airport Pickup Point', city: 'Srinagar' },
  { match: ['Dubai'], hotelName: 'Dubai International Airport Arrival Gate', city: 'Dubai' },
  { match: ['Thailand'], hotelName: 'Bangkok Airport Arrival Gate', city: 'Bangkok' },
];

export function usePickupDefaults(selectedTour: TourPackage) {
  const [pickup, setPickup] = useState<PickupInfo>(DEFAULT_PICKUP);

  useEffect(() => {
    const rule = PICKUP_DEFAULTS.find(item => item.match.some(keyword => selectedTour.destination.includes(keyword)));
    if (rule) {
      setPickup(p => ({ ...p, hotelName: rule.hotelName, city: rule.city }));
    }
  }, [selectedTour]);

  return { pickup, setPickup };
}
