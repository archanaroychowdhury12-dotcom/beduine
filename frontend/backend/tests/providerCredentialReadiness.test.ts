import { describe, expect, it } from 'vitest';
import { assertPaymentProviderReady, checkPaymentProviderCredentials } from '../business_logic/payment/providerCredentialReadiness';

describe('payment provider credential readiness', () => {
  it('keeps providers disabled until all required client credentials are present', () => {
    const missing = checkPaymentProviderCredentials('razorpay', { RAZORPAY_KEY_ID: 'key' });
    expect(missing.configured).toBe(false);
    expect(missing.missing).toContain('RAZORPAY_KEY_SECRET');
    expect(missing.missing).toContain('RAZORPAY_WEBHOOK_SECRET');
    expect(() => assertPaymentProviderReady('razorpay', { RAZORPAY_KEY_ID: 'key' })).toThrow(/not connected yet/i);
  });

  it('marks provider ready when required credentials exist', () => {
    const status = checkPaymentProviderCredentials('stripe', {
      STRIPE_SECRET_KEY: 'sk_test',
      STRIPE_WEBHOOK_SECRET: 'whsec_test',
    });
    expect(status.configured).toBe(true);
    expect(status.readyForWebhookVerification).toBe(true);
  });
});
