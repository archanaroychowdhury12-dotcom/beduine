
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
    <div className="border-b border-slate-200/80 pb-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#10233F] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[#728091] font-mono leading-relaxed italic">
            "{summary}"
          </p>
        </div>
        <div className="shrink-0">
          <PrintPolicyButton />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-[11px] font-mono text-[#728091]">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-deep" />
          <span>Effective: {effectiveDate}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-deep" />
          <span>Last Updated: {lastUpdated}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-deep" />
          <span>Version: {version}</span>
        </span>
      </div>
    </div>
  );
}
