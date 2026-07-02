import { useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, Send } from 'lucide-react';
import { beduineBackend, type BeduineBackendAdapter } from '@/services/backend';
import type {
  AdminSupportTicket,
  AdminSupportUpdateInput,
  SupportPriority,
  SupportStatus,
} from '@/services/backend';

type AdminSupportApi = Pick<
  BeduineBackendAdapter,
  'listSupportTickets' | 'updateSupportTicket'
>;

export function AdminSupportTicketsPage({
  api = beduineBackend,
}: {
  api?: AdminSupportApi;
}) {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');
  const [internalNote, setInternalNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const next = await api.listSupportTickets();
      setTickets(next);
      if (!selectedId && next[0]) setSelectedId(next[0].id);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load support tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [api]);

  const selected = tickets.find((ticket) => ticket.id === selectedId);

  const update = async (input: Omit<AdminSupportUpdateInput, 'ticketId'>) => {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      const updated = await api.updateSupportTicket({ ticketId: selected.id, ...input });
      setTickets((current) => current.map((ticket) => ticket.id === updated.id ? updated : ticket));
      setMessage('');
      setInternalNote(false);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Support update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>Loading support queue...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 0.8fr) minmax(320px, 1.4fr)', gap: 16 }}>
      <div style={{ border: '1px solid #e2e8f0', minHeight: 400 }}>
        <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
          <strong>Ticket queue</strong>
          <button type="button" onClick={() => void load()} aria-label="Refresh support tickets" title="Refresh support tickets" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
            <RefreshCw size={15} />
          </button>
        </div>
        {tickets.length === 0 ? (
          <p style={{ padding: 24, color: '#64748b', textAlign: 'center' }}>No support tickets.</p>
        ) : tickets.map((ticket) => (
          <button
            type="button"
            key={ticket.id}
            onClick={() => setSelectedId(ticket.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: 12,
              textAlign: 'left',
              border: 0,
              borderBottom: '1px solid #f1f5f9',
              background: ticket.id === selectedId ? '#eff6ff' : '#fff',
              cursor: 'pointer',
            }}
          >
            <strong style={{ display: 'block', color: '#0f172a', fontSize: 12 }}>{ticket.subject}</strong>
            <span style={{ display: 'block', marginTop: 4, color: '#64748b', fontSize: 10 }}>{ticket.id} | {ticket.status.replace(/_/g, ' ')}</span>
          </button>
        ))}
      </div>

      <div style={{ border: '1px solid #e2e8f0', padding: 16 }}>
        {error && <p role="alert" style={{ color: '#b91c1c', background: '#fef2f2', padding: 10 }}>{error}</p>}
        {!selected ? (
          <p style={{ color: '#64748b' }}>Select a ticket.</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{selected.subject}</h3>
                <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: 11 }}>{selected.userEmail || selected.userId}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800 }}>{selected.priority}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700 }}>
                Status
                <select
                  aria-label="Ticket status"
                  value={selected.status}
                  disabled={saving}
                  onChange={(event) => void update({ status: event.target.value as SupportStatus })}
                  style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="waiting_customer">Waiting for customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <label style={{ fontSize: 11, fontWeight: 700 }}>
                Priority
                <select
                  aria-label="Ticket priority"
                  value={selected.priority}
                  disabled={saving}
                  onChange={(event) => void update({ priority: event.target.value as SupportPriority })}
                  style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>
            </div>

            <div style={{ marginTop: 16, maxHeight: 280, overflowY: 'auto', background: '#f8fafc', padding: 12 }}>
              {selected.messages.map((entry, index) => (
                <div key={entry.id || index} style={{ marginBottom: 10, padding: 10, background: entry.internalNote ? '#fffbeb' : '#fff', border: '1px solid #e2e8f0' }}>
                  <strong style={{ fontSize: 10 }}>{entry.internalNote ? 'Internal note' : entry.senderRole === 'admin' ? 'Support' : 'Customer'}</strong>
                  <p style={{ margin: '5px 0 0', fontSize: 12, color: '#334155' }}>{entry.message}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700 }}>
                Response
                <textarea
                  aria-label="Support response"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={4}
                  style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5, padding: 9 }}
                />
              </label>
              <label style={{ display: 'flex', gap: 7, alignItems: 'center', marginTop: 8, fontSize: 11 }}>
                <input type="checkbox" checked={internalNote} onChange={(event) => setInternalNote(event.target.checked)} />
                Internal note
              </label>
              <button
                type="button"
                disabled={saving || message.trim().length < 3}
                onClick={() => void update({
                  message: message.trim(),
                  internalNote,
                  status: internalNote ? selected.status : 'waiting_customer',
                })}
                style={{ marginTop: 10, padding: '9px 14px', border: 0, background: '#1d4ed8', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
              >
                {internalNote ? <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> : <Send size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />}
                {saving ? 'Saving...' : internalNote ? 'Add Note' : 'Send Response'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
