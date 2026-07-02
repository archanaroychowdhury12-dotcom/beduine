import { describe, expect, it } from 'vitest';
import { calculateRoundWinnerCount, getPlanRoundKey, selectPlanWiseWinners, summarizePlanRounds } from '../../src/features/dashboard/services/planWiseDraw.service';

const p = (id: string, plan: string) => ({ id, name: `User ${id}`, plan });

describe('frontend plan-wise weekly draw', () => {
  it('calculates 5% rounded up per individual round', () => {
    expect(calculateRoundWinnerCount(0)).toBe(0);
    expect(calculateRoundWinnerCount(1)).toBe(1);
    expect(calculateRoundWinnerCount(20)).toBe(1);
    expect(calculateRoundWinnerCount(21)).toBe(2);
    expect(calculateRoundWinnerCount(1047)).toBe(53);
  });

  it('maps domestic and international plans to separate round keys', () => {
    expect(getPlanRoundKey('Domestic Silver Plan')).toBe('domestic_silver');
    expect(getPlanRoundKey('Domestic Gold Plan')).toBe('domestic_gold');
    expect(getPlanRoundKey('Domestic Platinum Plan')).toBe('domestic_platinum');
    expect(getPlanRoundKey('International Silver Plan')).toBe('international_silver');
    expect(getPlanRoundKey('International Gold Plan')).toBe('international_gold');
    expect(getPlanRoundKey('International Platinum Plan')).toBe('international_platinum');
  });

  it('summarizes and selects winners per plan/category pool', () => {
    const participants = [
      ...Array.from({ length: 21 }, (_, i) => p(`ds-${i}`, 'Domestic Silver Plan')),
      ...Array.from({ length: 20 }, (_, i) => p(`dg-${i}`, 'Domestic Gold Plan')),
      p('dp-1', 'Domestic Platinum Plan'),
      ...Array.from({ length: 21 }, (_, i) => p(`is-${i}`, 'International Silver Plan')),
      ...Array.from({ length: 20 }, (_, i) => p(`ig-${i}`, 'International Gold Plan')),
      p('ip-1', 'International Platinum Plan'),
    ];
    const rounds = summarizePlanRounds(participants);
    expect(rounds.map((r) => [r.roundKey, r.selectedK])).toEqual([
      ['domestic_silver', 2],
      ['domestic_gold', 1],
      ['domestic_platinum', 1],
      ['international_silver', 2],
      ['international_gold', 1],
      ['international_platinum', 1],
    ]);
    expect(selectPlanWiseWinners(participants, () => 0.4)).toHaveLength(8);
  });
});
