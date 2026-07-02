export type DrawPaymentStatus = 'paid' | 'unpaid' | 'reversed' | 'refunded';
export type DrawVerificationStatus = 'verified' | 'failed';
export type DrawParticipantResult = 'winner' | 'non_winner' | 'not_eligible';
export type DrawPlanTier = 'silver' | 'gold' | 'platinum' | 'unknown';
export type DrawPlanCategory = 'domestic' | 'international' | 'unknown';
export type DrawRoundKey = `${DrawPlanCategory}_${DrawPlanTier}`;

export interface DrawParticipant {
  id: string;
  /** Public-facing Beduine UID/member ID shown during winner reveal. Falls back to id when absent. */
  uid?: string;
  name: string;
  email: string;
  phone: string;
  /** Plan label/id, e.g. Silver Plan, Gold Plan, Platinum Plan, International Silver. */
  plan: string;
  /** Optional explicit category. If absent, it is derived from plan text. */
  planCategory?: DrawPlanCategory;
  /** Optional explicit tier. If absent, it is derived from plan text. */
  planTier?: DrawPlanTier;
  /** Normalized plan-wise draw round: domestic_silver, domestic_gold, international_silver, etc. */
  planRoundKey?: DrawRoundKey;
  subscription_status: 'active' | 'expired';
  payment_status: DrawPaymentStatus;
  weekly_entry_status: 'valid' | 'invalid';
  account_status: 'active' | 'suspended';
  is_duplicate: boolean;
  ticketId: string;
  status: DrawVerificationStatus;
  verification_reason: string;
  draw_result?: DrawParticipantResult;
  winnerRank?: number;
  /** Winner rank inside that plan/category round. */
  roundWinnerRank?: number;
  coupon?: string;
}

export interface DrawVerificationResult {
  status: DrawVerificationStatus;
  reason: string;
}

export interface DrawRoundSummary {
  roundKey: DrawRoundKey;
  category: DrawPlanCategory;
  tier: DrawPlanTier;
  verifiedParticipants: number;
  winnerCount: number;
  winnerIds: string[];
}

export interface WeeklyDrawExecutionResult {
  cycleId: string;
  drawDate: string;
  totalParticipants: number;
  verifiedParticipants: number;
  /** Total winner count across all separate plan/category rounds. */
  winnerCount: number;
  /** Winner breakdown for domestic and international Silver/Gold/Platinum rounds. */
  rounds: DrawRoundSummary[];
  winners: DrawParticipant[];
  nonWinners: DrawParticipant[];
  rejectedParticipants: DrawParticipant[];
  verificationLog: string[];
  rngSeed: string;
}

export const WINNER_SELECTION_RATE = 0.05;

export function calculateWinnerCount(validParticipantCount: number): number {
  if (validParticipantCount <= 0) return 0;
  return Math.ceil(validParticipantCount * WINNER_SELECTION_RATE);
}

export function normalizeDrawPlanTier(plan: string | undefined, explicitTier?: string): DrawPlanTier {
  const source = `${explicitTier || ''} ${plan || ''}`.toLowerCase();
  if (source.includes('silver')) return 'silver';
  if (source.includes('gold')) return 'gold';
  if (source.includes('platinum') || source.includes('premium') || source.includes('vip')) return 'platinum';
  return 'unknown';
}

export function normalizeDrawPlanCategory(plan: string | undefined, explicitCategory?: string): DrawPlanCategory {
  const source = `${explicitCategory || ''} ${plan || ''}`.toLowerCase();
  if (source.includes('international') || source.includes('intl') || source.includes('global') || source.includes('world')) return 'international';
  if (source.includes('domestic')) return 'domestic';
  // Existing plain Silver/Gold/Platinum names are domestic by default.
  if (source.includes('silver') || source.includes('gold') || source.includes('platinum') || source.includes('premium') || source.includes('vip')) return 'domestic';
  return 'unknown';
}

