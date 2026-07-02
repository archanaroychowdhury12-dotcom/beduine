import {
  CustomTourRequest,
  CustomTourQuotation,
  CustomTourRevision,
  CustomTourStatus,
  TripType,
  HotelCategory,
  TransportPreference,
  MealPreference,
  TourActivity
} from '../../business_logic/types';
import { calculateEstimatedPriceRange } from '../utils/customTourCalculator';

const STORAGE_KEY = 'beduine_custom_tours';
const STORAGE_VERSION = 1;

interface CustomTourStorage {
  version: number;
  requests: CustomTourRequest[];
}

// Allowed state transitions according to specs
const allowedTransitions: Record<CustomTourStatus, CustomTourStatus[]> = {
  'Under Review': ['Quotation Sent', 'Cancelled'],
  'Quotation Sent': ['Revision Requested', 'Quotation Accepted', 'Expired', 'Cancelled'],
  'Revision Requested': ['Quotation Sent', 'Cancelled'],
  'Quotation Accepted': ['Payment Pending', 'Cancelled'],
  'Payment Pending': ['Confirmed Booking', 'Payment Failed', 'Cancelled'],
  'Payment Failed': ['Payment Pending', 'Cancelled'],
  'Confirmed Booking': [],
  'Cancelled': [],
  'Expired': []
};

// Local storage helper functions
function getStorage(): CustomTourStorage {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { version: STORAGE_VERSION, requests: getInitialMockRequests() };
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === STORAGE_VERSION && Array.isArray(parsed.requests)) {
      return parsed;
    }
    // Fallback if structure changes
    return { version: STORAGE_VERSION, requests: getInitialMockRequests() };
  } catch {
    return { version: STORAGE_VERSION, requests: getInitialMockRequests() };
  }
}

