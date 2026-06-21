
import { ShieldAlert } from 'lucide-react';

interface PolicyVersionProps {
  version: string;
}

export function PolicyVersion({ version }: PolicyVersionProps) {
  return (
    <div className="mt-12 p-4 rounded-xl border border-amber-500/15 bg-amber-500/5 text-amber-400 text-[10px] sm:text-xs flex items-start gap-2.5 font-mono leading-relaxed select-none">
      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold">Disclaimer for Professional Review:</span> This document (Version {version}) is a professional draft generated for {window.location.host || 'Beduine Tour & Travels'}. This document should be reviewed by a qualified local lawyer before publication to ensure full compliance with regional regulatory requirements.
      </div>
    </div>
  );
}
