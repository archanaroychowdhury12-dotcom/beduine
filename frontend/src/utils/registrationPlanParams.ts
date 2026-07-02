const SUPPORTED_REGISTRATION_PLANS = new Set([
  'Silver',
  'Gold',
  'Platinum',
  'Silver_Int',
  'Gold_Int',
  'Platinum_Int',
]);

export function getRegistrationPlanFromSearch(search: string): string | null {
  const plan = new URLSearchParams(search).get('plan');

  if (!plan || !SUPPORTED_REGISTRATION_PLANS.has(plan)) {
    return null;
  }

  return plan;
}
