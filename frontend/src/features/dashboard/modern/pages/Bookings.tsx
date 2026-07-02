import { useMemo, useState } from "react";
import { SlidersHorizontal, ChevronLeft, ChevronRight, CalendarDays, MapPin, ReceiptText, RotateCcw } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { bookings } from "../data/dummyData";
import { beduineBackend } from "@/services/backend";
import { notify } from "@/services/uiFeedback";

const tabs = ["All", "Upcoming", "Completed", "Cancelled"];
const columns = [
  { key: "id", label: "Booking ID" },
  { key: "tour", label: "Tour Name" },
  { key: "departure", label: "Travel Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

type Booking = (typeof bookings)[number];

export function Bookings() {
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationStatus, setCancellationStatus] = useState<string | null>(null);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const list = activeTab === "All" ? [...bookings] : bookings.filter((b) => b.status.toLowerCase() === activeTab.toLowerCase());
    return list.sort((a, b) => {
      if (sortOrder === "amountHigh") return Number(b.amount.replace(/[^0-9]/g, "")) - Number(a.amount.replace(/[^0-9]/g, ""));
      if (sortOrder === "amountLow") return Number(a.amount.replace(/[^0-9]/g, "")) - Number(b.amount.replace(/[^0-9]/g, ""));
      return b.id.localeCompare(a.id);
    });
  }, [activeTab, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const requestCancellation = async (booking: Booking, refundPreference: "cash_refund" | "credit_adjustment") => {
    setCancellationLoading(true);
    setCancellationStatus(null);
    try {
      const result = await beduineBackend.requestCancellation({
        bookingId: booking.id,
        reason: 'Requested from customer dashboard',
        refundPreference,
      });
      setCancellationStatus(`Request ${result.requestId} created with status ${result.status}.`);
      notify.success('Cancellation request created. Admin review will follow.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cancellation request failed.';
      setCancellationStatus(message);
      notify.error(message);
    } finally {
      setCancellationLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <DashboardCard delay={0}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`rounded-full px-5 py-2 text-[13px] font-bold transition-all duration-200 ${
                  activeTab === tab ? "bg-secondary text-white shadow-md shadow-blue-200" : "bg-slate-100 text-text-secondary hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Button variant="outline" className="w-fit" onClick={() => setFilterOpen((v) => !v)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>

        {filterOpen && (
          <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
            <label className="text-[12px] font-extrabold uppercase tracking-wide text-text-secondary">Sort bookings</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-xl border border-border bg-white p-2.5 text-[13px] font-bold text-text-secondary focus:border-secondary focus:outline-none sm:max-w-xs"
            >
              <option value="newest">Newest booking ID first</option>
              <option value="amountHigh">Amount: high to low</option>
              <option value="amountLow">Amount: low to high</option>
            </select>
          </div>
        )}
      </DashboardCard>

      <DashboardCard delay={150}>
        <DataTable columns={columns} emptyText="No bookings found for this status">
          {paginated.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{booking.id}</td>
              <td className="px-4 py-3 text-[13px] font-medium text-text-secondary">{booking.tour}</td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{booking.travelDate}</td>
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{booking.amount}</td>
              <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary-light hover:text-secondary-dark" onClick={() => setSelectedBooking(booking)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </DataTable>

        <div className="mt-5 flex items-center justify-between text-[13px] text-text-secondary">
          <p>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:scale-105 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-bold transition-all duration-200 hover:scale-105 ${page === p ? "bg-secondary text-white" : "border border-border hover:bg-slate-50"}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-all duration-200 hover:scale-105 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </DashboardCard>

      <Modal open={Boolean(selectedBooking)} title="Booking details" onClose={() => { setSelectedBooking(null); setCancellationStatus(null); }} footer={<Button onClick={() => { setSelectedBooking(null); setCancellationStatus(null); }}>Done</Button>}>
        {selectedBooking && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-secondary-light p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-secondary">{selectedBooking.id}</p>
              <h3 className="mt-1 text-xl font-extrabold text-text-primary">{selectedBooking.tour}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail icon={CalendarDays} label="Departure" value={selectedBooking.travelDate} />
              <Detail icon={ReceiptText} label="Amount" value={selectedBooking.amount} />
              <Detail icon={MapPin} label="Status" value={selectedBooking.status} />
              <Detail icon={ReceiptText} label="Payment" value="Linked with My Payments" />
            </div>

            {selectedBooking.status.toLowerCase() === 'upcoming' && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <RotateCcw className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-[12px] font-extrabold uppercase tracking-wide text-amber-800">Cancellation / Refund Request</p>
                    <p className="mt-1 text-[12px] font-semibold text-amber-900/80">Customer request → admin review → supplier charges → refund preview → cash refund or 12-month credit adjustment.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" disabled={cancellationLoading} onClick={() => requestCancellation(selectedBooking, 'cash_refund')}>Request Cash Refund</Button>
                      <Button size="sm" disabled={cancellationLoading} onClick={() => requestCancellation(selectedBooking, 'credit_adjustment')}>Request Credit Adjustment</Button>
                    </div>
                    {cancellationStatus && <p className="mt-2 text-[11px] font-bold text-amber-900">{cancellationStatus}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-slate-50 p-3">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-[13px] font-bold text-text-primary">{value}</p>
    </div>
  );
}
