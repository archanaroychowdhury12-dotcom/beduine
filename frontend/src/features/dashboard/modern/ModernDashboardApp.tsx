import "./modern.css";
import type { CustomerDashboardResponse } from "@/services/backend";
import { DashboardLayout } from "./components/DashboardLayout";

interface ModernDashboardAppProps {
  model: CustomerDashboardResponse;
  onLogout?: () => void;
  onBookPaidTour?: () => void;
  onRefresh?: () => Promise<void>;
}

export function ModernDashboardApp({ model, onLogout, onBookPaidTour, onRefresh }: ModernDashboardAppProps) {
  return <DashboardLayout model={model} onLogout={onLogout} onBookPaidTour={onBookPaidTour} onRefresh={onRefresh} />;
}
