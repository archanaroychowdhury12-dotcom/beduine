import {
  BadgePercent,
  CalendarDays,
  CreditCard,
  Gift,
  Headphones,
  IdCard,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Trophy,
  TicketCheck,
  User,
} from "lucide-react";

export type DashboardRoute =
  | "overview"
  | "my-uid"
  | "my-plan"
  | "trc-credits"
  | "lucky-draw"
  | "winner-status"
  | "discount-credits"
  | "my-bookings"
  | "payments"
  | "profile"
  | "support"
  | "settings";

export const dashboardPages: { id: DashboardRoute; title: string }[] = [
  { id: "overview", title: "Dashboard Overview" },
  { id: "my-uid", title: "My UID" },
  { id: "my-plan", title: "My Plan" },
  { id: "trc-credits", title: "TRC / Travel Reward Credits" },
  { id: "lucky-draw", title: "Lucky Draw Participation" },
  { id: "winner-status", title: "Winner Status" },
  { id: "discount-credits", title: "Discount Credits" },
  { id: "my-bookings", title: "My Bookings" },
  { id: "payments", title: "My Payments" },
  { id: "profile", title: "Profile" },
  { id: "support", title: "Support Tickets" },
  { id: "settings", title: "Settings" },
];

export const dashboardMenu = [
  { label: "Overview", id: "overview" as const, icon: LayoutDashboard },
  { label: "My UID", id: "my-uid" as const, icon: IdCard },
  { label: "My Plan", id: "my-plan" as const, icon: ShieldCheck },
  { label: "TRC / Travel Reward Credits", id: "trc-credits" as const, icon: Gift },
  { label: "Lucky Draw", id: "lucky-draw" as const, icon: TicketCheck },
  { label: "Winner Status", id: "winner-status" as const, icon: Trophy },
  { label: "Discount Credits", id: "discount-credits" as const, icon: BadgePercent },
  { label: "My Bookings", id: "my-bookings" as const, icon: CalendarDays },
  { label: "My Payments", id: "payments" as const, icon: CreditCard },
  { label: "Profile", id: "profile" as const, icon: User },
  { label: "Support", id: "support" as const, icon: Headphones },
  { label: "Settings", id: "settings" as const, icon: Settings },
];
