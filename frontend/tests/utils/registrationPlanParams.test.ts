import { describe, expect, it } from 'vitest';
import { getRegistrationPlanFromSearch } from '../../src/utils/registrationPlanParams';

describe('getRegistrationPlanFromSearch', () => {
  it('accepts supported domestic plan names from the plan query parameter', () => {
    expect(getRegistrationPlanFromSearch('?plan=Silver')).toBe('Silver');
    expect(getRegistrationPlanFromSearch('?plan=Gold')).toBe('Gold');
    expect(getRegistrationPlanFromSearch('?plan=Platinum')).toBe('Platinum');
  });

  it('accepts supported international plan ids from the plan query parameter', () => {
    expect(getRegistrationPlanFromSearch('?plan=Silver_Int')).toBe('Silver_Int');
    expect(getRegistrationPlanFromSearch('?plan=Gold_Int')).toBe('Gold_Int');
    expect(getRegistrationPlanFromSearch('?plan=Platinum_Int')).toBe('Platinum_Int');
  });

  it('returns null for missing or unsupported plan query values', () => {
    expect(getRegistrationPlanFromSearch('')).toBeNull();
    expect(getRegistrationPlanFromSearch('?plan=Diamond')).toBeNull();
  });
});
