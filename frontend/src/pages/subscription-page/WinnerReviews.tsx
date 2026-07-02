import { useState, useEffect, useRef } from 'react';
import { Star, BadgeCheck, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Reveal, KineticText } from './SubscriptionHelpers';

interface Review {
  name: string;
  location: string;
  plan: string;
  dest: string;
  duration: string;
  text: string;
  avatar: string;
  rating: number;
  date: string;
  likes: number;
}

const REVIEWS_DATA: Review[] = [
  {
    name: 'Ananya Das',
    location: 'Kolkata',
    plan: 'Platinum Member',
    dest: 'Heavenly Kashmir',
    duration: '5N/6D Premium Tour',
    text: 'An absolute dream vacation! Beduine handled everything seamlessly from flights to a luxury houseboat on Dal Lake and a mountain resort in Gulmarg. Flawless planning and top-notch hospitality!',
    avatar: '/images/winner_ananya_das.png',
    rating: 5,
    date: 'May 2026',
    likes: 54
  },
  {
    name: 'Rajesh Kumar',
    location: 'Durgapur',
    plan: 'Gold Member',
    dest: 'Darjeeling Hills',
    duration: '3N/4D Family Getaway',
    text: 'Our Darjeeling tour was arranged at a beautiful mountain view resort. The private transport was extremely comfortable and the local guide showed us some amazing hidden viewpoints.',
    avatar: '/images/winner_rajesh_kumar.png',
    rating: 5,
    date: 'June 2026',
    likes: 42
  },
  {
    name: 'Priya Sen',
    location: 'Howrah',
    plan: 'Silver Member',
    dest: 'Sundarbans Mangrove',
    duration: '2N/3D Jungle Safari',
    text: 'Won a fully-sponsored safari through Beduine! The mangrove boat tour was thrilling, and the jungle resort stay was wonderful. A big shoutout to Beduine for this amazing program.',
    avatar: '/images/winner_priya_sen.png',
    rating: 5,
    date: 'April 2026',
    likes: 38
  },
  {
    name: 'Arjun Roy',
    location: 'Kharagpur',
    plan: 'Platinum Member',
    dest: 'Kerala Houseboat',
    duration: '4N/5D Backwaters Tour',
    text: 'Pure bliss on the backwaters. The private luxury houseboat was clean and the onboard chef prepared amazing local dishes. Truly a perfect and relaxing family trip!',
    avatar: '/images/winner_arjun_roy.png',
    rating: 5,
    date: 'June 2026',
    likes: 65
  },
  {
    name: 'Meera Bose',
    location: 'Siliguri',
    plan: 'Gold Member',
    dest: 'Royal Rajasthan',
    duration: '4N/5D Heritage Tour',
    text: 'Wonderful hospitality in Udaipur and Jaipur. The heritage palace hotel and city palace tour were spectacular. Excellent customer service from start to finish.',
    avatar: '/images/winner_meera_bose.png',
    rating: 5,
    date: 'May 2026',
    likes: 47
  },
  {
    name: 'Subhadeep Ghosh',
    location: 'Asansol',
    plan: 'Silver Member',
    dest: 'Sikkim Explorer',
    duration: '3N/4D Scenic Tour',
    text: 'Fabulous tour of Gangtok and Tsomgo lake. Beduine took care of all permits and transportation. We had a completely stress-free, safe, and memorable trip.',
    avatar: '/images/winner_subhadeep_ghosh.png',
    rating: 5,
    date: 'March 2026',
    likes: 31
  },
  {
    name: 'Amit Banerjee',
    location: 'Kolkata',
    plan: 'Gold Member',
    dest: 'Goa Beaches',
    duration: '3N/4D Leisure Tour',
    text: 'Beduine arranged a fantastic beach resort stay in South Goa. The flight bookings and airport pick-ups were perfectly coordinated. Highly recommend their travel plans!',
    avatar: '/images/winner_rajesh_kumar.png',
    rating: 5,
    date: 'April 2026',
    likes: 49
  },
  {
    name: 'Riya Chakraborty',
    location: 'Salt Lake',
    plan: 'Platinum Member',
    dest: 'Himachal Valleys',
    duration: '5N/6D Adventure Tour',
    text: 'Our Shimla-Manali package was outstanding. The hotels had amazing valley views, and the sightseeing itinerary was well-balanced. Will definitely subscribe again!',
    avatar: '/images/winner_priya_sen.png',
    rating: 5,
    date: 'June 2026',
    likes: 58
  }
];

/* ---------- CountUp Component ---------- */
function CountUp({ end, decimals = 0, duration = 1500, prefix = '', suffix = '' }: { end: number; decimals?: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(progress * end);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration]);

  const displayVal = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString('en-IN');

  return <span ref={elementRef}>{prefix}{displayVal}{suffix}</span>;
}

