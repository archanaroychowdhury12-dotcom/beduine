import { useState } from "react";
import { cn } from "../utils/cn";
import { MoreHorizontal } from "lucide-react";
import { Modal } from "./Modal";
import { dashboardMenu, DashboardRoute } from "../routes";

const primaryIds: DashboardRoute[] = ["overview", "my-uid", "my-plan", "my-bookings"];

interface MobileNavProps {
  activeRoute: DashboardRoute;
  onNavigate: (route: DashboardRoute) => void;
}

export function MobileNav({ activeRoute, onNavigate }: MobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryItems = dashboardMenu.filter((item) => primaryIds.includes(item.id));
  const moreItems = dashboardMenu.filter((item) => !primaryIds.includes(item.id));
  const isMoreActive = moreItems.some((item) => item.id === activeRoute);

  const goTo = (route: DashboardRoute) => {
    onNavigate(route);
    setMoreOpen(false);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-white/80 bg-white/88 px-2 pb-2 pt-1.5 shadow-[0_-16px_45px_rgba(11,27,58,0.08)] backdrop-blur-xl lg:hidden">
        <div className="pointer-events-none absolute bottom-0 left-0 h-full w-full overflow-hidden opacity-35">
          <svg viewBox="0 0 420 90" className="h-full w-full" preserveAspectRatio="none">
            <path d="M-10 90 L34 38 L80 90 Z" fill="#DBEAFE" />
            <path d="M54 90 L114 26 L174 90 Z" fill="#BFDBFE" />
            <path d="M286 90 L342 42 L420 90 Z" fill="#DBEAFE" />
            <path d="M0 70 Q 105 52, 210 70 T 420 70 V 90 H 0 Z" fill="#BAE6FD" opacity="0.5" />
            <path d="M75 28 Q 205 6, 335 31" fill="none" stroke="#006DF5" strokeWidth="1.4" strokeDasharray="5 5" opacity="0.72" />
            <g transform="translate(328, 20) rotate(-10)"><path d="M0 4 L14 0 L17 4 L14 8 Z" fill="#006DF5" /></g>
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-5 gap-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px] font-black transition-all",
                  isActive ? "bg-secondary text-white shadow-lg shadow-blue-200/70" : "text-text-secondary hover:bg-white"
                )}
              >
                <Icon className="mb-1 h-[18px] w-[18px]" />
                <span className="truncate">{item.label === "Overview" ? "Overview" : item.label.replace("My ", "")}</span>
              </button>
            );
          })}

          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl px-1 py-2 text-[10px] font-black transition-all",
              isMoreActive ? "bg-secondary text-white shadow-lg shadow-blue-200/70" : "text-text-secondary hover:bg-white"
            )}
          >
            <MoreHorizontal className="mb-1 h-[18px] w-[18px]" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <Modal open={moreOpen} title="More sections" onClose={() => setMoreOpen(false)} className="max-w-sm">
        <div className="grid grid-cols-1 gap-2">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[13px] font-black transition",
                  isActive ? "bg-secondary text-white shadow-lg shadow-blue-200/70" : "bg-slate-50 text-text-secondary hover:bg-secondary-light hover:text-secondary"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
