import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { AppUser, SupabaseRawUser } from '@/types';
import { auditLogService } from '@/services/auditLogService';
import { supabase } from '@/utils/supabaseClient';
import { applyNonWinnerDiscountCredit } from '@/services/nonWinnerCreditService';
import { confirmAction, notify } from '@/services/uiFeedback';
import { generateMockParticipants, generateRandomToken, getParticipantVerification } from '@/features/dashboard/services/weeklyDraw.service';
import { selectPlanWiseWinners, summarizePlanRounds } from '@/features/dashboard/services/planWiseDraw.service';

type CycleState = 'Draft' | 'Entry Open' | 'Entry Closed' | 'List Frozen' | 'Result Pending' | 'Result Published' | 'Cancelled';
type DashboardNotification = { id: number; type: string; title: string; message: string; time: string; read: boolean };
type SetNotifications = Dispatch<SetStateAction<DashboardNotification[]>>;
type MockAuthAdmin = typeof supabase.auth & {
  getUsersList?: () => SupabaseRawUser[];
  saveUsersList?: (users: SupabaseRawUser[]) => void;
};

type WeeklySelectionOptions = {
  user: AppUser | any;
  activePlan: string | null;
  profileName: string;
  isWeeklyActivated: boolean;
  setNotifications: SetNotifications;
};

