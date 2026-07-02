import { describe, expect, it } from 'vitest';
import { calculateAdvancePaymentPlan } from '../src/features/booking/utils/advancePaymentSchedule';

describe('advance payment schedule', () => {
  it('creates fixed departure 25/25/30/20 schedule', () => {
    const plan = calculateAdvancePaymentPlan({
      baseTourTotal: 100000,
      selectedDate: '2026-12-21',
      tourCategory: 'domestic',
      bookingType: 'fixed_departure',
    });

    expect(plan.bookingTypeLabel).toBe('Fixed Departure Group Tour');
    expect(plan.advanceDueNow).toBe(25000);
    expect(plan.balanceDueLater).toBe(75000);
    expect(plan.installments.map((row) => row.percentage)).toEqual([25, 25, 30, 20]);
    expect(plan.installments.map((row) => row.amount)).toEqual([25000, 25000, 30000, 20000]);
  });

  it('creates customized 50/25/25 schedule', () => {
    const plan = calculateAdvancePaymentPlan({
      baseTourTotal: 80000,
      selectedDate: '2026-11-15',
      tourCategory: 'domestic',
      bookingType: 'customized_tailor_made',
    });

    expect(plan.bookingTypeLabel).toBe('Customized / Tailor-Made Tour');
    expect(plan.advanceDueNow).toBe(40000);
    expect(plan.balanceDueLater).toBe(40000);
    expect(plan.installments.map((row) => row.percentage)).toEqual([50, 25, 25]);
  });

  it('adds instant booking charges fully to pay-now advance', () => {
    const domesticPlan = calculateAdvancePaymentPlan({
      baseTourTotal: 100000,
      tourCategory: 'domestic',
      bookingType: 'fixed_departure',
      instantBookingRequired: true,
    });

    const internationalPlan = calculateAdvancePaymentPlan({
      baseTourTotal: 100000,
      tourCategory: 'international',
      bookingType: 'customized_tailor_made',
      instantBookingRequired: true,
    });

    expect(domesticPlan.instantBookingCharge).toBe(2000);
    expect(domesticPlan.grandTotal).toBe(102000);
    expect(domesticPlan.advanceDueNow).toBe(27000);

    expect(internationalPlan.instantBookingCharge).toBe(5000);
    expect(internationalPlan.grandTotal).toBe(105000);
    expect(internationalPlan.advanceDueNow).toBe(55000);
  });
});
