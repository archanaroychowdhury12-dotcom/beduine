import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass, Sparkles, Gift, CreditCard, Plane, ArrowRight,
  Crown, LogOut, Ticket, Calendar, Check,
  Star, Zap, Shield,
  ChevronRight, User, Bell, ChevronLeft,
  LayoutDashboard, ShieldCheck, Tag, Route, Share2, Phone,
  MessageCircle, Trash2, Copy, FileText, CheckCircle2, Clock,
  AlertTriangle, Lock, Unlock, RefreshCw, UserPlus, Download, Plus, Info
} from 'lucide-react';
import { customTourService } from './services/customTourService';
import { CustomTourForm } from './pages/main-website-tour-page/custom-tour/CustomTourForm';
import { CustomTourDetailPanel } from './pages/main-website-tour-page/custom-tour/CustomTourDetailPanel';
import { CustomTourRequest, CreditLedgerEntry } from './types';
import { supabase } from './utils/supabaseClient';
import { demoWalletService } from './services/demoWalletService';
import { getPlanPrice, getPlanCredits, getPlanCreditValue } from './data/siteData';
import { getAvailableCredits } from './utils/creditHelpers';

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

  // Hotspots list
  const DESTINATIONS = [
    { name: 'Kashmir Valley', desc: 'Majestic Lakes', img: '/images/kashmir_valley_card.png' },
    { name: 'Darjeeling Hills', desc: 'Tea Gardens', img: '/images/darjeeling_hills_card.png' },
    { name: 'Puri-Gokarna Beach', desc: 'Serene Coastline', img: '/images/gokarna_beach_card.png' },
    { name: 'Sundarbans Forest', desc: 'Misty Mangroves', img: '/images/sundarbans_forest_card.png' }
  ];

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
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantPlan, setNewParticipantPlan] = useState<string>('Silver Plan');
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

  // Bulk Assignment panel form states
  const [bulkPlan, setBulkPlan] = useState<'Silver Plan' | 'Gold Plan' | 'Platinum Plan'>('Silver Plan');
  const [bulkDest, setBulkDest] = useState('Sundarbans');
  const [bulkBatch, setBulkBatch] = useState('October 2026');
  const [bulkDate, setBulkDate] = useState('12 October 2026');
  const [simToken, setSimToken] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  
  // Track inline edits in each winner row
  const [rowEdits, setRowEdits] = useState<{[key: string]: { destination: string; batch: string; travelDate: string }}>({});

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
    if (bulkPlan === 'Silver Plan') setBulkDest('Sundarbans');
    else if (bulkPlan === 'Gold Plan') setBulkDest('Darjeeling');
    else if (bulkPlan === 'Platinum Plan') setBulkDest('Kashmir');
  }, [bulkPlan]);

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
  const referralsList = [
    { name: 'Amit Sen', date: 'June 05, 2026', plan: 'Silver Plan', reward: '₹500 Credit Issued', status: 'Completed' },
    { name: 'Sonia Das', date: 'June 14, 2026', plan: 'Gold Plan', reward: '₹500 Credit Pending', status: 'Pending Verification' }
  ];

  // System Notifications
  const [notifications, setNotifications] = useState<any[]>([
    { id: 1, type: 'system', title: 'Welcome to Beduine!', message: 'Thank you for choosing Beduine Tour & Travels. Explore your dashboard to manage subscriptions and eligible weekly entries.', time: '1 hour ago', read: false },
    { id: 2, type: 'draw', title: 'Weekly Token Verified', message: 'Your entry ticket TRC-828253 for this Sunday\'s travel reward selection is active.', time: '1 day ago', read: true },
    { id: 3, type: 'billing', title: 'Discount Credits Added', message: '₹500 value Discount Credits are credited to your active wallet.', time: '2 days ago', read: true }
  ]);

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
            title: '🎉 Beduine Weekly Draw Winner!',
            message: 'Congratulations! You have been selected in our weekly draw. Our representative will call you shortly to verify details, confirm availability, and finalize your travel package.',
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

  const handleAddMockParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled') {
      alert("List is frozen/closed! Cannot add participants silently.");
      return;
    }
    if (!newParticipantName.trim()) return;
    const newP = {
      id: String(participants.length + 1),
      name: newParticipantName,
      email: `${newParticipantName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '+91 ' + Math.floor(9000000000 + Math.random() * 1000000000),
      plan: newParticipantPlan,
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
    setNewParticipantName('');
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
      'Weekly participation activated for WK-23 draw cycle',
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
      message: 'You have locked your weekly participation for Sunday draw cut-off.',
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
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.filter(n => !n.read).length },
    { id: 'support', label: 'Support', icon: Phone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Admin Command Center is now rendered separately in the sidebar layout instead of a tab

  /* ==================== TAB RENDERERS ==================== */

  const renderInactiveOverview = () => {
    return (
      <div className="space-y-6">
        {/* Welcome Header and Demo Balance Container */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="text-left">
            <h1 className="text-slate-800 text-4xl font-black mt-1 leading-tight tracking-tight">
              <span className="block text-slate-500 font-medium text-lg leading-normal font-sans">Welcome back,</span>
              <span className="flex items-center gap-2 font-sans">{profileName} 👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium font-sans">
              Start your journey with Beduine and unlock amazing travel rewards.
            </p>
          </div>

          {/* Demo Balance Widget */}
          {showDemoWallet && (
            <div className="relative shrink-0 w-full md:w-72 bg-white border border-slate-200/80 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-4 text-left z-20 font-sans">
              {/* Target Indicator dot at top-right corner to match screenshot */}
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF6B6B]" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Demo Balance:</span>
                    <span className="text-[15px] font-extrabold text-blue-600">₹{demoWalletBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="pt-2.5 space-y-1.5">
                <button
                  onClick={async () => {
                    const amountStr = prompt("Enter amount to add to Demo Wallet:", "5000");
                    if (amountStr) {
                      const amount = parseFloat(amountStr);
                      if (!isNaN(amount) && amount > 0) {
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
                      } else {
                        alert("Invalid amount entered.");
                      }
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-400" />
                  <span>Add Demo Balance</span>
                </button>
                <button
                  onClick={() => setActiveTab('credits')}
                  className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>View Logs</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Big Banner Card */}
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-left relative overflow-hidden bg-gradient-to-br from-white to-slate-50/20">
          <div className="w-40 h-40 shrink-0 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden p-2">
            <img src="/images/login_suitcase.png" alt="Travel Luggage" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-3.5 flex-1 font-sans">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              Your travel membership is not active yet.
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
              Subscribe to a plan to unlock TRC, Discount Credits, member benefits and weekly reward participation.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('subscription')}
                className="px-5 py-2.5 bg-[#FF6B6B] hover:bg-[#FF8E53] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-200 cursor-pointer border-none flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Plans <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 hover:border-slate-300"
              >
                How It Works <Info className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-sans">
          {/* Card 1: Subscription Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5 text-[#FF6B6B]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Subscription Status</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">No Active Subscription</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Choose a plan to get started and enjoy exclusive benefits.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-[#FF6B6B] border border-rose-100 uppercase tracking-wide">
                  Inactive
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: TRC */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-emerald-550" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Travel Reward Credit (TRC)</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">No TRC Available</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                TRC will be issued after successful subscription purchase.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide">
                  0 TRC
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Discount Credits */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Discount Credits</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">No Discount Credits</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Discount Credits will be added after subscription activation.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-500 border border-indigo-100 uppercase tracking-wide">
                  0 CREDITS
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Membership Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left flex gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-sky-500" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Membership Status</span>
              <h3 className="text-base font-black text-slate-800 leading-tight">Inactive</h3>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                Your membership will become active after payment success.
              </p>
              <div className="pt-1.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-sky-600 border border-sky-100 uppercase tracking-wide">
                  Inactive
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. OVERVIEW TAB
  const renderOverview = () => {
    if (!planName) {
      return renderInactiveOverview();
    }

    return (
      <div className="space-y-6">
        {/* Sub Header Title inside Main content column */}
        <div className="text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] font-mono block">Dashboard Home</span>
          <h1 className="text-slate-800 font-serif text-3xl font-black mt-1 leading-tight">Welcome back, {profileName}!</h1>
        </div>

        {/* 9 overview grid status cards as requested */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Active Plan */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Active Plan</span>
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-[#FF6B6B]" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-800 leading-tight uppercase">
              {planName || "No active subscription yet."}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
              {planName ? `${planType} Membership` : "Inactive"}
            </div>
          </div>

          {/* Card 2: Subscription Validity */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Subscription Validity</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Calendar className="w-4.5 h-4.5 text-emerald-500" />
              </div>
            </div>
            {planName ? (
              <>
                <div className="text-[11px] font-bold text-slate-700 leading-normal">
                  <div>Start: <strong className="text-slate-900">June 20, 2026</strong></div>
                  <div className="mt-0.5">Expiry: <strong className="text-[#FF6B6B]">June 20, 2027</strong></div>
                </div>
                <div className="text-[9px] text-emerald-600 font-bold uppercase mt-1 tracking-wider">Annual Renewal</div>
              </>
            ) : (
              <div className="text-sm font-bold text-slate-755 leading-tight mt-1">No active subscription yet.</div>
            )}
          </div>

          {/* Card 3: Membership Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Membership Status</span>
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 text-[#00D4F5]" />
              </div>
            </div>
            {planName ? (
              <>
                <div className="text-lg font-black text-slate-800 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Verified Active
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">ID: {memberId}</div>
              </>
            ) : (
              <>
                <div className="text-lg font-black text-slate-800 flex items-center gap-1.5 mt-1">
                  Inactive
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 font-mono">ID: Inactive</div>
              </>
            )}
          </div>

          {/* Card 4: Weekly Participation Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Travel Reward Status</span>
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-purple-500" />
              </div>
            </div>
            {!planName || availableLuckyDrawCredits === 0 ? (
              <div className="text-sm font-bold text-slate-700 leading-tight mt-1">No Travel Reward Credit available.</div>
            ) : isWeeklyActivated ? (
              <>
                <div className="text-base font-black text-emerald-600 flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" /> WK-23 Locked
                </div>
                <div className="text-[9px] text-slate-450 mt-1.5 font-bold uppercase tracking-wider font-mono">Cut-off Sunday 8:00 PM</div>
              </>
            ) : (
              <>
                <div className="text-sm font-bold text-slate-700 leading-tight">Pending Activation</div>
                <button
                  onClick={() => {
                    setActiveTab('weekly-participation');
                    setTimeout(() => {
                      const btn = document.getElementById('activate-weekly-btn');
                      if (btn) btn.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="mt-1.5 px-3 py-1 rounded-full text-[9px] font-bold text-white bg-[#FF6B6B] border-none cursor-pointer hover:opacity-90 inline-block shadow-sm"
                >
                  Activate Entry
                </button>
              </>
            )}
          </div>

          {/* Card 5: Discount-Credit Balance */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Discount Balance</span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <CreditCard className="w-4.5 h-4.5 text-indigo-500" />
              </div>
            </div>
            <div className="text-xl font-black text-slate-800 leading-tight">
              {availableDiscountCredits > 0 ? `₹${discountCreditBalance.toLocaleString('en-IN')}` : "No Discount Credits available."}
            </div>
            {availableDiscountCredits > 0 ? (
              <div className="text-[9.5px] text-indigo-500 font-bold mt-1 uppercase tracking-wider font-mono">
                {domesticDiscountCredits} Dom (₹500) & {internationalDiscountCredits} Intl (₹5,000) active
              </div>
            ) : null}
          </div>

          {/* Card 6: Pending Bookings */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Pending Bookings</span>
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                <Plane className="w-4.5 h-4.5 text-amber-500" />
              </div>
            </div>
            {bookingStatus === 'Pending Confirmation' ? (
              <>
                <div className="text-base font-bold text-slate-800">Puri Beach Escape</div>
                <div className="inline-flex items-center gap-1 mt-1 text-[8.5px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 font-mono">
                  <Clock className="w-2.5 h-2.5" /> Under Review
                </div>
              </>
            ) : (
              <>
                <div className="text-base font-black text-slate-400 mt-1">No Pending Bookings</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">All Clear</div>
              </>
            )}
          </div>

          {/* Card 7: Coupon Status */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Coupon Status</span>
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center">
                <Tag className="w-4.5 h-4.5 text-pink-500" />
              </div>
            </div>
            <div className="text-base font-black text-slate-800">2 Coupons Available</div>
            <div className="text-[9px] text-[#FF6B6B] font-bold uppercase mt-1 tracking-wider">WELCOME10 Active</div>
          </div>

          {/* Card 8: Next Scheduled Activity */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Next Activity</span>
              <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center">
                <Compass className="w-4.5 h-4.5 text-cyan-500" />
              </div>
            </div>
            <div className="text-[11px] font-bold text-slate-700 leading-normal">
              <div>Selection Draw: <strong className="text-slate-900 font-bold">Sunday 8:00 PM</strong></div>
              <div className="mt-0.5">Pre-travel Call: <strong className="text-slate-900 font-bold">July 02, 2026</strong></div>
            </div>
          </div>

          {/* Card 9: Recent Notifications feed preview */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Recent Alerts</span>
              <Bell className="w-4 h-4 text-slate-350 shrink-0" />
            </div>
            <div className="space-y-1.5 text-[10px] text-slate-500 leading-normal">
              {notifications.slice(0, 2).map((n) => (
                <div key={n.id} className="flex items-start gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] mt-1 shrink-0" />
                  <p className="truncate font-semibold"><strong className="text-slate-700">{n.title}:</strong> {n.message}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab('notifications')} className="text-[9px] text-[#00D4F5] hover:underline font-bold uppercase mt-2.5 tracking-wider block border-none bg-transparent">
              View All Alerts
            </button>
          </div>
        </div>

        {/* Quick Help Strip */}
        <div className="bg-gradient-to-r from-[#1E3147] to-slate-900 rounded-[22px] p-6 text-left text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D4F5] shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider block">Customer Helpdesk</span>
              <span className="text-sm font-extrabold text-white">Need customized itineraries or booking vouchers? Chat instantly.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center px-5 py-3 rounded-full text-xs font-bold text-white bg-[#138A8A] hover:bg-[#0e6d6d] shadow-md shadow-[#138A8A]/10 cursor-pointer no-underline border-none">
              WhatsApp Support
            </a>
            <button onClick={onBookPaidTour} className="flex-1 md:flex-none px-5 py-3 rounded-full text-xs font-bold text-[#1E3147] bg-white hover:bg-slate-100 shadow-md cursor-pointer border-none">
              Book Paid Tour
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 2. MY SUBSCRIPTION TAB
  // 2. MY SUBSCRIPTION TAB
  const renderSubscription = () => {
    const plansInfo: any = {
      'Silver Domestic': { price: '₹499', period: 'Annual', maxSelectedBenefit: '₹3,000' },
      'Gold Domestic': { price: '₹799', period: 'Annual', maxSelectedBenefit: '₹5,000' },
      'Platinum Domestic': { price: '₹1,499', period: 'Annual', maxSelectedBenefit: '₹10,000' },
      'Silver International': { price: '₹4,999', period: 'Annual', maxSelectedBenefit: '₹25,000' },
      'Gold International': { price: '₹7,999', period: 'Annual', maxSelectedBenefit: '₹50,000' },
      'Platinum International': { price: '₹14,999', period: 'Annual', maxSelectedBenefit: '₹1,00,000' }
    };
    
    const currentPlanDetails = activePlan ? (plansInfo[activePlan] || { price: '₹499', period: 'Annual', maxSelectedBenefit: '₹3,000' }) : null;

    if (!activePlan) {
      if (checkoutSuccess) {
        const source = checkoutSuccess.user.user_metadata.subscription_source;
        return (
          <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">
                {source === 'demo' ? 'Demo Payment Successful' : 'Payment Successful'}
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                {source === 'demo' 
                  ? 'Demo payment successful. Subscription activated for testing.' 
                  : 'Your payment was successful and membership has been activated!'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2.5 text-xs font-mono text-slate-600">
              <div>Plan Name: <strong className="text-slate-850">{checkoutSuccess.user.user_metadata.planName}</strong></div>
              <div>Price Charged: <strong className="text-slate-850">{checkoutSuccess.user.user_metadata.planPrice}</strong></div>
              <div>Credits Issued: <strong className="text-slate-850">{getPlanCredits(selectedPlanId)} Vouchers (₹{getPlanCreditValue(selectedPlanId).toLocaleString('en-IN')} value each)</strong></div>
              <div>Payment Mode: <strong className="text-indigo-600 uppercase">{paymentMethod.replace('_', ' ')}</strong></div>
            </div>

            <button
              onClick={() => {
                setCheckoutSuccess(null);
                setActiveTab('overview');
              }}
              className="px-6 py-3 w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer border-none"
            >
              Go to Dashboard Overview
            </button>
          </div>
        );
      }


      return (
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
          <div>
            <h2 className="text-base font-black flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5 text-[#FF6B6B]" /> Join Beduine Membership
            </h2>
            <p className="text-xs text-slate-400">Choose a travel subscription plan to start your journey with guaranteed discount credits and weekly travel draw entries.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Domestic Section */}
            <div className="space-y-3">
              <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">🇮🇳 Domestic Annual Plans</span>
              <div className="space-y-2.5">
                {[
                  { id: 'Silver', name: 'Silver Domestic', price: '₹499', credits: 1 },
                  { id: 'Gold', name: 'Gold Domestic', price: '₹799', credits: 2 },
                  { id: 'Platinum', name: 'Platinum Domestic', price: '₹1,499', credits: 4 }
                ].map(p => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlanId === p.id 
                        ? 'border-[#FF6B6B] bg-orange-50/20' 
                        : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlanId === p.id}
                        onChange={() => setSelectedPlanId(p.id)}
                        className="accent-[#FF6B6B]"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{p.credits} Voucher{p.credits > 1 ? 's' : ''} issued</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#FF6B6B]">{p.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* International Section */}
            <div className="space-y-3">
              <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">🌐 International Annual Plans</span>
              <div className="space-y-2.5">
                {[
                  { id: 'Silver_Int', name: 'Silver International', price: '₹4,999', credits: 1 },
                  { id: 'Gold_Int', name: 'Gold International', price: '₹7,999', credits: 2 },
                  { id: 'Platinum_Int', name: 'Platinum International', price: '₹14,999', credits: 4 }
                ].map(p => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      selectedPlanId === p.id 
                        ? 'border-[#FF6B6B] bg-orange-50/20' 
                        : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlanId === p.id}
                        onChange={() => setSelectedPlanId(p.id)}
                        className="accent-[#FF6B6B]"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{p.credits} Voucher{p.credits > 1 ? 's' : ''} issued</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-[#FF6B6B]">{p.price}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-slate-150 space-y-3">
            <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">Choose Payment Method</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                  paymentMethod === 'real_payment' ? 'border-[#FF6B6B] bg-orange-50/10' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'real_payment'}
                  onChange={() => setPaymentMethod('real_payment')}
                  className="accent-[#FF6B6B]"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Real Payment</span>
                  <span className="text-[9.5px] text-slate-400 font-medium">Use credit card / UPI gateway</span>
                </div>
              </label>

              {showDemoWallet && (
                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm ${
                    paymentMethod === 'demo_wallet' ? 'border-[#00D4F5] bg-sky-500/5' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'demo_wallet'}
                    onChange={() => setPaymentMethod('demo_wallet')}
                    className="accent-[#00D4F5]"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Demo Wallet Payment</span>
                    <span className="text-[9.5px] text-slate-400 font-medium">Deduct from ₹{demoWalletBalance.toLocaleString('en-IN')} Test Balance</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Checkout Action */}
          {(() => {
            const isSufficient = demoWalletBalance >= (getPlanPrice(selectedPlanId) || 0);
            return (
              <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left">
                  <span className="text-[9.5px] uppercase font-mono text-slate-400 font-bold block">Selected Plan Total Due</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800">
                      ₹{getPlanPrice(selectedPlanId)}
                    </span>
                    {paymentMethod === 'demo_wallet' && (
                      <span className={`text-[10px] font-bold ${isSufficient ? 'text-emerald-605' : 'text-red-505'}`}>
                        ({isSufficient ? '✓ Balance Sufficient' : '✗ Insufficient Demo Balance'})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || (paymentMethod === 'demo_wallet' && !isSufficient)}
                  className={`px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white rounded-full shadow-lg border-none transition-all cursor-pointer ${
                    paymentMethod === 'demo_wallet' && !isSufficient
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : paymentMethod === 'demo_wallet'
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                        : 'bg-gradient-to-r from-[#FF6B6B] to-[#8B5CF6] hover:from-[#FF8E53] hover:to-[#8B5CF6] shadow-rose-200'
                  }`}
                >
                  {checkoutLoading ? 'Processing Checkout...' : `Pay ₹${getPlanPrice(selectedPlanId)} & Activate`}
                </button>
              </div>
            );
          })()}
        </div>
      );
    }


    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-black flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5 text-[#FF6B6B]" /> My Subscription Details
            </h2>
            <p className="text-xs text-slate-400">Manage your Beduine membership plans and invoice downloads</p>
          </div>
          <span className="bg-emerald-500 text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            {user?.subscription_source === 'demo' ? 'Test Active' : 'Active'}
          </span>
        </div>

        {/* Visual Premium Holographic Membership Card */}
        <div className="bg-gradient-to-br from-[#0b130f] via-slate-900 to-[#1E3147] rounded-[24px] p-6 text-white relative overflow-hidden border border-white/5 shadow-lg group">
          <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-gold-accent animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#00D4F5] font-mono">
                  {user?.subscription_source === 'demo' ? 'BEDUINE TEST MEMBER CARD' : 'BEDUINE MEMBER CARD'}
                </span>
              </div>
              <div className="text-3xl font-black tracking-wide uppercase mt-4">
                {planName}
                {user?.subscription_source === 'demo' && <span className="text-xs text-amber-500 font-bold block normal-case font-sans tracking-normal mt-0.5">Demo Subscription</span>}
              </div>
              <div className="text-[11px] text-white/60 font-mono tracking-widest uppercase mt-0.5">{planType} Membership Tier</div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5">
              <img src="/images/bedune_logo_transparent.png" alt="Beduine" className="w-full h-full object-contain brightness-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="block text-[8px] text-white/40 uppercase tracking-wider">MEMBER ID</span>
              <span className="font-bold tracking-wider">{memberId}</span>
            </div>
            <div className="text-right">
              <span className="block text-[8px] text-white/40 uppercase tracking-wider">EXPIRY DATE</span>
              <span className="font-bold text-[#FF6B6B] tracking-wider">June 20, 2027</span>
            </div>
          </div>
        </div>

        {/* Plan Specs Table */}
        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">RECURRING PRICE</span>
            <span className="block text-lg font-black text-slate-800 mt-1">{currentPlanDetails ? currentPlanDetails.price : '₹0'} / {currentPlanDetails ? currentPlanDetails.period : 'Annual'}</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">MAX TOUR BENEFITS</span>
            <span className="block text-lg font-black text-slate-800 mt-1">Up to {currentPlanDetails ? currentPlanDetails.maxSelectedBenefit : '₹0'}</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">NEXT SELECTION DATE</span>
            <span className="block text-lg font-black text-slate-800 mt-1">Next Sunday</span>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="pt-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Membership Benefits Checklist</h3>
          <div className="grid sm:grid-cols-2 gap-3.5 text-xs text-slate-650 font-medium">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              <span>1 weekly selection entry included</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              <span>{voucherCount} x ₹500 discount vouchers issued</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              <span>Up to 10% off on all paid tour requests</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              <span>Dedicated tour manager call assistance</span>
            </div>
          </div>
        </div>

        {/* Billing Invoice history log */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-450" /> Billing Invoice Records
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Invoice ID</th>
                  <th className="py-2.5">Plan Purchased</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                {planName ? (
                  <tr>
                    <td className="py-3 font-bold">June 20, 2026</td>
                    <td className="py-3 font-mono">BDN-INV-7812A</td>
                    <td className="py-3 font-bold">{planName}</td>
                    <td className="py-3 font-black text-slate-800">{currentPlanDetails ? currentPlanDetails.price : '₹0'}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                        user?.subscription_source === 'demo' 
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {user?.subscription_source === 'demo' ? 'Demo Paid' : 'Paid'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button className="text-[10px] font-bold text-[#00D4F5] hover:underline cursor-pointer border-none bg-transparent">Download PDF</button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400 font-bold">
                      No subscription payment found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 3. WEEKLY PARTICIPATION TAB
  const renderWeeklyParticipation = () => {
    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
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
              cycleState === 'Draft' ? 'bg-slate-100 text-slate-650 border border-slate-200' :
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

        <div className="grid md:grid-cols-2 gap-5">
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
                  <span className="text-2xl font-black mt-1.5 block text-emerald-600 flex items-center gap-1">
                    <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} /> WK-23 Activated
                  </span>
                  <div className="text-[11px] text-slate-500 mt-2 font-mono font-bold uppercase">Ticket ID: TRC-828253</div>
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

          {/* RNG Cycle Controller board */}
          <div className="rounded-2xl border border-slate-150 p-5 bg-white flex flex-col justify-between shadow-sm text-left">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-[#FF8E53]" /> RNG Cycle Controller Board
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                As admin, progress through draw states to verify the candidates list, run selection, and generate results.
              </p>
              
              <div className="mt-4 space-y-2">
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
                    <button onClick={handleRunRNGDraw} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 border-none cursor-pointer flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" /> Run RNG Draw Selection
                    </button>
                  )}
                  
                  {cycleState !== 'Cancelled' && cycleState !== 'Result Published' && cycleState !== 'Result Pending' && (
                    <button onClick={handleCancelDraw} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-650 bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer">
                      Cancel Cycle
                    </button>
                  )}
                  
                  {(cycleState === 'Result Published' || cycleState === 'Cancelled') && (
                    <button onClick={handleResetDraw} className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-slate-200 border-none cursor-pointer flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Reset Draw Cycle
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {cycleState === 'Result Pending' && (
              <div className="my-4 text-center py-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                <Compass className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
                <span className="text-xs font-mono font-bold text-purple-700 block mt-2 animate-pulse">RUNNING PSEUDO-RNG ALGORITHM...</span>
              </div>
            )}
            
            {cycleState === 'Result Published' && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Download Reports:</span>
                <div className="flex gap-2">
                  <button onClick={exportToCSV} className="px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold text-indigo-650 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 cursor-pointer flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </button>
                  <button onClick={exportToPDF} className="px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold text-[#FF6B6B] bg-rose-50 border border-rose-150 hover:bg-rose-100 cursor-pointer flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Export PDF
                  </button>
                </div>
              </div>
            )}
            
            {cycleState === 'Cancelled' && (
              <div className="my-4 text-center py-3 bg-red-50 border border-red-100 text-red-650 font-bold rounded-xl text-xs">
                Selection cycle was cancelled by administrative authorization.
              </div>
            )}
          </div>
        </div>

        {/* Participants Manager Panel */}
        <div className="pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                    Selected (5% ROUNDUP): <strong className="text-indigo-650">{verificationLogs?.selectedK}</strong>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          
          {/* Add mock candidate form & Search Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {cycleState !== 'List Frozen' && cycleState !== 'Result Published' && cycleState !== 'Cancelled' ? (
              <form onSubmit={handleAddMockParticipant} className="flex flex-wrap gap-2 max-w-lg items-center">
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
                  <option value="Silver Plan">Silver Plan</option>
                  <option value="Gold Plan">Gold Plan</option>
                  <option value="Platinum Plan">Platinum Plan</option>
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
          <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-sm bg-white max-h-[300px] overflow-y-auto">
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
              <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
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
                                Winner
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
            <div className="bg-slate-50/50 border border-slate-150 rounded-[24px] p-5 text-left space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" /> Admin Panel Winner Report
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">Weekly Draw: 21 June 2026</p>
                </div>
                <div className="text-[9.5px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Verified Winners: {selectedWinners.filter(w => w.verification_status === 'verified').length} / Failed: {selectedWinners.filter(w => w.verification_status === 'failed').length}
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm">
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">VALID PARTICIPANTS</span>
                  <span className="text-2xl font-black text-slate-850 mt-1 block">1,000</span>
                  <span className="text-[9px] text-slate-400 block mt-1">Winner ratio: <strong className="text-slate-700">5%</strong></span>
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm">
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">TOTAL WINNERS</span>
                  <span className="text-2xl font-black text-slate-850 mt-1 block">{selectedWinners.length}</span>
                  <span className="text-[9.5px] text-emerald-600 font-bold block mt-1">Verified: {selectedWinners.filter(w => w.verification_status === 'verified').length}</span>
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm">
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">COUPONS ISSUED</span>
                  <span className="text-2xl font-black text-indigo-650 mt-1 block">
                    {selectedWinners.filter(w => w.verification_status === 'verified' && w.status !== 'Cancelled').length}
                  </span>
                  <span className="text-[9.5px] text-red-500 font-bold block mt-1">Failed/Cancelled: {selectedWinners.filter(w => w.verification_status === 'failed' || w.status === 'Cancelled').length}</span>
                </div>
                <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm">
                  <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">TOUR BATCH PENDING</span>
                  <span className="text-2xl font-black text-[#FF8E53] mt-1 block">
                    {selectedWinners.filter(w => w.status === 'Issued' && w.verification_status === 'verified').length}
                  </span>
                  <span className="text-[9.5px] text-[#00D4F5] font-bold block mt-1">Assigned: {selectedWinners.filter(w => w.status === 'Tour Assigned' || w.status === 'Redeemed').length}</span>
                </div>
              </div>
            </div>

            {/* Bulk tour assignment dashboard card */}
            <div className="bg-white border border-slate-150 rounded-[24px] p-5 text-left space-y-4 shadow-sm">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                    <option value="Silver Plan">Silver Plan</option>
                    <option value="Gold Plan">Gold Plan</option>
                    <option value="Platinum Plan">Platinum Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] text-slate-400 uppercase font-mono font-bold mb-1.5"> seasonal Package</label>
                  <select
                    value={bulkDest}
                    onChange={(e) => setBulkDest(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white font-bold"
                  >
                    {bulkPlan === 'Silver Plan' && ['Sundarbans', 'Bakkhali', 'Mousuni Island', 'Mukutmanipur'].map(d => <option key={d} value={d}>{d}</option>)}
                    {bulkPlan === 'Gold Plan' && ['Darjeeling', 'Dooars', 'Puri', 'Vizag'].map(d => <option key={d} value={d}>{d}</option>)}
                    {bulkPlan === 'Platinum Plan' && ['Kashmir', 'Goa', 'Sikkim', 'Shimla'].map(d => <option key={d} value={d}>{d}</option>)}
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
                    alert(`Successfully assigned ${bulkDest} (${bulkBatch}) to all verified ${bulkPlan} winners.`);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 border-none cursor-pointer text-center"
                >
                  Assign Bulk
                </button>
              </div>
            </div>

            {/* Winner Report Table */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Weekly Winners Table ({selectedWinners.length})</h4>
              
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
                  <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
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
                                <span className="font-mono font-bold text-indigo-600 block select-all">{w.coupon}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(w.coupon);
                                    alert('Copied coupon: ' + w.coupon);
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
                              w.verification_status === 'verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              'bg-rose-50 text-red-500 border border-rose-100'
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
                                  {w.plan.includes('Silver') && ['Sundarbans', 'Bakkhali', 'Mousuni Island', 'Mukutmanipur'].map(d => <option key={d} value={d}>{d}</option>)}
                                  {w.plan.includes('Gold') && ['Darjeeling', 'Dooars', 'Puri', 'Vizag'].map(d => <option key={d} value={d}>{d}</option>)}
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
                                  <div className="font-bold text-slate-800">{w.batch}</div>
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
                              'bg-red-50 text-red-500 border border-red-100'
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
                                    alert(`Assigned ${rowEdit.destination} to ${w.name}.`);
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
                                  className="px-2 py-1 rounded bg-red-50 text-[#FF6B6B] border border-rose-200 hover:bg-rose-100 font-bold text-[9px] cursor-pointer"
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
            <div className="bg-slate-900 border border-white/10 rounded-[24px] p-5 text-left text-white space-y-4">
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
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left text-xs font-mono text-slate-650 space-y-2">
              <div className="font-bold text-slate-805 uppercase text-[10px] tracking-wider font-sans mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-450" /> Verification Security parameters &amp; Audit Trail
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-[10px]">
                <div>Execution Date/Time: <strong className="text-slate-900">{verificationLogs?.timestamp}</strong></div>
                <div>Algorithm Seed Hash: <strong className="text-slate-900">{verificationLogs?.hash}</strong></div>
                <div>RNG Algorithm Status: <strong className="text-emerald-600 font-sans font-bold">Passed Verifiably</strong></div>
                <div>Security Auditor Status: <strong className="text-indigo-650 font-sans font-bold">Audit Locked</strong></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 4. MY CREDITS TAB
  // 4. MY CREDITS TAB
  const renderCredits = () => {
    // Check if current user won a verified coupon
    const currentUserName = profileName || 'Rahul Sen';
    const customerCoupon = selectedWinners.find(
      w => w.name === currentUserName && w.verification_status === 'verified'
    );

    return (
      <div className="space-y-6 text-left">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] font-mono block">Billing &amp; Wallet</span>
          <h1 className="text-slate-800 font-serif text-3xl font-black mt-1 leading-tight">My Credits &amp; Coupons</h1>
        </div>

        {/* 2-Column Split: Credits Wallet (Left) & Add Promo Code (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch font-sans">
          {/* Card: Discount Credits Wallet */}
          <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#FF6B6B]" /> Discount Credits Wallet
              </h3>
              <p className="text-xs text-slate-400">Value protection credits issued from active plan</p>
            </div>

            <div className="bg-gradient-to-r from-red-400 to-[#FF8E53] rounded-[22px] p-5 text-center text-white shadow-md">
              <span className="text-[10px] uppercase tracking-wider font-mono block text-white/80 font-bold">AVAILABLE DISCOUNT VALUE</span>
              <span className="text-3xl font-black block mt-1 text-white">
                {availableDiscountCredits > 0 ? `₹${discountCreditBalance.toLocaleString('en-IN')}` : 'No Discount Credits available.'}
              </span>
              <span className="text-[11px] text-white/90 mt-1 block font-medium">
                {availableDiscountCredits > 0 ? `${domesticDiscountCredits} Domestic (₹500) & ${internationalDiscountCredits} International (₹5,000) active` : '0 vouchers active'}
              </span>
            </div>

            <div className="text-[11px] text-slate-500 font-medium pt-1">
              Source: <strong className="text-slate-700 capitalize">{activePlan ? `${user?.subscription_source || 'Real'} subscription` : 'No subscription active'}</strong>
            </div>
          </div>

          {/* Card: Add Promo Code */}
          <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-500" /> Apply Promo Code
              </h3>
              <p className="text-xs text-slate-400">Enter a promo coupon to add it to your active coupons wallet</p>
            </div>

            <form onSubmit={handleAddCoupon} className="flex gap-2 w-full pt-1">
              <input
                type="text"
                placeholder="ENTER PROMO CODE"
                value={newCouponCode}
                onChange={(e) => {
                  setNewCouponCode(e.target.value);
                  if (couponError) setCouponError(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all uppercase tracking-widest font-mono font-bold focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
              />
              <button type="submit" className="px-5 py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none shrink-0 transition-colors">
                Apply
              </button>
            </form>

            <div className="min-h-[20px] text-xs">
              {couponError && <div className="font-bold text-red-500">{couponError}</div>}
              {couponSuccess && <div className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {couponSuccess}</div>}
            </div>
          </div>
        </div>

        {/* Customer Winner Coupon (Travel Reward Ticket) */}
        {customerCoupon && (
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/20 rounded-[24px] p-6 text-white text-left space-y-4 relative overflow-hidden shadow-lg font-sans">
            <div className="absolute top-0 right-0 w-44 h-full bg-gradient-to-l from-indigo-500/10 to-transparent skew-x-12 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-[#00D4F5] text-slate-950 tracking-wider">
                  🏆 Travel Reward Winner Coupon
                </span>
                <h3 className="text-lg font-black mt-2 tracking-wide text-white">Beduine Sponsored Travel Ticket</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  This coupon has been verifiably issued. Arrive at the tour departure with this QR.
                </p>
              </div>
              
              <div className="px-3.5 py-1.5 rounded-xl border border-indigo-500 bg-indigo-500/20 text-center font-mono font-bold text-xs uppercase tracking-widest text-[#00D4F5] shrink-0">
                {customerCoupon.status}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950/40 p-4.5 rounded-2xl border border-white/5 text-xs">
              <div>
                <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">COUPON CODE</span>
                <span className="font-bold text-slate-200 mt-1 block font-mono select-all">{customerCoupon.coupon}</span>
              </div>
              <div>
                <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">ASSIGNED DESTINATION</span>
                <span className="font-bold text-[#00D4F5] mt-1 block">
                  {customerCoupon.destination !== 'Not assigned' ? customerCoupon.destination : '⏳ Awaiting Admin Assignment'}
                </span>
              </div>
              <div>
                <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">TOUR BATCH</span>
                <span className="font-bold text-[#FF8E53] mt-1 block">
                  {customerCoupon.batch !== 'Not assigned' ? customerCoupon.batch : '⏳ Awaiting Admin Assignment'}
                </span>
              </div>
              <div>
                <span className="block text-[8px] text-indigo-400 uppercase font-mono tracking-widest font-black">TRAVEL DATE</span>
                <span className="font-bold text-slate-300 mt-1 block">
                  {customerCoupon.travelDate !== 'Not assigned' ? customerCoupon.travelDate : '⏳ Awaiting Admin Assignment'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <div className="text-[10px] text-slate-400">
                {customerCoupon.status === 'Tour Assigned' && (
                  <span className="text-emerald-400 font-bold">✅ Tour assigned successfully. Click the QR code block to simulate staff scan verification!</span>
                )}
                {customerCoupon.status === 'Issued' && (
                  <span className="text-amber-400 font-bold">📞 System verified. Awaiting company call and destination selection.</span>
                )}
                {customerCoupon.status === 'Redeemed' && (
                  <span className="text-slate-400 font-bold">🎉 Tour redeemed at {customerCoupon.redeemedAt} by {customerCoupon.redeemedBy}. Hope you had a great trip!</span>
                )}
                {customerCoupon.status === 'Cancelled' && (
                  <span className="text-red-400 font-bold">❌ This coupon was cancelled. Please contact support.</span>
                )}
              </div>

              {customerCoupon.status !== 'Cancelled' && (
                <a 
                  href={`/verify-coupon?t=${customerCoupon.token}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-white p-2.5 rounded-2xl hover:scale-102 transition-transform shadow-md cursor-pointer text-slate-900 no-underline shrink-0"
                >
                  <div className="grid grid-cols-4 gap-0.5 w-14 h-14 bg-white p-1 rounded-sm border border-slate-100">
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <div key={idx} className={`w-full h-full ${
                        (idx + 7) % 3 === 0 ? 'bg-slate-950' : 'bg-white'
                      }`} />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] font-black uppercase text-slate-800 tracking-wider">TAP TO SCAN</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">verify-coupon?t={customerCoupon.token.slice(0, 5)}...</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Combined Lists Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-4 border-t border-slate-100 font-sans">
          
          {/* Subsection 1: Discount Credit Vouchers */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="w-4.5 h-4.5 text-[#FF6B6B]" /> Discount Credit Vouchers
            </h3>
            {availableDiscountCredits === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30">
                No active credit vouchers left in your wallet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {(() => {
                  const activeVouchersList: { category: 'domestic' | 'international'; value: number; code: string }[] = [];
                  for (let i = 0; i < domesticDiscountCredits; i++) {
                    activeVouchersList.push({ category: 'domestic', value: 500, code: `BDN-DOM-${i + 101}` });
                  }
                  for (let i = 0; i < internationalDiscountCredits; i++) {
                    activeVouchersList.push({ category: 'international', value: 5000, code: `BDN-INTL-${i + 101}` });
                  }
                  return activeVouchersList.map((voucher, idx) => (
                    <div key={idx} className="rounded-2xl border-2 border-dashed border-slate-200 p-4 relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-r border-slate-200" />
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-50 border-l border-slate-200" />

                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
                            <Zap className="w-2.5 h-2.5" /> ACTIVE
                          </span>
                          <div className="text-lg font-black text-slate-800 mt-2">₹{voucher.value.toLocaleString('en-IN')} Voucher</div>
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase tracking-wider mt-0.5">
                            {voucher.category === 'international' ? 'International bookings' : 'Domestic bookings'}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50 text-[#FF6B6B]">
                          <Gift className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Code: <strong className="font-mono text-slate-650 font-bold select-all">{voucher.code}</strong></span>
                        <span className="font-bold text-emerald-500 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /> Unused</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>

          {/* Subsection 2: Promo Coupons */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4.5 h-4.5 text-indigo-500" /> My Active Coupons &amp; Promos
            </h3>
            {couponsList.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 font-bold bg-slate-50/30">
                No coupons in your wallet.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {couponsList.map((item, idx) => (
                  <div key={idx} className={`rounded-xl border p-4 text-left relative flex justify-between items-center transition-all ${
                    item.status === 'Active' ? 'border-pink-100 bg-pink-50/10' : 'border-slate-100 bg-slate-50/30 opacity-70'
                  }`}>
                    <div>
                      <span className="text-[8px] font-black font-mono tracking-widest uppercase text-slate-450 block">COUPON CODE</span>
                      <span className="text-base font-black text-slate-800 tracking-wider font-mono block mt-1 select-all">{item.code}</span>
                      <span className="text-xs font-extrabold text-pink-600 block mt-1">{item.discount} discount</span>
                      <span className="text-[10px] text-slate-400 block mt-1 font-semibold">{item.desc}</span>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        item.status === 'Active' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono">Exp: {item.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Immutable Credit Transaction Ledger Table */}
        <div className="pt-6 border-t border-slate-100 space-y-4 font-sans">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-450" /> Immutable Credit Transaction Ledger
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Date / Time</th>
                  <th className="py-2.5">Transaction ID</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Credit Type</th>
                  <th className="py-2.5 text-center">Amount</th>
                  <th className="py-2.5">Reason / References</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                {ledger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-semibold">{item.date}</td>
                    <td className="py-3 font-mono font-bold text-slate-500">{item.id}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                        item.type === 'issued' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        item.type === 'reserved' ? 'bg-yellow-50 text-amber-600 border-amber-100' :
                        item.type === 'redeemed' ? 'bg-pink-50 text-pink-650 border-pink-100' :
                        item.type === 'reversed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        item.type === 'expired' ? 'bg-red-50 text-red-550 border-red-100' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-700 capitalize">
                        {item.creditType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className={`py-3 text-center font-black ${item.amount > 0 ? 'text-emerald-500' : 'text-slate-650'}`}>
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
                    </td>
                    <td className="py-3 leading-normal">
                      <div>{item.reason}</div>
                      <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1 text-[10px] font-semibold">
                        {item.creditCategory && (
                          <span className={`capitalize ${
                            item.creditCategory === 'international' ? 'text-indigo-600' :
                            item.creditCategory === 'domestic' ? 'text-emerald-600' : 'text-slate-500'
                          }`}>
                            Category: {item.creditCategory}
                          </span>
                        )}
                        {item.creditValue && (
                          <span className="text-slate-500">
                            (Value: ₹{item.creditValue.toLocaleString('en-IN')})
                          </span>
                        )}
                      </div>
                      {item.bookingRef && <div className="text-[9px] text-sky-500 font-mono mt-0.5 font-bold">Booking Ref: {item.bookingRef}</div>}
                      {item.adminRef && <div className="text-[9px] text-rose-500 font-mono mt-0.5 font-bold">Admin Ref: {item.adminRef}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCoupons = () => {
    return renderCredits();
  };

  // 6. TOUR BOOKINGS TAB
  const renderTourBookings = () => {
    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-black flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Plane className="w-5 h-5 text-[#FF6B6B]" /> My Tour Bookings
            </h2>
            <p className="text-xs text-slate-400">View active tour itineraries, booking confirmations, and vouchers</p>
          </div>
          <button onClick={onBookPaidTour} className="px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer text-white bg-[#FF6B6B] hover:opacity-95 shadow-md shadow-orange-500/15 border-none transition-all">
            Book New Tour
          </button>
        </div>

        {/* Current Active Tour Card */}
        <div className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="relative h-44 bg-slate-900 overflow-hidden">
            <img src="/images/gokarna_beach_card.png" alt="Puri Beach" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
              {bookingStatus}
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00D4F5] font-black">Upcoming Destination</span>
              <h3 className="text-lg font-black tracking-wide mt-0.5">Puri Beach Escape (3N/4D)</h3>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">DEPARTURE</span>
                <span className="font-bold text-slate-805 mt-0.5 block">Sept 14, 2026</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">TRAVELERS</span>
                <span className="font-bold text-slate-805 mt-0.5 block">2 Adults</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">PICKUP ADDRESS</span>
                <span className="font-bold text-slate-805 mt-0.5 block truncate">Requested Assistance</span>
              </div>
              <div>
                <span className="block text-[8px] text-slate-400 uppercase font-mono tracking-wider font-bold">TOTAL AMOUNT</span>
                <span className="font-bold text-slate-900 mt-0.5 block font-black">₹4,000 (Credits Applied)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold font-mono">BOOKING ID: BDN-PURI-901B</span>
              <div className="flex gap-2">
                {bookingStatus === 'Pending Confirmation' && (
                  <button
                    onClick={handleCancelBooking}
                    className="px-4 py-2 rounded-xl text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 cursor-pointer"
                  >
                    Cancel Booking &amp; Reinstate Credit
                  </button>
                )}
                <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-[10px] font-bold text-slate-650 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 cursor-pointer no-underline">
                  Chat With Guide
                </a>
                {bookingStatus !== 'Cancelled' && (
                  <button className="px-4 py-2 rounded-xl text-[10px] font-bold text-white bg-slate-800 hover:bg-slate-900 border-none cursor-pointer">
                    Download Voucher
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 7. CUSTOM TOUR REQUESTS TAB
  const renderCustomTourRequests = () => {
    if (selectedCustomRequest) {
      return (
        <CustomTourDetailPanel
          request={selectedCustomRequest}
          onClose={() => setSelectedCustomRequest(null)}
          onRefresh={loadCustomRequests}
        />
      );
    }

    if (showNewRequestForm) {
      return (
        <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h2 className="text-base font-black flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Route className="w-5 h-5 text-[#FF6B6B]" /> Customize Your Tour
            </h2>
            <button
              onClick={() => setShowNewRequestForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100 cursor-pointer"
            >
              Back to Request List
            </button>
          </div>
          <CustomTourForm
            currentUser={user}
            onSubmit={handleDashboardCustomRequestSubmit}
          />
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
              <Route className="w-5 h-5 text-[#FF6B6B]" /> Custom Tour Requests
            </h2>
            <p className="text-xs text-slate-400">Request custom itineraries, private vehicles, and special guides</p>
          </div>
          <button
            onClick={() => setShowNewRequestForm(true)}
            className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.02] active:scale-[0.98] transition-all text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-orange-100 cursor-pointer text-center"
          >
            Configure New Trip
          </button>
        </div>

        {customRequestSuccess && customRequestSuccessData && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
            <span>Request {customRequestSuccessData.displayCode} submitted successfully! Our desk is reviewing it.</span>
          </div>
        )}

        {/* Requests history */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-4">Request Log History</h3>
          
          {customRequestsList.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[24px] space-y-3">
              <Route className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-450">No custom tour requests found.</p>
              <button
                onClick={() => setShowNewRequestForm(true)}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold"
              >
                Create your first customized tour request &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {customRequestsList.map((item) => {
                const isUnderReview = item.status === 'Under Review' || item.status === 'Revision Requested';
                const isQuote = item.status === 'Quotation Sent';
                const isAccepted = item.status === 'Quotation Accepted' || item.status === 'Payment Pending';
                const isConfirmed = item.status === 'Confirmed Booking';
                
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedCustomRequest(item)}
                    className="p-4 rounded-[22px] border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300/80 transition-all flex justify-between items-center text-xs font-medium cursor-pointer shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800">{item.destination}</span>
                        <span className="font-mono text-slate-400 text-[10px] font-bold">({item.displayCode})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Submitted: {item.submissionDate} • {item.adults + item.children} Travelers • Budget: ₹{item.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                        isUnderReview 
                          ? 'bg-amber-50 text-amber-700 border-amber-100' 
                          : isQuote 
                            ? 'bg-sky-50 text-[#0096C7] border-sky-100 animate-pulse'
                            : isAccepted
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                              : isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-slate-50 text-slate-505 border-slate-100'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        Last Update: {item.updatedAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 8. REFERRALS TAB
  const renderReferrals = () => {
    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
          <Share2 className="w-5 h-5 text-[#FF6B6B]" /> Referrals &amp; Rewards
        </h2>
        <p className="text-xs text-slate-400">Invite friends to Beduine membership plans and earn discount credits</p>

        {/* Copy referral link widget */}
        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 text-left">
          <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block font-mono">YOUR REFERRAL LINK</span>
          <div className="flex gap-2 mt-2 max-w-xl w-full">
            <input
              type="text"
              readOnly
              value={`https://beduine.in/signup?ref=${referralCode}`}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-500 bg-white font-mono"
            />
            <button
              onClick={copyReferralLink}
              className={`px-5 py-3 rounded-xl text-xs font-bold cursor-pointer text-white border-none shrink-0 transition-all flex items-center gap-1.5 ${
                copiedReferral ? 'bg-emerald-500' : 'bg-slate-800 hover:bg-slate-900'
              }`}
            >
              {copiedReferral ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Link
                </>
              )}
            </button>
          </div>
          <span className="text-[10px] text-slate-400 mt-2 block font-semibold">Invite friends: they get ₹100 off, you get a ₹500 Discount Credit voucher.</span>
        </div>

        {/* Metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Total Referred</span>
            <span className="block text-2xl font-black text-slate-850 mt-1">2 Friends</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Successful Signups</span>
            <span className="block text-2xl font-black text-slate-850 mt-1">1 Signup</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 font-mono">Rewards Earned</span>
            <span className="block text-2xl font-black text-[#FF6B6B] mt-1">₹500 Credit</span>
          </div>
        </div>

        {/* Referrals list */}
        <div className="pt-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Referred Friends Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Friend Name</th>
                  <th className="py-2.5">Signup Date</th>
                  <th className="py-2.5">Plan Purchased</th>
                  <th className="py-2.5">Reward Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                {referralsList.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-bold text-slate-800">{item.name}</td>
                    <td className="py-3">{item.date}</td>
                    <td className="py-3">{item.plan}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {item.reward}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 9. NOTIFICATIONS TAB
  const renderNotificationsTab = () => {
    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-black flex items-center gap-2 text-slate-800 uppercase tracking-wide">
              <Bell className="w-5 h-5 text-[#FF6B6B]" /> Notifications &amp; System Alerts
            </h2>
            <p className="text-xs text-slate-400">Read recent system updates, billing logs, and travel reward notifications</p>
          </div>
          <button onClick={markAllNotificationsRead} className="text-xs font-bold text-[#FF6B6B] hover:underline cursor-pointer border-none bg-transparent">
            Mark all as read
          </button>
        </div>

        {/* Notifications list logs */}
        <div className="space-y-3 pt-2">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400 font-bold">No active notifications log. Check back later!</div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition-all relative ${
                item.read ? 'border-slate-100 bg-white opacity-85' : 'border-pink-100 bg-pink-50/5'
              }`}>
                {!item.read && <span className="absolute left-2.5 top-5 w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />}
                <div className="pl-2">
                  <span className="text-[10px] font-black font-mono uppercase tracking-widest text-slate-400">{item.type} alert</span>
                  <h4 className="text-sm font-bold text-slate-800 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[9px] text-slate-400 block mt-2 font-mono">{item.time}</span>
                </div>
                <button onClick={() => deleteNotification(item.id)} className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-red-500 cursor-pointer border-none transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // 10. SUPPORT TAB
  const renderSupport = () => {
    const faqs = [
      { q: 'How does the weekly member selection work?', a: 'Every Sunday at 8:00 PM, our RNG algorithm selects active subscribers for free curated tour rewards. Silver plan includes 1 TRC (Travel Reward Credit) for weekly reward participation, Gold includes 1 TRC, and Platinum includes 1 TRC. If not selected, value protection discount credits are credited to your wallet.' },
      { q: 'What is Beduine Value Protection Policy?', a: 'If you subscribe and are not selected in the weekly draws, we issue ₹500 value Discount Credits. These non-cash credits are fully valid for booking any of our domestic and international paid tour packages, protecting the complete value of your subscription.' },
      { q: 'Can I change my name on the booking voucher?', a: 'Name change rules depend on your membership tier. Gold plan allows one name change, Platinum allows two, and Silver does not support name changes. Inquiries can be requested via WhatsApp.' },
      { q: 'How do I redeem my Discount Credit vouchers?', a: 'Simply go to "Book Travel", select your destination and date, and apply your active Discount Credit voucher code. Vouchers are applied to base package subtotals automatically.' }
    ];

    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
          <Phone className="w-5 h-5 text-[#FF6B6B]" /> Help &amp; Customer Support
        </h2>
        <p className="text-xs text-slate-400">Get assistance with travel bookings, vouchers, or membership upgrades</p>

        {/* Call support grid */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          {/* WhatsApp Support card */}
          <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="p-5 rounded-xl border border-emerald-100 bg-emerald-50/10 hover:shadow-md transition-shadow flex items-start gap-4 no-underline cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-805">Live WhatsApp Chat</span>
              <span className="block text-[11px] text-slate-500 mt-1 leading-normal">Connect directly with a support manager. Response in under 10 minutes.</span>
              <span className="block text-[10px] text-emerald-600 font-extrabold mt-3 uppercase tracking-wider font-mono">+91 87689 03565</span>
            </div>
          </a>

          {/* Voice helpline card */}
          <a href="tel:+917929085086" className="p-5 rounded-xl border border-sky-100 bg-sky-50/10 hover:shadow-md transition-shadow flex items-start gap-4 no-underline cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#00D4F5] text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-805">Voice Support Call</span>
              <span className="block text-[11px] text-slate-500 mt-1 leading-normal">Call our customer helpline desk. Direct calls available 10:00 AM – 7:00 PM.</span>
              <span className="block text-[10px] text-[#00D4F5] font-extrabold mt-3 uppercase tracking-wider font-mono">+91 79290 85086</span>
            </div>
          </a>
        </div>

        {/* support form query */}
        <form onSubmit={handleSupportSubmit} className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submit a Support Ticket</h3>
          
          {supportSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Thank you! Your ticket query was sent successfully. Our team will contact you shortly.
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Name</label>
              <input
                type="text"
                readOnly
                value={profileName}
                className="w-full px-4 py-3 rounded-xl border border-slate-150 outline-none text-xs text-slate-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Query Category</label>
              <select
                value={supportQuery.category}
                onChange={(e) => setSupportQuery({ ...supportQuery, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-750 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
              >
                <option>Booking Queries</option>
                <option>Refund Request</option>
                <option>Upgrade Membership</option>
                <option>Selection Draw Help</option>
                <option>Other Queries</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Query Message</label>
            <textarea
              rows={2}
              placeholder="Describe your issue or query details..."
              value={supportQuery.message}
              onChange={(e) => setSupportQuery({ ...supportQuery, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
              required
            />
          </div>
          <button type="submit" className="px-6 py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none transition-colors">
            Send Message
          </button>
        </form>

        {/* Collapsible FAQ accordion list */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all">
                <summary className="flex justify-between items-center p-4 text-xs font-bold text-slate-850 cursor-pointer list-none">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-xs text-slate-500 leading-relaxed font-semibold border-t pt-2.5">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 11. PROFILE TAB
  const renderProfile = () => {
    return (
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
        <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-800 uppercase tracking-wide">
          <User className="w-5 h-5 text-[#FF6B6B]" /> My Account &amp; Profile Settings
        </h2>
        <p className="text-xs text-slate-400">Manage account details, profile picture, and dashboard background styling</p>

        <div className="flex flex-col md:flex-row gap-6 items-start w-full">
          {/* Avatar upload */}
          <div className="bg-white border border-slate-150 p-4.5 rounded-2xl flex flex-col items-center gap-3 shrink-0 shadow-sm w-full md:w-[170px] text-center">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Profile Pic</span>
            <div className="relative group">
              <div className="w-20 h-20 rounded-full p-[3px] shadow-md bg-gradient-to-tr from-[#FF6B6B] to-[#00D4F5] flex items-center justify-center">
                {profileAvatar ? (
                  <img src={profileAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-2xl font-black text-white bg-slate-800 uppercase">
                    {profileName?.charAt(0) || 'R'}
                  </div>
                )}
              </div>
              <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] text-white font-bold text-center px-1">Upload</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <button onClick={() => setProfileAvatar(null)} className="text-[9px] text-red-500 font-bold hover:underline cursor-pointer border-none bg-transparent">Remove Picture</button>
          </div>

          {/* Background image picker customizable */}
          <div className="bg-white border border-slate-150 p-4.5 rounded-2xl flex flex-col items-center gap-3 shrink-0 shadow-sm w-full md:w-[220px] text-center">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Dashboard Background</span>
            
            {/* Background preview */}
            <div className="relative group w-40 h-20 rounded-xl overflow-hidden border">
              <img src={dashboardBg} alt="Background Preview" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-[10px] text-white font-bold px-1">Upload Custom</span>
                <input type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
              </label>
            </div>

            {/* Presets */}
            <div className="flex gap-1.5 mt-1">
              {[
                { name: 'Mountain', url: '/images/chatgpt_dashboard_bg.png' },
                { name: 'Beach', url: '/images/lucky_draw_winners_bg.png' }
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetBg(preset.url)}
                  className="px-2.5 py-1 rounded bg-slate-50 border border-slate-150 text-[8.5px] font-bold hover:bg-slate-100 cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
              <button onClick={handleResetBg} className="px-2.5 py-1 rounded bg-red-50 border border-red-100 text-[8.5px] font-bold text-red-500 hover:bg-red-100 cursor-pointer">Reset</button>
            </div>
          </div>

          {/* Details input form */}
          <div className="flex-1 space-y-4 w-full">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] ${
                    errors.name ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {errors.name && <span className="text-[9px] text-red-500 mt-1 block">{errors.name}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => {
                    setEditEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] ${
                    errors.email ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {errors.email && <span className="text-[9px] text-red-500 mt-1 block">{errors.email}</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={editMobile}
                  onChange={(e) => {
                    setEditMobile(e.target.value);
                    if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] ${
                    errors.mobile ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {errors.mobile && <span className="text-[9px] text-red-500 mt-1 block">{errors.mobile}</span>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editDob}
                  onChange={(e) => setEditDob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City / Region</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Residential Address</label>
              <textarea
                rows={2}
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
              />
            </div>

            <button onClick={handleSaveProfile} className="px-6 py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none shadow-sm transition-colors">
              Save Profile Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen pt-2 lg:pt-3 pb-10 relative overflow-x-hidden"
      style={{ 
        backgroundImage: `url('${dashboardBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Semi-transparent soft overlay to ensure maximum readability */}
      <div className="absolute inset-0 bg-[#EAF7FB]/25 backdrop-blur-[3px] pointer-events-none z-0" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SUB HEADER: Back Button & User Info / Notifications */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-3.5 px-4 gap-4"
        >
          {onBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/80 shadow-sm text-xs font-bold text-slate-750 hover:text-[#FF6B6B] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              <ChevronLeft className="w-4 h-4 text-[#FF6B6B]" />
              <span>Back to Home</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-2 rounded-full border border-white/80 shadow-sm">
            <span className="text-xs font-bold text-slate-800">{profileName}</span>
            <div className="w-px h-3.5 bg-slate-300" />
            <Bell onClick={() => setActiveTab('notifications')} className="w-4 h-4 cursor-pointer text-slate-600 hover:text-[#FF6B6B] transition-colors" />
            {profileAvatar ? (
              <img 
                onClick={() => setActiveTab('profile')} 
                src={profileAvatar} 
                alt="Avatar" 
                className="w-5.5 h-5.5 rounded-full cursor-pointer object-cover border border-[#FF6B6B]/20 hover:border-[#FF6B6B] hover:scale-105 active:scale-95 transition-all shadow-sm"
              />
            ) : (
              <div 
                onClick={() => setActiveTab('profile')} 
                className="w-5.5 h-5.5 rounded-full cursor-pointer flex items-center justify-center bg-gradient-to-tr from-[#FF6B6B] to-[#00D4F5] hover:from-[#FF6B6B] hover:to-[#FF6B6B] text-[10px] font-black text-white uppercase select-none transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                {profileName?.charAt(0) || 'R'}
              </div>
            )}
          </div>
        </motion.div>

        {/* MAIN 3-COLUMN LAYOUT */}
        <div className="grid md:grid-cols-[1fr_320px] lg:grid-cols-[280px_1fr_320px] xl:grid-cols-[300px_1fr_340px] gap-6 lg:gap-7 items-start">

          {/* ==================== LEFT COLUMN: SIDEBAR ==================== */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="hidden lg:flex flex-col gap-2 bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] p-6.5 rounded-[30px] sticky top-4 max-h-[92vh] overflow-y-auto animate-fadeIn"
          >
            {/* Logo and company headers */}
            <div className="flex items-center gap-3.5 px-2.5 py-2 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-orange-100 bg-white flex items-center justify-center p-2 shadow-sm shrink-0">
                <img src="/images/bedune_logo_transparent.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-black tracking-wide block text-[#FF6B6B] leading-none">BEDUINE</span>
                <span className="text-[9.5px] uppercase tracking-[0.2em] text-slate-400 font-bold font-mono leading-none mt-1.5">Tour &amp; Travels</span>
              </div>
            </div>

            {/* Admin Command Center Link */}
            {showDemoWallet && onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="w-full mb-4 px-4 py-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200 border-none text-[13.5px] font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Admin Command Center</span>
              </button>
            )}

            {/* Menu Header category */}
            <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 font-mono">
              Dashboard Menu
            </div>

            {/* 11 Navigation Tab Links list */}
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 border-none text-[13.5px] ${
                      isActive
                        ? 'font-bold bg-[#FF6B6B]/10 text-[#FF6B6B]'
                        : 'font-medium text-slate-500 hover:bg-orange-50/40 bg-transparent hover:translate-x-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF6B6B]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-[#FF6B6B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="w-full mt-4 px-4 py-2.5 rounded-xl flex items-center gap-3 cursor-pointer transition-all text-[13.5px] font-bold border-none bg-transparent hover:bg-red-50/50 hover:translate-x-0.5 text-red-500"
            >
              <LogOut className="w-4 h-4 text-red-400" /> Log Out
            </button>
          </motion.aside>

          {/* ==================== MOBILE MENU OPTIONS HORIZONTAL SCROLLABLE BAR ==================== */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 px-1 scrollbar-hide">
            {showDemoWallet && onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all text-xs font-black border-none shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all text-xs font-bold border-none shadow-sm ${
                    isActive ? 'text-white bg-[#FF6B6B]' : 'text-slate-500 bg-white border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white text-[#FF6B6B]' : 'bg-[#FF6B6B] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={onLogout}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer text-red-500 bg-white border border-slate-100 hover:bg-red-50/20 text-xs font-bold border-none shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>

          {/* ==================== CENTER COLUMN: TABS CONTAINER ==================== */}
          <motion.main 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'subscription' && renderSubscription()}
                {activeTab === 'weekly-participation' && renderWeeklyParticipation()}
                {activeTab === 'credits' && renderCredits()}
                {activeTab === 'coupons' && renderCoupons()}
                {activeTab === 'bookings' && renderTourBookings()}
                {activeTab === 'custom-tours' && renderCustomTourRequests()}
                {activeTab === 'referrals' && renderReferrals()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'support' && renderSupport()}
                {activeTab === 'profile' && renderProfile()}
              </motion.div>
            </AnimatePresence>
          </motion.main>

          {/* ==================== RIGHT COLUMN: HOTSPOTS AND WIDGETS ==================== */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {!planName ? (
              <>
                {/* Start Your Journey */}
                <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex-1 space-y-1.5 font-sans">
                    <h3 className="text-sm sm:text-base font-black text-slate-800 leading-tight">Start Your Journey</h3>
                    <p className="text-[11px] text-slate-500 leading-normal font-medium">
                      Choose a subscription plan and begin your travel story today.
                    </p>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#FF8E53] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-rose-100 cursor-pointer border-none flex items-center gap-1.5 mt-2.5 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      View Subscription Plans <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="w-20 h-20 shrink-0 flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden p-1 shadow-sm">
                    <img src="/images/passport_journey.png" alt="Passport" className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Popular Destinations */}
                <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4 font-sans">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Popular Destinations</h3>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="text-[10px] font-bold text-blue-500 hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4 font-sans">
                    {/* Destination 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src="/images/kashmir_dal_lake_1779521728036.png" alt="Kashmir Valley" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800">Kashmir Valley</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                          <Compass className="w-2.5 h-2.5 text-slate-400" /> Paradise on Earth
                        </div>
                      </div>
                    </div>
                    {/* Destination 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src="/images/goa_beaches.png" alt="Goa Beaches" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800">Goa Beaches</h4>
                        <div className="text-[10px] text-slate-500 flex items-center gap-0.5 font-medium">
                          <Compass className="w-2.5 h-2.5 text-slate-400" /> Sun, Sand & Serenity
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Need Help? */}
                <div className="bg-sky-50/40 border border-sky-100/60 shadow-[0_4px_20px_rgba(59,130,246,0.02)] rounded-[24px] p-5 text-left flex items-center gap-4 hover:shadow-md transition-shadow font-sans">
                  <div className="w-10 h-10 rounded-full bg-white border border-sky-100 flex items-center justify-center shrink-0 shadow-sm text-blue-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="text-xs font-black text-slate-800">Need Help?</h4>
                    <p className="text-[10px] text-slate-500 leading-none font-medium">We are here for you!</p>
                    <button
                      onClick={() => setActiveTab('support')}
                      className="text-[10px] font-bold text-blue-600 hover:underline bg-transparent border-none cursor-pointer mt-1.5 flex items-center gap-0.5 p-0"
                    >
                      Contact Support <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
            {/* Barcelona Hotspot card */}
            <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left hover:shadow-md transition-shadow flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#FF8E53]" /> Featured Hotspot
                </h4>
                <span className="text-[9px] bg-sky-50 text-[#00D4F5] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Handpicked</span>
              </div>
              
              <div className="rounded-xl overflow-hidden h-40 relative bg-slate-900 group cursor-pointer shadow-inner">
                <img 
                  src="/images/barcelona_hotspot.png" 
                  alt="Barcelona" 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm font-black uppercase tracking-wider">Barcelona</div>
                  <div className="text-[10px] font-bold opacity-85 mt-0.5">The Mediterranean Jewel</div>
                </div>
              </div>

              <a href="https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%252520want%252520to%252520book%252520a%252520tour%25252520to%2525252520Barcelona." target="_blank" rel="noreferrer"
                className="w-full py-3 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-[1.01] hover:border-slate-300 active:scale-[0.99] cursor-pointer no-underline"
              >
                Book This Tour <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Elite membership benefits card */}
            <div className="bg-gradient-to-r from-[#00D4F5] to-[#3B82F6] rounded-[24px] p-5 sm:p-6 text-center relative overflow-hidden text-white shadow-md hover:shadow-lg transition-all duration-300">
              <Crown className="w-6 h-6 text-gold-accent mx-auto mb-2.5 animate-bounce" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1.5">Selected • Beduine Elite Member</h4>
              <p className="text-[10px] text-white/80 leading-relaxed font-semibold">Exclusive entry credits, weekly selection eligibility and name changes protected.</p>
              <div className="mt-4 pt-2.5 border-t border-white/20">
                <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="text-[9.5px] font-bold text-white uppercase tracking-wider underline hover:opacity-90">
                  Discount Credits: Always Active
                </a>
              </div>
            </div>

            {/* Destinations card list */}
            <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-6 text-left hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-[#FF8E53]" /> Explore Destinations
                </span>
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className="text-[9.5px] font-bold text-[#3B82F6] hover:underline bg-transparent border-none cursor-pointer uppercase tracking-wider"
                >
                  View All
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mb-4">
                Explore popular travel highlights included in your membership plans
              </p>

              <div className="flex flex-col gap-2.5">
                {DESTINATIONS.map((dest, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200/50 relative group cursor-pointer h-16 shadow-sm">
                    <img
                      src={dest.img}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 text-left">
                      <span className="block text-[11px] font-bold leading-tight">{dest.name}</span>
                      <span className="block text-[8px] text-slate-350 leading-tight mt-0.5">{dest.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
            )}
          </motion.aside>

        </div>

        {/* ==================== PREMIUM FOOTER BAR ==================== */}
        <div className="mt-8 pt-5 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-[10px] font-medium font-sans">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-slate-700 font-extrabold text-[10px]">100% Secure Payments</span>
                <span className="block text-slate-400 text-[8.5px] font-medium mt-0.5">Your payment is safe with us</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-slate-700 font-extrabold text-[10px]">Best Price Guarantee</span>
                <span className="block text-slate-400 text-[8.5px] font-medium mt-0.5">We offer the best prices</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-slate-700 font-extrabold text-[10px]">24/7 Customer Support</span>
                <span className="block text-slate-400 text-[8.5px] font-medium mt-0.5">We are always here to help</span>
              </div>
            </div>
          </div>
          <div className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] font-mono">
            © 2025 Beduine Tour & Travels. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
