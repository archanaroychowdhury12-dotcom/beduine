import { PriceCalculation, TourPackage, Traveler, Voucher } from '../../../types';
import { CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from '../../../utils/creditHelpers';

type AddOn = {
  id: string;
  price: number;
  perPerson?: boolean;
};

type CalculateBookingPricingInput = {
  selectedTour: TourPackage;
  travelers: Traveler[];
  isPrivateTour: boolean;
  appliedVoucher?: Voucher;
  planDetails: any;
  addOnsSelected: string[];
  addOns: AddOn[];
  appliedDiscountCredits: number;
  serviceFeeRate?: number;
};

export function calculateBookingPricing({
  selectedTour,
  travelers,
  isPrivateTour,
  appliedVoucher,
  planDetails,
  addOnsSelected,
  addOns,
  appliedDiscountCredits,
  serviceFeeRate = 0.05,
}: CalculateBookingPricingInput): PriceCalculation {
  const basePricePerPerson = selectedTour.basePrice;
  const travelerCount = travelers.length;
  const subtotalBase = basePricePerPerson * travelerCount;

  const privateSurchargeTotal = isPrivateTour
    ? selectedTour.groupSize.privateSurchargePerPerson * travelerCount
    : 0;

  let memberDiscountPercent = 0;
  if (planDetails) {
    const discountText = planDetails.paidDiscount || '';
    const match = discountText.match(/\d+/);
    if (match) {
      memberDiscountPercent = parseInt(match[0], 10);
    }
  }
  const memberDiscountTotal = Math.round((subtotalBase * memberDiscountPercent) / 100);

  let addOnsTotal = 0;
  let insuranceTotal = 0;
  const isInsuranceSelected = addOnsSelected.includes('insurance');

  addOns.forEach((addon) => {
    if (addOnsSelected.includes(addon.id)) {
      if (addon.id === 'insurance') {
        const baseInsurance = 399;
        let rate = baseInsurance;
        if (planDetails) {
          const rule = ((planDetails as any).insurance || '').toLowerCase();
          if (rule.includes('free') || rule.includes('included')) rate = 0;
          else if (rule.includes('50%')) rate = Math.round(baseInsurance / 2);
        }
        insuranceTotal = rate * travelerCount;
      } else {
        addOnsTotal += addon.perPerson ? addon.price * travelerCount : addon.price;
      }
    }
  });

  const creditValue = selectedTour.category === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
  const discountCreditsTotal = appliedDiscountCredits * creditValue;
  const subtotalBeforeVoucher = Math.max(
    0,
    subtotalBase + privateSurchargeTotal + addOnsTotal + insuranceTotal - memberDiscountTotal - discountCreditsTotal,
  );

  let voucherDiscountAmount = 0;
  let voucherPackSelected = '';
  if (appliedVoucher) {
    if (appliedVoucher.code.startsWith('PACK-')) {
      voucherPackSelected = appliedVoucher.code.replace('PACK-', '');
    }
    if (appliedVoucher.type === 'fixed') {
      voucherDiscountAmount = appliedVoucher.value;
    } else if (appliedVoucher.type === 'percentage') {
      voucherDiscountAmount = Math.round((subtotalBeforeVoucher * appliedVoucher.value) / 100);
    }
  }

  voucherDiscountAmount = Math.min(voucherDiscountAmount, subtotalBeforeVoucher);

  const subtotalAfterVoucher = subtotalBeforeVoucher - voucherDiscountAmount;
  const normalizedServiceFeeRate = Number.isFinite(serviceFeeRate)
    ? Math.max(0, serviceFeeRate)
    : 0;
  const serviceFeeOrTax = Math.round(subtotalAfterVoucher * normalizedServiceFeeRate);
  const totalPayable = subtotalAfterVoucher + serviceFeeOrTax;

  return {
    basePricePerPerson,
    travelerCount,
    subtotalBase,
    isPrivateTour,
    privateSurchargeTotal,
    isInsuranceSelected,
    insuranceTotal,
    memberDiscountPercent,
    memberDiscountTotal,
    appliedDiscountCredits,
    discountCreditsTotal,
    subtotalBeforeVoucher,
    appliedVoucher,
    voucherDiscountAmount,
    addOnsSelected,
    addOnsTotal,
    voucherPackSelected,
    serviceFeeOrTax,
    totalPayable,
  };
}
