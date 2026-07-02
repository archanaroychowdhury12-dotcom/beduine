import type { CustomTourQuotation, CustomTourRequest } from '../types';
import { beduineBackend } from './backend';
import type { BeduineBackendAdapter } from './backend/backendAdapter';
import type {
  CustomTourCreateInput as BackendCustomTourCreateInput,
  CustomTourUpdateInput,
} from './backend/backendContracts';

export type CustomTourCreateInput = BackendCustomTourCreateInput;

export type ProductionCustomTourAdapter = Pick<
  BeduineBackendAdapter,
  'createCustomTourRequest' | 'listCustomTourRequests' | 'updateCustomTourRequest'
>;

type CustomTourQuotationInput = Omit<
  CustomTourQuotation,
  | 'id'
  | 'requestId'
  | 'version'
  | 'currency'
  | 'validUntil'
  | 'createdAt'
  | 'status'
  | 'paymentTerms'
  | 'cancellationPolicy'
> & Partial<Pick<CustomTourQuotation, 'paymentTerms' | 'cancellationPolicy'>>;

export interface CustomTourService {
  createRequest(
    data: CustomTourCreateInput & { userId?: string; userName?: string },
  ): Promise<CustomTourRequest>;
  listRequests(userId?: string): Promise<CustomTourRequest[]>;
  getRequestById(id: string): Promise<CustomTourRequest | null>;
  addQuotation(requestId: string, quote: CustomTourQuotationInput): Promise<CustomTourRequest>;
  addRevision(requestId: string, message: string): Promise<CustomTourRequest>;
  acceptQuotation(requestId: string): Promise<CustomTourRequest>;
  moveToPaymentPending(requestId: string): Promise<CustomTourRequest>;
  confirmMockPayment(requestId: string): Promise<CustomTourRequest>;
  cancelRequest(requestId: string): Promise<CustomTourRequest>;
}

function createProductionCustomTourService(
  adapter: ProductionCustomTourAdapter,
): CustomTourService {
  const update = (input: CustomTourUpdateInput) => adapter.updateCustomTourRequest(input);
  return {
    async createRequest(data) {
      const { userId: _userId, userName: _userName, ...request } = data;
      return adapter.createCustomTourRequest(request);
    },
    async listRequests() {
      return (await adapter.listCustomTourRequests()).requests;
    },
    async getRequestById(id) {
      return (await this.listRequests()).find((request) => request.id === id) ?? null;
    },
    async addQuotation(requestId, quotation) {
      return update({ requestId, action: 'admin_quote', quotation });
    },
    async addRevision(requestId, message) {
      return update({ requestId, action: 'request_revision', message });
    },
    async acceptQuotation(requestId) {
      return update({ requestId, action: 'accept_quotation' });
    },
    async moveToPaymentPending(requestId) {
      return update({ requestId, action: 'begin_payment' });
    },
    async confirmMockPayment() {
      throw new Error('DEMO_PAYMENT_DISABLED');
    },
    async cancelRequest(requestId) {
      return update({ requestId, action: 'cancel' });
    },
  };
}

function createLazyDemoCustomTourService(): CustomTourService {
  let servicePromise: Promise<CustomTourService> | undefined;
  const load = () => {
    servicePromise ??= import('./customTourDemoService')
      .then((module) => module.demoCustomTourService);
    return servicePromise;
  };
  return {
    async createRequest(data) { return (await load()).createRequest(data); },
    async listRequests(userId) { return (await load()).listRequests(userId); },
    async getRequestById(id) { return (await load()).getRequestById(id); },
    async addQuotation(requestId, quote) { return (await load()).addQuotation(requestId, quote); },
    async addRevision(requestId, message) { return (await load()).addRevision(requestId, message); },
    async acceptQuotation(requestId) { return (await load()).acceptQuotation(requestId); },
    async moveToPaymentPending(requestId) { return (await load()).moveToPaymentPending(requestId); },
    async confirmMockPayment(requestId) { return (await load()).confirmMockPayment(requestId); },
    async cancelRequest(requestId) { return (await load()).cancelRequest(requestId); },
  };
}

export function createCustomTourService(
  mode: 'demo' | 'production',
  adapter: ProductionCustomTourAdapter = beduineBackend,
): CustomTourService {
  return mode === 'production'
    ? createProductionCustomTourService(adapter)
    : createLazyDemoCustomTourService();
}

export const customTourService = createCustomTourService(
  import.meta.env.VITE_BACKEND_MODE === 'production' ? 'production' : 'demo',
);
