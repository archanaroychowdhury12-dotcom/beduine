import { useState } from 'react';
import { ShieldCheck, Compass, ArrowLeft } from 'lucide-react';
import { LEGAL_POLICIES } from '../../data/legalPolicies';
import { PolicyCard } from '../../components/legal/PolicyCard';
import { PolicySearch } from '../../components/legal/PolicySearch';

interface LegalCenterPageProps {
  onNavigate: (slug: string) => void;
}

export default function LegalCenterPage({ onNavigate }: LegalCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPolicies = LEGAL_POLICIES.filter(policy => {
    const q = searchQuery.toLowerCase();
    return (
      policy.title.toLowerCase().includes(q) ||
      policy.summary.toLowerCase().includes(q) ||
      policy.sections.some(s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative min-h-screen bg-[#F5FAFD] pt-24 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Visual background matching dashboard design */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none no-print">
        <div className="absolute top-10 left-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-cyan/10 via-cyan/5 to-transparent blur-[80px]" />
        <div className="absolute bottom-10 right-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-rose-500/5 via-amber-500/5 to-transparent blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('landing')}
          className="no-print inline-flex items-center gap-2 mb-6 text-xs font-bold font-mono text-cyan-deep hover:text-cyan transition-all cursor-pointer border-none bg-transparent focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan/25 bg-cyan-deep/5 text-cyan-deep text-[11px] font-bold font-mono uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Compliance Integrity</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-[#10233F] tracking-tight leading-tight mb-4">
            Legal, Privacy & Customer Policies
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#728091] leading-relaxed font-sans">
            Review the policies governing your membership, bookings, personal information, payments, website use, and partner relationships.
          </p>
        </div>

        {/* Filter / Search section */}
        <div className="flex justify-center mb-10">
          <PolicySearch query={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Policy Grid */}
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-16 glass rounded-[24px] border border-slate-line/80 p-8 max-w-md mx-auto">
            <Compass className="w-10 h-10 text-slate-400 mx-auto mb-4 animate-pulse" />
            <h3 className="font-display font-bold text-base text-[#10233F] mb-1">No policies found</h3>
            <p className="text-xs text-[#728091] font-sans">
              We couldn't find matches for "{searchQuery}". Try searching for terms like "refund", "cookies", or "grievance".
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map(policy => (
              <PolicyCard
                key={policy.id}
                title={policy.title}
                summary={policy.summary}
                lastUpdated={policy.lastUpdated}
                icon={policy.icon}
                slug={policy.slug}
                onClick={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
