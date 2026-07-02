import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { LegalHeader } from './LegalHeader';
import { LegalSidebar } from './LegalSidebar';
import { LegalTableOfContents } from './LegalTableOfContents';
import { LegalFooter } from './LegalFooter';
import { PolicyVersion } from './PolicyVersion';
import { LegalPolicy } from '../../data/legalPolicies';

interface LegalPageLayoutProps {
  policy: LegalPolicy;
  onNavigate: (slug: string) => void;
  children?: React.ReactNode;
}

export function LegalPageLayout({ policy, onNavigate, children }: LegalPageLayoutProps) {
  useEffect(() => {
    // Scroll to top when policy page changes
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [policy]);

  const tocSections = policy.sections.map(s => ({ num: s.num, title: s.title }));

  return (
    <div className="relative min-h-screen bg-[#030C15] pt-24 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-white">
      {/* Background Graphic elements matching Beduine dashboard styles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-10 left-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-cyan/10 via-cyan/5 to-transparent blur-[80px]" />
        <div className="absolute bottom-10 right-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-rose-500/5 via-amber-500/5 to-transparent blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('legal')}
          className="no-print inline-flex items-center gap-2 mb-6 text-xs font-bold font-mono text-cyan hover:text-cyan-bright transition-all cursor-pointer border-none bg-transparent focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Legal Policy Center</span>
        </button>

        {/* Master Frosted Layout container */}
        <div className="rounded-[24px] border border-white/10 bg-slate-950/40 shadow-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle top/bottom design gradients */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none no-print" />
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Desktop Table of Contents Sidebar */}
            <LegalSidebar sections={tocSections} />

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <LegalHeader
                title={policy.title}
                summary={policy.summary}
                effectiveDate={policy.effectiveDate}
                lastUpdated={policy.lastUpdated}
                version={policy.version}
              />

              {/* Mobile TOC */}
              <LegalTableOfContents sections={tocSections} />

              {/* Policy Sections */}
              <div className="space-y-1">
                {children}
              </div>

              {/* Disclaimer notice */}
              <PolicyVersion version={policy.version} />

              {/* Page Footer Navigation */}
              <LegalFooter
                relatedPolicies={policy.relatedPolicies}
                onNavigate={onNavigate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
