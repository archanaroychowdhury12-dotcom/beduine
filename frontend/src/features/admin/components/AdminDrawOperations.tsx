import { useCallback, useEffect, useState } from 'react';
import { Award, BadgePercent, RefreshCw, TicketCheck } from 'lucide-react';
import {
  beduineBackend,
  type BeduineBackendAdapter,
  type CreditIssuanceResponse,
  type RevealedWinnerResponse,
  type WeeklyDrawStatusResponse,
} from '@/services/backend';

interface AdminDrawOperationsProps {
  mode: 'status' | 'winner' | 'nonwinner';
  backend?: BeduineBackendAdapter;
}

function formatFreezeAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export function AdminDrawOperations({
  mode,
  backend = beduineBackend,
}: AdminDrawOperationsProps) {
  const [status, setStatus] = useState<WeeklyDrawStatusResponse>();
  const [winner, setWinner] = useState<RevealedWinnerResponse>();
  const [issuance, setIssuance] = useState<CreditIssuanceResponse>();
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string>();

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setStatus(await backend.getWeeklyDrawStatus());
    } catch {
      setError('Draw status could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [backend]);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const revealNext = async () => {
    if (!status) return;
    setWorking(true);
    setError(undefined);
    try {
      const response = await backend.revealNextWinner(status.cycleId);
      setWinner(response);
      await loadStatus();
    } catch {
      setError('The next winner could not be revealed.');
    } finally {
      setWorking(false);
    }
  };

  const issueCredits = async () => {
    if (!status) return;
    setWorking(true);
    setError(undefined);
    try {
      const response = await backend.issueNonWinnerCredits(status.cycleId);
      setIssuance(response);
      await loadStatus();
    } catch {
      setError('Non-winner credits could not be issued.');
    } finally {
      setWorking(false);
    }
  };

  if (loading && !status) {
    return <p className="py-10 text-center text-sm font-semibold text-slate-500">Loading draw status...</p>;
  }

  if (!status) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p role="alert" className="text-sm font-semibold text-red-800">{error}</p>
        <button type="button" onClick={() => void loadStatus()} className="mt-3 rounded-lg bg-red-700 px-3 py-2 text-xs font-black text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="font-mono text-xs font-bold text-slate-500">{status.cycleId}</p>
          <p className="mt-1 text-sm font-black text-slate-950">{status.status.replace(/_/g, ' ')}</p>
          <p className="mt-1 text-xs text-slate-500">Freeze: {formatFreezeAt(status.freezeAtIso)} IST</p>
        </div>
        <button type="button" onClick={() => void loadStatus()} className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100" aria-label="Refresh draw status">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {status.rounds.map((round) => (
          <article key={round.roundKey} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-black text-slate-950">{round.label}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div><dt className="text-[10px] font-bold uppercase text-slate-500">Entries</dt><dd className="mt-1 text-lg font-black">{round.participantCount}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slate-500">Winners</dt><dd className="mt-1 text-lg font-black">{round.winnerCount}</dd></div>
              <div><dt className="text-[10px] font-bold uppercase text-slate-500">Revealed</dt><dd className="mt-1 text-lg font-black">{round.revealedCount}</dd></div>
            </dl>
          </article>
        ))}
      </div>

      {mode === 'winner' ? (
        <div>
          <button
            type="button"
            disabled={working || !status.canRevealNextWinner}
            onClick={() => void revealNext()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-black text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Award className="h-4 w-4" />
            {working ? 'Revealing...' : 'Reveal Next Winner'}
          </button>
          {winner?.hasWinner ? (
            <section className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-5">
              <p className="text-xs font-black uppercase text-amber-700">{winner.planLabel || winner.roundKey}</p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">{winner.name}</h3>
              <p className="mt-1 font-mono text-sm font-bold text-slate-700">{winner.uid}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg bg-white px-3 py-2 font-bold">{winner.ticketId}</span>
                <span className="rounded-lg bg-white px-3 py-2 font-bold">{winner.coupon}</span>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {mode === 'nonwinner' ? (
        <div>
          <button
            type="button"
            disabled={working || !['winner_pool_ready', 'revealing', 'published'].includes(status.status)}
            onClick={() => void issueCredits()}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-black text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <BadgePercent className="h-4 w-4" />
            {working ? 'Issuing...' : 'Issue Non-winner Credits'}
          </button>
          {issuance ? (
            <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
              {issuance.issuedUsers} users / {issuance.issuedUnits} credit units issued
              {issuance.duplicate ? ' (already complete)' : ''}
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === 'status' ? (
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <TicketCheck className="h-4 w-4 text-indigo-700" />
          {status.rounds.reduce((sum, round) => sum + round.participantCount, 0)} verified entries
        </p>
      ) : null}

      {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p> : null}
    </div>
  );
}
