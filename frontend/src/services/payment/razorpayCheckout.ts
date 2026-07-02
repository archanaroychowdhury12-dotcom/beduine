import type { PaymentOrderResponse } from '@/services/backend';

export interface CheckoutCustomer {
  name: string;
  email: string;
  contact: string;
}

interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: 'INR';
  name: string;
  description: string;
  prefill: CheckoutCustomer;
  handler: () => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
}

interface RazorpayCheckoutInstance {
  open(): void;
}

type RazorpayConstructor = new (
  options: RazorpayCheckoutOptions,
) => RazorpayCheckoutInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-beduine-razorpay-checkout]',
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('PAYMENT_CHECKOUT_LOAD_FAILED')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.beduineRazorpayCheckout = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PAYMENT_CHECKOUT_LOAD_FAILED'));
    document.head.appendChild(script);
  }).then(() => {
    if (!window.Razorpay) throw new Error('PAYMENT_CHECKOUT_UNAVAILABLE');
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(
  order: PaymentOrderResponse,
  customer: CheckoutCustomer,
): Promise<{ sessionId: string }> {
  await loadRazorpayScript();
  const Razorpay = window.Razorpay;
  if (!Razorpay) throw new Error('PAYMENT_CHECKOUT_UNAVAILABLE');

  return new Promise((resolve, reject) => {
    let settled = false;
    const checkout = new Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amountPaise,
      currency: order.currency,
      name: 'Beduine Tour and Travels',
      description: order.description,
      prefill: customer,
      handler: () => {
        if (settled) return;
        settled = true;
        resolve({ sessionId: order.sessionId });
      },
      modal: {
        ondismiss: () => {
          if (settled) return;
          settled = true;
          reject(new Error('PAYMENT_CANCELLED'));
        },
      },
      theme: {
        color: '#0f766e',
      },
    });
    checkout.open();
  });
}
