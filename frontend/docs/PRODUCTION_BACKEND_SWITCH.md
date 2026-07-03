# Beduine Production Backend Switch Guide

This codebase currently runs in **client-demo simulation mode** so a client can see the full journey without paying or connecting live infrastructure.

The important security change is that the demo now follows production boundaries:

- Admin access is based on explicit `role` metadata: `admin` or `customer`.
- Email text such as `admin@test.com` no longer grants admin access.
- Subscription activation happens only after a payment event is verified.
- In demo mode, the verification event is a simulated webhook.
- In production mode, the verification must come from the payment provider webhook on the backend.
- Admin actions and payment lifecycle events are written to an audit log.

## Demo mode

```env
VITE_BACKEND_MODE=demo
VITE_ENABLE_DEMO_WALLET=true
VITE_PAYMENT_PROVIDER=mock
```

In this mode:

1. Customer: `demo@beduine.com` / `beduine123`.
2. Admin: `admin@beduine.com` / `admin123`.
3. Login pages provide a demo-only one-click account fill button.
4. The customer starts with a Rs 5,000 demo wallet for presentation checkout.
5. Checkout creates a mock checkout session and simulated verified webhook.
6. Every verified plan purchase issues exactly one TRC.
7. Admin access still requires the seeded admin identity and admin role.
8. Registration creates customer accounts only; it cannot self-assign admin access.

## Production mode

```env
VITE_ENABLE_DEMO_WALLET=false
VITE_PAYMENT_PROVIDER=razorpay # or cashfree / phonepe / stripe
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Production requires a backend endpoint or Supabase Edge Function for:

1. Creating payment orders/sessions using provider secret keys.
2. Receiving provider webhook events.
3. Verifying webhook signatures server-side.
4. Writing `payment_events` records.
5. Activating subscription entitlements only after verified `payment.captured` / `payment.success` events.

Never verify payment success only from frontend redirect, frontend button state, or client-submitted transaction IDs.

## Tables to connect

Use the SQL template in:

```txt
supabase/migrations/001_access_payment_audit.sql
```

Recommended tables:

- `profiles`: user role, demo flag, and member data.
- `payment_sessions`: checkout session/order creation.
- `payment_events`: verified provider webhook events.
- `subscriptions`: active/inactive/failed/refunded/chargeback status.
- `credit_ledger`: issued/redeemed/reversed credit history.
- `audit_logs`: admin and system action traceability.

## Role rules

Frontend may hide/show UI, but production security must be enforced by backend and RLS.

Allowed roles:

```txt
admin
customer
agent
```

Admin access rule:

```ts
canAccessAdmin(user) === user.role === 'admin'
```

Do not grant roles from signup payload. Assign admin/agent roles only from a trusted backend/admin console.

## Payment lifecycle states

Supported lifecycle statuses are ready for production mapping:

```txt
created -> pending -> verified -> failed/refunded/chargeback
```

Current demo implementation supports:

- successful simulated webhook
- failed payment hook path
- refunded state path
- chargeback state path
- audit log for each critical action

## Where to plug real provider code

```txt
src/services/payment/paymentGateway.ts
src/services/payment/payment.types.ts
src/services/payment/subscriptionEntitlement.service.ts
supabase/functions/payment-webhook/index.ts
```

For production, frontend should call your backend to create a checkout session. The backend should call Razorpay/Cashfree/PhonePe/Stripe. The webhook function should verify provider signatures and then call entitlement activation.
