import React from 'react';
import { Edit2, Check } from 'lucide-react';

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
}: ProfileTabProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [gender, setGender] = React.useState('Male');

  const handleSave = () => {
    handleSaveProfile();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 7. PROFILE Panel */}
      <div className="bg-white border border-slate-100 shadow-[0_8px_30px_rgba(16,35,63,0.02)] rounded-[24px] p-5 sm:p-6">
        <div className="pb-4 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-805 uppercase tracking-wide">Profile</h2>
            <p className="text-xs text-slate-400">View and update your personal details and travel profile settings</p>
          </div>
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Save Profile
              </>
            ) : (
              <>
                <Edit2 className="w-3 h-3 text-slate-400" /> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Card Main Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-center mt-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shrink-0">
            {profileAvatar ? (
              <img src={profileAvatar} alt="Arindam Pal" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 text-white font-black text-2xl flex items-center justify-center uppercase">
                {profileName?.charAt(0) || 'A'}
              </div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-lg font-bold text-slate-800">{profileName || 'Arindam Pal'}</h3>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[9px] font-bold">Explorer</span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{editMobile || '+91 98765 43210'}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 pt-2 border-t border-slate-50">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Profile Information</h4>

          {isEditing ? (
            <div className="space-y-4">
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
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs text-slate-700 bg-white transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.name ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
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
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs text-slate-700 bg-white transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.email ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editMobile}
                    onChange={(e) => {
                      setEditMobile(e.target.value);
                      if (errors.mobile) setErrors(prev => ({ ...prev, mobile: undefined }));
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs text-slate-700 bg-white transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      errors.mobile ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date of Birth</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Aug 1990"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Gender</label>
                  <input
                    type="text"
                    placeholder="e.g. Male"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-700 bg-white resize-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs text-left">
              <div className="flex border-b border-slate-50 pb-2">
                <span className="w-32 text-slate-400 font-bold uppercase tracking-wider">Full Name</span>
                <span className="font-bold text-slate-800">{profileName || 'Arindam Pal'}</span>
              </div>
              <div className="flex border-b border-slate-50 pb-2">
                <span className="w-32 text-slate-400 font-bold uppercase tracking-wider">Date of Birth</span>
                <span className="font-bold text-slate-700">{editDob || '10 Aug 1990'}</span>
              </div>
              <div className="flex border-b border-slate-50 pb-2">
                <span className="w-32 text-slate-400 font-bold uppercase tracking-wider">Email</span>
                <span className="font-bold text-slate-700">{editEmail || 'arindam.pal@gmail.com'}</span>
              </div>
              <div className="flex border-b border-slate-50 pb-2">
                <span className="w-32 text-slate-400 font-bold uppercase tracking-wider">Gender</span>
                <span className="font-bold text-slate-700">{gender || 'Male'}</span>
              </div>
              <div className="flex border-b border-slate-50 pb-2">
                <span className="w-32 text-slate-400 font-bold uppercase tracking-wider">Phone</span>
                <span className="font-bold text-slate-700 font-mono">{editMobile || '+91 98765 43210'}</span>
              </div>
              <div className="flex border-b border-slate-50 pb-2">
                <span className="w-32 text-slate-400 font-bold uppercase tracking-wider">Address</span>
                <span className="font-bold text-slate-700">{editAddress || 'Kolkata, West Bengal, India'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
