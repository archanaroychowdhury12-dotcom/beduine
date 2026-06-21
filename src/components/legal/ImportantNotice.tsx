
import { ShieldAlert } from 'lucide-react';

interface ImportantNoticeProps {
  notices: string[];
}

export function ImportantNotice({ notices }: ImportantNoticeProps) {
  if (!notices || notices.length === 0) return null;

  return (
    <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm flex flex-col gap-2 relative overflow-hidden">
      <div className="flex items-center gap-2 font-display font-bold text-amber-400">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <span>Important Notice & Legal Warning</span>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-slate-300 font-mono text-xs">
        {notices.map((notice, idx) => (
          <li key={idx} className="leading-relaxed">
            {notice}
          </li>
        ))}
      </ul>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full pointer-events-none" />
    </div>
  );
}