export function getDrawRoundKey(participant: Pick<DrawParticipant, 'plan' | 'planCategory' | 'planTier'>): DrawRoundKey {
  const category = normalizeDrawPlanCategory(participant.plan, participant.planCategory);
  const tier = normalizeDrawPlanTier(participant.plan, participant.planTier);
  return `${category}_${tier}` as DrawRoundKey;
}

export function normalizeDrawRound(value: string): DrawRoundKey {
  const category = normalizeDrawPlanCategory(value);
  const tier = normalizeDrawPlanTier(value);
  return `${category}_${tier}` as DrawRoundKey;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1_000_000) / 1_000_000;
  };
}

export function generateRandomToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 10; i += 1) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generateTicketId(cycleId: string, participantId: string, index: number): string {
  const safeCycle = cycleId.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(-8) || 'CYCLE';
  const safeUser = participantId.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(-6) || String(index + 1).padStart(6, '0');
  return `TRC-${safeCycle}-${safeUser}-${String(index + 1).padStart(4, '0')}`;
}

// Automatic eligibility verification helper.
export const getParticipantVerification = (p: Pick<DrawParticipant, 'subscription_status' | 'payment_status' | 'weekly_entry_status' | 'account_status' | 'is_duplicate'>): DrawVerificationResult => {
  if (p.subscription_status !== 'active') {
    return { status: 'failed', reason: 'Subscription expired' };
  }
  if (p.payment_status !== 'paid') {
    if (p.payment_status === 'unpaid') return { status: 'failed', reason: 'Payment incomplete' };
    if (p.payment_status === 'reversed' || p.payment_status === 'refunded') return { status: 'failed', reason: `Payment ${p.payment_status}` };
    return { status: 'failed', reason: 'Payment incomplete' };
  }
  if (p.weekly_entry_status !== 'valid') {
    return { status: 'failed', reason: 'Invalid weekly participation' };
  }
  if (p.account_status !== 'active') {
    return { status: 'failed', reason: 'Account suspended' };
  }
  if (p.is_duplicate) {
    return { status: 'failed', reason: 'Duplicate entry' };
  }
  return { status: 'verified', reason: '' };
};

export function freezeAndVerifyParticipants(participants: DrawParticipant[], cycleId: string): DrawParticipant[] {
  return participants.map((participant, index) => {
    const verification = getParticipantVerification(participant);
    const roundKey = getDrawRoundKey(participant);
    const [category, tier] = roundKey.split('_') as [DrawPlanCategory, DrawPlanTier];
    return {
      ...participant,
      planCategory: participant.planCategory || category,
      planTier: participant.planTier || tier,
      planRoundKey: roundKey,
      ticketId: participant.ticketId || generateTicketId(cycleId, participant.id, index),
      status: verification.status,
      verification_reason: verification.reason,
      draw_result: verification.status === 'verified' ? undefined : 'not_eligible',
    };
  });
}

export function selectWinners(
  verifiedParticipants: DrawParticipant[],
  winnerCount = calculateWinnerCount(verifiedParticipants.length),
  rngSeed = `${new Date().toISOString()}-${generateRandomToken()}`,
  rankOffset = 0,
): DrawParticipant[] {
  const random = createSeededRandom(rngSeed);
  const shuffled = [...verifiedParticipants];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, winnerCount).map((winner, index) => ({
    ...winner,
    draw_result: 'winner',
    winnerRank: rankOffset + index + 1,
    roundWinnerRank: index + 1,
    coupon: winner.coupon || `BEDWIN-${new Date().getFullYear()}-${generateRandomToken()}`,
  }));
}

export function calculatePlanRoundWinnerCounts(verifiedParticipants: DrawParticipant[]): DrawRoundSummary[] {
  const groups = new Map<DrawRoundKey, DrawParticipant[]>();
  for (const participant of verifiedParticipants) {
    const roundKey = participant.planRoundKey || getDrawRoundKey(participant);
    if (!groups.has(roundKey)) groups.set(roundKey, []);
    groups.get(roundKey)!.push(participant);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([roundKey, members]) => {
      const [category, tier] = roundKey.split('_') as [DrawPlanCategory, DrawPlanTier];
      return {
        roundKey,
        category,
        tier,
        verifiedParticipants: members.length,
        winnerCount: calculateWinnerCount(members.length),
        winnerIds: [],
      };
    });
}