export function WinnerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [likesState, setLikesState] = useState<number[]>(REVIEWS_DATA.map(r => r.likes));
  const [likedIndices, setLikedIndices] = useState<number[]>([]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalReviews = REVIEWS_DATA.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, totalReviews - visibleCount);

  // Keep activeIndex within bounds if visibleCount changes
  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [visibleCount, maxIndex, activeIndex]);

  // Auto-sliding effect
  useEffect(() => {
    if (maxIndex === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, [activeIndex, maxIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Reset
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  const handleLike = (index: number) => {
    if (likedIndices.includes(index)) {
      setLikesState(prev => {
        const next = [...prev];
        next[index] -= 1;
        return next;
      });
      setLikedIndices(prev => prev.filter(i => i !== index));
    } else {
      setLikesState(prev => {
        const next = [...prev];
        next[index] += 1;
        return next;
      });
      setLikedIndices(prev => [...prev, index]);
    }
  };

  return (
    <section id="reviews" className="relative py-14 lg:py-20 bg-cosmos/40 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-950/15 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-gold/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4">
              <div className="w-8 h-px bg-neon-gold" /> Member Diaries <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Member Travel Diaries &" />
              <br />
              <span className="gold-shimmer">
                <KineticText text="Reviews of Beduine Club" delay={0.3} />
              </span>
            </h2>
            <p className="mt-5 text-slate-300/80 text-base lg:text-lg leading-relaxed">
              Read real travel experiences and reviews shared by our subscription members and travel reward winners after returning from their luxury tours.
            </p>
          </div>
        </Reveal>

        {/* Statistics Summary Bar */}
        <Reveal delay={0.2}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 max-w-5xl mx-auto text-center">
            <div className="glass p-5 rounded-2xl border border-slate-line/60 flex flex-col justify-center items-center shadow-lg group hover:border-neon-gold/50 transition-all duration-300">
              <span className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-1">
                ⭐ <CountUp end={4.9} decimals={1} suffix="/5" />
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Average Rating</span>
            </div>
            <div className="glass p-5 rounded-2xl border border-slate-line/60 flex flex-col justify-center items-center shadow-lg group hover:border-neon-gold/50 transition-all duration-300">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                <CountUp end={2500} suffix="+" />
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Happy Members</span>
            </div>
            <div className="glass p-5 rounded-2xl border border-slate-line/60 flex flex-col justify-center items-center shadow-lg group hover:border-neon-gold/50 transition-all duration-300">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                <CountUp end={1200} suffix="+" />
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Tours Completed</span>
            </div>
            <div className="glass p-5 rounded-2xl border border-slate-line/60 flex flex-col justify-center items-center shadow-lg group hover:border-neon-gold/50 transition-all duration-300">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                <CountUp end={98} suffix="%" />
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Satisfaction Rate</span>
            </div>
          </div>
        </Reveal>

        {/* Carousel Slider */}
        <Reveal delay={0.3}>
          <div className="relative max-w-6xl mx-auto">
            {/* Sliding Window */}
            <div
              className="relative overflow-hidden w-full py-4 cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{
                  transform: `translateX(calc(-${activeIndex} * (100% + 24px) / ${visibleCount}))`
                }}
              >
                {REVIEWS_DATA.map((review, index) => {
                  const isLiked = likedIndices.includes(index);
                  return (
                    <div
                      key={index}
                      className="shrink-0"
                      style={{
                        width: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})`
                      }}
                    >
                      {/* Google-style Premium Review Card */}
                      <div className="glass p-6 rounded-3xl border border-slate-line hover:neon-border-gold transition-all duration-300 shadow-xl flex flex-col justify-between h-[360px] md:h-[340px] lg:h-[320px] select-none group">
                        <div>
                          {/* Profile Header */}
                          <div className="flex items-center gap-3.5 mb-4">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-700 shadow-md shrink-0"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <h4 className="font-display font-bold text-white text-base truncate flex items-center gap-1.5">
                                {review.name}
                                <span className="text-[10px] text-slate-400 font-normal">({review.location})</span>
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <BadgeCheck className="w-3 h-3 text-emerald-400 fill-current" /> Verified Customer
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium">• {review.date}</span>
                              </div>
                            </div>
                          </div>

                          {/* Rating stars & review destination */}
                          <div className="flex items-center justify-between gap-2 mb-3.5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-neon-gold stroke-neon-gold" />
                              ))}
                            </div>
                            <span className="text-[10px] font-mono font-bold tracking-wider text-cyan uppercase bg-cyan-950/20 px-2 py-0.5 rounded-md border border-cyan-900/25">
                              {review.dest}
                            </span>
                          </div>

                          {/* Review text */}
                          <p className="text-slate-200/90 text-sm leading-relaxed font-serif italic mb-4 line-clamp-4 group-hover:text-white transition-colors">
                            "{review.text}"
                          </p>
                        </div>

                        {/* Review footer info & engagement */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/40 text-[10px] font-mono text-slate-400">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLike(index); }}
                            className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-400 font-bold' : 'hover:text-white'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400 stroke-red-400' : ''}`} />
                            <span>{likesState[index]} Likes</span>
                          </button>
                          <span>Plan: <strong className="text-neon-gold">{review.plan}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Navigation & Pagination */}
            <div className="flex items-center justify-between mt-8 px-4">
              {/* Pagination Dots */}
              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeIndex ? 'w-8 bg-neon-gold' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-slate-line bg-slate-950/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-slate-line bg-slate-950/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
