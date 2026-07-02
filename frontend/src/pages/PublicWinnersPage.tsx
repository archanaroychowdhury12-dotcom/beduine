import { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';

const WINNERS_LOADING_DELAY_MS = 600;

export default function PublicWinnersPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), WINNERS_LOADING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#030C15] px-4 pb-16 pt-28 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[-8rem] top-12 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute bottom-0 right-[-6rem] h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan">
            <Sparkles className="h-3.5 w-3.5" />
            Weekly Results
          </p>
          <h1 className="text-4xl font-black tracking-normal text-white sm:text-5xl">
            Beduine Public Winners
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Verified winner publications will appear here once the public results feed is connected.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          {isLoading ? (
            <div
              aria-busy="true"
              aria-live="polite"
              className="flex min-h-[18rem] flex-col items-center justify-center gap-4 text-center"
            >
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-cyan" />
              <div>
                <p className="text-lg font-semibold text-white">Loading published winner results...</p>
                <p className="mt-2 text-sm text-white/60">
                  This placeholder route is ready for the public results feed.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[18rem] flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">No published winners yet</h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-white/65">
                  Public winner announcements have not been connected for this production route yet. Check back after the results publication workflow is enabled.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
