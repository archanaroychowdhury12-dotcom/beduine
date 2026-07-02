export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastMessage = {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  createdAt: number;
  actionLabel?: string;
  onAction?: () => void;
};

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type ConfirmRequest = Required<Omit<ConfirmOptions, 'danger'>> & {
  id: string;
  danger: boolean;
  resolve: (confirmed: boolean) => void;
};

type FeedbackState = {
  toasts: ToastMessage[];
  confirmRequest: ConfirmRequest | null;
};

let state: FeedbackState = {
  toasts: [],
  confirmRequest: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: FeedbackState) {
  state = next;
  emit();
}

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function subscribeFeedback(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFeedbackSnapshot() {
  return state;
}

export function dismissToast(toastId: string) {
  setState({
    ...state,
    toasts: state.toasts.filter((toast) => toast.id !== toastId),
  });
}

function pushToast(variant: ToastVariant, message: string, title?: string, options?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) {
  const toast: ToastMessage = {
    id: id('toast'),
    variant,
    title,
    message,
    createdAt: Date.now(),
    actionLabel: options?.actionLabel,
    onAction: options?.onAction,
  };

  setState({
    ...state,
    toasts: [toast, ...state.toasts].slice(0, 5),
  });

  const timeoutMs = options?.timeoutMs ?? 4500;
  if (timeoutMs > 0) {
    window.setTimeout(() => dismissToast(toast.id), timeoutMs);
  }

  return toast.id;
}

export const notify = {
  success: (message: string, title = 'Success', options?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) => pushToast('success', message, title, options),
  error: (message: string, title = 'Action needed', options?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) => pushToast('error', message, title, options),
  warning: (message: string, title = 'Please check', options?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) => pushToast('warning', message, title, options),
  info: (message: string, title = 'Notice', options?: { actionLabel?: string; onAction?: () => void; timeoutMs?: number }) => pushToast('info', message, title, options),
};

export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const request: ConfirmRequest = {
      id: id('confirm'),
      title: options.title ?? 'Confirm action',
      message: options.message,
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
      danger: options.danger ?? false,
      resolve,
    };

    setState({
      ...state,
      confirmRequest: request,
    });
  });
}

export function resolveConfirm(confirmed: boolean) {
  const request = state.confirmRequest;
  if (!request) return;
  request.resolve(confirmed);
  setState({
    ...state,
    confirmRequest: null,
  });
}
