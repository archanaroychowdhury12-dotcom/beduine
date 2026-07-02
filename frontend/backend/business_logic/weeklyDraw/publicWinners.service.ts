export interface PublicWinnerSource {
  name: string;
  uid: string;
  ticketId: string;
  roundKey: string;
  coupon: string;
  benefitSummary?: string | null;
  resultDate: string;
  email?: string;
  phone?: string;
}

export interface PublicWinner {
  name: string;
  uid: string;
  ticketId: string;
  roundKey: string;
  coupon: string;
  benefitSummary?: string;
  resultDate: string;
}

export function toPublicWinner(source: PublicWinnerSource): PublicWinner {
  return {
    name: source.name,
    uid: source.uid,
    ticketId: source.ticketId,
    roundKey: source.roundKey,
    coupon: source.coupon,
    ...(source.benefitSummary
      ? { benefitSummary: source.benefitSummary }
      : {}),
    resultDate: source.resultDate,
  };
}
