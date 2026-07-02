import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CancellationAdminPage } from '@/features/admin/components/CancellationAdminPage';
import type {
  CancellationAdminSummary,
  CancellationReviewResponse,
} from '@/services/backend';

describe('CancellationAdminPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('shows the server refund preview before approval', async () => {
    const request: CancellationAdminSummary = {
      requestId: 'CAN-1',
      bookingId: 'BDU-BKG-1001',
      userId: 'user-1',
      userEmail: 'rahul@example.com',
      status: 'admin_review',
      reason: 'Medical emergency',
      refundPreference: 'cash_refund',
      totalTourCost: 20_000,
      amountPaid: 20_000,
      travelerCount: 2,
      departureDate: '2026-08-31T08:00:00.000Z',
      supplierCharges: 0,
      requestedAt: '2026-07-02T10:00:00.000Z',
    };
    const reviewed: CancellationReviewResponse = {
      ...request,
      status: 'approved',
      refundMode: 'cash_refund',
      supplierCharges: 500,
      estimatedRefund: 14_500,
      calculation: {
        daysBeforeDeparture: 20,
        cancellationFeePercent: 25,
        landPackageCancellationCharge: 5_000,
        serviceCharge: 0,
        supplierCharges: 500,
        totalDeduction: 5_500,
        estimatedRefund: 14_500,
        policyBand: '15_to_29_days',
      },
    };
    const api = {
      listCancellationRequests: vi.fn().mockResolvedValue([request]),
      reviewCancellation: vi.fn().mockResolvedValue(reviewed),
      processCancellationPayout: vi.fn(),
    };

    await act(async () => {
      root.render(
        <CancellationAdminPage
          api={api}
          requests={[request]}
        />,
      );
    });

    const reviewButton = [...container.querySelectorAll('button')]
      .find((button) => button.textContent?.includes('Review'));
    expect(reviewButton).toBeDefined();

    await act(async () => {
      reviewButton?.click();
    });

    expect(api.reviewCancellation).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: 'CAN-1' }),
    );
    expect(container.textContent).toContain('INR 14,500');
  });
});
