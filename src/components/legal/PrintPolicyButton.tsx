
import { Printer } from 'lucide-react';

export function PrintPolicyButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="no-print inline-flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono text-cyan-deep border border-cyan-deep/30 rounded-full bg-white/40 hover:bg-cyan-deep/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan"
      title="Print Policy Page"
    >
      <Printer className="w-4 h-4" />
      <span>Print / PDF</span>
    </button>
  );
}
