
import { LEGAL_POLICIES } from '../../data/legalPolicies';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { ImportantNotice } from '../../components/legal/ImportantNotice';

interface MembershipRulesPageProps {
  onNavigate: (slug: string) => void;
}

export default function MembershipRulesPage({ onNavigate }: MembershipRulesPageProps) {
  const policy = LEGAL_POLICIES.find(p => p.slug === 'membership-rules');

  if (!policy) {
    return (
      <div className="p-8 text-center text-red-500 font-mono">
        Error: Membership Rules policy definition not found.
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
