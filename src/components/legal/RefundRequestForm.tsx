import React, { useState } from 'react';
import { CreditCard, Loader, AlertCircle } from 'lucide-react';

export function RefundRequestForm() {
  const [form, setForm] = useState({
    bookingId: '',
    accountDetails: '',
    paymentDate: '',
    paymentAmount: '',
    refundReason: 'duplicate',
    description: '',
    contactMethod: 'email',
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

    if (!form.bookingId.trim() || !form.accountDetails.trim() || !form.paymentAmount.trim() || !form.description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    if (!form.declaration) {
      setErrorMessage('You must agree to the refund terms.');
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
        bookingId: '',
        accountDetails: '',
        paymentDate: '',
        paymentAmount: '',
        refundReason: 'duplicate',
        description: '',
        contactMethod: 'email',
        declaration: false
      });
    } catch (err) {
      setErrorMessage('Error submitting refund request. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="w-full mt-10 p-6 sm:p-8 rounded-3xl border border-slate-line bg-white/70 shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-cyan-deep/10 flex items-center justify-center text-cyan-deep">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-[#10233F]">Refund Request Form</h3>
          <p className="text-xs text-[#728091] font-mono">Process paid booking or duplicate payment refunds</p>
        </div>
      </div>

      {status === 'success' ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-center animate-fadeIn">
          <h4 className="font-bold font-display text-base mb-2">Refund Claim Submitted</h4>
          <p className="text-xs font-mono leading-relaxed">
            Your claim has been registered. The finance department will review transaction logs and reply via your preferred contact channel within 3 business days.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-full hover:bg-emerald-500 transition-all cursor-pointer border-none"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Booking / Transaction ID *</label>
              <input
                type="text"
                name="bookingId"
                value={form.bookingId}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
                placeholder="e.g. TXN-109283 or BOOK-5541"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Registered Account Email / Phone *</label>
              <input
                type="text"
                name="accountDetails"
                value={form.accountDetails}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
                placeholder="User account details"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Paid Amount (₹) *</label>
              <input
                type="number"
                name="paymentAmount"
                value={form.paymentAmount}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
                placeholder="Amount in INR"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Refund Reason *</label>
              <select
                name="refundReason"
                value={form.refundReason}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
              >
                <option value="duplicate">Verified Duplicate Payment</option>
                <option value="cancelled_tour">Company-Cancelled Tour</option>
                <option value="provider_issue">Provider Cancellation</option>
                <option value="failed_txn">Debited but Failed Txn</option>
                <option value="statutory">Statutory Cooling-Off (14 Days)</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Preferred Contact Method</label>
              <select
                name="contactMethod"
                value={form.contactMethod}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="phone">Direct Call</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Supporting Document description</label>
              <input
                type="text"
                name="verificationDetails"
                disabled={status === 'loading'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink"
                placeholder="e.g. Bank reference ID, transaction screenshot description"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#10233F] mb-1.5 font-display">Additional Context & Bank details *</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              disabled={status === 'loading'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm focus:outline-none focus:border-cyan text-ink resize-none"
              placeholder="Provide bank details (IFSC, Account Number, Bank Name) or additional payment reference info."
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="declaration"
              checked={form.declaration}
              onChange={handleCheckbox}
              disabled={status === 'loading'}
              className="mt-0.5 rounded text-cyan border-slate-300 focus:ring-cyan"
            />
            <span className="text-[11px] leading-relaxed text-[#728091] font-mono">
              I confirm that I have read the Refund Policy. I agree that subscription activation fees are non-refundable and refunds remain subject to provider cancellation fees.
            </span>
          </label>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-3 rounded-xl bg-cyan-deep text-white font-bold font-display text-sm hover:bg-[#007A94] transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-lg shadow-cyan-950/10"
          >
            {status === 'loading' ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Submit Refund Claim</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
