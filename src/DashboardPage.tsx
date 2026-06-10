import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Download, Crown, LogOut, Ticket, Calendar, Check, AlertCircle
} from 'lucide-react';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

export default function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'credits' | 'draws' | 'bookings'>('overview');
  const [isSimulatingDraw, setIsSimulatingDraw] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const handleSimulateDraw = () => {
    setIsSimulatingDraw(true);
    setSimulationResult(null);
    setTimeout(() => {
      setIsSimulatingDraw(false);
      // Random result simulation
      const rand = Math.random();
      if (rand < 0.15) {
        setSimulationResult(`Congratulations! Selected for Kashmir (Platinum Tier)`);
      } else if (rand < 0.4) {
        setSimulationResult(`Selected for Digha Weekend Escape (Silver Tier)`);
      } else {
        setSimulationResult(`Draw trial finished: ₹500 Discount Credit guaranteed in account!`);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-20 bg-cosmos relative text-ink px-4 sm:px-6 lg:px-8">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-cyan/15 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-tr from-neon-gold/10 to-transparent rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Dashboard Top Header bar */}
        <div className="glass rounded-3xl p-6 lg:p-8 border border-white/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan to-blue-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan/20 border border-white/20 uppercase">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{user?.fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20 font-mono">
                  GMAIL VERIFIED
                </span>
              </div>
              <p className="text-sm text-ink/65 font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-center md:text-left">
              <span className="block text-[8px] uppercase tracking-wider text-ink/40 font-mono">MEMBERSHIP ID</span>
              <span className="text-sm font-bold text-neon-gold font-mono">{user?.memberId}</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-5 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Sidebar navigation tabs */}
          <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 shrink-0">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Compass },
              { id: 'credits', label: 'My Discount Credits', icon: CreditCard },
              { id: 'draws', label: 'Lucky Draw Status', icon: Ticket },
              { id: 'bookings', label: 'Book Travel', icon: Plane },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer whitespace-nowrap lg:whitespace-normal ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan/20 to-blue-500/10 border-cyan text-white font-bold shadow-md shadow-cyan/5' 
                      : 'bg-[#081F2E]/40 border-white/5 text-ink/75 hover:bg-[#081F2E]/70 hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan' : 'text-ink/60'}`} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side: Tab content window */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl relative overflow-hidden"
              >
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-cyan" /> Active Subscription Plan
                      </h2>
                      <p className="text-xs text-ink/50 mt-1">Details of your active Beduine membership plan benefits.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-15"><Crown className="w-12 h-12 text-neon-gold" /></div>
                        <span className="text-[9px] uppercase tracking-wider text-ink/40 font-mono block">PLAN TIER</span>
                        <span className="text-lg font-bold text-white mt-1 block uppercase">{user?.planName || 'Silver'}</span>
                        <span className="text-[10px] text-cyan block mt-1 font-semibold uppercase">{user?.planType === 'domestic' ? 'Domestic (India)' : 'International'}</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-ink/40 font-mono block">PLAN STATUS</span>
                        <span className="text-lg font-bold text-emerald-400 mt-1 block">Active</span>
                        <span className="text-[10px] text-ink/50 block mt-1">Expires: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                        <span className="text-[9px] uppercase tracking-wider text-ink/40 font-mono block">DRAW ENTRIES</span>
                        <span className="text-lg font-bold text-white mt-1 block">1 Token Active</span>
                        <span className="text-[10px] text-[#00F5D4] block mt-1 font-mono tracking-wider">{user?.drawToken}</span>
                      </div>
                    </div>

                    {/* Quick Stats list */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/20 border border-cyan-500/10">
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-neon-gold" /> Quick Actions & Vouchers</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-ink/90 block">Discount Voucher Credit Floor</span>
                            <span className="text-xs text-ink/60">Vouchers valued at ₹500 each are credited to your wallet to redeem on paid trips.</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-semibold text-ink/90 block">Name Change Policy</span>
                            <span className="text-xs text-ink/60">Platinum plans support unlimited family name adjustments for bookings.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* QR Code and digital Boarding Pass section */}
                    <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center p-1">
                          {/* Simulated mini QR */}
                          <div className="grid grid-cols-4 gap-0.5 w-full h-full">
                            {Array.from({ length: 16 }).map((_, i) => (
                              <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-transparent'}`} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Digital Boarding Ticket</h4>
                          <p className="text-xs text-ink/50">Keep your ticket for confirmation at checkout.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs text-ink font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download/Print Ticket
                      </button>
                    </div>

                  </div>
                )}

                {/* 2. CREDITS TAB */}
                {activeTab === 'credits' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan" /> My Discount Credits Wallet
                      </h2>
                      <p className="text-xs text-ink/50 mt-1">Guaranteed value recovery. Redeem these vouchers to discount paid tour packages.</p>
                    </div>

                    {/* Vouchers Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {Array.from({ length: user?.planName?.toLowerCase()?.includes('platinum') ? 4 : user?.planName?.toLowerCase()?.includes('gold') ? 2 : 1 }).map((_, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[#081F2E]/60 border border-white/10 relative overflow-hidden shadow-lg hover:neon-border-cyan transition-all">
                          <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded bg-cyan/15 text-[9px] text-cyan font-mono font-semibold uppercase">ACTIVE VOUCHER</span>
                              <div className="text-2xl font-black text-white mt-1">₹500</div>
                            </div>
                            <Gift className="w-6 h-6 text-neon-gold" />
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                            <span className="text-ink/50">Code: <strong className="font-mono text-white">BDN-VOUCH-{idx + 1}04</strong></span>
                            <span className="text-emerald-400 font-bold">Unused</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <strong>Redemption Rule:</strong> 1 voucher (₹500 value) can be redeemed per person per paid tour booking. These credits are valid for 12 months.
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. DRAWS TAB */}
                {activeTab === 'draws' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-cyan" /> Lucky Draw Entry Status
                      </h2>
                      <p className="text-xs text-ink/50 mt-1">View your active entries and participate in transparent digital draws.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div>
                          <span className="text-[10px] text-ink/40 uppercase font-mono tracking-wider block">ACTIVE DRAW TOKEN</span>
                          <span className="text-xl font-bold text-[#00F5D4] tracking-widest font-mono mt-1 block">{user?.drawToken}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-ink/75 border-t border-white/5 pt-3">
                          <span>Upcoming Draw Date:</span>
                          <span className="font-semibold text-white flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Next Sunday
                          </span>
                        </div>
                        
                        <div className="text-[10px] text-amber-500/90 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/10">
                          ⚠️ <strong>Please Note:</strong> Our draws are 100% transparent and verified. Winners travel free. Non-selected members retain full voucher credits.
                        </div>
                      </div>

                      {/* Interactive Draw Simulator */}
                      <div className="p-5 rounded-2xl bg-[#081F2E]/80 border border-cyan-500/20 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan/5 rounded-full blur-xl pointer-events-none" />
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-1"><Sparkles className="w-4 h-4 text-neon-gold" /> Test RNG Simulator</h3>
                          <p className="text-[11px] text-ink/60 mt-1">Simulate a mock draw trial to see how our Random Number Generator verified system operates.</p>
                        </div>

                        <div className="my-4 min-h-[50px] flex items-center justify-center">
                          {isSimulatingDraw ? (
                            <div className="flex flex-col items-center gap-2 text-xs text-cyan font-mono animate-pulse">
                              <Compass className="w-6 h-6 animate-spin text-cyan" />
                              <span>GENERATING MOCK DRAW...</span>
                            </div>
                          ) : simulationResult ? (
                            <div className="text-center p-2 rounded bg-white/5 border border-white/5 text-xs text-white font-semibold leading-relaxed animate-fade-in">
                              {simulationResult}
                            </div>
                          ) : (
                            <span className="text-xs text-ink/40">Ready to test simulator</span>
                          )}
                        </div>

                        <button
                          onClick={handleSimulateDraw}
                          disabled={isSimulatingDraw}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-cosmos font-bold text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          Launch Mock Draw
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Plane className="w-5 h-5 text-cyan" /> Book Your Travel Package
                      </h2>
                      <p className="text-xs text-ink/50 mt-1">Submit a tour package request and apply your discount wallet credits.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                      <p className="text-sm text-ink/80 leading-relaxed">
                        To book a holiday, choose from our regular packages (Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand) and our agents will apply your active member vouchers automatically to reduce costs.
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <a 
                          href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20want%20to%20book%20a%20tour%20package%20using%20my%20member%20discount%20vouchers." 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/50 hover:bg-cyan/5 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <Plane className="w-5 h-5 text-cyan" />
                            <div className="text-left">
                              <span className="block text-xs font-bold text-white">Book Paid Tour</span>
                              <span className="block text-[10px] text-ink/50">Apply vouchers to save</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-cyan group-hover:translate-x-1 transition-all" />
                        </a>

                        <a 
                          href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20have%20questions%20about%20the%20upcoming%20Sunday%20lucky%20draw%20schedule." 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/50 hover:bg-cyan/5 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <Ticket className="w-5 h-5 text-cyan" />
                            <div className="text-left">
                              <span className="block text-xs font-bold text-white">Draw Support Info</span>
                              <span className="block text-[10px] text-ink/50">Inquire about rules</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-ink/40 group-hover:text-cyan group-hover:translate-x-1 transition-all" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
