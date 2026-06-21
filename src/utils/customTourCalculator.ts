import {
  TripType,
  HotelCategory,
  TransportPreference,
  MealPreference,
  TourActivity,
  EstimatedPriceRange
} from '../types';

export function calculateEstimatedPriceRange(inputs: {
  tripType: TripType;
  durationNights: number;
  adults: number;
  children: number;
  rooms: number;
  hotelCategory: HotelCategory;
  transportPreference: TransportPreference;
  mealPreference: MealPreference;
  activities: TourActivity[];
}): EstimatedPriceRange {
  const {
    tripType,
    durationNights = 1,
    adults = 1,
    children = 0,
    rooms = 1,
    hotelCategory,
    transportPreference,
    mealPreference,
    activities = []
  } = inputs;

  const nights = Math.max(1, durationNights);
  const totalPeople = adults + children;
  const effectivePeople = adults + children * 0.6;

  // 1. Base cost per person depending on destination type
  const baseCostPerPerson = tripType === 'International' ? 22000 : 4500;
  const basePeopleCost = effectivePeople * baseCostPerPerson;

  // 2. Accommodation cost per room per night
  let hotelCostPerRoomPerNight = 2000; // Not Sure / Default
  switch (hotelCategory) {
    case 'Standard (2 Star)':
      hotelCostPerRoomPerNight = 1200;
      break;
    case 'Deluxe (3 Star)':
      hotelCostPerRoomPerNight = 2500;
      break;
    case 'Luxury Resort (5 Star)':
      hotelCostPerRoomPerNight = 6500;
      break;
    case 'Heritage/Homestay':
      hotelCostPerRoomPerNight = 1800;
      break;
  }
  const totalAccommodationCost = rooms * hotelCostPerRoomPerNight * nights;

  // 3. Transport Add-on costs
  let transportCost = 0;
  switch (transportPreference) {
    case 'Sedan':
      transportCost = 2500 * nights;
      break;
    case 'Premium SUV':
      transportCost = 4200 * nights;
      break;
    case 'Luxury Traveler':
      transportCost = 6500 * nights;
      break;
    case 'Flight Included':
      transportCost = (tripType === 'International' ? 35000 : 8000) * totalPeople;
      break;
    case 'Train Included':
      transportCost = 1800 * totalPeople;
      break;
  }

  // 4. Meal Add-on costs per person per night
  let mealCostPerPersonPerNight = 0;
  switch (mealPreference) {
    case 'Breakfast Only':
      mealCostPerPersonPerNight = 200;
      break;
    case 'Half Board (MAP)':
      mealCostPerPersonPerNight = 650;
      break;
    case 'Full Board (AP)':
      mealCostPerPersonPerNight = 1200;
      break;
    case 'Veg Only':
      mealCostPerPersonPerNight = 500;
      break;
  }
  const totalMealCost = mealCostPerPersonPerNight * totalPeople * nights;

  // 5. Activity Add-on costs
  let activityCostSum = 0;
  activities.forEach((act) => {
    switch (act) {
      case 'Sightseeing':
        activityCostSum += 400;
        break;
      case 'Adventure':
        activityCostSum += 1500;
        break;
      case 'Wildlife Safari':
        activityCostSum += 2000;
        break;
      case 'Trekking':
        activityCostSum += 1200;
        break;
      case 'Food Tour':
        activityCostSum += 800;
        break;
      case 'Spa & Wellness':
        activityCostSum += 2500;
        break;
      case 'Shopping':
        activityCostSum += 100;
        break;
    }
  });
  const totalActivityCost = activityCostSum * totalPeople;

  // Sum everything to get the midpoint
  let estimatedMidpoint = basePeopleCost + totalAccommodationCost + transportCost + totalMealCost + totalActivityCost;

  // Apply sensible floor caps
  const minFloor = tripType === 'International' ? 30000 : 5000;
  if (estimatedMidpoint < minFloor) {
    estimatedMidpoint = minFloor;
  }

  // Define min and max bounds
  const min = Math.round((estimatedMidpoint * 0.85) / 100) * 100;
  const max = Math.round((estimatedMidpoint * 1.25) / 100) * 100;

  return {
    min,
    max,
    currency: 'INR',
    note: 'Estimated price range based on current selection. Real cost depends on availability and dates.'
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
