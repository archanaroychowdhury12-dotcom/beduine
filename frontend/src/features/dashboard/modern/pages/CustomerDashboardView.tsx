import { useState, type ComponentType, type ReactNode } from 'react';
import {
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Gift,
  IdCard,
  ShieldCheck,
  TicketCheck,
  Trophy,
  User,
} from 'lucide-react';
import {
  beduineBackend,
  type CustomerDashboardResponse,
  type ParticipationResponse,
} from '@/services/backend';
import type { DashboardRoute } from '../routes';
import { StatusBadge } from '../components/StatusBadge';
import { SupportTickets } from './SupportTickets';

interface CustomerDashboardViewProps {
  route: DashboardRoute;
  model: CustomerDashboardResponse;
  onLogout?: () => void;
  onBookPaidTour?: () => void;
  onRefresh?: () => Promise<void>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-black text-slate-950">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <p className="text-sm font-bold text-slate-700">{title}</p>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null): string {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? '-'
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(parsed);
}

function labelRound(value: string | null): string {
  if (!value) return '-';
  return value
    .split('_')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-blue-700" />
      </div>
      <p className="mt-3 break-words text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function BookingRows({ model }: { model: CustomerDashboardResponse }) {
  return (
    <div className="divide-y divide-slate-100">
      {model.bookings.map((booking) => (
        <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <div>
            <p className="font-bold text-slate-950">{booking.title || `Booking ${booking.id}`}</p>
            <p className="mt-1 text-xs text-slate-500">{formatDate(booking.createdAt)}</p>
          </div>
          <StatusBadge status={booking.status || 'pending'} />
        </div>
      ))}
    </div>
  );
}

function Overview({
  model,
  onBookPaidTour,
}: Pick<CustomerDashboardViewProps, 'model' | 'onBookPaidTour'>) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg bg-blue-800 px-5 py-6 text-white shadow-sm">
        <p className="text-sm font-semibold text-blue-100">Welcome back</p>
        <h1 className="mt-1 text-2xl font-black">{model.profile.fullName}</h1>
        <p className="mt-2 font-mono text-sm text-blue-100">{model.profile.uid}</p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Plan" value={model.subscription?.planName || 'No active plan'} icon={ShieldCheck} />
        <Metric label="Available TRC" value={model.trc.available} icon={Gift} />
        <Metric label="Discount credits" value={model.discountCredits.availableUnits.length} icon={BadgePercent} />
        <Metric label="Bookings" value={model.bookings.length} icon={CalendarDays} />
      </div>
      <Panel title="Latest booking">
        {model.bookings.length === 0 ? (
          <>
            <EmptyState title="No bookings yet" />
            <button type="button" onClick={onBookPaidTour} className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-black text-white hover:bg-orange-700">
              Book a tour
            </button>
          </>
        ) : <BookingRows model={model} />}
      </Panel>
    </div>
  );
}

function DrawParticipation({
  model,
  onRefresh,
}: Pick<CustomerDashboardViewProps, 'model' | 'onRefresh'>) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ParticipationResponse>();
  const [error, setError] = useState<string>();
  const latestEntry = model.drawEntries[0];

  const participate = async () => {
    setSubmitting(true);
    setError(undefined);
    try {
      const response = await beduineBackend.participateInWeeklyDraw();
      setResult(response);
      await onRefresh?.();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      if (message.includes('ALREADY_PARTICIPATING')) setError('You are already participating in this draw.');
      else if (message.includes('NO_AVAILABLE_TRC')) setError('No available TRC.');
      else if (message.includes('SUBSCRIPTION_INACTIVE')) setError('An active subscription is required.');
      else setError('Participation could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Current balance">
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Available" value={model.trc.available} icon={Gift} />
          <Metric label="Locked" value={model.trc.locked} icon={TicketCheck} />
        </div>
        <button
          type="button"
          disabled={submitting || model.trc.available < 1 || !model.subscription}
          onClick={() => void participate()}
          className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-black text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? 'Submitting...' : 'Participate in Sunday draw'}
        </button>
        {error ? <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {result ? (
          <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            <p className="font-black">{result.ticketId}</p>
            <p className="mt-1">{labelRound(result.roundKey)}</p>
          </div>
        ) : null}
      </Panel>
      <Panel title="Latest entry">
        {latestEntry ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-500">Ticket</dt><dd className="mt-1 font-bold">{latestEntry.ticketId}</dd></div>
            <div><dt className="text-slate-500">Round</dt><dd className="mt-1 font-bold">{labelRound(latestEntry.planRoundKey)}</dd></div>
            <div><dt className="text-slate-500">Verification</dt><dd className="mt-1"><StatusBadge status={latestEntry.verificationStatus} /></dd></div>
            <div><dt className="text-slate-500">Result</dt><dd className="mt-1"><StatusBadge status={latestEntry.drawResult} /></dd></div>
          </dl>
        ) : <EmptyState title="No draw participation yet" />}
      </Panel>
    </div>
  );
}

