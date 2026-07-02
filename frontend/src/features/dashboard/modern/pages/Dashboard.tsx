import { useState, useEffect } from "react";
import {
  CalendarDays,
  CreditCard,
  Banknote,
  Wallet,
  MapPin,
  CheckCircle,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { cn } from "../utils/cn";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { luckyDraw, user, dashboardStats, upcomingBooking, recentActivity } from "../data/dummyData";

const activityIcons: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  payment: { icon: CreditCard, bg: "bg-emerald-50", color: "text-emerald-600" },
  booking: { icon: CheckCircle, bg: "bg-blue-50", color: "text-secondary" },
  subscription: { icon: Ticket, bg: "bg-orange-50", color: "text-primary" },
  credit: { icon: TrendingUp, bg: "bg-blue-50", color: "text-secondary" },
};

export function Dashboard() {
  const [tripModalOpen, setTripModalOpen] = useState(false);
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  useEffect(() => {
    const handleAvatarChange = () => {
      setAvatarUrl(user.avatar);
    };
    window.addEventListener("avatar-changed", handleAvatarChange);
    return () => window.removeEventListener("avatar-changed", handleAvatarChange);
  }, []);

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-r from-[#D5E6FA] to-[#E9F0FA] shadow-[0_24px_70px_rgba(11,27,58,0.08)]">
        <div className="relative min-h-[190px] overflow-hidden p-5 text-text-primary md:p-7">
          {/* Note: Light mountain scene SVG design removed per user request */}
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {/* Clean soft shadow and white border frame for avatar */}
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="relative z-10 h-16 w-16 rounded-full border-4 border-white object-cover shadow-lg shadow-blue-950/15 transition-transform duration-300 hover:scale-105 md:h-20 md:w-20"
                />
              </div>
              <div>
                <p className="text-[13px] font-bold text-text-secondary">Welcome back,</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h3 className="text-3xl font-black tracking-[-0.05em] text-text-primary md:text-4xl">{user.name}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary-light px-3 py-1 text-[11px] font-black text-secondary ring-1 ring-secondary/25">
                    Explorer
                  </span>
                </div>
                <p className="mt-1 text-[13px] font-black text-text-secondary">UID: {user.uid}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-5 xl:grid-cols-4">
          <StatCard title="Total Bookings" value={dashboardStats.totalBookings} icon={CalendarDays} iconBg="bg-blue-50" iconColor="text-secondary" footer="View bookings" delay={50} />
          <StatCard title="Upcoming Trips" value={dashboardStats.upcomingTrips} icon={Ticket} iconBg="bg-orange-50" iconColor="text-primary" footer="View upcoming" delay={100} />
          <StatCard title="Total Spent" value={dashboardStats.totalSpent} icon={Banknote} iconBg="bg-amber-50" iconColor="text-amber-600" footer="View details" delay={150} />
          <StatCard title="Discount Credits" value={dashboardStats.discountCredits} icon={Wallet} iconBg="bg-emerald-50" iconColor="text-emerald-600" footer="View credits" delay={200} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Next Trip" className="relative overflow-hidden p-0 lg:col-span-1 xl:col-span-2" delay={250}>
          <div className="relative flex min-h-[285px] flex-col justify-end overflow-hidden p-5 md:p-6">
            <img src={upcomingBooking.image} alt={upcomingBooking.tourName} className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06224B]/95 via-[#0757C9]/36 to-transparent" />
            <div className="relative max-w-xl space-y-2 text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-black text-white shadow-lg shadow-orange-900/25">
                <MapPin className="h-3 w-3" /> Upcoming
              </span>
              <h4 className="text-3xl font-black tracking-[-0.04em] md:text-4xl">{upcomingBooking.tourName}</h4>
              <p className="text-sm font-black opacity-95">{upcomingBooking.dates}</p>
              <p className="text-sm font-semibold opacity-88">{upcomingBooking.route}</p>
              <p className="text-[11px] font-semibold opacity-78">Booking ID: {upcomingBooking.bookingId}</p>
              <Button size="sm" className="mt-2" onClick={() => setTripModalOpen(true)}>View Details</Button>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Recent Activity" delay={350} headerAction={<button className="text-[12px] font-black text-secondary hover:text-secondary-dark">View all activity</button>}>
          <ul className="space-y-4">
            {recentActivity.map((item, idx) => {
              const { icon: Icon, bg, color } = activityIcons[item.type];
              return (
                <li key={item.id} className="flex items-start gap-3 rounded-2xl p-2 transition-all duration-200 hover:bg-secondary-light/35" style={{ animationDelay: `${600 + idx * 100}ms` }}>
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-transform duration-200 hover:scale-110", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-black text-text-primary">{item.text}</p>
                    <p className="text-[11px] font-bold text-text-secondary">{item.date}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </DashboardCard>
      </div>

      <DashboardCard className="relative overflow-hidden border-0 bg-gradient-to-r from-[#0757C9] via-[#006DF5] to-[#0B7CFF] p-0 text-white" delay={450}>
        <div className="pointer-events-none absolute inset-0 opacity-25">
          <svg className="h-full w-full" viewBox="0 0 900 190" preserveAspectRatio="none">
            <path d="M60 120 Q 230 30 394 105 T 790 70" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
            {[...Array(28)].map((_, i) => <text key={i} x={`${8 + (i * 3.3)}%`} y={`${24 + (i % 4) * 18}%`} fill="white" fontSize={i % 2 === 0 ? "14" : "10"}>✦</text>)}
          </svg>
        </div>

        <div className="relative flex flex-col items-center justify-between gap-6 p-6 md:flex-row md:p-8">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-[12px] font-black uppercase tracking-[0.22em] text-gold">Reward Zone</p>
            <h3 className="text-2xl font-black tracking-[-0.04em] md:text-3xl">Sunday Travel Reward</h3>
            <p className="text-sm font-bold text-white/80">Next Selection: {luckyDraw.nextDraw}</p>
            <Button size="sm" className="mt-1 animate-pulse-ring" onClick={() => setDrawModalOpen(true)}>View Details</Button>
          </div>



          <div className="hidden md:block">
            <img src={luckyDraw.trophyImage} alt="Trophy" className="h-32 w-32 animate-float object-contain mix-blend-screen drop-shadow-[0_0_20px_rgba(255,209,102,0.35)] md:h-36 md:w-36" />
          </div>
        </div>
      </DashboardCard>

      <Modal open={tripModalOpen} title="Next trip details" onClose={() => setTripModalOpen(false)} footer={<Button onClick={() => setTripModalOpen(false)}>Done</Button>}>
        <div className="space-y-3">
          <img src={upcomingBooking.image} alt={upcomingBooking.tourName} className="h-44 w-full rounded-3xl object-cover" />
          <h3 className="text-xl font-black text-text-primary">{upcomingBooking.tourName}</h3>
          <p><strong>Dates:</strong> {upcomingBooking.dates}</p>
          <p><strong>Route:</strong> {upcomingBooking.route}</p>
          <p><strong>Booking ID:</strong> {upcomingBooking.bookingId}</p>
          <p className="rounded-2xl bg-secondary-light p-3 text-secondary">Backend integration later can load full itinerary, hotel, invoice, and traveller details here.</p>
        </div>
      </Modal>

      <Modal open={drawModalOpen} title="Sunday Travel Reward" onClose={() => setDrawModalOpen(false)} footer={<Button onClick={() => setDrawModalOpen(false)}>Done</Button>}>
        <div className="space-y-3">
          <p><strong>Next Selection:</strong> {luckyDraw.nextDraw}</p>
          <p><strong>Entry Source:</strong> TRC / Travel Reward credits</p>
          <p><strong>Status:</strong> Entries will be checked from dummy frontend data until backend APIs are connected.</p>
        </div>
      </Modal>
    </div>
  );
}
