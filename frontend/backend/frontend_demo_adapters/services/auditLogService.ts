import { UserRole, getUserRole } from './accessControl';

export type AuditAction =
  | 'ADMIN_ADD_DEMO_BALANCE'
  | 'ADMIN_DEDUCT_DEMO_BALANCE'
  | 'ADMIN_RESET_USER'
  | 'ADMIN_RESET_ALL_ACCOUNTS'
  | 'ADMIN_CREATE_AGENT'
  | 'ADMIN_TOGGLE_AGENT_EARNING_MODEL'
  | 'ADMIN_UPDATE_AGENT_TARGET'
  | 'ADMIN_RELEASE_AGENT_PAYOUT'
  | 'PAYMENT_CHECKOUT_CREATED'
  | 'PAYMENT_WEBHOOK_VERIFIED'
  | 'PAYMENT_WEBHOOK_REJECTED'
  | 'SUBSCRIPTION_ACTIVATED'
  | 'SUBSCRIPTION_PAYMENT_FAILED'
  | 'SUBSCRIPTION_PAYMENT_REFUNDED'
  | 'SUBSCRIPTION_CHARGEBACK_RECORDED'
  | 'WINNER_CANCELLED'
  | 'DRAW_CANCELLED'
  | 'NON_WINNER_DISCOUNT_CREDITS_ISSUED';

export type AuditActor = {
  id?: string;
  email?: string | null;
  role?: UserRole;
  user_metadata?: {
    role?: UserRole;
    [key: string]: unknown;
  };
};

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  actorId: string;
  actorEmail: string;
  actorRole: UserRole;
  targetId?: string;
  targetEmail?: string | null;
  amount?: number;
  status: 'success' | 'failed' | 'pending';
  reason: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  environment: 'demo' | 'production';
}

const AUDIT_LOG_KEY = 'beduine_admin_audit_logs_v1';
const memoryAuditStore: { logs: AuditLogEntry[] } = { logs: [] };

function hasBrowserStorage() {
  return typeof localStorage !== 'undefined';
}

function dispatchAuditEvent(entry?: AuditLogEntry) {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('beduineAuditLogChanged', { detail: entry }));
  }
}


function getEnvironment(): 'demo' | 'production' {
  return import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true' ? 'demo' : 'production';
}

function makeAuditId() {
  return `AUD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const auditLogService = {
  list(): AuditLogEntry[] {
    try {
      if (!hasBrowserStorage()) return memoryAuditStore.logs;
      const raw = localStorage.getItem(AUDIT_LOG_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return memoryAuditStore.logs;
    }
  },

  write(entry: Omit<AuditLogEntry, 'id' | 'created_at' | 'environment'>): AuditLogEntry {
    const next: AuditLogEntry = {
      ...entry,
      id: makeAuditId(),
      created_at: new Date().toISOString(),
      environment: getEnvironment(),
    };

    const logs = [next, ...this.list()].slice(0, 500);
    memoryAuditStore.logs = logs;
    if (hasBrowserStorage()) {
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
    }
    dispatchAuditEvent(next);
    return next;
  },

  logAdminAction(params: {
    action: AuditAction;
    actor?: AuditActor | null;
    targetId?: string;
    targetEmail?: string | null;
    amount?: number;
    status?: 'success' | 'failed' | 'pending';
    reason: string;
    metadata?: Record<string, unknown>;
  }): AuditLogEntry {
    return this.write({
      action: params.action,
      actorId: params.actor?.id || 'unknown-actor',
      actorEmail: params.actor?.email || 'unknown@beduine.local',
      actorRole: getUserRole(params.actor),
      targetId: params.targetId,
      targetEmail: params.targetEmail,
      amount: params.amount,
      status: params.status || 'success',
      reason: params.reason,
      metadata: params.metadata,
    });
  },

  clear() {
    memoryAuditStore.logs = [];
    if (hasBrowserStorage()) {
      localStorage.removeItem(AUDIT_LOG_KEY);
    }
    dispatchAuditEvent();
  },
};