export function executeWeeklyDraw({
  participants,
  cycleId,
  drawDate = new Date().toISOString(),
  rngSeed = `${cycleId}-${drawDate}`,
}: {
  participants: DrawParticipant[];
  cycleId: string;
  drawDate?: string;
  rngSeed?: string;
}): WeeklyDrawExecutionResult {
  const frozen = freezeAndVerifyParticipants(participants, cycleId);
  const verifiedParticipants = frozen.filter((participant) => participant.status === 'verified');
  const rejectedParticipants = frozen.filter((participant) => participant.status === 'failed').map((participant) => ({
    ...participant,
    draw_result: 'not_eligible' as const,
  }));

  const groups = new Map<DrawRoundKey, DrawParticipant[]>();
  for (const participant of verifiedParticipants) {
    const roundKey = participant.planRoundKey || getDrawRoundKey(participant);
    if (!groups.has(roundKey)) groups.set(roundKey, []);
    groups.get(roundKey)!.push(participant);
  }

  const winners: DrawParticipant[] = [];
  const rounds: DrawRoundSummary[] = [];
  let rankOffset = 0;

  for (const [roundKey, members] of Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    const [category, tier] = roundKey.split('_') as [DrawPlanCategory, DrawPlanTier];
    const count = calculateWinnerCount(members.length);
    const roundWinners = selectWinners(members, count, `${rngSeed}:${roundKey}`, rankOffset);
    rankOffset += roundWinners.length;
    winners.push(...roundWinners);
    rounds.push({
      roundKey,
      category,
      tier,
      verifiedParticipants: members.length,
      winnerCount: count,
      winnerIds: roundWinners.map((winner) => winner.id),
    });
  }

  const winnerIds = new Set(winners.map((winner) => winner.id));
  const nonWinners = verifiedParticipants
    .filter((participant) => !winnerIds.has(participant.id))
    .map((participant) => ({ ...participant, draw_result: 'non_winner' as const }));

  const winnerCount = winners.length;
  const verificationLog = [
    `Cycle ${cycleId} frozen at ${drawDate}`,
    `Total entries received: ${participants.length}`,
    `Verified entries: ${verifiedParticipants.length}`,
    `Rejected entries: ${rejectedParticipants.length}`,
    `Winner count calculated separately per plan/category round: ${winnerCount}`,
    ...rounds.map((round) => `${round.roundKey}: ${round.verifiedParticipants} verified -> ${round.winnerCount} winner(s)`),
    `RNG seed/reference: ${rngSeed}`,
  ];

  return {
    cycleId,
    drawDate,
    totalParticipants: participants.length,
    verifiedParticipants: verifiedParticipants.length,
    winnerCount,
    rounds,
    winners,
    nonWinners,
    rejectedParticipants,
    verificationLog,
    rngSeed,
  };
}

