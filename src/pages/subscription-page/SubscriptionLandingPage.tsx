import { useState } from 'react';
import {
  Sparkles, Calendar, Star, ArrowRight, ShieldCheck, Play, MapPin, Ticket, Plane,
  Users, Mail, Phone, Check, User, Briefcase, Building, FileText, Headset, Gift, Trophy, Globe, Award, Crown
} from 'lucide-react';

/* ---------- RouteFallback Component ---------- */
export function RouteFallback() {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-5 text-center bg-white text-slate-800">
      <div className="rounded-2xl border border-slate-200 px-6 py-5 text-sm font-bold shadow-md">
        Loading BEDUINE experience...
      </div>
    </div>
  );
}

/* ---------- CustomCursor Component (Bypassed) ---------- */
export function CustomCursor() {
  return null;
}

/* ---------- CinematicIntro Component (Bypassed) ---------- */
export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  onComplete();
  return null;
}

/* ---------- StickySubscribeButton Component (Bypassed) ---------- */
export function StickySubscribeButton({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return null;
}

/* ---------- LandingContent Component ---------- */
export function LandingContent({ onSelectPlan, setView }: { onSelectPlan: (planName: string) => void; setView: (v: any) => void }) {
  
  const popularDestinations = [
    { name: 'Darjeeling', price: '₹4,999', img: '/images/darjeeling_tea_1779521805614.png' },
    { name: 'Gangtok & Sikkim', price: '₹6,499', img: '/images/kashmir_resort.png' },
    { name: 'Meghelaya', price: '₹5,999', img: '/images/tropical_coast.png' },
    { name: 'Kashmir', price: '₹7,999', img: '/images/kashmir_dal_lake_1779521728036.png' },
    { name: 'Thailand', price: '₹12,999', img: '/images/thailand.png' },
    { name: 'Bali', price: '₹13,999', img: '/images/bali.png' }
  ];

  const handleDestinationClick = (name: string) => {
    setView('paid-tour');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-slate-800 font-sans min-h-screen flex flex-col">
      
      {/* ==================== NAVBAR ==================== */}
      <header className="bg-[#050B14] sticky top-0 z-50 py-3.5 border-b border-slate-900/50">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1.5 shadow-md">
              <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-sans text-lg font-black tracking-normal text-white flex items-center gap-1.5">
                BEDUINE 
                <Plane className="w-4 h-4 text-[#FF5A3C] rotate-[45deg] stroke-[3]" />
              </div>
              <div className="text-[8.5px] uppercase tracking-[0.22em] font-bold text-slate-400">Safar Jo Yad Rahe</div>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans font-bold text-xs uppercase tracking-wider text-slate-350">
            <a href="#" className="text-[#FF5A3C] border-b-2 border-[#FF5A3C] pb-0.5 no-underline">Home</a>
            <a href="#tours" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-white transition-colors no-underline">Tours</a>
            <a href="#destinations" onClick={(e) => { e.preventDefault(); document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors no-underline">Destinations</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-white transition-colors no-underline">Hotels</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-white transition-colors no-underline">Flights</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-white transition-colors no-underline">Visa</a>
            <a href="#plans" onClick={(e) => { e.preventDefault(); document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-[#FF5A3C] hover:text-[#ff7459] transition-colors no-underline">BEDUINE CLUB</a>
            <a href="#footer" className="hover:text-white transition-colors no-underline">Contact</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('login')} 
              className="flex items-center gap-1.5 px-4.5 py-2 rounded-full border border-slate-700 bg-transparent hover:bg-white/5 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" /> Login
            </button>
            <button 
              onClick={() => onSelectPlan('Silver')}
              className="px-5 py-2 bg-[#FF5A3C] hover:bg-[#ff7459] text-white font-sans font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/20 transition-all border-none cursor-pointer"
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section 
        className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-between items-center text-center text-white py-16 px-5"
        style={{
          background: "linear-gradient(180deg, rgba(6, 14, 24, 0.45) 0%, rgba(6, 14, 24, 0.65) 100%), url('/images/beduin_travel_hero_1779521651766.png') center center / cover no-repeat"
        }}
      >
        <div className="my-auto max-w-3xl flex flex-col items-center">
          {/* Main Headline */}
          <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[1.1] mb-4">
            India's Travel{' '}
            <span className="text-[#FF5A3C] block sm:inline">Membership Platform</span>
          </h1>

          {/* Subtitle Tagline */}
          <p className="text-sm sm:text-base md:text-lg font-mono font-bold tracking-[0.2em] uppercase text-slate-200 mb-6 select-none">
            Travel More • Save More • Explore More
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-250 leading-relaxed max-w-2xl mb-8">
            Join BEDUINE CLUB and unlock exclusive travel benefits, member rewards and exciting opportunities throughout the year.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button 
              onClick={() => {
                document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-[#FF5A3C] hover:bg-[#ff7459] text-white font-sans font-black text-xs uppercase tracking-widest rounded-full shadow-xl shadow-orange-500/20 transition-all border-none cursor-pointer"
            >
              JOIN BEDUINE CLUB
            </button>
            <button 
              onClick={() => {
                document.getElementById('popular-destinations')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 bg-transparent hover:bg-white/5 border-2 border-white text-white font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> EXPLORE TOURS
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="w-full max-w-5xl mx-auto mt-8 bg-black/55 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF5A3C]/10 border border-[#FF5A3C]/20 flex items-center justify-center text-[#FF5A3C]">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xl font-sans font-black text-white">1,000+</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Happy Members</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#18D7F2]/10 border border-[#18D7F2]/20 flex items-center justify-center text-[#18D7F2]">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xl font-sans font-black text-white">50+</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Destinations</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xl font-sans font-black text-white">100+</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Weekly Winners</div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xl font-sans font-black text-white">100%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Secure & Trusted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE BEDUINE ==================== */}
      <section className="py-20 px-5 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="mb-12 flex flex-col items-center">
            <h2 className="font-sans text-3xl md:text-4xl font-black text-[#0B1F2E] flex flex-wrap justify-center gap-x-2">
              Why Choose <span className="text-[#FF5A3C]">BEDUINE?</span>
            </h2>
            <div className="w-12 h-1 bg-[#FF5A3C] mt-3 rounded-full" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Tour Packages */}
            <div className="bg-[#FAFBFD] border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#FF5A3C]/10 flex items-center justify-center text-[#FF5A3C] mb-5">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-lg font-extrabold text-[#0B1F2E] mb-2.5">Tour Packages</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Domestic & International customized packages</p>
            </div>

            {/* 2. Flight Booking */}
            <div className="bg-[#FAFBFD] border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#18D7F2]/10 flex items-center justify-center text-[#18D7F2] mb-5">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-lg font-extrabold text-[#0B1F2E] mb-2.5">Flight Booking</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Best deals on domestic & international flights</p>
            </div>

            {/* 3. Hotel Booking */}
            <div className="bg-[#FAFBFD] border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-5">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-lg font-extrabold text-[#0B1F2E] mb-2.5">Hotel Booking</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">500,000+ hotels worldwide</p>
            </div>

            {/* 4. Exciting Offers */}
            <div className="bg-[#FAFBFD] border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-5">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-lg font-extrabold text-[#0B1F2E] mb-2.5">Exciting Offers</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Exclusive member discounts & benefits</p>
            </div>

            {/* 5. Visa Assistance */}
            <div className="bg-[#FAFBFD] border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-lg font-extrabold text-[#0B1F2E] mb-2.5">Visa Assistance</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Visa support for multiple countries</p>
            </div>

            {/* 6. 24/7 Support */}
            <div className="bg-[#FAFBFD] border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0096C7]/10 flex items-center justify-center text-[#0096C7] mb-5">
                <Headset className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-lg font-extrabold text-[#0B1F2E] mb-2.5">24/7 Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Dedicated support for all members</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MEMBERSHIP PLANS ==================== */}
      <section id="plans" className="py-20 px-5 bg-white text-center scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="mb-4 flex flex-col items-center">
            <h2 className="font-sans text-3xl md:text-4xl font-black text-[#0B1F2E]">
              Choose Your <span className="text-[#FF5A3C]">Membership Plan</span>
            </h2>
            <p className="text-sm text-slate-500 mt-2">Select a plan that suits your travel needs</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 items-stretch max-w-5xl mx-auto">
            
            {/* 1. SILVER PLAN */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex-1">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-6 border border-slate-200">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-xl font-black text-[#0B1F2E] uppercase tracking-wider mb-2">SILVER</h3>
                <div className="text-3xl font-sans font-black text-[#0B1F2E] mb-6 flex items-baseline justify-center gap-1.5">
                  ₹499 <span className="text-xs font-semibold text-slate-400">/ Year</span>
                </div>
                <ul className="space-y-4 text-left w-full border-t border-slate-100 pt-6">
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#0B1F2E] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>1 Lucky Draw Credit</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#0B1F2E] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>₹500 Travel Discount Credit</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#0B1F2E] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Exclusive Member Offers</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#0B1F2E] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Priority Support</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('Silver')}
                className="w-full py-3.5 mt-8 bg-slate-100 hover:bg-slate-200 text-[#0B1F2E] font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer"
              >
                JOIN SILVER
              </button>
            </div>

            {/* 2. GOLD PLAN (Popular) */}
            <div className="bg-white border-2 border-[#FF5A3C] rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden flex-1 scale-105 z-10">
              {/* Popular Ribbon */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none select-none">
                <div className="absolute top-4 right-[-32px] w-32 py-1.5 bg-[#FF5A3C] text-white text-[9px] font-black uppercase tracking-widest text-center rotate-45">
                  POPULAR
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-6">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-xl font-black text-[#FF5A3C] uppercase tracking-wider mb-2">GOLD</h3>
                <div className="text-3xl font-sans font-black text-[#0B1F2E] mb-6 flex items-baseline justify-center gap-1.5">
                  ₹799 <span className="text-xs font-semibold text-slate-400">/ Year</span>
                </div>
                <ul className="space-y-4 text-left w-full border-t border-slate-100 pt-6">
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#FF5A3C] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>1 Lucky Draw Credit</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#FF5A3C] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>₹1000 Travel Discount Credits</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#FF5A3C] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Travel Insurance Benefits</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#FF5A3C] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Exclusive Member Offers</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#FF5A3C] flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Priority Support</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('Gold')}
                className="w-full py-3.5 mt-8 bg-[#FF5A3C] hover:bg-[#ff7459] text-white font-sans font-black text-xs uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer shadow-lg shadow-orange-500/20"
              >
                JOIN GOLD
              </button>
            </div>

            {/* 3. PLATINUM PLAN */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex-1">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-6 border border-purple-200">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-xl font-black text-[#0B1F2E] uppercase tracking-wider mb-2">PLATINUM</h3>
                <div className="text-3xl font-sans font-black text-[#0B1F2E] mb-6 flex items-baseline justify-center gap-1.5">
                  ₹1499 <span className="text-xs font-semibold text-slate-400">/ Year</span>
                </div>
                <ul className="space-y-4 text-left w-full border-t border-slate-100 pt-6">
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>1 Lucky Draw Credit</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>₹2000 Travel Discount Credits</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Free Travel Insurance</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Premium Member Benefits</span>
                  </li>
                  <li className="flex items-start gap-3.5 text-sm text-[#0B1F2E] font-medium">
                    <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" strokeWidth={3} /></span>
                    <span>Priority Support</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('Platinum')}
                className="w-full py-3.5 mt-8 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer shadow-lg shadow-purple-500/20"
              >
                JOIN PLATINUM
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== HOW BEDUINE CLUB WORKS ==================== */}
      <section className="py-20 px-5 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="mb-12 flex flex-col items-center">
            <h2 className="font-sans text-3xl md:text-4xl font-black text-[#0B1F2E] flex flex-wrap justify-center gap-x-2">
              How <span className="text-[#0096C7] border-b-3 border-[#0096C7] pb-1">BEDUINE CLUB</span> Works?
            </h2>
          </div>

          {/* Steps Horizontally */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 mt-8 relative max-w-5xl mx-auto">
            {/* Step 1: Register */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-purple-600/10 border border-purple-600/20 flex items-center justify-center text-purple-600 mb-4 shadow-md">
                <User className="w-7 h-7" />
              </div>
              <h4 className="font-sans text-sm font-black text-[#0B1F2E] mb-1">1. Register</h4>
              <p className="text-[11px] text-slate-500 leading-normal max-w-[150px]">Create your account in few minutes</p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:block text-slate-300 text-2xl select-none font-bold">➜</div>

            {/* Step 2: Choose Plan */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 mb-4 shadow-md">
                <Gift className="w-7 h-7" />
              </div>
              <h4 className="font-sans text-sm font-black text-[#0B1F2E] mb-1">2. Choose Plan</h4>
              <p className="text-[11px] text-slate-500 leading-normal max-w-[150px]">Select Silver, Gold or Platinum plan</p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:block text-slate-300 text-2xl select-none font-bold">➜</div>

            {/* Step 3: Become Member */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-sans text-sm font-black text-[#0B1F2E] mb-1">3. Become Member</h4>
              <p className="text-[11px] text-slate-500 leading-normal max-w-[150px]">Complete payment and become a member</p>
            </div>

            {/* Arrow 3 */}
            <div className="hidden md:block text-slate-300 text-2xl select-none font-bold">➜</div>

            {/* Step 4: Use Benefits */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4 shadow-md">
                <Gift className="w-7 h-7" />
              </div>
              <h4 className="font-sans text-sm font-black text-[#0B1F2E] mb-1">4. Use Benefits</h4>
              <p className="text-[11px] text-slate-500 leading-normal max-w-[150px]">Enjoy discounts, credits and special offers</p>
            </div>

            {/* Arrow 4 */}
            <div className="hidden md:block text-slate-300 text-2xl select-none font-bold">➜</div>

            {/* Step 5: Travel More */}
            <div className="flex-1 flex flex-col items-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 mb-4 shadow-md">
                <Plane className="w-7 h-7" />
              </div>
              <h4 className="font-sans text-sm font-black text-[#0B1F2E] mb-1">5. Travel More</h4>
              <p className="text-[11px] text-slate-500 leading-normal max-w-[150px]">Book and travel more with extra savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== POPULAR DESTINATIONS ==================== */}
      <section id="popular-destinations" className="py-20 px-5 bg-white text-center scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="flex items-center justify-between mb-12 max-w-5xl mx-auto border-b border-slate-100 pb-5">
            <h2 className="font-sans text-3xl md:text-4xl font-black text-[#0B1F2E]">Popular Destinations</h2>
            <button 
              onClick={() => { setView('paid-tour'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-5 py-2.5 bg-transparent hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              VIEW ALL TOURS
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {popularDestinations.map((dest, i) => (
              <div 
                key={i} 
                onClick={() => handleDestinationClick(dest.name)}
                className="group cursor-pointer rounded-3xl overflow-hidden shadow-lg border border-slate-100/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="h-56 overflow-hidden relative">
                  <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                {/* Content */}
                <div className="p-5 text-left bg-white flex justify-between items-center border-t border-slate-100">
                  <div className="leading-tight">
                    <h4 className="font-sans text-base font-extrabold text-[#0B1F2E]">{dest.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">Starting from {dest.price}</p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#FF5A3C] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="bg-[#050B14] py-16 px-5 text-center text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
          <h3 className="text-xl sm:text-2xl font-sans font-semibold text-slate-300">Ready To Start Your Journey?</h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-[#FF5A3C] mt-2 mb-4">Join BEDUINE CLUB Today!</h2>
          <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl leading-relaxed">
            Travel smarter. Save more. Create unforgettable memories.
          </p>
          <button 
            onClick={() => onSelectPlan('Silver')}
            className="px-8 py-3.5 bg-[#FF5A3C] hover:bg-[#ff7459] text-white font-sans font-black text-xs uppercase tracking-widest rounded-full shadow-xl shadow-orange-500/30 transition-all border-none cursor-pointer flex items-center gap-2"
          >
            BECOME A MEMBER NOW <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer id="footer" className="bg-[#FAFBFD] border-t border-slate-100 pt-16 pb-6 select-none font-sans">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
            {/* 1. Left Logo Info */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-md">
                  <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight text-left">
                  <div className="font-sans text-base font-black tracking-normal text-[#0B1F2E] flex items-center gap-1">
                    BEDUINE
                    <Plane className="w-3.5 h-3.5 text-[#FF5A3C] rotate-[45deg] stroke-[3]" />
                  </div>
                  <div className="text-[8px] uppercase tracking-[0.22em] font-bold text-slate-400">Safar Jo Yad Rahe</div>
                </div>
              </div>
            </div>

            {/* 2. Company */}
            <div className="text-left">
              <h4 className="font-sans font-extrabold text-[#0B1F2E] mb-4 text-xs uppercase tracking-wider">Company</h4>
              <ul className="space-y-2.5 font-bold text-xs text-slate-500">
                <li><a href="#" onClick={(e) => { e.preventDefault(); setView('legal'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">About Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setView('terms-and-conditions'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Terms & Conditions</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setView('privacy-policy'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setView('cancellation-policy'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Cancellation Policy</a></li>
              </ul>
            </div>

            {/* 3. Quick Links */}
            <div className="text-left">
              <h4 className="font-sans font-extrabold text-[#0B1F2E] mb-4 text-xs uppercase tracking-wider">Quick Links</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 font-bold text-xs text-slate-500">
                <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Tours</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Flights</a>
                <a href="#popular-destinations" className="hover:text-[#FF5A3C] transition-colors no-underline">Destinations</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Visa</a>
                <a href="#" onClick={(e) => { e.preventDefault(); setView('paid-tour'); }} className="hover:text-[#FF5A3C] transition-colors no-underline">Hotels</a>
                <a href="#footer" className="hover:text-[#FF5A3C] transition-colors no-underline">Contact Us</a>
              </div>
            </div>

            {/* 4. Contact Us */}
            <div className="text-left flex flex-col items-start">
              <h4 className="font-sans font-extrabold text-[#0B1F2E] mb-4 text-xs uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-3 font-bold text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FF5A3C]" />
                  <span>+91 12345 67890</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF5A3C]" />
                  <span>info@beduine.ai</span>
                </li>
                <li className="flex items-start gap-2 max-w-[240px]">
                  <MapPin className="w-4 h-4 text-[#FF5A3C] shrink-0 mt-0.5" />
                  <span>123, Street Name, Kolkata, West Bengal - 700001</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Social and Copyright */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[10px] font-bold text-slate-400">
              © 2026 BEDUINE TOUR AND TRAVELS PVT LTD. All Rights Reserved.
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-2">
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-[#FF5A3C] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-[#FF5A3C] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-[#FF5A3C] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 00.502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 002.11-2.11C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-[#FF5A3C] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
