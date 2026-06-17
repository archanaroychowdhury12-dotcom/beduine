

interface LegalSectionProps {
  num: number;
  title: string;
  content: string;
}

export function LegalSection({ num, title, content }: LegalSectionProps) {
  return (
    <section id={`section-${num}`} className="py-6 border-b border-slate-100 last:border-0 scroll-mt-24">
      <h2 className="font-display font-bold text-sm sm:text-base text-[#10233F] mb-3 flex items-start gap-2.5">
        <span className="text-cyan-deep font-mono shrink-0 select-none">{num}.</span>
        <span className="leading-tight">{title}</span>
      </h2>
      <div className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans whitespace-pre-line pl-6">
        {content}
      </div>
    </section>
  );
}
