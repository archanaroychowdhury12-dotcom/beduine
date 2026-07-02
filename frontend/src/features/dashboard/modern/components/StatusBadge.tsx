import { cn } from "../utils/cn";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const styles: Record<string, string> = {
    upcoming: "bg-blue-50 text-secondary ring-blue-100",
    completed: "bg-green-50 text-green-600 ring-green-100",
    cancelled: "bg-red-50 text-red-500 ring-red-100",
    success: "bg-green-50 text-green-600 ring-green-100",
    pending: "bg-amber-50 text-amber-600 ring-amber-100",
    refunded: "bg-blue-50 text-secondary ring-blue-100",
    active: "bg-green-50 text-green-600 ring-green-100",
    expired: "bg-slate-100 text-slate-500 ring-slate-200",
    open: "bg-blue-50 text-secondary ring-blue-100",
    "in progress": "bg-amber-50 text-amber-600 ring-amber-100",
    closed: "bg-green-50 text-green-600 ring-green-100",
    credit: "bg-green-50 text-green-600 ring-green-100",
    debit: "bg-red-50 text-red-500 ring-red-100",
    won: "bg-green-50 text-green-600 ring-green-100",
    "not won": "bg-slate-100 text-slate-500 ring-slate-200",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black tracking-wide ring-1", styles[normalized] || "bg-slate-100 text-slate-600 ring-slate-200", className)}>
      {status}
    </span>
  );
}
