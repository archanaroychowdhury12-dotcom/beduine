import { useEffect, useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { DataTable } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import {
  beduineBackend,
  type CreateSupportTicketInput,
  type CustomerSupportTicket,
  type SupportCategory,
} from "@/services/backend";

const tabs = ["All", "Open", "In Progress", "Closed"];
const columns = [
  { key: "id", label: "Ticket ID" },
  { key: "subject", label: "Subject" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Updated On" },
  { key: "action", label: "Action" },
];

interface SupportTicketsProps {
  tickets?: CustomerSupportTicket[];
  createTicket?: (input: CreateSupportTicketInput) => Promise<CustomerSupportTicket>;
}

export function SupportTickets({
  tickets: initialTickets = [],
  createTicket = (input) => beduineBackend.createSupportTicket(input),
}: SupportTicketsProps) {
  const [tickets, setTickets] = useState<CustomerSupportTicket[]>(initialTickets);
  const [activeTab, setActiveTab] = useState("All");
  const [page, setPage] = useState(1);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<CustomerSupportTicket | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketCategory, setTicketCategory] = useState<SupportCategory>("other");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const pageSize = 5;

  useEffect(() => setTickets(initialTickets), [initialTickets]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return tickets;
    const normalizedTab = activeTab.toLowerCase().replace(/ /g, "_");
    return tickets.filter((ticket) => ticket.status.toLowerCase() === normalizedTab);
  }, [activeTab, tickets]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const submitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const created = await createTicket({
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
        category: ticketCategory,
      });
      setTickets((current) => [created, ...current]);
      setTicketSubject("");
      setTicketMessage("");
      setTicketCategory("other");
      setNewTicketOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to create support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <DashboardCard delay={0}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`rounded-full px-5 py-2 text-[13px] font-bold transition-all duration-200 ${activeTab === tab ? "bg-secondary text-white shadow-md shadow-blue-200" : "bg-slate-100 text-text-secondary hover:bg-slate-200"}`}>
                {tab}
              </button>
            ))}
          </div>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setNewTicketOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Ticket</Button>
        </div>
      </DashboardCard>

      <DashboardCard delay={150}>
        <DataTable columns={columns} emptyText="No support tickets found">
          {paginated.map((ticket) => (
            <tr key={ticket.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 text-[13px] font-bold text-text-primary">{ticket.id}</td>
              <td className="px-4 py-3 text-[13px] font-medium text-text-secondary">{ticket.subject}</td>
              <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
              <td className="px-4 py-3 text-[13px] text-text-secondary">{new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString("en-IN")}</td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary-light hover:text-secondary-dark" onClick={() => setSelectedTicket(ticket)}>View</Button>
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

      <Modal open={newTicketOpen} title="Create support ticket" onClose={() => setNewTicketOpen(false)} footer={<><Button variant="outline" onClick={() => setNewTicketOpen(false)}>Cancel</Button><Button onClick={() => void submitTicket()} disabled={submitting || !ticketSubject.trim() || !ticketMessage.trim()}>{submitting ? "Creating..." : "Create Ticket"}</Button></>}>
        <div className="space-y-4">
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-text-secondary">Subject</span>
            <input value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="Example: Payment not reflected" className="mt-2 w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-text-primary focus:border-secondary focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-text-secondary">Category</span>
            <select value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value as SupportCategory)} className="mt-2 w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-text-primary focus:border-secondary focus:outline-none">
              <option value="account">Account</option>
              <option value="payment">Payment</option>
              <option value="subscription">Subscription</option>
              <option value="booking">Booking</option>
              <option value="lucky_draw">Lucky Draw</option>
              <option value="refund">Refund</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[12px] font-extrabold uppercase tracking-wide text-text-secondary">Message</span>
            <textarea value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} rows={4} placeholder="Write your issue here..." className="mt-2 w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-text-primary focus:border-secondary focus:outline-none" />
          </label>
          {submitError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-[12px] font-semibold text-red-700">{submitError}</p>}
        </div>
      </Modal>

      <Modal open={Boolean(selectedTicket)} title="Ticket details" onClose={() => setSelectedTicket(null)} footer={<Button onClick={() => setSelectedTicket(null)}>Done</Button>}>
        {selectedTicket && (
          <div className="space-y-3">
            <p className="text-[12px] font-bold uppercase tracking-wide text-text-secondary">{selectedTicket.id}</p>
            <h3 className="text-xl font-extrabold text-text-primary">{selectedTicket.subject}</h3>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Updated On:</strong> {new Date(selectedTicket.updatedAt || selectedTicket.createdAt).toLocaleString("en-IN")}</p>
            <div className="space-y-2 rounded-xl bg-slate-50 p-3">
              {(selectedTicket.messages || []).map((message, index) => (
                <p key={message.id || index} className="text-sm"><strong>{message.senderRole === "admin" ? "Support" : "You"}:</strong> {message.message}</p>
              ))}
              {(selectedTicket.messages || []).length === 0 && <p className="text-sm text-text-secondary">No conversation messages loaded.</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
