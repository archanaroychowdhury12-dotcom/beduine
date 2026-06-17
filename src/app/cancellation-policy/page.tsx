
import { LEGAL_POLICIES } from '../../data/legalPolicies';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { ImportantNotice } from '../../components/legal/ImportantNotice';

interface CancellationPageProps {
  onNavigate: (slug: string) => void;
}

export default function CancellationPolicyPage({ onNavigate }: CancellationPageProps) {
  const policy = LEGAL_POLICIES.find(p => p.slug === 'cancellation-policy');

  if (!policy) {
    return (
      <div className="p-8 text-center text-red-500 font-mono">
        Error: Cancellation Policy definition not found.
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
    </LegalPageLayout>
  );
}
