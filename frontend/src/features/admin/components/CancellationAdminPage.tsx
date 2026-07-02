import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, RotateCcw, XCircle } from 'lucide-react';
import { beduineBackend, type BeduineBackendAdapter } from '@/services/backend';
import type {
  CancellationAdminSummary,
  CancellationPayoutResponse,
  RefundPreference,
} from '@/services/backend';

export type CancellationAdminApi = Pick<
  BeduineBackendAdapter,
  'listCancellationRequests' | 'reviewCancellation' | 'processCancellationPayout'
>;

interface CancellationAdminPageProps {
  api?: CancellationAdminApi;
  requests?: CancellationAdminSummary[];
}

function money(value: number | undefined): string {
  return `INR ${(value || 0).toLocaleString('en-IN')}`;
}

function statusColor(status: string) {
  if (status === 'refunded' || status === 'credit_adjusted') {
    return { background: '#ecfdf5', color: '#047857' };
  }
  if (status === 'rejected' || status === 'refund_failed') {
    return { background: '#fef2f2', color: '#b91c1c' };
  }
  return { background: '#fffbeb', color: '#a16207' };
}

export function CancellationAdminPage({
  api = beduineBackend,
  requests,
}: CancellationAdminPageProps) {
  const [items, setItems] = useState<CancellationAdminSummary[]>(requests || []);
  const [selectedId, setSelectedId] = useState(requests?.[0]?.requestId || '');
  const [refundMode, setRefundMode] = useState<RefundPreference>(
    requests?.[0]?.refundPreference || 'cash_refund',
  );
  const [supplierCharges, setSupplierCharges] = useState('0');
  const [supplierProofUrl, setSupplierProofUrl] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(requests === undefined);
  const [processingId, setProcessingId] = useState('');
  const [error, setError] = useState('');
  const [payout, setPayout] = useState<CancellationPayoutResponse | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const next = await api.listCancellationRequests();
      setItems(next);
      if (!selectedId && next[0]) {
        setSelectedId(next[0].requestId);
        setRefundMode(next[0].refundPreference);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load cancellations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (requests === undefined) void load();
  }, [requests]);

  const replaceItem = (updated: CancellationAdminSummary) => {
    setItems((current) => current.map((item) => (
      item.requestId === updated.requestId ? updated : item
    )));
  };

  const review = async (item: CancellationAdminSummary, approve: boolean) => {
    setProcessingId(item.requestId);
    setError('');
    setPayout(null);
    try {
      const updated = await api.reviewCancellation({
        requestId: item.requestId,
        approve,
        refundMode,
        supplierCharges: Number(supplierCharges || 0),
        supplierProofUrl: supplierProofUrl.trim() || undefined,
        adminNote: adminNote.trim() || undefined,
      });
      replaceItem(updated);
      setSelectedId(updated.requestId);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Review failed.');
    } finally {
      setProcessingId('');
    }
  };

  const processPayout = async (item: CancellationAdminSummary) => {
    setProcessingId(item.requestId);
    setError('');
    try {
      const result = await api.processCancellationPayout(item.requestId);
      setPayout(result);
      setItems((current) => current.map((candidate) => (
        candidate.requestId === result.requestId
          ? {
              ...candidate,
              status: result.status,
              providerRefundId: result.providerRefundId,
            }
          : candidate
      )));
    } catch (payoutError) {
      setError(payoutError instanceof Error ? payoutError.message : 'Payout failed.');
    } finally {
      setProcessingId('');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>
        Loading cancellation requests...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 15, color: '#0f172a' }}>Cancellation and Refund Review</h3>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>
            Supplier deductions and policy calculations are finalized by the server.
          </p>
        </div>
        {requests === undefined && (
          <button
            type="button"
            onClick={() => void load()}
            aria-label="Refresh cancellations"
            title="Refresh cancellations"
            style={{ width: 36, height: 36, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}
          >
            <RefreshCw size={15} />
          </button>
        )}
      </div>

      {error && (
        <div role="alert" style={{ padding: 12, background: '#fef2f2', color: '#b91c1c', fontSize: 12 }}>
          <AlertCircle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
          No cancellation requests are awaiting review.
        </div>
      ) : items.map((item) => {
        const selected = item.requestId === selectedId;
        const canReview = item.status === 'admin_review';
        const canPayout = item.status === 'approved' || item.status === 'refund_failed';
        const isProcessing = processingId === item.requestId;

        return (
          <section
            key={item.requestId}
            style={{ border: `1px solid ${selected ? '#94a3b8' : '#e2e8f0'}`, padding: 16, background: '#fff' }}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedId(item.requestId);
                setRefundMode(item.refundMode || item.refundPreference);
              }}
              style={{ width: '100%', border: 0, padding: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
                <div>
                  <strong style={{ fontSize: 13, color: '#0f172a' }}>{item.bookingId}</strong>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                    {item.userEmail || item.userId} | {item.requestId}
                  </div>
                </div>
                <span style={{ ...statusColor(item.status), padding: '4px 9px', fontSize: 10, fontWeight: 800 }}>
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 14 }}>
              <div><small>Total tour cost</small><strong style={{ display: 'block' }}>{money(item.totalTourCost)}</strong></div>
              <div><small>Amount paid</small><strong style={{ display: 'block' }}>{money(item.amountPaid)}</strong></div>
              <div><small>Travelers</small><strong style={{ display: 'block' }}>{item.travelerCount}</strong></div>
              <div><small>Departure</small><strong style={{ display: 'block' }}>{new Date(item.departureDate).toLocaleDateString('en-IN')}</strong></div>
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 12, color: '#475569' }}>{item.reason}</p>

            {selected && canReview && (
              <div style={{ display: 'grid', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: 11, fontWeight: 700 }}>
                  Refund method
                  <select
                    aria-label="Refund method"
                    value={refundMode}
                    onChange={(event) => setRefundMode(event.target.value as RefundPreference)}
                    style={{ display: 'block', width: '100%', marginTop: 5, padding: 9, border: '1px solid #cbd5e1' }}
                  >
                    <option value="cash_refund">Cash refund</option>
                    <option value="credit_adjustment">12-month credit adjustment</option>
                  </select>
                </label>
                <label style={{ fontSize: 11, fontWeight: 700 }}>
                  Supplier charges
                  <input
                    aria-label="Supplier charges"
                    type="number"
                    min="0"
                    value={supplierCharges}
                    onChange={(event) => setSupplierCharges(event.target.value)}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5, padding: 9, border: '1px solid #cbd5e1' }}
                  />
                </label>
                <label style={{ fontSize: 11, fontWeight: 700 }}>
                  Supplier proof URL
                  <input
                    aria-label="Supplier proof URL"
                    type="url"
                    value={supplierProofUrl}
                    onChange={(event) => setSupplierProofUrl(event.target.value)}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5, padding: 9, border: '1px solid #cbd5e1' }}
                  />
                </label>
                <label style={{ fontSize: 11, fontWeight: 700 }}>
                  Admin note
                  <textarea
                    aria-label="Admin note"
                    value={adminNote}
                    onChange={(event) => setAdminNote(event.target.value)}
                    style={{ display: 'block', width: '100%', boxSizing: 'border-box', marginTop: 5, padding: 9, border: '1px solid #cbd5e1' }}
                  />
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => void review(item, true)}
                    style={{ padding: '9px 14px', border: 0, background: '#0f766e', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                  >
                    <CheckCircle2 size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Review and Approve
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => void review(item, false)}
                    style={{ padding: '9px 14px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontWeight: 800, cursor: 'pointer' }}
                  >
                    <XCircle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Reject
                  </button>
                </div>
              </div>
            )}

            {item.calculation && (
              <div style={{ marginTop: 14, padding: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: 13 }}>
                  Server refund preview: {money(item.estimatedRefund)}
                </strong>
                <div style={{ marginTop: 6, fontSize: 11, color: '#475569' }}>
                  {item.calculation.cancellationFeePercent}% policy fee | Supplier {money(item.calculation.supplierCharges)} | Total deduction {money(item.calculation.totalDeduction)}
                </div>
              </div>
            )}

            {canPayout && (
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => void processPayout(item)}
                style={{ marginTop: 12, padding: '9px 14px', border: 0, background: '#1d4ed8', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
              >
                <RotateCcw size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Process {item.refundMode === 'credit_adjustment' ? 'Credit' : 'Razorpay Refund'}
              </button>
            )}
          </section>
        );
      })}

      {payout && (
        <div style={{ padding: 12, background: '#eff6ff', color: '#1e40af', fontSize: 12 }}>
          Payout {payout.requestId}: {payout.status.replace(/_/g, ' ')}
          {payout.providerRefundId ? ` | ${payout.providerRefundId}` : ''}
        </div>
      )}
    </div>
  );
}
