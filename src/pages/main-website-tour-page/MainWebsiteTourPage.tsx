import { useEffect, useState } from 'react';
import { AboutPage } from './AboutPage';
import { TourBookingForm } from './TourBookingForm';
import { Footer as TourFooter } from '../../components/Footer';
import { HomeView } from './HomeView';
import { Navbar as TourNavbar } from '../../components/Navbar';
import { TourPackageSelection } from './TourPackageSelection';
import { CustomizeTourPage } from './CustomizeTourPage';

type TourView = 'home' | 'about' | 'packages' | 'booking' | 'customize';

export default function PaidTourPage({
  currentUser,
  setCurrentUser,
  onNavigate
}: {
  currentUser?: any;
  setCurrentUser?: any;
  onNavigate?: (view: string) => void;
}) {
  const [currentView, setCurrentView] = useState<TourView>('home');
  const [targetTourId, setTargetTourId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash === 'booking' || hash.startsWith('step-')) {
        setCurrentView('booking');
      } else if (hash === 'about') {
        setCurrentView('about');
      } else if (hash === 'packages') {
        setCurrentView('packages');
      } else if (hash === 'customize') {
        setCurrentView('customize');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStartBooking = (tourId?: string) => {
    if (tourId) {
      setTargetTourId(tourId);
    }

    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setCurrentView('home');
    setTargetTourId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    if (view === 'customize') {
      window.location.hash = 'customize';
      setCurrentView('customize');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = view === 'home' ? '' : view;
      setCurrentView(view as TourView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="tour-website min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
      <TourNavbar
        currentView={currentView}
        setCurrentView={handleNavigate}
        selectedTourId={targetTourId}
      />

      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView
            onStartBooking={handleStartBooking}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'about' && (
          <AboutPage onStartBooking={() => handleStartBooking()} onNavigate={handleNavigate} />
        )}
        {currentView === 'packages' && (
          <TourPackageSelection onStartBooking={handleStartBooking} onNavigate={handleNavigate} />
        )}
        {currentView === 'booking' && (
          <TourBookingForm
            initialTourId={targetTourId}
            onReturnHome={handleReturnHome}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
        {currentView === 'customize' && (
          <CustomizeTourPage
            currentUser={currentUser}
            onNavigateToDashboard={() => onNavigate?.('dashboard')}
          />
        )}
      </main>

      <TourFooter setCurrentView={handleNavigate} />
    </div>
  );
}

