import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createCustomTourService,
  type CustomTourCreateInput,
  type ProductionCustomTourAdapter,
} from '@/services/customTourService';
import {
  consumePendingCustomTourDraft,
  savePendingCustomTourDraft,
} from '@/pages/main-website-tour-page/CustomizeTourPage';
import { buildLoginRedirect } from '@/utils/appRoutes';

const validRequest: CustomTourCreateInput = {
  tripType: 'Domestic',
  destination: 'Kashmir',
  departureCity: 'Kolkata',
  flexibleDates: true,
  flexibleMonth: '2026-09',
  durationNights: 5,
  adults: 2,
  children: 0,
  rooms: 1,
  hotelCategory: 'Deluxe (3 Star)',
  transportPreference: 'Premium SUV',
  mealPreference: 'Half Board (MAP)',
  budget: 80_000,
  activities: ['Sightseeing'],
  phone: '9000000001',
  email: 'rahul@example.com',
};

afterEach(() => {
  vi.restoreAllMocks();
  sessionStorage.clear();
});

describe('production custom-tour service', () => {
  it('uses the backend and never localStorage in production', async () => {
    const created = {
      ...validRequest,
      id: 'request-1',
      displayCode: 'CTR-000001',
      status: 'Under Review' as const,
      submissionDate: '02 Jul 2026',
      updatedAt: '02 Jul 2026',
      estimatedPriceRange: {
        min: 70_000,
        max: 90_000,
        currency: 'INR' as const,
        note: 'Estimate',
      },
      quotations: [],
      revisions: [],
      currency: 'INR' as const,
    };
    const adapter = {
      createCustomTourRequest: vi.fn().mockResolvedValue(created),
      listCustomTourRequests: vi.fn().mockResolvedValue([]),
      updateCustomTourRequest: vi.fn(),
    } as ProductionCustomTourAdapter;
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
    const service = createCustomTourService('production', adapter);

    await expect(service.createRequest(validRequest)).resolves.toEqual(created);
    expect(adapter.createCustomTourRequest).toHaveBeenCalledWith(validRequest);
    expect(storageSpy).not.toHaveBeenCalled();
  });

  it('stores only non-sensitive anonymous preferences and restores profile contact', () => {
    savePendingCustomTourDraft({
      ...validRequest,
      phone: '9999999999',
      email: 'anonymous@example.com',
    });

    const serialized = sessionStorage.getItem('beduine_pending_custom_tour');
    expect(serialized).not.toContain('9999999999');
    expect(serialized).not.toContain('anonymous@example.com');

    expect(consumePendingCustomTourDraft({
      phone: '9000000002',
      email: 'member@example.com',
    })).toEqual({
      ...validRequest,
      phone: '9000000002',
      email: 'member@example.com',
    });
    expect(sessionStorage.getItem('beduine_pending_custom_tour')).toBeNull();
    expect(buildLoginRedirect('/paid-tour#customize')).toBe(
      '/login?next=%2Fpaid-tour%23customize',
    );
  });
});
