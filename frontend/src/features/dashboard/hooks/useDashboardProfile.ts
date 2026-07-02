import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AppUser } from '@/types';
import { notify } from '@/services/uiFeedback';

export type DashboardProfileErrors = {
  name?: string;
  email?: string;
  mobile?: string;
};

type DashboardProfileUser = Partial<AppUser> & {
  avatar?: string | null;
  address?: string;
};

export function useDashboardProfile(user?: DashboardProfileUser | null) {
  const [profileName, setProfileName] = useState(user?.fullName || 'Rahul Sen');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'rahul.sen@example.com');
  const [profileMobile, setProfileMobile] = useState(user?.mobile || '9876543210');
  const [profileAvatar, setProfileAvatar] = useState<string | null>(user?.avatar || null);
  const [profileAddress, setProfileAddress] = useState(user?.address || '12, Feeder Road, Fulia, Nadia');
  const [profileCity, setProfileCity] = useState(user?.city || 'Nadia');
  const [profileDob, setProfileDob] = useState(user?.dob || '1995-08-15');

  const [editName, setEditName] = useState(profileName);
  const [editEmail, setEditEmail] = useState(profileEmail);
  const [editMobile, setEditMobile] = useState(profileMobile);
  const [editAddress, setEditAddress] = useState(profileAddress);
  const [editCity, setEditCity] = useState(profileCity);
  const [editDob, setEditDob] = useState(profileDob);
  const [errors, setErrors] = useState<DashboardProfileErrors>({});

  useEffect(() => {
    setProfileName(user?.fullName || 'Rahul Sen');
    setProfileEmail(user?.email || 'rahul.sen@example.com');
    setProfileMobile(user?.mobile || '9876543210');
    setProfileAvatar(user?.avatar || null);
    setProfileAddress(user?.address || '12, Feeder Road, Fulia, Nadia');
    setProfileCity(user?.city || 'Nadia');
    setProfileDob(user?.dob || '1995-08-15');
  }, [user]);

  useEffect(() => {
    setEditName(profileName);
    setEditEmail(profileEmail);
    setEditMobile(profileMobile);
    setEditAddress(profileAddress);
    setEditCity(profileCity);
    setEditDob(profileDob);
  }, [profileName, profileEmail, profileMobile, profileAddress, profileCity, profileDob]);

  const validateForm = () => {
    const newErrors: DashboardProfileErrors = {};
    if (!editName.trim()) newErrors.name = 'Full name is required';
    else if (editName.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editEmail.trim()) newErrors.email = 'Email address is required';
    else if (!emailRegex.test(editEmail.trim())) newErrors.email = 'Please enter a valid email';

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!editMobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!mobileRegex.test(editMobile.trim())) newErrors.mobile = 'Enter a valid 10-digit mobile';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateForm()) return;
    setProfileName(editName);
    setProfileEmail(editEmail);
    setProfileMobile(editMobile);
    setProfileAddress(editAddress);
    setProfileCity(editCity);
    setProfileDob(editDob);
    notify.info('Profile details updated successfully.');
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notify.info('Image size should be less than 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfileAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  return {
    profileName,
    profileEmail,
    profileMobile,
    profileAvatar,
    profileAddress,
    profileCity,
    profileDob,
    setProfileName,
    setProfileEmail,
    setProfileMobile,
    setProfileAvatar,
    setProfileAddress,
    setProfileCity,
    setProfileDob,
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
  };
}
