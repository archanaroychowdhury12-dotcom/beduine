import { useState } from "react";
import { Download, ChevronLeft, ChevronRight, Banknote, Clock, RotateCcw, CheckCircle } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { payments, paymentSummary } from "../data/dummyData";

const columns = [
  { key: "id", label: "Payment ID" },
  { key: "bookingId", label: "Booking ID" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Payment Date" },
  { key: "status", label: "Status" },
  { key: "receipt", label: "Receipt" },
];

type Payment = (typeof payments)[number];

function downloadReceipt(payment: Payment) {
  const receipt = [
    "BEDUINE Tour and Travels Pvt Ltd",
    "Payment Receipt",
    "",
    `Payment ID: ${payment.id}`,
    `Booking ID: ${payment.bookingId}`,
    `Amount: ${payment.amount}`,
    `Payment Date: ${payment.date}`,
    `Status: ${payment.status}`,
    "",
    "This is a frontend-only dummy receipt for UI testing.",
  ].join("\n");

  const blob = new Blob([receipt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${payment.id}-receipt.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Payments() {
  const [page, setPage] = useState(1);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));
  const paginated = payments.slice((page - 1) * pageSize, page * pageSize);

  const handleDownload = (payment: Payment) => {
    downloadReceipt(payment);
    setDownloadedId(payment.id);
    window.setTimeout(() => setDownloadedId(null), 1800);
  };

  return (
    <div className="space-y-5">
      {downloadedId && (
        <div className="fixed right-4 top-20 z-[80] flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-700 shadow-lg">
          <CheckCircle className="h-5 w-5" /> Receipt downloaded: {downloadedId}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Paid" value={paymentSummary.totalPaid} icon={Banknote} iconBg="bg-emerald-50" iconColor="text-emerald-600" delay={0} />
        <StatCard title="Pending Amount" value={paymentSummary.pendingAmount} icon={Clock} iconBg="bg-orange-50" iconColor="text-primary" delay={100} />
        <StatCard title="Refunded Amount" value={paymentSummary.refundedAmount} icon={RotateCcw} iconBg="bg-blue-50" iconColor="text-secondary" delay={200} />
      </div>

      <DashboardCard delay={300}>
        <DataTable columns={columns}>
          {paginated.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{payment.id}</td>
              <td className="px-4 py-3 text-[13px] font-medium text-text-secondary">{payment.bookingId}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{payment.amount}</td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{payment.date}</td>
              <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
              <td className="px-4 py-3">
                <button onClick={() => handleDownload(payment)} className="rounded-lg p-2 text-text-secondary transition-all duration-200 hover:scale-110 hover:bg-slate-100 hover:text-secondary" aria-label={`Download receipt for ${payment.id}`}>
                  <Download className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        <div className="mt-5 flex items-center justify-between text-[13px] text-text-secondary">
          <p>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, payments.length)} of {payments.length} entries</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:scale-105 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold transition-all duration-200 hover:scale-105 ${page === p ? "bg-secondary text-white" : "border border-border hover:bg-slate-50"}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:scale-105 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
