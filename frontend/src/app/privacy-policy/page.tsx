
import { LEGAL_POLICIES } from '../../data/legalPolicies';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { ImportantNotice } from '../../components/legal/ImportantNotice';
import { PrivacyRequestForm } from '../../components/legal/PrivacyRequestForm';

interface PrivacyPolicyPageProps {
  onNavigate: (slug: string) => void;
}

export default function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
  const policy = LEGAL_POLICIES.find(p => p.slug === 'privacy-policy');

  if (!policy) {
    return (
      <div className="p-8 text-center text-red-500 font-mono">
        Error: Privacy Policy definition not found.
      </div>
    );
  }

  return (
    <LegalPageLayout policy={policy} onNavigate={onNavigate}>
      {/* Important notices */}
      <ImportantNotice notices={policy.importantNotices || []} />

      {/* Render policy sections */}
      {policy.sections.map(s => (
        <LegalSection
          key={s.num}
          num={s.num}
          title={s.title}
          content={s.content}
        />
      ))}

      {/* Privacy Request form */}
      <PrivacyRequestForm />
    </LegalPageLayout>
  );
}
