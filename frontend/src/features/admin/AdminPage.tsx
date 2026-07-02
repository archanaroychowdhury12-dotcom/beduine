import { AlertTriangle, Home, Users, Layers, Ticket, Megaphone, CreditCard, Calendar, Wallet, FileText, Mail, Settings, ChevronDown, Bell, Search, Menu } from 'lucide-react';
import { AppUser } from '@/types';
import { AdminPanel } from '@/features/admin/components/AdminPanel';
import { canAccessAdmin } from '@/services/accessControl';
import { useAdminAuditLogs } from '@/features/admin/hooks/useAdminAuditLogs';
import { useAdminUsers } from '@/features/admin/hooks/useAdminUsers';
import { useAdminWalletActions } from '@/features/admin/hooks/useAdminWalletActions';
import { useFranchiseAgents } from '@/features/admin/hooks/useFranchiseAgents';
import { useState } from 'react';

interface AdminPageProps {
  user: AppUser | null;
  onBack: () => void;
  onLogout: () => void;
}

type AdminSubTab = 'overview' | 'users' | 'subscriptions' | 'trc' | 'winner' | 'nonwinner' | 'bookings' | 'payments' | 'audit' | 'support' | 'settings' | 'franchise';

interface NavItem {
  id: AdminSubTab;
  label: string;
  icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
  hasSubmenu?: boolean;
}

const navItems: NavItem[] = [
  { id: 'overview',       label: 'Admin Overview',          icon: Home },
  { id: 'users',          label: 'Users',                   icon: Users, hasSubmenu: true },
  { id: 'subscriptions',  label: 'Subscriptions',           icon: Layers, hasSubmenu: true },
  { id: 'trc',            label: 'TRC / Lucky Draw Entries', icon: Ticket },
  { id: 'winner',         label: 'Winner Management',       icon: Megaphone, hasSubmenu: true },
  { id: 'nonwinner',      label: 'Non-winner Credit Issue', icon: CreditCard },
  { id: 'bookings',       label: 'Bookings',                icon: Calendar, hasSubmenu: true },
  { id: 'payments',       label: 'Payments',                icon: Wallet, hasSubmenu: true },
  { id: 'audit',          label: 'Audit Logs',              icon: FileText, hasSubmenu: true },
  { id: 'support',        label: 'Support Tickets',         icon: Mail },
  { id: 'settings',       label: 'Settings',                icon: Settings, hasSubmenu: true },
];

