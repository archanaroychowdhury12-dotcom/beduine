import { Star, Quote, MapPin, BadgeCheck } from 'lucide-react';
import { Reveal, KineticText } from './SubscriptionHelpers';

interface Review {
  name: string;
  plan: string;
  dest: string;
  comment: string;
  img: string;
  destImg: string;
  rating: number;
  date: string;
}

const REVIEWS_DATA: Review[] = [
  {
    name: 'Ananya Das',
    plan: 'Platinum Member',
    dest: 'Kashmir Valley',
    comment: "I couldn't believe it when my name was drawn! Beduine arranged a flawless 5-day trip to Kashmir. The houseboat stay on Dal Lake and the snow resort in Gulmarg were absolutely magical. The planning was top-notch!",
    img: '/images/winner_ananya_das.png',
    destImg: '/images/kashmir_dal_lake_1779521728036.png',
    rating: 5,
    date: 'May 2026'
  },
  {
    name: 'Rajesh Kumar',
    plan: 'Gold Member',
    dest: 'Darjeeling Hills',
    comment: "Winning the Darjeeling tour was the highlight of our year! From the private cab to the beautiful tea garden resort, Beduine managed every detail perfectly. Riding the toy train with my family was unforgettable.",
    img: '/images/winner_rajesh_kumar.png',
    destImg: '/images/darjeeling_tea_1779521805614.png',
    rating: 5,
    date: 'June 2026'
  },
  {
    name: 'Priya Sen',
    plan: 'Silver Member',
    dest: 'Sundarbans Mangrove',
    comment: "My Silver subscription of just ₹499 got me a fully planned 3-day luxury tour to Sundarban! The jungle safari, resort stay, and local guide service were outstanding. Highly recommend Beduine!",
    img: '/images/winner_priya_sen.png',
    destImg: '/images/sundarbans_mangrove_1779521789593.png',
    rating: 5,
    date: 'April 2026'
  },
  {
    name: 'Arjun Roy',
    plan: 'Platinum Member',
    dest: 'Kerala Backwaters',
    comment: "An incredible experience in Kerala! The luxury houseboat stay and Munnar hill resort were dreamlike. The Beduine team was always in touch, ensuring our safety and comfort throughout the trip.",
    img: '/images/winner_arjun_roy.png',
    destImg: '/images/kerala_houseboat_1779521772928.png',
    rating: 5,
    date: 'June 2026'
  }
];

export function WinnerReviews() {
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
              <div className="w-8 h-px bg-neon-gold" /> Member Stories <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Winner Reviews &" />
              <br />
              <span className="gold-shimmer">
                <KineticText text="Travel Experiences" delay={0.3} />
              </span>
            </h2>
            <p className="mt-6 text-slate-300/80 text-lg leading-relaxed">
              Hear from our subscription members who won the lucky draw, embarked on their dream tours, and came back with lifetime memories.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS_DATA.map((review, index) => (
            <Reveal key={review.name} delay={index * 0.1}>
              <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all duration-300 h-full flex flex-col justify-between group shadow-xl">
                <div>
                  {/* Tour Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img 
                      src={review.destImg} 
                      alt={review.dest} 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[9px] font-black uppercase tracking-widest shadow-md">
                      {review.plan}
                    </div>

                    {/* Destination */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-1 text-white text-xs font-bold font-mono">
                      <MapPin className="w-3.5 h-3.5 text-cyan-deep" />
                      <span>{review.dest}</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="p-6 relative">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-800/40 pointer-events-none" />
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-neon-gold stroke-neon-gold" />
                      ))}
                    </div>

                    <p className="text-sm text-slate-300/90 leading-relaxed italic font-serif relative z-10">
                      "{review.comment}"
                    </p>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-800/40 mt-auto bg-slate-950/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img 
                        src={review.img} 
                        alt={review.name} 
                        className="w-9 h-9 rounded-full object-cover border border-neon-gold/50 shadow-md"
                        loading="lazy"
                      />
                      <div>
                        <div className="font-display font-bold text-ink text-sm leading-none">{review.name}</div>
                        <div className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold mt-1">Winner</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end text-[10px] text-ink/40 font-mono">
                      <span className="font-semibold text-emerald-400/80 flex items-center gap-0.5"><BadgeCheck className="w-3 h-3" /> Verified</span>
                      <span className="mt-0.5">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
