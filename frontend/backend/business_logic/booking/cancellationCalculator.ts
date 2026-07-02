export interface CancellationChargeInput {
  totalTourCost: number;
  departureDate: string | Date;
  cancellationDate?: string | Date;
  travelerCount: number;
  trainFlightSupplierCharges?: number;
  noShow?: boolean;
}

export interface CancellationChargeResult {
  daysBeforeDeparture: number;
  cancellationFeePercent: number;
  landPackageCancellationCharge: number;
  serviceCharge: number;
  supplierCharges: number;
  totalDeduction: number;
  estimatedRefund: number;
  policyBand: '30_plus_days' | '15_to_29_days' | '7_to_14_days' | '0_to_6_days' | 'no_show';
  note: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(input: string | Date): Date {
  return input instanceof Date ? input : new Date(input);
}

function money(value: number): number {
  return Math.max(0, Math.round(value));
}

export function calculateCancellationCharge({
  totalTourCost,
  departureDate,
  cancellationDate = new Date(),
  travelerCount,
  trainFlightSupplierCharges = 0,
  noShow = false,
}: CancellationChargeInput): CancellationChargeResult {
  const departure = toDate(departureDate);
  const cancelledAt = toDate(cancellationDate);
  const daysBeforeDeparture = Math.ceil((departure.getTime() - cancelledAt.getTime()) / DAY_MS);
  const safeTotal = money(totalTourCost);
  const safeTravelerCount = Math.max(1, Math.floor(travelerCount || 1));
  const supplierCharges = money(trainFlightSupplierCharges);

  if (noShow) {
    return {
      daysBeforeDeparture,
      cancellationFeePercent: 100,
      landPackageCancellationCharge: safeTotal,
      serviceCharge: 0,
      supplierCharges,
      totalDeduction: safeTotal,
      estimatedRefund: 0,
      policyBand: 'no_show',
      note: 'No-show on departure date: no refund is provided.',
    };
  }

  let cancellationFeePercent = 100;
  let serviceCharge = 0;
  let policyBand: CancellationChargeResult['policyBand'] = '0_to_6_days';

  if (daysBeforeDeparture >= 30) {
    cancellationFeePercent = 0;
    serviceCharge = 500 * safeTravelerCount;
    policyBand = '30_plus_days';
  } else if (daysBeforeDeparture >= 15) {
    cancellationFeePercent = 25;
    policyBand = '15_to_29_days';
  } else if (daysBeforeDeparture >= 7) {
    cancellationFeePercent = 50;
    policyBand = '7_to_14_days';
  }

  const landPackageCancellationCharge = money((safeTotal * cancellationFeePercent) / 100);
  const totalDeduction = Math.min(safeTotal, money(landPackageCancellationCharge + serviceCharge + supplierCharges));
  const estimatedRefund = money(safeTotal - totalDeduction);

  return {
    daysBeforeDeparture,
    cancellationFeePercent,
    landPackageCancellationCharge,
    serviceCharge,
    supplierCharges,
    totalDeduction,
    estimatedRefund,
    policyBand,
    note:
      policyBand === '30_plus_days'
        ? 'No cancellation charge on land package; ₹500/person consultation and service charge plus supplier deductions apply.'
        : `${cancellationFeePercent}% of total tour cost charged as cancellation fee, plus applicable supplier deductions.`,
  };
}
