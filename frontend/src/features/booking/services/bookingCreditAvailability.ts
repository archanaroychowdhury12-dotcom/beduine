import type { CustomerDiscountCreditUnit } from '@/services/backend';

type CreditUnitState = Pick<
  CustomerDiscountCreditUnit,
  'creditCategory' | 'status'
>;

export function countAvailableBookingCredits(
  units: CreditUnitState[],
): { domestic: number; international: number } {
  return units.reduce(
    (counts, unit) => {
      if (unit.status === 'available') counts[unit.creditCategory] += 1;
      return counts;
    },
    { domestic: 0, international: 0 },
  );
}
