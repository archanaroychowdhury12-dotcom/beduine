import { describe, expect, it } from 'vitest';
import {
  calculateWinnerCount,
  executeWeeklyDraw,
  getDrawRoundKey,
  normalizeDrawRound,
  type DrawParticipant,
} from '../business_logic/weeklyDraw/weeklyDraw.service';

function participant(id: number, overrides: Partial<DrawParticipant> = {}): DrawParticipant {
  return {
    id: String(id),
    name: `User ${id}`,
    email: `u${id}@example.com`,
    phone: String(id),
    plan: 'Silver Plan',
    subscription_status: 'active',
    payment_status: 'paid',
    weekly_entry_status: 'valid',
    account_status: 'active',
    is_duplicate: false,
    ticketId: '',
    status: 'verified',
    verification_reason: '',
    ...overrides,
  };
}

describe('weekly lucky draw logic', () => {
  it('uses canonical underscore round keys', () => {
    expect(normalizeDrawRound('Domestic Gold')).toBe('domestic_gold');
    expect(normalizeDrawRound('International Platinum')).toBe(
      'international_platinum',
    );
  });

  it('calculates 5% winners rounded up', () => {
    expect(calculateWinnerCount(0)).toBe(0);
    expect(calculateWinnerCount(1)).toBe(1);
    expect(calculateWinnerCount(20)).toBe(1);
    expect(calculateWinnerCount(21)).toBe(2);
    expect(calculateWinnerCount(1047)).toBe(53);
    expect(calculateWinnerCount(1051)).toBe(53);
  });

  it('selects only verified participants and marks others as rejected', () => {
    const result = executeWeeklyDraw({
      cycleId: 'SUN-001',
      rngSeed: 'fixed-seed',
      participants: [
        participant(1),
        participant(2),
        participant(3, { payment_status: 'unpaid' }),
        participant(4, { is_duplicate: true }),
      ],
    });

    expect(result.totalParticipants).toBe(4);
    expect(result.verifiedParticipants).toBe(2);
    expect(result.winnerCount).toBe(1);
    expect(result.winners).toHaveLength(1);
    expect(result.nonWinners).toHaveLength(1);
    expect(result.rejectedParticipants).toHaveLength(2);
  });

  it('runs separate 5% rounds for domestic and international Silver/Gold/Platinum pools', () => {
    const participants = [
      ...Array.from({ length: 21 }, (_, i) => participant(100 + i, { plan: 'Silver Plan' })),
      ...Array.from({ length: 20 }, (_, i) => participant(200 + i, { plan: 'Gold Plan' })),
      ...Array.from({ length: 1 }, (_, i) => participant(300 + i, { plan: 'Platinum Plan' })),
      ...Array.from({ length: 21 }, (_, i) => participant(400 + i, { plan: 'International Silver Plan' })),
      ...Array.from({ length: 20 }, (_, i) => participant(500 + i, { plan: 'International Gold Plan' })),
      ...Array.from({ length: 1 }, (_, i) => participant(600 + i, { plan: 'International Platinum Plan' })),
    ];

    const result = executeWeeklyDraw({ cycleId: 'SUN-PLAN-001', rngSeed: 'plan-round-seed', participants });

    expect(result.winnerCount).toBe(8);
    expect(result.rounds).toEqual(expect.arrayContaining([
      expect.objectContaining({ roundKey: 'domestic_silver', verifiedParticipants: 21, winnerCount: 2 }),
      expect.objectContaining({ roundKey: 'domestic_gold', verifiedParticipants: 20, winnerCount: 1 }),
      expect.objectContaining({ roundKey: 'domestic_platinum', verifiedParticipants: 1, winnerCount: 1 }),
      expect.objectContaining({ roundKey: 'international_silver', verifiedParticipants: 21, winnerCount: 2 }),
      expect.objectContaining({ roundKey: 'international_gold', verifiedParticipants: 20, winnerCount: 1 }),
      expect.objectContaining({ roundKey: 'international_platinum', verifiedParticipants: 1, winnerCount: 1 }),
    ]));
    expect(new Set(result.winners.map((winner) => winner.planRoundKey)).size).toBe(6);
  });

  it('runs domestic Silver, Gold, and Platinum as separate 5% rounds even without international participants', () => {
    const participants = [
      ...Array.from({ length: 21 }, (_, i) => participant(700 + i, { plan: 'Silver Plan', planCategory: 'domestic' })),
      ...Array.from({ length: 20 }, (_, i) => participant(800 + i, { plan: 'Gold Plan', planCategory: 'domestic' })),
      ...Array.from({ length: 1 }, (_, i) => participant(900 + i, { plan: 'Platinum Plan', planCategory: 'domestic' })),
    ];

    const result = executeWeeklyDraw({ cycleId: 'SUN-DOMESTIC-001', rngSeed: 'domestic-round-seed', participants });

    expect(result.winnerCount).toBe(4);
    expect(result.rounds).toEqual(expect.arrayContaining([
      expect.objectContaining({ roundKey: 'domestic_silver', verifiedParticipants: 21, winnerCount: 2 }),
      expect.objectContaining({ roundKey: 'domestic_gold', verifiedParticipants: 20, winnerCount: 1 }),
      expect.objectContaining({ roundKey: 'domestic_platinum', verifiedParticipants: 1, winnerCount: 1 }),
    ]));
    expect(result.rounds.every((round) => round.category === 'domestic')).toBe(true);
    expect(new Set(result.winners.map((winner) => winner.planRoundKey))).toEqual(
      new Set(['domestic_silver', 'domestic_gold', 'domestic_platinum']),
    );
  });

  it('normalizes international plan rounds', () => {
    expect(getDrawRoundKey(participant(1, { plan: 'International Gold Plan' }))).toBe('international_gold');
    expect(getDrawRoundKey(participant(2, { plan: 'Intl Platinum' }))).toBe('international_platinum');
    expect(getDrawRoundKey(participant(3, { plan: 'Silver Plan' }))).toBe('domestic_silver');
  });
});
