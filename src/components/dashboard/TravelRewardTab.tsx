import { Ticket, AlertTriangle, Check, Calendar } from 'lucide-react';

export interface TravelRewardTabProps {
  availableLuckyDrawCredits: number;
  isWeeklyActivated: boolean;
  handleActivateWeeklyParticipation: () => void;
  cycleState: 'Draft' | 'Entry Open' | 'Entry Closed' | 'List Frozen' | 'Result Pending' | 'Result Published' | 'Cancelled';
}

export function TravelRewardTab({
  availableLuckyDrawCredits,
  isWeeklyActivated,
  handleActivateWeeklyParticipation,
  cycleState
}: TravelRewardTabProps) {

  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-805 uppercase tracking-wide">
        <Ticket className="w-5 h-5 text-[#FF6B6B]" /> Weekly Member Selection &amp; Participation
      </h2>
      <p className="text-xs text-slate-400">Track active tokens, weekly selection schedule, and simulation metrics</p>

      {/* Legal Restriction disclaimer alert banner */}
      <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200/50 rounded-2xl p-4 flex gap-3 text-left">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-red-650 uppercase tracking-wide">Promotional Feature Restriction Warning</h4>
          <p className="text-[11px] text-red-650/90 font-medium mt-1 leading-relaxed">
            <strong>SRS &amp; Contract Rule:</strong> Selection-based promotional module will remain disabled in production until the client provides approved rules, eligibility criteria, privacy terms and written legal authorization.
          </p>
        </div>
      </div>

      {/* Cycle states progress stepper timeline */}
      <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Selection Cycle State Tracker</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
            cycleState === 'Draft' ? 'bg-slate-100 text-slate-655 border border-slate-200' :
            cycleState === 'Entry Open' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
            cycleState === 'Entry Closed' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
            cycleState === 'List Frozen' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
            cycleState === 'Result Pending' ? 'bg-purple-50 text-purple-650 border border-purple-100 animate-pulse' :
            cycleState === 'Result Published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
            'bg-red-50 text-[#FF6B6B] border border-rose-100'
          }`}>
            {cycleState}
          </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mt-4 text-center">
          {['Draft', 'Entry Open', 'Entry Closed', 'List Frozen', 'Result Pending', 'Result Published', 'Cancelled'].map((st, i) => {
            const isActive = cycleState === st;
            const isPassed = ['Draft', 'Entry Open', 'Entry Closed', 'List Frozen', 'Result Pending', 'Result Published', 'Cancelled'].indexOf(cycleState) >= i;
            return (
              <div key={st} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  isActive ? 'bg-slate-800 text-white shadow-md' :
                  isPassed ? 'bg-slate-300 text-slate-700' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <span className="text-[8.5px] mt-1.5 font-bold uppercase truncate w-full hidden sm:block text-slate-500">{st}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-5">
        {/* Active token card */}
        <div className="rounded-2xl border border-slate-150 p-5 bg-slate-50/50 flex flex-col justify-between text-left">
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block font-bold">WEEKLY TRAVEL REWARD TOKEN</span>
            {availableLuckyDrawCredits === 0 ? (
              <div className="text-sm font-bold text-slate-700 leading-tight mt-2">
                No Travel Reward Credit available.
              </div>
            ) : isWeeklyActivated ? (
              <>
                <span className="text-2xl font-black mt-1.5 block text-emerald-605 flex items-center gap-1">
                  <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} /> WK-23 Activated
                </span>
                <div className="text-[11px] text-slate-550 mt-2 font-mono font-bold uppercase">Ticket ID: TRC-828253</div>
              </>
            ) : (
              <>
                <span className="text-3xl font-black tracking-widest font-mono mt-1.5 block text-[#00D4F5]">TRC-828253</span>
                <div className="mt-3.5 text-xs font-semibold text-slate-650 leading-relaxed">
                  You have <strong className="text-slate-800">1 TRC participation token</strong> available. You must manually activate it before Sunday 8:00 PM cut-off.
                </div>
                <button
                  id="activate-weekly-btn"
                  onClick={handleActivateWeeklyParticipation}
                  disabled={cycleState !== 'Entry Open'}
                  className="w-full mt-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer text-white bg-[#FF6B6B] border-none shadow-sm hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-center"
                >
                  {cycleState !== 'Entry Open' ? 'Entries Closed for Week' : 'Activate WK-23 Entry'}
                </button>
              </>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/80 pt-3 mt-4">
            <span>Next selection draw:</span>
            <span className="font-bold text-[#FF8E53] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Next Sunday, 8:00 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
