import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShieldCheck, Ticket, CreditCard, Plane, Route, Share2, Bell, Phone, User
} from 'lucide-react';
import { useDashboardState } from './hooks/useDashboardState';

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
  setCurrentUser?: any;
  onLogout: () => void;
  onBookPaidTour?: () => void;
  onBack?: () => void;
  onGoToAdmin?: () => void;
}

export default function DashboardPage({
  user,
  setCurrentUser,
  onLogout,
  onBookPaidTour,
  onBack,
  onGoToAdmin
}: DashboardPageProps) {
  const state = useDashboardState({ user, setCurrentUser });

  // 10 Menu items list with Lucide Icons + Admin Control if enabled
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'subscription', label: 'My Subscription', icon: ShieldCheck },
    { id: 'weekly-participation', label: 'Travel Reward', icon: Ticket },
    { id: 'credits', label: 'Credits & Coupons', icon: CreditCard },
    { id: 'bookings', label: 'Tour Bookings', icon: Plane },
    { id: 'custom-tours', label: 'Custom Tour Requests', icon: Route },
    { id: 'referrals', label: 'Referrals', icon: Share2 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: state.displayedNotifications.filter(n => !n.read).length },
    { id: 'support', label: 'Support', icon: Phone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <DashboardLayout
      user={user}
      profileName={state.profileName}
      profileAvatar={state.profileAvatar}
      activeTab={state.activeTab}
      setActiveTab={state.setActiveTab}
      dashboardBg={state.dashboardBg}
      showDemoWallet={state.showDemoWallet}
      onGoToAdmin={onGoToAdmin}
      onLogout={onLogout}
      onBack={onBack}
      planName={state.planName}
      sidebarItems={sidebarItems}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={state.activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {state.activeTab === 'overview' && (
            <OverviewTab
              user={user}
              profileName={state.profileName}
              planName={state.planName}
              planType={state.planType}
              memberId={state.memberId}
              bookingStatus={state.bookingStatus}
              availableDiscountCredits={state.availableDiscountCredits}
              discountCreditBalance={state.discountCreditBalance}
              domesticDiscountCredits={state.domesticDiscountCredits}
              internationalDiscountCredits={state.internationalDiscountCredits}
              availableLuckyDrawCredits={state.availableLuckyDrawCredits}
              isWeeklyActivated={state.isWeeklyActivated}
              setActiveTab={state.setActiveTab}
              showDemoWallet={state.showDemoWallet}
              demoWalletBalance={state.demoWalletBalance}
              setDemoWalletBalance={state.setDemoWalletBalance}
              setDemoTransactions={state.setDemoTransactions}
              displayedCoupons={state.activePlan ? state.couponsList : []}
              displayedNotifications={state.displayedNotifications}
              onBookPaidTour={onBookPaidTour}
            />
          )}
          {state.activeTab === 'subscription' && (
            <SubscriptionTab
              user={user}
              planName={state.planName}
              activePlanPrice={state.activePlanPrice}
              subscriptionStatus={state.subscriptionStatus}
              demoWalletBalance={state.demoWalletBalance}
              demoTransactions={state.demoTransactions}
              selectedPlanId={state.selectedPlanId}
              setSelectedPlanId={state.setSelectedPlanId}
              paymentMethod={state.paymentMethod}
              setPaymentMethod={state.setPaymentMethod}
              checkoutLoading={state.checkoutLoading}
              checkoutSuccess={state.checkoutSuccess}
              setCheckoutSuccess={state.setCheckoutSuccess}
              setActiveTab={state.setActiveTab}
              showDemoWallet={state.showDemoWallet}
              handleCheckout={state.handleCheckout}
              voucherCount={state.voucherCount}
              planType={state.planType}
              memberId={state.memberId}
            />
          )}
          {state.activeTab === 'weekly-participation' && (
            <div className="space-y-6">
              <TravelRewardTab
                availableLuckyDrawCredits={state.availableLuckyDrawCredits}
                isWeeklyActivated={state.isWeeklyActivated}
                handleActivateWeeklyParticipation={state.handleActivateWeeklyParticipation}
                cycleState={state.cycleState}
              />
              {state.showDemoWallet && (
                <AdminDrawPanel
                  cycleState={state.cycleState}
                  setCycleState={state.setCycleState}
                  participants={state.participants}
                  setParticipants={state.setParticipants}
                  selectedWinners={state.selectedWinners}
                  setSelectedWinners={state.setSelectedWinners}
                  verificationLogs={state.verificationLogs}
                  setVerificationLogs={state.setVerificationLogs}
                  notificationLogs={state.notificationLogs}
                  setNotificationLogs={state.setNotificationLogs}
                  handleFreezeList={state.handleFreezeList}
                  handleRunRNGDraw={state.handleRunRNGDraw}
                  handleCancelDraw={state.handleCancelDraw}
                  handleResetDraw={state.handleResetDraw}
                  handleAddMockParticipant={state.handleAddMockParticipant}
                  handleRemoveMockParticipant={state.handleRemoveMockParticipant}
                  handleAssignTourDetails={state.handleAssignTourDetails}
                  handleBulkAssignTour={state.handleBulkAssignTour}
                  handleToggleCallConfirmed={state.handleToggleCallConfirmed}
                  handleCancelWinnerCoupon={state.handleCancelWinnerCoupon}
                  exportToCSV={state.exportToCSV}
                  exportToPDF={state.exportToPDF}
                />
              )}
            </div>
          )}
          {(state.activeTab === 'credits' || state.activeTab === 'coupons') && (
            <CreditsTab
              activePlan={state.activePlan}
              profileName={state.profileName}
              selectedWinners={state.selectedWinners}
              availableDiscountCredits={state.availableDiscountCredits}
              discountCreditBalance={state.discountCreditBalance}
              domesticDiscountCredits={state.domesticDiscountCredits}
              internationalDiscountCredits={state.internationalDiscountCredits}
              newCouponCode={state.newCouponCode}
              setNewCouponCode={state.setNewCouponCode}
              couponError={state.couponError}
              setCouponError={state.setCouponError}
              couponSuccess={state.couponSuccess}
              handleAddCoupon={state.handleAddCoupon}
              ledger={state.ledger}
            />
          )}
          {state.activeTab === 'bookings' && (
            <BookingsTab
              activePlan={state.activePlan}
              bookingStatus={state.bookingStatus}
              handleCancelBooking={state.handleCancelBooking}
              onBookPaidTour={onBookPaidTour}
            />
          )}
          {state.activeTab === 'custom-tours' && (
            <CustomToursTab
              user={user}
              customRequestsList={state.customRequestsList}
              setCustomRequestsList={state.setCustomRequestsList}
              selectedCustomRequest={state.selectedCustomRequest}
              setSelectedCustomRequest={state.setSelectedCustomRequest}
              showNewRequestForm={state.showNewRequestForm}
              setShowNewRequestForm={state.setShowNewRequestForm}
              customRequestSuccess={state.customRequestSuccess}
              setCustomRequestSuccess={state.setCustomRequestSuccess}
              customRequestSuccessData={state.customRequestSuccessData}
              setCustomRequestSuccessData={state.setCustomRequestSuccessData}
              loadCustomRequests={state.loadCustomRequests}
              handleDashboardCustomRequestSubmit={state.handleDashboardCustomRequestSubmit}
            />
          )}
          {state.activeTab === 'referrals' && (
            <ReferralsTab
              activePlan={state.activePlan}
              referralCode={state.referralCode}
              copyReferralLink={state.copyReferralLink}
              copiedReferral={state.copiedReferral}
            />
          )}
          {state.activeTab === 'notifications' && (
            <NotificationsTab
              displayedNotifications={state.displayedNotifications}
              markAllNotificationsRead={state.markAllNotificationsRead}
              deleteNotification={state.deleteNotification}
            />
          )}
          {state.activeTab === 'support' && (
            <SupportTab
              profileName={state.profileName}
              supportQuery={state.supportQuery}
              setSupportQuery={state.setSupportQuery}
              supportSuccess={state.supportSuccess}
              handleSupportSubmit={state.handleSupportSubmit}
            />
          )}
          {state.activeTab === 'profile' && (
            <ProfileTab
              profileName={state.profileName}
              profileAvatar={state.profileAvatar}
              setProfileAvatar={state.setProfileAvatar}
              dashboardBg={state.dashboardBg}
              editName={state.editName}
              setEditName={state.setEditName}
              editEmail={state.editEmail}
              setEditEmail={state.setEditEmail}
              editMobile={state.editMobile}
              setEditMobile={state.setEditMobile}
              editDob={state.editDob}
              setEditDob={state.setEditDob}
              editCity={state.editCity}
              setEditCity={state.setEditCity}
              editAddress={state.editAddress}
              setEditAddress={state.setEditAddress}
              errors={state.errors}
              setErrors={state.setErrors}
              handleSaveProfile={state.handleSaveProfile}
              handleAvatarChange={state.handleAvatarChange}
              handleBgChange={state.handleBgChange}
              handleResetBg={state.handleResetBg}
              handlePresetBg={state.handlePresetBg}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
}
