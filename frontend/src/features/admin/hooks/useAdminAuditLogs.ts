import { useEffect, useState } from 'react';
import { auditLogService, AuditLogEntry } from '@/services/auditLogService';
import { beduineBackend, type BeduineBackendAdapter } from '@/services/backend';

export function useAdminAuditLogs(
  backend: Pick<BeduineBackendAdapter, 'listAuditLogs'> = beduineBackend,
  mode: 'demo' | 'production' = import.meta.env.VITE_BACKEND_MODE === 'production' ? 'production' : 'demo',
) {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => (
    mode === 'production' ? [] : auditLogService.list()
  ));

  useEffect(() => {
    if (mode === 'production') {
      void backend.listAuditLogs().then((page) => setAuditLogs(page.logs));
      return;
    }
    const syncAuditLogs = () => setAuditLogs(auditLogService.list());
    window.addEventListener('beduineAuditLogChanged', syncAuditLogs as EventListener);
    return () => window.removeEventListener('beduineAuditLogChanged', syncAuditLogs as EventListener);
  }, [backend, mode]);

  return { auditLogs };
}
