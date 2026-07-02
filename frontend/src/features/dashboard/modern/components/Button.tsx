import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-black tracking-[-0.01em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95";

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-orange-200/70 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-orange-300/80 focus:ring-primary",
    secondary:
      "bg-secondary text-white shadow-lg shadow-blue-200/70 hover:-translate-y-0.5 hover:bg-secondary-dark hover:shadow-blue-300/80 focus:ring-secondary",
    outline:
      "border border-border bg-white/90 text-text-secondary shadow-sm hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-secondary-light hover:text-secondary hover:shadow-md focus:ring-slate-300",
    ghost:
      "bg-transparent text-text-secondary hover:-translate-y-0.5 hover:bg-slate-100 hover:text-text-primary focus:ring-slate-300",
    danger:
      "bg-danger text-white shadow-lg shadow-red-200/70 hover:-translate-y-0.5 hover:bg-red-600 focus:ring-danger",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-5 py-2 text-[13px]",
    lg: "px-6 py-2.5 text-sm",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
