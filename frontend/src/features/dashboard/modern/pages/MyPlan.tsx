import { Globe2 } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { activeSubscription, subscriptionHistory } from "../data/dummyData";

const columns = [
  { key: "planName", label: "Plan Name" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

export function MyPlan() {
  return (
    <div className="space-y-5">
      <DashboardCard className="relative overflow-hidden border-0 bg-gradient-to-r from-secondary via-secondary to-[#0052CC] p-0 text-white" delay={0}>
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <svg className="h-full w-full" viewBox="0 0 900 260" preserveAspectRatio="none">
            <path d="M80 190 Q 260 40, 470 150 T 850 85" fill="none" stroke="white" strokeWidth="2" strokeDasharray="7 7" />
            <g transform="translate(800,75) rotate(-18)"><path d="M0 7 L35 0 L42 7 L35 14 Z" fill="white" /></g>
            {[...Array(16)].map((_, i) => <text key={i} x={`${8 + i * 5}%`} y={`${18 + (i % 4) * 20}%`} fill="white" fontSize="14">✦</text>)}
          </svg>
        </div>
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Globe2 className="h-7 w-7" />
              </div>
              <span className="rounded-full bg-success px-3 py-1 text-[12px] font-extrabold text-white">{activeSubscription.status}</span>
            </div>
            <h3 className="text-2xl font-black md:text-3xl">{activeSubscription.planName}</h3>
            <p className="mt-2 text-lg font-black text-gold">{activeSubscription.price}</p>
            <div className="mt-5 grid gap-2 text-sm font-semibold text-white/85 sm:grid-cols-2">
              <p>Start Date: {activeSubscription.startDate}</p>
              <p>End Date: {activeSubscription.endDate}</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/20 shadow-xl">
              <img src="/images/globe.webp" alt="Globe" className="h-full w-full object-cover" />
            </div>
            <Button variant="primary" className="bg-primary hover:bg-primary-dark">View Benefits</Button>
          </div>
        </div>
      </DashboardCard>


      <DashboardCard title="Plan History" delay={450}>
        <DataTable columns={columns}>
          {subscriptionHistory.map((item) => (
            <tr key={`${item.planName}-${item.startDate}`} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{item.planName}</td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{item.startDate}</td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{item.endDate}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{item.amount}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
            </tr>
          ))}
        </DataTable>
      </DashboardCard>
    </div>
  );
}
