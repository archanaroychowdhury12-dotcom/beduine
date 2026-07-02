
import { LEGAL_POLICIES } from '../../data/legalPolicies';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { ImportantNotice } from '../../components/legal/ImportantNotice';
import { CookieModalTrigger } from '../../components/legal/CookieConsentBanner';
import { Settings } from 'lucide-react';

interface CookiePageProps {
  onNavigate: (slug: string) => void;
}

export default function CookiePolicyPage({ onNavigate }: CookiePageProps) {
  const policy = LEGAL_POLICIES.find(p => p.slug === 'cookie-policy');

  if (!policy) {
    return (
      <div className="p-8 text-center text-red-500 font-mono">
        Error: Cookie Policy definition not found.
      </div>
    );
  }

  return (
    <LegalPageLayout policy={policy} onNavigate={onNavigate}>
      <ImportantNotice notices={policy.importantNotices || []} />

      {policy.sections.map(s => (
        <LegalSection
          key={s.num}
          num={s.num}
          title={s.title}
          content={s.content}
        />
      ))}

      {/* Button to reopen preferences */}
      <div className="w-full mt-8 p-6 rounded-3xl border border-slate-line bg-white/70 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          <h3 className="font-display font-bold text-sm text-[#10233F] mb-1">Manage Cookie Settings</h3>
          <p className="text-xs text-[#728091]">You can modify your consent settings for analytics, functional and marketing cookies at any time.</p>
        </div>
        <CookieModalTrigger>
          <button className="px-5 py-2.5 rounded-full bg-cyan-deep hover:bg-[#007A94] text-white text-xs font-bold font-display flex items-center gap-1.5 cursor-pointer border-none shadow-md">
            <Settings className="w-4 h-4" />
            <span>Open Preference Center</span>
          </button>
        </CookieModalTrigger>
      </div>
    </LegalPageLayout>
  );
}
