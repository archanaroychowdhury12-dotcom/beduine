import { describe, expect, it } from 'vitest';
import { calculateAdvancePaymentPlan } from '../business_logic/booking/advancePaymentSchedule';

describe('advance payment schedule', () => {
  it('collects fixed departure 25/25/30/20 and full domestic instant charge now', () => {
    const plan = calculateAdvancePaymentPlan({
      baseTourTotal: 10000,
      selectedDate: '2026-08-30',
      tourCategory: 'domestic',
      bookingType: 'fixed_departure',
      instantBookingRequired: true,
    });

    expect(plan.grandTotal).toBe(12000);
    expect(plan.instantBookingCharge).toBe(2000);
    expect(plan.installments.map((row) => row.amount)).toEqual([2000, 2500, 2500, 3000, 2000]);
    expect(plan.advanceDueNow).toBe(4500);
    expect(plan.balanceDueLater).toBe(7500);
  });

  it('collects customized tour 50/25/25 and full international instant charge now', () => {
    const plan = calculateAdvancePaymentPlan({
      baseTourTotal: 20000,
      selectedDate: '2026-09-20',
      tourCategory: 'international',
      bookingType: 'customized_tailor_made',
      instantBookingRequired: true,
    });

    expect(plan.grandTotal).toBe(25000);
    expect(plan.instantBookingCharge).toBe(5000);
    expect(plan.installments.map((row) => row.amount)).toEqual([5000, 10000, 5000, 5000]);
    expect(plan.advanceDueNow).toBe(15000);
    expect(plan.balanceDueLater).toBe(10000);
  });
});
