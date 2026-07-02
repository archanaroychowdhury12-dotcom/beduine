import React from 'react';
import { ShieldCheck, Trash2, RefreshCw, User, Wallet, Plus, Minus, TrendingUp, Users, Star, Trophy, CreditCard, BookOpen, UserPlus, TicketCheck, Award, ArrowUpRight } from 'lucide-react';
import { AdminFranchiseAgentTab } from './AdminFranchiseAgentTab';
import { AdminDrawOperations } from './AdminDrawOperations';
import { CancellationAdminPage } from './CancellationAdminPage';
import { AdminSupportTicketsPage } from './AdminSupportTicketsPage';
import { Agent, CreditLedgerEntry, DemoTransactionRecord, Franchise, SupabaseRawUser } from '@/types';
import { AuditLogEntry } from '@/services/auditLogService';

type AdminFilter = 'all' | 'real' | 'demo';
type AdminSubTab = 'overview' | 'users' | 'subscriptions' | 'trc' | 'winner' | 'nonwinner' | 'bookings' | 'payments' | 'audit' | 'support' | 'settings' | 'franchise';
type AdminTransactionRow = DemoTransactionRecord & { email?: string | null; wallet_type: 'real' | 'demo' };

type AdminPanelContext = {
  adminUsers: SupabaseRawUser[];
  selectedAdminUser: SupabaseRawUser | null;
  setSelectedAdminUser: React.Dispatch<React.SetStateAction<SupabaseRawUser | null>>;
  adminCustomAmount: string;
  setAdminCustomAmount: React.Dispatch<React.SetStateAction<string>>;
  adminFilter: AdminFilter;
  setAdminFilter: React.Dispatch<React.SetStateAction<AdminFilter>>;
  adminSubTab: AdminSubTab;
  setAdminSubTab: React.Dispatch<React.SetStateAction<AdminSubTab>>;
  auditLogs: AuditLogEntry[];
  handleResetAllDemoUsers: () => void | Promise<void>;
  handleResetSelectedDemoUser: (user: SupabaseRawUser) => void | Promise<void>;
  handleAdminAddBalance: () => void | Promise<void>;
  handleAdminRemoveBalance: () => void | Promise<void>;
  franchises: Franchise[];
  agents: Agent[];
  newAgentName: string;
  setNewAgentName: React.Dispatch<React.SetStateAction<string>>;
  newAgentEmail: string;
  setNewAgentEmail: React.Dispatch<React.SetStateAction<string>>;
  newAgentPhone: string;
  setNewAgentPhone: React.Dispatch<React.SetStateAction<string>>;
  newAgentFranchiseId: string;
  setNewAgentFranchiseId: React.Dispatch<React.SetStateAction<string>>;
  newAgentEarningModel: 'salary' | 'commission';
  setNewAgentEarningModel: React.Dispatch<React.SetStateAction<'salary' | 'commission'>>;
  newAgentTarget: string;
  setNewAgentTarget: React.Dispatch<React.SetStateAction<string>>;
  handleAddAgent: (event: React.FormEvent) => void;
  handleToggleEarningModel: (agentId: string) => void;
  handleUpdateAgentTarget: (agentId: string, newTargetVal: string) => void;
  handleReleasePayout: (agent: Agent) => void | Promise<void>;
};

type AdminPanelProps = { ctx: AdminPanelContext };

// ── Shared Card Wrapper ─────────────────────────────────────────────────────
const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', ...style }}>
    {children}
  </div>
);

