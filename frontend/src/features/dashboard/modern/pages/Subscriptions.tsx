import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { activeSubscription, subscriptionHistory } from "../data/dummyData";

const columns = [
  { key: "plan", label: "Plan Name" },
  { key: "start", label: "Start Date" },
  { key: "end", label: "End Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
];

export function Subscriptions() {
  const [page, setPage] = useState(1);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(subscriptionHistory.length / pageSize));
  const paginated = subscriptionHistory.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <DashboardCard className="relative overflow-hidden p-0" delay={0}>
        <div className="relative flex flex-col items-center gap-6 bg-gradient-to-br from-secondary via-secondary to-[#0052CC] p-6 text-white md:flex-row md:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <svg className="h-full w-full" viewBox="0 0 800 240" preserveAspectRatio="none">
              {[...Array(15)].map((_, i) => (
                <text key={i} x={`${8 + (i * 6)}%`} y={`${15 + (i % 3) * 30}%`} fill="white" fontSize={i % 2 === 0 ? "14" : "10"}>✦</text>
              ))}
            </svg>
          </div>

          <div className="relative z-10 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold">{activeSubscription.planName}</h3>
              <StatusBadge status={activeSubscription.status} />
            </div>
            <p className="text-3xl font-extrabold text-gold">{activeSubscription.price}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[12px] uppercase tracking-wide text-white/70">Start Date</p>
                <p className="font-bold">{activeSubscription.startDate}</p>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-wide text-white/70">End Date</p>
                <p className="font-bold">{activeSubscription.endDate}</p>
              </div>
            </div>
            <ul className="space-y-2 text-[13px] text-white/90">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Priority booking access</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Exclusive member discounts</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" /> Travel Reward entries</li>
            </ul>
            <Button className="mt-2 w-fit" onClick={() => setBenefitsOpen(true)}>View Benefits</Button>
          </div>

          <div className="relative z-10 hidden md:block">
            <img src="/images/globe.webp" alt="Subscription" className="h-48 w-48 animate-float rounded-full object-cover ring-4 ring-white/30" />
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Subscription History" delay={200}>
        <DataTable columns={columns}>
          {paginated.map((sub, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{sub.planName}</td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{sub.startDate}</td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{sub.endDate}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{sub.amount}</td>
              <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
            </tr>
          ))}
        </DataTable>

        <div className="mt-5 flex items-center justify-between text-[13px] text-text-secondary">
          <p>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, subscriptionHistory.length)} of {subscriptionHistory.length} entries</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:bg-slate-50 hover:scale-105 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold transition-all duration-200 hover:scale-105 ${page === p ? "bg-secondary text-white" : "border border-border hover:bg-slate-50"}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:bg-slate-50 hover:scale-105 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </DashboardCard>

      <Modal open={benefitsOpen} title="International Plan benefits" onClose={() => setBenefitsOpen(false)} footer={<Button onClick={() => setBenefitsOpen(false)}>Done</Button>}>
        <ul className="space-y-3">
          {["Priority booking access", "Exclusive member discounts", "Travel Reward entries", "Dedicated travel support", "Early access to international group tours"].map((benefit) => (
            <li key={benefit} className="flex items-center gap-3 rounded-xl border border-border bg-slate-50 p-3 font-bold text-text-primary">
              <Check className="h-5 w-5 text-primary" /> {benefit}
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
