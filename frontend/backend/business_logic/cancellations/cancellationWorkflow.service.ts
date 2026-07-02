import { calculateCancellationCharge, type CancellationChargeResult } from '../booking/cancellationCalculator';

export type CancellationRequestStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'refund_pending'
  | 'refund_processing'
  | 'refund_failed'
  | 'credit_adjustment_pending'
  | 'refunded'
  | 'credit_adjusted'
  | 'closed';

export type RefundMode = 'cash_refund' | 'credit_adjustment';

export interface CancellationRequestRecord {
  id: string;
  bookingId: string;
  userId: string;
  travelerCount: number;
  totalTourCost: number;
  departureDate: string;
  reason: string;
  status: CancellationRequestStatus;
  refundMode?: RefundMode;
  supplierCharges: number;
  supplierProofUrls: string[];
  calculation?: CancellationChargeResult;
  adminNote?: string;
  refundStatus?: 'not_started' | 'pending' | 'processing' | 'completed' | 'failed';
  creditAdjustmentStatus?: 'not_started' | 'pending' | 'issued' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface CancellationWorkflowTransaction {
  getBookingForUpdate(bookingId: string): Promise<{
    id: string;
    userId: string;
    totalTourCost: number;
    departureDate: string;
    travelerCount: number;
    status: string;
  } | null>;
  getCancellationRequestForUpdate(requestId: string): Promise<CancellationRequestRecord | null>;
  getOpenRequestByBookingForUpdate(bookingId: string): Promise<CancellationRequestRecord | null>;
  createCancellationRequest(record: CancellationRequestRecord): Promise<void>;
  updateCancellationRequest(record: CancellationRequestRecord): Promise<void>;
  insertSupplierChargeUpload(input: { requestId: string; amount: number; proofUrl?: string; note?: string; uploadedBy: string }): Promise<void>;
  createRefundTransaction(input: { requestId: string; bookingId: string; userId: string; amount: number; status: 'pending' | 'processing' | 'completed' | 'failed'; mode: RefundMode }): Promise<void>;
  createCreditAdjustment(input: { requestId: string; bookingId: string; userId: string; amount: number; expiresAt: string; status: 'pending' | 'issued' | 'failed' }): Promise<void>;
  updateBookingStatus(bookingId: string, status: string): Promise<void>;
  insertAuditLog(event: { action: string; status: 'success' | 'failed' | 'pending'; reason: string; metadata?: Record<string, unknown> }): Promise<void>;
}

export interface CancellationWorkflowRepository {
  transaction<T>(handler: (tx: CancellationWorkflowTransaction) => Promise<T>): Promise<T>;
}

export interface SubmitCancellationRequestInput {
  bookingId: string;
  userId: string;
  reason: string;
}

export interface AdminReviewCancellationInput {
  requestId: string;
  actorId: string;
  approve: boolean;
  refundMode: RefundMode;
  adminNote?: string;
  supplierCharges?: number;
  supplierProofUrl?: string;
  cancellationDate?: string;
  noShow?: boolean;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function addMonths(date: Date, months: number): string {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next.toISOString();
}

export async function submitCancellationRequest(
  repository: CancellationWorkflowRepository,
  input: SubmitCancellationRequestInput,
): Promise<CancellationRequestRecord> {
  return repository.transaction(async (tx) => {
    const booking = await tx.getBookingForUpdate(input.bookingId);
    if (!booking) throw new Error(`Booking ${input.bookingId} not found.`);
    if (booking.userId !== input.userId) throw new Error('Booking does not belong to this user.');
    if (['cancelled', 'refunded', 'closed'].includes(booking.status)) {
      throw new Error(`Booking ${input.bookingId} cannot be cancelled from status ${booking.status}.`);
    }

    const existing = await tx.getOpenRequestByBookingForUpdate(input.bookingId);
    if (existing && !['rejected', 'closed', 'refunded', 'credit_adjusted'].includes(existing.status)) {
      throw new Error(`An open cancellation request already exists for booking ${input.bookingId}.`);
    }

    const now = new Date().toISOString();
    const record: CancellationRequestRecord = {
      id: createId('CAN'),
      bookingId: booking.id,
      userId: booking.userId,
      travelerCount: booking.travelerCount,
      totalTourCost: booking.totalTourCost,
      departureDate: booking.departureDate,
      reason: input.reason,
      status: 'submitted',
      supplierCharges: 0,
      supplierProofUrls: [],
      refundStatus: 'not_started',
      creditAdjustmentStatus: 'not_started',
      createdAt: now,
      updatedAt: now,
    };

    await tx.createCancellationRequest(record);
    await tx.insertAuditLog({
      action: 'cancellation.request_submitted',
      status: 'success',
      reason: `Cancellation request submitted for booking ${input.bookingId}.`,
      metadata: { requestId: record.id, userId: input.userId, bookingId: input.bookingId },
    });
    return record;
  });
}

export async function adminReviewCancellationRequest(
  repository: CancellationWorkflowRepository,
  input: AdminReviewCancellationInput,
): Promise<CancellationRequestRecord> {
  return repository.transaction(async (tx) => {
    const request = await tx.getCancellationRequestForUpdate(input.requestId);
    if (!request) throw new Error(`Cancellation request ${input.requestId} not found.`);
    if (!['submitted', 'under_review'].includes(request.status)) {
      throw new Error(`Cancellation request ${input.requestId} cannot be reviewed from status ${request.status}.`);
    }

    const supplierCharges = Math.max(0, Math.round(input.supplierCharges || request.supplierCharges || 0));
    const calculation = calculateCancellationCharge({
      totalTourCost: request.totalTourCost,
      departureDate: request.departureDate,
      cancellationDate: input.cancellationDate || new Date(),
      travelerCount: request.travelerCount,
      trainFlightSupplierCharges: supplierCharges,
      noShow: input.noShow,
    });

    if (input.supplierProofUrl) {
      await tx.insertSupplierChargeUpload({
        requestId: request.id,
        amount: supplierCharges,
        proofUrl: input.supplierProofUrl,
        note: 'Supplier charge proof uploaded during cancellation review.',
        uploadedBy: input.actorId,
      });
    }

    const updated: CancellationRequestRecord = {
      ...request,
      status: input.approve ? (input.refundMode === 'credit_adjustment' ? 'credit_adjustment_pending' : 'refund_pending') : 'rejected',
      refundMode: input.approve ? input.refundMode : undefined,
      supplierCharges,
      supplierProofUrls: input.supplierProofUrl ? [...request.supplierProofUrls, input.supplierProofUrl] : request.supplierProofUrls,
      calculation,
      adminNote: input.adminNote,
      refundStatus: input.approve && input.refundMode === 'cash_refund' ? 'pending' : request.refundStatus,
      creditAdjustmentStatus: input.approve && input.refundMode === 'credit_adjustment' ? 'pending' : request.creditAdjustmentStatus,
      updatedAt: new Date().toISOString(),
    };

    await tx.updateCancellationRequest(updated);
    await tx.updateBookingStatus(request.bookingId, input.approve ? 'cancellation_approved' : 'confirmed');
    await tx.insertAuditLog({
      action: input.approve ? 'cancellation.approved' : 'cancellation.rejected',
      status: 'success',
      reason: input.approve ? 'Cancellation approved with refund/credit preview.' : 'Cancellation request rejected.',
      metadata: { actorId: input.actorId, requestId: request.id, bookingId: request.bookingId, calculation, refundMode: input.refundMode },
    });

    return updated;
  });
}

export async function processApprovedCancellationPayout(
  repository: CancellationWorkflowRepository,
  input: { requestId: string; actorId: string },
): Promise<CancellationRequestRecord> {
  return repository.transaction(async (tx) => {
    const request = await tx.getCancellationRequestForUpdate(input.requestId);
    if (!request) throw new Error(`Cancellation request ${input.requestId} not found.`);
    if (!request.calculation) throw new Error('Cancellation calculation is missing. Review the request before payout.');
    if (!['refund_pending', 'credit_adjustment_pending'].includes(request.status)) {
      throw new Error(`Cancellation request ${input.requestId} is not pending payout/credit adjustment.`);
    }

    const estimatedRefund = request.calculation.estimatedRefund;
    const now = new Date();
    let status: CancellationRequestStatus;
    let refundStatus = request.refundStatus;
    let creditAdjustmentStatus = request.creditAdjustmentStatus;

    if (request.refundMode === 'credit_adjustment') {
      await tx.createCreditAdjustment({
        requestId: request.id,
        bookingId: request.bookingId,
        userId: request.userId,
        amount: estimatedRefund,
        expiresAt: addMonths(now, 12),
        status: 'issued',
      });
      status = 'credit_adjusted';
      creditAdjustmentStatus = 'issued';
    } else {
      await tx.createRefundTransaction({
        requestId: request.id,
        bookingId: request.bookingId,
        userId: request.userId,
        amount: estimatedRefund,
        status: 'processing',
        mode: 'cash_refund',
      });
      status = 'refund_processing';
      refundStatus = 'processing';
    }

    const updated: CancellationRequestRecord = {
      ...request,
      status,
      refundStatus,
      creditAdjustmentStatus,
      updatedAt: now.toISOString(),
    };

    await tx.updateCancellationRequest(updated);
    await tx.updateBookingStatus(request.bookingId, status === 'refund_processing' ? 'refund_processing' : 'credit_adjusted');
    await tx.insertAuditLog({
      action: request.refundMode === 'credit_adjustment' ? 'cancellation.credit_adjustment_issued' : 'cancellation.refund_processing_created',
      status: 'success',
      reason: request.refundMode === 'credit_adjustment' ? 'Credit adjustment issued instead of cash refund.' : 'Refund transaction created and marked processing; final provider completion must update status later.',
      metadata: { actorId: input.actorId, requestId: request.id, bookingId: request.bookingId, amount: estimatedRefund, refundMode: request.refundMode },
    });

    return updated;
  });
}


export async function markCashRefundCompleted(
  repository: CancellationWorkflowRepository,
  input: { requestId: string; actorId: string; providerRef: string },
): Promise<CancellationRequestRecord> {
  return repository.transaction(async (tx) => {
    const request = await tx.getCancellationRequestForUpdate(input.requestId);
    if (!request) throw new Error(`Cancellation request ${input.requestId} not found.`);
    if (request.status !== 'refund_processing') {
      throw new Error(`Cancellation request ${input.requestId} is not refund_processing.`);
    }
    const updated: CancellationRequestRecord = {
      ...request,
      status: 'refunded',
      refundStatus: 'completed',
      updatedAt: new Date().toISOString(),
    };
    await tx.updateCancellationRequest(updated);
    await tx.updateBookingStatus(request.bookingId, 'refunded');
    await tx.insertAuditLog({
      action: 'cancellation.refund_completed',
      status: 'success',
      reason: 'Cash refund marked completed after provider confirmation.',
      metadata: { actorId: input.actorId, requestId: request.id, bookingId: request.bookingId, providerRef: input.providerRef },
    });
    return updated;
  });
}

export async function markCashRefundFailed(
  repository: CancellationWorkflowRepository,
  input: { requestId: string; actorId: string; providerRef?: string; failureReason: string },
): Promise<CancellationRequestRecord> {
  return repository.transaction(async (tx) => {
    const request = await tx.getCancellationRequestForUpdate(input.requestId);
    if (!request) throw new Error(`Cancellation request ${input.requestId} not found.`);
    if (request.status !== 'refund_processing') {
      throw new Error(`Cancellation request ${input.requestId} is not refund_processing.`);
    }
    const updated: CancellationRequestRecord = {
      ...request,
      status: 'refund_failed',
      refundStatus: 'failed',
      updatedAt: new Date().toISOString(),
    };
    await tx.updateCancellationRequest(updated);
    await tx.updateBookingStatus(request.bookingId, 'refund_failed');
    await tx.insertAuditLog({
      action: 'cancellation.refund_failed',
      status: 'failed',
      reason: input.failureReason,
      metadata: { actorId: input.actorId, requestId: request.id, bookingId: request.bookingId, providerRef: input.providerRef },
    });
    return updated;
  });
}
