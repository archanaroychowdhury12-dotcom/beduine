import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Lock, Unlock, UserPlus, Trash2, ShieldCheck, 
  Compass, Copy, Zap, FileText, Download, RefreshCw 
} from 'lucide-react';
import { notify } from '@/services/uiFeedback';

export interface AdminDrawPanelProps {
  cycleState: 'Draft' | 'Entry Open' | 'Entry Closed' | 'List Frozen' | 'Result Pending' | 'Result Published' | 'Cancelled';
  setCycleState: (state: any) => void;
  participants: any[];
  setParticipants: React.Dispatch<React.SetStateAction<any[]>>;
  selectedWinners: any[];
  setSelectedWinners: React.Dispatch<React.SetStateAction<any[]>>;
  verificationLogs: any;
  setVerificationLogs: (logs: any) => void;
  notificationLogs: string[];
  setNotificationLogs: React.Dispatch<React.SetStateAction<string[]>>;
  handleFreezeList: () => void;
  handleRunRNGDraw: () => void;
  handleCancelDraw: () => void;
  handleResetDraw: () => void;
  handleAddMockParticipant: (name: string, plan: string) => void;
  handleRemoveMockParticipant: (id: string) => void;
  handleAssignTourDetails: (winnerId: string, destination: string, batch: string, travelDate: string) => void;
  handleBulkAssignTour: (plan: string, destination: string, batch: string, travelDate: string) => void;
  handleToggleCallConfirmed: (winnerId: string) => void;
  handleCancelWinnerCoupon: (winnerId: string) => void;
  exportToCSV: () => void;
  exportToPDF: () => void;
}

