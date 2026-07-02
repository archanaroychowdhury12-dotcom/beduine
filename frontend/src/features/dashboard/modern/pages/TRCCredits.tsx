import { useState } from "react";
import { Gift, TicketPercent, Trophy, WalletCards } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { Countdown } from "../components/Countdown";
import { DataTable } from "../components/DataTable";
import { Modal } from "../components/Modal";
import { creditHistory, drawResults, trcData } from "../data/dummyData";

const creditColumns = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Credit" },
  { key: "balance", label: "Balance" },
];

export function TRCCredits() {
  const [entriesOpen, setEntriesOpen] = useState(false);
  const [winnersOpen, setWinnersOpen] = useState(false);
  const trcCredits = creditHistory.filter((item) => item.description.toLowerCase().includes("draw") || item.description.toLowerCase().includes("winner"));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashboardCard delay={0}>
          <p className="text-[12px] font-semibold text-text-secondary">Your TRC Credits</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-primary transition-transform duration-300 hover:scale-110">
              <TicketPercent className="h-8 w-8" />
            </div>
            <div>
              <p className="text-4xl font-extrabold text-text-primary">{trcData.totalEntries}</p>
              <p className="text-[12px] font-semibold text-text-secondary">Total Entries</p>
            </div>
          </div>
          <Button className="mt-5 w-fit" onClick={() => setEntriesOpen(true)}>View All Entries</Button>
        </DashboardCard>

        <DashboardCard className="relative overflow-hidden border-0 bg-gradient-to-r from-secondary via-secondary to-[#0052CC] p-0 text-white lg:col-span-2" delay={150}>
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <svg className="h-full w-full" viewBox="0 0 800 240" preserveAspectRatio="none">
              {[...Array(15)].map((_, i) => (
                <text key={i} x={`${8 + i * 6}%`} y={`${15 + (i % 3) * 30}%`} fill="white" fontSize={i % 2 === 0 ? "14" : "10"}>✦</text>
              ))}
            </svg>
          </div>
          <div className="relative flex flex-col items-center justify-between gap-6 p-6 md:flex-row md:p-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Trophy className="h-6 w-6 text-gold" />
                <h3 className="text-xl font-extrabold md:text-2xl">Next Travel Reward Draw</h3>
              </div>
              <p className="text-sm font-medium text-white/80">{trcData.nextDraw}</p>
              <Button variant="secondary" size="sm" onClick={() => setWinnersOpen(true)}>View Winners</Button>
            </div>
            <Countdown targetDate={trcData.targetDate} />
            <div className="hidden md:block">
              <img src="/images/trophy.webp" alt="Trophy" className="h-28 w-28 animate-float object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(255,209,102,0.35)] md:h-32 md:w-32" />
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="TRC / Travel Reward Credit History" delay={300}>
        <DataTable columns={creditColumns}>
          {trcCredits.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] text-text-secondary">{item.date}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{item.description}</td>
              <td className="px-4 py-3 text-[13px] font-black text-success">{item.amount}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{item.balance}</td>
            </tr>
          ))}
        </DataTable>
      </DashboardCard>

      <Modal open={entriesOpen} title="TRC entries" onClose={() => setEntriesOpen(false)} footer={<Button onClick={() => setEntriesOpen(false)}>Done</Button>}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: trcData.totalEntries }, (_, index) => (
            <div key={index} className="rounded-xl border border-border bg-slate-50 p-3 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-primary"><WalletCards className="h-5 w-5" /></div>
              <p className="text-[11px] font-bold uppercase text-text-secondary">Entry</p>
              <p className="mt-1 text-lg font-extrabold text-primary">TRC-{String(index + 1).padStart(3, "0")}</p>
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={winnersOpen} title="Recent winners" onClose={() => setWinnersOpen(false)} footer={<Button onClick={() => setWinnersOpen(false)}>Done</Button>}>
        <div className="space-y-3">
          {drawResults.map((result) => (
            <div key={`${result.drawDate}-${result.winner}`} className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="flex items-start gap-3"><Gift className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="text-[12px] font-bold text-text-secondary">{result.drawDate}</p>
                  <h4 className="mt-1 font-extrabold text-text-primary">{result.prize} — {result.amount}</h4>
                  <p className="mt-1 text-sm text-text-secondary">{result.winner}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
