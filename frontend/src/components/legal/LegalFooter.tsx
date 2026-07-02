
import { ArrowLeft, BookOpen } from 'lucide-react';

interface LegalFooterProps {
  relatedPolicies: Array<{ label: string; slug: string }>;
  onNavigate: (slug: string) => void;
}

export function LegalFooter({ relatedPolicies, onNavigate }: LegalFooterProps) {
  return (
    <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
      <button
        onClick={() => onNavigate('legal')}
        className="inline-flex items-center gap-2 text-xs font-bold font-mono text-cyan hover:text-cyan-bright transition-all cursor-pointer border-none bg-transparent focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Legal Policy Center</span>
      </button>

      {relatedPolicies && relatedPolicies.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 justify-end">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Related:</span>
          </span>
          {relatedPolicies.map(p => (
            <button
              key={p.slug}
              onClick={() => onNavigate(p.slug)}
              className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-cyan hover:text-cyan-bright transition-all cursor-pointer focus:outline-none"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
