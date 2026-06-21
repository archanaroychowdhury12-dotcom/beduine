
import { Calendar, Layers } from 'lucide-react';
import { PrintPolicyButton } from './PrintPolicyButton';

interface LegalHeaderProps {
  title: string;
  summary: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
}

export function LegalHeader({ title, summary, effectiveDate, lastUpdated, version }: LegalHeaderProps) {
  return (
    <div className="border-b border-white/10 pb-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-mono leading-relaxed italic">
            "{summary}"
          </p>
        </div>
        <div className="shrink-0">
          <PrintPolicyButton />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan" />
          <span>Effective: {effectiveDate}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan" />
          <span>Last Updated: {lastUpdated}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan" />
          <span>Version: {version}</span>
        </span>
      </div>
    </div>
  );
}
