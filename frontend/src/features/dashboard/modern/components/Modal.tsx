import { X } from "lucide-react";
import { cn } from "../utils/cn";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({ open, title, children, onClose, footer, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/42 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close modal" />
      <section className={cn("travel-card relative z-10 w-full max-w-lg animate-fade-in-scale overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/20", className)}>
        <header className="flex items-center justify-between border-b border-border/80 bg-gradient-to-r from-white to-secondary-light/40 px-5 py-4">
          <h3 className="text-base font-black text-text-primary">{title}</h3>
          <button onClick={onClose} className="rounded-2xl p-2 text-text-secondary transition hover:bg-white hover:text-text-primary" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 text-sm font-medium text-text-secondary">{children}</div>
        {footer && <footer className="flex flex-col-reverse gap-2 border-t border-border/80 bg-sky-50/70 px-5 py-4 sm:flex-row sm:justify-end">{footer}</footer>}
      </section>
    </div>
  );
}
