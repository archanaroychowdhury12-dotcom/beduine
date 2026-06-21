

interface LegalSectionProps {
  num: number;
  title: string;
  content: string;
}

export function LegalSection({ num, title, content }: LegalSectionProps) {
  return (
    <section id={`section-${num}`} className="py-6 border-b border-white/5 last:border-0 scroll-mt-24">
      <h2 className="font-display font-bold text-sm sm:text-base text-white mb-3 flex items-start gap-2.5">
        <span className="text-cyan font-mono shrink-0 select-none">{num}.</span>
        <span className="leading-tight">{title}</span>
      </h2>
      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line pl-6">
        {content}
      </div>
    </section>
  );
}
