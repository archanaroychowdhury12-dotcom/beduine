import { describe, expect, it } from 'vitest';
import { calculateCancellationCharge } from '../business_logic/booking/cancellationCalculator';
import {
  adminReviewCancellationRequest,
  type CancellationRequestRecord,
  type CancellationWorkflowRepository,
  type CancellationWorkflowTransaction,
  markCashRefundCompleted,
  processApprovedCancellationPayout,
  submitCancellationRequest,
} from '../business_logic/cancellations/cancellationWorkflow.service';

class InMemoryCancellationRepo implements CancellationWorkflowRepository, CancellationWorkflowTransaction {
  bookings = new Map<string, { id: string; userId: string; totalTourCost: number; departureDate: string; travelerCount: number; status: string }>();
  requests = new Map<string, CancellationRequestRecord>();
  audits: unknown[] = [];
  refunds: unknown[] = [];
  credits: unknown[] = [];
  supplierUploads: unknown[] = [];

  async transaction<T>(handler: (tx: CancellationWorkflowTransaction) => Promise<T>): Promise<T> { return handler(this); }
  async getBookingForUpdate(bookingId: string) { return this.bookings.get(bookingId) || null; }
  async getCancellationRequestForUpdate(requestId: string) { return this.requests.get(requestId) || null; }
  async getOpenRequestByBookingForUpdate(bookingId: string) {
    return [...this.requests.values()].find((request) => request.bookingId === bookingId && !['rejected', 'closed', 'refunded', 'credit_adjusted'].includes(request.status)) || null;
  }
  async createCancellationRequest(record: CancellationRequestRecord) { this.requests.set(record.id, record); }
  async updateCancellationRequest(record: CancellationRequestRecord) { this.requests.set(record.id, record); }
  async insertSupplierChargeUpload(input: unknown) { this.supplierUploads.push(input); }
  async createRefundTransaction(input: unknown) { this.refunds.push(input); }
  async createCreditAdjustment(input: unknown) { this.credits.push(input); }
  async updateBookingStatus(bookingId: string, status: string) { const booking = this.bookings.get(bookingId)!; this.bookings.set(bookingId, { ...booking, status }); }
  async insertAuditLog(event: unknown) { this.audits.push(event); }
}

describe('cancellation/refund workflow', () => {
  it('calculates policy slabs', () => {
    expect(calculateCancellationCharge({ totalTourCost: 10000, travelerCount: 2, departureDate: '2026-08-31', cancellationDate: '2026-07-15' })).toMatchObject({
      policyBand: '30_plus_days',
      serviceCharge: 1000,
      estimatedRefund: 9000,
    });
    expect(calculateCancellationCharge({ totalTourCost: 10000, travelerCount: 1, departureDate: '2026-08-31', cancellationDate: '2026-08-10' }).cancellationFeePercent).toBe(25);
    expect(calculateCancellationCharge({ totalTourCost: 10000, travelerCount: 1, departureDate: '2026-08-31', cancellationDate: '2026-08-20' }).cancellationFeePercent).toBe(50);
    expect(calculateCancellationCharge({ totalTourCost: 10000, travelerCount: 1, departureDate: '2026-08-31', cancellationDate: '2026-08-29' }).cancellationFeePercent).toBe(100);
  });

  it('supports request, admin approval/rejection, supplier charges, refund preview, credit adjustment, and audit', async () => {
    const repo = new InMemoryCancellationRepo();
    repo.bookings.set('BKG-1', {
      id: 'BKG-1',
      userId: 'USER-1',
      totalTourCost: 20000,
      departureDate: '2026-08-31',
      travelerCount: 2,
      status: 'confirmed',
    });

    const request = await submitCancellationRequest(repo, { bookingId: 'BKG-1', userId: 'USER-1', reason: 'Plan changed' });
    expect(request.status).toBe('submitted');
    await expect(submitCancellationRequest(repo, { bookingId: 'BKG-1', userId: 'USER-1', reason: 'Duplicate' }))
      .rejects.toThrow(/open cancellation request/i);

    const reviewed = await adminReviewCancellationRequest(repo, {
      requestId: request.id,
      actorId: 'admin-1',
      approve: true,
      refundMode: 'credit_adjustment',
      supplierCharges: 1200,
      supplierProofUrl: 'https://proof.example/file.pdf',
      cancellationDate: '2026-07-15',
    });

    expect(reviewed.status).toBe('credit_adjustment_pending');
    expect(reviewed.calculation?.estimatedRefund).toBe(17800);
    expect(repo.supplierUploads).toHaveLength(1);

    const processed = await processApprovedCancellationPayout(repo, { requestId: request.id, actorId: 'admin-1' });
    expect(processed.status).toBe('credit_adjusted');
    expect(repo.credits).toHaveLength(1);
    expect(repo.audits.length).toBeGreaterThanOrEqual(3);
  });

  it('keeps cash refunds in processing until provider completion confirms final refund', async () => {
    const repo = new InMemoryCancellationRepo();
    repo.bookings.set('BKG-CASH', {
      id: 'BKG-CASH',
      userId: 'USER-2',
      totalTourCost: 10000,
      departureDate: '2026-08-31',
      travelerCount: 1,
      status: 'confirmed',
    });

    const request = await submitCancellationRequest(repo, { bookingId: 'BKG-CASH', userId: 'USER-2', reason: 'Emergency' });
    await adminReviewCancellationRequest(repo, {
      requestId: request.id,
      actorId: 'admin-1',
      approve: true,
      refundMode: 'cash_refund',
      cancellationDate: '2026-07-15',
    });

    const processing = await processApprovedCancellationPayout(repo, { requestId: request.id, actorId: 'admin-1' });
    expect(processing.status).toBe('refund_processing');
    expect(processing.refundStatus).toBe('processing');
    expect(repo.refunds).toHaveLength(1);

    const completed = await markCashRefundCompleted(repo, { requestId: request.id, actorId: 'admin-1', providerRef: 'RFND-1' });
    expect(completed.status).toBe('refunded');
    expect(completed.refundStatus).toBe('completed');
  });

});
