import { BadgeCheck, Copy, IdCard, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { DashboardCard } from "../components/DashboardCard";
import { StatCard } from "../components/StatCard";
import { Button } from "../components/Button";
import { user, activeSubscription, dashboardStats } from "../data/dummyData";

export function MyUID() {
  const [copied, setCopied] = useState(false);

  const copyUid = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Customer UID" value={user.uid} icon={IdCard} iconBg="bg-secondary-light" iconColor="text-secondary" delay={0} />
        <StatCard title="Active Plan" value={activeSubscription.planName} icon={ShieldCheck} iconBg="bg-orange-50" iconColor="text-primary" delay={100} />
        <StatCard title="Discount Credits" value={dashboardStats.discountCredits} icon={BadgeCheck} iconBg="bg-green-50" iconColor="text-success" delay={200} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <DashboardCard className="lg:col-span-2" delay={250}>
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-3xl object-cover ring-4 ring-secondary-light" />
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-text-secondary">BEDUINE Member ID</p>
                <h3 className="mt-1 text-2xl font-black text-text-primary">{user.uid}</h3>
                <p className="mt-1 text-sm font-semibold text-text-secondary">{user.name} • Verified Customer</p>
              </div>
            </div>
            <Button onClick={copyUid} className="w-fit">
              <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy UID"}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-[12px] font-bold text-text-secondary">Email</p>
              <p className="mt-1 text-sm font-extrabold text-text-primary">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <p className="text-[12px] font-bold text-text-secondary">Phone</p>
              <p className="mt-1 text-sm font-extrabold text-text-primary">{user.phone}</p>
            </div>
            <div className="rounded-2xl border border-border bg-slate-50 p-4 sm:col-span-2">
              <p className="text-[12px] font-bold text-text-secondary">Address</p>
              <p className="mt-1 text-sm font-extrabold text-text-primary">{user.address}</p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard delay={350}>
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-secondary-light text-secondary">
              <UserRound className="h-12 w-12" />
            </div>
            <h4 className="mt-4 text-lg font-black text-text-primary">UID Status</h4>
            <p className="mt-1 rounded-full bg-success-bg px-3 py-1 text-[12px] font-extrabold text-success">Active & Verified</p>
            <p className="mt-4 text-sm font-medium leading-6 text-text-secondary">
              Use this UID for support tickets, travel reward credits, plan benefits, and booking verification.
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
