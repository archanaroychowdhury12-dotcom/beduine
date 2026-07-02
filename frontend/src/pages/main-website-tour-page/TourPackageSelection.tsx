import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';

import { PAID_TOUR_CARDS } from '../../data/paidTourContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { TourPackageCard } from './TourPackageCard';

interface PackagesPageProps {
  onStartBooking: (tourId?: string) => void;
  onNavigate: (view: string) => void;
}

const allPackages = PAID_TOUR_CARDS;
const regions = ['All', ...Array.from(new Set(allPackages.map((tour: any) => tour.region)))] as string[];
const types = ['All', ...Array.from(new Set(allPackages.map((tour: any) => tour.type)))] as string[];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Duration'];

export const TourPackageSelection: React.FC<PackagesPageProps> = ({ onStartBooking, onNavigate }) => {
  useScrollReveal();
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  let filtered = allPackages.filter((pkg: any) => {
    if (region !== 'All' && pkg.region !== region) return false;
    if (type !== 'All' && pkg.type !== type) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const haystack = `${pkg.name} ${pkg.location} ${pkg.desc} ${pkg.bestFor.join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    if (sortBy === 'Rating') return b.rating - a.rating;
    if (sortBy === 'Duration') return a.days - b.days;
    return Number(b.featured) - Number(a.featured);
  });

  return (
    <div className="bg-white font-sans">
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/kashmir_dal_lake_1779521728036.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300 mb-6">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-amber-400 font-semibold">Packages</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-5">
            BEDUINE Paid <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">Packages</span>
          </h1>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto mb-8">
            These packages are connected to the same booking portal, INR pricing, traveler forms, pickup logic, and voucher engine.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1.5 flex items-center shadow-2xl">
              <div className="flex items-center flex-grow pl-5">
                <Search className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Sundarbans, Darjeeling, Dubai..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-sm font-semibold text-white placeholder-slate-300 py-3"
                />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-brand to-amber-500 text-white font-bold text-sm rounded-full transition-all hover:opacity-90 shrink-0 cursor-pointer">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-14 sm:h-20"><path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="white" /></svg>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Region</p>
            <div className="flex flex-wrap gap-2">
              {regions.map((item) => (
                <button key={item} onClick={() => setRegion(item)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${region === item ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-cream text-slate-700 hover:bg-orange-100 border border-orange-100/50'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</p>
            <div className="flex flex-wrap gap-2">
              {types.map((item) => (
                <button key={item} onClick={() => setType(item)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${type === item ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-cream text-slate-700 hover:bg-orange-100 border border-orange-100/50'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sort By</p>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-cream border border-orange-100/50 rounded-xl px-4 py-2.5 pr-9 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand cursor-pointer">
                {sortOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 font-medium">{filtered.length} tour{filtered.length !== 1 ? 's' : ''} found</p>
      </section>

      <section className="py-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-3">No BEDUINE tours match your filters.</p>
            <button onClick={() => { setRegion('All'); setType('All'); setSearch(''); }} className="text-brand font-bold underline cursor-pointer">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((pkg: any) => (
              <TourPackageCard
                key={pkg.id}
                pkg={pkg}
                liked={liked.has(pkg.id)}
                onToggleLike={(id) => toggleLike(id)}
                onClick={() => onStartBooking(pkg.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand via-orange-500 to-amber-500 rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-brand/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-6 left-6 w-28 h-28 rounded-full border-2 border-white"></div>
            <div className="absolute bottom-6 right-6 w-44 h-44 rounded-full border-2 border-white"></div>
          </div>
          <div className="relative space-y-5">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">Ready to Start Your BEDUINE Tour?</h2>
            <p className="text-white/85 text-base max-w-xl mx-auto">Pick a package and the booking portal will carry the selected tour into traveler, pickup, voucher, and payment steps.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button onClick={() => onStartBooking()} className="group px-8 py-4 rounded-full bg-slate-950 text-amber-400 hover:text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-2xl flex items-center gap-3 cursor-pointer relative overflow-hidden">
                <span className="absolute inset-0 anim-shimmer"></span>
                <Calendar className="w-5 h-5 relative" /><span className="relative">Book Paid Tour</span><ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('about')} className="px-8 py-4 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/40 hover:border-white text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer">
                <span>About BEDUINE</span><ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
