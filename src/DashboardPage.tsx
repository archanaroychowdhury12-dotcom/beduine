import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShieldCheck, Ticket, CreditCard, Plane, Route, Share2, Bell, Phone, User
} from 'lucide-react';
import { customTourService } from './services/customTourService';
import { CustomTourRequest, CreditLedgerEntry } from './types';
import { supabase } from './utils/supabaseClient';
import { demoWalletService } from './services/demoWalletService';
import { getAvailableCredits } from './utils/creditHelpers';

// Subcomponents
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { SubscriptionTab } from './components/dashboard/SubscriptionTab';
import { TravelRewardTab } from './components/dashboard/TravelRewardTab';
import { CreditsTab } from './components/dashboard/CreditsTab';
import { BookingsTab, CustomToursTab, ReferralsTab, NotificationsTab, SupportTab } from './components/dashboard/BookingsTab';
import { ProfileTab } from './components/dashboard/ProfileTab';
import { AdminDrawPanel } from './components/dashboard/AdminDrawPanel';

interface DashboardPageProps {
  user: any;
  onLogout: () => void;
  onBookPaidTour?: () => void;
  onBack?: () => void;
  onGoToAdmin?: () => void;
}

// CreditLedgerEntry is now imported from './types'

const DEFAULT_DASHBOARD_BG = '/images/chatgpt_dashboard_bg.png';
const DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg_v2';
const LEGACY_DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg';

