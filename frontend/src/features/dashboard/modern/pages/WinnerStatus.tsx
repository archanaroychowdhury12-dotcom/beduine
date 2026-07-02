import { Award, Medal, Trophy } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { winnerStatus } from "../data/dummyData";

const columns = [
  { key: "drawDate", label: "Draw Date" },
  { key: "prize", label: "Prize" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount" },
];

export function WinnerStatus() {
  const totalWins = winnerStatus.filter((row) => row.status === "Won").length;
  const latest = winnerStatus[0];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Wins" value={String(totalWins)} icon={Trophy} iconBg="bg-orange-50" iconColor="text-primary" delay={0} />
        <StatCard title="Latest Status" value={latest.status} icon={Award} iconBg="bg-green-50" iconColor="text-success" delay={100} />
        <StatCard title="Latest Prize" value={latest.amount} icon={Medal} iconBg="bg-secondary-light" iconColor="text-secondary" delay={200} />
      </div>

      <DashboardCard title="Winner Status History" delay={250}>
        <DataTable columns={columns}>
          {winnerStatus.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] text-text-secondary">{row.drawDate}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{row.prize}</td>
              <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
              <td className="px-4 py-3 text-[13px] font-black text-text-primary">{row.amount}</td>
            </tr>
          ))}
        </DataTable>
      </DashboardCard>
    </div>
  );
}
