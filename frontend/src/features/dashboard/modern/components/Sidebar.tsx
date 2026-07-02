import { useState } from "react";
import { cn } from "../utils/cn";
import { Logo } from "./Logo";
import { LogOut, X } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { dashboardMenu, DashboardRoute } from "../routes";

interface SidebarProps {
  activeRoute: DashboardRoute;
  onNavigate: (route: DashboardRoute) => void;
  mobileOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  onBookPaidTour?: () => void;
}


export function Sidebar({ activeRoute, onNavigate, mobileOpen = false, onClose, onLogout, onBookPaidTour }: SidebarProps) {
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleNavigate = (route: DashboardRoute) => {
    onNavigate(route);
    onClose?.();
  };

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-64 flex-col overflow-hidden border-r border-white/70 bg-white/90 text-text-primary shadow-2xl shadow-blue-950/10 backdrop-blur-2xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-sky-50/60" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-full opacity-80">
          <img src="/images/dashboard_beach_cliff.png" alt="Beach Cliff" className="h-auto w-full object-contain" />
        </div>

        <div className="relative z-10 flex items-start justify-between px-5 pt-4">
          <Logo />
          <button onClick={onClose} className="rounded-2xl p-2 text-text-secondary transition hover:bg-slate-100 hover:text-text-primary lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 px-5 pb-2 pt-2">
          <p className="text-[16px] font-black leading-tight tracking-tight text-secondary">YOUR JOURNEY.</p>
          <p className="text-[16px] font-black leading-tight tracking-tight text-primary">OUR PROMISE.</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#6D8A3B]">Safar jo yad rahe</p>
        </div>

        <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-1">
          <ul className="space-y-1">
            {dashboardMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-1.5 text-[12px] font-extrabold transition-all duration-300",
                      isActive
                        ? "bg-secondary text-white shadow-lg shadow-blue-200/80"
                        : "text-text-secondary hover:-translate-y-0.5 hover:bg-white hover:text-text-primary hover:shadow-md hover:shadow-blue-100/70"
                    )}
                  >
                    {isActive && <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-primary" />}
                    <span className={cn("relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300", isActive ? "bg-white/18 text-white" : "bg-secondary-light text-secondary group-hover:bg-primary-light group-hover:text-primary")}>
                      <Icon className="h-[15px] w-[15px]" />
                    </span>
                    <span className="relative z-10 truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="relative z-10 mx-4 mb-3 overflow-hidden rounded-2xl bg-[#006DF5] text-white shadow-lg shadow-blue-900/10">
          <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: "url('/images/kashmir.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071B2C] via-[#071B2C]/40 to-transparent" />
          <div className="relative p-3.5 space-y-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Explore The World</h4>
            <p className="text-[10px] font-bold opacity-80 leading-snug">Amazing destinations await you.</p>
            <button type="button" onClick={onBookPaidTour} className="w-full rounded-lg bg-primary hover:bg-primary-dark py-1.5 text-[11px] font-black text-white shadow-md active:scale-95 transition-all">
              Book Now
            </button>
          </div>
        </div>

        <div className="relative z-10 border-t border-blue-100/80 bg-white/55 p-3">
          <button onClick={() => setLogoutOpen(true)} className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-1.5 text-[12px] font-extrabold text-text-secondary transition hover:bg-white hover:text-text-primary hover:shadow-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-light text-primary"><LogOut className="h-[15px] w-[15px]" /></span>
            Logout
          </button>
        </div>
      </aside>

      <Modal
        open={logoutOpen}
        title="Logout confirmation"
        onClose={() => setLogoutOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => { setLogoutOpen(false); onLogout?.(); }}>Logout</Button>
          </>
        }
      >
        <p>Are you sure you want to logout from the Beduine dashboard?</p>
      </Modal>
    </>
  );
}
