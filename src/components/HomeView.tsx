import React, { useEffect, useState, useRef } from 'react';
import {
  Sparkles, Calendar, Star, ArrowRight, ShieldCheck, Heart, Compass,
  Play, MapPin, Mountain, Clock, Quote, Ticket, Wallet, Flame, Zap, Plane,
  ThumbsUp,
  Share2, MessageCircle, Search, Users, Mail, Send, CheckCircle2, ChevronRight,
  ChevronLeft, Camera, Hotel, Utensils, Globe, Smile, Briefcase
} from 'lucide-react';
import {
  averageRating,
  BEDUINE_BRAND,
  DESTINATION_TILES,
  FEATURED_PAID_TOUR_CARDS,
  findTourIdByQuery,
  totalReviewCount,
  TOUR_REVIEW_CARDS,
  voucherDisplay,
} from '../data/paidTourContent';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface HomeViewProps {
  onStartBooking: (tourId?: string) => void;
  currentUser?: any;
  onNavigate?: (view: string) => void;
}

/* Animated counter */
function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = () => {
          start += Math.ceil(end / 60);
          if (start >= end) { setVal(end); return; }
          setVal(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartBooking,
  currentUser,
  onNavigate
}) => {
  const [showFloat, setShowFloat] = useState(false);
  const [searchDest, setSearchDest] = useState('');
  const [reviewIdx, setReviewIdx] = useState(0);
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const fn = () => { setShowFloat(window.scrollY > 700); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const reviews = TOUR_REVIEW_CARDS;
  /*
    { name: 'Emma Richardson', role: 'Travel Blogger, London', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', quote: 'The Glacier Express journey was absolutely magical. Every itinerary detail was beyond anything I imagined possible. Impeccable service from start to finish.', tour: 'Swiss Alps Glacier Express' },
    { name: 'Carlos Mendoza', role: 'Photographer, Buenos Aires', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', quote: 'Patagonia trek was the most rewarding adventure of my entire life. The expert guides, eco-domes, and wildlife — every single moment was perfectly curated.', tour: 'Patagonia Fjord Trek' },
    { name: 'Ayaka Yamamoto', role: 'Tea Master, Kyoto', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', quote: 'Despite living in Kyoto my entire life, this tour showed me hidden temples and secret ryokans I had never experienced before. Truly exceptional and life-changing.', tour: 'Kyoto Imperial Temples' },
  ];

  */
  const paidTourReviews = reviews;
  const heroTour = FEATURED_PAID_TOUR_CARDS[3] ?? FEATURED_PAID_TOUR_CARDS[0];
  const topReview = paidTourReviews[0];
  const popularTags = FEATURED_PAID_TOUR_CARDS.map((tour) => tour.location.split(',')[0]);
  const reviewSummary = `${averageRating.toFixed(1)}/5 (${totalReviewCount.toLocaleString('en-IN')} reviews)`;
  const handleSearch = () => onStartBooking(findTourIdByQuery(searchDest));

  return (
    <div className="bg-white text-slate-800 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">

      {/* FLOATING CTA */}
      <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-700 ${showFloat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'}`}>
        <button onClick={() => onStartBooking()} className="group flex items-center gap-2.5 bg-gradient-to-r from-brand to-amber-500 text-white font-bold text-sm px-6 py-4 rounded-full shadow-2xl shadow-brand/40 hover:scale-105 transition-all cursor-pointer glow-brand">
          <Ticket className="w-5 h-5 group-hover:rotate-12 transition-transform" /><span>Book Tour</span>
        </button>
      </div>

      {/* ===================== HERO ===================== */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroTour?.img ?? '/images/kashmir_dal_lake_1779521728036.png'} alt={heroTour?.name ?? 'BEDUINE paid tour'} className="w-full h-full object-cover anim-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/30 to-slate-950/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/30"></div>
        </div>

        {/* Animated orbs */}
        <div className="absolute top-40 left-[8%] w-72 h-72 rounded-full bg-brand/8 blur-[100px] anim-float hidden lg:block"></div>
        <div className="absolute bottom-32 right-[5%] w-96 h-96 rounded-full bg-amber-500/6 blur-[120px] anim-float hidden lg:block" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-amber-300 rounded-full anim-bounce-subtle hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white/50 rounded-full anim-bounce-subtle hidden lg:block" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="glass inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-amber-300 text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" /> {BEDUINE_BRAND.tagline}
              </span>
              <span className="glass inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-[0.2em]">
                <Zap className="w-3.5 h-3.5" /> Live Voucher Booking
              </span>
            </div>

            <h1 className="font-serif text-[3rem] sm:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.04] mb-7 tracking-tight">
              {BEDUINE_BRAND.name} Paid Tours{' '}
              <span className="block sm:inline bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                With Member Savings
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-200/90 leading-relaxed mb-10 max-w-2xl">
              Book Sundarbans, Darjeeling, Puri, Kashmir, Dubai, Thailand and more with live package selection, traveler details, pickup logic, and voucher discounts in one BEDUINE flow.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <button onClick={() => onStartBooking()} className="group relative overflow-hidden px-9 py-5 rounded-full bg-gradient-to-r from-brand via-orange-500 to-amber-500 text-white font-bold text-base transition-all hover:-translate-y-1 shadow-2xl shadow-brand/30 flex items-center gap-3 cursor-pointer">
                <span className="absolute inset-0 anim-shimmer"></span>
                <Calendar className="w-5 h-5 relative" /><span className="relative">Book Paid Tour</span><ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#packages" onClick={(e) => { e.preventDefault(); document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="glass px-9 py-5 rounded-full text-white font-bold text-base flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer">
                <Compass className="w-5 h-5 text-amber-400" /><span>Explore Packages</span>
              </a>
            </div>

            {/* Trust */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /> Secure BEDUINE booking policy</span>
              <span className="glass inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"><Ticket className="w-3.5 h-3.5 text-amber-300" /><span className="text-amber-300 font-bold">{voucherDisplay}</span></span>
              <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400 fill-current" /> {reviewSummary}</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 anim-bounce-subtle">
          <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-5 h-9 rounded-full border-2 border-white/25 flex items-start justify-center p-1.5"><div className="w-1 h-2 bg-white/60 rounded-full animate-pulse"></div></div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 80" className="w-full h-16 sm:h-20"><path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="white"/></svg></div>
      </section>

      {/* ===================== SEARCH ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-5xl mx-auto sr">
          <div className="text-center space-y-3 mb-10">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">plan your trip</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Find Your Perfect Getaway</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-orange-100/50 glow-amber">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center bg-cream rounded-xl px-4 py-4 border border-orange-100 focus-within:border-brand transition-all">
                <MapPin className="w-5 h-5 text-brand mr-3 shrink-0" />
                <input type="text" placeholder="Where to?" value={searchDest} onChange={(e) => setSearchDest(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800 placeholder-slate-400" />
              </div>
              <div className="flex items-center bg-cream rounded-xl px-4 py-4 border border-orange-100"><Calendar className="w-5 h-5 text-brand mr-3 shrink-0" /><input type="date" className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800" /></div>
              <div className="flex items-center bg-cream rounded-xl px-4 py-4 border border-orange-100"><Users className="w-5 h-5 text-brand mr-3 shrink-0" /><select className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800 cursor-pointer"><option>2 Adults</option><option>1 Adult</option><option>Family</option><option>Group 4+</option></select></div>
              <button onClick={handleSearch} className="px-6 py-4 bg-brand hover:bg-brand-dark text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 cursor-pointer group"><Search className="w-4 h-4 group-hover:scale-110 transition-transform" /><span>Search</span></button>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-orange-100/50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Popular:</span>
              {popularTags.map(t=>(
                <button key={t} onClick={()=>setSearchDest(t)} className="px-3 py-1.5 rounded-full bg-cream hover:bg-brand hover:text-white text-brand text-xs font-bold transition-all border border-orange-200/50 cursor-pointer">{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E8590C 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 relative stagger">
          {[
            { end: 10, suffix: '+', label: 'Years Experience', Icon: Briefcase, color: 'from-brand to-amber-500' },
            { end: FEATURED_PAID_TOUR_CARDS.length, suffix: '+', label: 'Live Packages', Icon: Globe, color: 'from-teal-500 to-emerald-500' },
            { end: totalReviewCount, suffix: '', label: 'Verified Reviews', Icon: Smile, color: 'from-rose-500 to-pink-500' },
            { end: 98, suffix: '%', label: 'Satisfaction', Icon: Heart, color: 'from-violet-500 to-purple-500' },
          ].map((s, i) => (
            <div key={i} className="text-center group">
              <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}><s.Icon className="w-7 h-7" /></div>
              <h3 className="font-serif text-5xl sm:text-6xl font-bold text-slate-900 tabular-nums"><Counter end={s.end} suffix={s.suffix} /></h3>
              <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== MARQUEE TICKER ===================== */}
      <div className="bg-slate-950 py-4 overflow-hidden">
        <div className="marquee-track anim-ticker whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <span key={k} className="inline-flex items-center gap-8 mx-4">
              {[...new Set([...popularTags, 'Kashmir', 'Dubai', 'Thailand'])].map((d, idx) => (
                <span key={`${d}-${k}-${idx}`} className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-3 h-3 text-brand fill-current" /> {d}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===================== HANDPICKED PACKAGES ===================== */}
      <section id="packages" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sr">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">popular destinations</span>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900">Handpicked Packages</h2>
          <p className="text-slate-500 pt-1">BEDUINE paid tours connected to the same live booking and voucher logic.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger">
          {FEATURED_PAID_TOUR_CARDS.map((pkg) => (
            <div key={pkg.id} onClick={() => onStartBooking(pkg.id)} className="group cursor-pointer">
              <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl card-lift img-zoom">
                <img src={pkg.img} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                {pkg.featured && <span className="absolute top-5 left-5 z-10 bg-gradient-to-r from-brand to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1"><Flame className="w-3 h-3" />Featured</span>}
                <span className="absolute top-5 right-5 z-10 glass-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500 fill-current" />{pkg.rating}<span className="text-slate-400 font-normal">({pkg.reviews.toLocaleString()})</span></span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-[4.5rem] bg-white rounded-t-full flex items-end justify-center pb-4 z-20 shadow-2xl"><div className="flex gap-0.5 text-brand">{[...Array(5)].map((_,j)=><Star key={j} className="w-3.5 h-3.5 fill-current"/>)}</div></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 pt-20 z-10 text-center">
                  <span className="inline-block bg-orange-100 text-brand font-black text-[0.65rem] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-3">{pkg.region}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-200 transition-colors mb-2 drop-shadow-lg">{pkg.name}</h3>
                  <div className="flex items-center justify-center gap-3 text-white/70 text-sm font-medium mb-4"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400"/>{pkg.durationText}</span><span className="w-1 h-1 bg-white/40 rounded-full"></span><span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400"/>{pkg.type}</span></div>
                  <div className="flex items-center justify-center gap-3"><span className="text-3xl font-bold text-white drop-shadow">{pkg.priceText}</span><span className="px-5 py-2.5 rounded-full bg-white text-brand font-bold text-xs uppercase tracking-wider hover:bg-amber-200 transition-all shadow-lg">Book Now</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== ABOUT US ===================== */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-cream scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative sr-left flex items-center justify-center">
            <div className="relative w-full max-w-[420px] flex items-center justify-center">
              {/* The actual landmarks collage image matching the template exactly */}
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=85"
                alt="Travel landmarks collage"
                className="w-full h-auto object-contain"
                style={{ filter:'contrast(1.05) saturate(1.15)' }}
              />
            </div>
          </div>
          <div className="lg:col-span-7 space-y-7 sr-right">
            <span className="inline-block px-6 py-2.5 bg-white text-brand font-bold text-sm uppercase tracking-[0.2em] rounded-full shadow-sm border border-orange-100/50">About Us</span>
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05]">Your Journey,<br/><span className="text-gradient-brand">Our Passion</span></h2>
            <p className="text-slate-600 text-base sm:text-lg leading-[1.8]">We believe that travel is more than just visiting new places; it's about creating memories, experiencing diverse cultures, and discovering the wonders of the world. With years of experience in the travel industry, our dedicated team is committed to providing exceptional travel experiences tailored to your unique desires and needs.</p>
            <div className="space-y-4">
              {[
                'Budget-Friendly',
                'Luxurious Getaways',
                'Trusted Local Guides'
              ].map(item => (
                <p key={item} className="flex items-center gap-3 text-slate-700 text-base font-medium">
                  <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  {item}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group h-44 img-zoom">
                <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&auto=format&fit=crop&q=85" alt="" className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl"><div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow"><Play className="w-4.5 h-4.5 text-brand fill-current ml-0.5"/></div></div>
                </div>
              </div>
              <div className="space-y-4">
                <button onClick={()=>onStartBooking()} className="group w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-brand hover:bg-brand-dark text-white font-bold text-base rounded-xl transition-all hover:-translate-y-0.5 shadow-xl shadow-brand/20 cursor-pointer relative overflow-hidden">
                  <span className="relative flex items-center gap-3">
                    Learn More
                    <span className="relative w-6 h-6 rounded-full bg-white text-brand flex items-center justify-center group-hover:translate-x-1 transition-transform"><ArrowRight className="w-3.5 h-3.5"/></span>
                  </span>
                </button>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"/>
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80" alt="" className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"/>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">4.7 Star Rating</p>
                    <p className="text-xs text-slate-500">Based on 3,571 Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DESTINATIONS ===================== */}
      <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16 sr">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">Choose Your Place</span>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900">Popular Destinations</h2>
        </div>

        {/* Asymmetric blob grid matching the template exactly */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {DESTINATION_TILES.slice(0, 5).map((d,i)=>(
            <button
              key={d.id}
              onClick={()=>onStartBooking(d.tourId)}
              className={`group relative ${d.h} ${d.col} overflow-hidden shadow-xl text-left cursor-pointer card-lift img-zoom
                rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem]
                ${i===0 ? 'rounded-[3rem] md:rounded-[4rem]' : ''}
              `}
            >
              <img src={d.image} alt={d.name} className="absolute inset-0 w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/25 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-amber-300 transition-colors leading-tight drop-shadow-lg">{d.name}</h3>
                <p className="mt-2 text-sm font-semibold text-white/75">{d.tagline}</p>
              </div>
              <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center"><ArrowRight className="w-5 h-5"/></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14 sr">
            <div className="lg:col-span-7 space-y-3">
              <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand-light">our services</span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">What We Offer For <span className="text-gradient-brand">Every Adventure</span></h2>
            </div>
            <p className="lg:col-span-5 text-slate-400 text-base leading-relaxed">From dreaming of a destination to returning home with lifelong memories — we handle every detail.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-slate-800/50 rounded-3xl overflow-hidden stagger">
            {[
              { icon:Plane, title:'Flight Booking', desc:'First-class & business class air tickets to 500+ destinations.' },
              { icon:Hotel, title:'Luxury Hotels', desc:'Hand-picked 5-star hotels, ryokans, and eco-resorts.' },
              { icon:Camera, title:'Photo Tours', desc:'Photographer-led expeditions with golden hour scheduling.' },
              { icon:Mountain, title:'Adventure Hikes', desc:'Certified alpine guides for iconic mountain treks.' },
              { icon:Utensils, title:'Gourmet Dining', desc:'Michelin-starred reservations and cooking classes.' },
              { icon:Compass, title:'Private Concierge', desc:'24/7 personal travel advisor for VIP perks.' }
            ].map((s,i)=>(
              <div key={i} onClick={()=>onStartBooking()} className="group p-9 bg-slate-950 hover:bg-brand transition-colors duration-500 cursor-pointer space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-brand/15 text-brand-light group-hover:bg-white group-hover:text-brand flex items-center justify-center transition-all duration-500"><s.icon className="w-7 h-7"/></div>
                <h3 className="font-serif text-xl font-bold text-white">{s.title}</h3>
                <p className="text-sm text-slate-400 group-hover:text-white/90 leading-relaxed transition-colors">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY US ===================== */}
      <section id="why-us" className="py-24 px-4 sm:px-6 lg:px-8 bg-cream scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 sr"><span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">why us</span><h2 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900">Crafting Unforgettable <span className="text-gradient-brand">Journeys</span></h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {[
              { icon:Compass, title:'Customized Packages', desc:'Tailor-made itineraries ensuring a unique experience every time.', color:'from-brand to-amber-500' },
              { icon:Mountain, title:'Adventure Tours', desc:'Mountain trekking to scuba diving for the adrenaline seekers.', color:'from-emerald-500 to-teal-500' },
              { icon:Heart, title:'Luxury Vacations', desc:'Opulent accommodations and exclusive five-star experiences.', color:'from-rose-500 to-pink-500' },
              { icon:ShieldCheck, title:'Safe & Secure', desc:'24/7 on-trip support with comprehensive travel insurance.', color:'from-blue-500 to-cyan-500' },
              { icon:Calendar, title:'Flexible Dates', desc:'Multiple departures monthly with free rescheduling.', color:'from-violet-500 to-purple-500' },
              { icon:Wallet, title:'Best Price Guarantee', desc:'Found lower? We match it plus give you an extra 10% off.', color:'from-amber-500 to-brand' }
            ].map((f,i)=>(
              <div key={i} className="group relative bg-white p-8 rounded-[1.5rem] shadow-lg border border-orange-100/50 card-lift cursor-pointer overflow-hidden">
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${f.color} opacity-0 group-hover:opacity-10 rounded-bl-[3rem] transition-opacity`}></div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-lg`}><f.icon className="w-7 h-7"/></div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 group-hover:text-brand transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRUSTED BY ===================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-orange-100/50 sr">
        <div className="max-w-5xl mx-auto"><p className="text-center text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-8">As Featured In</p>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 stagger">{[{n:'Lonely Planet',e:'🌍'},{n:'TripAdvisor',e:'🦉'},{n:'National Geo',e:'📸'},{n:'Condé Nast',e:'✈️'},{n:'Travel+Leisure',e:'🏝️'},{n:'BBC Travel',e:'📺'}].map((p,i)=>(<div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-cream transition-colors group cursor-pointer"><span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{p.e}</span><span className="text-xs font-bold text-slate-500 group-hover:text-brand transition-colors text-center">{p.n}</span></div>))}</div>
        </div>
      </section>

      {/* ===================== TESTIMONIAL CAROUSEL ===================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12 sr"><span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">client stories</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Voices of Wanderers</h2></div>
          <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-xl border border-orange-100/50 relative sr-scale" key={reviewIdx}>
            <Quote className="absolute top-6 left-6 w-10 h-10 text-orange-200 fill-current hidden sm:block"/>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1 text-center"><img src={paidTourReviews[reviewIdx].img} alt="" className="w-28 h-28 mx-auto rounded-full object-cover shadow-xl border-4 border-white ring-4 ring-orange-200/50"/><h4 className="font-serif text-lg font-bold text-slate-900 mt-4">{paidTourReviews[reviewIdx].name}</h4><p className="text-xs text-slate-500">{paidTourReviews[reviewIdx].role}</p></div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex space-x-1 text-brand">{[...Array(5)].map((_,i)=><Star key={i} className="w-5 h-5 fill-current"/>)}</div>
                <p className="font-serif text-xl sm:text-2xl text-slate-800 leading-relaxed italic">"{paidTourReviews[reviewIdx].quote}"</p>
                <div className="pt-3 border-t border-orange-100/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-brand uppercase tracking-wider">Tour: {paidTourReviews[reviewIdx].tour}</span>
                  <div className="flex items-center space-x-2">
                    <button onClick={()=>setReviewIdx((reviewIdx-1+paidTourReviews.length)%paidTourReviews.length)} className="w-9 h-9 rounded-full bg-cream hover:bg-brand text-brand hover:text-white flex items-center justify-center transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4"/></button>
                    <button onClick={()=>setReviewIdx((reviewIdx+1)%paidTourReviews.length)} className="w-9 h-9 rounded-full bg-brand text-white hover:bg-brand-dark flex items-center justify-center transition-colors shadow cursor-pointer"><ChevronRight className="w-4 h-4"/></button>
                  </div>
                </div>
                <div className="flex space-x-1.5">{paidTourReviews.map((_,i)=><button key={i} onClick={()=>setReviewIdx(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${i===reviewIdx?'w-8 bg-brand':'w-1.5 bg-orange-200'}`}></button>)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TOP REVIEW ===================== */}
      <section className="hidden py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="space-y-3 mb-12 sr"><span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">Testimonials</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Top Reviews</h2></div>
        <div className="relative bg-slate-950 rounded-[2rem] p-10 sm:p-16 overflow-hidden sr-scale">
          <Quote className="absolute top-6 left-6 w-16 h-16 text-brand/10 fill-current hidden sm:block"/>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-brand/5 rounded-full blur-[80px]"></div>
          <div className="relative space-y-8">
            <div className="flex justify-center gap-1.5 text-brand">{[...Array(5)].map((_,i)=><Star key={i} className="w-7 h-7 fill-current"/>)}</div>
            <p className="font-serif text-2xl sm:text-4xl text-white leading-snug italic max-w-3xl mx-auto">"{topReview.quote}"</p>
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 max-w-xs mx-auto"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=85" alt="" className="w-16 h-16 rounded-full object-cover border-4 border-brand shadow-xl ring-4 ring-brand/20"/><div><h5 className="font-serif text-xl font-bold text-brand">James Anderson</h5><p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-0.5">Verified · Maldives Overwater Villa</p></div></div>
            <div className="flex items-center justify-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest"><span className="flex items-center gap-1 hover:text-brand cursor-pointer transition-colors"><ThumbsUp className="w-4 h-4"/>Helpful ({totalReviewCount.toLocaleString('en-IN')})</span><span className="flex items-center gap-1 hover:text-brand cursor-pointer transition-colors"><Share2 className="w-4 h-4"/>Share</span><span className="flex items-center gap-1 hover:text-brand cursor-pointer transition-colors"><MessageCircle className="w-4 h-4"/>{paidTourReviews.length}</span></div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="space-y-3 mb-12 sr"><span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">Testimonials</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Top Reviews</h2></div>
        <div className="relative bg-slate-950 rounded-[2rem] p-10 sm:p-16 overflow-hidden sr-scale">
          <Quote className="absolute top-6 left-6 w-16 h-16 text-brand/10 fill-current hidden sm:block"/>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-brand/5 rounded-full blur-[80px]"></div>
          <div className="relative space-y-8">
            <div className="flex justify-center gap-1.5 text-brand">{[...Array(5)].map((_,i)=><Star key={i} className="w-7 h-7 fill-current"/>)}</div>
            <p className="font-serif text-2xl sm:text-4xl text-white leading-snug italic max-w-3xl mx-auto">"{topReview.quote}"</p>
            <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 max-w-xs mx-auto"><img src={topReview.img} alt="" className="w-16 h-16 rounded-full object-cover border-4 border-brand shadow-xl ring-4 ring-brand/20"/><div><h5 className="font-serif text-xl font-bold text-brand">{topReview.name}</h5><p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-0.5">Verified - {topReview.tour}</p></div></div>
            <div className="flex items-center justify-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest"><span className="flex items-center gap-1 hover:text-brand cursor-pointer transition-colors"><ThumbsUp className="w-4 h-4"/>Helpful ({totalReviewCount.toLocaleString('en-IN')})</span><span className="flex items-center gap-1 hover:text-brand cursor-pointer transition-colors"><Share2 className="w-4 h-4"/>Share</span><span className="flex items-center gap-1 hover:text-brand cursor-pointer transition-colors"><MessageCircle className="w-4 h-4"/>{paidTourReviews.length}</span></div>
          </div>
        </div>
      </section>

      {/* ===================== GALLERY ===================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/50">
        <div className="max-w-7xl mx-auto"><div className="text-center max-w-2xl mx-auto space-y-3 mb-14 sr"><span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">travel inspiration</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Captured Moments</h2></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 stagger">
            {['https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80','https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80','https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80','https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80'].map((p,i)=>(
              <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all img-zoom"><img src={p} alt="" className="w-full h-full object-cover"/><div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/70 transition-all duration-500 flex items-center justify-center"><Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300"/></div></a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BLOG ===================== */}
      <section id="blog" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sr"><div className="space-y-3"><span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">latest stories</span><h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Travel Blog & Guides</h2></div><a href="#" className="inline-flex items-center space-x-2 px-5 py-3 bg-cream text-brand font-bold text-sm rounded-full hover:bg-brand hover:text-white transition-all border border-orange-200/50 group"><span>All Articles</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></a></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 stagger">
          {[
            { img: FEATURED_PAID_TOUR_CARDS[0]?.img ?? '/images/sundarbans_mangrove_premium.png', cat:'Travel Tips', date:'Jun 18, 2026', title:'How BEDUINE Voucher Credits Work on Paid Tours', read:'6 min' },
            { img: FEATURED_PAID_TOUR_CARDS[1]?.img ?? '/images/darjeeling_resort.png', cat:'Destinations', date:'Jun 12, 2026', title:'Choosing Between Sundarbans, Darjeeling, Puri and Kashmir', read:'8 min' },
            { img: FEATURED_PAID_TOUR_CARDS[4]?.img ?? '/images/dubai_skyline_1779539448313.png', cat:'International', date:'Jun 04, 2026', title:'Dubai and Thailand Starter Guide for BEDUINE Members', read:'5 min' }
          ].map((a,i)=>(
            <article key={i} className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg border border-orange-100/50 card-lift img-zoom">
              <div className="relative h-52 overflow-hidden"><img src={a.img} alt="" className="w-full h-full object-cover"/><span className="absolute top-4 left-4 glass-white text-brand font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow">{a.cat}</span></div>
              <div className="p-6 space-y-3"><div className="flex items-center justify-between text-xs text-slate-400 font-medium"><span>{a.date}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{a.read}</span></div><h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-brand transition-colors leading-snug">{a.title}</h3><span className="pt-1 text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ChevronRight className="w-3.5 h-3.5"/></span></div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 sr">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand via-orange-500 to-amber-500 rounded-[2rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl shadow-brand/20">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4 text-white"><span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-widest rounded-full border border-white/30">BEDUINE Members</span><h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-tight">Get Voucher Alerts Before Your Next Paid Tour</h2><p className="text-white/85 text-base font-medium max-w-md">Subscribe for BEDUINE package updates and active voucher reminders like <span className="font-black underline decoration-white/40">{voucherDisplay}</span>.</p></div>
            <div>
              {nlDone ? (
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-3"><div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-7 h-7"/></div><h3 className="font-serif text-2xl font-bold text-slate-900">You're In!</h3><p className="text-slate-500 text-sm">Check your inbox — $50 credit has been sent.</p></div>
              ) : (
                <form onSubmit={(e)=>{e.preventDefault();if(nlEmail.trim()){setNlDone(true);setNlEmail('');setTimeout(()=>setNlDone(false),5000);}}} className="bg-white p-2.5 rounded-full shadow-2xl flex items-center">
                  <div className="flex items-center flex-grow pl-5"><Mail className="w-5 h-5 text-brand mr-3 shrink-0"/><input type="email" required placeholder="Enter your email" value={nlEmail} onChange={(e)=>setNlEmail(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 py-3"/></div>
                  <button type="submit" className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 shrink-0 cursor-pointer group"><span>Subscribe</span><Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/></button>
                </form>
              )}
              <p className="text-white/70 text-xs mt-3 text-center font-medium">🔒 We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 sr">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-brand via-orange-500 to-amber-500 rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-brand/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none"><div className="absolute top-8 left-8 w-32 h-32 rounded-full border-2 border-white"></div><div className="absolute bottom-8 right-8 w-48 h-48 rounded-full border-2 border-white"></div></div>
          <div className="relative max-w-3xl mx-auto space-y-6">
            <span className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-widest"><Sparkles className="w-3.5 h-3.5"/>Limited — 7 Spots Left This Month</span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white leading-[1.08]">Ready for Your Next<br/><span className="underline decoration-white/30 decoration-4 underline-offset-8">Great Adventure?</span></h2>
            <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto">Apply active voucher <span className="font-mono bg-slate-950 text-amber-300 px-3 py-1.5 rounded-full font-bold">{voucherDisplay}</span> inside the booking portal.</p>
            <button onClick={()=>onStartBooking()} className="group relative overflow-hidden px-9 py-5 rounded-full bg-slate-950 text-amber-400 hover:text-white font-bold text-base transition-all hover:-translate-y-0.5 shadow-2xl inline-flex items-center justify-center gap-3 cursor-pointer"><span className="absolute inset-0 anim-shimmer"></span><Ticket className="w-5 h-5 relative group-hover:rotate-12 transition-transform"/><span className="relative">Book Paid Tour Portal</span><ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform"/></button>
          </div>
        </div>
      </section>


      {/* ===================== FOOTER ===================== */}
      <footer className="hidden bg-slate-950 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            <div className="space-y-4"><div className="flex items-center gap-2.5"><div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center"><Compass className="w-5 h-5"/></div><span className="font-serif text-lg font-bold">Travel <span className="text-brand-light">Agency</span></span></div><p className="text-slate-400 text-sm leading-relaxed">Curating extraordinary travel experiences since 2015.</p><div className="flex gap-0.5 text-brand">{[...Array(5)].map((_,i)=><Star key={i} className="w-4 h-4 fill-current"/>)}</div></div>
            {[{t:'Company',l:['About Us','Our Team','Careers','Press']},{t:'Explore',l:['All Tours','Destinations','Blog','Gallery']},{t:'Support',l:['Contact Us','FAQs','Cancellation','Privacy']}].map((col,i)=>(<div key={i}><h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white mb-5">{col.t}</h4><ul className="space-y-3">{col.l.map(l=><li key={l}><a href="#" className="text-sm text-slate-400 hover:text-brand transition-colors">{l}</a></li>)}</ul></div>))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500"><p>© 2026 Travel Agency. All rights reserved.</p><div className="flex items-center gap-4"><a href="#" className="hover:text-brand transition-colors">Terms</a><a href="#" className="hover:text-brand transition-colors">Privacy</a></div></div>
        </div>
      </footer>
    </div>
  );
};
