import { describe, it, expect } from 'vitest';
import {
  PLANS,
  INTL_PLANS,
  ALL_PLANS,
  getPlanPrice,
  getPlanCredits,
  getPlanCreditValue,
  getPlanCategory,
  getPlanUsableFor,
} from '../../src/data/siteData';

describe('siteData plan metadata', () => {
  it('domestic Silver has 1 discount credit worth 500', () => {
    expect(PLANS[0].discountCredits).toBe(1);
    expect(PLANS[0].discountValue).toBe(500);
  });

  it('domestic Gold has 2 discount credits worth 1000', () => {
    expect(PLANS[1].discountCredits).toBe(2);
    expect(PLANS[1].discountValue).toBe(1000);
  });

  it('domestic Platinum has 4 discount credits worth 2000', () => {
    expect(PLANS[2].discountCredits).toBe(4);
    expect(PLANS[2].discountValue).toBe(2000);
  });

  it('international Silver has 1 discount credit worth 5000', () => {
    expect(INTL_PLANS[0].discountCredits).toBe(1);
    expect(INTL_PLANS[0].discountValue).toBe(5000);
  });

  it('international Gold has 2 discount credits worth 10000', () => {
    expect(INTL_PLANS[1].discountCredits).toBe(2);
    expect(INTL_PLANS[1].discountValue).toBe(10000);
  });

  it('international Platinum has 4 discount credits worth 20000', () => {
    expect(INTL_PLANS[2].discountCredits).toBe(4);
    expect(INTL_PLANS[2].discountValue).toBe(20000);
  });

  it('ALL_PLANS provides correct domestic lookup', () => {
    expect(getPlanPrice('Silver')).toBe(499);
    expect(getPlanCredits('Silver')).toBe(1);
    expect(getPlanCreditValue('Silver')).toBe(500);
    expect(getPlanCategory('Silver')).toBe('domestic');
    expect(getPlanUsableFor('Silver')).toBe('domestic_only');
  });

  it('ALL_PLANS provides correct international lookup', () => {
    expect(getPlanPrice('Platinum_Int')).toBe(14999);
    expect(getPlanCredits('Platinum_Int')).toBe(4);
    expect(getPlanCreditValue('Platinum_Int')).toBe(5000);
    expect(getPlanCategory('Platinum_Int')).toBe('international');
    expect(getPlanUsableFor('Platinum_Int')).toBe('international_only');
  });

  it('ALL_PLANS contains 6 entries', () => {
    expect(Object.keys(ALL_PLANS)).toHaveLength(6);
  });
});
