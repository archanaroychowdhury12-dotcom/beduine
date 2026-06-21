
import { Search, X } from 'lucide-react';

interface PolicySearchProps {
  query: string;
  onChange: (q: string) => void;
}

export function PolicySearch({ query, onChange }: PolicySearchProps) {
  return (
    <div className="relative w-full max-w-md no-print">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-sans focus:outline-none focus:border-cyan text-white placeholder-slate-400 shadow-inner"
        placeholder="Search policies (e.g. refund, rules, cookies)..."
      />
      {query && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white cursor-pointer border-none bg-transparent"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
