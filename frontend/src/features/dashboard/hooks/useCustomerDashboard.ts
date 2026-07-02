import { useCallback, useEffect, useState } from 'react';
import { beduineBackend, type CustomerDashboardResponse } from '@/services/backend';

export interface CustomerDashboardState {
  loading: boolean;
  data?: CustomerDashboardResponse;
  error?: Error;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Failed to load customer dashboard.');
}

export function useCustomerDashboard(enabled: boolean) {
  const [state, setState] = useState<CustomerDashboardState>({ loading: enabled });

  const refresh = useCallback(async () => {
    if (!enabled) {
      setState({ loading: false });
      return;
    }

    setState((current) => ({ ...current, loading: true, error: undefined }));
    try {
      const data = await beduineBackend.getCustomerDashboard();
      setState({ loading: false, data });
    } catch (error) {
      setState({ loading: false, error: toError(error) });
    }
  }, [enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
