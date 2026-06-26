import { useState } from 'react';
import { Star, MapPin, BadgeCheck, Heart, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Reveal, KineticText } from './SubscriptionHelpers';

interface Review {
  name: string;
  location: string;
  plan: string;
  dest: string;
  duration: string;
  compliment: string;
  avatar: string;
  mainImg: string;
  gallery: string[];
  rating: number;
  date: string;
  likes: number;
  comments: number;
}

const REVIEWS_DATA: Review[] = [
  {
    name: 'Ananya Das',
    location: 'Kolkata',
    plan: 'Platinum Winner',
    dest: 'Heavenly Kashmir',
    duration: '5N/6D Premium Tour',
    compliment: 'A big compliment to Beduine for such flawless planning! They covered all flight costs, booked a royal houseboat on Dal Lake and a luxury resort in Gulmarg. The food was delicious, and the tour guide kept checking on us. We felt extremely safe and pampered!',
    avatar: '/images/winner_ananya_das.png',
    mainImg: '/images/kashmir_lake_review.png',
    gallery: [
      '/images/kashmir_resort.png',
      '/images/kashmir_valley.png'
    ],
    rating: 5,
    date: 'May 2026',
    likes: 48,
    comments: 6
  },
  {
    name: 'Rajesh Kumar',
    location: 'Durgapur',
    plan: 'Gold Winner',
    dest: 'Darjeeling Hills',
    duration: '3N/4D Classic Tour',
    compliment: 'I was skeptical about travel rewards, but Beduine proved me wrong. Our Darjeeling tour was arranged at a premium mountain view resort. The Himalayan toy train tickets were pre-booked, and the private cab driver was very polite. A wonderful experience overall!',
    avatar: '/images/winner_rajesh_kumar.png',
    mainImg: '/images/darjeeling_tea_review.png',
    gallery: [
      '/images/darjeeling_resort.png',
      '/images/darjeeling_hills.png'
    ],
    rating: 5,
    date: 'June 2026',
    likes: 32,
    comments: 4
  },
  {
    name: 'Priya Sen',
    location: 'Howrah',
    plan: 'Silver Winner',
    dest: 'Sundarbans Mangrove',
    duration: '2N/3D Jungle Safari',
    compliment: 'My Silver subscription of just ₹499 got me a fully planned 3-day luxury tour to Sundarban! The jungle safari, resort stay, and local guide service were outstanding. Highly recommend Beduine!',
    avatar: '/images/winner_priya_sen.png',
    mainImg: '/images/sundarbans_boat_review.png',
    gallery: [
      '/images/sundarbans_forest_card.png',
      '/images/sunderbans_forest.png'
    ],
    rating: 5,
    date: 'April 2026',
    likes: 29,
    comments: 2
  },
  {
    name: 'Arjun Roy',
    location: 'Kharagpur',
    plan: 'Platinum Winner',
    dest: 'Kerala Backwaters',
    duration: '4N/5D Luxury Tour',
    compliment: 'Beduine backwater tour was pure bliss. The luxury houseboat they booked was exceptionally clean and had a private chef who prepared fresh fish fry for us. The Munnar hill hotel was also breathtaking. Top marks for hospitality!',
    avatar: '/images/winner_arjun_roy.png',
    mainImg: '/images/kerala_houseboat_review.png',
    gallery: [
      '/images/happy_family_travelers.png',
      '/images/tropical_coast.png'
    ],
    rating: 5,
    date: 'June 2026',
    likes: 56,
    comments: 9
  }
];

export function WinnerReviews() {
  const [likesState, setLikesState] = useState<number[]>(REVIEWS_DATA.map(r => r.likes));
  const [likedIndices, setLikedIndices] = useState<number[]>([]);

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
    <section id="winner-reviews" className="relative py-14 lg:py-20 bg-cosmos/40 overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-950/15 blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-gold/5 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4">
              <div className="w-8 h-px bg-neon-gold" /> Member Diaries <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Winner Tour Diaries &" />
              <br />
              <span className="gold-shimmer">
                <KineticText text="Compliments Received" delay={0.3} />
              </span>
            </h2>
            <p className="mt-6 text-slate-300/80 text-lg leading-relaxed">
              Read real travel logs and photos uploaded by our travel reward winners after returning from their subscription-sponsored luxury tours.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {REVIEWS_DATA.map((review, index) => {
            const isLiked = likedIndices.includes(index);
            return (
              <Reveal key={review.name} delay={index * 0.1}>
                <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all duration-300 h-full flex flex-col justify-between p-6 shadow-xl group">
                  <div>
                    {/* Header: User Profile Info */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={review.avatar} 
                            alt={review.name} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-neon-gold shadow-md"
                            loading="lazy"
                          />
                          <span className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border border-slate-950 text-white" title="Verified Tour Winner">
                            <BadgeCheck className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <div>
                          <div className="font-display font-bold text-white text-base flex items-center gap-1.5">
                            {review.name}
                            <span className="text-[10px] text-slate-400 font-normal">({review.location})</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                            <span className="text-neon-gold">{review.plan}</span>
                            <span>•</span>
                            <span className="text-cyan">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {/* Rating Stars */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-neon-gold stroke-neon-gold" />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Arrangements Compliment
                        </span>
                      </div>
                    </div>

                    {/* Image Collage (Main + 2 Thumbnails) */}
                    <div className="grid grid-cols-3 gap-2.5 mb-5 rounded-2xl overflow-hidden">
                      {/* Main Image */}
                      <div className="col-span-2 h-44 overflow-hidden relative group/img bg-slate-950">
                        <img 
                          src={review.mainImg} 
                          alt={review.dest} 
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-1 text-white text-xs font-bold font-mono">
                          <MapPin className="w-3.5 h-3.5 text-cyan-deep" />
                          <span>{review.dest}</span>
                        </div>
                      </div>

                      {/* Side Gallery Thumbnails */}
                      <div className="flex flex-col gap-2.5 h-44">
                        {review.gallery.map((img, i) => (
                          <div key={i} className="h-[calc(50%-5px)] w-full overflow-hidden relative bg-slate-950 rounded-lg border border-slate-800/40">
                            <img 
                              src={img} 
                              alt={`Gallery ${i}`} 
                              className="w-full h-full object-cover opacity-85 hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Compliment Quote Box */}
                    <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 leading-relaxed text-sm text-slate-200 relative mb-5">
                      <span className="font-display font-semibold text-cyan text-xs tracking-wider block mb-1">
                        Verified Travel Log — {review.duration}
                      </span>
                      <p className="italic font-serif">
                        "{review.compliment}"
                      </p>
                    </div>
                  </div>

                  {/* Footer: Engagement Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleLike(index)}
                        className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-400 font-bold' : 'hover:text-white'}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400 stroke-red-400' : ''}`} />
                        <span>{likesState[index]} Likes</span>
                      </button>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        <span>{review.comments} Comments</span>
                      </div>
                    </div>
                    
                    <a 
                      href="#plans" 
                      className="flex items-center gap-1 text-cyan hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider"
                    >
                      View This Plan <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
