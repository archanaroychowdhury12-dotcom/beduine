import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabaseClient';
import { demoWalletService } from '../services/demoWalletService';
import { CreditLedgerEntry } from '../types';
import { getAvailableCredits } from '../utils/creditHelpers';
import {
  generateMockParticipants,
  getParticipantVerification,
  generateRandomToken,
  exportToCSV,
  exportToPDF
} from '../utils/dashboardUtils';

const DEFAULT_DASHBOARD_BG = 'radial-gradient(circle at center, #0B1E2B 0%, #07131D 100%)';
const DASHBOARD_BG_STORAGE_KEY = 'beduine_dashboard_bg_image';

interface UseDashboardStateProps {
  user: any;
  setCurrentUser: any;
}

export function useDashboardState({ user, setCurrentUser }: UseDashboardStateProps) {
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
  const [activePlanPrice, setActivePlanPrice] = useState<string | null>(() => user?.planPrice || null);
  const [activePlanType, setActivePlanType] = useState<string | null>(() => user?.planType || null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>(() => user?.subscriptionStatus || 'inactive');
  const [realWalletBalance, setRealWalletBalance] = useState<number>(() => user?.real_wallet_balance ?? 0);
  const [demoWalletBalance, setDemoWalletBalance] = useState<number>(() => user?.demo_wallet_balance ?? 0);
  const [demoTransactions, setDemoTransactions] = useState<any[]>(() => user?.demo_transactions || []);

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

        setCurrentUser({
          ...user,
          ...updatedUser.user_metadata,
          user_metadata: updatedUser.user_metadata
        });

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

  const [verificationLogs, setVerificationLogs] = useState<any>(() => {
    const saved = localStorage.getItem('beduine_verification_logs');
    return saved ? JSON.parse(saved) : null;
  });
  const [notificationLogs, setNotificationLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('beduine_notification_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'failed'>('all');

  // Sync state to local storage when updated
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

  // Derived credits values
  const availableDomesticCredits = useMemo(() => {
    return getAvailableCredits(ledger, 'domestic');
  }, [ledger]);

  const availableInternationalCredits = useMemo(() => {
    return getAvailableCredits(ledger, 'international');
  }, [ledger]);

  // Handle manual selection
  const handleSelectWinner = (p: any) => {
    if (p.status !== 'verified') {
      alert(`Candidate ${p.name} fails automatic verification: ${p.verification_reason}`);
      return;
    }
    const isAlready = selectedWinners.some(w => w.id === p.id);
    if (isAlready) {
      setSelectedWinners(prev => prev.filter(w => w.id !== p.id));
    } else {
      const couponToken = generateRandomToken();
      setSelectedWinners(prev => [...prev, { ...p, coupon: `BED-CUP-${couponToken}` }]);
    }
  };

  // Inline verification details trigger
  const handleVerifyCandidate = (pId: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === pId) {
        const ver = getParticipantVerification(p);
        return {
          ...p,
          status: ver.status,
          verification_reason: ver.reason
        };
      }
      return p;
    }));
  };

  // Run selection cycle simulation
  const runSelectionCycle = () => {
    if (cycleState === 'Result Published') {
      alert("Results have already been processed and published for this cycle. Please reset to run a new cycle.");
      return;
    }
    
    setCycleState('Result Pending');
    setProcessingLogs(['Initializing Secure Draw Session...', 'Loading Registered Candidates List...']);
    setLoadingProgress(5);
    
    const logs = [
      'Performing 256-bit cryptographic signature handshake...',
      'Verifying regional quota allocations...',
      'Checking subscription compliance for all candidates...',
      'Validating payment status in real-time ledger...',
      'Scanning for duplicate profile entries...',
      'Processing automatic verification (N=1,000)...',
      'Running cryptographic selection lottery algorithm (K=ROUNDUP(N*5%))...',
      'Generating verified Beduine promotional coupons...',
      'Hashing final selection list (SHA-256)...',
      'Selection cycle completed successfully!'
    ];

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < logs.length) {
        setProcessingLogs(prev => [...prev, logs[currentIdx]]);
        setLoadingProgress(prev => Math.min(100, prev + 10));
        currentIdx++;
      } else {
        clearInterval(interval);
        
        // Execute the selection logic
        const verifiedList = participants.filter(p => {
          const ver = getParticipantVerification(p);
          return ver.status === 'verified';
        });
        
        const N = verifiedList.length;
        const K = Math.ceil(N * 0.05); // 5% select ratio
        
        // Shuffle verified list
        const shuffled = [...verifiedList].sort(() => 0.5 - Math.random());
        const winners = shuffled.slice(0, K).map(p => {
          const token = generateRandomToken();
          return {
            ...p,
            coupon: `BED-CUP-${token}`
          };
        });
        
        const hash = generateRandomToken();
        const logsPayload = {
          timestamp: new Date().toLocaleString(),
          totalN: N,
          selectedK: K,
          hash: `SHA256-${hash}`
        };
        
        setSelectedWinners(winners);
        setVerificationLogs(logsPayload);
        setCycleState('Result Published');
      }
    }, 450);
  };

  // Send email alerts simulation
  const sendMockNotifications = () => {
    if (selectedWinners.length === 0) {
      alert("No winners selected yet. Please run the draw cycle first.");
      return;
    }
    const sentLogs: string[] = [];
    selectedWinners.forEach(w => {
      sentLogs.push(`Email and SMS notification successfully dispatched to Winner: ${w.name} (${w.email}). Coupon: ${w.coupon}`);
    });
    setNotificationLogs(sentLogs);
    alert(`Successfully dispatched notifications to all ${selectedWinners.length} selected winners.`);
  };

  const resetCycle = () => {
    setSelectedWinners([]);
    setVerificationLogs(null);
    setNotificationLogs([]);
    setCycleState('Entry Open');
    setLoadingProgress(0);
    setProcessingLogs([]);
    
    // Regenerate mock participants list to start fresh
    setParticipants(generateMockParticipants());
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      fullName: profileName,
      email: profileEmail,
      mobile: profileMobile,
      avatar: profileAvatar,
      address: profileAddress,
      city: profileCity,
      dob: profileDob
    };
    setCurrentUser(updated);

    await supabase.auth.updateUser({
      data: {
        full_name: profileName,
        email: profileEmail,
        mobile: profileMobile,
        avatar: profileAvatar,
        address: profileAddress,
        city: profileCity,
        dob: profileDob
      }
    });
    alert("Profile details successfully synchronized!");
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const bgString = reader.result as string;
        setDashboardBg(bgString);
        localStorage.setItem(DASHBOARD_BG_STORAGE_KEY, bgString);
        alert("Dashboard background image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = () => {
    setDashboardBg(DEFAULT_DASHBOARD_BG);
    localStorage.removeItem(DASHBOARD_BG_STORAGE_KEY);
    alert("Background reset to default cosmic view.");
  };

  return {
    activeTab,
    setActiveTab,
    profileName,
    setProfileName,
    profileEmail,
    setProfileEmail,
    profileMobile,
    setProfileMobile,
    profileAvatar,
    setProfileAvatar,
    profileAddress,
    setProfileAddress,
    profileCity,
    setProfileCity,
    profileDob,
    setProfileDob,
    dashboardBg,
    setDashboardBg,
    isDemoWalletEnabled,
    isDemoOrAdminUser,
    showDemoWallet,
    activePlan,
    activePlanPrice,
    activePlanType,
    subscriptionStatus,
    realWalletBalance,
    demoWalletBalance,
    demoTransactions,
    selectedPlanId,
    setSelectedPlanId,
    paymentMethod,
    setPaymentMethod,
    checkoutLoading,
    checkoutSuccess,
    isWeeklyActivated,
    setIsWeeklyActivated,
    bookingStatus,
    setBookingStatus,
    cycleState,
    setCycleState,
    participants,
    setParticipants,
    selectedWinners,
    setSelectedWinners,
    verificationLogs,
    setVerificationLogs,
    notificationLogs,
    setNotificationLogs,
    processingLogs,
    loadingProgress,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    availableDomesticCredits,
    availableInternationalCredits,
    ledger,
    setLedger,
    planName,
    planType,
    memberId,
    voucherCount,
    handleCheckout,
    handleSelectWinner,
    handleVerifyCandidate,
    runSelectionCycle,
    sendMockNotifications,
    resetCycle,
    handleUpdateProfile,
    handleBgUpload,
    handleResetBg,
    exportToCSV: () => exportToCSV(verificationLogs, participants, selectedWinners),
    exportToPDF: () => exportToPDF(verificationLogs, participants, selectedWinners, cycleState, notificationLogs)
  };
}
