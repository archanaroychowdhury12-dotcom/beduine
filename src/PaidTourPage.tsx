import { useEffect, useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { BookingPortalContainer } from './components/BookingPortal/BookingPortalContainer';
import { Footer as TourFooter } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar as TourNavbar } from './components/Navbar';
import { PackagesPage } from './components/PackagesPage';

type TourView = 'home' | 'about' | 'packages' | 'booking';

export default function PaidTourPage() {
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
    setCurrentView(view as TourView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {currentView === 'booking' && (
          <BookingPortalContainer
            initialTourId={targetTourId}
            onReturnHome={handleReturnHome}
          />
        )}
      </main>

      <TourFooter setCurrentView={handleNavigate} />
    </div>
  );
}