function saveStorage(requests: CustomTourRequest[]) {
  const storageData: CustomTourStorage = {
    version: STORAGE_VERSION,
    requests
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
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

// Check transition validity
function validateTransition(from: CustomTourStatus, to: CustomTourStatus): boolean {
  const allowed = allowedTransitions[from] || [];
  return allowed.includes(to);
}

// Service Layer API Methods
export const customTourService = {
  async createRequest(data: {
    userId?: string;
    userName?: string;
    packageId?: string;
    tripType: TripType;
    destination: string;
    departureCity: string;
    flexibleDates: boolean;
    travelStartDate?: string;
    travelEndDate?: string;
    flexibleMonth?: string;
    durationNights: number;
    adults: number;
    children: number;
    childAges?: number[];
    rooms: number;
    hotelCategory: HotelCategory;
    transportPreference: TransportPreference;
    mealPreference: MealPreference;
    budget: number;
    activities: TourActivity[];
    specialRequirements?: string;
    phone: string;
    email: string;
  }): Promise<CustomTourRequest> {
    const storage = getStorage();
    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    // Calculate dynamic price range
    const estimatedPriceRange = calculateEstimatedPriceRange({
      packageId: data.packageId,
      tripType: data.tripType,
      durationNights: data.durationNights,
      adults: data.adults,
      children: data.children,
      rooms: data.rooms,
      hotelCategory: data.hotelCategory,
      transportPreference: data.transportPreference,
      mealPreference: data.mealPreference,
      activities: data.activities
    });

    const displayCode = `CTR-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: CustomTourRequest = {
      ...data,
      id: `uuid-${Math.random().toString(36).substr(2, 9)}`,
      displayCode,
      status: 'Under Review',
      submissionDate: formatStr(now),
      updatedAt: formatStr(now),
      estimatedPriceRange,
      quotations: [],
      revisions: [],
      paymentStatus: 'Not Started',
      currency: 'INR'
    };

    storage.requests.push(newRequest);
    saveStorage(storage.requests);

    return newRequest;
  },

  async listRequests(userId?: string): Promise<CustomTourRequest[]> {
    const storage = getStorage();
    if (userId) {
      return storage.requests.filter(r => r.userId === userId);
    }
    return storage.requests;
  },

  async getRequestById(id: string): Promise<CustomTourRequest | null> {
    const storage = getStorage();
    const found = storage.requests.find(r => r.id === id);
    return found || null;
  },

  async addQuotation(
    requestId: string,
    quote: {
      totalPrice: number;
      hotelName: string;
      hotelCategory: HotelCategory;
      vehicleAssigned: string;
      mealsIncluded: string;
      itineraryDetails: string;
      inclusions: string[];
      exclusions: string[];
      paymentTerms?: string;
      cancellationPolicy?: string;
    }
  ): Promise<CustomTourRequest> {
    const storage = getStorage();
    const reqIndex = storage.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const request = storage.requests[reqIndex];
    if (!validateTransition(request.status, 'Quotation Sent')) {
      throw new Error(`Invalid state transition from ${request.status} to Quotation Sent`);
    }

    const version = request.quotations.length + 1;
    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const newQuotation: CustomTourQuotation = {
      ...quote,
      id: `q-${Math.random().toString(36).substr(2, 9)}`,
      requestId,
      version,
      currency: 'INR',
      paymentTerms: quote.paymentTerms || '50% advance to confirm, 50% before departure.',
      cancellationPolicy: quote.cancellationPolicy || 'Standard Beduine Cancellation Policy applies.',
      validUntil: formatStr(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
      createdAt: formatStr(now),
      status: 'Sent'
    };

    // Deactivate previous quotations
    request.quotations.forEach(q => {
      if (q.status === 'Sent') q.status = 'Expired';
    });

    request.quotations.push(newQuotation);
    request.currentQuotationId = newQuotation.id;
    request.status = 'Quotation Sent';
    request.updatedAt = formatStr(now);

    storage.requests[reqIndex] = request;
    saveStorage(storage.requests);

    return request;
  },

  async addRevision(requestId: string, message: string): Promise<CustomTourRequest> {
    const storage = getStorage();
    const reqIndex = storage.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const request = storage.requests[reqIndex];
    if (!validateTransition(request.status, 'Revision Requested')) {
      throw new Error(`Invalid state transition from ${request.status} to Revision Requested`);
    }

    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const newRevision: CustomTourRevision = {
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      requestId,
      quotationId: request.currentQuotationId,
      message,
      createdAt: formatStr(now),
      status: 'Open'
    };

    // Mark current quotation status as revision requested
    if (request.currentQuotationId) {
      const q = request.quotations.find(item => item.id === request.currentQuotationId);
      if (q) q.status = 'Revision Requested';
    }

    request.revisions.push(newRevision);
    request.status = 'Revision Requested';
    request.updatedAt = formatStr(now);

    storage.requests[reqIndex] = request;
    saveStorage(storage.requests);

    return request;
  },

  async acceptQuotation(requestId: string): Promise<CustomTourRequest> {
    const storage = getStorage();
    const reqIndex = storage.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const request = storage.requests[reqIndex];
    if (!validateTransition(request.status, 'Quotation Accepted')) {
      throw new Error(`Invalid state transition from ${request.status} to Quotation Accepted`);
    }

    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    if (request.currentQuotationId) {
      const q = request.quotations.find(item => item.id === request.currentQuotationId);
      if (q) q.status = 'Accepted';
    }

    request.status = 'Quotation Accepted';
    request.updatedAt = formatStr(now);

    storage.requests[reqIndex] = request;
    saveStorage(storage.requests);

    return request;
  },

  async moveToPaymentPending(requestId: string): Promise<CustomTourRequest> {
    const storage = getStorage();
    const reqIndex = storage.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const request = storage.requests[reqIndex];
    if (!validateTransition(request.status, 'Payment Pending')) {
      throw new Error(`Invalid state transition from ${request.status} to Payment Pending`);
    }

    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    request.status = 'Payment Pending';
    request.paymentStatus = 'Pending';
    request.updatedAt = formatStr(now);

    storage.requests[reqIndex] = request;
    saveStorage(storage.requests);

    return request;
  },

  async confirmMockPayment(requestId: string): Promise<CustomTourRequest> {
    const storage = getStorage();
    const reqIndex = storage.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const request = storage.requests[reqIndex];
    if (!validateTransition(request.status, 'Confirmed Booking')) {
      throw new Error(`Invalid state transition from ${request.status} to Confirmed Booking`);
    }

    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    request.status = 'Confirmed Booking';
    request.paymentStatus = 'Paid';
    request.bookingId = `BKG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    request.voucherCode = `VCH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    request.updatedAt = formatStr(now);

    storage.requests[reqIndex] = request;
    saveStorage(storage.requests);

    return request;
  },

  async cancelRequest(requestId: string): Promise<CustomTourRequest> {
    const storage = getStorage();
    const reqIndex = storage.requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const request = storage.requests[reqIndex];
    if (!validateTransition(request.status, 'Cancelled')) {
      throw new Error(`Invalid state transition from ${request.status} to Cancelled`);
    }

    const now = new Date();
    const formatStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    request.status = 'Cancelled';
    request.updatedAt = formatStr(now);

    storage.requests[reqIndex] = request;
    saveStorage(storage.requests);

    return request;
  }
};
