import React from 'react';
import {
  Star, ArrowRight, MapPin, Award,
  Compass, Heart, Calendar, ChevronRight
} from 'lucide-react';
import { averageRating, BEDUINE_BRAND, FEATURED_PAID_TOUR_CARDS, totalReviewCount } from '../../data/paidTourContent';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface AboutPageProps {
  onStartBooking: () => void;
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartBooking, onNavigate }) => {
  useScrollReveal();
  return (
    <div className="bg-white font-sans">

      {/* ===== HERO BANNER ===== */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=2000&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-6 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-amber-300 text-xs font-bold uppercase tracking-[0.25em] mb-6">
            About Us
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Established with a Passion<br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              for Exploration
            </span>
          </h1>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            {BEDUINE_BRAND.fullName} builds paid tour packages with member voucher support, pickup planning, traveler forms, and clear INR booking logic.
          </p>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full h-14 sm:h-20"><path d="M0 40C360 80 720 0 1080 40C1260 60 1380 50 1440 40V80H0V40Z" fill="white" /></svg>
        </div>
      </section>

      {/* ===== STATS COUNTER ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center stagger">
          {[
            { value: `${FEATURED_PAID_TOUR_CARDS.length}+`, label: 'Live Paid Packages', color: 'from-brand to-amber-500' },
            { value: totalReviewCount.toLocaleString('en-IN'), label: 'Verified Reviews', color: 'from-teal-500 to-emerald-500' },
            { value: '24/7', label: 'Customer Support', color: 'from-blue-500 to-indigo-500' },
            { value: averageRating.toFixed(1), label: 'Average Rating', color: 'from-rose-500 to-pink-500' }
          ].map((s, i) => (
            <div key={i} className="space-y-2 group">
              <h3 className="font-serif text-5xl sm:text-6xl font-bold text-slate-900">{s.value}</h3>
              <div className={`mx-auto w-12 h-1 rounded-full bg-gradient-to-r ${s.color} group-hover:w-20 transition-all duration-500`}></div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WE BELIEVE SECTION ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 sr">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">customized itineraries</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mt-3">
              We Believe That Travel is<br />a Personal Journey
            </h2>
            <p className="text-slate-600 text-base mt-4 max-w-2xl mx-auto leading-relaxed">
              Our team of seasoned travel experts brings years of experience and an in-depth understanding of the world's most captivating destinations. We believe that travel is a personal journey, and we strive to provide personalized service that reflects your unique tastes and interests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Photo Grid — 3 images stacked & overlapping */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden shadow-xl h-52 img-zoom">
                    <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="rounded-3xl overflow-hidden shadow-xl h-36 img-zoom">
                    <img src="https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=600&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-3xl overflow-hidden shadow-xl h-44 img-zoom">
                    <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
                  </div>
                  {/* Happy customers pill */}
                  <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 border border-orange-100/50">
                    <div className="flex -space-x-2">
                      {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80'].map((s, i) => (
                        <img key={i} src={s} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white" />
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{totalReviewCount.toLocaleString('en-IN')}+</p>
                      <p className="text-[10px] text-slate-500 font-medium">Verified Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Trek image + checklist */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* Big trek image */}
                <div className="rounded-3xl overflow-hidden shadow-xl h-80 img-zoom relative">
                  <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80" alt="Trek" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-white font-serif text-2xl font-bold drop-shadow-lg">Adventure Awaits</span>
                  </div>
                </div>
                {/* Checklist */}
                <div className="space-y-5">
                  {[
                    { icon: Compass, title: 'Adventurous Trek', desc: 'Expert-led mountain and wilderness treks across 6 continents.' },
                    { icon: Heart, title: 'Family-Friendly', desc: 'Curated tours safe and exciting for travelers of all ages.' },
                    { icon: Award, title: 'Expert Guides', desc: 'Certified native professionals with 10+ years of experience.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base group-hover:text-brand transition-colors">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4-IMAGE GALLERY ROW ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80'
          ].map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-lg h-56 sm:h-64 img-zoom group relative cursor-pointer">
              <img src={src} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/40 transition-all duration-500 flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WE MAKE TRAVEL ACCESSIBLE ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">About Us</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              We Make Travel<br />Accessible and Enjoyable
            </h2>
            <p className="text-slate-600 text-base leading-[1.8]">
              Our mission is to make travel accessible and enjoyable for all. That's why we pride ourselves on being budget-friendly, without compromising on quality or experience. Our partnerships with trusted local guides and accommodations ensure that you receive the best value wherever you go.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { val: `${FEATURED_PAID_TOUR_CARDS.length}+`, lbl: 'Active Packages' },
                { val: '5+', lbl: 'Pickup Regions' },
                { val: totalReviewCount.toLocaleString('en-IN'), lbl: 'Reviews Counted' },
                { val: `${averageRating.toFixed(1)}/5`, lbl: 'Average Rating' }
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100/50 text-center">
                  <p className="font-serif text-2xl font-bold text-brand">{s.val}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{s.lbl}</p>
                </div>
              ))}
            </div>
            <button onClick={onStartBooking} className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand to-amber-500 text-white font-bold text-sm rounded-full transition-all hover:-translate-y-0.5 shadow-xl shadow-brand/20 cursor-pointer">
              <span>Start Your Journey</span>
              <span className="w-6 h-6 rounded-full bg-white text-brand flex items-center justify-center group-hover:translate-x-1 transition-transform"><ArrowRight className="w-3.5 h-3.5" /></span>
            </button>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl h-[500px] img-zoom">
              <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=85" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 bg-white rounded-2xl shadow-2xl p-5 border border-orange-100/50 hidden md:block anim-float">
              <div className="flex gap-1 text-brand mb-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
              <p className="font-serif text-xl font-bold text-slate-900">Award Winning</p>
              <p className="text-xs text-slate-500">BEDUINE package support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING PACKAGES / DESTINATIONS YOU DON'T WANNA MISS ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">Trending Packages</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mt-3">Destinations You Don't Wanna Miss</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {FEATURED_PAID_TOUR_CARDS.slice(0, 3).map((d: any) => (
            <button key={d.id} onClick={() => onNavigate('packages')} className="group relative h-96 rounded-[2rem] overflow-hidden shadow-xl text-left cursor-pointer card-lift img-zoom">
              <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <h4 className="font-serif text-3xl font-bold text-white group-hover:text-amber-300 transition-colors">{d.name}</h4>
                <p className="text-sm text-slate-300 mt-1">{d.location}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{d.durationText}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ===== MEET THE BRAINS ===== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-brand">Our Team</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mt-3">Meet The Brains</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">The passionate people behind every unforgettable journey you take with us.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: 'Mike Jones', role: 'Co-Founder', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
              { name: 'Emma Taylor', role: 'Co-Founder', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80' },
              { name: 'Anna Hanna', role: 'Expert Guide', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80' }
            ].map((m, i) => (
              <div key={i} className="group text-center">
                <div className="relative rounded-[2rem] overflow-hidden h-80 shadow-xl img-zoom mb-6">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  {/* Hover overlay with social */}
                  <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/60 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex gap-3">
                      {['𝕏', 'in', 'f'].map((s, j) => (
                        <span key={j} className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-md text-white flex items-center justify-center font-bold text-sm hover:bg-white hover:text-brand transition-colors cursor-pointer">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-brand transition-colors">{m.name}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-brand via-orange-500 to-amber-500 rounded-[2rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-brand/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-6 left-6 w-28 h-28 rounded-full border-2 border-white"></div>
            <div className="absolute bottom-6 right-6 w-44 h-44 rounded-full border-2 border-white"></div>
          </div>
          <div className="relative space-y-5">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">Ready to Start Your Adventure?</h2>
            <p className="text-white/85 text-base max-w-xl mx-auto">Let us help you create the perfect journey. Our travel experts are ready to craft your dream vacation.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button onClick={onStartBooking} className="group px-8 py-4 rounded-full bg-slate-950 text-amber-400 hover:text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-2xl flex items-center gap-3 cursor-pointer relative overflow-hidden">
                <span className="absolute inset-0 anim-shimmer"></span>
                <Calendar className="w-5 h-5 relative" /><span className="relative">Book Paid Tour</span><ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('packages')} className="px-8 py-4 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/40 hover:border-white text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer">
                <span>View Packages</span><ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
