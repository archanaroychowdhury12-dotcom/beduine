import React, { useState, useEffect } from 'react';
import { PhoneCall, Calendar, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { BEDUINE_BRAND } from '../data/paidTourContent';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedTourId?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string, hash?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || currentView === 'booking' || currentView === 'about' || currentView === 'packages'
          ? 'bg-white/95 backdrop-blur-md py-3.5 shadow-lg border-b border-slate-100 text-slate-900'
          : 'bg-gradient-to-b from-black/50 via-black/20 to-transparent py-5 text-white backdrop-blur-[1px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center space-x-3 group text-left focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border bg-white flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform shrink-0">
            <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className={`font-serif text-2xl font-black tracking-tight transition-colors ${
              isScrolled || currentView !== 'home' ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-300'
            }`}>
              {BEDUINE_BRAND.name} <span className="text-amber-500">Tours</span>
            </span>
            <span className={`block text-[10px] font-bold tracking-widest uppercase ${
              isScrolled || currentView !== 'home' ? 'text-slate-500' : 'text-slate-200'
            }`}>
              {BEDUINE_BRAND.tagline}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-9">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-bold tracking-wide transition-colors cursor-pointer ${
              currentView === 'home'
                ? (isScrolled ? 'text-amber-600 border-b-2 border-amber-500 pb-1' : 'text-amber-400 border-b-2 border-amber-400 pb-1')
                : (isScrolled || currentView !== 'home' ? 'text-slate-600 hover:text-amber-600' : 'text-slate-100 hover:text-amber-300')
            }`}
          >
            Home
          </button>

          {currentView !== 'booking' ? (
            <>
              <button
                onClick={() => handleNavClick('packages')}
                className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  currentView === 'packages'
                    ? (isScrolled ? 'text-amber-600 border-b-2 border-amber-500 pb-1' : 'text-amber-400 border-b-2 border-amber-400 pb-1')
                    : (isScrolled || currentView !== 'home' ? 'text-slate-700 hover:text-amber-600' : 'text-slate-100 hover:text-amber-300')
                }`}
              >
                Packages
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  currentView === 'about'
                    ? (isScrolled ? 'text-amber-600 border-b-2 border-amber-500 pb-1' : 'text-amber-400 border-b-2 border-amber-400 pb-1')
                    : (isScrolled || currentView !== 'home' ? 'text-slate-700 hover:text-amber-600' : 'text-slate-100 hover:text-amber-300')
                }`}
              >
                About Us
              </button>
              {currentView === 'home' && (
                <>
                  <button
                    onClick={() => handleNavClick('home', 'destinations')}
                    className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                      isScrolled ? 'text-slate-700 hover:text-amber-600' : 'text-slate-100 hover:text-amber-300'
                    }`}
                  >
                    Destinations
                  </button>
                  <button
                    onClick={() => handleNavClick('home', 'why-us')}
                    className={`text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                      isScrolled ? 'text-slate-700 hover:text-amber-600' : 'text-slate-100 hover:text-amber-300'
                    }`}
                  >
                    Why Us
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <a
                href="#step-1"
                className="text-sm font-extrabold tracking-wide text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Live Booking
              </a>
              <a
                href="#step-2"
                className="text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 transition-colors"
              >
                Tour Selection
              </a>
              <a
                href="#step-4"
                className="text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 transition-colors"
              >
                Travelers & Date
              </a>
              <a
                href="#step-6"
                className="text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                Vouchers <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">-15%</span>
              </a>
              <a
                href="#step-11"
                className="text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 transition-colors"
              >
                Support / FAQ
              </a>
            </>
          )}

          {/* Unmissable Navigation Link to "Book Paid Tour" */}
          <button
            onClick={() => handleNavClick('booking')}
            className={`text-sm font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
              currentView === 'booking'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : (isScrolled || currentView !== 'home')
                ? 'bg-amber-100/80 text-amber-900 hover:bg-amber-500 hover:text-slate-950'
                : 'bg-white/20 text-white hover:bg-amber-500 hover:text-slate-950 backdrop-blur-sm'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Paid Tour</span>
          </button>
        </nav>

        {/* Primary Action CTA Button */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={() => handleNavClick('booking')}
            className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg cursor-pointer"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full group-hover:opacity-90 transition-opacity"></span>
            <div className="relative px-6 py-2.5 rounded-full bg-slate-900 group-hover:bg-opacity-0 transition-all duration-300 flex items-center space-x-2 text-white group-hover:text-slate-950 font-black text-sm tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-slate-950 transition-colors" />
              <span>Book Paid Tour</span>
              <ChevronRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={() => handleNavClick('booking')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-full shadow-md"
          >
            Book Paid Tour
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border transition-colors focus:outline-none ${
              isScrolled || currentView === 'booking'
                ? 'bg-slate-100 text-slate-800 border-slate-200'
                : 'bg-black/40 text-white border-white/20'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 py-6 px-6 shadow-2xl animate-fadeIn text-slate-900">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left text-base font-bold py-2.5 px-4 rounded-xl transition-colors ${
                currentView === 'home' ? 'bg-amber-50 text-amber-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            {currentView !== 'booking' && (
              <>
                <button
                  onClick={() => handleNavClick('packages')}
                  className={`text-left text-base font-semibold py-2.5 px-4 rounded-xl ${currentView === 'packages' ? 'bg-amber-50 text-amber-600' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Packages
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className={`text-left text-base font-semibold py-2.5 px-4 rounded-xl ${currentView === 'about' ? 'bg-amber-50 text-amber-600' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  About Us
                </button>
              </>
            )}

            {currentView === 'booking' && (
              <>
                <a
                  href="#step-1"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-base font-bold text-amber-600 py-2.5 px-4 rounded-xl hover:bg-amber-50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Live Booking Portal
                </a>
                <a
                  href="#step-2"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-base font-semibold text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-100"
                >
                  Tour Selection
                </a>
                <a
                  href="#step-6"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-base font-semibold text-emerald-600 py-2.5 px-4 rounded-xl hover:bg-emerald-50"
                >
                  Apply Voucher Codes
                </a>
                <a
                  href="#step-11"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left text-base font-semibold text-slate-700 py-2.5 px-4 rounded-xl hover:bg-slate-100"
                >
                  FAQ & Support
                </a>
              </>
            )}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('booking')}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-lg flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Paid Tour Website</span>
              </button>

              <a
                href={BEDUINE_BRAND.phoneHref}
                className="flex items-center justify-center space-x-2 text-slate-700 py-3 bg-slate-100 rounded-2xl font-bold text-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>Helpline: {BEDUINE_BRAND.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
