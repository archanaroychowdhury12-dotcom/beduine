import { Bell, Menu } from "lucide-react";
import type { CustomerProfileSummary } from "@/services/backend";
import { cn } from "../utils/cn";

interface HeaderProps {
  title: string;
  profile: CustomerProfileSummary;
  onMenuClick: () => void;
  className?: string;
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'BD';
}

export function Header({ title, profile, onMenuClick, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 mx-2 mt-2 flex items-center justify-between rounded-2xl border border-white/80 bg-white/82 px-4 py-3 shadow-[0_16px_45px_rgba(11,27,58,0.07)] backdrop-blur-xl md:mx-4 md:mt-3 md:px-6 lg:mx-5 lg:px-7",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-white text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-secondary/30 hover:bg-secondary-light hover:text-secondary active:scale-95 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="truncate text-lg font-black tracking-tight text-text-primary md:text-xl">{title}</h2>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <button type="button" aria-label="Notifications" className="animate-bell-ring relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-text-secondary transition-all duration-200 hover:bg-secondary-light hover:text-secondary">
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-1.5 py-1.5 md:gap-3 md:pr-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white md:h-10 md:w-10">{initials(profile.fullName)}</span>
          <div className="hidden md:block">
            <p className="text-sm font-black leading-none text-text-primary">{profile.fullName}</p>
            <p className="mt-1 text-[11px] font-bold leading-none text-secondary">{profile.uid}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
