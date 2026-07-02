import { describe, it, expect } from 'vitest';
import {
  getAvailableCredits,
  validateCreditApplication,
  getCategoryErrorMessage,
  CREDIT_VALUE_DOMESTIC,
  CREDIT_VALUE_INTERNATIONAL,
} from '../../src/utils/creditHelpers';
import { CreditLedgerEntry } from '../../src/types';

describe('Beduine Credit Helpers', () => {
  describe('getAvailableCredits', () => {
    it('should sum credits correctly for domestic category', () => {
      const ledger: CreditLedgerEntry[] = [
        {
          id: '1',
          date: '2026-06-25',
          type: 'issued',
          creditType: 'discount',
          amount: 2,
          reason: 'Subscription',
          creditCategory: 'domestic',
          creditValue: CREDIT_VALUE_DOMESTIC,
          usableFor: 'domestic_only',
        },
        {
          id: '2',
          date: '2026-06-25',
          type: 'redeemed',
          creditType: 'discount',
          amount: 1,
          reason: 'Tour Booking',
          creditCategory: 'domestic',
          creditValue: CREDIT_VALUE_DOMESTIC,
          usableFor: 'domestic_only',
        },
        {
          id: '3',
          date: '2026-06-25',
          type: 'issued',
          creditType: 'discount',
          amount: 1,
          reason: 'Subscription',
          creditCategory: 'international',
          creditValue: CREDIT_VALUE_INTERNATIONAL,
          usableFor: 'international_only',
        },
      ];

      expect(getAvailableCredits(ledger, 'domestic')).toBe(1);
      expect(getAvailableCredits(ledger, 'international')).toBe(1);
    });

    it('should handle all ledger transaction types correctly', () => {
      const ledger: CreditLedgerEntry[] = [
        { id: '1', date: '2026-06-25', type: 'issued', creditType: 'discount', amount: 5, reason: 'Issue', creditCategory: 'domestic', creditValue: 500, usableFor: 'domestic_only' },
        { id: '2', date: '2026-06-25', type: 'admin_adjustment', creditType: 'discount', amount: 2, reason: 'Adjustment', creditCategory: 'domestic', creditValue: 500, usableFor: 'domestic_only' },
        { id: '3', date: '2026-06-25', type: 'reversed', creditType: 'discount', amount: 1, reason: 'Reversal', creditCategory: 'domestic', creditValue: 500, usableFor: 'domestic_only' },
        { id: '4', date: '2026-06-25', type: 'redeemed', creditType: 'discount', amount: 2, reason: 'Redeemed', creditCategory: 'domestic', creditValue: 500, usableFor: 'domestic_only' },
        { id: '5', date: '2026-06-25', type: 'expired', creditType: 'discount', amount: 1, reason: 'Expired', creditCategory: 'domestic', creditValue: 500, usableFor: 'domestic_only' },
        { id: '6', date: '2026-06-25', type: 'reserved', creditType: 'discount', amount: 1, reason: 'Reserved', creditCategory: 'domestic', creditValue: 500, usableFor: 'domestic_only' },
      ];

      // Total added: 5 + 2 + 1 = 8
      // Total subtracted: 2 + 1 + 1 = 4
      // Net: 4
      expect(getAvailableCredits(ledger, 'domestic')).toBe(4);
    });
  });

  describe('validateCreditApplication', () => {
    it('should validate successfully for correct inputs', () => {
      const result = validateCreditApplication({
        requestedCredits: 2,
        tourCategory: 'domestic',
        availableDomesticCredits: 4,
        availableInternationalCredits: 0,
        travelerCount: 2,
      });
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail if requested credits exceed available domestic credits', () => {
      const result = validateCreditApplication({
        requestedCredits: 3,
        tourCategory: 'domestic',
        availableDomesticCredits: 2,
        availableInternationalCredits: 0,
        travelerCount: 5,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('You do not have enough Domestic Discount Credits.');
    });

    it('should fail if requested credits exceed available international credits', () => {
      const result = validateCreditApplication({
        requestedCredits: 2,
        tourCategory: 'international',
        availableDomesticCredits: 0,
        availableInternationalCredits: 1,
        travelerCount: 5,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('You do not have enough International Discount Credits.');
    });

    it('should fail if requested credits exceed traveler count', () => {
      const result = validateCreditApplication({
        requestedCredits: 3,
        tourCategory: 'domestic',
        availableDomesticCredits: 5,
        availableInternationalCredits: 0,
        travelerCount: 2,
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only one Discount Credit can be applied per traveler.');
    });

    it('should return valid if requested credits is 0', () => {
      const result = validateCreditApplication({
        requestedCredits: 0,
        tourCategory: 'domestic',
        availableDomesticCredits: 0,
        availableInternationalCredits: 0,
        travelerCount: 1,
      });
      expect(result.valid).toBe(true);
    });
  });

  describe('getCategoryErrorMessage', () => {
    it('should return the correct error message for international credit on domestic tour', () => {
      const error = getCategoryErrorMessage('international', 'domestic');
      expect(error).toBe('International Discount Credits can only be used for International bookings.');
    });

    it('should return the correct error message for domestic credit on international tour', () => {
      const error = getCategoryErrorMessage('domestic', 'international');
      expect(error).toBe('Domestic Discount Credits can only be used for Domestic bookings.');
    });

    it('should return undefined for matching categories', () => {
      expect(getCategoryErrorMessage('domestic', 'domestic')).toBeUndefined();
      expect(getCategoryErrorMessage('international', 'international')).toBeUndefined();
    });
  });
});
