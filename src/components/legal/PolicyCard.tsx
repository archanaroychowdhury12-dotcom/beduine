
import { ArrowRight } from 'lucide-react';

interface PolicyCardProps {
  title: string;
  summary: string;
  lastUpdated: string;
  icon: any;
  slug: string;
  onClick: (slug: string) => void;
}

export function PolicyCard({ title, summary, lastUpdated, icon: Icon, slug, onClick }: PolicyCardProps) {
  return (
    <div className="glass rounded-[24px] border border-slate-line/80 p-6 flex flex-col justify-between hover:neon-border-cyan transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan/5 to-transparent rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
      
      <div>
        <div className="w-11 h-11 rounded-2xl bg-cyan-deep/10 text-cyan-deep flex items-center justify-center mb-5 group-hover:bg-cyan-deep group-hover:text-white transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        
        <h3 className="font-display font-bold text-base text-[#10233F] group-hover:text-cyan-deep transition-colors duration-300 mb-2 leading-snug">
          {title}
        </h3>
        
        <p className="text-xs text-[#728091] leading-relaxed mb-6 font-sans">
          {summary}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 font-mono text-[10px]">
        <span className="text-[#728091] opacity-75">Updated: {lastUpdated}</span>
        <button
          onClick={() => onClick(slug)}
          className="inline-flex items-center gap-1.5 font-bold text-cyan-deep hover:text-cyan transition-all cursor-pointer border-none bg-transparent focus:outline-none"
        >
          <span>Read Policy</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
