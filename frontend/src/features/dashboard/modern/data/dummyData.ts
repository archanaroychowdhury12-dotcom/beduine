export const user = {
  name: "Arindam Pal",
  get avatar() {
    return localStorage.getItem("beduine_user_avatar") || "/images/avatar.jpg";
  },
  uid: "BED12345678",
  email: "arindampal009@gmail.com",
  phone: "+91 98765 43210",
  dob: "12 Aug 1990",
  gender: "Male",
  address: "Kolkata, West Bengal, India",
};

export const dashboardStats = {
  totalBookings: 12,
  upcomingTrips: 3,
  totalSpent: "₹1,56,800",
  discountCredits: "₹7,500",
};

export const upcomingBooking = {
  tourName: "Kashmir Paradise",
  image: "/images/kashmir.jpg",
  dates: "05 Jun - 12 Jun 2025",
  route: "Srinagar - Gulmarg - Pahalgam",
  bookingId: "BK-2025-1557",
};

export const recentActivity = [
  { id: 1, text: "Payment of ₹42,000 successful", date: "10 May 2025", type: "payment" },
  { id: 2, text: "Booking confirmed for Kashmir Paradise", date: "09 May 2025", type: "booking" },
  { id: 3, text: "Subscription plan activated", date: "08 May 2025", type: "subscription" },
  { id: 4, text: "Credit of ₹500 added", date: "07 May 2025", type: "credit" },
];

function buildNextSundayDraw() {
  const draw = new Date();
  const daysUntilSunday = (7 - draw.getDay()) % 7;
  draw.setDate(draw.getDate() + daysUntilSunday);
  draw.setHours(19, 0, 0, 0);

  if (draw.getTime() <= Date.now()) {
    draw.setDate(draw.getDate() + 7);
  }

  return draw;
}

function formatDrawDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date).replace(",", "");
}

const nextDrawDate = buildNextSundayDraw();

export const luckyDraw = {
  nextDraw: formatDrawDate(nextDrawDate),
  targetDate: nextDrawDate.toISOString(),
  trophyImage: "/images/trophy.webp",
};

export const bookings = [
  { id: "BK-2025-1557", tour: "Kashmir Paradise", travelDate: "05 Jun 2025", amount: "₹42,000", status: "Upcoming" },
  { id: "BK-2025-1556", tour: "Goa Beach Holiday", travelDate: "15 May 2025", amount: "₹18,000", status: "Completed" },
  { id: "BK-2025-1555", tour: "Kerala Backwaters", travelDate: "22 May 2025", amount: "₹23,600", status: "Upcoming" },
  { id: "BK-2025-1554", tour: "Dubai Weekend Tour", travelDate: "30 May 2025", amount: "₹23,900", status: "Upcoming" },
  { id: "BK-2025-1553", tour: "Darjeeling Group Tour", travelDate: "28 Apr 2025", amount: "₹18,500", status: "Completed" },
  { id: "BK-2025-1548", tour: "Andaman Explorer", travelDate: "10 Apr 2025", amount: "₹38,000", status: "Cancelled" },
];

export const payments = [
  { id: "PAY-2025-0012", bookingId: "BK-2025-1557", amount: "₹42,000", date: "10 May 2025", status: "Success" },
  { id: "PAY-2025-0011", bookingId: "BK-2025-1555", amount: "₹18,000", date: "09 May 2025", status: "Success" },
  { id: "PAY-2025-0010", bookingId: "BK-2025-1556", amount: "₹23,600", date: "25 Apr 2025", status: "Success" },
  { id: "PAY-2025-0009", bookingId: "BK-2025-1554", amount: "₹7,900", date: "25 Apr 2025", status: "Pending" },
  { id: "PAY-2025-0008", bookingId: "BK-2025-1553", amount: "₹18,500", date: "18 Apr 2025", status: "Success" },
];

export const paymentSummary = {
  totalPaid: "₹1,56,800",
  pendingAmount: "₹18,500",
  refundedAmount: "₹5,000",
};

export const activeSubscription = {
  planName: "International Plan",
  price: "₹5,000 / year",
  startDate: "01 May 2025",
  endDate: "30 Apr 2026",
  status: "Active",
};

export const subscriptionHistory = [
  { planName: "International Plan", startDate: "01 May 2025", endDate: "30 Apr 2026", amount: "₹5,000", status: "Active" },
];

export const trcData = {
  totalEntries: 24,
  nextDraw: luckyDraw.nextDraw,
  targetDate: luckyDraw.targetDate,
};

export const drawResults = [
  { drawDate: "11 May 2025", prize: "Second Prize", winner: "Amit Mondal (BED-1002-06089)", amount: "₹5,000" },
  { drawDate: "04 May 2025", prize: "First Prize", winner: "Sneha Roy (BED-2024-99432)", amount: "₹25,000" },
  { drawDate: "27 Apr 2025", prize: "Third Prize", winner: "Rahul Das (BED-2024-99101)", amount: "₹2,000" },
];

export const winnerStatus = [
  { drawDate: "11 May 2025", prize: "Second Prize", status: "Won", amount: "₹5,000" },
  { drawDate: "04 May 2025", prize: "First Prize", status: "Not Won", amount: "₹25,000" },
  { drawDate: "27 Apr 2025", prize: "Third Prize", status: "Not Won", amount: "₹2,000" },
  { drawDate: "20 Apr 2025", prize: "Second Prize", status: "Won", amount: "₹5,000" },
];

export const creditSummary = {
  available: "₹7,500",
  totalEarned: "₹12,500",
};

export const creditHistory = [
  { date: "10 May 2025", description: "Non-winner Credit", type: "Credit", amount: "+ ₹500", balance: "₹7,500" },
  { date: "05 May 2025", description: "Lucky Draw Credit", type: "Credit", amount: "+ ₹500", balance: "₹7,000" },
  { date: "28 Apr 2025", description: "Credit Used", type: "Debit", amount: "- ₹2,000", balance: "₹6,500" },
  { date: "15 Apr 2025", description: "Referral Bonus", type: "Credit", amount: "+ ₹1,000", balance: "₹8,500" },
];

export const supportTickets = [
  { id: "SUP-2025-0012", subject: "Payment not reflected", status: "Open", updatedOn: "10 May 2025" },
  { id: "SUP-2025-0011", subject: "Booking confirmation", status: "In Progress", updatedOn: "09 May 2025" },
  { id: "SUP-2025-0010", subject: "Lucky draw query", status: "Closed", updatedOn: "08 May 2025" },
];
