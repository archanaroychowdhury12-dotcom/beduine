// UI Stub for Audit Log Service
import { UserRole } from './accessControl';

export type AuditAction = string;
export type AuditActor = any;
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

export const auditLogService = {
  list(): AuditLogEntry[] {
    return [];
  },

  write(entry: any): AuditLogEntry {
    return {
      ...entry,
      id: `AUD-${Date.now()}`,
      created_at: new Date().toISOString(),
      environment: 'demo',
    };
  },

  logAdminAction(params: any): AuditLogEntry {
    return this.write(params);
  },

  clear() {}
};
