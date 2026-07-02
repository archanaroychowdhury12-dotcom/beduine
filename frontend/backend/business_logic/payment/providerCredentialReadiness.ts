export type PaymentProvider = 'razorpay' | 'cashfree' | 'phonepe' | 'stripe';

export interface ProviderCredentialStatus {
  provider: PaymentProvider;
  configured: boolean;
  missing: string[];
  readyForWebhookVerification: boolean;
  note: string;
}

const REQUIRED_ENV_BY_PROVIDER: Record<PaymentProvider, string[]> = {
  razorpay: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'],
  cashfree: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY', 'CASHFREE_WEBHOOK_SECRET'],
  phonepe: ['PHONEPE_MERCHANT_ID', 'PHONEPE_SALT_KEY', 'PHONEPE_SALT_INDEX'],
  stripe: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
};

export function checkPaymentProviderCredentials(
  provider: PaymentProvider,
  env: Record<string, string | undefined> = {},
): ProviderCredentialStatus {
  const required = REQUIRED_ENV_BY_PROVIDER[provider];
  const missing = required.filter((key) => !env[key]);
  return {
    provider,
    configured: missing.length === 0,
    missing,
    readyForWebhookVerification: missing.length === 0,
    note:
      missing.length === 0
        ? `${provider} credentials are present. Provider-specific API/webhook code can be connected without changing business logic.`
        : `${provider} credentials are not connected yet. Keep demo/simulated mode until the client provides: ${missing.join(', ')}.`,
  };
}

export function assertPaymentProviderReady(provider: PaymentProvider, env: Record<string, string | undefined> = {}): void {
  const status = checkPaymentProviderCredentials(provider, env);
  if (!status.configured) {
    throw new Error(status.note);
  }
}
