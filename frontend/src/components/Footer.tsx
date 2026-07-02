import React from 'react';
import {
  ArrowUp,
  Award,
  Camera,
  Compass,
  Globe,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { BEDUINE_BRAND, FEATURED_PAID_TOUR_CARDS } from '../data/paidTourContent';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          {[
            { icon: ShieldCheck, title: 'Secure Booking Guarantee', desc: 'Voucher, traveler, pickup and payment steps in one flow', iconClass: 'bg-amber-500/10 text-amber-400' },
            { icon: Award, title: 'Verified Tour Packages', desc: 'Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand', iconClass: 'bg-blue-500/10 text-blue-400' },
            { icon: Heart, title: 'Winner Logic', desc: 'Active voucher codes update the live INR price summary', iconClass: 'bg-emerald-500/10 text-emerald-400' },
            { icon: Phone, title: 'BEDUINE Travel Support', desc: BEDUINE_BRAND.phoneDisplay, iconClass: 'bg-purple-500/10 text-purple-400' },
          ].map((item) => (
            <div key={item.title} className="flex items-center space-x-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className={`p-3 rounded-xl ${item.iconClass}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800/80">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl font-black text-white tracking-tight">
                {BEDUINE_BRAND.name} <span className="text-amber-400">Tours</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pr-6">
              {BEDUINE_BRAND.fullName} connects package discovery, live booking, traveler details, pickup planning, voucher discounts, and receipt generation.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                { icon: Globe, title: 'BEDUINE Community' },
                { icon: Camera, title: 'Tour Gallery' },
                { icon: MessageCircle, title: 'Travel Stories' },
                { icon: Share2, title: 'Share Tours' },
              ].map((item) => (
                <a key={item.title} href="#" className="w-9 h-9 rounded-full bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors" title={item.title}>
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider">Explore</h5>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', view: 'home' },
                { label: 'Packages', view: 'packages' },
                { label: 'About Us', view: 'about' },
                { label: 'Book Paid Tour', view: 'booking', strong: true },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => { setCurrentView(item.view); window.scrollTo({top:0,behavior:'smooth'}); }}
                    className={`hover:text-amber-400 transition-colors cursor-pointer ${item.strong ? 'text-amber-400 font-medium' : ''}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider">Paid Tour Packages</h5>
            <ul className="space-y-2.5 text-sm">
              {FEATURED_PAID_TOUR_CARDS.slice(0, 4).map((tour) => (
                <li key={tour.id}>
                  <button onClick={() => setCurrentView('booking')} className="hover:text-amber-400 transition-colors text-left">
                    {tour.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-white text-sm uppercase tracking-wider">Contact</h5>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{BEDUINE_BRAND.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={BEDUINE_BRAND.phoneHref} className="hover:text-white font-semibold">{BEDUINE_BRAND.phoneDisplay}</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${BEDUINE_BRAND.email}`} className="hover:text-white">{BEDUINE_BRAND.email}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {BEDUINE_BRAND.fullName}. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <button onClick={() => setCurrentView('booking')} className="hover:text-slate-400">Privacy Policy</button>
            <button onClick={() => setCurrentView('booking')} className="hover:text-slate-400">Terms of Booking</button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-slate-900 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors flex items-center justify-center ml-2 shadow-lg"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
