import type { AdvancePaymentPlan, BookingPaymentType, PaymentInstallment, TripCategory } from '../types';

const DAY_MS = 24 * 60 * 60 * 1000;

const roundMoney = (value: number) => Math.round(value);

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const subtractDays = (isoDate: string, days: number): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  date.setTime(date.getTime() - days * DAY_MS);
  return formatDate(date);
};

const buildInstallments = (
  total: number,
  rows: Array<Omit<PaymentInstallment, 'amount' | 'status'> & { status?: PaymentInstallment['status'] }>,
): PaymentInstallment[] => {
  const installments = rows.map((row) => ({
    ...row,
    amount: roundMoney((total * row.percentage) / 100),
    status: row.status || 'upcoming',
  }));

  const calculatedExceptLast = installments.slice(0, -1).reduce((sum, row) => sum + row.amount, 0);
  const last = installments[installments.length - 1];
  if (last) last.amount = Math.max(0, total - calculatedExceptLast);

  return installments;
};

export type CalculateAdvancePaymentPlanInput = {
  baseTourTotal: number;
  selectedDate?: string;
  tourCategory: TripCategory;
  bookingType: BookingPaymentType;
  instantBookingRequired?: boolean;
};

export function getInstantBookingCharge(tourCategory: TripCategory, instantBookingRequired?: boolean): number {
  if (!instantBookingRequired) return 0;
  return tourCategory === 'international' ? 5000 : 2000;
}

export function calculateAdvancePaymentPlan({
  baseTourTotal,
  selectedDate,
  tourCategory,
  bookingType,
  instantBookingRequired = false,
}: CalculateAdvancePaymentPlanInput): AdvancePaymentPlan {
  const instantBookingCharge = getInstantBookingCharge(tourCategory, instantBookingRequired);
  const scheduledTourTotal = Math.max(0, roundMoney(baseTourTotal));
  const grandTotal = Math.max(0, roundMoney(scheduledTourTotal + instantBookingCharge));

  const installments = bookingType === 'customized_tailor_made'
    ? buildInstallments(scheduledTourTotal, [
        {
          id: 'custom-advance-50',
          label: 'Booking Confirmation Advance',
          percentage: 50,
          dueLabel: 'Pay now to confirm customized tour',
          status: 'pay_now',
          note: 'Minimum 50% advance is required to confirm a tailor-made itinerary.',
        },
        {
          id: 'custom-7-days-25',
          label: 'Second Payment',
          percentage: 25,
          dueLabel: selectedDate ? `Due 7 days before departure (${subtractDays(selectedDate, 7)})` : 'Due 7 days before departure',
        },
        {
          id: 'custom-before-departure-25',
          label: 'Final Balance',
          percentage: 25,
          dueLabel: selectedDate ? `Due before departure (${formatDate(new Date(selectedDate))})` : 'Due before departure',
        },
      ])
    : buildInstallments(scheduledTourTotal, [
        {
          id: 'fixed-advance-25',
          label: 'Booking Confirmation Advance',
          percentage: 25,
          dueLabel: 'Pay now to confirm seat',
          status: 'pay_now',
          note: '25% advance confirms the fixed departure group tour booking.',
        },
        {
          id: 'fixed-30-days-25',
          label: 'Second Payment',
          percentage: 25,
          dueLabel: selectedDate ? `Due 30 days before departure (${subtractDays(selectedDate, 30)})` : 'Due 30 days before departure',
        },
        {
          id: 'fixed-15-days-30',
          label: 'Third Payment',
          percentage: 30,
          dueLabel: selectedDate ? `Due 15 days before departure (${subtractDays(selectedDate, 15)})` : 'Due 15 days before departure',
        },
        {
          id: 'fixed-7-days-20',
          label: 'Final Balance',
          percentage: 20,
          dueLabel: selectedDate ? `Due 7 days before departure (${subtractDays(selectedDate, 7)})` : 'Due 7 days before departure',
        },
      ]);

  if (instantBookingCharge > 0) {
    installments.unshift({
      id: 'instant-booking-charge',
      label: 'Instant Booking Service Charge',
      percentage: 0,
      amount: instantBookingCharge,
      dueLabel: 'Pay now for urgent confirmation handling',
      status: 'pay_now',
      note: 'Instant booking charges are collected in full at booking confirmation.',
    });
  }

  const advanceDueNow = installments.filter((row) => row.status === 'pay_now').reduce((sum, row) => sum + row.amount, 0);
  const balanceDueLater = Math.max(0, grandTotal - advanceDueNow);
  const bookingTypeLabel = bookingType === 'customized_tailor_made' ? 'Customized / Tailor-Made Tour' : 'Fixed Departure Group Tour';

  return {
    bookingType,
    bookingTypeLabel,
    baseTourTotal: roundMoney(baseTourTotal),
    instantBookingCharge,
    grandTotal,
    advanceDueNow,
    balanceDueLater,
    installments,
    paymentSummary:
      bookingType === 'customized_tailor_made'
        ? '50% now, 25% seven days before departure, 25% before departure.'
        : '25% now, 25% thirty days before, 30% fifteen days before, 20% seven days before departure.',
  };
}