export function CustomerDashboardView({
  route,
  model,
  onLogout,
  onBookPaidTour,
  onRefresh,
}: CustomerDashboardViewProps) {
  if (route === 'overview') return <Overview model={model} onBookPaidTour={onBookPaidTour} />;

  if (route === 'my-uid') {
    return (
      <Panel title="My UID">
        <div className="flex items-center gap-4 rounded-lg bg-slate-950 p-5 text-white">
          <IdCard className="h-8 w-8 text-orange-400" />
          <div><p className="text-xs font-bold text-slate-400">BEDUINE UID</p><p className="mt-1 break-all font-mono text-xl font-black">{model.profile.uid}</p></div>
        </div>
      </Panel>
    );
  }

  if (route === 'my-plan') {
    return (
      <Panel title="My Plan">
        {model.subscription ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm text-slate-500">Plan</dt><dd className="mt-1 font-black">{model.subscription.planName}</dd></div>
            <div><dt className="text-sm text-slate-500">Category</dt><dd className="mt-1 font-black capitalize">{model.subscription.planType}</dd></div>
            <div><dt className="text-sm text-slate-500">Status</dt><dd className="mt-1"><StatusBadge status={model.subscription.status} /></dd></div>
            <div><dt className="text-sm text-slate-500">Expires</dt><dd className="mt-1 font-black">{formatDate(model.subscription.expiresAt)}</dd></div>
          </dl>
        ) : <EmptyState title="No active subscription" />}
      </Panel>
    );
  }

  if (route === 'trc-credits') {
    return (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label="Available TRC" value={model.trc.available} icon={Gift} />
          <Metric label="Locked TRC" value={model.trc.locked} icon={TicketCheck} />
        </div>
        <Panel title="TRC history">
          {model.trc.history.length === 0 ? <EmptyState title="No TRC history" /> : (
            <div className="divide-y divide-slate-100">{model.trc.history.map((entry) => (
              <div key={entry.id} className="flex justify-between gap-3 py-3 text-sm">
                <div><p className="font-bold">{entry.reason}</p><p className="text-slate-500">{formatDate(entry.date)}</p></div>
                <span className="font-black">{entry.amount}</span>
              </div>
            ))}</div>
          )}
        </Panel>
      </div>
    );
  }

  if (route === 'lucky-draw') return <DrawParticipation model={model} onRefresh={onRefresh} />;

  if (route === 'winner-status') {
    return (
      <Panel title="Winner Status">
        {model.winnerBenefits.length === 0 ? <EmptyState title="No winner benefit issued" /> : (
          <div className="grid gap-3 lg:grid-cols-2">{model.winnerBenefits.map((benefit) => (
            <article key={benefit.id} className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between gap-3"><Trophy className="h-5 w-5 text-green-700" /><StatusBadge status={benefit.status} /></div>
              <p className="mt-3 font-mono font-black text-green-950">{benefit.coupon}</p>
              <p className="mt-2 text-sm text-green-800">{benefit.destination || 'Destination pending'}</p>
              {benefit.value != null ? <p className="mt-1 font-black text-green-950">{formatCurrency(benefit.value)}</p> : null}
            </article>
          ))}</div>
        )}
      </Panel>
    );
  }

  if (route === 'discount-credits') {
    const total = model.discountCredits.availableUnits.reduce((sum, unit) => sum + unit.creditValue, 0);
    return (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label="Available units" value={model.discountCredits.availableUnits.length} icon={BadgePercent} />
          <Metric label="Available value" value={formatCurrency(total)} icon={CircleDollarSign} />
        </div>
        <Panel title="Credit units">
          {model.discountCredits.availableUnits.length === 0 ? <EmptyState title="No discount credits available" /> : (
            <div className="divide-y divide-slate-100">{model.discountCredits.availableUnits.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between gap-3 py-3">
                <div><p className="font-bold capitalize">{unit.creditCategory}</p><p className="text-xs text-slate-500">{unit.id}</p></div>
                <p className="font-black">{formatCurrency(unit.creditValue)}</p>
              </div>
            ))}</div>
          )}
        </Panel>
      </div>
    );
  }

  if (route === 'my-bookings') {
    return (
      <Panel title="My Bookings">
        {model.bookings.length === 0 ? <EmptyState title="No bookings yet" /> : <BookingRows model={model} />}
        <button type="button" onClick={onBookPaidTour} className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-black text-white hover:bg-orange-700">Book a tour</button>
      </Panel>
    );
  }

  if (route === 'payments') {
    return (
      <Panel title="My Payments">
        {model.payments.length === 0 ? <EmptyState title="No payments yet" /> : (
          <div className="divide-y divide-slate-100">{model.payments.map((payment) => (
            <div key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div><p className="font-black">{formatCurrency(payment.amount)}</p><p className="text-xs text-slate-500">{formatDate(payment.createdAt)} / {payment.provider}</p></div>
              <div className="flex items-center gap-2">{payment.verified ? <CheckCircle2 className="h-4 w-4 text-green-600" aria-label="Verified" /> : null}<StatusBadge status={payment.status} /></div>
            </div>
          ))}</div>
        )}
      </Panel>
    );
  }

  if (route === 'profile') {
    return (
      <Panel title="Profile">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div><dt className="text-sm text-slate-500">Name</dt><dd className="mt-1 font-bold">{model.profile.fullName}</dd></div>
          <div><dt className="text-sm text-slate-500">Email</dt><dd className="mt-1 break-all font-bold">{model.profile.email || '-'}</dd></div>
          <div><dt className="text-sm text-slate-500">Mobile</dt><dd className="mt-1 font-bold">{model.profile.phone || '-'}</dd></div>
          <div><dt className="text-sm text-slate-500">City</dt><dd className="mt-1 font-bold">{model.profile.city || '-'}</dd></div>
        </dl>
      </Panel>
    );
  }

  if (route === 'support') {
    return <SupportTickets tickets={model.supportTickets} />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Account">
        <div className="flex items-center gap-3"><User className="h-5 w-5 text-blue-700" /><div><p className="font-black">{model.profile.fullName}</p><p className="text-sm text-slate-500">{model.profile.uid}</p></div></div>
      </Panel>
      <Panel title="Session">
        <button type="button" onClick={onLogout} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-50">Logout</button>
      </Panel>
    </div>
  );
}
