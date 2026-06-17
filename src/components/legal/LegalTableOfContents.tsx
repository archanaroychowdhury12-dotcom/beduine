import { useState } from 'react';
import { ChevronDown, List } from 'lucide-react';

interface TOCSection {
  num: number;
  title: string;
}

interface LegalTableOfContentsProps {
  sections: TOCSection[];
}

export function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (num: number) => {
    setIsOpen(false);
    const el = document.getElementById(`section-${num}`);
    if (el) {
      const top = el.offsetTop - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:hidden mb-6 no-print">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-line bg-white/80 shadow-sm text-sm font-bold text-[#10233F] cursor-pointer focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4 text-cyan-deep" />
          <span>Quick Navigation</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-2 rounded-2xl border border-slate-line bg-white shadow-xl max-h-[50vh] overflow-y-auto p-2 space-y-1 z-30 animate-fadeIn">
          {sections.map(sec => (
            <button
              key={sec.num}
              onClick={() => handleSelect(sec.num)}
              className="w-full flex items-start gap-2.5 p-3 text-left text-xs font-mono text-ink hover:bg-slate-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
            >
              <span className="text-cyan-deep font-bold">{sec.num}.</span>
              <span className="leading-normal">{sec.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
