import React, { useState } from 'react';
import { ShieldCheck, Loader, AlertCircle } from 'lucide-react';

export function PrivacyRequestForm() {
  const [form, setForm] = useState({
    fullName: '',
    identity: '',
    requestType: 'access',
    verificationDetails: '',
    description: '',
    declaration: false
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!form.fullName.trim() || !form.identity.trim() || !form.description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    if (!form.declaration) {
      setErrorMessage('You must confirm the accuracy of your identity.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // API Placeholder integration
      // await fetch('/api/legal/privacy-request', { method: 'POST', body: JSON.stringify(form) });
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setForm({
        fullName: '',
        identity: '',
        requestType: 'access',
        verificationDetails: '',
        description: '',
        declaration: false
      });
    } catch (err) {
      setErrorMessage('An unexpected system error occurred. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl relative overflow-hidden text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-white">Data Privacy Rights Request</h3>
          <p className="text-xs text-slate-400 font-mono">Exercise your access, correction, or deletion rights</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center animate-fadeIn">
          <h4 className="font-bold font-display text-base mb-2">Request Submitted Successfully</h4>
          <p className="text-xs font-mono leading-relaxed">
            Your request has been logged. Our privacy compliance team will acknowledge your ticket and request verification documentation within 48 hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all cursor-pointer border-none"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="As per Government ID"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Registered Email or Mobile *</label>
              <input
                type="text"
                name="identity"
                value={form.identity}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="Email or 10-digit mobile number"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Request Type *</label>
              <select
                name="requestType"
                value={form.requestType}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="access">Access Request (Request Data Copy)</option>
                <option value="correction">Correction Request (Update Details)</option>
                <option value="deletion">Deletion Request (Forget Me)</option>
                <option value="withdrawal">Consent Withdrawal</option>
                <option value="optout">Marketing Opt-Out</option>
                <option value="complaint">Privacy Complaint</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Identity Verification Details</label>
              <input
                type="text"
                name="verificationDetails"
                value={form.verificationDetails}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="e.g. Account membership ID, recent booking number"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Description of Request *</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500 resize-none"
              placeholder="Provide exact details of the data you want to retrieve, correct, or delete."
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="declaration"
              checked={form.declaration}
              onChange={handleCheckbox}
              disabled={status === 'loading'}
              className="mt-0.5 rounded text-cyan border-white/20 bg-slate-900 focus:ring-cyan"
            />
            <span className="text-[11px] leading-relaxed text-slate-400 font-mono">
              I declare that I am the authorized owner of this account, and the information provided is correct. I understand that supplementary verification checks will be completed before compliance.
            </span>
          </label>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-xl bg-cyan text-slate-950 font-bold font-display text-sm hover:bg-cyan/90 transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg shadow-cyan-950/10"
          >
            {status === 'loading' ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Submit Request</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
