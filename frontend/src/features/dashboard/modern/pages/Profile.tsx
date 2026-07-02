import { useState, useEffect } from "react";
import { Mail, Phone, Edit3, Camera } from "lucide-react";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { user } from "../data/dummyData";

export function Profile() {
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, address: user.address });
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  useEffect(() => {
    const handleAvatarChange = () => {
      setAvatarUrl(user.avatar);
    };
    window.addEventListener("avatar-changed", handleAvatarChange);
    return () => window.removeEventListener("avatar-changed", handleAvatarChange);
  }, []);

  const handleAvatarClick = () => {
    document.getElementById("profile-avatar-input")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          localStorage.setItem("beduine_user_avatar", reader.result);
          window.dispatchEvent(new Event("avatar-changed"));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5">
      <DashboardCard>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick} title="Click to change profile picture">
              <img
                src={avatarUrl}
                alt={user.name}
                className="h-24 w-24 rounded-full border-4 border-secondary/20 object-cover shadow-md transition group-hover:brightness-90 md:h-28 md:w-28"
              />
              {/* Hover overlay with Camera Icon */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 z-20" />
              <input
                type="file"
                id="profile-avatar-input"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-text-secondary">Click photo to change</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-extrabold text-text-primary">{form.name}</h3>
            <p className="mt-1 flex items-center justify-center gap-2 text-[13px] text-text-secondary md:justify-start"><Mail className="h-4 w-4" /> {form.email}</p>
            <p className="mt-1 flex items-center justify-center gap-2 text-[13px] text-text-secondary md:justify-start"><Phone className="h-4 w-4" /> {form.phone}</p>
          </div>
          <Button className="w-full md:w-auto" onClick={() => setEditOpen(true)}><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
        </div>
      </DashboardCard>

      <DashboardCard title="Profile Information">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-3 pt-2">
          <InfoItem label="Full Name" value={form.name} />
          <InfoItem label="Date of Birth" value={user.dob} />
          <InfoItem label="Email" value={form.email} />
          <InfoItem label="Gender" value={user.gender} />
          <InfoItem label="Phone" value={form.phone} />
          <InfoItem label="Address" value={form.address} />
        </div>
      </DashboardCard>

      <Modal
        open={editOpen}
        title="Edit profile"
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => setEditOpen(false)}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name" value={form.name} onChange={(value) => setForm((f) => ({ ...f, name: value }))} />
          <Input label="Email" value={form.email} onChange={(value) => setForm((f) => ({ ...f, email: value }))} />
          <Input label="Phone" value={form.phone} onChange={(value) => setForm((f) => ({ ...f, phone: value }))} />
          <Input label="Address" value={form.address} onChange={(value) => setForm((f) => ({ ...f, address: value }))} />
          <p className="rounded-xl bg-secondary-light p-3 text-[12px] font-semibold text-secondary">Changes are saved in frontend state only. Backend API integration can persist this later.</p>
        </div>
      </Modal>
    </div>
  );
}

// Simple key-value display item
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border/40 pb-4">
      <span className="text-[12px] font-black uppercase tracking-wider text-text-secondary md:w-1/3">{label}</span>
      <span className="mt-1 text-sm font-extrabold text-text-primary md:mt-0 md:w-2/3">{value}</span>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[12px] font-extrabold uppercase tracking-wide text-text-secondary">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white p-3 text-sm font-bold text-text-primary focus:border-secondary focus:outline-none" />
    </label>
  );
}
