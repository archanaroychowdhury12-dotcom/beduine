
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
    <div className="bg-white/5 backdrop-blur-xl rounded-[24px] border border-white/10 p-6 flex flex-col justify-between hover:neon-border-cyan transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.02]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan/5 to-transparent rounded-full pointer-events-none group-hover:scale-110 transition-transform" />
      
      <div>
        <div className="w-11 h-11 rounded-2xl bg-cyan/10 text-cyan flex items-center justify-center mb-5 group-hover:bg-cyan group-hover:text-slate-950 transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        
        <h3 className="font-display font-bold text-base text-white group-hover:text-cyan transition-colors duration-300 mb-2 leading-snug">
          {title}
        </h3>
        
        <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
          {summary}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 font-mono text-[10px]">
        <span className="text-slate-400 opacity-75">Updated: {lastUpdated}</span>
        <button
          onClick={() => onClick(slug)}
          className="inline-flex items-center gap-1.5 font-bold text-cyan hover:text-cyan-bright transition-all cursor-pointer border-none bg-transparent focus:outline-none"
        >
          <span>Read Policy</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