// Helper to generate 1,000 mock participants for weekly draw selection
const generateMockParticipants = () => {
  const plans = ['Silver Plan', 'Gold Plan', 'Platinum Plan'];
  const list = [];
  
  // Specific mock participants (first 10 items) to match user disputes/stories
  const specific = [
    {
      id: '1',
      name: 'Amit Sen',
      email: 'amit.sen@example.com',
      phone: '+91 9830012345',
      plan: 'Silver Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '2',
      name: 'Sonia Das',
      email: 'sonia.das@example.com',
      phone: '+91 9830067890',
      plan: 'Gold Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '3',
      name: 'Rahul Sen', // This is the logged-in customer in our simulator
      email: 'rahul.sen@example.com',
      phone: '+91 9876543210',
      plan: 'Silver Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '4',
      name: 'Vikram Singh',
      email: 'vikram.s@example.com',
      phone: '+91 9903344556',
      plan: 'Platinum Plan',
      subscription_status: 'active',
      payment_status: 'unpaid', // Verification failed: Payment incomplete
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Payment incomplete'
    },
    {
      id: '5',
      name: 'Riya Dutta',
      email: 'riya.d@example.com',
      phone: '+91 9831122334',
      plan: 'Gold Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '6',
      name: 'Subhash Bose',
      email: 'subhash@example.com',
      phone: '+91 9433011223',
      plan: 'Silver Plan',
      subscription_status: 'expired', // Verification failed: Subscription expired
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Subscription expired'
    },
    {
      id: '7',
      name: 'Pooja Banerjee',
      email: 'pooja.b@example.com',
      phone: '+91 9830099887',
      plan: 'Platinum Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    },
    {
      id: '8',
      name: 'Kunal Ghosh',
      email: 'kunal.g@example.com',
      phone: '+91 9051122334',
      plan: 'Silver Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: true, // Verification failed: Duplicate entry
      ticketId: '',
      status: 'failed',
      verification_reason: 'Duplicate entry'
    },
    {
      id: '9',
      name: 'Ananya Roy',
      email: 'ananya@example.com',
      phone: '+91 9830022334',
      plan: 'Gold Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'invalid', // Verification failed: Invalid weekly participation
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Invalid weekly participation'
    },
    {
      id: '10',
      name: 'Debasish Sen',
      email: 'debasish@example.com',
      phone: '+91 9830055443',
      plan: 'Platinum Plan',
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'suspended', // Verification failed: Account suspended
      is_duplicate: false,
      ticketId: '',
      status: 'failed',
      verification_reason: 'Account suspended'
    }
  ];
  
  list.push(...specific);
  
  // Generate 990 more to make 1000 total participants
  const firstNames = ['Amit', 'Sonia', 'Rahul', 'Vikram', 'Riya', 'Subhash', 'Pooja', 'Kunal', 'Ananya', 'Debasish', 'Sajal', 'Rita', 'Jayanta', 'Mousumi', 'Arnab', 'Tania', 'Pradip', 'Indranil', 'Sujata', 'Koushik', 'Sharmistha', 'Niladri', 'Paramita', 'Snehasis', 'Supriya'];
  const lastNames = ['Sen', 'Das', 'Singh', 'Dutta', 'Bose', 'Banerjee', 'Ghosh', 'Roy', 'Choudhury', 'Bhattacharya', 'Mukherjee', 'Chatterjee', 'Ganguly', 'Mitra', 'Sarkar', 'Pramanik', 'Adhikary', 'Chakraborty', 'Maitra', 'Halder', 'Pal', 'Naskar', 'Mondal', 'Mallick'];
  
  for (let i = 11; i <= 1000; i++) {
    const fName = firstNames[(i * 7) % firstNames.length];
    const lName = lastNames[(i * 13) % lastNames.length];
    const name = `${fName} ${lName}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`;
    const phone = `+91 98${(i * 17) % 10}${(i * 29) % 10}${String(100000 + (i * 101) % 900000)}`;
    const plan = plans[i % plans.length];
    
    // Most should be verified, a small fraction fail
    let subscription_status: 'active' | 'expired' = 'active';
    let payment_status: 'paid' | 'unpaid' | 'reversed' | 'refunded' = 'paid';
    let weekly_entry_status: 'valid' | 'invalid' = 'valid';
    let account_status: 'active' | 'suspended' = 'active';
    let is_duplicate = false;
    
    // Introduce failures systematically at specific offsets
    if (i === 101) subscription_status = 'expired';
    else if (i === 202) payment_status = 'unpaid';
    else if (i === 303) weekly_entry_status = 'invalid';
    else if (i === 404) account_status = 'suspended';
    else if (i === 505) is_duplicate = true;
    else if (i === 606) payment_status = 'reversed';
    else if (i === 707) payment_status = 'refunded';
    
    const verification = getParticipantVerification({
      subscription_status,
      payment_status,
      weekly_entry_status,
      account_status,
      is_duplicate
    });
    
    list.push({
      id: String(i),
      name,
      email,
      phone,
      plan,
      subscription_status,
      payment_status,
      weekly_entry_status,
      account_status,
      is_duplicate,
      ticketId: '',
      status: verification.status,
      verification_reason: verification.reason
    });
  }
  
  return list;
};

// Automatic eligibility verification helper
const getParticipantVerification = (p: any) => {
  if (p.subscription_status !== 'active') {
    return { status: 'failed', reason: 'Subscription expired' };
  }
  if (p.payment_status !== 'paid') {
    if (p.payment_status === 'unpaid') return { status: 'failed', reason: 'Payment incomplete' };
    if (p.payment_status === 'reversed' || p.payment_status === 'refunded') return { status: 'failed', reason: `Payment ${p.payment_status}` };
    return { status: 'failed', reason: 'Payment incomplete' };
  }
  if (p.weekly_entry_status !== 'valid') {
    return { status: 'failed', reason: 'Invalid weekly participation' };
  }
  if (p.account_status !== 'active') {
    return { status: 'failed', reason: 'Account suspended' };
  }
  if (p.is_duplicate) {
    return { status: 'failed', reason: 'Duplicate entry' };
  }
  return { status: 'verified', reason: '' };
};

const generateRandomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

export default function DashboardPage({ user, onLogout, onBookPaidTour, onBack, onGoToAdmin }: DashboardPageProps) {
  // Navigation states - supports 11 tabs as requested
  const [activeTab, setActiveTab] = useState<
    'overview' | 'subscription' | 'weekly-participation' | 'credits' |
    'coupons' | 'bookings' | 'custom-tours' | 'referrals' |
    'notifications' | 'support' | 'profile'
  >('overview');

  // Profile states
  const [profileName, setProfileName] = useState(user?.fullName || 'Rahul Sen');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'rahul.sen@example.com');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '9876543210');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(user?.avatar || null);
  const [profileAddress, setProfileAddress] = useState(user?.address || '12, Feeder Road, Fulia, Nadia');
  const [profileCity, setProfileCity] = useState(user?.city || 'Nadia');
  const [profileDob, setProfileDob] = useState(user?.dob || '1995-08-15');
  const [dashboardBg, setDashboardBg] = useState<string>(() => {
    const saved = localStorage.getItem(DASHBOARD_BG_STORAGE_KEY);
    if (!saved || !saved.startsWith('data:image/')) {
      return DEFAULT_DASHBOARD_BG;
    }
    return saved;
  });

  // Environment variables & Roles
  const isDemoWalletEnabled = import.meta.env.VITE_ENABLE_DEMO_WALLET === 'true';
  const isDemoOrAdminUser = user?.is_demo_user || 
                            user?.email?.includes('demo') || 
                            user?.email?.includes('test') || 
                            user?.email?.includes('admin');
  const showDemoWallet = isDemoWalletEnabled && isDemoOrAdminUser;

  // Subscription states
  const [activePlan, setActivePlan] = useState<string | null>(() => user?.planName || null);
  const [_activePlanPrice, setActivePlanPrice] = useState<string | null>(() => user?.planPrice || null);
  const [activePlanType, setActivePlanType] = useState<string | null>(() => user?.planType || null);
  const [_subscriptionStatus, setSubscriptionStatus] = useState<string>(() => user?.subscriptionStatus || 'inactive');
  const [_realWalletBalance, setRealWalletBalance] = useState<number>(() => user?.real_wallet_balance ?? 0);
  const [demoWalletBalance, setDemoWalletBalance] = useState<number>(() => user?.demo_wallet_balance ?? 0);
  const [_demoTransactions, setDemoTransactions] = useState<any[]>(() => user?.demo_transactions || []);

  // Checkout flow states
  const [selectedPlanId, setSelectedPlanId] = useState<string>('Silver');
  const [paymentMethod, setPaymentMethod] = useState<'real_payment' | 'demo_wallet'>(
    isDemoWalletEnabled ? 'demo_wallet' : 'real_payment'
  );
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any | null>(null);

  // Sync React state if user prop changes
  useEffect(() => {
    setActivePlan(user?.planName || null);
    setActivePlanPrice(user?.planPrice || null);
    setActivePlanType(user?.planType || null);
    setSubscriptionStatus(user?.subscriptionStatus || 'inactive');
    setRealWalletBalance(user?.real_wallet_balance ?? 0);
    setDemoWalletBalance(user?.demo_wallet_balance ?? 0);
    setDemoTransactions(user?.demo_transactions || []);
  }, [user]);

  // Sync logged-in user in simulation participants list based on activePlan
  useEffect(() => {
    setParticipants(prev => {
      const list = [...prev];
      const userEmail = user?.email || 'rahul.sen@example.com';
      const matchIndex = list.findIndex(p => p.email === userEmail || p.name === (user?.fullName || 'Rahul Sen'));
      if (matchIndex !== -1) {
        const p = { ...list[matchIndex] };
        const hasSub = !!activePlan;
        p.plan = activePlan || 'None';
        p.subscription_status = hasSub ? 'active' : 'expired';
        p.payment_status = hasSub ? 'paid' : 'unpaid';
        const verification = getParticipantVerification(p);
        p.status = verification.status;
        p.verification_reason = verification.reason || 'Subscription inactive';
        list[matchIndex] = p;
      }
      return list;
    });
  }, [activePlan, user]);

  useEffect(() => {
    const handleBalanceChanged = (e: CustomEvent) => {
      setDemoWalletBalance(e.detail.balance);
    };
    window.addEventListener('demoBalanceChanged', handleBalanceChanged as EventListener);
    return () => {
      window.removeEventListener('demoBalanceChanged', handleBalanceChanged as EventListener);
    };
  }, []);

  // Derived plan states
  const planName = activePlan;
  const planType = activePlanType || 'domestic';
  const memberId = user?.memberId || 'BDN-F-741402';
  const voucherCount = planName ? (planName.toLowerCase().includes('platinum') ? 4 : planName.toLowerCase().includes('gold') ? 2 : 1) : 0;

  // Credit Ledger State - Initialized from user object
  const [ledger, setLedger] = useState<CreditLedgerEntry[]>(() => user?.ledger || []);

  useEffect(() => {
    setLedger(user?.ledger || []);
  }, [user?.ledger]);

  /*
  const _handleAddDemoBalance = async (amount: number) => {
    if (amount <= 0) return;
    const res = await demoWalletService.addDemoBalance(user.id, amount);
    if (res.success) {
      setDemoWalletBalance(res.balance);
      const txns = await demoWalletService.getDemoTransactions(user.id);
      setDemoTransactions(txns);
      
      await supabase.auth.updateUser({
        data: {
          demo_wallet_balance: res.balance,
          demo_transactions: txns
        }
      });
      alert(res.message);
    } else {
      alert(res.message);
    }
  };
  */

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await demoWalletService.checkoutSubscription(user.id, selectedPlanId, paymentMethod);
      setCheckoutLoading(false);
      if (res.success) {
        setCheckoutSuccess(res);
        const updatedUser = res.user;
        setActivePlan(updatedUser.user_metadata.planName);
        setActivePlanPrice(updatedUser.user_metadata.planPrice);
        setActivePlanType(updatedUser.user_metadata.planType);
        setSubscriptionStatus(updatedUser.user_metadata.subscriptionStatus);
        setDemoWalletBalance(updatedUser.user_metadata.demo_wallet_balance ?? 0);
        setLedger(updatedUser.user_metadata.ledger || []);
        const txns = await demoWalletService.getDemoTransactions(user.id);
        setDemoTransactions(txns);

        await supabase.auth.updateUser({
          data: updatedUser.user_metadata
        });
      } else {
        alert(res.message);
      }
    } catch (e: any) {
      setCheckoutLoading(false);
      alert(e.message || 'Checkout failed');
    }
  };

  // Track if current week's participation activated manually by customer
  const [isWeeklyActivated, setIsWeeklyActivated] = useState(false);

  // Track the pending booking status so we can trigger cancellation/reinstatement
  const [bookingStatus, setBookingStatus] = useState<'Pending Confirmation' | 'Cancelled'>('Pending Confirmation');

  // Selection cycle simulator state
  const [cycleState, setCycleState] = useState<'Draft' | 'Entry Open' | 'Entry Closed' | 'List Frozen' | 'Result Pending' | 'Result Published' | 'Cancelled'>('Entry Open');
  const [participants, setParticipants] = useState<any[]>(() => generateMockParticipants());
  const [selectedWinners, setSelectedWinners] = useState<any[]>(() => {
    const saved = localStorage.getItem('beduine_winners_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [verificationLogs, setVerificationLogs] = useState<any>(() => {
    const saved = localStorage.getItem('beduine_verification_logs');
    return saved ? JSON.parse(saved) : null;
  });
  const [notificationLogs, setNotificationLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('beduine_notification_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('beduine_winners_list', JSON.stringify(selectedWinners));
  }, [selectedWinners]);

  useEffect(() => {
    if (verificationLogs) {
      localStorage.setItem('beduine_verification_logs', JSON.stringify(verificationLogs));
    } else {
      localStorage.removeItem('beduine_verification_logs');
    }
  }, [verificationLogs]);

  useEffect(() => {
    localStorage.setItem('beduine_notification_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  // Sync winners database from other tabs (like QR verify portal)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'beduine_winners_list' && e.newValue) {
        setSelectedWinners(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Forms edit states
  const [editName, setEditName] = useState(profileName);
  const [editEmail, setEditEmail] = useState(profileEmail);
  const [editMobile, setEditMobile] = useState(profileMobile);
  const [editAddress, setEditAddress] = useState(profileAddress);
  const [editCity, setEditCity] = useState(profileCity);
  const [editDob, setEditDob] = useState(profileDob);
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});

  // Coupon manager state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [couponsList, setCouponsList] = useState<any[]>([
    { code: 'WELCOME10', discount: '10% Off', desc: 'Valid on first tour booking', status: 'Active', expiry: 'Dec 31, 2026' },
    { code: 'BEDUINE500', discount: '₹500 Off', desc: 'Special discount voucher', status: 'Active', expiry: 'Nov 15, 2026' },
    { code: 'WK-BONUS', discount: '₹300 Off', desc: 'Weekly participation consolation', status: 'Expired', expiry: 'May 30, 2026' }
  ]);

  // Custom tour request form states (New interactive model)
  const [customRequestsList, setCustomRequestsList] = useState<CustomTourRequest[]>([]);
  const [selectedCustomRequest, setSelectedCustomRequest] = useState<CustomTourRequest | null>(null);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [customRequestSuccess, setCustomRequestSuccess] = useState(false);
  const [customRequestSuccessData, setCustomRequestSuccessData] = useState<CustomTourRequest | null>(null);

  const loadCustomRequests = async () => {
    try {
      const list = await customTourService.listRequests(user?.id);
      setCustomRequestsList(list);
      // Synchronize active modal request if open
      if (selectedCustomRequest) {
        const fresh = list.find(r => r.id === selectedCustomRequest.id);
        if (fresh) setSelectedCustomRequest(fresh);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCustomRequests();
  }, [user]);

  // Support form state
  const [supportQuery, setSupportQuery] = useState({
    category: 'Booking Queries',
    message: ''
  });
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Referral copy state
  const [copiedReferral, setCopiedReferral] = useState(false);
  const referralCode = `BDN-${profileName.replace(/\s+/g, '').toUpperCase().slice(0, 6)}-809`;

  // System Notifications
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: 'system', title: 'Welcome to Beduine!', message: 'Thank you for choosing Beduine Tour & Travels. Explore your dashboard to manage subscriptions and eligible weekly entries.', time: '1 hour ago', read: false },
    { id: 2, type: 'draw', title: 'Weekly Token Verified', message: 'Your entry ticket TRC-828253 for this Sunday\'s travel reward selection is active.', time: '1 day ago', read: true },
    { id: 3, type: 'billing', title: 'Discount Credits Added', message: '₹500 value Discount Credits are credited to your active wallet.', time: '2 days ago', read: true }
  ]);

  // Helpers to conditionally display data based on activePlan
  const displayedNotifications = activePlan ? notifications : notifications.filter(n => n.type === 'system');

  // Sync edit states when profile updates
  useEffect(() => {
    setEditName(profileName);
    setEditEmail(profileEmail);
    setEditMobile(profileMobile);
    setEditAddress(profileAddress);
    setEditCity(profileCity);
    setEditDob(profileDob);
  }, [profileName, profileEmail, profileMobile, profileAddress, profileCity, profileDob]);

  /*
  const _loadDemoBalance = () => {
    const newEntry: CreditLedgerEntry = {
      id: `TXN-DC-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'issued',
      creditType: 'discount',
      amount: 10,
      reason: 'Demo / testing balance loaded by user',
      creditCategory: 'domestic',
      creditValue: 500,
      usableFor: 'domestic_only'
    };
    setLedger(prev => [...prev, newEntry]);
    alert('₹5,000 Demo Balance has been added to your wallet! You now have 10 additional ₹500 domestic discount vouchers.');
  };
  */

  // Credit calculation functions
  const domesticDiscountCredits = getAvailableCredits(ledger, 'domestic');
  const internationalDiscountCredits = getAvailableCredits(ledger, 'international');

  const domesticDiscountValue = domesticDiscountCredits * 500;
  const internationalDiscountValue = internationalDiscountCredits * 5000;

  // Combined discount credit calculations (used in dashboard overview & credits tab)
  const availableDiscountCredits = domesticDiscountCredits + internationalDiscountCredits;
  const discountCreditBalance = domesticDiscountValue + internationalDiscountValue;

  const availableLuckyDrawCredits = ledger
    .filter(x => x.creditType === 'lucky_draw')
    .reduce((sum, item) => sum + item.amount, 0);

  // Helper to log credit transactions
  const logCreditTransaction = (
    type: 'issued' | 'reserved' | 'redeemed' | 'reversed' | 'expired' | 'admin_adjustment',
    creditType: 'lucky_draw' | 'discount',
    amount: number,
    reason: string,
    bookingRef?: string,
    adminRef?: string,
    creditCategory?: 'domestic' | 'international' | 'travel_reward',
    creditValue?: number,
    usableFor?: 'domestic_only' | 'international_only' | 'lucky_draw'
  ) => {
    const newEntry: CreditLedgerEntry = {
      id: `TXN-${creditType === 'lucky_draw' ? 'TRC' : 'DC'}-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type,
      creditType,
      amount,
      reason,
      bookingRef,
      adminRef,
      creditCategory: creditCategory || 'domestic',
      creditValue: creditValue ?? 500,
      usableFor: usableFor || 'domestic_only'
    };
    setLedger(prev => [newEntry, ...prev]);
  };

  // Handlers
  const validateForm = () => {
    const newErrors: { name?: string; email?: string; mobile?: string } = {};
    if (!editName.trim()) newErrors.name = 'Full name is required';
    else if (editName.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim()) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(editEmail.trim())) newErrors.email = 'Please enter a valid email';

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!editMobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!mobileRegex.test(editMobile.trim())) newErrors.mobile = 'Enter a valid 10-digit mobile';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateForm()) {
      setProfileName(editName);
      setProfileEmail(editEmail);
      setProfileMobile(editMobile);
      setProfileAddress(editAddress);
      setProfileCity(editCity);
      setProfileDob(editDob);
      alert('Profile details updated successfully.');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setProfileAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Background image size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        setDashboardBg(base64Data);
        localStorage.setItem(DASHBOARD_BG_STORAGE_KEY, base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = () => {
    setDashboardBg(DEFAULT_DASHBOARD_BG);
    localStorage.removeItem(DASHBOARD_BG_STORAGE_KEY);
    localStorage.removeItem(LEGACY_DASHBOARD_BG_STORAGE_KEY);
  };

  const handlePresetBg = (preset: string) => {
    setDashboardBg(preset);
    localStorage.setItem(DASHBOARD_BG_STORAGE_KEY, preset);
  };

  // Selection cycle handlers
  // Selection cycle handlers
  const handleFreezeList = () => {
    if (cycleState !== 'Entry Open' && cycleState !== 'Draft') return;
    
    // Assign Ticket IDs and evaluate weekly participation activation dynamically for logged-in user
    const updated = participants.map((p) => {
      let currentP = { ...p };
      if (p.name === (profileName || 'Rahul Sen')) {
        currentP.weekly_entry_status = isWeeklyActivated ? 'valid' : 'invalid';
      }
      
      const verification = getParticipantVerification(currentP);
      if (verification.status === 'verified') {
        return {
          ...currentP,
          status: 'verified',
          verification_reason: '',
          ticketId: `BED-2026-W25-${p.id.padStart(4, '0')}`
        };
      } else {
        return {
          ...currentP,
          status: 'failed',
          verification_reason: verification.reason,
          ticketId: ''
        };
      }
    });
    
    setParticipants(updated);
    
    const verifiedList = updated.filter(p => p.status === 'verified');
    const N = verifiedList.length;
    const K = Math.ceil(N * 0.05); // ROUNDUP(N * 5%, 0)
    
    setVerificationLogs({
      timestamp: new Date().toLocaleString(),
      hash: 'SEC-RNG-MD5-' + Math.floor(100000 + Math.random() * 900000),
      totalN: N,
      selectedK: K
    });
    
    setCycleState('List Frozen');
  };

  const handleRunRNGDraw = () => {
    if (cycleState !== 'List Frozen') return;
    
    setCycleState('Result Pending');
    
    setTimeout(() => {
      const currentUserName = profileName || 'Rahul Sen';
      const verifiedPool = participants.filter(p => p.status === 'verified' && p.ticketId);
      const failedPool = participants.filter(p => p.status === 'failed');
      
      // Shuffle verified and failed pools to simulate secure random selection
      let shuffledVerified = [...verifiedPool].sort(() => 0.5 - Math.random());
      const shuffledFailed = [...failedPool].sort(() => 0.5 - Math.random());
      
      // For testing, always ensure the logged-in customer wins if they are verified
      const loggedInIndex = shuffledVerified.findIndex(p => p.name === currentUserName);
      let selectedVerified: any[] = [];
      
      if (loggedInIndex !== -1) {
        const loggedInUser = shuffledVerified[loggedInIndex];
        shuffledVerified.splice(loggedInIndex, 1);
        selectedVerified = [loggedInUser, ...shuffledVerified.slice(0, 47)];
      } else {
        selectedVerified = shuffledVerified.slice(0, 48);
      }
      
      // Map 48 verified winners
      const verifiedWinners = selectedVerified.map(w => {
        const token = generateRandomToken();
        return {
          ...w,
          verification_status: 'verified',
          verification_reason: '',
          coupon: `BEDWIN-2026-${w.id.padStart(5, '0')}`,
          token,
          destination: 'Not assigned',
          batch: 'Not assigned',
          travelDate: 'Not assigned',
          callConfirmed: false,
          callConfirmedAt: '',
          status: 'Issued',
          redeemedAt: '',
          redeemedBy: ''
        };
      });
      
      // Map 2 failed winners
      const failedWinners = shuffledFailed.slice(0, 2).map(w => {
        const verification = getParticipantVerification(w);
        return {
          ...w,
          verification_status: 'failed',
          verification_reason: verification.reason,
          coupon: 'N/A',
          token: '',
          destination: 'N/A',
          batch: 'N/A',
          travelDate: 'N/A',
          callConfirmed: false,
          callConfirmedAt: '',
          status: 'Cancelled',
          redeemedAt: '',
          redeemedBy: ''
        };
      });
      
      const winners = [...verifiedWinners, ...failedWinners];
      setSelectedWinners(winners);
      
      // Push system notification if current user is an eligible winner
      const wonWinner = winners.find(w => w.name === currentUserName && w.verification_status === 'verified');
      if (wonWinner) {
        setNotifications(prev => [
          {
            id: Date.now(),
            type: 'draw',
            title: '🎉 Beduine Weekly Selection!',
            message: 'Congratulations! You have been selected in our weekly selection. Our representative will call you shortly to verify details, confirm availability, and finalize your travel package.',
            time: 'Just now',
            read: false
          },
          ...prev
        ]);
      }
      
      // Generate notification logs
      const logs: string[] = [];
      winners.forEach(w => {
        if (w.verification_status === 'verified') {
          logs.push(`[SMS Sent] to ${w.name} (${w.phone}): Congratulations! You won Beduine Weekly Draw! Coupon Code: ${w.coupon}`);
          logs.push(`[Email Despatched] to ${w.email}: Beduine Selection Winner notification sent. Valid for 12 months.`);
        } else {
          logs.push(`[System Alert] Candidate ${w.name} (${w.phone}) failed verification: ${w.verification_reason}`);
        }
      });
      
      setNotificationLogs(logs);
      setCycleState('Result Published');
    }, 1500);
  };

  const handleCancelDraw = () => {
    setCycleState('Cancelled');
    setSelectedWinners([]);
    setNotificationLogs([]);
  };

  const handleResetDraw = () => {
    setCycleState('Entry Open');
    setParticipants(generateMockParticipants());
    setSelectedWinners([]);
    setVerificationLogs(null);
    setNotificationLogs([]);
  };

  const handleAddMockParticipant = (name: string, plan: string) => {
    if (cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled') {
      alert("List is frozen/closed! Cannot add participants silently.");
      return;
    }
    const newP = {
      id: String(participants.length + 1),
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '+91 ' + Math.floor(9000000000 + Math.random() * 1000000000),
      plan: plan,
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: ''
    };
    setParticipants([...participants, newP]);
  };

  const handleRemoveMockParticipant = (id: string) => {
    if (cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled') {
      alert("List is frozen/closed! Cannot remove participants silently.");
      return;
    }
    setParticipants(participants.filter(p => p.id !== id));
  };

  // Assign Tour details individually
  const handleAssignTourDetails = (winnerId: string, destination: string, batch: string, travelDate: string) => {
    setSelectedWinners(prev => prev.map(w => {
      if (w.id === winnerId) {
        return {
          ...w,
          destination,
          batch,
          travelDate,
          status: 'Tour Assigned'
        };
      }
      return w;
    }));
  };

  // Bulk Tour details assignment by plan tier
  const handleBulkAssignTour = (plan: string, destination: string, batch: string, travelDate: string) => {
    setSelectedWinners(prev => prev.map(w => {
      // Must be verified, matching plan, and not redeemed/cancelled
      if (w.plan.toLowerCase().includes(plan.toLowerCase()) && w.verification_status === 'verified' && w.status !== 'Redeemed' && w.status !== 'Cancelled') {
        return {
          ...w,
          destination,
          batch,
          travelDate,
          callConfirmed: true, // Auto-confirm call when bulk assigning
          status: 'Tour Assigned'
        };
      }
      return w;
    }));
  };

  // Toggle call confirmation status
  const handleToggleCallConfirmed = (winnerId: string) => {
    setSelectedWinners(prev => prev.map(w => {
      if (w.id === winnerId) {
        const nextState = !w.callConfirmed;
        return {
          ...w,
          callConfirmed: nextState,
          callConfirmedAt: nextState ? new Date().toLocaleString() : ''
        };
      }
      return w;
    }));
  };

  // Cancel coupon manually
  const handleCancelWinnerCoupon = (winnerId: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this winner coupon? This action is irreversible.");
    if (!confirmCancel) return;
    
    setSelectedWinners(prev => prev.map(w => {
      if (w.id === winnerId) {
        return {
          ...w,
          status: 'Cancelled'
        };
      }
      return w;
    }));
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "BEDUINE TOUR & TRAVELS - WEEKLY SELECTION RESULTS REPORT\n";
    csvContent += `Execution Date/Time,${verificationLogs?.timestamp || new Date().toLocaleString()}\n`;
    csvContent += `Verification Hash,${verificationLogs?.hash || 'N/A'}\n`;
    csvContent += `Total Eligible Participants (N),${verificationLogs?.totalN || 0}\n`;
    csvContent += `Selected Winners Count (ROUNDUP N * 5%),${verificationLogs?.selectedK || 0}\n\n`;
    
    csvContent += "Participant ID,Name,Email,Phone,Plan,Ticket ID,Selection Status,Winner Coupon (UUID)\n";
    participants.forEach((p) => {
      const isWinner = selectedWinners.some(w => w.id === p.id);
      const coupon = isWinner ? selectedWinners.find(w => w.id === p.id).coupon : '';
      csvContent += `"${p.id}","${p.name}","${p.email}","${p.phone}","${p.plan}","${p.ticketId || 'N/A'}","${isWinner ? 'WINNER' : 'NOT SELECTED'}","${coupon}"\n`;
    });
    
    csvContent += "\n\nLEGAL NOTICE: Selection-based promotional module will remain disabled in production until the client provides approved rules, eligibility criteria, privacy terms and written legal authorization.\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Beduine_Selection_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    let content = "";
    content += "=========================================================================\n";
    content += "           BEDUINE TOUR & TRAVELS - WEEKLY SELECTION REPORT               \n";
    content += "=========================================================================\n\n";
    content += `Report Generated: ${new Date().toLocaleString()}\n`;
    content += `Verification Security Hash: ${verificationLogs?.hash || 'N/A'}\n`;
    content += `Cycle Status: ${cycleState.toUpperCase()}\n\n`;
    
    content += "-------------------------------------------------------------------------\n";
    content += "SELECTION METRICS & RATIOS\n";
    content += "-------------------------------------------------------------------------\n";
    content += `Total Registered Candidates: ${participants.length}\n`;
    content += `Eligible Participant Count (N): ${verificationLogs?.totalN || 0}\n`;
    content += `Selected Count (ROUNDUP(N * 5%, 0)): ${verificationLogs?.selectedK || 0}\n\n`;
    
    content += "-------------------------------------------------------------------------\n";
    content += "WINNER LIST & VERIFIED COUPONS\n";
    content += "-------------------------------------------------------------------------\n";
    if (selectedWinners.length === 0) {
      content += "No winners selected in this cycle.\n";
    } else {
      selectedWinners.forEach((w, idx) => {
        content += `${idx + 1}. Name: ${w.name}\n`;
        content += `   Ticket ID: ${w.ticketId}\n`;
        content += `   Coupon UUID: ${w.coupon}\n`;
        content += `   Contact: ${w.phone} | ${w.email}\n\n`;
      });
    }
    
    content += "-------------------------------------------------------------------------\n";
    content += "NOTIFICATION DESPATCH LOGS\n";
    content += "-------------------------------------------------------------------------\n";
    notificationLogs.forEach((log) => {
      content += `[LOG] ${log}\n`;
    });
    
    content += "\n-------------------------------------------------------------------------\n";
    content += "LEGAL NOTICE / CONTRACTUAL RESTRICTION\n";
    content += "-------------------------------------------------------------------------\n";
    content += "Selection-based promotional module will remain disabled in production\n";
    content += "until the client provides approved rules, eligibility criteria, privacy\n";
    content += "terms and written legal authorization.\n\n";
    content += "=========================================================================\n";
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Beduine_Selection_Report_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual Weekly selection entry activation
  const handleActivateWeeklyParticipation = () => {
    if (isWeeklyActivated) return;
    setIsWeeklyActivated(true);
    logCreditTransaction(
      'redeemed',
      'lucky_draw',
      -1,
      'Weekly participation activated for WK-23 selection cycle',
      undefined,
      undefined,
      'travel_reward',
      1,
      'lucky_draw'
    );
    // Log system notification
    const newNotif = {
      id: Date.now(),
      type: 'draw',
      title: 'WK-23 Selection Active',
      message: 'You have locked your weekly participation for Sunday selection cut-off.',
      time: 'Just now',
      read: false
    };
    setNotifications([newNotif, ...notifications]);
    alert('Weekly participation entitlement activated successfully.');
  };

  // Booking cancellation & credit reinstatement
  const handleCancelBooking = () => {
    if (bookingStatus === 'Cancelled') return;
    const confirmCancel = window.confirm('Are you sure you want to cancel your Puri Beach Escape booking and reinstate your Discount Credit?');
    if (confirmCancel) {
      setBookingStatus('Cancelled');
      // Revert/reinstate 1 discount credit
      logCreditTransaction(
        'reversed',
        'discount',
        1,
        'Discount credit reinstated on booking cancellation',
        'BDN-PURI-901B',
        undefined,
        'domestic',
        500,
        'domestic_only'
      );
      // Log system notification
      const newNotif = {
        id: Date.now(),
        type: 'billing',
        title: 'Booking Cancelled & Credit Reinstated',
        message: '₹500 Domestic Discount Credit returned to your wallet. Transaction log created.',
        time: 'Just now',
        read: false
      };
      setNotifications([newNotif, ...notifications]);
      alert('Booking cancelled. ₹500 Domestic Discount Credit has been reinstated.');
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!activePlan) {
      setCouponError('Please purchase a subscription to activate promo codes.');
      return;
    }
    if (!newCouponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    const code = newCouponCode.trim().toUpperCase();
    const exists = couponsList.some(c => c.code === code);
    if (exists) {
      setCouponError('This coupon is already in your wallet.');
      return;
    }
    const newCoupon = {
      code,
      discount: '₹400 Off',
      desc: 'Applied custom promo discount',
      status: 'Active',
      expiry: 'Nov 30, 2026'
    };
    setCouponsList([newCoupon, ...couponsList]);
    setCouponSuccess(`Coupon "${code}" added successfully!`);
    setNewCouponCode('');
  };

  const handleDashboardCustomRequestSubmit = async (formData: any) => {
    try {
      const requestData = {
        ...formData,
        userId: user?.id || 'p-rah-1',
        userName: user?.fullName || 'Rahul Sen'
      };
      const created = await customTourService.createRequest(requestData);
      setCustomRequestSuccessData(created);
      setCustomRequestSuccess(true);
      setShowNewRequestForm(false);
      loadCustomRequests();
      setTimeout(() => setCustomRequestSuccess(false), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit custom request.');
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSuccess(false);
    if (!supportQuery.message.trim()) {
      alert('Please type a message.');
      return;
    }
    setSupportSuccess(true);
    setSupportQuery({ ...supportQuery, message: '' });
    setTimeout(() => setSupportSuccess(false), 5000);
  };

  const copyReferralLink = () => {
    const link = `https://beduine.in/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // 10 Menu items list with Lucide Icons + Admin Control if enabled
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'subscription', label: 'My Subscription', icon: ShieldCheck },
    { id: 'weekly-participation', label: 'Travel Reward', icon: Ticket },
    { id: 'credits', label: 'Credits & Coupons', icon: CreditCard },
    { id: 'bookings', label: 'Tour Bookings', icon: Plane },
    { id: 'custom-tours', label: 'Custom Tour Requests', icon: Route },
    { id: 'referrals', label: 'Referrals', icon: Share2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: displayedNotifications.filter(n => !n.read).length },
    { id: 'support', label: 'Support', icon: Phone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Admin Command Center is now rendered separately in the sidebar layout instead of a tab

  /* ==================== TAB RENDERERS ==================== */

  return (
    <DashboardLayout
      user={user}
      profileName={profileName}
      profileAvatar={profileAvatar}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      dashboardBg={dashboardBg}
      showDemoWallet={showDemoWallet}
      onGoToAdmin={onGoToAdmin}
      onLogout={onLogout}
      onBack={onBack}
      planName={planName}
      sidebarItems={sidebarItems}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab
              user={user}
              profileName={profileName}
              planName={planName}
              planType={planType}
              memberId={memberId}
              bookingStatus={bookingStatus}
              availableDiscountCredits={availableDiscountCredits}
              discountCreditBalance={discountCreditBalance}
              domesticDiscountCredits={domesticDiscountCredits}
              internationalDiscountCredits={internationalDiscountCredits}
              availableLuckyDrawCredits={availableLuckyDrawCredits}
              isWeeklyActivated={isWeeklyActivated}
              setActiveTab={setActiveTab}
              showDemoWallet={showDemoWallet}
              demoWalletBalance={demoWalletBalance}
              setDemoWalletBalance={setDemoWalletBalance}
              setDemoTransactions={setDemoTransactions}
              displayedCoupons={activePlan ? couponsList : []}
              displayedNotifications={displayedNotifications}
              onBookPaidTour={onBookPaidTour}
            />
          )}
          {activeTab === 'subscription' && (
            <SubscriptionTab
              user={user}
              planName={planName}
              activePlanPrice={_activePlanPrice}
              subscriptionStatus={_subscriptionStatus}
              demoWalletBalance={demoWalletBalance}
              demoTransactions={_demoTransactions}
              selectedPlanId={selectedPlanId}
              setSelectedPlanId={setSelectedPlanId}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              checkoutLoading={checkoutLoading}
              checkoutSuccess={checkoutSuccess}
              setCheckoutSuccess={setCheckoutSuccess}
              setActiveTab={setActiveTab}
              showDemoWallet={showDemoWallet}
              handleCheckout={handleCheckout}
              voucherCount={voucherCount}
              planType={planType}
              memberId={memberId}
            />
          )}
          {activeTab === 'weekly-participation' && (
            <div className="space-y-6">
              <TravelRewardTab
                availableLuckyDrawCredits={availableLuckyDrawCredits}
                isWeeklyActivated={isWeeklyActivated}
                handleActivateWeeklyParticipation={handleActivateWeeklyParticipation}
                cycleState={cycleState}
              />
              {showDemoWallet && (
                <AdminDrawPanel
                  cycleState={cycleState}
                  setCycleState={setCycleState}
                  participants={participants}
                  setParticipants={setParticipants}
                  selectedWinners={selectedWinners}
                  setSelectedWinners={setSelectedWinners}
                  verificationLogs={verificationLogs}
                  setVerificationLogs={setVerificationLogs}
                  notificationLogs={notificationLogs}
                  setNotificationLogs={setNotificationLogs}
                  handleFreezeList={handleFreezeList}
                  handleRunRNGDraw={handleRunRNGDraw}
                  handleCancelDraw={handleCancelDraw}
                  handleResetDraw={handleResetDraw}
                  handleAddMockParticipant={handleAddMockParticipant}
                  handleRemoveMockParticipant={handleRemoveMockParticipant}
                  handleAssignTourDetails={handleAssignTourDetails}
                  handleBulkAssignTour={handleBulkAssignTour}
                  handleToggleCallConfirmed={handleToggleCallConfirmed}
                  handleCancelWinnerCoupon={handleCancelWinnerCoupon}
                  exportToCSV={exportToCSV}
                  exportToPDF={exportToPDF}
                />
              )}
            </div>
          )}
          {(activeTab === 'credits' || activeTab === 'coupons') && (
            <CreditsTab
              activePlan={activePlan}
              profileName={profileName}
              selectedWinners={selectedWinners}
              availableDiscountCredits={availableDiscountCredits}
              discountCreditBalance={discountCreditBalance}
              domesticDiscountCredits={domesticDiscountCredits}
              internationalDiscountCredits={internationalDiscountCredits}
              newCouponCode={newCouponCode}
              setNewCouponCode={setNewCouponCode}
              couponError={couponError}
              setCouponError={setCouponError}
              couponSuccess={couponSuccess}
              handleAddCoupon={handleAddCoupon}
              ledger={ledger}
            />
          )}
          {activeTab === 'bookings' && (
            <BookingsTab
              activePlan={activePlan}
              bookingStatus={bookingStatus}
              handleCancelBooking={handleCancelBooking}
              onBookPaidTour={onBookPaidTour}
            />
          )}
          {activeTab === 'custom-tours' && (
            <CustomToursTab
              user={user}
              customRequestsList={customRequestsList}
              setCustomRequestsList={setCustomRequestsList}
              selectedCustomRequest={selectedCustomRequest}
              setSelectedCustomRequest={setSelectedCustomRequest}
              showNewRequestForm={showNewRequestForm}
              setShowNewRequestForm={setShowNewRequestForm}
              customRequestSuccess={customRequestSuccess}
              setCustomRequestSuccess={setCustomRequestSuccess}
              customRequestSuccessData={customRequestSuccessData}
              setCustomRequestSuccessData={setCustomRequestSuccessData}
              loadCustomRequests={loadCustomRequests}
              handleDashboardCustomRequestSubmit={handleDashboardCustomRequestSubmit}
            />
          )}
          {activeTab === 'referrals' && (
            <ReferralsTab
              activePlan={activePlan}
              referralCode={referralCode}
              copyReferralLink={copyReferralLink}
              copiedReferral={copiedReferral}
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab
              displayedNotifications={displayedNotifications}
              markAllNotificationsRead={markAllNotificationsRead}
              deleteNotification={deleteNotification}
            />
          )}
          {activeTab === 'support' && (
            <SupportTab
              profileName={profileName}
              supportQuery={supportQuery}
              setSupportQuery={setSupportQuery}
              supportSuccess={supportSuccess}
              handleSupportSubmit={handleSupportSubmit}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              profileName={profileName}
              profileAvatar={profileAvatar}
              setProfileAvatar={setProfileAvatar}
              dashboardBg={dashboardBg}
              editName={editName}
              setEditName={setEditName}
              editEmail={editEmail}
              setEditEmail={setEditEmail}
              editMobile={editMobile}
              setEditMobile={setEditMobile}
              editDob={editDob}
              setEditDob={setEditDob}
              editCity={editCity}
              setEditCity={setEditCity}
              editAddress={editAddress}
              setEditAddress={setEditAddress}
              errors={errors}
              setErrors={setErrors}
              handleSaveProfile={handleSaveProfile}
              handleAvatarChange={handleAvatarChange}
              handleBgChange={handleBgChange}
              handleResetBg={handleResetBg}
              handlePresetBg={handlePresetBg}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
