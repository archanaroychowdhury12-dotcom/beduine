import React from 'react';
import { User } from 'lucide-react';

export interface ProfileTabProps {
  profileName: string;
  profileAvatar: string | null;
  setProfileAvatar: (avatar: string | null) => void;
  dashboardBg: string;
  editName: string;
  setEditName: (name: string) => void;
  editEmail: string;
  setEditEmail: (email: string) => void;
  editMobile: string;
  setEditMobile: (mobile: string) => void;
  editDob: string;
  setEditDob: (dob: string) => void;
  editCity: string;
  setEditCity: (city: string) => void;
  editAddress: string;
  setEditAddress: (address: string) => void;
  errors: { name?: string; email?: string; mobile?: string };
  setErrors: React.Dispatch<React.SetStateAction<{ name?: string; email?: string; mobile?: string }>>;
  handleSaveProfile: () => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetBg: () => void;
  handlePresetBg: (preset: string) => void;
}

export function ProfileTab({
  profileName,
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
  editCity,
  setEditCity,
  editAddress,
  setEditAddress,
  errors,
  setErrors,
  handleSaveProfile,
  handleAvatarChange,
  handleBgChange,
  handleResetBg,
  handlePresetBg
}: ProfileTabProps) {
  return (
    <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.03)] rounded-[28px] p-5 sm:p-7 text-left space-y-6">
      <h2 className="text-base font-black flex items-center gap-2 mb-1 text-slate-805 uppercase tracking-wide font-sans">
        <User className="w-5 h-5 text-[#FF6B6B]" /> My Account &amp; Profile Settings
      </h2>
      <p className="text-xs text-slate-400">Manage account details, profile picture, and dashboard background styling</p>

      <div className="flex flex-col md:flex-row gap-6 items-start w-full font-sans">
        {/* Avatar upload */}
        <div className="bg-white border border-slate-150 p-4.5 rounded-2xl flex flex-col items-center gap-3 shrink-0 shadow-sm w-full md:w-[170px] text-center">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Profile Pic</span>
          <div className="relative group">
            <div className="w-20 h-20 rounded-full p-[3px] shadow-md bg-gradient-to-tr from-[#FF6B6B] to-[#00D4F5] flex items-center justify-center">
              {profileAvatar ? (
                <img src={profileAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center text-2xl font-black text-white bg-slate-800 uppercase">
                  {profileName?.charAt(0) || 'R'}
                </div>
              )}
            </div>
            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-[10px] text-white font-bold text-center px-1">Upload</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <button onClick={() => setProfileAvatar(null)} className="text-[9px] text-red-500 font-bold hover:underline cursor-pointer border-none bg-transparent">Remove Picture</button>
        </div>

        {/* Background image picker customizable */}
        <div className="bg-white border border-slate-150 p-4.5 rounded-2xl flex flex-col items-center gap-3 shrink-0 shadow-sm w-full md:w-[220px] text-center">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Dashboard Background</span>
          
          {/* Background preview */}
          <div className="relative group w-40 h-20 rounded-xl overflow-hidden border">
            <img src={dashboardBg} alt="Background Preview" className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-[10px] text-white font-bold px-1">Upload Custom</span>
              <input type="file" accept="image/*" onChange={handleBgChange} className="hidden" />
            </label>
          </div>

          {/* Presets */}
          <div className="flex gap-1.5 mt-1">
            {[
              { name: 'Mountain', url: '/images/chatgpt_dashboard_bg.png' },
              { name: 'Beach', url: '/images/lucky_draw_winners_bg.png' }
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetBg(preset.url)}
                className="px-2.5 py-1 rounded bg-slate-50 border border-slate-155 text-[8.5px] font-bold hover:bg-slate-100 cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
            <button onClick={handleResetBg} className="px-2.5 py-1 rounded bg-red-50 border border-red-100 text-[8.5px] font-bold text-red-500 hover:bg-red-100 cursor-pointer">Reset</button>
          </div>
        </div>

        {/* Details input form */}
        <div className="flex-1 space-y-4 w-full">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] ${
                  errors.name ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {errors.name && <span className="text-[9px] text-red-500 mt-1 block">{errors.name}</span>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] ${
                  errors.email ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {errors.email && <span className="text-[9px] text-red-500 mt-1 block">{errors.email}</span>}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile Number</label>
              <input
                type="tel"
                value={editMobile}
                onChange={(e) => {
                  setEditMobile(e.target.value);
                  if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B] ${
                  errors.mobile ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {errors.mobile && <span className="text-[9px] text-red-500 mt-1 block">{errors.mobile}</span>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
              <input
                type="date"
                value={editDob}
                onChange={(e) => setEditDob(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City / Region</label>
              <input
                type="text"
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Residential Address</label>
            <textarea
              rows={2}
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none transition-all focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]"
            />
          </div>

          <button onClick={handleSaveProfile} className="px-6 py-3 rounded-xl text-xs font-bold cursor-pointer text-white bg-slate-800 hover:bg-slate-900 border-none shadow-sm transition-colors">
            Save Profile Details
          </button>
        </div>
      </div>
    </div>
  );
}