// Helper to generate 1,000 mock participants for weekly member selection.
export const generateMockParticipants = (): DrawParticipant[] => {
  const plans = ['Silver Plan', 'Gold Plan', 'Platinum Plan', 'International Silver Plan', 'International Gold Plan', 'International Platinum Plan'];
  const list: DrawParticipant[] = [];

  const specific: DrawParticipant[] = [
    { id: '1', name: 'Amit Sen', email: 'amit.sen@example.com', phone: '+91 9830012345', plan: 'Silver Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'verified', verification_reason: '' },
    { id: '2', name: 'Sonia Das', email: 'sonia.das@example.com', phone: '+91 9830067890', plan: 'Gold Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'verified', verification_reason: '' },
    { id: '3', name: 'Rahul Sen', email: 'rahul.sen@example.com', phone: '+91 9876543210', plan: 'International Silver Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'verified', verification_reason: '' },
    { id: '4', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 9903344556', plan: 'Platinum Plan', subscription_status: 'active', payment_status: 'unpaid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'failed', verification_reason: 'Payment incomplete' },
    { id: '5', name: 'Riya Dutta', email: 'riya.d@example.com', phone: '+91 9831122334', plan: 'International Gold Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'verified', verification_reason: '' },
    { id: '6', name: 'Subhash Bose', email: 'subhash@example.com', phone: '+91 9433011223', plan: 'Silver Plan', subscription_status: 'expired', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'failed', verification_reason: 'Subscription expired' },
    { id: '7', name: 'Pooja Banerjee', email: 'pooja.b@example.com', phone: '+91 9830099887', plan: 'International Platinum Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'verified', verification_reason: '' },
    { id: '8', name: 'Kunal Ghosh', email: 'kunal.g@example.com', phone: '+91 9051122334', plan: 'Silver Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'active', is_duplicate: true, ticketId: '', status: 'failed', verification_reason: 'Duplicate entry' },
    { id: '9', name: 'Ananya Roy', email: 'ananya@example.com', phone: '+91 9830022334', plan: 'Gold Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'invalid', account_status: 'active', is_duplicate: false, ticketId: '', status: 'failed', verification_reason: 'Invalid weekly participation' },
    { id: '10', name: 'Debasish Sen', email: 'debasish@example.com', phone: '+91 9830055443', plan: 'Platinum Plan', subscription_status: 'active', payment_status: 'paid', weekly_entry_status: 'valid', account_status: 'suspended', is_duplicate: false, ticketId: '', status: 'failed', verification_reason: 'Account suspended' },
  ];

  list.push(...specific);

  const firstNames = ['Amit', 'Sonia', 'Rahul', 'Vikram', 'Riya', 'Subhash', 'Pooja', 'Kunal', 'Ananya', 'Debasish', 'Sajal', 'Rita', 'Jayanta', 'Mousumi', 'Arnab', 'Tania', 'Pradip', 'Indranil', 'Sujata', 'Koushik', 'Sharmistha', 'Niladri', 'Paramita', 'Snehasis', 'Supriya'];
  const lastNames = ['Sen', 'Das', 'Singh', 'Dutta', 'Bose', 'Banerjee', 'Ghosh', 'Roy', 'Choudhury', 'Bhattacharya', 'Mukherjee', 'Chatterjee', 'Ganguly', 'Mitra', 'Sarkar', 'Pramanik', 'Adhikary', 'Chakraborty', 'Maitra', 'Halder', 'Pal', 'Naskar', 'Mondal', 'Mallick'];

  for (let i = 11; i <= 1000; i += 1) {
    const fName = firstNames[(i * 7) % firstNames.length];
    const lName = lastNames[(i * 13) % lastNames.length];
    const name = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;
    const phone = `+91 98${(i * 17) % 10}${(i * 29) % 10}${String(100000 + (i * 101) % 900000)}`;
    const plan = plans[i % plans.length];

    let subscription_status: DrawParticipant['subscription_status'] = 'active';
    let payment_status: DrawParticipant['payment_status'] = 'paid';
    let weekly_entry_status: DrawParticipant['weekly_entry_status'] = 'valid';
    let account_status: DrawParticipant['account_status'] = 'active';
    let is_duplicate = false;

    if (i === 101) subscription_status = 'expired';
    else if (i === 202) payment_status = 'unpaid';
    else if (i === 303) weekly_entry_status = 'invalid';
    else if (i === 404) account_status = 'suspended';
    else if (i === 505) is_duplicate = true;
    else if (i === 606) payment_status = 'reversed';
    else if (i === 707) payment_status = 'refunded';

    const verification = getParticipantVerification({ subscription_status, payment_status, weekly_entry_status, account_status, is_duplicate });
    list.push({
      id: String(i),
      name,
      email,
      phone,
      plan,
      subscription_status,
      payment_status,
      weekly_entry_status,
      account_status,
      is_duplicate,
      ticketId: '',
      status: verification.status,
      verification_reason: verification.reason,
    });
  }

  return list;
};
