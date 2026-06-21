import { useEffect, useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { BookingPortalContainer } from './components/BookingPortal/BookingPortalContainer';
import { Footer as TourFooter } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar as TourNavbar } from './components/Navbar';
import { PackagesPage } from './components/PackagesPage';
import { CustomizeTourPage } from './pages/CustomizeTourPage';

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
    } else {
      window.location.hash = view === 'home' ? '' : view;
    }
    setCurrentView(view as TourView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToDashboard = () => {
    if (onNavigate) {
      onNavigate('dashboard');
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
        {currentView === 'home' && <HomeView onStartBooking={handleStartBooking} />}
        {currentView === 'about' && (
          <AboutPage onStartBooking={() => handleStartBooking()} onNavigate={handleNavigate} />
        )}
        {currentView === 'packages' && (
          <PackagesPage onStartBooking={handleStartBooking} onNavigate={handleNavigate} />
        )}
        {currentView === 'customize' && (
          <CustomizeTourPage
            currentUser={currentUser}
            onNavigateToDashboard={handleGoToDashboard}
          />
        )}
        {currentView === 'booking' && (
          <BookingPortalContainer
            initialTourId={targetTourId}
            onReturnHome={handleReturnHome}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
      </main>

      <TourFooter setCurrentView={handleNavigate} />
    </div>
  );
}

