export type DrawTier = 'silver' | 'gold' | 'platinum';
export type DrawCategory = 'domestic' | 'international';
export type DrawRoundKey = `${DrawCategory}_${DrawTier}`;

export interface DrawParticipant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  plan?: string;
  ticketId?: string;
  status?: string;
  [key: string]: unknown;
}

export interface PlanRoundSummary {
  roundKey: DrawRoundKey;
  label: string;
  category: DrawCategory;
  tier: DrawTier;
  totalN: number;
  selectedK: number;
}

const ROUND_ORDER: DrawRoundKey[] = [
  'domestic_silver',
  'domestic_gold',
  'domestic_platinum',
  'international_silver',
  'international_gold',
  'international_platinum',
];

export function calculateRoundWinnerCount(participantCount: number): number {
  return participantCount <= 0 ? 0 : Math.ceil(participantCount * 0.05);
}

export function getPlanRoundKey(plan?: string): DrawRoundKey {
  const label = String(plan || '').toLowerCase();
  const category: DrawCategory = label.includes('international') || label.includes('_int') || label.includes('intl') ? 'international' : 'domestic';
  let tier: DrawTier = 'silver';
  if (label.includes('platinum')) tier = 'platinum';
  else if (label.includes('gold')) tier = 'gold';
  return `${category}_${tier}`;
}

export function getRoundLabel(roundKey: DrawRoundKey): string {
  return roundKey
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function summarizePlanRounds(participants: DrawParticipant[]): PlanRoundSummary[] {
  const grouped = new Map<DrawRoundKey, DrawParticipant[]>();
  participants.forEach((participant) => {
    const roundKey = getPlanRoundKey(participant.plan);
    grouped.set(roundKey, [...(grouped.get(roundKey) || []), participant]);
  });

  return ROUND_ORDER
    .map((roundKey) => {
      const roundParticipants = grouped.get(roundKey) || [];
      const [category, tier] = roundKey.split('_') as [DrawCategory, DrawTier];
      return {
        roundKey,
        label: getRoundLabel(roundKey),
        category,
        tier,
        totalN: roundParticipants.length,
        selectedK: calculateRoundWinnerCount(roundParticipants.length),
      };
    })
    .filter((round) => round.totalN > 0);
}

export function selectPlanWiseWinners<T extends DrawParticipant>(participants: T[], random = Math.random): T[] {
  const winners: T[] = [];
  for (const round of ROUND_ORDER) {
    const roundParticipants = participants.filter((participant) => getPlanRoundKey(participant.plan) === round);
    const selectedK = calculateRoundWinnerCount(roundParticipants.length);
    if (selectedK <= 0) continue;
    const shuffled = [...roundParticipants].sort(() => random() - 0.5);
    winners.push(...shuffled.slice(0, selectedK).map((winner, index) => ({
      ...winner,
      planRoundKey: round,
      roundWinnerRank: index + 1,
    })));
  }
  return winners;
}
