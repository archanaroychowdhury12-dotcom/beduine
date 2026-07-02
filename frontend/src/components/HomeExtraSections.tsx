import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Calendar, Users, ArrowRight, Plane, Hotel, Camera, Mountain,
  Utensils, Compass, Send, Mail, Quote, Clock, Tag, ChevronRight, Star,
  CheckCircle2, Globe, Smile, Briefcase, ChevronLeft, Image as GalleryIcon,
  Heart
} from 'lucide-react';

interface ExtraProps { onStartBooking: (tourId?: string) => void; }

/* ============ ANIMATED COUNTER HOOK ============ */
function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) { setStarted(true); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
}

/* ============ STATS COUNTER ============ */
export const StatsCounterSection: React.FC = () => {
  const s1 = useCountUp(10);
  const s2 = useCountUp(500);
  const s3 = useCountUp(12487);
  const s4 = useCountUp(98);

  const stats = [
    { ref: s1.ref, value: s1.count, suffix: '+', label: 'Years Experience', icon: Briefcase, color: 'from-orange-500 to-amber-500' },
    { ref: s2.ref, value: s2.count, suffix: '+', label: 'Destinations', icon: Globe, color: 'from-teal-500 to-emerald-500' },
    { ref: s3.ref, value: s3.count.toLocaleString(), suffix: '', label: 'Happy Travelers', icon: Smile, color: 'from-rose-500 to-pink-500' },
    { ref: s4.ref, value: s4.count, suffix: '%', label: 'Satisfaction Rate', icon: Heart, color: 'from-violet-500 to-purple-500' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E8590C 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {stats.map((s, i) => (
          <div key={i} ref={s.ref} className="text-center group">
            <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <s.icon className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight tabular-nums">
              {s.value}{s.suffix}
            </h3>
            <p className="text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============ PLAN YOUR TRIP — SEARCH BAR ============ */
export const PlanYourTripSection: React.FC<ExtraProps> = ({ onStartBooking }) => {
  const [destination, setDestination] = useState('');

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">plan your trip</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Find Your Perfect Getaway</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-orange-100/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <div className="flex items-center bg-cream rounded-xl px-4 py-4 border border-orange-100 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition-all">
                <MapPin className="w-5 h-5 text-brand mr-3 shrink-0" />
                <input type="text" placeholder="Where to?" value={destination} onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800 placeholder-slate-400" />
              </div>
            </div>
            <div className="flex items-center bg-cream rounded-xl px-4 py-4 border border-orange-100 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition-all">
              <Calendar className="w-5 h-5 text-brand mr-3 shrink-0" />
              <input type="date" className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800" />
            </div>
            <div className="flex items-center bg-cream rounded-xl px-4 py-4 border border-orange-100 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 transition-all">
              <Users className="w-5 h-5 text-brand mr-3 shrink-0" />
              <select className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800 cursor-pointer">
                <option>2 Adults</option><option>1 Adult</option><option>Family (2+2)</option><option>Group (4+)</option>
              </select>
            </div>
            <button onClick={() => onStartBooking()} className="px-6 py-4 bg-brand hover:bg-brand-dark text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-brand/20 hover:shadow-brand/40 flex items-center justify-center space-x-2 cursor-pointer group">
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Search</span>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-orange-100/50">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Popular:</span>
            {['Santorini', 'Swiss Alps', 'Kyoto', 'Maldives', 'Patagonia', 'Bali'].map((tag) => (
              <button key={tag} onClick={() => setDestination(tag)} className="px-3 py-1.5 rounded-full bg-cream hover:bg-brand hover:text-white text-brand text-xs font-bold transition-all border border-orange-200/50">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============ SPECIAL OFFERS ============ */
export const SpecialOffersSection: React.FC<ExtraProps> = ({ onStartBooking }) => {
  const offers = [
    { tag: 'EARLY BIRD', tagBg: 'bg-emerald-500', title: 'Santorini Caldera Cruise', desc: 'Book 60 days early and save $400 per couple on the ultimate Aegean catamaran tour.', discount: '25% OFF', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80', expires: '12 Days Left' },
    { tag: 'HONEYMOON', tagBg: 'bg-rose-500', title: 'Maldives Overwater Villa', desc: 'Complimentary candlelit dinner under the stars and private couples spa for honeymooners.', discount: 'COUPLE DEAL', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80', expires: '5 Days Left' },
    { tag: 'FAMILY', tagBg: 'bg-blue-500', title: 'Kyoto Imperial Experience', desc: 'Children under 12 travel completely free with two paying adults on all temple tours.', discount: 'KIDS FREE', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80', expires: '8 Days Left' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">limited time</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Special Travel Offers</h2>
        <p className="text-slate-500">Exclusive seasonal deals that stack with your voucher promo codes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {offers.map((o, i) => (
          <div key={i} onClick={() => onStartBooking()} className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-orange-100/50 cursor-pointer card-lift img-zoom">
            <div className="relative h-60 overflow-hidden">
              <img src={o.img} alt={o.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
              <span className={`absolute top-4 left-4 ${o.tagBg} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow`}>{o.tag}</span>
              <div className="absolute bottom-4 right-4 bg-brand text-white font-black text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />{o.discount}
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center text-xs font-bold text-rose-500"><Clock className="w-3.5 h-3.5 mr-1" />{o.expires}</div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-brand transition-colors">{o.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{o.desc}</p>
              <span className="pt-2 text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">Claim Offer <ArrowRight className="w-3.5 h-3.5" /></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============ SERVICES (DARK) ============ */
export const ServicesSection: React.FC<ExtraProps> = ({ onStartBooking }) => {
  const services = [
    { icon: Plane, title: 'Flight Booking', desc: 'First-class & business class air tickets to 500+ worldwide destinations.' },
    { icon: Hotel, title: 'Luxury Hotels', desc: 'Hand-picked 5-star partner hotels, ryokans, and award-winning eco-resorts.' },
    { icon: Camera, title: 'Photo Tours', desc: 'Photographer-led expeditions with golden hour scheduling and pro tutoring.' },
    { icon: Mountain, title: 'Adventure Hikes', desc: 'Certified alpine guides for Torres del Paine, Mt Fuji & Glacier Express.' },
    { icon: Utensils, title: 'Gourmet Dining', desc: 'Michelin-starred reservations, cooking classes and wine masterclasses.' },
    { icon: Compass, title: 'Private Concierge', desc: 'Dedicated 24/7 personal travel advisor for VIP perks & last-minute changes.' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand-light">our services</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">What We Offer For <span className="text-gradient-brand">Every Adventure</span></h2>
          </div>
          <p className="lg:col-span-5 text-slate-400 text-base leading-relaxed">From dreaming of a destination to returning home with lifelong memories — we handle every detail with absolute precision.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-slate-800/50 rounded-3xl overflow-hidden">
          {services.map((s, i) => (
            <div key={i} onClick={() => onStartBooking()} className="group p-9 bg-slate-950 hover:bg-brand transition-colors duration-500 cursor-pointer space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand/15 text-brand-light group-hover:bg-white group-hover:text-brand flex items-center justify-center transition-all duration-500">
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">{s.title}</h3>
              <p className="text-sm text-slate-400 group-hover:text-white/90 leading-relaxed transition-colors">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ TEAM GUIDES ============ */
export const TeamGuidesSection: React.FC = () => {
  const team = [
    { name: 'Sofia Martinez', role: 'Lead Archaeologist', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80', specialty: 'Aegean Islands', tours: 84 },
    { name: 'Hiroshi Tanaka', role: 'Cultural Guide', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80', specialty: 'Kyoto Heritage', tours: 127 },
    { name: 'Klaus Weber', role: 'Alpine Mountaineer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80', specialty: 'Swiss Alps', tours: 96 },
    { name: 'Isabella Cruz', role: 'Wilderness Expert', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80', specialty: 'Patagonia Treks', tours: 71 }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">meet the team</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Our Expert Travel Guides</h2>
        <p className="text-slate-500">Native local experts who transform every guided tour into an authentic lifelong memory.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((m, i) => (
          <div key={i} className="group text-center cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden mb-5 h-72 sm:h-80 img-zoom shadow-lg">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-light block">{m.tours} Tours Led</span>
                <span className="text-xs text-white font-medium">{m.specialty}</span>
              </div>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-brand transition-colors">{m.name}</h3>
            <p className="text-sm text-slate-500">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ============ TRAVEL GALLERY ============ */
export const TravelGallerySection: React.FC = () => {
  const photos = [
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80'
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">travel inspiration</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Captured Moments</h2>
          <p className="text-slate-500">Follow <span className="font-bold text-brand">@WanderWiseTours</span> for daily breathtaking shots.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {photos.map((p, i) => (
            <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all img-zoom">
              <img src={p} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/70 transition-all duration-500 flex items-center justify-center">
                <GalleryIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ BLOG ============ */
export const BlogSection: React.FC = () => {
  const articles = [
    { img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&auto=format&fit=crop&q=80', category: 'Travel Tips', date: 'Mar 18, 2026', title: '10 Things You Must Pack for a Glacier Express Tour', excerpt: 'Our seasoned guides reveal thermal layers, camera filters and essentials for your Swiss Alps expedition.', readTime: '6 min' },
    { img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop&q=80', category: 'Destinations', date: 'Mar 12, 2026', title: 'Hidden Gems in Santorini Most Tourists Never Discover', excerpt: 'Secret caldera viewpoints, family-owned wineries, and untouched volcanic beaches.', readTime: '8 min' },
    { img: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&auto=format&fit=crop&q=80', category: 'Cultural', date: 'Mar 04, 2026', title: 'Beginner\'s Guide to Japanese Tea Ceremonies', excerpt: 'Centuries-old etiquette, sacred Zen movements, and spiritual meaning behind every gesture.', readTime: '5 min' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div className="space-y-3">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">latest stories</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Travel Blog & Guides</h2>
        </div>
        <a href="#" className="inline-flex items-center space-x-2 px-5 py-3 bg-cream text-brand font-bold text-sm rounded-full hover:bg-brand hover:text-white transition-all border border-orange-200/50 group">
          <span>All Articles</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {articles.map((a, i) => (
          <article key={i} className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg border border-orange-100/50 card-lift img-zoom">
            <div className="relative h-52 overflow-hidden">
              <img src={a.img} alt={a.title} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 glass-white text-brand font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full shadow">{a.category}</span>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{a.date}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-brand transition-colors leading-snug">{a.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{a.excerpt}</p>
              <span className="pt-1 text-xs font-bold text-brand uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ChevronRight className="w-3.5 h-3.5" /></span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

/* ============ NEWSLETTER ============ */
export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand via-orange-500 to-amber-500 rounded-[2rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl shadow-brand/20">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-300/10 blur-3xl pointer-events-none"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-white">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white font-black text-xs uppercase tracking-widest rounded-full border border-white/30">Subscribers Club</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-tight">Get $50 Off Your First Paid Tour</h2>
            <p className="text-white/85 text-base font-medium max-w-md">Subscribe for insider deals, secret destinations, and a <span className="font-black underline decoration-white/40">$50 welcome credit</span> instantly.</p>
          </div>
          <div>
            {done ? (
              <div className="bg-white p-8 rounded-2xl shadow-xl text-center space-y-3 anim-reveal-scale">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle2 className="w-7 h-7" /></div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">You're In!</h3>
                <p className="text-slate-500 text-sm">Check your inbox — $50 credit has been sent.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) { setDone(true); setEmail(''); setTimeout(() => setDone(false), 5000); } }} className="bg-white p-2.5 rounded-full shadow-2xl flex items-center">
                <div className="flex items-center flex-grow pl-5">
                  <Mail className="w-5 h-5 text-brand mr-3 shrink-0" />
                  <input type="email" required placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent w-full focus:outline-none text-sm font-semibold text-slate-800 placeholder-slate-400 py-3" />
                </div>
                <button type="submit" className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider rounded-full transition-colors flex items-center space-x-2 shrink-0 cursor-pointer group">
                  <span>Subscribe</span><Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            )}
            <p className="text-white/70 text-xs mt-3 text-center font-medium">🔒 We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============ TRAVEL CATEGORIES ============ */
export const TravelCategoriesSection: React.FC<ExtraProps> = ({ onStartBooking }) => {
  const categories = [
    { name: 'Beach Escapes', count: 24, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80', gradient: 'from-blue-600/80 to-cyan-500/80' },
    { name: 'Mountain Treks', count: 18, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80', gradient: 'from-emerald-600/80 to-teal-500/80' },
    { name: 'City Adventures', count: 32, img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=80', gradient: 'from-violet-600/80 to-purple-500/80' },
    { name: 'Cultural Heritage', count: 15, img: 'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=600&auto=format&fit=crop&q=80', gradient: 'from-brand/80 to-amber-500/80' }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
        <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">travel categories</span>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Explore By Experience</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((c, i) => (
          <button key={i} onClick={() => onStartBooking()} className="group relative h-72 rounded-3xl overflow-hidden cursor-pointer text-left shadow-lg card-lift img-zoom">
            <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-6">
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest mb-1">{c.count} Tours</span>
              <h3 className="font-serif text-2xl font-bold text-white">{c.name}</h3>
              <span className="mt-2 flex items-center text-xs font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all">Explore <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

/* ============ TRUSTED BY ============ */
export const TrustedByLogosSection: React.FC = () => {
  const partners = [
    { name: 'Lonely Planet', emoji: '🌍' },
    { name: 'TripAdvisor', emoji: '🦉' },
    { name: 'National Geographic', emoji: '📸' },
    { name: 'Condé Nast', emoji: '✈️' },
    { name: 'Travel+Leisure', emoji: '🏝️' },
    { name: 'BBC Travel', emoji: '📺' }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-orange-100/50">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-8">As Featured In</p>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((p, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-cream transition-colors group cursor-pointer">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{p.emoji}</span>
              <span className="text-xs font-bold text-slate-500 group-hover:text-brand transition-colors text-center">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============ TESTIMONIAL CAROUSEL ============ */
export const TestimonialCarouselSection: React.FC = () => {
  const reviews = [
    { name: 'Emma Richardson', role: 'Travel Blogger', location: 'London, UK', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', quote: 'The Glacier Express journey was absolutely magical. Every itinerary detail was beyond anything I imagined. Service is genuinely impeccable.', tour: 'Swiss Alps Glacier Express', rating: 5 },
    { name: 'Carlos Mendoza', role: 'Photographer', location: 'Buenos Aires', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', quote: 'Patagonia trek was the most winner benefiting adventure of my life. The expert guides, the eco-domes, the wildlife — every moment was curated perfectly.', tour: 'Patagonia Fjord Trek', rating: 5 },
    { name: 'Ayaka Yamamoto', role: 'Tea Ceremony Master', location: 'Kyoto, Japan', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', quote: 'Despite living in Kyoto my entire life, this tour showed me hidden temples and secret ryokans I had never experienced. Truly exceptional.', tour: 'Kyoto Imperial Temples', rating: 5 }
  ];
  const [idx, setIdx] = useState(0);
  const r = reviews[idx];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">client stories</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Voices of Wanderers</h2>
        </div>
        <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-xl border border-orange-100/50 relative">
          <Quote className="absolute top-6 left-6 w-10 h-10 text-orange-200 fill-current hidden sm:block" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center" key={idx}>
            <div className="md:col-span-1 text-center anim-fade-in">
              <img src={r.img} alt={r.name} className="w-28 h-28 mx-auto rounded-full object-cover shadow-xl border-4 border-white ring-4 ring-orange-200/50" />
              <h4 className="font-serif text-lg font-bold text-slate-900 mt-4">{r.name}</h4>
              <p className="text-xs text-slate-500">{r.role} · {r.location}</p>
            </div>
            <div className="md:col-span-2 space-y-4 anim-slide-right">
              <div className="flex space-x-1 text-brand">{[...Array(r.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}</div>
              <p className="font-serif text-xl sm:text-2xl text-slate-800 leading-relaxed italic">"{r.quote}"</p>
              <div className="pt-3 border-t border-orange-100/50 flex items-center justify-between">
                <span className="text-xs font-bold text-brand uppercase tracking-wider">Tour: {r.tour}</span>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIdx((idx - 1 + reviews.length) % reviews.length)} className="w-9 h-9 rounded-full bg-cream hover:bg-brand text-brand hover:text-white flex items-center justify-center transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setIdx((idx + 1) % reviews.length)} className="w-9 h-9 rounded-full bg-brand text-white hover:bg-brand-dark flex items-center justify-center transition-colors shadow"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex space-x-1.5">{reviews.map((_, i) => <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-brand' : 'w-1.5 bg-orange-200'}`}></button>)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
