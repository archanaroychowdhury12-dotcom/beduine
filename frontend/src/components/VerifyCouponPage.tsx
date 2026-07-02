import { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { notify } from '@/services/uiFeedback';

export default function VerifyCouponPage() {
  const [token, setToken] = useState('');
  const [coupon, setCoupon] = useState<any>(null);
  const [searchToken, setSearchToken] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Extract token from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    if (t) {
      setToken(t);
      lookupCoupon(t);
    }
  }, []);

  const lookupCoupon = (t: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    const winnersStr = localStorage.getItem('beduine_winners_list');
    if (!winnersStr) {
      setCoupon(null);
      setErrorMsg('No selection reports found in local storage. Run RNG selection in Dashboard first.');
      return;
    }

    try {
      const winners = JSON.parse(winnersStr);
      const found = winners.find((w: any) => w.token === t || w.coupon === t);
      if (found) {
        setCoupon(found);
      } else {
        setCoupon(null);
        setErrorMsg('Invalid Selection Coupon. No matching token or coupon code found.');
      }
    } catch (err) {
      setCoupon(null);
      setErrorMsg('Failed to parse selection database.');
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchToken.trim()) return;
    setToken(searchToken.trim());
    // Update URL parameter without reloading to simulate navigation
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?t=${encodeURIComponent(searchToken.trim())}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    lookupCoupon(searchToken.trim());
  };

  const handleMarkAsRedeemed = () => {
    if (!coupon) return;
    const winnersStr = localStorage.getItem('beduine_winners_list');
    if (!winnersStr) return;

    try {
      const winners = JSON.parse(winnersStr);
      const updated = winners.map((w: any) => {
        if (w.id === coupon.id) {
          return {
            ...w,
            status: 'Redeemed',
            redeemedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            redeemedBy: 'Staff ID 104'
          };
        }
        return w;
      });

      localStorage.setItem('beduine_winners_list', JSON.stringify(updated));
      
      // Dispatch storage event manually for same-window updates
      window.dispatchEvent(new Event('storage'));

      const foundUpdated = updated.find((w: any) => w.id === coupon.id);
      setCoupon(foundUpdated);
      setSuccessMsg('Coupon successfully redeemed!');
    } catch (err) {
      notify.info('Failed to save redemption.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex items-center justify-center p-4">
      {/* Background visual rings */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-950/85 border border-white/10 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] text-center relative z-10 overflow-hidden">
        {/* Brand header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D4F5] to-[#FF6B6B] flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-black text-sm uppercase tracking-[0.2em] text-white">BEDUINE Verification</span>
        </div>

        {/* Manual search input if no token or error */}
        {(!token || errorMsg) && (
          <div className="space-y-4 mb-6">
            <h1 className="text-xl font-black text-white">Coupon Verification Portal</h1>
            <p className="text-xs text-slate-400">Scan a winner's QR code or enter the token below manually to verify eligibility.</p>
            
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="ENTER COUPON OR TOKEN"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 outline-none text-xs text-center font-mono font-bold uppercase bg-slate-900 text-white focus:border-[#00D4F5] focus:ring-1 focus:ring-[#00D4F5]"
              />
              <button type="submit" className="px-4 py-3 rounded-xl text-xs font-bold bg-[#00D4F5] text-slate-950 hover:opacity-90 transition-all border-none cursor-pointer">
                Verify
              </button>
            </form>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-405 text-xs font-semibold flex items-start gap-2 text-left mb-6">
            <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Verification Failed</div>
              <div className="mt-0.5 text-red-400">{errorMsg}</div>
            </div>
          </div>
        )}

        {coupon && (
          <div className="space-y-6 text-left">
            {/* Status Header */}
            {coupon.status === 'Redeemed' ? (
              <div className="p-4.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-400 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-550 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide">Coupon Already Used</h3>
                  <p className="text-[11px] text-amber-400/80 mt-1 leading-relaxed">
                    This selection coupon was already redeemed. Double entry is prohibited.
                  </p>
                </div>
              </div>
            ) : coupon.status === 'Cancelled' ? (
              <div className="p-4.5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide">Coupon Cancelled / Invalid</h3>
                  <p className="text-[11px] text-red-400/80 mt-1 leading-relaxed">
                    {coupon.verification_status === 'failed' 
                      ? `System checks failed: ${coupon.verification_reason}`
                      : 'This coupon was cancelled by administration.'}
                  </p>
                </div>
              </div>
            ) : coupon.status === 'Tour Assigned' ? (
              <div className="p-4.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide">Valid Selection Coupon</h3>
                  <p className="text-[11px] text-emerald-400/80 mt-1 leading-relaxed">
                    This coupon is verified and active. Staff can proceed to redeem this tour.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-blue-400 flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide">Pending Tour Assignment</h3>
                  <p className="text-[11px] text-blue-450/80 mt-1 leading-relaxed">
                    Selected member verified but destination/batch is not assigned yet by Admin.
                  </p>
                </div>
              </div>
            )}

            {/* Coupon Metadata Card */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">COUPON CODE</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5 block">{coupon.coupon}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">STATUS</span>
                  <span className={`text-[10px] font-black uppercase tracking-wider mt-1 inline-block ${
                    coupon.status === 'Redeemed' ? 'text-amber-500' :
                    coupon.status === 'Cancelled' ? 'text-red-500' :
                    coupon.status === 'Tour Assigned' ? 'text-emerald-500' : 'text-blue-400'
                  }`}>{coupon.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-bold">CUSTOMER</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block">{coupon.name}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-bold">PLAN TIER</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block">{coupon.plan}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-bold">DESTINATION</span>
                  <span className="text-xs font-bold text-[#00D4F5] mt-0.5 block">{coupon.destination || 'Not assigned'}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-bold">TOUR BATCH</span>
                  <span className="text-xs font-bold text-[#FF8E53] mt-0.5 block">{coupon.batch || 'Not assigned'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-bold">TRAVEL DATE</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block">{coupon.travelDate || 'Not assigned'}</span>
                </div>
              </div>

              {/* Redemption Logs if Redeemed */}
              {coupon.status === 'Redeemed' && (
                <div className="pt-4 border-t border-white/5 space-y-2 text-[10px] text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Redeemed At:</span>
                    <span className="text-slate-200 font-bold">{coupon.redeemedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Redeemed By:</span>
                    <span className="text-slate-200 font-bold">{coupon.redeemedBy}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Redeemed Success banner */}
            {successMsg && (
              <div className="py-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-xs font-bold text-center">
                {successMsg}
              </div>
            )}

            {/* Action buttons */}
            {coupon.status === 'Tour Assigned' && (
              <button
                onClick={handleMarkAsRedeemed}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-95 shadow-lg shadow-emerald-500/10 transition-all border-none cursor-pointer text-center"
              >
                Mark as Redeemed
              </button>
            )}

            <button
              onClick={() => {
                setCoupon(null);
                setToken('');
                window.history.pushState({}, '', window.location.pathname);
              }}
              className="w-full py-2.5 bg-slate-900 border border-white/10 text-slate-450 text-[10px] font-bold uppercase tracking-wider rounded-xl hover:text-white transition-all cursor-pointer text-center"
            >
              Verify Another Coupon
            </button>
          </div>
        )}

        <div className="mt-8 text-[9px] text-slate-500 border-t border-white/5 pt-4 uppercase tracking-wider font-semibold">
          BEDUINE Secure Selection Verification Service v2.0
        </div>
      </div>
    </div>
  );
}
