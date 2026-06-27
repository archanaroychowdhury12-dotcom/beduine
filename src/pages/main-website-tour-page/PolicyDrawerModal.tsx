import React from 'react';
import { X } from 'lucide-react';

interface PolicyDrawerModalProps {
  activePolicy: { title: string; content: string } | null;
  onClose: () => void;
}

export const PolicyDrawerModal: React.FC<PolicyDrawerModalProps> = ({ activePolicy, onClose }) => {
  if (!activePolicy) return null;
  return (
    <div className="fixed inset-0 z-[170] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[24px] p-6 max-w-md w-full border border-slate-200/85 shadow-2xl text-left space-y-4 animate-fadeIn text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-base text-slate-900">{activePolicy.title}</h4>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer bg-transparent border-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-650 leading-relaxed">{activePolicy.content}</p>
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl cursor-pointer border-none"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};
