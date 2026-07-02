import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Sparkles, Trophy } from 'lucide-react';
import {
  beduineBackend,
  type PublicWinnerSummary,
} from '@/services/backend';

interface PublicWinnersPageProps {
  loadWinners?: () => Promise<PublicWinnerSummary[]>;
}

function loadPublishedWinners() {
  return beduineBackend.listPublicWinners();
}

function formatRound(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function PublicWinnersPage({
  loadWinners = loadPublishedWinners,
}: PublicWinnersPageProps) {
  const [winners, setWinners] = useState<PublicWinnerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setWinners(await loadWinners());
    } catch {
      setError('Published results could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [loadWinners]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="min-h-screen bg-[#07131c] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase text-cyan">
            <Sparkles className="h-4 w-4" />
            Weekly Results
          </p>
          <h1 className="text-4xl font-black tracking-normal text-white sm:text-5xl">
            Beduine Public Winners
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
            Published Sunday draw results.
          </p>
        </header>

        {isLoading ? (
          <div
            aria-busy="true"
            aria-live="polite"
            className="flex min-h-72 items-center justify-center border-y border-white/10"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cyan" />
            <span className="ml-4 font-semibold">Loading published winner results...</span>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 border-y border-red-300/20 text-center">
            <p className="font-semibold text-red-100">{error}</p>
            <button
              type="button"
              onClick={() => void load()}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-bold text-[#07131c]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : winners.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 border-y border-white/10 text-center">
            <Trophy className="h-10 w-10 text-amber-300" />
            <h2 className="text-2xl font-bold">No published winners yet</h2>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {winners.map((winner) => (
              <article
                key={`${winner.ticketId}-${winner.coupon}`}
                className="rounded-lg border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase text-cyan">
                      {formatRound(winner.roundKey)}
                    </p>
                    <h2 className="mt-2 text-xl font-black">{winner.name}</h2>
                    <p className="mt-1 font-mono text-sm text-white/70">{winner.uid}</p>
                  </div>
                  <Trophy className="h-7 w-7 shrink-0 text-amber-300" />
                </div>
                <dl className="mt-5 grid gap-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/55">Ticket</dt>
                    <dd className="font-mono">{winner.ticketId}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/55">Coupon</dt>
                    <dd className="font-mono text-amber-200">{winner.coupon}</dd>
                  </div>
                </dl>
                {winner.benefitSummary && (
                  <p className="mt-4 text-sm text-white/75">{winner.benefitSummary}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