export default function AdminPage({ user, onBack, onLogout: _onLogout }: AdminPageProps) {
  const isAuthorizedAdmin = canAccessAdmin(user);
  const [adminSubTab, setAdminSubTab] = useState<AdminSubTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminUsersState = useAdminUsers(user);
  const { auditLogs } = useAdminAuditLogs();
  const walletActions = useAdminWalletActions({
    user,
    selectedAdminUser: adminUsersState.selectedAdminUser,
    setSelectedAdminUser: adminUsersState.setSelectedAdminUser,
    setAdminUsers: adminUsersState.setAdminUsers,
  });
  const franchiseAgents = useFranchiseAgents({ user, setAdminUsers: adminUsersState.setAdminUsers });

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const dayStr  = now.toLocaleDateString('en-IN', { weekday: 'long' });

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-slate-950">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
          <AlertTriangle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-100 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-400 mb-6">
            This administrative area is restricted to authorized credentials only.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-bold text-sm border-none cursor-pointer transition-colors"
          >
            ← Back to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const activeTab = navItems.find(n => n.id === adminSubTab);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: '"Outfit", "Inter", sans-serif' }}>

      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body {
          font-family: 'Outfit', 'Inter', sans-serif;
        }
      `}</style>

      {/* ── Sidebar Overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 250,
          background: '#0b0f19',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 0 : 0,
          bottom: 0,
          zIndex: 50,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
        className={sidebarOpen ? 'block' : 'hidden md:flex'}
      >
        {/* ── Brand Panel (mockup gold badge) ── */}
        <div style={{ padding: '24px 16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <img src="/images/bedune_logo_badge.png" alt="Beduine Logo" style={{ height: 115, objectFit: 'contain' }} />
        </div>

        {/* User Profile */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src="/images/winner_arjun_roy.png"
              alt="Admin"
              style={{
                width: 50, height: 50, borderRadius: '50%',
                objectFit: 'cover', border: 'none',
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Admin User
              </div>
              <div>
                <span style={{
                  fontSize: 9.5, fontWeight: 650, color: '#ffffff',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  borderRadius: 12, padding: '2px 8px', display: 'inline-block'
                }}>
                  Super Admin
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '16px 12px', flex: '1 1 auto', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = adminSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setAdminSubTab(item.id); setSidebarOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  marginBottom: 4, border: 'none', cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'transparent',
                  color: isActive ? '#ffffff' : '#b2c0d2',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: 13, textAlign: 'left',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(124,58,237,0.25)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#ffffff'; } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#b2c0d2'; } }}
              >
                <Icon style={{ width: 16, height: 16, flexShrink: 0, color: isActive ? '#ffffff' : '#94a3b8' }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasSubmenu && (
                  <ChevronDown style={{ width: 14, height: 14, opacity: 0.8, color: isActive ? '#ffffff' : '#8899ac', marginLeft: 'auto' }} />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div style={{ marginLeft: 250, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Header */}
        <header style={{
          height: 70,
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              className="md:hidden"
            >
              <Menu style={{ width: 20, height: 20 }} />
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              {activeTab?.label || 'Admin Overview'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Search Box */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                placeholder="Search users, bookings, tickets..."
                style={{
                  paddingLeft: 14, paddingRight: 36, height: 38,
                  border: '1.5px solid #e2e8f0', borderRadius: 10,
                  fontSize: 12, color: '#334155', background: '#f8fafc',
                  outline: 'none', width: 260, fontWeight: 500,
                }}
              />
              <Search style={{ position: 'absolute', right: 12, width: 15, height: 15, color: '#94a3b8' }} />
            </div>

            {/* Date Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <Calendar style={{ width: 14, height: 14, color: '#6366f1' }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#1e293b' }}>{dateStr}</div>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{dayStr}</div>
              </div>
              <ChevronDown style={{ width: 12, height: 12, color: '#94a3b8', marginLeft: 4 }} />
            </div>

            {/* Bell Box */}
            <div style={{ position: 'relative' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell style={{ width: 16, height: 16, color: '#64748b' }} />
              </div>
              <div style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 900 }}>
                6
              </div>
            </div>

            {/* Profile Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8, borderLeft: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <img
                src="/images/winner_arjun_roy.png"
                alt="Admin"
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  objectFit: 'cover', border: '1px solid #e2e8f0'
                }}
              />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Admin User</div>
                <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>Super Admin</div>
              </div>
              <ChevronDown style={{ width: 12, height: 12, color: '#94a3b8' }} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#f8fafc' }}>
          <AdminPanel
            ctx={{
              adminUsers: adminUsersState.adminUsers,
              selectedAdminUser: adminUsersState.selectedAdminUser,
              setSelectedAdminUser: adminUsersState.setSelectedAdminUser,
              adminCustomAmount: walletActions.adminCustomAmount,
              setAdminCustomAmount: walletActions.setAdminCustomAmount,
              adminFilter: adminUsersState.adminFilter,
              setAdminFilter: adminUsersState.setAdminFilter,
              adminSubTab,
              setAdminSubTab,
              auditLogs,
              handleResetAllDemoUsers: adminUsersState.handleResetAllDemoUsers,
              handleResetSelectedDemoUser: adminUsersState.handleResetSelectedDemoUser,
              handleAdminAddBalance: walletActions.handleAdminAddBalance,
              handleAdminRemoveBalance: walletActions.handleAdminRemoveBalance,
              franchises: franchiseAgents.franchises,
              agents: franchiseAgents.agents,
              newAgentName: franchiseAgents.newAgentName,
              setNewAgentName: franchiseAgents.setNewAgentName,
              newAgentEmail: franchiseAgents.newAgentEmail,
              setNewAgentEmail: franchiseAgents.setNewAgentEmail,
              newAgentPhone: franchiseAgents.newAgentPhone,
              setNewAgentPhone: franchiseAgents.setNewAgentPhone,
              newAgentFranchiseId: franchiseAgents.newAgentFranchiseId,
              setNewAgentFranchiseId: franchiseAgents.setNewAgentFranchiseId,
              newAgentEarningModel: franchiseAgents.newAgentEarningModel,
              setNewAgentEarningModel: franchiseAgents.setNewAgentEarningModel,
              newAgentTarget: franchiseAgents.newAgentTarget,
              setNewAgentTarget: franchiseAgents.setNewAgentTarget,
              handleAddAgent: franchiseAgents.handleAddAgent,
              handleToggleEarningModel: franchiseAgents.handleToggleEarningModel,
              handleUpdateAgentTarget: franchiseAgents.handleUpdateAgentTarget,
              handleReleasePayout: franchiseAgents.handleReleasePayout,
            }}
          />
        </main>
      </div>
    </div>
  );
}
