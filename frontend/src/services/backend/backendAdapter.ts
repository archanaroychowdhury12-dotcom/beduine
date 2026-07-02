import type {
  CancellationRequestInput,
  CancellationRequestResponse,
  CreditIssuanceResponse,
  CreatePaymentOrderInput,
  CustomerDashboardResponse,
  LedgerResponse,
  PaymentOrderResponse,
  PaymentStatusResponse,
  ParticipationResponse,
  PublicWinnerSummary,
  RevealedWinnerResponse,
  WeeklyDrawStatusResponse,
} from './backendContracts';

export interface BeduineBackendAdapter {
  createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse>;
  getPaymentStatus(sessionId: string): Promise<PaymentStatusResponse>;
  participateInWeeklyDraw(): Promise<ParticipationResponse>;
  issueNonWinnerCredits(cycleId: string): Promise<CreditIssuanceResponse>;
  listPublicWinners(): Promise<PublicWinnerSummary[]>;
  getCustomerDashboard(): Promise<CustomerDashboardResponse>;
  getTrcAndDiscountLedger(userId: string): Promise<LedgerResponse>;
  getWeeklyDrawStatus(): Promise<WeeklyDrawStatusResponse>;
  revealNextWinner(cycleId: string): Promise<RevealedWinnerResponse>;
  requestCancellation(input: CancellationRequestInput): Promise<CancellationRequestResponse>;
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
  };
}
