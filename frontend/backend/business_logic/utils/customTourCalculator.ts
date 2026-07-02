import {
  TripType,
  HotelCategory,
  TransportPreference,
  MealPreference,
  TourActivity,
  EstimatedPriceRange
} from '../types';
import { TOUR_PACKAGES } from '../data/tours';

export function calculateEstimatedPriceRange(inputs: {
  packageId?: string;
  tripType?: TripType;
  durationNights?: number;
  adults: number;
  children: number;
  rooms: number;
  hotelCategory: HotelCategory;
  transportPreference: TransportPreference;
  mealPreference: MealPreference;
  activities: TourActivity[];
}): EstimatedPriceRange {
  const {
    packageId,
    durationNights,
    adults = 1,
    children = 0,
    rooms = 1,
    hotelCategory,
    transportPreference,
    mealPreference,
    activities = []
  } = inputs;

  const travelerCount = adults + children;

  // Find the selected package from TOUR_PACKAGES by ID. If not found, fall back to a default cost.
  const pkg = TOUR_PACKAGES.find(p => p.id === packageId) || TOUR_PACKAGES[0];

  // Base Price = package.basePrice * travelerCount (travelers = adults + children)
  const basePricePerPerson = pkg ? pkg.basePrice : (inputs.tripType === 'International' ? 22000 : 4500);
  const basePrice = basePricePerPerson * travelerCount;

  // Actual nights
  const actualNights = durationNights !== undefined ? durationNights : (pkg ? pkg.durationNights : 4);
  const nights = Math.max(1, actualNights);

  // Hotel Surcharge: Room upgrades per night (Standard/Heritage: 0, Deluxe: 1000/room/night, Luxury: 4000/room/night)
  let hotelSurchargePerRoomPerNight = 0;
  if (hotelCategory === 'Deluxe (3 Star)') {
    hotelSurchargePerRoomPerNight = 1000;
  } else if (hotelCategory === 'Luxury Resort (5 Star)') {
    hotelSurchargePerRoomPerNight = 4000;
  }
  const hotelSurcharge = rooms * hotelSurchargePerRoomPerNight * nights;

  // Transport Surcharge: Transport upgrades (SUV: 1500/night, Luxury Traveler: 3000/night, Flight: 6000/person, Train/Sedan/None/Not Sure: 0)
  let transportSurcharge = 0;
  if (transportPreference === 'Premium SUV') {
    transportSurcharge = 1500 * nights;
  } else if (transportPreference === 'Luxury Traveler') {
    transportSurcharge = 3000 * nights;
  } else if (transportPreference === 'Flight Included') {
    transportSurcharge = 6000 * travelerCount;
  }

  // Meal Surcharge: Meal upgrades per person per night (Breakfast/None/Not Sure: 0, MAP: 400/person/night, AP: 900/person/night, Veg: 250/person/night)
  let mealSurchargePerPersonPerNight = 0;
  if (mealPreference === 'Half Board (MAP)') {
    mealSurchargePerPersonPerNight = 400;
  } else if (mealPreference === 'Full Board (AP)') {
    mealSurchargePerPersonPerNight = 900;
  } else if (mealPreference === 'Veg Only') {
    mealSurchargePerPersonPerNight = 250;
  }
  const mealSurcharge = mealSurchargePerPersonPerNight * travelerCount * nights;

  // Extra Nights Surcharge: If durationNights > package.durationNights, each extra night adds 2500 * travelerCount
  let extraNightsSurcharge = 0;
  const baseNights = pkg ? pkg.durationNights : 4;
  if (nights > baseNights) {
    extraNightsSurcharge = (nights - baseNights) * 2500 * travelerCount;
  }

  // Activity Surcharge: Surcharge per person per activity (Sightseeing/Shopping: 0, Adventure: 1500, Wildlife: 2000, Trekking: 1200, Food Tour: 800, Spa & Wellness: 2500)
  let activitySurchargePerPerson = 0;
  activities.forEach((act) => {
    switch (act) {
      case 'Adventure':
        activitySurchargePerPerson += 1500;
        break;
      case 'Wildlife Safari':
        activitySurchargePerPerson += 2000;
        break;
      case 'Trekking':
        activitySurchargePerPerson += 1200;
        break;
      case 'Food Tour':
        activitySurchargePerPerson += 800;
        break;
      case 'Spa & Wellness':
        activitySurchargePerPerson += 2500;
        break;
      // Sightseeing / Shopping -> 0
    }
  });
  const activitySurcharge = activitySurchargePerPerson * travelerCount;

  // Total estimated price
  const total = basePrice + hotelSurcharge + transportSurcharge + mealSurcharge + extraNightsSurcharge + activitySurcharge;

  // Calculate min/max bounds (min = total * 0.9, max = total * 1.15)
  const min = Math.round((total * 0.9) / 100) * 100;
  const max = Math.round((total * 1.15) / 100) * 100;

  return {
    min,
    max,
    currency: 'INR',
    note: 'Estimated price range based on current selection. Real cost depends on availability and dates.',
    breakdown: {
      basePrice,
      hotelSurcharge,
      transportSurcharge,
      mealSurcharge,
      extraNightsSurcharge,
      activitySurcharge,
      total
    }
  };
}

export function getBudgetMessage(budget: number, estimate: EstimatedPriceRange): string {
  if (!budget || budget <= 0) return '';
  if (budget < estimate.min) {
    return '⚠️ Your budget is below the estimated average. Our team will optimize the quote but compromises in hotel tier or transport might be needed.';
  }
  if (budget >= estimate.min && budget <= estimate.max) {
    return '✅ Your budget fits our estimated price range. We can construct a solid itinerary within this.';
  }
  return '✨ Your budget is premium! We can include high-end accommodations and exclusive experiences.';
}
