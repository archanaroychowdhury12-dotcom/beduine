import { useEffect, useMemo, useState } from 'react';
import { Traveler } from '../../../types';

const splitName = (fullName: string) => {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};

export function useTravelerManifest(currentUser?: any) {
  const [travelers, setTravelers] = useState<Traveler[]>([
    {
      firstName: 'Rahul',
      lastName: 'Sen',
      email: 'rahul.sen@example.com',
      phone: '+91 98765 43210',
      isLead: true,
      ageGroup: 'Adult',
    },
  ]);

  useEffect(() => {
    if (currentUser) {
      const { firstName, lastName } = splitName(currentUser.fullName);
      setTravelers(prev => {
        const lead = prev[0];
        const isDefault = lead && lead.firstName === 'Rahul' && lead.lastName === 'Sen' && lead.email === 'rahul.sen@example.com';
        const isEmpty = !lead || (!lead.firstName && !lead.lastName && !lead.email);

        if (isDefault || isEmpty) {
          const updated = [...prev];
          updated[0] = {
            firstName: firstName || lead?.firstName || '',
            lastName: lastName || lead?.lastName || '',
            email: currentUser.email || lead?.email || '',
            phone: currentUser.mobile || lead?.phone || '',
            isLead: true,
            ageGroup: 'Adult',
            dob: currentUser.dob || '',
            preferredLanguage: currentUser.preferredLanguage || 'English',
            dietaryPreferences: currentUser.dietaryPreferences || 'None',
            accessibilityRequirements: currentUser.accessibilityRequirements || 'None',
            gender: 'Male',
          };
          return updated;
        }
        return prev;
      });
    }
  }, [currentUser]);

  const profileHasChanges = useMemo(() => {
    if (!currentUser) return false;
    const lead = travelers[0];
    if (!lead) return false;

    const { firstName, lastName } = splitName(currentUser.fullName || '');

    return (
      lead.firstName !== firstName ||
      lead.lastName !== lastName ||
      lead.email !== currentUser.email ||
      lead.phone !== currentUser.mobile
    );
  }, [currentUser, travelers]);

  return { travelers, setTravelers, profileHasChanges };
}
