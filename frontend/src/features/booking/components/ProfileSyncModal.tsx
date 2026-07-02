import { User } from 'lucide-react';

type ProfileSyncModalProps = {
  open: boolean;
  onConfirm: () => void;
  onSkip: () => void;
};

export function ProfileSyncModal({ open, onConfirm, onSkip }: ProfileSyncModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[24px] p-6 max-w-sm w-full border border-slate-200/85 shadow-2xl text-left space-y-4 animate-fadeIn text-slate-800">
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-amber-500 shrink-0" />
          <h4 className="font-bold text-base text-slate-900">Update Profile Details?</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The lead traveler name or email you entered differs from your account details. Would you like to sync these changes to your traveler profile?
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onConfirm}
            className="flex-grow py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
          >
            Yes, Update &amp; Pay
          </button>
          <button
            onClick={onSkip}
            className="flex-grow py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl cursor-pointer"
          >
            No, Pay Only
          </button>
        </div>
      </div>
    </div>
  );
}
