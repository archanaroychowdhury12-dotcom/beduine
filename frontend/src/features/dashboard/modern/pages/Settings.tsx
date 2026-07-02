import { useState } from "react";
import { KeyRound, Bell, Shield, Globe, ChevronRight } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";

export function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [language, setLanguage] = useState("English");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <DashboardCard>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-extrabold text-text-primary">Change Password</h4>
            <p className="mt-1 text-[12px] text-text-secondary">Update your account password</p>
            <Button size="sm" className="mt-3 w-fit" onClick={() => setPasswordOpen(true)}>Update</Button>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary">
            <Bell className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-extrabold text-text-primary">Notification Settings</h4>
            <p className="mt-1 text-[12px] text-text-secondary">Manage your notifications</p>
            <div className="mt-3 space-y-3">
              <ToggleRow label="Email Notifications" checked={emailNotif} onChange={setEmailNotif} />
              <ToggleRow label="SMS Notifications" checked={smsNotif} onChange={setSmsNotif} />
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary">
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-extrabold text-text-primary">Privacy Settings</h4>
            <p className="mt-1 text-[12px] text-text-secondary">Manage your privacy</p>
            <div className="mt-3 space-y-3">
              <ToggleRow label="Make Profile Private" checked={profilePrivate} onChange={setProfilePrivate} />
              <button onClick={() => setAppsOpen(true)} className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left transition hover:bg-slate-50">
                <span className="text-[13px] font-semibold text-text-secondary">Manage connected apps</span>
                <ChevronRight className="h-4 w-4 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-light text-secondary">
            <Globe className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="text-[15px] font-extrabold text-text-primary">Language</h4>
            <p className="mt-1 text-[12px] text-text-secondary">Select your language</p>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-3 w-full rounded-xl border border-border bg-white p-2.5 text-[13px] font-bold text-text-secondary focus:border-secondary focus:outline-none">
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
            </select>
          </div>
        </div>
      </DashboardCard>

      <Modal open={passwordOpen} title="Change password" onClose={() => setPasswordOpen(false)} footer={<><Button variant="outline" onClick={() => setPasswordOpen(false)}>Cancel</Button><Button onClick={() => setPasswordOpen(false)}>Update</Button></>}>
        <div className="space-y-4">
          {["Current Password", "New Password", "Confirm New Password"].map((label) => (
            <label key={label} className="block">
              <span className="text-[12px] font-extrabold uppercase tracking-wide text-text-secondary">{label}</span>
              <input type="password" className="mt-2 w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-text-primary focus:border-secondary focus:outline-none" />
            </label>
          ))}
          <p className="rounded-xl bg-secondary-light p-3 text-[12px] font-semibold text-secondary">Frontend-only form. Backend password update API can be connected later.</p>
        </div>
      </Modal>

      <Modal open={appsOpen} title="Connected apps" onClose={() => setAppsOpen(false)} footer={<Button onClick={() => setAppsOpen(false)}>Done</Button>}>
        <p className="rounded-xl bg-slate-50 p-4 text-sm">No connected apps in this demo. This section is ready for future backend integration.</p>
      </Modal>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-semibold text-text-secondary">{label}</span>
      <button onClick={() => onChange(!checked)} className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-secondary" : "bg-slate-300"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}
