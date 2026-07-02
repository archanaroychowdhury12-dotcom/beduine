import { AlertCircle, Loader2 } from 'lucide-react';
import type { AppUser } from '@/types';
import { useCustomerDashboard } from './hooks/useCustomerDashboard';
import { ModernDashboardApp } from './modern/ModernDashboardApp';

interface DashboardPageProps {
  user: AppUser | any;
  onLogout: () => void;
  onBookPaidTour?: () => void;
  onBack?: () => void;
}

export default function DashboardPage({ onLogout, onBookPaidTour }: DashboardPageProps) {
  const dashboard = useCustomerDashboard(true);

  if (dashboard.loading && !dashboard.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <Loader2 className="mr-3 h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="font-semibold">Loading your dashboard...</span>
      </div>
    );
  }

  if (dashboard.error || !dashboard.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-sm">
          <AlertCircle className="mx-auto h-7 w-7 text-red-600" aria-hidden="true" />
          <h1 className="mt-3 text-lg font-bold text-slate-950">Dashboard unavailable</h1>
          <p className="mt-2 text-sm text-slate-600">We could not load your account data.</p>
          <button type="button" onClick={() => void dashboard.refresh()} className="mt-5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <ModernDashboardApp model={dashboard.data} onLogout={onLogout} onBookPaidTour={onBookPaidTour} onRefresh={dashboard.refresh} />;
}
