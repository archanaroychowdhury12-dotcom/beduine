import React, { useEffect, useState } from 'react';

interface SidebarSection {
  num: number;
  title: string;
}

interface LegalSidebarProps {
  sections: SidebarSection[];
}

export function LegalSidebar({ sections }: LegalSidebarProps) {
  const [activeSection, setActiveSection] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const sec of sections) {
        const el = document.getElementById(`section-${sec.num}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec.num);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleScrollToSection = (e: React.MouseEvent, num: number) => {
    e.preventDefault();
    const el = document.getElementById(`section-${num}`);
    if (el) {
      const top = el.offsetTop - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0 no-print">
      <div className="sticky top-28 max-h-[75vh] overflow-y-auto pr-2">
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-white mb-4">
          Table of Contents
        </h4>
        <nav className="space-y-1 font-mono text-[11px] border-l border-white/10">
          {sections.map(sec => {
            const isActive = activeSection === sec.num;
            return (
              <a
                key={sec.num}
                href={`#section-${sec.num}`}
                onClick={(e) => handleScrollToSection(e, sec.num)}
                className={`group flex items-start gap-2 py-2 pl-4 -ml-px border-l transition-all select-none no-underline ${
                  isActive
                    ? 'border-cyan text-cyan font-bold'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="shrink-0 text-cyan opacity-60 group-hover:opacity-100">
                  {sec.num}.
                </span>
                <span className="leading-tight">{sec.title}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
