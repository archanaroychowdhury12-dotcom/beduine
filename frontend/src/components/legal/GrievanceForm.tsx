import React, { useState } from 'react';
import { HelpCircle, Loader, AlertCircle } from 'lucide-react';

export function GrievanceForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    membershipId: '',
    bookingId: '',
    category: 'payment',
    description: '',
    documentDetails: '',
    responseChannel: 'email',
    consent: false
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

    if (!form.fullName.trim() || !form.email.trim() || !form.mobile.trim() || !form.description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    if (!form.consent) {
      setErrorMessage('You must consent to the processing of your grievance.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // API integration placeholder
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('success');
      setForm({
        fullName: '',
        email: '',
        mobile: '',
        membershipId: '',
        bookingId: '',
        category: 'payment',
        description: '',
        documentDetails: '',
        responseChannel: 'email',
        consent: false
      });
    } catch (err) {
      setErrorMessage('Error submitting grievance. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl relative overflow-hidden text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-white">Submit Formal Grievance</h3>
          <p className="text-xs text-slate-400 font-mono">Lodge an official complaint with the Grievance Officer</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center animate-fadeIn">
          <h4 className="font-bold font-display text-base mb-2">Grievance Registered</h4>
          <p className="text-xs font-mono leading-relaxed">
            Your grievance has been successfully submitted to the Grievance Officer. A ticket ID has been generated, and we will contact you within 48 hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all cursor-pointer border-none"
          >
            Submit Another Complaint
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

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="Applicant name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Registered Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Membership ID</label>
              <input
                type="text"
                name="membershipId"
                value={form.membershipId}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="e.g. MEM-8821"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Booking ID</label>
              <input
                type="text"
                name="bookingId"
                value={form.bookingId}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="e.g. BK-2093"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Grievance Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="payment">Payment Discrepancies</option>
                <option value="membership">Membership Benefits Abuse / Issues</option>
                <option value="booking">Travel Booking Operations</option>
                <option value="affiliate">Affiliate Agent Misrepresentation</option>
                <option value="privacy">Privacy / Data Breach Concerns</option>
                <option value="technical">Website / System Access Failure</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Preferred Response Channel</label>
              <select
                name="responseChannel"
                value={form.responseChannel}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="email">Email Notice</option>
                <option value="phone">Direct Callback</option>
                <option value="post">Registered Post</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Supporting Document reference</label>
              <input
                type="text"
                name="documentDetails"
                value={form.documentDetails}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500"
                placeholder="e.g. Receipt voucher details, email chain description"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5 font-display">Detailed Complaint Description *</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900/90 text-sm focus:outline-none focus:border-cyan text-white placeholder-slate-500 resize-none"
              placeholder="State the facts clearly, including names, dates, times, and booking reference details."
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={handleCheckbox}
              disabled={status === 'loading'}
              className="mt-0.5 rounded text-cyan border-white/20 bg-slate-900 focus:ring-cyan"
            />
            <span className="text-[11px] leading-relaxed text-slate-400 font-mono">
              I consent to the Grievance Officer and authorized compliance staff reviewing my account database logs, ticket details, and contact history to investigate this complaint.
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
                <span>Submitting to Grievance Officer...</span>
              </>
            ) : (
              <span>Submit Grievance</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
