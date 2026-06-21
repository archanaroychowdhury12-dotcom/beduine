import React, { useState } from 'react';
import { CustomTourRequest } from '../types';
import { CustomTourForm } from '../components/custom-tour/CustomTourForm';
import { CustomTourSuccess } from '../components/custom-tour/CustomTourSuccess';
import { customTourService } from '../services/customTourService';
import { Sparkles } from 'lucide-react';

interface CustomizeTourPageProps {
  currentUser?: any;
  onNavigateToDashboard?: () => void;
}

export const CustomizeTourPage: React.FC<CustomizeTourPageProps> = ({
  currentUser,
  onNavigateToDashboard
}) => {
  const [createdRequest, setCreatedRequest] = useState<CustomTourRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Map form data and append current user identifiers if logged in
      const requestData = {
        ...formData,
        userId: currentUser?.id || 'public-user',
        userName: currentUser?.fullName || 'Anonymous Visitor'
      };

      const request = await customTourService.createRequest(requestData);
      setCreatedRequest(request);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please check your network.');
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
