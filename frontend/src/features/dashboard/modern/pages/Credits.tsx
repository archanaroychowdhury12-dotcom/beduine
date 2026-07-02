import { Wallet, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { creditSummary, creditHistory } from "../data/dummyData";

const columns = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "balance", label: "Balance" },
];

export function Credits() {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(creditHistory.length / pageSize));
  const paginated = creditHistory.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Available Credits" value={creditSummary.available} icon={Wallet} iconBg="bg-purple-bg" iconColor="text-purple" delay={0} />
        <StatCard title="Total Earned" value={creditSummary.totalEarned} icon={Gift} iconBg="bg-orange-50" iconColor="text-primary" delay={100} />
      </div>

      <DashboardCard title="Credit History" delay={200}>
        <DataTable columns={columns}>
          {paginated.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] text-text-secondary">{row.date}</td>
              <td className="px-4 py-3 text-[13px] font-medium text-text-secondary">{row.description}</td>
              <td className="px-4 py-3"><StatusBadge status={row.type} /></td>
              <td className={`px-4 py-3 text-[13px] font-bold ${row.type === "Credit" ? "text-emerald-600" : "text-danger"}`}>{row.amount}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{row.balance}</td>
            </tr>
          ))}
        </DataTable>

        <div className="mt-5 flex items-center justify-between text-[13px] text-text-secondary">
          <p>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, creditHistory.length)} of {creditHistory.length} entries</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:bg-slate-50 hover:scale-105 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold transition-all duration-200 hover:scale-105 ${page === p ? "bg-secondary text-white" : "border border-border hover:bg-slate-50"}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:bg-slate-50 hover:scale-105 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
