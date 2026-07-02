import type {
  CancellationRequestInput,
  CancellationRequestResponse,
  CreatePaymentOrderInput,
  CustomerDashboardResponse,
  LedgerResponse,
  PaymentOrderResponse,
  RevealedWinnerResponse,
  WeeklyDrawStatusResponse,
} from './backendContracts';

export interface BeduineBackendAdapter {
  createPaymentOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResponse>;
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