// ── Stat Card Component ─────────────────────────────────────────────────────
function StatCard({ label, value, growth, icon: Icon, color }: { label: string; value: string; growth: string; icon: React.FC<any>; color: string }) {
  return (
    <Card style={{ padding: '18px 20px', flex: 1, minWidth: 160 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon style={{ width: 20, height: 20, color }} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'none', marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
            <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700 }}>{growth}</span>
            <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>this month</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Revenue Overview Line Chart (Y-Axis Labeled, matches Mockup) ─────────────
function RevenueChart() {
  const data = [12, 18, 14, 22, 19, 28, 24, 32, 29, 38, 34, 42, 38, 45, 41, 50, 46, 54, 49, 58, 53, 62, 57, 65, 60, 68, 63, 72, 68, 75, 71];
  const max = 80;
  const W = 460; const H = 160;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`).join(' ');
  const areaPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Revenue Overview</h3>
        <select style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc', fontWeight: 600 }}>
          <option>This Month</option>
          <option>Last Month</option>
          <option>Last 3 Months</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Y Axis Labels (Left Side) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: H - 10, fontSize: 10, color: '#94a3b8', fontWeight: 700, textAlign: 'right', width: 34 }}>
          <span>₹50L</span>
          <span>₹40L</span>
          <span>₹30L</span>
          <span>₹20L</span>
          <span>₹10L</span>
          <span>₹0</span>
        </div>
        {/* SVG Curve */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
              </linearGradient>
            </defs>
            {/* Grid Lines */}
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((f, i) => (
              <line key={i} x1="0" y1={H - f * H} x2={W} y2={H - f * H} stroke="#f1f5f9" strokeWidth="1" />
            ))}
            {/* Gradient Fill */}
            <polygon points={areaPoints} fill="url(#revenueAreaGrad)" />
            {/* Line Path */}
            <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {/* Tooltip & Pointer on 18 May */}
            <circle cx={(17 / 30) * W} cy={H - (58 / max) * H} r="4" fill="#6366f1" stroke="#fff" strokeWidth="2" />
            <rect x={(17 / 30) * W - 42} y={H - (58 / max) * H - 36} width="84" height="24" rx="6" fill="#1e293b" />
            <text x={(17 / 30) * W} y={H - (58 / max) * H - 24} textAnchor="middle" fontSize="9" fill="#fff" fontWeight="800">₹32,45,210</text>
            <text x={(17 / 30) * W} y={H - (58 / max) * H - 15} textAnchor="middle" fontSize="7.5" fill="#94a3b8">18 May</text>
          </svg>
        </div>
      </div>
      {/* X Axis Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 46, marginTop: 6 }}>
        {['1 May', '5 May', '10 May', '15 May', '20 May', '25 May', '31 May'].map(d => (
          <span key={d} style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

// ── Subscriptions Donut Chart (Matches colors & design of the mockup) ────────
function SubscriptionsDonut({ domestic, international, premium }: { domestic: number; international: number; premium: number }) {
  const total = domestic + international + premium;
  const r = 50; const cx = 60; const cy = 60;
  const circ = 2 * Math.PI * r;

  const pct = (v: number) => (v / total) * circ;
  const d1 = pct(domestic);
  const d2 = pct(international);
  const d3 = pct(premium);

  const seg = (dasharray: number, dashoffset: number, color: string, key: string) => (
    <circle key={key} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="15"
      strokeDasharray={`${dasharray} ${circ - dasharray}`}
      strokeDashoffset={-dashoffset}
      style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
    />
  );

  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Subscriptions by Plan</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, flexShrink: 0 }}>
          {seg(d1, 0, '#8b5cf6', 'dom')}          {/* Purple - Domestic */}
          {seg(d2, d1, '#3b82f6', 'intl')}         {/* Blue - International */}
          {seg(d3, d1 + d2, '#f59e0b', 'prem')}     {/* Orange - Premium */}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {[
            { label: 'Domestic Plan', count: domestic, color: '#8b5cf6' },
            { label: 'International Plan', count: international, color: '#3b82f6' },
            { label: 'Premium Plan', count: premium, color: '#f59e0b' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{item.count.toLocaleString()} ({Math.round((item.count / total) * 100)}%)</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Quick Actions ────────────────────────────────────────────────────────────
function QuickActions({ setAdminSubTab }: { setAdminSubTab: React.Dispatch<React.SetStateAction<AdminSubTab>> }) {
  const actions = [
    { label: 'Add User',         icon: UserPlus,    color: '#8b5cf6', bg: '#f5f3ff', tab: 'users' as AdminSubTab },
    { label: 'New Subscription', icon: Star,        color: '#22c55e', bg: '#f0fdf4', tab: 'subscriptions' as AdminSubTab },
    { label: 'TRC Entry Report', icon: TicketCheck, color: '#f59e0b', bg: '#fffbeb', tab: 'trc' as AdminSubTab },
    { label: 'Add Winner',       icon: Award,       color: '#ef4444', bg: '#fef2f2', tab: 'winner' as AdminSubTab },
    { label: 'Issue Credit',     icon: CreditCard,  color: '#3b82f6', bg: '#eff6ff', tab: 'nonwinner' as AdminSubTab },
    { label: 'View Bookings',    icon: BookOpen,    color: '#0fa5e9', bg: '#f0f9ff', tab: 'bookings' as AdminSubTab },
  ];
  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {actions.map(a => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={() => setAdminSubTab(a.tab)}
              style={{
                background: a.bg, border: 'none',
                borderRadius: 12, padding: '14px 8px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <Icon style={{ width: 16, height: 16, color: a.color }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1e293b', textAlign: 'center', lineHeight: 1.2 }}>{a.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Sunday Lucky Draw Banner ─────────────────────────────────────────────────
function LuckyDrawBanner({ setAdminSubTab }: { setAdminSubTab: React.Dispatch<React.SetStateAction<AdminSubTab>> }) {
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(135deg, #3f3cbb 0%, #5b21b6 50%, #4c1d95 100%)',
      padding: '20px', position: 'relative', marginTop: 14,
    }}>
      {/* Decorative stars */}
      {[[12, 12], [80, 16], [45, 6], [140, 12], [180, 8]].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', top: y, left: `${x}%`, width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>Sunday Lucky Draw</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Next Draw: 25 May 2025, 7:00 PM</div>
          <button
            onClick={() => setAdminSubTab('winner')}
            style={{
              background: '#6366f1', border: 'none',
              borderRadius: 8, padding: '7px 14px', color: '#fff', fontWeight: 700, fontSize: 10.5,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Go to Lucky Draw
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpRight style={{ width: 10, height: 10, color: '#fff' }} />
            </div>
          </button>
        </div>
        {/* Trophy icon */}
        <div style={{ fontSize: 48, lineHeight: 1, userSelect: 'none' }}>🏆</div>
      </div>
    </div>
  );
}

// ── Bookings by Status Donut (Confirmed: green, Pending: orange, Cancelled: red, Completed: blue) ──
function BookingsStatusDonut() {
  const data = [
    { label: 'Confirmed', count: 2256, color: '#22c55e', pct: 0.60 },
    { label: 'Pending',   count: 892,  color: '#f59e0b', pct: 0.24 },
    { label: 'Cancelled', count: 412,  color: '#ef4444', pct: 0.11 },
    { label: 'Completed', count: 225,  color: '#3b82f6', pct: 0.05 },
  ];
  const r = 46; const cx = 52; const cy = 52;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Bookings by Status</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg viewBox="0 0 104 104" style={{ width: 104, height: 104, flexShrink: 0 }}>
          {data.map(d => {
            const dash = d.pct * circ;
            const el = (
              <circle key={d.label} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth="14"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {data.map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
              <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>{d.label}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginLeft: 'auto' }}>{d.count.toLocaleString()} ({Math.round(d.pct * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Top Tour Destinations (Rank color codes match mockup) ────────────────────
function TopDestinations() {
  const destinations = [
    { name: 'Darjeeling', count: 1256, color: '#6366f1' },
    { name: 'Kashmir',    count: 1102, color: '#ec4899' },
    { name: 'Digha',      count: 856,  color: '#8b5cf6' },
    { name: 'Goa',        count: 642,  color: '#0ea5e9' },
    { name: 'Kerala',     count: 512,  color: '#3b82f6' },
  ];
  const max = destinations[0].count;
  const rankColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#0ea5e9', '#6366f1'];

  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Top Tour Destinations</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {destinations.map((d, i) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 16, fontSize: 12, color: rankColors[i], fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ width: 90, fontSize: 12, color: '#1e293b', fontWeight: 700, flexShrink: 0 }}>{d.name}</span>
            <div style={{ flex: 1, height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(d.count / max) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 99 }} />
            </div>
            <span style={{ width: 36, fontSize: 11, color: '#1e293b', fontWeight: 700, textAlign: 'right', flexShrink: 0 }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent Bookings Table ───────────────────────────────────────────────────
function RecentBookings({ setAdminSubTab }: { setAdminSubTab: React.Dispatch<React.SetStateAction<AdminSubTab>> }) {
  const bookings = [
    { id: 'BK-2025-1258', customer: 'Arindam Pal',    tour: 'Darjeeling Group Tour', departure: '28 May 2025', amount: '₹18,500', status: 'Confirmed' },
    { id: 'BK-2025-1257', customer: 'Sneha Roy',       tour: 'Kashmir Paradise',      departure: '05 Jun 2025', amount: '₹42,000', status: 'Pending' },
    { id: 'BK-2025-1256', customer: 'Rajat Shaw',      tour: 'Goa Beach Holiday',     departure: '15 May 2025', amount: '₹16,800', status: 'Confirmed' },
    { id: 'BK-2025-1255', customer: 'Pooja Sharma',    tour: 'Kerala Backwaters',     departure: '22 May 2025', amount: '₹23,600', status: 'Confirmed' },
    { id: 'BK-2025-1254', customer: 'Subhankar Dey',   tour: 'Digha Weekend Tour',    departure: '30 May 2025', amount: '₹7,999',  status: 'Cancelled' },
  ];
  const statusColor: Record<string, { bg: string; color: string }> = {
    Confirmed: { bg: '#f0fdf4', color: '#16a34a' },
    Pending:   { bg: '#fffbeb', color: '#d97706' },
    Cancelled: { bg: '#fef2f2', color: '#dc2626' },
    Completed: { bg: '#eff6ff', color: '#2563eb' },
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Recent Bookings</h3>
        <button
          onClick={() => setAdminSubTab('bookings')}
          style={{ padding: '6px 14px', borderRadius: 8, background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer' }}
        >
          View All Bookings
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #f1f5f9' }}>
              {['Booking ID', 'Customer', 'Tour', 'Departure', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => {
              const sc = statusColor[b.status] || statusColor.Pending;
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                >
                  <td style={{ padding: '12px', fontWeight: 700, color: '#6366f1', fontFamily: 'monospace', fontSize: 11 }}>{b.id}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{b.customer}</td>
                  <td style={{ padding: '12px', color: '#475569', fontWeight: 500 }}>{b.tour}</td>
                  <td style={{ padding: '12px', color: '#64748b', fontWeight: 550, whiteSpace: 'nowrap' }}>{b.departure}</td>
                  <td style={{ padding: '12px', fontWeight: 750, color: '#0f172a' }}>{b.amount}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 10, fontWeight: 705, background: sc.bg, color: sc.color }}>{b.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Recent Activity Feed ─────────────────────────────────────────────────────
function RecentActivity() {
  const activities = [
    { icon: '👤', title: 'New user registered', detail: 'Rahul Das (BDU-2025-12458)',         time: '2 mins ago',  color: '#6366f1' },
    { icon: '⭐', title: 'Subscription purchased', detail: 'International Plan by Priya Singh', time: '15 mins ago', color: '#3b82f6' },
    { icon: '🎫', title: 'TRC entry received', detail: 'Ticket #TRC-2025-88521',               time: '32 mins ago', color: '#f59e0b' },
    { icon: '🏆', title: 'Winner declared', detail: 'Amit Mondal (BDU-2024-99876)',             time: '1 hour ago',  color: '#ef4444' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Recent Activity</h3>
        <button style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {activities.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
              {a.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{a.title}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 550, marginTop: 2 }}>{a.detail}</div>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Master Component Export ──────────────────────────────────────────────────
export function AdminPanel({ ctx }: AdminPanelProps) {
  const isProduction = import.meta.env.VITE_BACKEND_MODE === 'production';
  const adminUsers = ctx.adminUsers;
  const {
    selectedAdminUser, setSelectedAdminUser,
    adminCustomAmount, setAdminCustomAmount,
    adminFilter, setAdminFilter,
    adminSubTab, setAdminSubTab,
    handleResetAllDemoUsers, handleResetSelectedDemoUser,
    handleAdminAddBalance, handleAdminRemoveBalance,
    auditLogs = [],
  } = ctx;

  const allUsersList = adminUsers;
  const realRevenue = allUsersList.reduce((sum: number, u: SupabaseRawUser) => {
    const txns = u.user_metadata?.real_transactions || [];
    return sum + txns.reduce((txSum: number, t: DemoTransactionRecord) => txSum + Math.max(0, t.amount || 0), 0);
  }, 0);
  const demoRevenue = allUsersList.reduce((sum: number, u: SupabaseRawUser) => {
    const txns = u.user_metadata?.demo_transactions || [];
    return sum + txns.reduce((txSum: number, t: DemoTransactionRecord) => txSum + Math.max(0, t.amount || 0), 0);
  }, 0);
  const transactionsList = allUsersList.flatMap((u: SupabaseRawUser): AdminTransactionRow[] => {
    const realTxns = (u.user_metadata?.real_transactions || []).map((t: DemoTransactionRecord) => ({ ...t, email: u.email, wallet_type: 'real' as const }));
    const demoTxns = (u.user_metadata?.demo_transactions || []).map((t: DemoTransactionRecord) => ({ ...t, email: u.email, wallet_type: 'demo' as const }));
    return [...realTxns, ...demoTxns];
  }).sort((a: AdminTransactionRow, b: AdminTransactionRow) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const activeSubscriptions = allUsersList.filter((u) =>
    u.user_metadata?.subscriptionStatus === 'active' || u.user_metadata?.subscription_payment_record?.payment_status === 'success'
  );

  // ── OVERVIEW TAB ──────────────────────────────────────────────────────────
  if (adminSubTab === 'overview') {
    if (isProduction) {
      const verifiedWebhookCount = auditLogs.filter(
        (log: AuditLogEntry) => log.action === 'PAYMENT_WEBHOOK_VERIFIED',
      ).length;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <StatCard label="Total Users" value={allUsersList.length.toLocaleString()} growth="" icon={Users} color="#8b5cf6" />
            <StatCard label="Active Subscriptions" value={activeSubscriptions.length.toLocaleString()} growth="" icon={ShieldCheck} color="#3b82f6" />
            <StatCard label="Verified Webhooks" value={verifiedWebhookCount.toLocaleString()} growth="" icon={TicketCheck} color="#f59e0b" />
            <StatCard label="Audit Events" value={auditLogs.length.toLocaleString()} growth="" icon={BookOpen} color="#0ea5e9" />
            <StatCard label="Verified Revenue" value={`₹${realRevenue.toLocaleString('en-IN')}`} growth="" icon={TrendingUp} color="#22c55e" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 0.8fr) minmax(420px, 1.4fr)', gap: 16 }}>
            <Card style={{ padding: '20px' }}>
              <QuickActions setAdminSubTab={setAdminSubTab} />
            </Card>
            <Card style={{ padding: '20px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Latest Audit Events</h3>
                <button
                  type="button"
                  onClick={() => setAdminSubTab('audit')}
                  style={{ border: 0, background: 'transparent', color: '#6366f1', cursor: 'pointer', fontSize: 12, fontWeight: 750 }}
                >
                  View all
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {auditLogs.slice(0, 6).map((log: AuditLogEntry) => (
                  <div key={log.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) auto', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: '#1e293b', fontFamily: 'monospace', fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.action}</div>
                      <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 3 }}>{log.actorEmail}</div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: 10, whiteSpace: 'nowrap' }}>{new Date(log.created_at).toLocaleString('en-IN')}</div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>No audit events yet.</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      );
    }

    const domestic = Math.max(1, Math.round(activeSubscriptions.length * 0.62));
    const international = Math.max(1, Math.round(activeSubscriptions.length * 0.32));
    const premium = Math.max(1, activeSubscriptions.length - domestic - international);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Row 1: 6 Stat Cards ── */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <StatCard label="Total Users"           value={allUsersList.length ? allUsersList.length.toLocaleString() : '12,586'} growth="↑ 12.5%"  icon={Users}       color="#8b5cf6" />
          <StatCard label="Active Subscriptions"  value={activeSubscriptions.length ? activeSubscriptions.length.toLocaleString() : '8,452'}     growth="↑ 8.3%"   icon={ShieldCheck} color="#3b82f6" />
          <StatCard label="TRC Entries"           value="0" growth="" icon={TicketCheck} color="#f59e0b" />
          <StatCard label="Winners (This Month)"  value="0" growth="" icon={Trophy} color="#22c55e" />
          <StatCard label="Bookings (This Month)" value="3,785"  growth="↑ 9.8%"   icon={BookOpen}    color="#0ea5e9" />
          <StatCard label="Total Revenue"         value={realRevenue > 0 ? `₹${realRevenue.toLocaleString('en-IN')}` : '₹2,45,68,450'} growth="↑ 14.6%" icon={TrendingUp} color="#8b5cf6" />
        </div>

        {/* ── Row 2: Revenue Chart | Subscriptions Donut | Quick Actions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.15fr 1.15fr', gap: 16 }}>
          <Card style={{ padding: '22px 24px' }}>
            <RevenueChart />
          </Card>
          <Card style={{ padding: '22px 24px' }}>
            <SubscriptionsDonut domestic={domestic + (activeSubscriptions.length === 0 ? 5264 : 0)} international={international + (activeSubscriptions.length === 0 ? 2756 : 0)} premium={premium + (activeSubscriptions.length === 0 ? 432 : 0)} />
          </Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card style={{ padding: '20px 20px', flex: 1 }}>
              <QuickActions setAdminSubTab={setAdminSubTab} />
            </Card>
            <LuckyDrawBanner setAdminSubTab={setAdminSubTab} />
          </div>
        </div>

        {/* ── Row 3: Bookings Status | Top Destinations ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card style={{ padding: '22px 24px' }}>
            <BookingsStatusDonut />
          </Card>
          <Card style={{ padding: '22px 24px' }}>
            <TopDestinations />
          </Card>
        </div>

        {/* ── Row 4: Recent Bookings Table | Recent Activity ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          <Card style={{ padding: '22px 24px' }}>
            <RecentBookings setAdminSubTab={setAdminSubTab} />
          </Card>
          <Card style={{ padding: '22px 24px' }}>
            <RecentActivity />
          </Card>
        </div>
      </div>
    );
  }

  // ── ALL OTHER TABS (clean functional UI wrapper) ─────────────────────────
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>

      {/* Tab Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck style={{ width: 18, height: 18, color: '#6366f1' }} />
          {adminSubTab === 'users'         && 'User Management'}
          {adminSubTab === 'subscriptions' && 'Subscriptions'}
          {adminSubTab === 'trc'           && 'TRC / Lucky Draw Entries'}
          {adminSubTab === 'winner'        && 'Winner Management'}
          {adminSubTab === 'nonwinner'     && 'Non-winner Credit Issue'}
          {adminSubTab === 'bookings'      && 'Bookings'}
          {adminSubTab === 'payments'      && 'Payments'}
          {adminSubTab === 'audit'         && 'Audit Logs'}
          {adminSubTab === 'support'       && 'Support Tickets'}
          {adminSubTab === 'settings'      && 'Settings'}
          {adminSubTab === 'franchise'     && 'Franchise & Agents'}
        </h2>
        {adminSubTab === 'users' && !isProduction && (
          <button
            onClick={handleResetAllDemoUsers}
            style={{ padding: '8px 16px', borderRadius: 10, background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Trash2 style={{ width: 14, height: 14 }} /> Reset All Accounts
          </button>
        )}
      </div>

      {/* ── Subscriptions ── */}
      {adminSubTab === 'subscriptions' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['User', 'Plan', 'Status', 'UID'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>)}
            </tr></thead>
            <tbody>{activeSubscriptions.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1e293b' }}>{u.email}</td>
                <td style={{ padding: '12px 14px', color: '#475569', fontWeight: 600 }}>{String(u.user_metadata?.activePlan || u.user_metadata?.selectedPlan || 'Active Plan')}</td>
                <td style={{ padding: '12px 14px' }}><span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: '#f0fdf4', color: '#16a34a' }}>Active</span></td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#64748b' }}>{String(u.user_metadata?.uid || u.user_metadata?.memberId || '—')}</td>
              </tr>
            ))}
            {activeSubscriptions.length === 0 && <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No active subscriptions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* ── TRC ── */}
      {adminSubTab === 'trc' && (
        <AdminDrawOperations mode="status" />
      )}

      {/* ── Non-winner Credit ── */}
      {adminSubTab === 'nonwinner' && (
        <AdminDrawOperations mode="nonwinner" />
      )}

      {/* ── Bookings ── */}
      {adminSubTab === 'bookings' && (
        <CancellationAdminPage />
      )}

      {/* ── Payments ── */}
      {adminSubTab === 'payments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isProduction ? '1fr' : '1fr 1fr', gap: 14 }}>
            <div style={{ padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 8, textTransform: 'uppercase' }}>Verified Real Revenue</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#15803d' }}>₹{realRevenue.toLocaleString('en-IN')}</div>
            </div>
            {!isProduction && (
              <div style={{ padding: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Simulated Demo Volume</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#475569' }}>₹{demoRevenue.toLocaleString('en-IN')}</div>
              </div>
            )}
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 550 }}>Webhook verified payment events appear in Audit Logs.</p>
        </div>
      )}

      {/* ── Support ── */}
      {adminSubTab === 'support' && (
        <AdminSupportTicketsPage />
      )}

      {/* ── Settings ── */}
      {adminSubTab === 'settings' && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, textAlign: 'center', color: '#64748b', fontWeight: 550 }}>
          Production switches: demo mode, draw schedule, payment gateway, support contacts and legal copy.
        </div>
      )}

      {/* ── Winner Management ── */}
      {adminSubTab === 'winner' && (
        <AdminDrawOperations mode="winner" />
      )}

      {/* ── Franchise ── */}
      {adminSubTab === 'franchise' && <AdminFranchiseAgentTab ctx={ctx} />}

      {/* ── Users ── */}
      {adminSubTab === 'users' && isProduction && (
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['User', 'UID', 'Role', 'Plan', 'Status'].map((heading) => (
                <th key={heading} style={{ padding: 12, textAlign: 'left', color: '#64748b' }}>{heading}</th>
              ))}
            </tr></thead>
            <tbody>{adminUsers.map((account) => (
              <tr key={account.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: 12, fontWeight: 700 }}>{account.email}</td>
                <td style={{ padding: 12, fontFamily: 'monospace' }}>{String(account.user_metadata?.uid || '-')}</td>
                <td style={{ padding: 12 }}>{String(account.user_metadata?.role || 'customer')}</td>
                <td style={{ padding: 12 }}>{String(account.user_metadata?.planName || '-')}</td>
                <td style={{ padding: 12 }}>{String(account.user_metadata?.subscriptionStatus || 'inactive')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {adminSubTab === 'users' && !isProduction && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div style={{ padding: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', marginBottom: 6 }}>Verified Real Revenue</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#15803d' }}>₹{realRevenue.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ padding: 20, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>Simulated Demo Volume</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#475569' }}>₹{demoRevenue.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User style={{ width: 14, height: 14, color: '#94a3b8' }} /> Users List ({allUsersList.length})
                </h3>
                <select value={adminFilter} onChange={(e) => setAdminFilter(e.target.value as AdminFilter)}
                  style={{ fontSize: 11, padding: '5px 10px', borderRadius: 8, border: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc', fontWeight: 650 }}>
                  <option value="all">All Profiles</option>
                  <option value="real">Real Subscription</option>
                  <option value="demo">Demo Wallet User</option>
                </select>
              </div>
              <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 12, maxHeight: 420, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead><tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                    {['User Email', 'Active Plan', 'Demo Wallet', 'Reset'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {allUsersList.filter(u => {
                      if (adminFilter === 'real') return u.user_metadata?.subscription_source === 'real';
                      if (adminFilter === 'demo') return u.user_metadata?.is_demo_user || u.user_metadata?.subscription_source === 'demo';
                      return true;
                    }).map((u) => {
                      const isSel = selectedAdminUser?.id === u.id;
                      return (
                        <tr key={u.id} onClick={() => { setSelectedAdminUser(u); setAdminCustomAmount(''); }}
                          style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: isSel ? '#eef2ff' : '' }}>
                          <td style={{ padding: '12px' }}>
                            <div style={{ fontWeight: 700, color: isSel ? '#6366f1' : '#1e293b' }}>{u.email}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }}>{u.id.slice(0, 8)}...</div>
                          </td>
                          <td style={{ padding: '12px', color: '#475569', fontWeight: 600 }}>
                            {u.user_metadata?.planName ? <span style={{ fontWeight: 700, color: '#1e293b' }}>{u.user_metadata.planName}</span> : <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>None</span>}
                          </td>
                          <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>₹{(u.user_metadata?.demo_wallet_balance ?? 0).toLocaleString('en-IN')}</td>
                          <td style={{ padding: '12px' }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleResetSelectedDemoUser(u)}
                              style={{ padding: '6px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer' }}>
                              <RefreshCw style={{ width: 13, height: 13, color: '#ef4444' }} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp style={{ width: 14, height: 14, color: '#94a3b8' }} /> Ledger Controls
              </h3>
              {selectedAdminUser ? (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{selectedAdminUser.email}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }}>ID: {selectedAdminUser.id}</div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: '#eef2ff', color: '#6366f1' }}>Selected</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Demo Wallet</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>₹{(selectedAdminUser.user_metadata?.demo_wallet_balance ?? 0).toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Credits</div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#6366f1' }}>{selectedAdminUser.user_metadata?.discount_credits ?? 0}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>Modify Demo Balance</div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>₹</span>
                      <input type="number" placeholder="Amount (e.g. 5000)" value={adminCustomAmount} onChange={(e) => setAdminCustomAmount(e.target.value)}
                        style={{ width: '100%', paddingLeft: 28, paddingRight: 12, height: 38, border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12, color: '#1e293b', background: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button onClick={handleAdminAddBalance}
                      style={{ padding: '10px 0', background: '#22c55e', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Plus style={{ width: 14, height: 14 }} /> Add
                    </button>
                    <button onClick={handleAdminRemoveBalance}
                      style={{ padding: '10px 0', background: '#fef2f2', color: '#ef4444', borderRadius: 10, fontWeight: 700, fontSize: 12, border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Minus style={{ width: 14, height: 14 }} /> Deduct
                    </button>
                  </div>
                  <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8 }}>Ledger ({selectedAdminUser.user_metadata?.ledger?.length || 0})</div>
                    <div style={{ maxHeight: 150, overflowY: 'auto' }}>
                      {(selectedAdminUser.user_metadata?.ledger || []).map((entry: CreditLedgerEntry) => (
                        <div key={entry.id} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #f1f5f9', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{entry.reason}</div>
                            <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>{entry.date}</div>
                          </div>
                          <div style={{ fontWeight: 800, color: '#6366f1', fontFamily: 'monospace' }}>+{entry.amount} Cr</div>
                        </div>
                      ))}
                      {(!selectedAdminUser.user_metadata?.ledger || selectedAdminUser.user_metadata.ledger.length === 0) && (
                        <div style={{ textAlign: 'center', color: '#94a3b8', padding: 16, fontStyle: 'italic', fontSize: 12 }}>No ledger entries yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                  <Wallet style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.4 }} />
                  <p style={{ fontSize: 12, fontStyle: 'italic' }}>Select a user to modify their demo wallet balance.</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Log */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck style={{ width: 14, height: 14, color: '#6366f1' }} /> Master Simulated System Log ({transactionsList.length} Transactions)
            </h3>
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 12, maxHeight: 300, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead><tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                  {['Txn Code', 'Tester Profile', 'Description', 'Wallet Type', 'Amount', 'Time'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {transactionsList.map((txn: AdminTransactionRow) => {
                    const isDebit = txn.amount < 0;
                    return (
                      <tr key={txn.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#6366f1', fontSize: 11 }}>{txn.id}</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{txn.email}</td>
                        <td style={{ padding: '12px', color: '#475569', fontWeight: 500 }}>{txn.reason}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: txn.wallet_type === 'real' ? '#f0fdf4' : '#f8fafc', color: txn.wallet_type === 'real' ? '#16a34a' : '#64748b', border: `1px solid ${txn.wallet_type === 'real' ? '#bbf7d0' : '#e2e8f0'}` }}>
                            {txn.wallet_type}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 750, color: isDebit ? '#ef4444' : '#22c55e' }}>{isDebit ? '-' : '+'}₹{Math.abs(txn.amount).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '12px', color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap', fontWeight: 550 }}>{new Date(txn.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                      </tr>
                    );
                  })}
                  {transactionsList.length === 0 && <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No simulated wallet transactions recorded yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Audit Logs ── */}
      {adminSubTab === 'audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {[
              { label: 'Audit Events', value: auditLogs.length, color: '#6366f1', bg: '#eef2ff' },
              { label: 'Webhook Verified', value: auditLogs.filter((log: AuditLogEntry) => log.action === 'PAYMENT_WEBHOOK_VERIFIED').length, color: '#22c55e', bg: '#f0fdf4' },
              { label: 'Failed/Hold', value: auditLogs.filter((log: AuditLogEntry) => log.status === 'failed' || String(log.action).includes('FAILED') || String(log.action).includes('CHARGEBACK')).length, color: '#ef4444', bg: '#fef2f2' },
            ].map(item => (
              <div key={item.label} style={{ padding: 18, background: item.bg, borderRadius: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: item.color, textTransform: 'uppercase', marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: 12, maxHeight: 520, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead><tr style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                {['Time', 'Action', 'Actor', 'Target', 'Amount', 'Reason', 'Status'].map(h => <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {auditLogs.map((log: AuditLogEntry) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px', color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{new Date(log.created_at).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#1e293b', fontSize: 11 }}>{log.action}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{log.actorEmail}</div>
                      <div style={{ fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', marginTop: 2 }}>{log.actorRole}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#475569', fontSize: 11, fontWeight: 550 }}>{log.targetEmail || log.targetId || '—'}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 750, color: '#0f172a' }}>{typeof log.amount === 'number' ? `₹${Math.abs(log.amount).toLocaleString('en-IN')}` : '—'}</td>
                    <td style={{ padding: '12px', color: '#475569', maxWidth: 220, fontWeight: 500 }}>{log.reason}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: log.status === 'failed' ? '#fef2f2' : log.status === 'pending' ? '#fffbeb' : '#f0fdf4', color: log.status === 'failed' ? '#dc2626' : log.status === 'pending' ? '#d97706' : '#16a34a' }}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {auditLogs.length === 0 && <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No audit events yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
