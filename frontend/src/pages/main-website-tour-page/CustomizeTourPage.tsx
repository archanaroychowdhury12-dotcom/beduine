import React, { useEffect, useRef, useState } from 'react';
import type { AppUser, CustomTourRequest } from '../../types';
import { CustomTourForm } from './custom-tour/CustomTourForm';
import { CustomTourSuccess } from './custom-tour/CustomTourSuccess';
import {
  customTourService,
  type CustomTourCreateInput,
} from '../../services/customTourService';
import { Sparkles } from 'lucide-react';
import { notify } from '@/services/uiFeedback';
import { buildLoginRedirect } from '@/utils/appRoutes';

const PENDING_CUSTOM_TOUR_KEY = 'beduine_pending_custom_tour';

type PendingCustomTourDraft = Omit<CustomTourCreateInput, 'phone' | 'email'>;

export function savePendingCustomTourDraft(
  input: CustomTourCreateInput & { userId?: string; userName?: string },
): void {
  const {
    phone: _phone,
    email: _email,
    userId: _userId,
    userName: _userName,
    ...preferences
  } = input;
  sessionStorage.setItem(PENDING_CUSTOM_TOUR_KEY, JSON.stringify(preferences));
}

export function consumePendingCustomTourDraft(contact: {
  phone: string;
  email: string;
}): CustomTourCreateInput | null {
  const serialized = sessionStorage.getItem(PENDING_CUSTOM_TOUR_KEY);
  if (!serialized) return null;
  sessionStorage.removeItem(PENDING_CUSTOM_TOUR_KEY);

  try {
    const parsed = JSON.parse(serialized);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return {
      ...(parsed as PendingCustomTourDraft),
      phone: contact.phone,
      email: contact.email,
    };
  } catch {
    return null;
  }
}

interface CustomizeTourPageProps {
  currentUser?: AppUser | null;
  onNavigateToDashboard?: () => void;
}

export const CustomizeTourPage: React.FC<CustomizeTourPageProps> = ({
  currentUser,
  onNavigateToDashboard
}) => {
  const [createdRequest, setCreatedRequest] = useState<CustomTourRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const restoredDraft = useRef(false);

  useEffect(() => {
    if (!currentUser || restoredDraft.current) return;
    restoredDraft.current = true;
    const draft = consumePendingCustomTourDraft({
      phone: currentUser.mobile,
      email: currentUser.email,
    });
    if (!draft) return;

    setIsSubmitting(true);
    void customTourService
      .createRequest({
        ...draft,
        userId: currentUser.id,
        userName: currentUser.fullName,
      })
      .then((request) => {
        setCreatedRequest(request);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((error: unknown) => {
        savePendingCustomTourDraft(draft);
        notify.info(error instanceof Error ? error.message : 'Submission failed. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  }, [currentUser]);

  const handleFormSubmit = async (formData: CustomTourCreateInput) => {
    if (!currentUser) {
      savePendingCustomTourDraft(formData);
      window.location.href = buildLoginRedirect('/paid-tour#customize');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        ...formData,
        phone: currentUser.mobile,
        email: currentUser.email,
        userId: currentUser.id,
        userName: currentUser.fullName,
      };

      const request = await customTourService.createRequest(requestData);
      setCreatedRequest(request);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      notify.info(err.message || 'Submission failed. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedRequest(null);
  };

  return (
    <div className="pt-24 lg:pt-32 pb-16 min-h-screen bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro Header */}
        {!createdRequest && (
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Tailor-made Journeys
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">
              Customize Your Tour Package
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tell us your destination, dates, hotel preference, and activities. We will estimate a price range live, and our team will curate a detailed custom quotation for you.
            </p>
          </div>
        )}

        {/* Dynamic Display */}
        {createdRequest ? (
          <CustomTourSuccess
            request={createdRequest}
            onReset={handleReset}
            onGoToDashboard={onNavigateToDashboard}
            isLoggedIn={!!currentUser}
          />
        ) : (
          <CustomTourForm
            currentUser={currentUser}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        )}

      </div>
    </div>
  );
};
