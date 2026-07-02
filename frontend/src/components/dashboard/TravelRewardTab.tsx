import React from 'react';
import { Ticket, Trophy, Calendar, ArrowRight } from 'lucide-react';

export interface TravelRewardTabProps {
  availableLuckyDrawCredits: number;
  isWeeklyActivated: boolean;
  handleActivateWeeklyParticipation: () => void;
  cycleState: 'Draft' | 'Entry Open' | 'Entry Closed' | 'List Frozen' | 'Result Pending' | 'Result Published' | 'Cancelled';
}

export function TravelRewardTab({
  availableLuckyDrawCredits,
  isWeeklyActivated
}: TravelRewardTabProps) {
  const [countdown, setCountdown] = React.useState({
    days: '06',
    hours: '12',
    minutes: '45',
    seconds: '30'
  });

  const schedule = [
    { quarter: 'Jan - Mar', tour: 'July', color: 'from-cyan-400 to-blue-500', img: '/images/sundarbans_mangrove_1779521789593.png' },
    { quarter: 'Apr - Jun', tour: 'October', color: 'from-emerald-400 to-teal-500', img: '/images/darjeeling_tea_1779521805614.png' },
    { quarter: 'Jul - Sep', tour: 'January', color: 'from-amber-400 to-orange-500', img: '/images/kashmir_dal_lake_1779521728036.png' },
    { quarter: 'Oct - Dec', tour: 'April', color: 'from-rose-400 to-red-500', img: '/images/kerala_houseboat_1779521772928.png' },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let sec = parseInt(prev.seconds) - 1;
        let min = parseInt(prev.minutes);
        let hr = parseInt(prev.hours);
        let dy = parseInt(prev.days);

        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }
        if (hr < 0) {
          hr = 23;
          dy -= 1;
        }
        if (dy < 0) {
          clearInterval(timer);
          return { days: '00', hours: '00', minutes: '00', seconds: '00' };
        }

        return {
          days: String(dy).padStart(2, '0'),
          hours: String(hr).padStart(2, '0'),
          minutes: String(min).padStart(2, '0'),
          seconds: String(sec).padStart(2, '0')
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 5. TRC / TRAVEL REWARD Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-805 uppercase tracking-wide">TRC / Travel Reward</h2>
          <p className="text-xs text-slate-400">View your active tokens, countdown timer, and recent selection archives</p>
        </div>

        {/* Two-Column split cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          {/* Card 1: Your TRC Credits */}
          <div className="bg-[#fff9f6] border border-orange-100 rounded-2xl p-5 flex flex-col justify-between min-h-[190px]">
            <div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-bold text-slate-700">Your TRC Credits</span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-black text-slate-800">
                  {isWeeklyActivated ? Math.max(0, availableLuckyDrawCredits - 1) : availableLuckyDrawCredits || 24}
                </span>
                <span className="text-xs text-slate-400 font-bold">Total Entries</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {isWeeklyActivated ? 'WK-23 entry is active. Consulate credit is secured.' : 'Tokens ready to participate in this week\'s selection draw.'}
              </p>
            </div>
            <button className="w-full mt-4 py-2 bg-orange-500 hover:bg-orange-600 transition text-white font-bold text-xs uppercase tracking-wider rounded-xl border-none cursor-pointer">
              View All Entries
            </button>
          </div>

          {/* Card 2: Next Lucky Draw Countdown */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-5 text-white flex flex-col justify-between min-h-[190px] relative overflow-hidden">
            <div className="absolute right-5 bottom-5 text-[70px] opacity-20 pointer-events-none">🏆</div>
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-blue-200 block">Next Selection Draw</span>
                  <h4 className="text-sm font-bold mt-1 text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-300" /> 25 May 2025, 7:00 PM
                  </h4>
                </div>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              {/* Countdown timer blocks */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 max-w-xs">
                {[
                  { val: countdown.days, label: 'Days' },
                  { val: countdown.hours, label: 'Hours' },
                  { val: countdown.minutes, label: 'Mins' },
                  { val: countdown.seconds, label: 'Secs' }
                ].map((block, idx) => (
                  <div key={idx} className="bg-white/10 rounded-xl p-2 text-center">
                    <span className="block text-base font-black text-amber-300 font-mono leading-none">{block.val}</span>
                    <span className="text-[8px] font-bold text-white/70 block mt-0.5">{block.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-4 py-2 bg-white/15 hover:bg-white/20 transition text-white font-bold text-xs uppercase tracking-wider rounded-xl border-none cursor-pointer">
              View Winners
            </button>
          </div>
        </div>

        {/* Recent Draw Results Table */}
        <div className="pt-6 mt-5 border-t border-slate-50 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recent Draw Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Draw Date</th>
                  <th className="py-2.5">Prize</th>
                  <th className="py-2.5">Winner</th>
                  <th className="py-2.5">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-655 font-medium">
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 text-slate-500">11 May 2025</td>
                  <td className="py-3 font-bold text-slate-800">Second Prize</td>
                  <td className="py-3 font-bold text-blue-600">Amit Mondal <span className="text-[10px] text-slate-400 font-mono">(BED-1002-08089)</span></td>
                  <td className="py-3 font-black text-slate-808">₹5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tour Scheduling Cycle Card */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6 space-y-5">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black font-mono">Tour Scheduling Cycle</span>
          <h2 className="text-base font-bold text-slate-800 mt-1">When do winners travel?</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {schedule.map((s) => (
            <div key={s.quarter} className="bg-slate-50/80 border border-slate-100/70 rounded-2xl overflow-hidden hover:border-slate-200 transition-all text-center group">
              {/* Destination preview image */}
              <div className="relative h-20 overflow-hidden">
                <img src={s.img} alt={s.tour} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md`}>
                  <Calendar className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="p-3">
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Selected members from</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{s.quarter}</div>
                <div className="my-1.5 flex justify-center"><ArrowRight className="w-3.5 h-3.5 text-[#ff7a18] rotate-90" /></div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Travel in</div>
                <div className="text-xs font-black text-orange-500 mt-0.5">{s.tour}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
