import { motion, AnimatePresence } from 'framer-motion';
import { OverviewTab } from '../../../components/dashboard/OverviewTab';
import { SubscriptionTab } from '../../../components/dashboard/SubscriptionTab';
import { TravelRewardTab } from '../../../components/dashboard/TravelRewardTab';
import { CreditsTab } from '../../../components/dashboard/CreditsTab';
import { BookingsTab, CustomToursTab, ReferralsTab, NotificationsTab, SupportTab } from '../../../components/dashboard/BookingsTab';
import { ProfileTab } from '../../../components/dashboard/ProfileTab';

type DashboardTabRendererProps = {
  ctx: any;
};

export function DashboardTabRenderer({ ctx }: DashboardTabRendererProps) {
  const {
    activeTab,
    user,
    profileName,
    planName,
    planType,
    memberId,
    bookingStatus,
    availableDiscountCredits,
    discountCreditBalance,
    domesticDiscountCredits,
    internationalDiscountCredits,
    availableLuckyDrawCredits,
    isWeeklyActivated,
    setActiveTab,
    showDemoWallet,
    demoWalletBalance,
    setDemoWalletBalance,
    setDemoTransactions,
    activePlan,
    couponsList,
    displayedNotifications,
    onBookPaidTour,
    _activePlanPrice,
    _subscriptionStatus,
    _demoTransactions,
    selectedPlanId,
    setSelectedPlanId,
    paymentMethod,
    setPaymentMethod,
    checkoutLoading,
    checkoutSuccess,
    setCheckoutSuccess,
    handleCheckout,
    voucherCount,
    cycleState,
    handleActivateWeeklyParticipation,
    selectedWinners,
    newCouponCode,
    setNewCouponCode,
    couponError,
    setCouponError,
    couponSuccess,
    handleAddCoupon,
    ledger,
    handleCancelBooking,
    customRequestsList,
    setCustomRequestsList,
    selectedCustomRequest,
    setSelectedCustomRequest,
    showNewRequestForm,
    setShowNewRequestForm,
    customRequestSuccess,
    setCustomRequestSuccess,
    customRequestSuccessData,
    setCustomRequestSuccessData,
    loadCustomRequests,
    handleDashboardCustomRequestSubmit,
    referralCode,
    copyReferralLink,
    copiedReferral,
    markAllNotificationsRead,
    deleteNotification,
    supportQuery,
    setSupportQuery,
    supportSuccess,
    handleSupportSubmit,
    profileAvatar,
    setProfileAvatar,
    dashboardBg,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editMobile,
    setEditMobile,
    editDob,
    setEditDob,
    editAddress,
    setEditAddress,
    errors,
    setErrors,
    handleSaveProfile,
    handleAvatarChange,
    handleBgChange,
    handleResetBg,
    handlePresetBg,
  } = ctx;


  const myWinner = selectedWinners?.find((winner: any) => {
    const userEmail = String(user?.email || '').toLowerCase();
    const winnerEmail = String(winner?.email || '').toLowerCase();
    return (userEmail && winnerEmail === userEmail) || winner?.name === profileName || winner?.id === user?.uid;
  });

  return (
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
          {activeTab === 'uid' && (
            <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-black">My Beduine UID</p>
                <h2 className="text-3xl font-black text-slate-900 mt-2">{memberId || user?.uid || 'UID pending'}</h2>
                <p className="text-sm text-slate-500 mt-2">Ei UID diye membership, TRC, winner status, discount credits and bookings track hobe.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><span className="text-[10px] uppercase text-slate-400 font-bold">Name</span><strong className="block text-slate-800 mt-1">{profileName}</strong></div>
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><span className="text-[10px] uppercase text-slate-400 font-bold">Plan</span><strong className="block text-slate-800 mt-1">{planName || 'No active plan'}</strong></div>
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><span className="text-[10px] uppercase text-slate-400 font-bold">TRC</span><strong className="block text-slate-800 mt-1">{availableLuckyDrawCredits}</strong></div>
              </div>
            </div>
          )}
          {(activeTab === 'subscription' || activeTab === 'plan') && (
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
          {(activeTab === 'weekly-participation' || activeTab === 'trc' || activeTab === 'lucky-draw') && (
            <TravelRewardTab
              availableLuckyDrawCredits={availableLuckyDrawCredits}
              isWeeklyActivated={isWeeklyActivated}
              handleActivateWeeklyParticipation={handleActivateWeeklyParticipation}
              cycleState={cycleState}
            />
          )}
          {activeTab === 'winner-status' && (
            <div className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-black">Winner Status</p>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{myWinner ? 'Congratulations — Winner Selected' : 'No winner result yet'}</h2>
                <p className="text-sm text-slate-500 mt-2">Sunday Lucky Draw/TCR result publish hole ekhane status update hobe.</p>
              </div>
              {myWinner ? (
                <div className="rounded-3xl bg-amber-50 border border-amber-100 p-5">
                  <p className="text-xs uppercase tracking-widest font-black text-amber-700">Winner Details</p>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{myWinner.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">UID/Ticket: {myWinner.ticketId || myWinner.id}</p>
                  <p className="text-sm text-slate-600">Coupon: {myWinner.coupon || 'Pending'}</p>
                </div>
              ) : (
                <div className="rounded-3xl bg-slate-50 border border-slate-100 p-5 text-sm text-slate-600">
                  Participate with TRC. Winner hole details ekhane show korbe; non-winner hole eligible Discount Credit issue hobe.
                </div>
              )}
            </div>
          )}
          {(activeTab === 'credits' || activeTab === 'coupons' || activeTab === 'discount-credits') && (
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
  );
}
