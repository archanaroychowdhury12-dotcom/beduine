import { Map, ArrowLeft } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";

export function NotFound({ onBack }: { onBack?: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <DashboardCard className="max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-light text-secondary">
          <Map className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-text-primary">Page not found</h2>
        <p className="mt-2 text-sm text-text-secondary">This frontend route is not available yet. Go back to the dashboard overview.</p>
        <Button onClick={onBack} className="mt-5"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
      </DashboardCard>
    </div>
  );
}
