import { AlertTriangle, RefreshCw, X } from 'lucide-react';

type ErrorBannerProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
};

export function ErrorBanner({ title = 'Something went wrong', message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900 shadow-sm" role="alert">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-rose-800/90">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          )}
        </div>
        {onDismiss && (
          <button type="button" onClick={onDismiss} aria-label="Dismiss error" className="rounded-full p-1 text-rose-600 hover:bg-rose-100">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