export function AdminDrawPanel({
  cycleState,
  setCycleState,
  participants,
  selectedWinners,
  verificationLogs,
  handleFreezeList,
  handleRunRNGDraw,
  handleCancelDraw,
  handleResetDraw,
  handleAddMockParticipant,
  handleRemoveMockParticipant,
  handleAssignTourDetails,
  handleBulkAssignTour,
  handleToggleCallConfirmed,
  handleCancelWinnerCoupon,
  exportToCSV,
  exportToPDF
}: AdminDrawPanelProps) {

  // Local Form Input States
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantPlan, setNewParticipantPlan] = useState<string>('Domestic Silver Plan');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [simToken, setSimToken] = useState('');
  
  // Bulk Assignment form states
  const [bulkPlan, setBulkPlan] = useState<'Domestic Silver Plan' | 'Domestic Gold Plan' | 'Domestic Platinum Plan' | 'International Silver Plan' | 'International Gold Plan' | 'International Platinum Plan'>('Domestic Silver Plan');
  const [bulkDest, setBulkDest] = useState('Sundarbans');
  const [bulkBatch, setBulkBatch] = useState('October 2026');
  const [bulkDate, setBulkDate] = useState('12 October 2026');

  // Track inline edits in each winner row
  const [rowEdits, setRowEdits] = useState<{[key: string]: { destination: string; batch: string; travelDate: string }}>({});

  const verifiedWinners = selectedWinners.filter((winner) => winner.verification_status === 'verified' && winner.status !== 'Cancelled');
  const [liveRevealCount, setLiveRevealCount] = useState(0);
  const currentLiveWinner = liveRevealCount > 0 ? verifiedWinners[liveRevealCount - 1] : null;

  useEffect(() => {
    if (cycleState !== 'Result Published') {
      setLiveRevealCount(0);
    } else if (liveRevealCount > verifiedWinners.length) {
      setLiveRevealCount(verifiedWinners.length);
    }
  }, [cycleState, verifiedWinners.length, liveRevealCount]);

  const handleLiveDrawButton = () => {
    if (cycleState === 'List Frozen') {
      handleRunRNGDraw();
      return;
    }
    if (cycleState === 'Result Published' && liveRevealCount < verifiedWinners.length) {
      setLiveRevealCount((count) => count + 1);
    }
  };

  const updateRowEdit = (winnerId: string, field: string, value: string) => {
    setRowEdits(prev => ({
      ...prev,
      [winnerId]: {
        ...((prev[winnerId]) || { destination: '', batch: 'October 2026', travelDate: '12 October 2026' }),
        [field]: value
      }
    }));
  };

  useEffect(() => {
    if (bulkPlan.includes('Silver')) setBulkDest(bulkPlan.includes('International') ? 'Nepal' : 'Sundarbans');
    else if (bulkPlan.includes('Gold')) setBulkDest(bulkPlan.includes('International') ? 'Thailand' : 'Darjeeling');
    else if (bulkPlan.includes('Platinum')) setBulkDest(bulkPlan.includes('International') ? 'Dubai' : 'Kashmir');
  }, [bulkPlan]);

  const onAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipantName.trim()) return;
    handleAddMockParticipant(newParticipantName, newParticipantPlan);
    setNewParticipantName('');
  };

  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      {/* RNG Cycle Controller board */}
      <div className="rounded-2xl border border-slate-150 p-5 bg-white flex flex-col justify-between shadow-sm text-left">
        <div>
          <h3 className="text-xs font-black text-slate-805 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-[#FF8E53]" /> Sunday Lucky Draw Control Board
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            Sunday 6:00 PM IST auto-freeze status is mirrored here. Generate the plan-wise winner pool, then reveal winners one by one for live/social media.
          </p>
          
          <div className="mt-4 space-y-2 font-sans">
            <div className="text-[10px] font-bold text-slate-500">ADMIN CONTROL ACTIONS:</div>
            
            <div className="flex flex-wrap gap-2">
              {cycleState === 'Entry Open' && (
                <button onClick={() => setCycleState('Entry Closed')} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-900 border-none cursor-pointer">
                  Close Entries
                </button>
              )}
              
              {cycleState === 'Entry Closed' && (
                <button onClick={handleFreezeList} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-indigo-650 hover:bg-indigo-700 border-none cursor-pointer flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Freeze List &amp; Verify
                </button>
              )}
              
              {cycleState === 'List Frozen' && (
                <button onClick={handleRunRNGDraw} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-605 hover:bg-emerald-700 border-none cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse" /> Generate Winner Pool
                </button>
              )}
              
              {cycleState !== 'Cancelled' && cycleState !== 'Result Published' && cycleState !== 'Result Pending' && (
                <button onClick={handleCancelDraw} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-655 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer">
                  Cancel Cycle
                </button>
              )}
              
              {(cycleState === 'Result Published' || cycleState === 'Cancelled') && (
                <button onClick={handleResetDraw} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Reset Selection Cycle
                </button>
              )}
            </div>
          </div>
        </div>
        
        {cycleState === 'Result Pending' && (
          <div className="my-4 text-center py-4 bg-purple-50/50 border border-purple-100 rounded-xl">
            <Compass className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
            <span className="text-xs font-mono font-bold text-purple-705 block mt-2 animate-pulse">RUNNING PSEUDO-RNG ALGORITHM...</span>
          </div>
        )}
        
        {cycleState === 'Result Published' && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center font-sans">
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Plan-wise Reports:</span>
            <div className="flex gap-2">
              <button onClick={exportToCSV} className="px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold text-indigo-650 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 cursor-pointer flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button onClick={exportToPDF} className="px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold text-[#FF6B6B] bg-rose-50 border border-rose-155 hover:bg-rose-100 cursor-pointer flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Export PDF
              </button>
            </div>
          </div>
        )}
        
        {cycleState === 'Cancelled' && (
          <div className="my-4 text-center py-3 bg-red-50 border border-red-100 text-red-655 font-bold rounded-xl text-xs font-sans">
            Selection cycle was cancelled by administrative authorization.
          </div>
        )}
      </div>

      {/* Social Live Winner Reveal */}
      <div className="rounded-[32px] border border-amber-200 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-6 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#fbbf24,transparent_35%),radial-gradient(circle_at_bottom_left,#ef4444,transparent_30%)]" />
        <div className="relative z-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-5 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-amber-300 font-black mb-3">Live Sunday Lucky Draw</p>
            <h3 className="text-3xl sm:text-5xl font-black leading-tight">Winner Reveal Console</h3>
            <p className="text-sm text-white/70 mt-3 max-w-xl">Backend contract: Sunday 6PM auto-freeze → plan-wise winner pool → button click korlei ek ekta Winner name + UID reveal hobe.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                onClick={handleLiveDrawButton}
                disabled={cycleState === 'Result Pending' || cycleState === 'Cancelled' || cycleState === 'Result Published' && liveRevealCount >= verifiedWinners.length}
                className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 to-orange-400 hover:from-amber-200 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shadow-xl flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {cycleState === 'List Frozen' ? 'Generate Plan-wise Pool' : cycleState === 'Result Published' ? 'Reveal Next Winner' : cycleState === 'Result Pending' ? 'Drawing...' : 'Auto-freeze / Freeze First'}
              </button>
              <button
                type="button"
                onClick={handleResetDraw}
                className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-white bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer"
              >
                Reset Live Screen
              </button>
            </div>
          </div>

          <div className="relative z-10 rounded-[28px] bg-white/10 border border-white/15 p-5 backdrop-blur-xl min-h-[230px] flex flex-col justify-center text-center">
            {currentLiveWinner ? (
              <div className="animate-[pulse_1.5s_ease-in-out_1]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-black">Winner #{liveRevealCount}</p>
                <h4 className="text-3xl font-black mt-3 text-white">{currentLiveWinner.name}</h4>
                <p className="text-sm text-white/70 mt-2">UID / Ticket</p>
                <p className="text-xl font-mono font-black text-amber-200 mt-1">{currentLiveWinner.ticketId || currentLiveWinner.id}</p>
                <p className="text-xs text-white/50 mt-3">Coupon: {currentLiveWinner.coupon}</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300 font-black">Ready for Live Reveal</p>
                <h4 className="text-2xl font-black mt-3 text-white">Winner name will appear here</h4>
                <p className="text-sm text-white/60 mt-3">Auto-freeze Sunday 6PM → Generate plan-wise pool → Reveal Next Winner.</p>
              </div>
            )}
            {cycleState === 'Result Published' && (
              <p className="text-[11px] text-white/50 mt-5">Revealed {liveRevealCount} of {verifiedWinners.length} winners</p>
            )}
          </div>
        </div>
      </div>

      {/* Participants Manager Panel */}
      <div className="pt-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-sans">
          <div>
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-wider flex items-center gap-1.5">
              {cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled' ? (
                <Lock className="w-4 h-4 text-slate-550" />
              ) : (
                <Unlock className="w-4 h-4 text-[#138A8A]" />
              )}
              Weekly Participation Candidate List
            </h3>
            <p className="text-[10px] text-slate-400">
              {cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled' ? (
                <span className="text-amber-600 font-bold">List Frozen. Add/remove is locked to prevent silent modifications.</span>
              ) : (
                "Add or remove candidates before freezing the weekly list."
              )}
            </p>
          </div>
          
          {/* Metrics */}
          <div className="flex gap-4 text-xs font-semibold bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-slate-700">
            <div>
              N: <strong className="text-slate-900">{participants.length}</strong>
            </div>
            {cycleState === 'List Frozen' || cycleState === 'Result Published' ? (
              <>
                <div className="border-l border-slate-200 pl-4">
                  Eligible N: <strong className="text-emerald-600">{verificationLogs?.totalN}</strong>
                </div>
                <div className="border-l border-slate-200 pl-4">
                  Total Winner Slots: <strong className="text-indigo-650">{verificationLogs?.selectedK}</strong>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {verificationLogs?.rounds?.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {verificationLogs.rounds.map((round: any) => (
              <div key={round.roundKey} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider font-black text-slate-500">{round.label}</p>
                <p className="text-xs font-bold text-slate-800 mt-1">{round.totalN} entries → {round.selectedK} winner slot(s)</p>
              </div>
            ))}
          </div>
        ) : null}
        
        {/* Add mock candidate form & Search Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between font-sans">
          {cycleState !== 'List Frozen' && cycleState !== 'Result Published' && cycleState !== 'Cancelled' ? (
            <form onSubmit={onAddCandidateSubmit} className="flex flex-wrap gap-2 max-w-lg items-center">
              <input
                type="text"
                placeholder="Candidate Full Name"
                value={newParticipantName}
                onChange={(e) => setNewParticipantName(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-750 bg-white focus:border-[#FF6B6B] w-48"
              />
              <select
                value={newParticipantPlan}
                onChange={(e) => setNewParticipantPlan(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-705 bg-white font-semibold"
              >
                <option value="Domestic Silver Plan">Domestic Silver</option>
                <option value="Domestic Gold Plan">Domestic Gold</option>
                <option value="Domestic Platinum Plan">Domestic Platinum</option>
                <option value="International Silver Plan">International Silver</option>
                <option value="International Gold Plan">International Gold</option>
                <option value="International Platinum Plan">International Platinum</option>
              </select>
              <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-950 border-none cursor-pointer flex items-center gap-1 shrink-0">
                <UserPlus className="w-3.5 h-3.5" /> Add Candidate
              </button>
            </form>
          ) : <div />}

          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search candidates by name..."
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
            />
          </div>
        </div>

        {/* Candidates table (scrollable) */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm bg-white max-h-[300px] overflow-y-auto font-sans">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr className="border-b text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="py-2.5 px-4 bg-slate-50">Candidate ID</th>
                <th className="py-2.5 px-4 bg-slate-50">Name</th>
                <th className="py-2.5 px-4 bg-slate-50">Contact Info</th>
                <th className="py-2.5 px-4 bg-slate-50">Plan Tier</th>
                <th className="py-2.5 px-4 bg-slate-50">Verification Status</th>
                <th className="py-2.5 px-4 bg-slate-50">Ticket ID</th>
                <th className="py-2.5 px-4 text-center bg-slate-50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
              {participants
                .filter(p => p.name.toLowerCase().includes(candidateSearch.toLowerCase()) || p.email.toLowerCase().includes(candidateSearch.toLowerCase()) || p.phone.includes(candidateSearch))
                .map((p) => {
                  const isWinner = selectedWinners.some(w => w.id === p.id);
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/50 transition-colors ${
                      p.status === 'failed' ? 'bg-red-50/5 opacity-75' :
                      isWinner ? 'bg-emerald-50/30 font-semibold text-emerald-805' : ''
                    }`}>
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">BDN-CAND-{p.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-805 flex items-center gap-1.5">
                          {p.name}
                          {isWinner && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm animate-pulse">
                              Selected
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                        <div>{p.phone}</div>
                        <div>{p.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{p.plan}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                          p.status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-rose-50 text-[#FF6B6B] border border-rose-100'
                        }`}>
                          {p.status}
                        </span>
                        {p.status === 'failed' && p.verification_reason && (
                          <span className="block text-[8.5px] text-rose-550 font-bold mt-0.5">{p.verification_reason}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#00D4F5]">{p.ticketId || 'Pending'}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMockParticipant(p.id)}
                          disabled={cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled'}
                          className="text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent cursor-pointer"
                          title="Remove Candidate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN PANEL WINNER REPORT & CONTROLS */}
      {cycleState === 'Result Published' && (
        <div className="pt-6 border-t border-slate-100 space-y-6">
          <div className="bg-slate-50/50 border border-slate-155 rounded-[24px] p-5 text-left space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-805 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> Admin Panel Selection Report
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">Weekly Member Selection: 21 June 2026</p>
              </div>
              <div className="text-[9.5px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Verified Winners: {selectedWinners.filter(w => w.verification_status === 'verified').length} / Failed: {selectedWinners.filter(w => w.verification_status === 'failed').length}
              </div>
            </div>

            {/* Summary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm">
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">VALID PARTICIPANTS</span>
                <span className="text-2xl font-black text-slate-850 mt-1 block">{verificationLogs?.totalN || participants.filter(p => p.status === 'verified').length}</span>
                <span className="text-[9px] text-slate-400 block mt-1">Frozen before winner reveal</span>
              </div>
              <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm">
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">TOTAL WINNERS</span>
                <span className="text-2xl font-black text-slate-850 mt-1 block">{selectedWinners.length}</span>
                <span className="text-[9.5px] text-emerald-600 font-bold block mt-1">Verified: {selectedWinners.filter(w => w.verification_status === 'verified').length}</span>
              </div>
              <div className="bg-white border border-slate-155 rounded-2xl p-4.5 shadow-sm">
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">COUPONS ISSUED</span>
                <span className="text-2xl font-black text-indigo-650 mt-1 block">
                  {selectedWinners.filter(w => w.verification_status === 'verified' && w.status !== 'Cancelled').length}
                </span>
                <span className="text-[9.5px] text-red-500 font-bold block mt-1">Failed/Cancelled: {selectedWinners.filter(w => w.verification_status === 'failed' || w.status === 'Cancelled').length}</span>
              </div>
              <div className="bg-white border border-slate-155 rounded-2xl p-4.5 shadow-sm">
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">TOUR BATCH PENDING</span>
                <span className="text-2xl font-black text-[#FF8E53] mt-1 block">
                  {selectedWinners.filter(w => w.status === 'Issued' && w.verification_status === 'verified').length}
                </span>
                <span className="text-[9.5px] text-[#00D4F5] font-bold block mt-1">Assigned: {selectedWinners.filter(w => w.status === 'Tour Assigned' || w.status === 'Redeemed').length}</span>
              </div>
            </div>
          </div>

          {/* Bulk tour assignment dashboard card */}
          <div className="bg-white border border-slate-150 rounded-[24px] p-5 text-left space-y-4 shadow-sm font-sans">
            <h4 className="text-xs font-black text-slate-808 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#FF6B6B]" /> Bulk Plan Tier Destination Assignment
            </h4>
            <p className="text-[10px] text-slate-400">
              Company assigns destinations based on seasonal package lists. Assign travel parameters to all verified winners in bulk:
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-[8px] text-slate-400 uppercase font-mono font-bold mb-1.5">Plan Tier</label>
                <select
                  value={bulkPlan}
                  onChange={(e: any) => setBulkPlan(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white font-bold"
                >
                  <option value="Domestic Silver Plan">Domestic Silver</option>
                  <option value="Domestic Gold Plan">Domestic Gold</option>
                  <option value="Domestic Platinum Plan">Domestic Platinum</option>
                  <option value="International Silver Plan">International Silver</option>
                  <option value="International Gold Plan">International Gold</option>
                  <option value="International Platinum Plan">International Platinum</option>
                </select>
              </div>

              <div>
                <label className="block text-[8px] text-slate-400 uppercase font-mono font-bold mb-1.5"> seasonal Package</label>
                <select
                  value={bulkDest}
                  onChange={(e) => setBulkDest(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white font-bold"
                >
                  {bulkPlan.includes('Silver') && (bulkPlan.includes('International') ? ['Nepal', 'Bhutan'] : ['Sundarbans', 'Digha', 'Mousuni Island', 'Purulia']).map(d => <option key={d} value={d}>{d}</option>)}
                  {bulkPlan.includes('Gold') && (bulkPlan.includes('International') ? ['Thailand', 'Bali'] : ['Darjeeling', 'Dooars', 'Puri', 'Daring Bari']).map(d => <option key={d} value={d}>{d}</option>)}
                  {bulkPlan.includes('Platinum') && (bulkPlan.includes('International') ? ['Dubai', 'Vietnam'] : ['Kashmir', 'Goa', 'Sikkim', 'Shimla']).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[8px] text-slate-400 uppercase font-mono font-bold mb-1.5">Tour Batch</label>
                <input
                  type="text"
                  value={bulkBatch}
                  onChange={(e) => setBulkBatch(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[8px] text-slate-400 uppercase font-mono font-bold mb-1.5">Travel Date</label>
                <input
                  type="text"
                  value={bulkDate}
                  onChange={(e) => setBulkDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white font-bold"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  handleBulkAssignTour(bulkPlan, bulkDest, bulkBatch, bulkDate);
                  notify.info(`Successfully assigned ${bulkDest} (${bulkBatch}) to all verified ${bulkPlan} winners.`);
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 border-none cursor-pointer text-center"
              >
                Assign Bulk
              </button>
            </div>
          </div>

          {/* Selection Report Table */}
          <div className="space-y-3 text-left font-sans">
            <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider">Weekly Selections Table ({selectedWinners.length})</h4>
            
            <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm bg-white max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="border-b text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-4 bg-slate-50">Coupon</th>
                    <th className="py-2.5 px-4 bg-slate-50">Customer</th>
                    <th className="py-2.5 px-4 bg-slate-50">Plan</th>
                    <th className="py-2.5 px-4 bg-slate-50">Verification</th>
                    <th className="py-2.5 px-4 bg-slate-50">Call Confirmation</th>
                    <th className="py-2.5 px-4 bg-slate-50">Destination</th>
                    <th className="py-2.5 px-4 bg-slate-50">Batch / Date</th>
                    <th className="py-2.5 px-4 bg-slate-50">Status</th>
                    <th className="py-2.5 px-4 text-center bg-slate-50">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-655 font-medium">
                  {selectedWinners.map((w) => {
                    const rowEdit = rowEdits[w.id] || {
                      destination: w.destination === 'Not assigned' ? (w.plan.includes('Silver') ? 'Sundarbans' : w.plan.includes('Gold') ? 'Darjeeling' : 'Kashmir') : w.destination,
                      batch: w.batch === 'Not assigned' ? 'October 2026' : w.batch,
                      travelDate: w.travelDate === 'Not assigned' ? '12 October 2026' : w.travelDate
                    };

                    return (
                      <tr key={w.id} className={`hover:bg-slate-50/50 transition-colors ${
                        w.verification_status === 'failed' ? 'bg-red-50/10' :
                        w.status === 'Redeemed' ? 'bg-slate-50/50 opacity-80' : ''
                      }`}>
                        <td className="py-3 px-4">
                          {w.verification_status === 'verified' && w.status !== 'Cancelled' ? (
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-indigo-605 block select-all">{w.coupon}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(w.coupon);
                                  notify.info('Copied coupon: ' + w.coupon);
                                }}
                                className="p-1 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer shrink-0"
                                title="Copy Coupon"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : <span className="font-mono font-bold text-slate-400">N/A</span>}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-805">{w.name}</div>
                          <span className="block text-[8.5px] text-slate-400 font-mono mt-0.5">{w.phone}</span>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-700">{w.plan}</td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                            w.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-605 border-emerald-100' :
                            'bg-rose-50 text-red-505 border border-rose-100'
                          }`}>
                            {w.verification_status === 'verified' ? 'Verified' : 'Failed'}
                          </span>
                          {w.verification_status === 'failed' && (
                            <span className="block text-[9px] font-bold text-red-450 mt-1 leading-tight">{w.verification_reason}</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {w.verification_status === 'verified' && w.status !== 'Cancelled' ? (
                            w.callConfirmed ? (
                              <div className="space-y-1">
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase inline-block">
                                  Call Confirmed
                                </span>
                                <span className="block text-[8px] text-slate-400 font-mono mt-0.5">{w.callConfirmedAt?.slice(0, 16)}</span>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase inline-block">
                                  Pending Call
                                </span>
                                <button
                                  onClick={() => handleToggleCallConfirmed(w.id)}
                                  className="block px-2 py-0.5 text-[8.5px] font-black uppercase text-indigo-650 hover:underline border-none bg-transparent cursor-pointer"
                                >
                                  Mark Confirmed
                                </button>
                              </div>
                            )
                          ) : <span className="text-slate-400 font-bold">-</span>}
                        </td>

                        <td className="py-3 px-4">
                          {w.verification_status === 'verified' && w.status !== 'Cancelled' ? (
                            w.status === 'Issued' ? (
                              <select
                                disabled={!w.callConfirmed}
                                value={rowEdit.destination}
                                onChange={(e) => updateRowEdit(w.id, 'destination', e.target.value)}
                                className="px-2 py-1 text-xs rounded border border-slate-200 bg-white font-semibold text-slate-700 disabled:opacity-50"
                              >
                                {w.plan.includes('Silver') && ['Sundarbans', 'Digha', 'Mousuni Island', 'Purulia'].map(d => <option key={d} value={d}>{d}</option>)}
                                {w.plan.includes('Gold') && ['Darjeeling', 'Dooars', 'Puri', 'Daring Bari'].map(d => <option key={d} value={d}>{d}</option>)}
                                {w.plan.includes('Platinum') && ['Kashmir', 'Goa', 'Sikkim', 'Shimla'].map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            ) : <span className="font-bold text-[#00D4F5]">{w.destination}</span>
                          ) : <span className="text-slate-400">-</span>}
                        </td>

                        <td className="py-3 px-4">
                          {w.verification_status === 'verified' && w.status !== 'Cancelled' ? (
                            w.status === 'Issued' ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  disabled={!w.callConfirmed}
                                  placeholder="Batch (e.g. Oct 2026)"
                                  value={rowEdit.batch}
                                  onChange={(e) => updateRowEdit(w.id, 'batch', e.target.value)}
                                  className="px-2 py-1 text-[11px] rounded border border-slate-250 bg-white w-28 outline-none focus:border-indigo-500 disabled:opacity-50"
                                />
                                <input
                                  type="text"
                                  disabled={!w.callConfirmed}
                                  placeholder="Date (e.g. 12 Oct 2026)"
                                  value={rowEdit.travelDate}
                                  onChange={(e) => updateRowEdit(w.id, 'travelDate', e.target.value)}
                                  className="px-2 py-1 text-[11px] rounded border border-slate-250 bg-white w-28 outline-none focus:border-indigo-500 disabled:opacity-50 block"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="font-bold text-slate-805">{w.batch}</div>
                                <div className="text-[10px] text-slate-500">{w.travelDate}</div>
                              </div>
                            )
                          ) : <span className="text-slate-400 font-bold">-</span>}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            w.status === 'Issued' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            w.status === 'Tour Assigned' ? 'bg-purple-50 text-purple-650 border border-purple-100' :
                            w.status === 'Redeemed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            'bg-red-50 text-red-505 border border-red-100'
                          }`}>
                            {w.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {w.verification_status === 'verified' && w.status === 'Issued' && (
                              <button
                                type="button"
                                disabled={!w.callConfirmed}
                                onClick={() => {
                                  handleAssignTourDetails(w.id, rowEdit.destination, rowEdit.batch, rowEdit.travelDate);
                                  notify.info(`Assigned ${rowEdit.destination} to ${w.name}.`);
                                }}
                                className="px-2 py-1 rounded bg-indigo-550 text-white font-bold text-[9px] border-none cursor-pointer disabled:opacity-40"
                              >
                                Assign
                              </button>
                            )}
                            {w.verification_status === 'verified' && w.status !== 'Cancelled' && w.status !== 'Redeemed' && (
                              <button
                                type="button"
                                onClick={() => handleCancelWinnerCoupon(w.id)}
                                className="px-2 py-1 rounded bg-red-50 text-[#FF6B6B] border border-rose-200 hover:bg-rose-105 font-bold text-[9px] cursor-pointer"
                                title="Cancel Coupon"
                              >
                                Cancel
                              </button>
                            )}
                            {w.verification_status === 'verified' && w.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => window.open(`/verify-coupon?t=${w.token}`, '_blank')}
                                className="px-2 py-1 rounded bg-emerald-50 text-emerald-650 border border-emerald-250 hover:bg-emerald-100 font-bold text-[9px] cursor-pointer"
                                title="Simulate staff scanning QR Code"
                              >
                                Simulate Scan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* QR SCAN SIMULATION TESTING PANEL */}
          <div className="bg-slate-900 border border-white/10 rounded-[24px] p-5 text-left text-white space-y-4 font-sans">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h4 className="text-xs font-black uppercase tracking-wider">QR Code Scanner Simulation Dashboard Tool</h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              Staff scan mobile QR codes at tour arrivals. Enter a coupon code or random verification token below to simulate staff validation:
            </p>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="ENTER TOKEN (e.g. X7K92PQL8V) OR COUPON (e.g. BEDWIN-2026-00003)"
                value={simToken}
                onChange={(e) => setSimToken(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 outline-none text-xs font-mono font-bold bg-slate-950 text-white uppercase focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => {
                  if (!simToken.trim()) return;
                  window.open(`/verify-coupon?t=${encodeURIComponent(simToken.trim())}`, '_blank');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all border-none cursor-pointer shrink-0"
              >
                Simulate QR Scan
              </button>
            </div>
            <div className="text-[9px] text-slate-500 font-mono">
              *Tip: Click the "Simulate Scan" button in any row of the table above to test verification instantly.
            </div>
          </div>

          {/* Audit parameters panel */}
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left text-xs font-mono text-slate-655 space-y-2">
            <div className="font-bold text-slate-805 uppercase text-[10px] tracking-wider font-sans mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-450" /> Verification Security parameters &amp; Audit Trail
            </div>
            <div className="grid sm:grid-cols-2 gap-2 text-[10px]">
              <div>Execution Date/Time: <strong className="text-slate-900">{verificationLogs?.timestamp}</strong></div>
              <div>Algorithm Seed Hash: <strong className="text-slate-900">{verificationLogs?.hash}</strong></div>
              <div>Total Valid Entries (N): <strong className="text-slate-900">{verificationLogs?.totalN}</strong></div>
              <div>Required Selection (K): <strong className="text-slate-900">{verificationLogs?.selectedK}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
