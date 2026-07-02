import { describe, expect, it } from 'vitest';
import { calculateBookingPricing } from '../src/features/booking/utils/pricing';
import { TourPackage, Traveler } from '../src/types';

const baseTour: TourPackage = {
  id: 'puri-escape',
  name: 'Puri Beach Escape',
  destination: 'Puri',
  duration: '3D/2N',
  category: 'domestic',
  basePrice: 10000,
  image: '/images/puri.png',
  rating: 4.8,
  reviews: 128,
  availableDates: ['2026-07-01'],
  highlights: [],
  inclusions: [],
  itinerary: [],
  groupSize: {
    min: 1,
    max: 8,
    privateSurchargePerPerson: 2000,
  },
};

const travelers: Traveler[] = [
  { firstName: 'A', lastName: 'B', email: 'a@example.com', phone: '9999999999', isLead: true, ageGroup: 'Adult' },
  { firstName: 'C', lastName: 'D', email: 'c@example.com', phone: '8888888888', isLead: false, ageGroup: 'Adult' },
];

describe('calculateBookingPricing', () => {
  it('calculates base subtotal and tax without discounts', () => {
    const pricing = calculateBookingPricing({
      selectedTour: baseTour,
      travelers,
      isPrivateTour: false,
      planDetails: null,
      addOnsSelected: [],
      addOns: [],
      appliedDiscountCredits: 0,
    });

    expect(pricing.subtotalBase).toBe(20000);
    expect(pricing.serviceFeeOrTax).toBe(1000);
    expect(pricing.totalPayable).toBe(21000);
  });

  it('supports the production catalog total without an unconfigured client fee', () => {
    const pricing = calculateBookingPricing({
      selectedTour: baseTour,
      travelers,
      isPrivateTour: false,
      planDetails: null,
      addOnsSelected: [],
      addOns: [],
      appliedDiscountCredits: 0,
      serviceFeeRate: 0,
    });

    expect(pricing.serviceFeeOrTax).toBe(0);
    expect(pricing.totalPayable).toBe(20000);
  });

  it('applies private surcharge and domestic discount credits', () => {
    const pricing = calculateBookingPricing({
      selectedTour: baseTour,
      travelers,
      isPrivateTour: true,
      planDetails: null,
      addOnsSelected: [],
      addOns: [],
      appliedDiscountCredits: 2,
    });

    expect(pricing.privateSurchargeTotal).toBe(4000);
    expect(pricing.discountCreditsTotal).toBe(1000);
    expect(pricing.subtotalBeforeVoucher).toBe(23000);
  });

  it('caps fixed voucher discount at subtotal before voucher', () => {
    const pricing = calculateBookingPricing({
      selectedTour: { ...baseTour, basePrice: 500 },
      travelers: travelers.slice(0, 1),
      isPrivateTour: false,
      appliedVoucher: { code: 'MEGA', type: 'fixed', value: 5000, description: 'large voucher' },
      planDetails: null,
      addOnsSelected: [],
      addOns: [],
      appliedDiscountCredits: 0,
    });

    expect(pricing.voucherDiscountAmount).toBe(500);
    expect(pricing.totalPayable).toBe(0);
  });
});
