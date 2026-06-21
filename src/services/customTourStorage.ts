import { CustomTourRequest } from '../types';

const STORAGE_KEY = 'beduine_custom_tours';
const STORAGE_VERSION = 1;

export interface CustomTourStorage {
  version: number;
  requests: CustomTourRequest[];
}

// Initial mock requests for the demo
function getInitialMockRequests(): CustomTourRequest[] {
  const now = new Date();
  const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return [
    {
      id: 'uuid-1',
      displayCode: 'CTR-7821',
      userId: 'p-rah-1', // Linked to the demo user Rahul Sen
      userName: 'Rahul Sen',
      tripType: 'Domestic',
      destination: 'Kashmir Valley',
      departureCity: 'Kolkata',
      flexibleDates: true,
      flexibleMonth: '2026-09',
      durationNights: 5,
      adults: 4,
      children: 0,
      rooms: 2,
      hotelCategory: 'Deluxe (3 Star)',
      transportPreference: 'Premium SUV',
      mealPreference: 'Half Board (MAP)',
      budget: 85000,
      currency: 'INR',
      activities: ['Sightseeing', 'Adventure'],
      specialRequirements: 'Need a senior citizen friendly vehicle.',
      phone: '9876543210',
      email: 'rahul.sen@example.com',
      status: 'Quotation Sent',
      submissionDate: formatStr(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)),
      updatedAt: formatStr(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
      estimatedPriceRange: {
        min: 68000,
        max: 98000,
        currency: 'INR',
        note: 'Estimated price range based on current selection.'
      },
      quotations: [
        {
          id: 'q-1',
          requestId: 'uuid-1',
          version: 1,
          totalPrice: 82500,
          currency: 'INR',
          hotelName: 'Grand Mumtaz (Srinagar) & Snowland (Pahalgam)',
          hotelCategory: 'Deluxe (3 Star)',
          vehicleAssigned: 'Toyota Innova Crysta AC (Private)',
          mealsIncluded: 'Daily Breakfast and Dinner (MAP)',
          itineraryDetails: 'Day 1: Arrival & Srinagar Local Sightseeing. Day 2: Srinagar to Gulmarg Excursion. Day 3: Srinagar to Pahalgam. Day 4: Pahalgam Valley Sightseeing. Day 5: Return to Srinagar. Day 6: Departure.',
          inclusions: ['Private Innova Crysta for 6 days', 'Deluxe Rooms', 'Shikara Ride on Dal Lake (1 hour)', 'Taxes & Driver Allowances'],
          exclusions: ['Flight tickets to/from Srinagar', 'Gondola ride tickets', 'Personal expenses', 'Tips & Porterage'],
          paymentTerms: '50% advance to confirm, 50% on arrival.',
          cancellationPolicy: '100% refund if cancelled 15 days before departure.',
          validUntil: formatStr(new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000)),
          createdAt: formatStr(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)),
          status: 'Sent'
        }
      ],
      currentQuotationId: 'q-1',
      revisions: []
    },
    {
      id: 'uuid-2',
      displayCode: 'CTR-4512',
      userId: 'p-rah-1',
      userName: 'Rahul Sen',
      tripType: 'Domestic',
      destination: 'Sundarbans Forest',
      departureCity: 'Kolkata',
      flexibleDates: false,
      travelStartDate: '2026-10-12',
      travelEndDate: '2026-10-15',
      durationNights: 3,
      adults: 2,
      children: 0,
      rooms: 1,
      hotelCategory: 'Standard (2 Star)',
      transportPreference: 'Sedan',
      mealPreference: 'Full Board (AP)',
      budget: 18000,
      currency: 'INR',
      activities: ['Sightseeing', 'Wildlife Safari'],
      specialRequirements: 'Vegetarian meals only.',
      phone: '9876543210',
      email: 'rahul.sen@example.com',
      status: 'Under Review',
      submissionDate: formatStr(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)),
      updatedAt: formatStr(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)),
      estimatedPriceRange: {
        min: 12000,
        max: 18000,
        currency: 'INR',
        note: 'Estimated price range based on current selection.'
      },
      quotations: [],
      revisions: []
    }
  ];
}

export function getStorage(): CustomTourStorage {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = { version: STORAGE_VERSION, requests: getInitialMockRequests() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === STORAGE_VERSION && Array.isArray(parsed.requests)) {
      return parsed;
    }
    // Fallback if structure changes
    const fallback = { version: STORAGE_VERSION, requests: getInitialMockRequests() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  } catch {
    const fallback = { version: STORAGE_VERSION, requests: getInitialMockRequests() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

export function saveStorage(requests: CustomTourRequest[]) {
  const storageData: CustomTourStorage = {
    version: STORAGE_VERSION,
    requests
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
}
