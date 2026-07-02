import type {
  CancellationRequestInput,
  CancellationRequestResponse,
  CancellationAdminSummary,
  CancellationPayoutResponse,
  CancellationReviewResponse,
  CreditIssuanceResponse,
  CustomTourCreateInput,
  CustomTourListResponse,
  CustomTourUpdateInput,
  CreateTourBookingDraftInput,
  CreatePaymentOrderInput,
  CustomerDashboardResponse,
  LedgerResponse,
  PaymentOrderResponse,
  PaymentStatusResponse,
  ParticipationResponse,
  PublicWinnerSummary,
  RevealedWinnerResponse,
  WeeklyDrawStatusResponse,
  TourBookingDraftResponse,
  ReviewCancellationInput,
} from './backendContracts';
import type { CustomTourRequest } from '@/types';

export interface BeduineBackendAdapter {
  createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse>;
  getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse>;
  createTourBookingDraft(input: CreateTourBookingDraftInput): Promise<TourBookingDraftResponse>;
  createCustomTourRequest(input: CustomTourCreateInput): Promise<CustomTourRequest>;
  listCustomTourRequests(): Promise<CustomTourListResponse>;
  updateCustomTourRequest(input: CustomTourUpdateInput): Promise<CustomTourRequest>;
  participateInWeeklyDraw(): Promise<ParticipationResponse>;
  issueNonWinnerCredits(cycleId: string): Promise<CreditIssuanceResponse>;
  listPublicWinners(): Promise<PublicWinnerSummary[]>;
  getCustomerDashboard(): Promise<CustomerDashboardResponse>;
  getTrcAndDiscountLedger(userId: string): Promise<LedgerResponse>;
  getWeeklyDrawStatus(): Promise<WeeklyDrawStatusResponse>;
  revealNextWinner(cycleId: string): Promise<RevealedWinnerResponse>;
  requestCancellation(input: CancellationRequestInput): Promise<CancellationRequestResponse>;
  listCancellationRequests(): Promise<CancellationAdminSummary[]>;
  reviewCancellation(input: ReviewCancellationInput): Promise<CancellationReviewResponse>;
  processCancellationPayout(requestId: string): Promise<CancellationPayoutResponse>;
}

export class BackendNotConnectedError extends Error {
  constructor(method: string) {
    super(`Beduine backend is not connected yet. Cannot call ${method}.`);
    this.name = 'BackendNotConnectedError';
  }
}

export function createProductionBackendAdapter(): BeduineBackendAdapter {
  return {
    async createPaymentOrder() {
      throw new BackendNotConnectedError('createPaymentOrder');
    },
    async getPaymentStatus() {
      throw new BackendNotConnectedError('getPaymentStatus');
    },
    async createTourBookingDraft() {
      throw new BackendNotConnectedError('createTourBookingDraft');
    },
    async createCustomTourRequest() {
      throw new BackendNotConnectedError('createCustomTourRequest');
    },
    async listCustomTourRequests() {
      throw new BackendNotConnectedError('listCustomTourRequests');
    },
    async updateCustomTourRequest() {
      throw new BackendNotConnectedError('updateCustomTourRequest');
    },
    async participateInWeeklyDraw() {
      throw new BackendNotConnectedError('participateInWeeklyDraw');
    },
    async issueNonWinnerCredits() {
      throw new BackendNotConnectedError('issueNonWinnerCredits');
    },
    async listPublicWinners() {
      throw new BackendNotConnectedError('listPublicWinners');
    },
    async getCustomerDashboard() {
      throw new BackendNotConnectedError('getCustomerDashboard');
    },
    async getTrcAndDiscountLedger() {
      throw new BackendNotConnectedError('getTrcAndDiscountLedger');
    },
    async getWeeklyDrawStatus() {
      throw new BackendNotConnectedError('getWeeklyDrawStatus');
    },
    async revealNextWinner() {
      throw new BackendNotConnectedError('revealNextWinner');
    },
    async requestCancellation() {
      throw new BackendNotConnectedError('requestCancellation');
    },
    async listCancellationRequests() {
      throw new BackendNotConnectedError('listCancellationRequests');
    },
    async reviewCancellation() {
      throw new BackendNotConnectedError('reviewCancellation');
    },
    async processCancellationPayout() {
      throw new BackendNotConnectedError('processCancellationPayout');
    },
  };
}
