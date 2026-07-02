import { useMemo, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { PageTransition } from "./PageTransition";
import type { CustomerDashboardResponse } from "@/services/backend";
import { CustomerDashboardView } from "../pages/CustomerDashboardView";
import { dashboardPages, DashboardRoute } from "../routes";

interface DashboardLayoutProps {
  model: CustomerDashboardResponse;
  onLogout?: () => void;
  onBookPaidTour?: () => void;
  onRefresh?: () => Promise<void>;
}

export function DashboardLayout({ model, onLogout, onBookPaidTour, onRefresh }: DashboardLayoutProps) {
  const [activeRoute, setActiveRoute] = useState<DashboardRoute>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = useMemo(() => dashboardPages.find((p) => p.id === activeRoute)?.title ?? "Dashboard Overview", [activeRoute]);

  return (
    <div className="relative flex h-screen overflow-hidden bg-bg bg-cover bg-center" style={{ backgroundImage: "url('/images/dashboard_bg.jpg')" }}>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-40 overflow-hidden opacity-60">
        <svg viewBox="0 0 1400 190" className="h-full w-full" preserveAspectRatio="none">
          <path d="M0 190 L0 120 L120 50 L245 190 Z" fill="#DBEAFE" opacity=".72" />
          <path d="M140 190 L330 30 L525 190 Z" fill="#BFDBFE" opacity=".58" />
          <path d="M480 190 L650 88 L810 190 Z" fill="#E0F2FE" opacity=".75" />
          <path d="M900 190 L1130 35 L1400 190 Z" fill="#DBEAFE" opacity=".72" />
          <path d="M0 150 Q 260 95 520 150 T 1040 150 T 1400 145 V 190 H 0 Z" fill="#FFFFFF" opacity=".48" />
        </svg>
      </div>

      <Sidebar
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={onLogout}
        onBookPaidTour={onBookPaidTour}
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={pageTitle} profile={model.profile} onMenuClick={() => setMobileOpen(true)} />
        <main className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-24 md:p-6 lg:p-8 lg:pb-8">
          <PageTransition routeKey={activeRoute}>
            <CustomerDashboardView
              route={activeRoute}
              model={model}
              onLogout={onLogout}
              onBookPaidTour={onBookPaidTour}
              onRefresh={onRefresh}
            />
          </PageTransition>
        </main>
      </div>

      <MobileNav activeRoute={activeRoute} onNavigate={setActiveRoute} />
    </div>
  );
}
