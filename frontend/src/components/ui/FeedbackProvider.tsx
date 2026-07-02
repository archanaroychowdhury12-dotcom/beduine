import { ReactNode, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import {
  dismissToast,
  getFeedbackSnapshot,
  resolveConfirm,
  subscribeFeedback,
} from '@/services/uiFeedback';

const variantClasses = {
  success: 'border-emerald-400/40 bg-emerald-950/90 text-emerald-50',
  error: 'border-rose-400/40 bg-rose-950/90 text-rose-50',
  warning: 'border-amber-400/40 bg-amber-950/90 text-amber-50',
  info: 'border-cyan-400/40 bg-slate-950/90 text-cyan-50',
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const feedback = useSyncExternalStore(subscribeFeedback, getFeedbackSnapshot, getFeedbackSnapshot);
  const confirmRequest = feedback.confirmRequest;

  return (
    <>
      {children}

      <div className="fixed right-4 top-16 z-[9999] flex w-[min(92vw,24rem)] flex-col gap-3 pointer-events-none">
        {feedback.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${variantClasses[toast.variant]}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                {toast.title && <p className="text-sm font-black tracking-wide">{toast.title}</p>}
                <p className="mt-1 text-sm leading-relaxed opacity-90 whitespace-pre-line">{toast.message}</p>
                {toast.actionLabel && toast.onAction && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.onAction?.();
                      dismissToast(toast.id);
                    }}
                    className="mt-3 rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-white/90 hover:bg-white/10"
                  >
                    {toast.actionLabel}
                  </button>
                )}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissToast(toast.id)}
                className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmRequest && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 p-6 text-white shadow-2xl">
            <p className="text-lg font-black">{confirmRequest.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 whitespace-pre-line">{confirmRequest.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => resolveConfirm(false)}
                className="rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"
              >
                {confirmRequest.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => resolveConfirm(true)}
                className={`rounded-full px-5 py-2 text-sm font-black text-white shadow-lg ${confirmRequest.danger ? 'bg-rose-600 hover:bg-rose-500' : 'bg-cyan-600 hover:bg-cyan-500'}`}
              >
                {confirmRequest.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
