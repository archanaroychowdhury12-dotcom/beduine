import { useEffect, useMemo, useState } from 'react';
import type { AppUser, TripCategory } from '@/types';
import { getAvailableCredits, validateCreditApplication, getCategoryErrorMessage, CREDIT_VALUE_DOMESTIC, CREDIT_VALUE_INTERNATIONAL } from '@/utils/creditHelpers';
import { beduineBackend } from '@/services/backend';
import { countAvailableBookingCredits } from '@/features/booking/services/bookingCreditAvailability';

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

type UseBookingCreditsParams = {
  currentUser?: AppUser | any;
  tourCategory: TripCategory;
  travelerCount: number;
};

export function useBookingCredits({ currentUser, tourCategory, travelerCount }: UseBookingCreditsParams) {
  const productionMode = import.meta.env.VITE_BACKEND_MODE === 'production';
  const [appliedDiscountCredits, setAppliedDiscountCredits] = useState<number>(0);
  const [creditSelection, setCreditSelection] = useState<'domestic' | 'international' | null>(() => tourCategory);
  const [creditError, setCreditError] = useState<string | null>(null);
  const [creditSuccess, setCreditSuccess] = useState<string | null>(null);
  const [persistentBalances, setPersistentBalances] = useState({ domestic: 0, international: 0 });

  useEffect(() => {
    let active = true;
    if (!productionMode || !currentUser) {
      setPersistentBalances({ domestic: 0, international: 0 });
      return () => { active = false; };
    }

    void beduineBackend.getCustomerDashboard()
      .then((dashboard) => {
        if (active) {
          setPersistentBalances(
            countAvailableBookingCredits(dashboard.discountCredits.availableUnits),
          );
        }
      })
      .catch(() => {
        if (active) setPersistentBalances({ domestic: 0, international: 0 });
      });

    return () => { active = false; };
  }, [currentUser, productionMode]);

  const availableDomesticCredits = useMemo(() => {
    if (productionMode) return persistentBalances.domestic;
    return currentUser ? getAvailableCredits(currentUser.ledger || [], 'domestic') : 0;
  }, [currentUser, persistentBalances.domestic, productionMode]);

  const availableInternationalCredits = useMemo(() => {
    if (productionMode) return persistentBalances.international;
    return currentUser ? getAvailableCredits(currentUser.ledger || [], 'international') : 0;
  }, [currentUser, persistentBalances.international, productionMode]);

  useEffect(() => {
    setAppliedDiscountCredits(0);
    setCreditError(null);
    setCreditSuccess(null);
    setCreditSelection(tourCategory);
  }, [tourCategory]);

  useEffect(() => {
    if (appliedDiscountCredits > travelerCount) {
      setAppliedDiscountCredits(travelerCount);
      setCreditSuccess(null);
      setCreditError(null);
    }
  }, [travelerCount, appliedDiscountCredits]);

  const handleSelectCreditCategory = (category: 'domestic' | 'international') => {
    setCreditSelection(category);
    setCreditError(null);
    setCreditSuccess(null);
    setAppliedDiscountCredits(0);

    const categoryError = getCategoryErrorMessage(category, tourCategory);
    if (categoryError) {
      setCreditError(categoryError);
    }
  };

  const handleUpdateAppliedCredits = (value: number) => {
    if (value < 0) return;
    setCreditError(null);
    setCreditSuccess(null);

    const validation = validateCreditApplication({
      requestedCredits: value,
      tourCategory,
      availableDomesticCredits,
      availableInternationalCredits,
      travelerCount,
    });

    if (!validation.valid) {
      setCreditError(validation.error || 'Invalid credit application');
      setAppliedDiscountCredits(0);
      return;
    }

    setAppliedDiscountCredits(value);
    if (value > 0) {
      const creditValue = tourCategory === 'international' ? CREDIT_VALUE_INTERNATIONAL : CREDIT_VALUE_DOMESTIC;
      setCreditSuccess(`Successfully applied ${value} Discount Credit(s). Saved ${formatINR(value * creditValue)}!`);
    }
  };

  return {
    availableDomesticCredits,
    availableInternationalCredits,
    appliedDiscountCredits,
    setAppliedDiscountCredits,
    creditSelection,
    setCreditSelection,
    creditError,
    setCreditError,
    creditSuccess,
    setCreditSuccess,
    handleSelectCreditCategory,
    handleUpdateAppliedCredits,
  };
}
