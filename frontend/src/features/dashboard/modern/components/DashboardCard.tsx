import { cn } from "../utils/cn";

interface DashboardCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  delay?: number;
}

export function DashboardCard({ title, children, className, headerAction, delay = 0 }: DashboardCardProps) {
  return (
    <div
      style={{ opacity: 0, animationDelay: `${delay}ms` }}
      className={cn(
        "travel-card animate-fade-in-up rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {(title || headerAction) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-[15px] font-black tracking-[-0.01em] text-text-primary">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
