import { cn } from "../utils/cn";
import { LucideIcon } from "lucide-react";
import { Counter } from "./Counter";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  footer?: string;
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon: Icon, iconColor = "text-primary", iconBg = "bg-primary-light", footer, className, delay = 0 }: StatCardProps) {
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;
  const isNumeric = !isNaN(numericValue) && typeof value === "number";
  const prefix = typeof value === "string" && value.includes("₹") ? "₹" : "";
  const suffix = typeof value === "string" && value.includes("%") ? "%" : "";

  return (
    <div
      style={{ opacity: 0, animationDelay: `${delay}ms` }}
      className={cn(
        "group travel-card animate-fade-in-up rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-extrabold text-text-secondary">{title}</p>
          <p className="mt-2 text-[26px] font-black tracking-[-0.05em] text-text-primary">
            {isNumeric ? <Counter end={numericValue} prefix={prefix} suffix={suffix} /> : value}
          </p>
        </div>
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
      {footer && (
        <div className="mt-4 flex items-center gap-1 text-[12px] font-black text-secondary transition-colors hover:text-secondary-dark cursor-pointer">
          <span>{footer}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      )}
    </div>
  );
}