export function useWeeklySelection({ user, activePlan, profileName, isWeeklyActivated, setNotifications }: WeeklySelectionOptions) {
  const [cycleState, setCycleState] = useState<CycleState>('Entry Open');
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

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'beduine_winners_list' && e.newValue) {
        setSelectedWinners(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleFreezeList = () => {
    if (cycleState !== 'Entry Open' && cycleState !== 'Draft') return;
    const updated = participants.map((p) => {
      let currentP = { ...p };
      if (p.name === (profileName || 'Rahul Sen')) {
        currentP.weekly_entry_status = isWeeklyActivated ? 'valid' : 'invalid';
      }
      const verification = getParticipantVerification(currentP);
      if (verification.status === 'verified') {
        return { ...currentP, status: 'verified', verification_reason: '', ticketId: `BED-2026-W25-${p.id.padStart(4, '0')}` };
      }
      return { ...currentP, status: 'failed', verification_reason: verification.reason, ticketId: '' };
    });

    setParticipants(updated);
    const verifiedList = updated.filter(p => p.status === 'verified');
    const N = verifiedList.length;
    const rounds = summarizePlanRounds(verifiedList);
    const K = rounds.reduce((sum, round) => sum + round.selectedK, 0);
    setVerificationLogs({
      timestamp: new Date().toLocaleString(),
      hash: 'SEC-RNG-SHA256-DEMO-' + Math.floor(100000 + Math.random() * 900000),
      totalN: N,
      selectedK: K,
      rounds,
      freezeAt: 'Sunday 6:00 PM IST',
    });
    setCycleState('List Frozen');
  };

  const issueNonWinnerCreditsAfterResult = (verifiedWinners: any[], cycleId = 'WK-23') => {
    const auth = supabase.auth as MockAuthAdmin;
    if (!auth.getUsersList || !auth.saveUsersList) return { issuedCount: 0 };

    const winnerEmails = new Set(
      verifiedWinners
        .map((winner) => String(winner.email || '').trim().toLowerCase())
        .filter(Boolean)
    );

    let issuedCount = 0;
    const users = auth.getUsersList();
    const updatedUsers = users.map((rawUser) => {
      const metadata = rawUser.user_metadata || {};
      const email = String(rawUser.email || '').trim().toLowerCase();
      const hasActiveSubscription = metadata.subscriptionStatus === 'active' || metadata.subscription_payment_record?.payment_status === 'success';
      const hasActivatedWeeklyEntry = metadata.weekly_participation_status === 'active' && metadata.weekly_participation_cycle_id === cycleId;
      if (!hasActiveSubscription || !hasActivatedWeeklyEntry) return rawUser;

      if (winnerEmails.has(email)) {
        return {
          ...rawUser,
          user_metadata: {
            ...metadata,
            weekly_participation_status: 'winner',
            selected_member_benefit_status: 'winner',
          },
        };
      }

      const result = applyNonWinnerDiscountCredit(rawUser, cycleId);
      if (result.issued) issuedCount += 1;
      return result.user;
    });

    auth.saveUsersList(updatedUsers);

    if (issuedCount > 0) {
      auditLogService.logAdminAction({
        action: 'NON_WINNER_DISCOUNT_CREDITS_ISSUED',
        actor: user,
        amount: issuedCount,
        reason: `${issuedCount} eligible non-winner Discount Credit(s) issued for ${cycleId}`,
        metadata: { cycleId, issuedCount },
      });
    }

    return { issuedCount };
  };

  const handleRunRNGDraw = () => {
    if (cycleState !== 'List Frozen') return;
    setCycleState('Result Pending');

    setTimeout(() => {
      const currentUserName = profileName || 'Rahul Sen';
      const verifiedPool = participants.filter(p => p.status === 'verified' && p.ticketId);
      const selectedVerified = selectPlanWiseWinners(verifiedPool);

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
          redeemedBy: '',
        };
      });

      const winners = [...verifiedWinners];
      setSelectedWinners(winners);
      const nonWinnerCreditResult = issueNonWinnerCreditsAfterResult(verifiedWinners, 'WK-23');

      const selectedMember = winners.find(w => w.name === currentUserName && w.verification_status === 'verified');
      if (selectedMember) {
        setNotifications(prev => [
          {
            id: Date.now(),
            type: 'draw',
            title: '🎉 Beduine Weekly Winner',
            message: 'You have been selected as a Beduine weekly winner. Our representative will call you shortly to verify details and finalize the package.',
            time: 'Just now',
            read: false,
          },
          ...prev,
        ]);
      }

      const logs: string[] = [];
      winners.forEach(w => {
        logs.push(`[SMS Sent] to ${w.name} (${w.phone}): You have been selected as a Beduine weekly winner. Coupon Code: ${w.coupon}`);
        logs.push(`[Email Despatched] to ${w.email}: Beduine winner notification sent. Valid for 12 months.`);
      });

      if (nonWinnerCreditResult.issuedCount > 0) {
        logs.push(`[Credit Issued] ${nonWinnerCreditResult.issuedCount} eligible non-winner user account(s) received Discount Credit for paid tour booking.`);
      }

      setNotificationLogs(logs);
      setCycleState('Result Published');
    }, 1500);
  };

  const handleCancelDraw = () => {
    setCycleState('Cancelled');
    setSelectedWinners([]);
    setNotificationLogs([]);
    auditLogService.logAdminAction({
      action: 'DRAW_CANCELLED',
      actor: user,
      reason: 'Weekly member selection cycle cancelled from separated admin controls',
      metadata: { previousCycleState: cycleState },
    });
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
      notify.info('List is frozen/closed. Cannot add participants silently.');
      return;
    }
    const newP = {
      id: String(participants.length + 1),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '+91 ' + Math.floor(9000000000 + Math.random() * 1000000000),
      plan,
      subscription_status: 'active',
      payment_status: 'paid',
      weekly_entry_status: 'valid',
      account_status: 'active',
      is_duplicate: false,
      ticketId: '',
      status: 'verified',
      verification_reason: '',
    };
    setParticipants([...participants, newP]);
  };

  const handleRemoveMockParticipant = (id: string) => {
    if (cycleState === 'List Frozen' || cycleState === 'Result Published' || cycleState === 'Cancelled') {
      notify.info('List is frozen/closed. Cannot remove participants silently.');
      return;
    }
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleAssignTourDetails = (winnerId: string, destination: string, batch: string, travelDate: string) => {
    setSelectedWinners(prev => prev.map(w => w.id === winnerId ? { ...w, destination, batch, travelDate, status: 'Tour Assigned' } : w));
  };

  const handleBulkAssignTour = (plan: string, destination: string, batch: string, travelDate: string) => {
    setSelectedWinners(prev => prev.map(w => {
      if (w.plan.toLowerCase().includes(plan.toLowerCase()) && w.verification_status === 'verified' && w.status !== 'Redeemed' && w.status !== 'Cancelled') {
        return { ...w, destination, batch, travelDate, callConfirmed: true, status: 'Tour Assigned' };
      }
      return w;
    }));
  };

  const handleToggleCallConfirmed = (winnerId: string) => {
    setSelectedWinners(prev => prev.map(w => {
      if (w.id === winnerId) {
        const nextState = !w.callConfirmed;
        return { ...w, callConfirmed: nextState, callConfirmedAt: nextState ? new Date().toLocaleString() : '' };
      }
      return w;
    }));
  };

  const handleCancelWinnerCoupon = async (winnerId: string) => {
    const confirmCancel = await confirmAction({
      title: 'Cancel selected-member coupon?',
      message: 'This action is irreversible.',
      confirmLabel: 'Cancel coupon',
      danger: true,
    });
    if (!confirmCancel) return;
    const winner = selectedWinners.find(w => w.id === winnerId);
    setSelectedWinners(prev => prev.map(w => w.id === winnerId ? { ...w, status: 'Cancelled' } : w));
    auditLogService.logAdminAction({
      action: 'WINNER_CANCELLED',
      actor: user,
      targetId: winnerId,
      targetEmail: winner?.email,
      reason: `Selected-member coupon cancelled${winner?.coupon ? `: ${winner.coupon}` : ''}`,
      metadata: { selectedMemberName: winner?.name, coupon: winner?.coupon },
    });
  };

  const exportToCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'BEDUINE TOUR & TRAVELS - WEEKLY MEMBER SELECTION RESULTS REPORT\n';
    csvContent += `Execution Date/Time,${verificationLogs?.timestamp || new Date().toLocaleString()}\n`;
    csvContent += `Verification Hash,${verificationLogs?.hash || 'N/A'}\n`;
    csvContent += `Total Eligible Participants (N),${verificationLogs?.totalN || 0}\n`;
    csvContent += `Winner Slots,${verificationLogs?.selectedK || 0}\n\n`;
    csvContent += 'Participant ID,Name,Email,Phone,Plan,Ticket ID,Selection Status,Benefit Coupon (UUID)\n';
    participants.forEach((p) => {
      const isSelected = selectedWinners.some(w => w.id === p.id);
      const coupon = isSelected ? selectedWinners.find(w => w.id === p.id).coupon : '';
      csvContent += `"${p.id}","${p.name}","${p.email}","${p.phone}","${p.plan}","${p.ticketId || 'N/A'}","${isSelected ? 'SELECTED' : 'NOT SELECTED'}","${coupon}"\n`;
    });
    csvContent += '\n\nLEGAL NOTICE: Selection-based promotional module will remain disabled in production until the client provides approved rules, eligibility criteria, privacy terms and written legal authorization.\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Beduine_Selection_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    let content = '';
    content += '=========================================================================' + '\n';
    content += '           BEDUINE TOUR & TRAVELS - WEEKLY MEMBER SELECTION REPORT        ' + '\n';
    content += '=========================================================================' + '\n\n';
    content += `Report Generated: ${new Date().toLocaleString()}\n`;
    content += `Verification Security Hash: ${verificationLogs?.hash || 'N/A'}\n`;
    content += `Cycle Status: ${cycleState.toUpperCase()}\n\n`;
    content += '-------------------------------------------------------------------------' + '\n';
    content += 'SELECTION METRICS\n';
    content += '-------------------------------------------------------------------------' + '\n';
    content += `Total Registered Candidates: ${participants.length}\n`;
    content += `Eligible Participant Count (N): ${verificationLogs?.totalN || 0}\n`;
    content += `Winner Slots: ${verificationLogs?.selectedK || 0}\n\n`;
    content += '-------------------------------------------------------------------------' + '\n';
    content += 'SELECTED MEMBER LIST & VERIFIED COUPONS\n';
    content += '-------------------------------------------------------------------------' + '\n';
    if (selectedWinners.length === 0) {
      content += 'No members selected in this cycle.\n';
    } else {
      selectedWinners.forEach((w, idx) => {
        content += `${idx + 1}. Name: ${w.name}\n`;
        content += `   Ticket ID: ${w.ticketId}\n`;
        content += `   Coupon UUID: ${w.coupon}\n`;
        content += `   Contact: ${w.phone} | ${w.email}\n\n`;
      });
    }
    content += '-------------------------------------------------------------------------' + '\n';
    content += 'NOTIFICATION DESPATCH LOGS\n';
    content += '-------------------------------------------------------------------------' + '\n';
    notificationLogs.forEach((log) => {
      content += `[LOG] ${log}\n`;
    });
    content += '\n-------------------------------------------------------------------------\n';
    content += 'LEGAL NOTICE / CONTRACTUAL RESTRICTION\n';
    content += '-------------------------------------------------------------------------\n';
    content += 'Selection-based promotional module will remain disabled in production\n';
    content += 'until the client provides approved rules, eligibility criteria, privacy\n';
    content += 'terms and written legal authorization.\n\n';
    content += '=========================================================================' + '\n';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Beduine_Selection_Report_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
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
    exportToPDF,
  };
}
