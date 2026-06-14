import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView, useTransform } from 'framer-motion';
import {
  Compass, Sparkles, Gift, CreditCard, Award, ShieldCheck,
  ChevronRight, CheckCircle2, Check, Star,
  Phone, Calendar, MapPin, Hotel, Train, Plane,
  FileCheck2, Banknote, ArrowRight, Menu, X, MessageCircle,
  Download, Lock, Eye, TrendingUp, Crown,
  Video, Camera, Send, Tv, Share2, FileText,
  BadgeCheck, Zap, Bot, Fingerprint, Scan,
  Heart, Globe, Rocket, Wallet, Shield, HeartHandshake
} from 'lucide-react';
import ScatteredShowcase from './ScatteredShowcase';
import RegistrationPage from './RegistrationPage';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';





/* ---------- Data ---------- */
const NAV = [
  { id: 'about', label: 'About' },
  { id: 'how', label: 'How It Works' },
  { id: 'plans', label: 'Plans' },
  { id: 'intl-plans', label: 'International' },
  { id: 'luckydraw', label: 'Lucky Draw' },
  { id: 'credits', label: 'Credits' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const DESKTOP_NAV = [
  { id: 'about', label: 'About' },
  { id: 'plans', label: 'Plans' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'contact', label: 'Contact' },
];

const PLANS = [
  {
    name: 'Silver', price: 499, tagline: 'Smart Starter', icon: Star,
    color: 'from-slate-500 to-slate-700', glow: 'slate',
    tourValue: 3000, duration: '2N / 3D', discountCredits: 1, discountValue: 500,
    paidDiscount: 'Member rate', insurance: 'Payable', nameChange: 'Not available',
    image: '/images/sundarbans_mangrove_1779521789593.png',
    imageLabel: 'Sundarbans - Boat Safari',
    destinations: ['Sundarban', 'Digha', 'Mousuni Island', 'Purulia'],
    benefits: ['1 Weekly Promotional Draw entry', 'Eligible for promotional winner benefits', '₹500 discount credit if not selected', 'Member-only rates on paid tours', '12-month subscription validity', '18+ Membership Only'],
  },
  {
    name: 'Gold', price: 799, tagline: 'Balanced Choice', icon: Award,
    color: 'from-teal-400 to-emerald-600', glow: 'teal',
    tourValue: 5000, duration: '2N / 3D', discountCredits: 2, discountValue: 1000,
    paidDiscount: 'Member rate', insurance: '50% off', nameChange: 'One time',
    image: '/images/darjeeling_tea_1779521805614.png',
    imageLabel: 'Darjeeling - Tea Gardens',
    destinations: ['Darjeeling', 'Dooars', 'Puri', 'Daring Bari'],
    benefits: ['1 Weekly Promotional Draw entry', 'Eligible for promotional winner benefits', '₹1,000 discount credits if not selected', 'Member-only rates on paid tours', 'One-time family name change allowed', '18+ Membership Only'],
  },
  {
    name: 'Platinum', price: 1499, tagline: 'Premium Experience', icon: Crown,
    color: 'from-neon-gold via-gold to-gold-deep', glow: 'gold',
    featured: true, tourValue: 10000, duration: '3N / 4D',
    discountCredits: 4, discountValue: 2000,
    paidDiscount: 'Member rate',
    insurance: 'Included free',
    nameChange: 'Two times',
    image: '/images/kashmir_dal_lake_1779521728036.png',
    imageLabel: 'Kashmir - Dal Lake',
    destinations: ['Kashmir', 'Goa', 'Sikkim', 'Himachal (Shimla+Manali)'],
    benefits: [
      '1 Weekly Promotional Draw entry',
      'Eligible for promotional winner benefits',
      '₹2,000 discount credits if not selected',
      'Member-only rates on paid tours',
      'Two family name changes allowed',
      '18+ Membership Only'
    ],
  },
];

const INTL_PLANS = [
  {
    name: 'Silver', price: 4999, tagline: 'International Starter', icon: Globe,
    color: 'from-sky-400 to-blue-600', glow: 'blue',
    tourValue: 25000, duration: '3N / 4D', discountCredits: 5, discountValue: 2500,
    paidDiscount: 'Up to 5% off', insurance: '50% off', nameChange: 'One time',
    image: '/images/nepal.png',
    imageLabel: 'Nepal - Valley & Peaks',
    destinations: ['Nepal', 'Bhutan'],
    benefits: ['1 Monthly Promotional Draw entry', 'Winner tour value up to ₹25,000 (3N/4D)', '₹2,500 discount credits if not selected', 'Up to 5% off on paid international tours', 'One-time family name change allowed', '18+ Membership Only'],
  },
  {
    name: 'Gold', price: 7999, tagline: 'Premium Explorer', icon: Plane,
    color: 'from-emerald-400 to-teal-600', glow: 'teal',
    featured: true, tourValue: 50000, duration: '4N / 5D', discountCredits: 8, discountValue: 4000,
    paidDiscount: 'Up to 7% off', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/thailand.png',
    imageLabel: 'Thailand - Temples & Beaches',
    destinations: ['Thailand', 'Bali (Indonesia)'],
    benefits: ['1 Monthly Promotional Draw entry', 'Winner tour value up to ₹50,000 (4N/5D)', '₹4,000 discount credits if not selected', 'Up to 7% off on paid international tours', 'Two family name changes allowed', '18+ Membership Only'],
  },
  {
    name: 'Platinum', price: 14999, tagline: 'Ultimate World Pass', icon: Rocket,
    color: 'from-cyan via-cyan-bright to-cyan-deep', glow: 'cyan',
    tourValue: 100000, duration: '5N / 6D', discountCredits: 15, discountValue: 7500,
    paidDiscount: 'Up to 10% off', insurance: 'Included free', nameChange: 'Unlimited',
    image: '/images/vietnam.png',
    imageLabel: 'Vietnam - Bays & Cities',
    destinations: ['Dubai', 'Vietnam'],
    benefits: ['1 Monthly Promotional Draw entry', 'Winner tour value up to ₹1,00,000 (5N/6D)', '₹7,500 discount credits if not selected', 'Up to 10% off on paid international tours', 'Unlimited name changes allowed', '18+ Membership Only'],
  },
];

const SERVICES = [
  { icon: Compass, title: 'Customized Tour Packages', desc: 'AI-curated itineraries built around your pace, interests, and travel style.', image: '/images/service_tours.png' },
  { icon: Hotel, title: 'Hotel Booking', desc: 'Curated stays from boutique hideaways to five-star retreats, worldwide.', image: '/images/service_hotels.png' },
  { icon: Train, title: 'Train Ticket Booking', desc: 'Seamless IRCTC reservations with confirmed berths and instant PNR updates.', image: '/images/service_trains.png' },
  { icon: Plane, title: 'Flight Ticket Booking', desc: 'Best fares across domestic and international carriers with flexible options.', image: '/images/service_flights.png' },
  { icon: FileCheck2, title: 'Visa Application', desc: 'End-to-end documentation, interview prep, and embassy coordination.', image: '/images/service_visas.png' },
  { icon: Banknote, title: 'Currency Exchange', desc: 'Competitive forex rates with doorstep delivery and zero hidden fees.', image: '/images/service_currency.png' },
];

const AUDIT_REPORTS = [
  { week: 'Week 42 - 2026', status: 'Published', date: '19 Oct 2026' },
  { week: 'Week 41 - 2026', status: 'Published', date: '12 Oct 2026' },
  { week: 'Week 40 - 2026', status: 'Published', date: '05 Oct 2026' },
  { week: 'Week 39 - 2026', status: 'Published', date: '28 Sep 2026' },
];

const DESTINATIONS = [
  // Weekend Escapes
  { name: 'Sundarbans', tag: 'Tiger Reserve - Mangrove Boats', duration: '2N/3D', rating: 4.7, season: 'Oct - Mar', img: '/images/sundarbans_mangrove_premium.png', category: 'escapes', planBadge: 'Silver+' },
  { name: 'Bakkhali Beach', tag: 'Casuarina Shore - Delta Sunset', duration: '1N/2D', rating: 4.6, season: 'Oct - Apr', img: '/images/bakkhali_beach_premium.png', category: 'escapes', planBadge: 'Silver+' },
  { name: 'Mousuni Island', tag: 'Seaside Camp - Huts & Palms', duration: '1N/2D', rating: 4.5, season: 'Nov - Mar', img: '/images/mousuni_island_premium.png', category: 'escapes', planBadge: 'Silver+' },
  { name: 'Mukutmanipur', tag: 'Hills, Forests & Kangsabati Dam', duration: '1N/2D', rating: 4.5, season: 'Oct - Mar', img: '/images/mukutmanipur_premium.png', category: 'escapes', planBadge: 'Silver+' },

  // Hill & Tea Trails
  { name: 'Darjeeling', tag: 'Tiger Hill Sunrise - Tea Estates', duration: '3N/4D', rating: 4.8, season: 'Mar - Jun', img: '/images/darjeeling_tea_1779521805614.png', category: 'trails', planBadge: 'Gold+' },
  { name: 'Dooars Safari', tag: 'Forest Huts - River Wilds', duration: '2N/3D', rating: 4.6, season: 'Sep - Apr', img: '/images/dooars_safari.png', category: 'trails', planBadge: 'Gold+' },
  { name: 'Shimla & Manali', tag: 'Mall Road - Solang Valley Adventure', duration: '5N/6D', rating: 4.9, season: 'Oct - May', img: '/images/himachal_hills.png', category: 'trails', planBadge: 'Platinum+' },
  { name: 'Kashmir', tag: 'Paradise on Earth - Dal Lake & Houseboats', duration: '4N/5D', rating: 4.9, season: 'Apr - Oct', img: '/images/kashmir_dal_lake_1779521728036.png', category: 'trails', planBadge: 'Platinum+' },
  { name: 'Vizag & Araku', tag: 'Araku Coffee Gardens & Borra Caves', duration: '3N/4D', rating: 4.7, season: 'Oct - Mar', img: '/images/vizag_araku.png', category: 'trails', planBadge: 'Gold+' },

  // Royal India Tours
  { name: 'Rajasthan Royal', tag: 'Jaipur - Udaipur - Desert Dunes', duration: '5N/6D', rating: 4.8, season: 'Oct - Mar', img: '/images/rajasthan_palace_1779521744228.png', category: 'royal', planBadge: 'Gold+' },
  { name: 'Kerala Backwaters', tag: 'Houseboats - Munnar Hills', duration: '4N/5D', rating: 4.9, season: 'Sep - Mar', img: '/images/kerala_houseboat_1779521772928.png', category: 'royal', planBadge: 'Gold+' },
  { name: 'Puri & Konark', tag: 'Sun Temple - Golden Beach', duration: '3N/4D', rating: 4.7, season: 'Oct - Mar', img: '/images/puri_konark.png', category: 'royal', planBadge: 'Silver+' },
  { name: 'Goa', tag: 'Sun-kissed Beaches - Heritage & Nightlife', duration: '3N/4D', rating: 4.8, season: 'Oct - May', img: '/images/goa_beaches.png', category: 'royal', planBadge: 'Gold+' },

  // Premium International Trips
  { name: 'Dubai', tag: 'Burj Khalifa - Desert Safaris', duration: '4N/5D', rating: 4.9, season: 'Nov - Mar', img: '/images/dubai_skyline_1779539448313.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Singapore', tag: 'Sentosa - Gardens by the Bay', duration: '4N/5D', rating: 4.8, season: 'Year-round', img: '/images/singapore_skyline_1779539502293.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Maldives', tag: 'Overwater Bungalows - Reefs', duration: '4N/5D', rating: 4.9, season: 'Nov - Apr', img: '/images/maldives_overwater_1779539482305.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Thailand', tag: 'Bangkok Temples & Pattaya Beaches', duration: '4N/5D', rating: 4.7, season: 'Nov - Apr', img: '/images/thailand.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Sri Lanka', tag: 'Sigiriya Rock Fortress & Kandy Hills', duration: '4N/5D', rating: 4.6, season: 'Dec - Apr', img: '/images/sri_lanka.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Nepal', tag: 'Kathmandu Valley & Himalayan Pokhara', duration: '3N/4D', rating: 4.7, season: 'Sep - Nov', img: '/images/nepal.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Malaysia', tag: 'Kuala Lumpur Skyline & Langkawi', duration: '4N/5D', rating: 4.7, season: 'Year-round', img: '/images/malaysia.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Bali', tag: 'Ubud Rice Terraces & Uluwatu Temple', duration: '4N/5D', rating: 4.9, season: 'Apr - Oct', img: '/images/bali.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Vietnam', tag: 'Halong Bay Cruise & Hanoi Old Quarter', duration: '5N/6D', rating: 4.8, season: 'Nov - Apr', img: '/images/vietnam.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Europe', tag: 'Paris Eiffel Tower & Swiss Alps', duration: '7N/8D', rating: 4.9, season: 'May - Sep', img: '/images/europe.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Turkey', tag: 'Cappadocia Balloons & Pamukkale Pools', duration: '5N/6D', rating: 4.8, season: 'Apr - Oct', img: '/images/turkey.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Japan', tag: 'Tokyo Neon & Kyoto Cherry Blossoms', duration: '6N/7D', rating: 4.9, season: 'Mar - May', img: '/images/japan.png', category: 'intl', planBadge: 'Platinum+' },
];

const WINNERS_DATA = [
  { name: 'Ananya Das', plan: 'Platinum', dest: 'Kashmir', week: 'Week 42', img: '/images/winner_ananya_das.png', destImg: '/images/kashmir_dal_lake_1779521728036.png' },
  { name: 'Rajesh Kumar', plan: 'Gold', dest: 'Darjeeling', week: 'Week 41', img: '/images/winner_rajesh_kumar.png', destImg: '/images/darjeeling_tea_1779521805614.png' },
  { name: 'Priya Sen', plan: 'Silver', dest: 'Sundarbans', week: 'Week 40', img: '/images/winner_priya_sen.png', destImg: '/images/sundarbans_mangrove_1779521789593.png' },
  { name: 'Arjun Roy', plan: 'Platinum', dest: 'Kerala', week: 'Week 39', img: '/images/winner_arjun_roy.png', destImg: '/images/kerala_houseboat_1779521772928.png' },
  { name: 'Meera Bose', plan: 'Gold', dest: 'Rajasthan', week: 'Week 38', img: '/images/winner_meera_bose.png', destImg: '/images/rajasthan_palace_1779521744228.png' },
  { name: 'Subhadeep Ghosh', plan: 'Platinum', dest: 'Himachal', week: 'Week 37', img: '/images/winner_subhadeep_ghosh.png', destImg: '/images/himachal_hills.png' },
];

const JOURNEY_IMAGES = [
  { src: '/images/happy_family_travelers.png', label: 'Happy Families', desc: 'Crafting lifetime memories', badge: 'Silver+', theme: 'cyan' },
  { src: '/images/rajasthan_palace_1779521744228.png', label: 'Royal Rajasthan', desc: 'Golden sands & majestic palaces', badge: 'Gold+', theme: 'gold' },
  { src: '/images/kerala_houseboat_1779521772928.png', label: 'Kerala Backwaters', desc: 'Serene houseboats & palms', badge: 'Silver+', theme: 'cyan' },
  { src: '/images/sundarbans_mangrove_1779521789593.png', label: 'Sundarbans Safari', desc: 'Mysterious mangrove boat trails', badge: 'Silver+', theme: 'gold' },
  { src: '/images/kashmir_dal_lake_1779521728036.png', label: 'Heavenly Kashmir', desc: 'Misty peaks & shikara rides', badge: 'Platinum+', theme: 'cyan' }
];

/* ---------- Helpers ---------- */
function Reveal({ children, delay = 0, y = 80 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale: 0.94, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ScrollRoundedSection({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [radiusValue, setRadiusValue] = useState("90px");

  useEffect(() => {
    const handleResize = () => {
      setRadiusValue(window.innerWidth < 768 ? "32px" : "90px");
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const borderTopLeftRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], [radiusValue, "0px", "0px", "0px"]);
  const borderTopRightRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], [radiusValue, "0px", "0px", "0px"]);
  const borderBottomLeftRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], ["0px", "0px", "0px", radiusValue]);
  const borderBottomRightRadius = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], ["0px", "0px", "0px", radiusValue]);

  const scale = useTransform(scrollYProgress, [0, 0.18, 0.82, 1.0], [0.95, 1.0, 1.0, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1.0], [0.65, 1.0, 1.0, 0.65]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
        scale,
        opacity,
        overflow: 'hidden',
        transformOrigin: 'center center'
      }}
      className="relative z-10 w-full"
    >
      {children}
    </motion.div>
  );
}


function SubSectionBadge({ text, theme = 'cyan' }: { text: string; theme?: 'cyan' | 'gold' }) {
  const dotColor = theme === 'cyan' ? 'bg-[#00F5D4]' : 'bg-[#FBBF24]';
  const textColor = theme === 'cyan' ? 'text-[#00F5D4]' : 'text-amber-400';
  const slashColor = theme === 'cyan' ? 'text-[#00F5D4]' : 'text-amber-400';

  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 border border-white/10 text-[10px] sm:text-[11px] font-mono font-bold tracking-widest ${textColor} backdrop-blur-md shadow-lg`}>
      <span className={`${dotColor} w-1.5 h-1.5 rounded-full animate-pulse`} />
      <span className={slashColor}>//</span> {text}
    </div>
  );
}

function GoldCheck({ size = 18, variant = 'gold', className = '' }: { size?: number; variant?: 'gold' | 'cyan'; className?: string }) {
  const checkClass = variant === 'cyan' ? 'cyan-check' : 'gold-check';
  return (
    <span className={`inline-flex items-center justify-center rounded-full ${checkClass} shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Check className="text-cosmos" style={{ width: size * 0.6, height: size * 0.6 }} strokeWidth={3.5} />
    </span>
  );
}

function FloatingIcon({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div className="relative" initial={{ y: 0 }} animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}>
      {children}
    </motion.div>
  );
}

/* ---------- Star Field ---------- */
function StarField({ count = 80 }: { count?: number }) {
  const stars = useMemo(() => Array.from({ length: count }).map(() => ({
    top: Math.random() * 100, left: Math.random() * 100,
    delay: Math.random() * 3, size: Math.random() * 1.5 + 0.5,
  })), [count]);
  return (
    <div className="star-field">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ top: `${s.top}%`, left: `${s.left}%`, width: `${s.size}px`, height: `${s.size}px`, animationDelay: `${s.delay}s` }} />
      ))}
    </div>
  );
}

function KineticText({ text, className = '', delay = 0, mode = 'char' }: { text: string; className?: string; delay?: number; mode?: 'word' | 'char' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  if (mode === 'char') {
    let charIndex = 0;
    return (
      <span ref={ref} className={className}>
        {text.split(' ').map((word, wi) => (
          <span key={wi} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {word.split('').map((char) => {
              const ci = charIndex++;
              return (
                <span key={ci} className="kinetic-char-mask">
                  <span
                    className="kinetic-char"
                    style={{
                      animationDelay: `${delay + ci * 0.03}s`,
                      animationPlayState: inView ? 'running' : 'paused',
                      opacity: inView ? undefined : 0,
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
            {wi < text.split(' ').length - 1 && <span style={{ display: 'inline-block', width: '0.25em' }} />}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="kinetic-mask">
          <span className="kinetic-word inline-block mr-[0.25em]" style={{ animationDelay: `${delay + wi * 0.08}s`, animationPlayState: inView ? 'running' : 'paused', opacity: inView ? undefined : 0 }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

/* Particle Burst Button */
function ParticleButton({ children, onClick, variant = 'gold', className = '', ...rest }: any) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
  const btnRef = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const newParticles = Array.from({ length: 16 }).map((_, i) => ({
        id: Date.now() + i, x: e.clientX - rect.left, y: e.clientY - rect.top,
        angle: (i / 16) * Math.PI * 2 + Math.random() * 0.4,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 900);
    }
    onClick?.(e);
  };
  const btnClass = variant === 'gold' ? 'glow-cta' : variant === 'teal' ? 'glow-cta-teal' : 'glow-cta-cyan';
  return (
    <button ref={btnRef} data-magnetic onClick={handleClick} className={`relative overflow-visible ${btnClass} ${className}`} {...rest}>
      {children}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span key={p.id} className="particle-burst"
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
            animate={{ x: p.x + Math.cos(p.angle) * (60 + Math.random() * 30), y: p.y + Math.sin(p.angle) * (60 + Math.random() * 30), opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
        ))}
      </AnimatePresence>
    </button>
  );
}

function TiltCard({ children, className = '', intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current!;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotY = ((x - cx) / cx) * intensity;
    const rotX = -((y - cy) / cy) * intensity;
    setStyle({ transform: `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)` });
  };
  const onLeave = () => setStyle({ transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' });
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-card ${className}`} style={style}>{children}</div>;
}

/* Custom Cursor */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip all cursor effects on touch/mobile devices to save CPU and battery
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100, magnetX = 0, magnetY = 0, hovering = false;
    let prevX = -100, prevY = -100;
    let currentAngle = 45;
    
    // Scale parameters for speed-dependent stretch
    let targetScaleX = 1, targetScaleY = 1;
    let currentScaleX = 1, currentScaleY = 1;
    
    // Trail tracking
    const trailPositions = Array.from({ length: 30 }, () => ({ x: -100, y: -100 }));
    
    // Click sparks tracking
    interface SparkData {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      active: boolean;
    }
    const sparkData: SparkData[] = Array.from({ length: 8 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, alpha: 0, active: false
    }));

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      let velocity = Math.sqrt(dx * dx + dy * dy);
      
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI + 90;
        currentAngle = angleDeg;
        prevX = mouseX;
        prevY = mouseY;
        
        // Stretch plane forward based on velocity
        const speedScale = Math.min(velocity * 0.035, 0.25);
        targetScaleX = 1 - speedScale * 0.45;
        targetScaleY = 1 + speedScale * 0.75;
      } else {
        targetScaleX = 1;
        targetScaleY = 1;
      }
      
      const target = e.target as HTMLElement | null;
      const magnet = (target && typeof target.closest === 'function') ? target.closest('[data-magnetic]') : null;
      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        magnetX = (rect.left + rect.width / 2 - mouseX) * 0.25;
        magnetY = (rect.top + rect.height / 2 - mouseY) * 0.25;
        if (!hovering) { document.body.classList.add('cursor-hover'); hovering = true; }
      } else {
        magnetX *= 0.85; magnetY *= 0.85;
        if (hovering) { document.body.classList.remove('cursor-hover'); hovering = false; }
      }
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX + magnetX}px, ${mouseY + magnetY}px, 0)`;
      }
    };
    
    const onMouseDown = () => {
      document.body.classList.add('cursor-clicked');
      // Trigger spark explosion at mouse coordinate
      sparkData.forEach((spark, i) => {
        spark.x = mouseX;
        spark.y = mouseY;
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
        const speed = 4 + Math.random() * 6;
        spark.vx = Math.cos(angle) * speed;
        spark.vy = Math.sin(angle) * speed;
        spark.alpha = 1;
        spark.active = true;
      });
    };
    
    const onMouseUp = () => {
      document.body.classList.remove('cursor-clicked');
    };
    
    let raf = 0;
    const loop = () => {
      ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      
      // Interpolate scale back to normal
      currentScaleX += (targetScaleX - currentScaleX) * 0.15;
      currentScaleY += (targetScaleY - currentScaleY) * 0.15;
      
      // Target scale decays back to 1
      targetScaleX += (1 - targetScaleX) * 0.08;
      targetScaleY += (1 - targetScaleY) * 0.08;

      if (planeRef.current) {
        planeRef.current.style.transform = `rotate(${currentAngle}deg) scale(${currentScaleX}, ${currentScaleY})`;
      }
      
      // Update trail positions
      trailPositions.unshift({ x: mouseX + magnetX, y: mouseY + magnetY });
      trailPositions.pop();
      
      const trailDots = document.querySelectorAll('.cursor-trail-dot') as NodeListOf<HTMLDivElement>;
      trailDots.forEach((dot, i) => {
        const pos = trailPositions[(i + 1) * 3];
        if (pos && dot) {
          dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        }
      });
      
      // Update sparks animation
      const sparks = document.querySelectorAll('.cursor-spark') as NodeListOf<HTMLDivElement>;
      sparks.forEach((dot, i) => {
        const data = sparkData[i];
        if (data.active) {
          data.x += data.vx;
          data.y += data.vy;
          data.vx *= 0.90; // friction
          data.vy *= 0.90;
          data.alpha -= 0.035; // fade out
          if (data.alpha <= 0) {
            data.active = false;
            dot.style.opacity = '0';
          } else {
            dot.style.opacity = String(data.alpha);
            dot.style.transform = `translate3d(${data.x}px, ${data.y}px, 0) scale(${data.alpha * 1.6})`;
          }
        }
      });

      raf = requestAnimationFrame(loop);
    };
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    loop();
    
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(raf);
    };
  }, []);
  
  return (
    <>
      {/* Contrail / Vapor Trail dots */}
      {Array.from({ length: 6 }).map((_, i) => {
        const size = 9 - i * 1.4;
        return (
          <div
            key={i}
            className="cursor-trail-dot"
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
              background: i % 2 === 0 ? 'rgba(24, 215, 242, 0.4)' : 'rgba(247, 181, 0, 0.3)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9997,
              willChange: 'transform',
              filter: 'blur(0.5px)'
            }}
          />
        );
      })}

      {/* Click sparks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const size = 6;
        return (
          <div
            key={i}
            className="cursor-spark"
            style={{
              position: 'fixed',
              top: 0, left: 0,
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
              marginTop: `-${size / 2}px`,
              background: i % 2 === 0 ? '#18D7F2' : '#F7B500',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9999,
              willChange: 'transform',
              opacity: 0,
              boxShadow: i % 2 === 0 ? '0 0 8px #18D7F2' : '0 0 8px #F7B500'
            }}
          />
        );
      })}

      <div ref={dotRef} className="cursor-dot">
        <div ref={planeRef} className="airplane-wrapper">
          <svg viewBox="0 0 64 64" width="36" height="36" className="realistic-airplane">
            <defs>
              <linearGradient id="wing-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC"/>
                <stop offset="100%" stopColor="#94A3B8"/>
              </linearGradient>
              <linearGradient id="wing-grad-right" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC"/>
                <stop offset="100%" stopColor="#94A3B8"/>
              </linearGradient>
              <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#CBD5E1"/>
                <stop offset="35%" stopColor="#FFFFFF"/>
                <stop offset="65%" stopColor="#FFFFFF"/>
                <stop offset="100%" stopColor="#94A3B8"/>
              </linearGradient>
              <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF"/>
                <stop offset="50%" stopColor="#0D9488"/>
                <stop offset="100%" stopColor="#0F766E"/>
              </linearGradient>
              <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B"/>
                <stop offset="100%" stopColor="#00B4D8"/>
              </linearGradient>
            </defs>
            {/* Left Wing */}
            <path d="M32 20 L8 40 L8 44 L32 32 Z" fill="url(#wing-grad-left)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Right Wing */}
            <path d="M32 20 L56 40 L56 44 L32 32 Z" fill="url(#wing-grad-right)" stroke="#00B4D8" strokeWidth="0.5"/>
            
            {/* Pulsating Jet Engines Thrust Glow */}
            <circle cx="19.25" cy="42" r="1.5" fill="#18D7F2">
              <animate attributeName="r" values="1.2;2.2;1.2" dur="0.15s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.15s" repeatCount="indefinite" />
            </circle>
            <circle cx="44.75" cy="42" r="1.5" fill="#18D7F2">
              <animate attributeName="r" values="1.2;2.2;1.2" dur="0.15s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="0.15s" repeatCount="indefinite" />
            </circle>

            {/* Left Engine */}
            <rect x="17.5" y="32" width="3.5" height="9" rx="1.5" fill="url(#gold-grad)" stroke="#E2E8F0" strokeWidth="0.5" transform="rotate(-5 19 36)"/>
            {/* Right Engine */}
            <rect x="43" y="32" width="3.5" height="9" rx="1.5" fill="url(#gold-grad)" stroke="#E2E8F0" strokeWidth="0.5" transform="rotate(5 45 36)"/>
            {/* Fuselage (Body) */}
            <path d="M32 8 C34 8 35 12 35 20 L35 48 C35 52 33 54 32 54 C31 54 29 52 29 48 L29 20 C29 12 30 8 32 8 Z" fill="url(#body-grad)" stroke="#00B4D8" strokeWidth="0.75"/>
            {/* Cockpit Window */}
            <path d="M29.5 14.5 C29.5 14.5 32 12.5 34.5 14.5 C34.5 14.5 34 15.5 32 16 C30 15.5 29.5 14.5 29.5 14.5 Z" fill="url(#glass-grad)"/>
            {/* Left Tail Stabilizer */}
            <path d="M32 46 L20 52 L20 55 L32 50 Z" fill="url(#wing-grad-left)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Right Tail Stabilizer */}
            <path d="M32 46 L44 52 L44 55 L32 50 Z" fill="url(#wing-grad-right)" stroke="#00B4D8" strokeWidth="0.5"/>
            {/* Vertical Tail Fin */}
            <path d="M32 42 L32 53 L33.5 53 L32.5 42 Z" fill="url(#gold-grad)"/>
          </svg>
        </div>
      </div>
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner" />
      </div>
    </>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 20 });
  const [scale, setScale] = useState(0);
  useEffect(() => sx.on('change', (v) => setScale(v)), [sx]);
  return <div className="scroll-progress" style={{ width: `${scale * 100}%` }} />;
}

/* ============ 3-SECOND CINEMATIC INTRO ============ */
function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Attempt to play with sound
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay with sound was blocked. Fallback to silent/muted playback.", error);
          video.muted = true;
          video.play().catch((err) => {
            console.error("Muted playback failed too:", err);
            setVideoError(true);
          });
        });
      }
    }

    // Safety fallback: if video fails or is blocked completely, transition after 4.5 seconds
    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[300] bg-black overflow-hidden flex items-center justify-center" 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.6 }}
    >
      {!videoError ? (
        <video
          ref={videoRef}
          src="/images/Beduine_Logo_Last_Clean_Sound_Adjusted.mp4"
          playsInline
          className="w-full h-full object-contain bg-black"
          style={{ transform: 'scale(1.12) translateY(-6%)' }}
          onEnded={onComplete}
          onError={() => setVideoError(true)}
        />
      ) : (
        <div className="text-center text-[#D8E4EA] font-mono text-sm">
          Loading BEDUINE experience...
        </div>
      )}

      <button 
        onClick={onComplete} 
        className="absolute bottom-8 right-8 px-4 py-2 rounded-full glass text-white/60 hover:text-white text-xs uppercase tracking-widest z-[310] border border-white/10"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}

/* ---------- Navbar ---------- */
interface NavbarProps {
  view: 'landing' | 'login' | 'register' | 'terms' | 'dashboard';
  setView: (v: 'landing' | 'login' | 'register' | 'terms' | 'dashboard') => void;
  currentUser: any;
  setCurrentUser: (user: any) => void;
  setLoginInitialMode: (mode: 'login' | 'register') => void;
  onSelectPlan?: (planName: string) => void;
}

function Navbar({ view, setView, currentUser, setCurrentUser, setLoginInitialMode }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDashboard = view === 'dashboard';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div 
          className={`rounded-2xl transition-all duration-500 ${isDashboard ? '' : 'shadow-[0_8px_32px_0_rgba(31,38,135,0.03)]'} ${scrolled ? 'shadow-md shadow-slate-100/5' : ''} border`}
          style={{
            backgroundColor: isDashboard 
              ? '#FAF2E6' 
              : (scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.65)'),
            backdropFilter: isDashboard ? 'none' : 'blur(20px) saturate(180%)',
            borderColor: isDashboard 
              ? '#E7DCCF' 
              : (scrolled ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.18)'),
          }}
        >
          <div className="flex items-center justify-between px-4 lg:px-6 h-14 lg:h-16">
            <a 
              href="#top" 
              className="flex items-center gap-2.5" 
              data-magnetic
              onClick={(e) => {
                if (view !== 'landing') {
                  e.preventDefault();
                  setView('landing');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }
              }}
            >
              <div 
                className="w-10 h-10 rounded-full overflow-hidden border shadow-lg bg-cosmos flex items-center justify-center p-1.5"
                style={{ borderColor: isDashboard ? '#E7DCCF' : 'rgba(24, 215, 242, 0.3)' }}
              >
                <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base font-bold tracking-tight" style={{ color: '#1E3147' }}>BEDUINE</div>
                <div className="text-[9px] uppercase tracking-[0.22em] font-black" style={{ color: '#138A8A' }}>Tour & Travels</div>
              </div>
            </a>
            <nav className="hidden lg:flex items-center gap-6">
              {DESKTOP_NAV.map((n) => (
                <a 
                  key={n.id} 
                  href={`#${n.id}`} 
                  data-magnetic 
                  onClick={(e) => {
                    if (n.id === 'terms') {
                      e.preventDefault();
                      setView('terms');
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                      return;
                    }
                    if (view !== 'landing') {
                      e.preventDefault();
                      setView('landing');
                      setTimeout(() => {
                        const el = document.getElementById(n.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className="text-sm transition-all font-bold whitespace-nowrap hover:scale-105"
                  style={{ color: isDashboard ? '#1E3147' : '#7E919D' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#138A8A'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isDashboard ? '#1E3147' : '#7E919D'}
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              {currentUser ? (
                <>
                  <button 
                    onClick={() => {
                      setView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-sm transition-colors font-bold px-3 py-2 whitespace-nowrap bg-transparent border-none cursor-pointer"
                    style={{ color: isDashboard ? '#1E3147' : '#7E919D' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#138A8A'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDashboard ? '#1E3147' : '#7E919D'}
                  >
                    My Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentUser(null);
                      setView('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-xs transition-all font-bold px-4 py-2 rounded-full border border-slate-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50/20 whitespace-nowrap cursor-pointer bg-white"
                    style={{ color: '#1E3147' }}
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setLoginInitialMode('login');
                      setView('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-sm transition-colors font-bold px-3 py-2 whitespace-nowrap bg-transparent border-none cursor-pointer"
                    style={{ color: isDashboard ? '#1E3147' : '#7E919D' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#138A8A'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDashboard ? '#1E3147' : '#7E919D'}
                  >
                    Log In
                  </button>
                  <button 
                    onClick={() => {
                      setLoginInitialMode('register');
                      setView('login');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    data-magnetic 
                    className="text-xs transition-all font-extrabold px-5 py-2.5 rounded-full border whitespace-nowrap uppercase tracking-wider cursor-pointer premium-register-btn"
                  >
                    Create Account
                  </button>
                </>
              )}
              <a 
                href="#plans"
                onClick={(e) => {
                  if (view !== 'landing') {
                    e.preventDefault();
                    setView('landing');
                    setTimeout(() => {
                      const el = document.getElementById('plans');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
              >
                <ParticleButton variant={isDashboard ? 'teal' : 'cyan'} className="px-4 py-2 rounded-full font-bold text-sm inline-flex items-center gap-1.5 text-white">
                  Choose Plan <ArrowRight className="w-3.5 h-3.5" />
                </ParticleButton>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="lg:hidden p-2 border-none bg-transparent cursor-pointer"
                style={{ color: '#1E3147' }}
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t" style={{ borderColor: '#E7DCCF' }}>
                <div className="px-4 py-3 flex flex-col gap-1" style={{ backgroundColor: '#FAF2E6' }}>
                  {NAV.map((n) => (
                    <a 
                      key={n.id} 
                      href={`#${n.id}`} 
                      onClick={(e) => {
                        setOpen(false);
                        if (n.id === 'terms') {
                          e.preventDefault();
                          setView('terms');
                          setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 100);
                          return;
                        }
                        if (view !== 'landing') {
                          e.preventDefault();
                          setView('landing');
                          setTimeout(() => {
                            const el = document.getElementById(n.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }} 
                      className="py-2.5 text-sm font-bold no-underline"
                      style={{ color: '#1E3147' }}
                    >
                      {n.label}
                    </a>
                  ))}
                  {currentUser ? (
                    <>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setView('dashboard');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-2 text-center py-2.5 rounded-full border text-xs font-bold transition-all bg-transparent cursor-pointer"
                        style={{ borderColor: '#E7DCCF', color: '#1E3147' }}
                      >
                        My Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setCurrentUser(null);
                          setView('landing');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-1 text-center py-2.5 rounded-full border text-xs font-bold transition-all bg-white text-red-500 border-red-200 cursor-pointer"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setLoginInitialMode('login');
                          setView('login');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-2 text-center py-2.5 rounded-full border text-xs font-bold transition-all bg-transparent cursor-pointer"
                        style={{ borderColor: '#E7DCCF', color: '#1E3147' }}
                      >
                        Log In
                      </button>
                      <button 
                        onClick={() => {
                          setOpen(false);
                          setLoginInitialMode('register');
                          setView('login');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="mt-1.5 text-center py-2.5 rounded-full text-xs font-extrabold transition-all premium-register-btn uppercase tracking-wider text-white border-none cursor-pointer"
                      >
                        Create Account
                      </button>
                    </>
                  )}
                  <a 
                    href="#plans" 
                    onClick={(e) => {
                      setOpen(false);
                      if (view !== 'landing') {
                        e.preventDefault();
                        setView('landing');
                        setTimeout(() => {
                          const el = document.getElementById('plans');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }} 
                    className="mt-1.5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-bold text-sm no-underline"
                    style={{ background: 'linear-gradient(135deg, #138A8A, #0E6F70)' }}
                  >
                    Choose Plan <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}


/* ---------- Hero ---------- */
const HERO_SLIDES = [
  {
    image: '/images/beduine_travel_hero_1779521651766.png',
    tagline: 'BEDUINE Tour & Travels',
    title1: 'Journeys that',
    title2: 'stay with you.',
    desc: 'A futuristic travel subscription that combines AI-curated journeys, weekly reward draws, and guaranteed travel credits.',
  },
  {
    image: '/images/kashmir_dal_lake_1779521728036.png',
    tagline: 'Kashmir Paradise',
    title1: 'Misty Peaks &',
    title2: 'Shikara Rides.',
    desc: 'Unwind in the pristine valleys of Srinagar, ride through the snows of Gulmarg, and stay in premium houseboats.',
  },
  {
    image: '/images/kerala_houseboat_1779521772928.png',
    tagline: 'Kerala Backwaters',
    title1: 'Green Valleys &',
    title2: 'Houseboat Stays.',
    desc: "Float down the quiet backwaters of Alleppey and walk through Munnar's sprawling, aromatic tea plantations.",
  },
  {
    image: '/images/darjeeling_tea_1779521805614.png',
    tagline: 'Himalayan Beauty',
    title1: 'Sunrise over Gold',
    title2: 'Mountain Peaks.',
    desc: 'Watch the sunrise paint Kanchenjunga from Tiger Hill and travel on the historic Himalayan Toy Train.',
  },
  {
    image: '/images/dubai_skyline_1779539448313.png',
    tagline: 'Dubai Metropolis',
    title1: 'Modern Wonders &',
    title2: 'Golden Dunes.',
    desc: 'Gaze out from the heights of Burj Khalifa, cruise the Marina, and enjoy a traditional desert safari sunset.',
  },
  {
    image: '/images/singapore_skyline_1779539502293.png',
    tagline: 'Futuristic Singapore',
    title1: 'Gardens by the Bay',
    title2: 'City Wonder.',
    desc: 'Explore the spectacular supertrees, walk the modern skyline, and enjoy the beautiful theme parks of Sentosa.',
  },
  {
    image: '/images/rajasthan_palace_1779521744228.png',
    tagline: 'Royal Rajasthan',
    title1: 'Majestic Forts &',
    title2: 'Heritage Palaces.',
    desc: 'Step into history with royal palaces in Udaipur, ancient forts in Jaipur, and camps under the stars in Jaisalmer.',
  },
  {
    image: '/images/maldives_overwater_1779539482305.png',
    tagline: 'Maldives Paradise',
    title1: 'Overwater Villas &',
    title2: 'Coral Reefs.',
    desc: 'Relax on powder-white sands, stay over crystal waters, and snorkel with colorful marine life in tropical warmth.',
  },
];

function Hero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5400);
    return () => clearInterval(interval);
  }, []);

  const slide = HERO_SLIDES[currentSlideIndex];

  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 150]);

  return (
    <section id="top" className="relative z-20 min-h-screen flex items-center bg-[#f4f7f6] overflow-hidden pt-28 pb-16">
      {/* Background with Parallax (Brightened) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#f4f7f6]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlideIndex}
            style={{ y: yParallax }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.95 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt={slide.tagline} className="w-full h-full object-cover" fetchPriority="high" width="1920" height="1080" />
          </motion.div>
        </AnimatePresence>
        {/* Soft, light overlays to guarantee high contrast without darkening the beautiful image */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-[#f4f7f6]/95 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/65 via-white/15 to-transparent z-[2]" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-[0.03] z-[1]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Cursive Tagline, Animated Heading, Description, and CTA */}
        <div className="lg:col-span-6 text-left flex flex-col justify-center relative min-h-[440px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col items-start"
            >
              {/* Company Name & Secondary Tagline */}
              <div className="mb-2 flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#0096C7] font-extrabold font-mono">
                  BEDUIN TOUR & TRAVELS
                </span>
                <span className="font-pacifico text-3xl md:text-4xl text-[#0096C7] leading-relaxed drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] mt-1">
                  Safar Jo Yaad Rahe
                </span>
              </div>

              {/* Headline (Main Tagline) */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] uppercase mb-4 flex flex-col">
                <span className="text-[#0B1F2E] drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
                  Choose Your Plan.
                </span>
                <span className="bg-gradient-to-r from-[#0096C7] via-[#00B4D8] to-[#0077B6] bg-clip-text text-transparent drop-shadow-[0_1.5px_4px_rgba(255,255,255,0.4)]">
                  Try Your Luck.
                </span>
                <span className="text-[#0B1F2E] drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] text-3xl sm:text-4xl lg:text-5xl mt-1">
                  Travel Beyond Limits.
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-700/95 font-bold leading-relaxed max-w-md mb-6 drop-shadow-[0_1.5px_3px_rgba(255,255,255,0.9)]">
                Join a Beduin subscription plan, get discount credits on paid tours, and become eligible for weekly promotional winner tour benefits.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 items-center mb-8">
                <a href="#plans" className="cursor-pointer">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#00A2FF] to-[#00D9FF] hover:from-[#0088D1] hover:to-[#00C2E6] text-white font-bold rounded-full shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider border-none cursor-pointer flex items-center gap-1.5">
                    View Plans <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </a>
                <a href="#terms" className="cursor-pointer">
                  <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider border-none cursor-pointer flex items-center gap-1.5">
                    Read Terms
                  </button>
                </a>
                <a href="#contact" className="cursor-pointer">
                  <button className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5">
                    Contact Us
                  </button>
                </a>
              </div>

              {/* Polaroid-Style Photo Prints Overlay in Bottom Left */}
              <div className="flex items-center gap-3 mt-2 select-none pointer-events-none">
                {/* Polaroid 1 */}
                <div
                  className="bg-white p-2.5 pb-4 shadow-[0_12px_24px_rgba(0,0,0,0.08)] rounded border border-slate-100/50 w-32 rotate-[-8deg] transform hover:rotate-[-4deg] transition-transform duration-300"
                >
                  <img
                    src="/images/kashmir_dal_lake_1779521728036.png"
                    alt="Kashmir"
                    className="w-full h-18 object-cover rounded-sm"
                  />
                  <div className="text-[9px] text-slate-800 font-pacifico mt-1.5 text-center">Kashmir Dal Lake</div>
                </div>

                {/* Polaroid 2 */}
                <div
                  className="bg-white p-2.5 pb-4 shadow-[0_12px_24px_rgba(0,0,0,0.08)] rounded border border-slate-100/50 w-32 rotate-[6deg] -ml-5 transform hover:rotate-[2deg] transition-transform duration-300 z-10"
                >
                  <img
                    src="/images/darjeeling_tea_1779521805614.png"
                    alt="Darjeeling"
                    className="w-full h-18 object-cover rounded-sm"
                  />
                  <div className="text-[9px] text-slate-800 font-pacifico mt-1.5 text-center">Darjeeling Tea</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Dynamic Circular/Oval Frame + Floating Airplane + Clouds + Hearts */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]">
          {/* Animated clouds in the background */}
          <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
            {/* Cloud 1 (Left-Top) */}
            <motion.div
              animate={{
                x: [-15, 15, -15],
                y: [-8, 8, -8]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-20px] top-[15%] w-28 h-8 bg-white/45 backdrop-blur-md rounded-full filter blur-[1px] shadow-[0_4px_12px_rgba(255,255,255,0.4)] border border-white/30"
            />

            {/* Cloud 2 (Right-Bottom) */}
            <motion.div
              animate={{
                x: [15, -15, 15],
                y: [8, -8, 8]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute right-[-10px] bottom-[20%] w-32 h-10 bg-white/50 backdrop-blur-md rounded-full filter blur-[1px] shadow-[0_4px_12px_rgba(255,255,255,0.4)] border border-white/30"
            />
          </div>

          {/* Large Oval Frame with Active Slide Image */}
          <div className="relative z-10 w-76 h-[360px] sm:w-84 sm:h-[400px] rounded-[150px] border-[10px] border-white shadow-[0_25px_50px_rgba(0,0,0,0.1)] overflow-hidden bg-white/10 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlideIndex}
                src={slide.image}
                alt={slide.tagline}
                initial={{ scale: 1.25, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

            {/* Red Heart on Left Frame Border */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[15px] top-[42%] z-20"
            >
              <Heart className="w-8 h-8 text-rose-500 fill-rose-500 drop-shadow-[0_4px_8px_rgba(244,63,94,0.45)]" />
            </motion.div>
          </div>

          {/* Floating Hearts around the bottom-right frame */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Blue Heart 1 */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute right-[15px] bottom-[28%]"
            >
              <Heart className="w-8 h-8 text-[#00D9FF] fill-[#00D9FF] drop-shadow-[0_4px_8px_rgba(0,217,255,0.4)]" />
            </motion.div>

            {/* Blue Heart 2 */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
              className="absolute right-[45px] bottom-[15%]"
            >
              <Heart className="w-6 h-6 text-[#00A2FF] fill-[#00A2FF] drop-shadow-[0_3px_6px_rgba(0,162,255,0.3)]" />
            </motion.div>
          </div>

          {/* Floating airplane flying out from the circular frame */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              rotate: [1, 3, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute right-[-40px] top-[15%] w-80 h-80 z-30 pointer-events-none drop-shadow-[0_20px_30px_rgba(0,0,0,0.22)]"
          >
            <img
              src="/images/airplane_nobg.png"
              alt="Airplane"
              className="w-full h-full object-contain"
              style={{ transform: 'rotate(-25deg) scaleX(-1)' }}
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-800/40 text-[10px] tracking-[0.3em] uppercase z-10">
        <span>Scroll</span><div className="w-px h-10 bg-gradient-to-b from-[#00A2FF] to-transparent" />
      </div>
    </section>
  );
}

/* ---------- Trust Strip ---------- */
function TrustStrip() {
  const items = [
    { icon: Calendar, t: '12 Month Validity' },
    { icon: Sparkles, t: 'Weekly Promotional Draw' },
    { icon: Wallet, t: '₹500 Discount Credit' },
    { icon: Shield, t: '18+ Membership Only' },
    { icon: Gift, t: 'Non-Cash Benefits' },
  ];
  return (
    <section className="trust-strip relative py-5 lg:py-6 border-y border-slate-line scanline z-20">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
          {items.map((it) => (
            <div key={it.t} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-cyan/12 border border-cyan/25 flex items-center justify-center shrink-0 shadow-sm shadow-cyan/10 transition-all duration-300 hover:scale-105 hover:bg-cyan/18">
                <it.icon className="w-5 h-5 text-cyan" />
              </div>
              <div className="text-xs lg:text-sm font-semibold">{it.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ---------- About Us / Mission / Vision ---------- */
function AboutUs() {
  const pillars = [
    {
      icon: Heart,
      title: 'Our Mission',
      accent: 'cyan',
      image: '/images/about_mission.png',
      text: 'At Beduine Tour & Travels, our mission is to transform travel into an accessible, reliable, and rewarding experience for everyone.',
      points: [
        'Offer carefully crafted tours that balance culture, comfort and adventure.',
        'Provide a unique subscription-based model where members enjoy weekly lucky draws and guaranteed discounts.',
        'Deliver luxury tours for winners while ensuring that non-winners never feel left behind, thanks to fair and transparent benefits.',
        'Build a community of happy travelers who see Beduine not just as a company, but as a trusted partner in creating memories.'
      ],
      quote: "We believe travel is not just about visiting destinations — it's about building stories, emotions, and connections that last a lifetime."
    },
    {
      icon: Globe,
      title: 'Our Vision',
      accent: 'gold',
      image: '/images/about_vision.png',
      text: 'The vision of Beduine Tour & Travels is to revolutionize the travel industry with a sustainable, inclusive, and transparent model that benefits every traveler.',
      points: [
        'Expand our presence across India with a franchise and agent-driven network, reaching even the remotest travelers.',
        'Integrate cutting-edge technology to ensure seamless subscriptions, lucky draw transparency, and hassle-free tour management.',
        'Position Beduine as a global name in innovative travel solutions, starting from domestic roots and branching out to international experiences.',
        'Build a community of loyal subscribers who see travel not as an expense but as a lifetime investment in memories.'
      ],
      quote: 'Our ultimate vision is simple: "Safar jo yad rahe" — journeys that live forever in the hearts of our travelers.'
    }
  ];
  return (
    <section id="about" className="relative py-14 lg:py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> About BEDUINE <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Safar jo" />
              <br /><span className="gold-shimmer"><KineticText text="yaad rahe." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed max-w-2xl mx-auto">BEDUINE Tour & Travels is a customer-first travel company dedicated to crafting memorable journeys across India and beyond. We combine curated itineraries, transparent pricing, and a unique subscription model that rewards every member.</p>
          </div>
        </Reveal>

        {/* Pillar Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.15}>
              <TiltCard className="h-full" intensity={5}>
                <div className={`glass rounded-3xl overflow-hidden border border-slate-line ${p.accent === 'cyan' ? 'hover:neon-border-cyan' : 'hover:neon-border-gold'} transition-all h-full tilt-inner flex flex-col group`}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b22] via-[#0d1b22]/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <FloatingIcon delay={i * 0.5}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-cyan-deep shadow-cyan/30' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/30'}`}>
                          <p.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} />
                        </div>
                      </FloatingIcon>
                    </div>
                  </div>
                  <div className="p-8 pt-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-black text-[#0B1F2E] mb-4">{p.title}</h3>
                      <p className="text-sm text-slate-800 leading-relaxed mb-6 font-semibold">{p.text}</p>
                      <ul className="space-y-3.5 mb-6">
                        {p.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-3 text-sm text-slate-900 font-bold">
                            <GoldCheck size={16} variant={p.accent as any} className="mt-0.5 shrink-0" />
                            <span className="text-slate-800">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={`p-4 rounded-2xl border ${p.accent === 'cyan' ? 'bg-cyan/8 border-cyan/20 text-[#008EAA] font-serif italic' : 'bg-neon-gold/8 border-neon-gold/20 text-gold-deep font-bold'} text-xs leading-relaxed text-center mt-auto shadow-sm`}>
                      {p.quote}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Address & Website strip with Office Setup Image */}
        <Reveal>
          <div className="mt-14 glass-gold rounded-3xl overflow-hidden border border-neon-gold/40 neon-border-gold shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <div className="p-6 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-gold text-neon-gold text-[10px] font-bold uppercase tracking-widest mb-4">
                    <MapPin className="w-3.5 h-3.5" /> Registered Office
                  </div>
                  <h3 className="font-display text-2xl lg:text-4xl font-bold text-ink leading-tight mb-4">
                    Fulia, Nadia,<br />West Bengal - 741402
                  </h3>
                  <p className="text-sm text-ink/75 leading-relaxed mb-6">
                    Step inside BEDUINE Tour & Travels. Visit our head office in Fulia for customized tour planning, group holiday bookings, or to grab a hot cup of tea while we design your next memory.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-line/50">
                  <a href="https://www.beduine.in" target="_blank" rel="noreferrer" data-magnetic className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-cyan/50 text-cyan text-sm font-semibold hover:bg-cyan/10 transition-all"><Globe className="w-4 h-4" />www.beduine.in</a>
                  <a href="tel:+918768903565" data-magnetic className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-neon-gold/50 text-neon-gold text-sm font-semibold hover:bg-neon-gold/10 transition-all"><Phone className="w-4 h-4" />+91 87689 03565</a>
                </div>
              </div>
              <div className="relative min-h-[300px] lg:min-h-full overflow-hidden group">
                <img src="/images/office_setup.png" alt="BEDUINE Fulia Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 z-10 p-4 bg-slate-950/75 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="text-xs text-neon-gold font-mono">// Fulia HQ Setup</div>
                  <div className="font-display font-semibold text-white text-sm mt-0.5">Welcome to BEDUINE Tour & Travels</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    { n: '01', icon: CreditCard, title: 'Choose Your Plan', desc: 'Select from our Silver, Gold, or Platinum tiers (domestic & international plans).', details: ['12-month validity', 'Clear credit options', '18+ membership only'], img: '/images/beduin_travel_hero_1779521651766.png' },
    { n: '02', icon: FileCheck2, title: 'Complete Verification', desc: 'Securely submit your inquiry and confirm age requirements to activate benefits.', details: ['WhatsApp Activation', '18+ age verification', 'Secure processing'], img: '/images/office_setup.png' },
    { n: '03', icon: Wallet, title: 'Get Your Credits', desc: 'Get your Lucky Draw Credit (LDC) token and Discount Credits (DCs) loaded.', details: ['1 LDC token received', '₹500 discount credits', 'Value floor guaranteed'], img: '/images/lucky_draw_ticket_1779521667122.png' },
    { n: '04', icon: Gift, title: 'Travel & Save', desc: 'Enjoy weekly promotional winner benefits or apply discount credits on paid bookings.', details: ['Weekly winner draws', '₹500 off per booking', 'Non-cash travel benefits'], img: '/images/happy_family_travelers.png' },
  ];
  return (
    <section id="how" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> The Protocol <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="A subscription built on" />
              <br /><span className="gradient-neon"><KineticText text="guaranteed value." delay={0.4} /></span>
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <TiltCard className="h-full" intensity={6}>
                <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner">
                  {/* Step image */}
                  <div className="relative h-40 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/60 to-transparent" />
                    <div className="absolute top-3 left-4 font-display text-5xl font-bold text-cyan/30 tabular">{s.n}</div>
                    <div className="absolute top-3 right-3">
                      <FloatingIcon delay={i * 0.5}>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${i % 2 === 0 ? 'from-cyan to-cyan-deep' : 'from-neon-gold to-gold-deep'} flex items-center justify-center shadow-lg ${i % 2 === 0 ? 'shadow-cyan/30' : 'shadow-neon-gold/30'}`}><s.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} /></div>
                      </FloatingIcon>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed mb-5 min-h-[60px]">{s.desc}</p>
                    <ul className="space-y-2 pt-5 border-t border-slate-line">
                      {s.details.map((d) => <li key={d} className="flex items-center gap-2.5 text-sm text-ink/80"><GoldCheck size={16} /><span>{d}</span></li>)}
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 glass-gold rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <FloatingIcon><div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shrink-0 shadow-lg shadow-neon-gold/40"><ShieldCheck className="w-7 h-7 text-cosmos" strokeWidth={2.2} /></div></FloatingIcon>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-widest neon-gold font-semibold mb-1">Our Commitment</div>
              <div className="font-display text-xl lg:text-2xl font-bold text-ink">100% Operational Integrity.</div>
              <p className="text-sm text-ink/70 mt-2">Every draw uses a certified RNG. Every result is live-streamed and archived. Every member receives documented, verifiable value.</p>
            </div>
            <a href="#audit" data-magnetic className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-neon-gold/50 text-neon-gold text-sm font-semibold hover:bg-neon-gold/10 transition-all shrink-0">View Audit Archive <ArrowRight className="w-4 h-4" /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Plan Card ---------- */
function PlanCard({ plan, index, onSelectPlan }: { plan: typeof PLANS[number]; index: number; onSelectPlan: (planName: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setImgStyle({ transform: `scale(1.15) translate(${(x - 0.5) * -20}px, ${(y - 0.5) * -20}px)` });
  };
  const onLeave = () => setImgStyle({ transform: 'scale(1) translate(0,0)' });
  const creditValue = plan.discountValue.toLocaleString('en-IN');
  const isComingSoon = plan.name !== 'Silver';

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard intensity={6}>
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner bg-gradient-to-b from-slate-950 to-slate-900 border ${plan.featured ? 'border-2 border-neon-gold/80 shadow-2xl shadow-neon-gold/10' : 'border-slate-800/80 hover:border-cyan/50 hover:shadow-2xl hover:shadow-cyan/5'}`}>
          {plan.featured && !isComingSoon && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-gold via-cyan to-neon-gold z-10" />}
          {plan.featured && !isComingSoon && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Crown className="w-3 h-3 fill-current" /> Premium Choice</div>}
          {isComingSoon && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">Coming Soon</div>}

          <div className="relative h-48 overflow-hidden bg-slate-950">
            <div className={`tilt-img absolute inset-0 bg-cover bg-center transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-80'}`} style={{ ...imgStyle, backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="relative p-7 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-cyan-deep uppercase tracking-widest font-bold">{plan.tagline}</div>
                  <div className="font-display text-3xl font-black text-white mt-0.5">{plan.name}</div>
                </div>
                <plan.icon className="w-10 h-10 text-neon-gold" strokeWidth={1.8} />
              </div>
              <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs text-neon-gold font-bold">
                <MapPin className="w-3.5 h-3.5" /> {plan.imageLabel}
              </motion.div>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80 relative overflow-visible">
            {plan.name === 'Silver' ? (
              <div className="relative overflow-visible">
                <div className="flex items-baseline gap-1 relative z-10">
                  <span className="text-neon-gold text-lg font-bold">₹</span>
                  <span className="font-display text-5xl font-black text-white tracking-tight tabular">{plan.price}</span>
                  <span className="text-slate-400 font-extrabold text-sm">/ 12 mo</span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-neon-gold text-lg font-bold">₹</span>
                <span className="font-display text-5xl font-black text-white tracking-tight tabular">{plan.price}</span>
                <span className="text-slate-400 font-extrabold text-sm">/ 12 mo</span>
              </div>
            )}
            <div className="mt-2 text-sm text-slate-300 font-bold">Winner tour value up to <span className="font-extrabold text-white">₹{plan.tourValue.toLocaleString('en-IN')}</span> - {plan.duration}</div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm font-black leading-snug text-emerald-100">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
              <span>Pay ₹{plan.price.toLocaleString('en-IN')}. If not selected, use ₹{creditValue} as travel credit.</span>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-4 h-4 text-cyan" /><div className="text-[11px] uppercase tracking-widest text-cyan font-bold">Winner Destinations</div></div>
            <ul className="space-y-2">{plan.destinations.map((d) => <li key={d} className="flex items-start gap-2 text-sm text-slate-200 font-bold"><GoldCheck size={15} /><span>{d}</span></li>)}</ul>
          </div>

          <div className="p-7 space-y-2.5">{plan.benefits.slice(0, 4).map((b) => <div key={b} className="flex items-start gap-2.5 text-sm text-slate-200 font-bold"><GoldCheck size={16} /><span>{b}</span></div>)}</div>

          <div className="px-7 pb-5">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: 'Discount Credits', v: `₹ ${plan.discountValue.toLocaleString('en-IN')}` }, { l: 'Paid Tour Off', v: `Up to ${plan.paidDiscount}` }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{c.l}</div>
                  <div className="text-xs font-black text-slate-100 mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            {isComingSoon ? (
              <button
                disabled
                className="block text-center w-full py-3.5 rounded-full font-bold bg-white/5 border border-white/10 text-slate-500 text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            ) : (
              <ParticleButton
                onClick={() => onSelectPlan(plan.name)}
                variant={plan.featured ? 'gold' : 'cyan'}
                className="block text-center w-full py-3.5 rounded-full font-bold"
              >
                {`Choose ${plan.name}`}
              </ParticleButton>
            )}
            <div className="text-center text-[11px] text-slate-400 font-bold mt-3 font-mono">// 12-mo validity - pickup included</div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

/* ---------- Custom AI-Tech Premium Icon ---------- */
function AIIcon({ type }: { type: string }) {
  const getIconContent = () => {
    switch (type) {
      case 'calendar':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M12 14v4M10 16h4" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'mappin':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      case 'award':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        );
      case 'barchart':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        );
      case 'filecheck':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
        );
      case 'plane':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M12 22V12" />
            <path d="M12 12L7.5 7.5M12 12l4.5-4.5" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        );
      default:
        // Default Sparkle star from user screenshot
        return (
          <svg className="w-6 h-6 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2c.5 4 3 6.5 7 7-4 .5-6.5 3-7 7-.5-4-3-6.5-7-7 4-.5 6.5-3 7-7Z" />
            <circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none" />
            <path d="M19 6v3m-1.5-1.5h3" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className="w-12 h-12 rounded-[14px] bg-gradient-to-b from-[#00c6ff] to-[#0072ff] flex items-center justify-center shrink-0 relative group transition-transform duration-300 hover:scale-105"
      style={{
        boxShadow: '0 8px 16px -4px rgba(0, 114, 255, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6), inset 0 -3px 6px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Glossy Top Highlight for 3D effect */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[14px] pointer-events-none" />

      {/* Soft Glow */}
      <div className="absolute inset-0 bg-cyan-300/20 blur-[2px] pointer-events-none rounded-[14px]" />

      {/* High-fidelity Glass Border */}
      <div className="absolute inset-0 rounded-[14px] border-[1.5px] border-white/50 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
        {getIconContent()}
      </div>
    </div>
  );
}

function Plans({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <section id="plans" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Domestic Plans <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Choose your plan." />
              <br /><span className="gold-shimmer"><KineticText text="Travel beyond limits." delay={0.4} /></span>
            </h2>
          </div>
        </Reveal>

        {/* Subscription Rules & Benefits Banner */}
        <Reveal>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl glass-cyan border border-cyan/20 shadow-xl shadow-black/55 mb-12 max-w-3xl mx-auto overflow-hidden group text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-cyan/10 blur-xl" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-cyan-deep flex items-center justify-center shrink-0 shadow-lg shadow-cyan/20">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-left text-xs sm:text-sm leading-relaxed relative z-10 text-ink">
              <div className="font-semibold text-cyan-deep uppercase tracking-widest flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-deep animate-pulse" />
                Subscription Rules & Benefits
              </div>
              <div className="text-ink/75 mt-1">
                <span className="font-semibold text-rose-700">No Cash Refunds.</span> Every active plan joins the draw. If you do not win, your plan value turns into <span className="font-semibold text-ink">travel credits</span> for future bookings.
              </div>
            </div>
          </motion.div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {PLANS.map((p, i) => (
            <PlanCard key={p.name} plan={p} index={i} onSelectPlan={onSelectPlan} />
          ))}
        </div>

        <Reveal>
          <div className="mt-14 glass rounded-2xl p-6 lg:p-8 border border-slate-line">
            <div className="text-center text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-5">Included in every domestic plan</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[{ type: 'calendar', t: '12 Months Validity', d: 'Full subscription coverage' }, { type: 'mappin', t: 'Pickup & Drop', d: 'From selected points' }, { type: 'award', t: 'Quarterly Tours', d: 'Batched travel cycles' }, { type: 'barchart', t: 'Digital Dashboard', d: 'Track credits & draws' }].map((b) => (
                <div key={b.t} className="flex items-center gap-3.5">
                  <AIIcon type={b.type} />
                  <div><div className="font-bold text-white text-sm">{b.t}</div><div className="text-xs text-slate-400 mt-0.5">{b.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- International Plans ---------- */
function IntlPlanCard({ plan, index }: { plan: typeof INTL_PLANS[number]; index: number; onSelectPlan?: (planName: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const onMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setImgStyle({ transform: `scale(1.15) translate(${(x - 0.5) * -20}px, ${(y - 0.5) * -20}px)` });
  };
  const onLeave = () => setImgStyle({ transform: 'scale(1) translate(0,0)' });
  const creditValue = plan.discountValue.toLocaleString('en-IN');

  return (
    <Reveal delay={index * 0.1}>
      <TiltCard intensity={6}>
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner bg-gradient-to-b from-slate-950 to-slate-900 border ${plan.featured ? 'border-2 border-emerald-400/80 shadow-2xl shadow-cyan/10' : 'border-slate-800/80 hover:border-cyan/50 hover:shadow-2xl hover:shadow-cyan/5'}`}>
          {plan.featured && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan to-emerald-400 z-10" />}
          <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">Coming Soon</div>

          <div className="relative h-48 overflow-hidden bg-slate-950">
            <div className={`tilt-img absolute inset-0 bg-cover bg-center transition-all duration-700 ${hovered ? 'opacity-100 scale-105' : 'opacity-80'}`} style={{ ...imgStyle, backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="relative p-7 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-cyan-deep uppercase tracking-widest font-bold">{plan.tagline}</div>
                  <div className="font-display text-3xl font-black text-white mt-0.5">{plan.name}</div>
                </div>
                <plan.icon className="w-10 h-10 text-cyan" strokeWidth={1.8} />
              </div>
              <motion.div initial={false} animate={{ opacity: hovered ? 1 : 0.8 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 text-xs text-cyan font-bold">
                <Plane className="w-3.5 h-3.5" /> {plan.imageLabel}
              </motion.div>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80">
            <div className="flex items-baseline gap-1">
              <span className="text-cyan text-lg font-bold">?</span>
              <span className="font-display text-5xl font-black text-white tracking-tight tabular">{plan.price.toLocaleString('en-IN')}</span>
              <span className="text-slate-400 font-extrabold text-sm">/ 12 mo</span>
            </div>
            <div className="mt-2 text-sm text-slate-300 font-bold">Winner tour value up to <span className="font-extrabold text-white">₹{plan.tourValue.toLocaleString('en-IN')}</span> - {plan.duration}</div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan/25 bg-cyan/10 p-3 text-sm font-black leading-snug text-cyan-bright">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Pay ₹{plan.price.toLocaleString('en-IN')}. If not selected, use ₹{creditValue} as travel credit.</span>
            </div>
          </div>

          <div className="p-7 border-b border-slate-800/80">
            <div className="flex items-center gap-2 mb-3"><Plane className="w-4 h-4 text-cyan" /><div className="text-[11px] uppercase tracking-widest text-cyan font-bold">International Destinations</div></div>
            <ul className="space-y-2">{plan.destinations.map((d) => <li key={d} className="flex items-start gap-2 text-sm text-slate-200 font-bold"><GoldCheck size={15} variant="cyan" /><span>{d}</span></li>)}</ul>
          </div>

          <div className="p-7 space-y-2.5">{plan.benefits.slice(0, 4).map((b) => <div key={b} className="flex items-start gap-2.5 text-sm text-slate-200 font-bold"><GoldCheck size={16} variant="cyan" /><span>{b}</span></div>)}</div>

          <div className="px-7 pb-5">
            <div className="grid grid-cols-3 gap-2">
              {[{ l: 'Discount Credits', v: `₹ ${plan.discountValue.toLocaleString('en-IN')}` }, { l: 'Tour Discount', v: plan.paidDiscount.startsWith('Up to') ? plan.paidDiscount : `Up to ${plan.paidDiscount}` }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{c.l}</div>
                  <div className="text-xs font-black text-slate-100 mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            <button
              disabled
              className="block text-center w-full py-3.5 rounded-full font-bold bg-white/5 border border-white/10 text-slate-500 text-sm cursor-not-allowed"
            >
              Coming Soon
            </button>
            <div className="text-center text-[11px] text-slate-400 font-bold mt-3 font-mono">// 12-mo validity - visa assist included</div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

function InternationalPlans({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <section id="intl-plans" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> International Packages <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Explore the world." />
              <br /><span className="gradient-neon"><KineticText text="No boundaries." delay={0.4} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Unlock premium international destinations with visa assistance, airport lounge access, and world-class travel experiences.</p>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {INTL_PLANS.map((p, i) => (
            <IntlPlanCard key={p.name} plan={p} index={i} onSelectPlan={onSelectPlan} />
          ))}
        </div>

        <Reveal>
          <div className="mt-14 glass rounded-2xl p-6 lg:p-8 border border-slate-line neon-border-cyan">
            <div className="text-center text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-5">Included in every international plan</div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[{ type: 'calendar', t: '12 Months Validity', d: 'Full subscription coverage' }, { type: 'filecheck', t: 'Visa Assistance', d: 'End-to-end documentation' }, { type: 'plane', t: 'Airport Lounge', d: 'Premium access included' }].map((b) => (
                <div key={b.t} className="flex items-center gap-3.5">
                  <AIIcon type={b.type} />
                  <div><div className="font-bold text-white text-sm">{b.t}</div><div className="text-xs text-slate-400 mt-0.5">{b.d}</div></div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  return (
    <section id="services" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Services <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="End-to-end travel," />
              <br /><span className="gradient-neon"><KineticText text="handled." delay={0.4} /></span>
            </h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 0.08}>
              <TiltCard intensity={4}>
                <div className="glass rounded-2xl p-5 border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner flex flex-col justify-between group">
                  <div>
                    {/* Premium Card Header Image */}
                    <div className="relative h-44 rounded-xl overflow-hidden mb-5 z-0">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                      {/* Dark gradient shadow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent pointer-events-none" />

                      {/* Floating icon badge */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <div className="w-10 h-10 rounded-xl glass-cyan flex items-center justify-center border border-slate-line/80 shadow-lg backdrop-blur-md">
                          <s.icon className="w-5 h-5 text-cyan animate-pulse" strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-bold text-ink mb-2 transition-colors duration-300 group-hover:text-cyan">
                      {s.title}
                    </h3>
                    <p className="text-sm text-ink/65 leading-relaxed">{s.desc}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-line/40 flex items-center gap-2 text-xs font-semibold neon-cyan">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Transparency ---------- */
function Transparency() {
  const features = [
    { icon: Eye,       t: 'Live-streamed draws',      d: 'Every Sunday at 6 PM on YouTube & Facebook.',              color: 'from-cyan-500 to-[#00F5D4]', glow: 'rgba(0,245,212,0.25)' },
    { icon: FileText,  t: 'Public audit reports',     d: 'PDF / CSV with verified draw records and winner list.',      color: 'from-amber-400 to-amber-600',   glow: 'rgba(245,158,11,0.25)' },
    { icon: Lock,      t: 'Verifiable coupons',       d: 'Unique QR / UUID codes - impossible to duplicate.',          color: 'from-sky-500 to-cyan-600', glow: 'rgba(34,211,238,0.25)' },
    { icon: TrendingUp,t: 'Fair selection process',   d: 'Results reviewed and published through official channels.',  color: 'from-teal-400 to-emerald-500', glow: 'rgba(16,185,129,0.25)' },
  ];

  return (
    <section id="audit" className="audit-polish relative py-14 lg:py-20 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 z-10">

        {/* Section Header */}
        <Reveal>
          <div className="text-center mb-12">
            <SubSectionBadge text="Transparency Engine" theme="gold" />
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight mt-4">
              <KineticText text="Every draw," />
              <br /><span className="gold-shimmer"><KineticText text="fully documented." delay={0.3} /></span>
            </h2>
            <p className="mt-4 text-white/80 text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
              Trust isn't claimed - it's proven. Our weekly reward draws use certified RNG, are live-streamed, and archived as downloadable audit reports.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* Left: Feature pills */}
          <Reveal>
            <div className="space-y-4">
              {features.map((f, i) => (
                <Reveal key={f.t} delay={i * 0.09}>
                  <div className="audit-feature-card flex items-start gap-4 rounded-2xl bg-black/50 border border-white/10 p-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-white/20 transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0 shadow-lg`}
                      style={{ boxShadow: `0 0 18px ${f.glow}` }}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-white text-sm leading-snug">{f.t}</div>
                      <div className="text-white/65 text-sm mt-0.5 leading-relaxed">{f.d}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Right: Audit report card */}
          <Reveal delay={0.15}>
            <div className="audit-report-card rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
                <div>
                  <SubSectionBadge text="Digital Audit Archive" theme="cyan" />
                  <div className="font-display text-lg font-bold text-white mt-2">Recent Draw Reports</div>
                </div>
                <FloatingIcon>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-[#00F5D4] flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Scan className="w-5 h-5 text-white" />
                  </div>
                </FloatingIcon>
              </div>

              {/* Report rows */}
              <div className="p-4 space-y-3">
                {AUDIT_REPORTS.map((r) => (
                  <div key={r.week} className="audit-report-row flex items-center gap-3 rounded-xl bg-white/5 border border-white/8 hover:border-amber-400/30 hover:bg-white/8 transition-all p-3 group">
                    {/* Status dot */}
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-white text-sm">{r.week}</div>
                      <div className="text-white/45 text-[11px] font-mono">{r.date}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{r.status}</span>
                      <button className="audit-download-btn w-7 h-7 rounded-lg bg-white/5 hover:bg-amber-400/15 border border-white/10 hover:border-amber-400/40 flex items-center justify-center transition-all group-hover:border-amber-400/40" aria-label={`Download ${r.week} audit report`}>
                        <Download className="w-3.5 h-3.5 text-white/50 group-hover:text-amber-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 pt-2 border-t border-white/8">
                <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-[#00F5D4]/10 border border-cyan-500/25 hover:border-cyan-400/50 text-[#00F5D4] text-xs font-bold font-mono tracking-widest hover:bg-cyan-500/15 transition-all">
                  &gt; view_full_archive() <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}


/* ---------- Lucky Draw Execution Strategy ---------- */
function LuckyDrawSystem() {
  const phases = [
    { n: '01', icon: Scan, title: 'Data Verification', accent: 'cyan',
      img: '/images/transparency_verification.png',
      desc: 'All subscription logins made up to Saturday 11:59 PM are collected. Every participant is assigned a unique ticket ID.',
      details: ['Duplicate entries & unverified payments are programmatically purged', 'Invalid accounts are filtered before pool freeze', 'Final subscriber list is frozen for that week\'s draw'] },
    { n: '02', icon: Bot, title: 'Random Selection Engine', accent: 'teal',
      img: '/images/transparency_rng.png',
      desc: 'A secure Random Number Generator (RNG) system selects the winning ticket IDs with full transparency.',
      details: ['Uses Random.org or audit-locked in-house script', 'Selection streamed live or recorded with screen-share', 'Visible on Facebook & YouTube channels'] },
    { n: '03', icon: FileText, title: 'Reports & Audits', accent: 'gold',
      img: '/images/transparency_audit.png',
      desc: 'A comprehensive draw report containing all pool metrics is compiled weekly and archived.',
      details: ['PDF/CSV with total pool, winning IDs & timestamps', 'RNG seed logs included for verification', 'Archived for transparent internal & external audits'] },
    { n: '04', icon: Send, title: 'Winner Announcement', accent: 'cyan',
      img: '/images/transparency_winner.png',
      desc: 'Winners are announced every Sunday evening across all company channels with unique digital coupons.',
      details: ['Website Winners Page + Social Media posts', 'SMS & Email notification with coupon code', 'Unique QR/UUID codes - impossible to duplicate'] },
  ];

  const schedule = [
    { quarter: 'Jan - Mar', tour: 'July', color: 'from-cyan to-blue-500', img: '/images/sundarbans_mangrove_1779521789593.png' },
    { quarter: 'Apr - Jun', tour: 'October', color: 'from-teal-400 to-emerald-600', img: '/images/darjeeling_tea_1779521805614.png' },
    { quarter: 'Jul - Sep', tour: 'January', color: 'from-neon-gold to-gold-deep', img: '/images/kashmir_dal_lake_1779521728036.png' },
    { quarter: 'Oct - Dec', tour: 'April', color: 'from-emerald-400 to-teal-500', img: '/images/kerala_houseboat_1779521772928.png' },
  ];

  return (
    <section id="luckydraw" className="relative py-14 lg:py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Lucky Draw Protocol <div className="w-8 h-px bg-cyan" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="How the draw" />
              <br /><span className="gradient-neon"><KineticText text="actually works." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every Sunday, eligible subscribers enter a verified lucky draw. The customer journey stays simple: enter, watch, and receive your result securely.</p>
          </div>
        </Reveal>

        {/* Customer draw overview */}
        <Reveal>
          <div className="glass-gold rounded-3xl p-6 lg:p-10 border border-neon-gold/40 mb-16 neon-border-gold">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-[11px] uppercase tracking-widest neon-gold font-semibold mb-2 font-mono">// Weekly Draw Experience</div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">Simple, secure, and verified.</div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Members can follow the draw experience clearly. Results are checked, documented, and shared through official BEDUINE channels.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {['Eligible entries', 'Verified selection', 'Official result'].map((item) => (
                    <div key={item} className="glass-light rounded-xl p-3 border border-slate-line text-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-ink">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-line" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gold-grad)" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${Math.PI * 90 * 0.72} ${Math.PI * 90 * 0.28}`} />
                    <defs><linearGradient id="gold-grad"><stop offset="0%" stopColor="#00D9FF" /><stop offset="100%" stopColor="#FFD166" /></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ShieldCheck className="w-12 h-12 text-neon-gold mb-2" />
                    <div className="text-[10px] uppercase tracking-widest text-ink/50 mt-1">Verified Draw</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-ink/50">Clear result updates for every member</div>
                  <div className="text-[10px] text-ink/40 mt-1 font-mono">Official channels only</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Tour Scheduling Cycle */}
        <Reveal>
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2">Tour Scheduling Cycle</div>
              <div className="font-display text-2xl lg:text-3xl font-bold text-ink">When do winners travel?</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {schedule.map((s, i) => (
                <Reveal key={s.quarter} delay={i * 0.1}>
                  <div className="glass rounded-2xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all text-center group">
                    {/* Destination preview image */}
                    <div className="relative h-28 overflow-hidden">
                      <img src={s.img} alt={s.tour} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />
                      <div className={`absolute top-2 right-2 w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                        <Calendar className="w-4 h-4 text-cosmos" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-ink/50 uppercase tracking-widest mb-1 font-mono">Winners from</div>
                      <div className="font-display text-lg font-bold text-ink">{s.quarter}</div>
                      <div className="my-2 flex justify-center"><ArrowRight className="w-4 h-4 text-neon-gold rotate-90" /></div>
                      <div className="text-xs text-ink/50 uppercase tracking-widest mb-1 font-mono">Travel in</div>
                      <div className="font-display text-lg font-bold neon-gold">{s.tour}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 4-Phase Execution Process */}
        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <TiltCard className="h-full" intensity={5}>
                <div className="glass rounded-3xl p-7 border border-slate-line hover:neon-border-cyan transition-all h-full tilt-inner">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="font-display text-4xl font-extrabold text-cyan/30 tabular">{p.n}</div>
                    <FloatingIcon delay={i * 0.3}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/30' : p.accent === 'teal' ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal/30' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/30'}`}>
                        <p.icon className="w-7 h-7 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-black text-slate-900">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed mb-5">{p.desc}</p>

                  {/* Real Photo illustration */}
                  <div className="relative rounded-2xl overflow-hidden mb-5 h-36 bg-cosmos shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover opacity-90" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />

                    {/* Floating badge inside picture */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-void/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-line/50 text-[10px] font-mono text-ink">
                      <span className="flex items-center gap-1.5 font-bold">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${p.n === '01' ? 'bg-cyan' : p.n === '02' ? 'bg-teal-500' : p.n === '03' ? 'bg-neon-gold' : 'bg-cyan'}`} />
                        {p.n === '01' ? 'Verification Live' : p.n === '02' ? 'Secure Entropy' : p.n === '03' ? 'Certified Logs' : 'Winner Declared'}
                      </span>
                      <span className="font-bold opacity-60">Step {p.n}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                    {p.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-ink/80">
                        <GoldCheck size={15} variant={p.accent === 'cyan' ? 'cyan' : 'gold'} />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Customer-end draw UX */}
        <Reveal>
          <div className="mt-16 glass rounded-3xl p-6 lg:p-10 border border-slate-line neon-border-cyan">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2 font-mono">// Customer-End Draw Experience</div>
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">You don't just wait - you <span className="gradient-neon">participate.</span></div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Every Sunday, subscribers log in to their BEDUINE account, use their Lucky Draw Credit to enter, and see results instantly. The draw is triggered by the system itself - not secretly by the company.</p>
                <div className="space-y-3">
                  {[
                    { step: '1', t: 'Log in on Sunday', d: 'Open your BEDUINE app or web portal' },
                    { step: '2', t: 'Activate your entry', d: 'Use your 1 Lucky Draw Credit to lock your ticket' },
                    { step: '3', t: 'Watch the draw', d: 'Digital scratch card or RNG animation reveals results' },
                    { step: '4', t: 'Instant result', d: 'Win -> Tour coupon | Not selected -> Discount credits confirmed' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-cyan-deep flex items-center justify-center shrink-0 text-cosmos font-bold text-sm">{s.step}</div>
                      <div><div className="font-semibold text-ink text-sm">{s.t}</div><div className="text-xs text-ink/55">{s.d}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-line group shadow-2xl h-[320px]">
                <img src="/images/lucky_draw_ticket_1779521667122.png" alt="Lucky Draw Ticket" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/50 to-cosmos/25" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-[10px] font-bold uppercase tracking-widest border border-cyan/20">Active Draw</span>
                    <span className="text-xs font-mono neon-gold font-semibold flex items-center gap-1"><Sparkles className="w-3 h-3 animate-spin" /> Verifiable</span>
                  </div>

                  <div className="glass rounded-xl p-4 border border-neon-gold/30 backdrop-blur-md">
                    <div className="text-center mb-3">
                      <div className="font-display text-sm font-semibold neon-gold tracking-wide">WEEKLY DRAW WINNER</div>
                      <div className="text-xs text-ink/75 mt-0.5">Congratulations! Your entry won a free luxury tour.</div>
                    </div>
                    <div className="glass rounded-lg p-2.5 border border-neon-gold/20 bg-cosmos/80 text-center font-mono">
                      <div className="text-[9px] uppercase tracking-widest text-ink/40">Coupon Code</div>
                      <div className="text-lg font-bold neon-cyan tracking-wider">BEDWIN-JULY-12345</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-white/60 font-mono">
                    <span>Ticket ID: BD-98421-2026</span>
                    <span>Verified: Oct 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* SMS Example */}
        <Reveal>
          <div className="mt-8 glass-light rounded-xl p-5 border border-slate-line max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg glass-cyan flex items-center justify-center"><MessageCircle className="w-4 h-4 text-cyan" /></div>
              <div className="text-[10px] uppercase tracking-widest neon-cyan font-semibold">Sample Winner SMS</div>
            </div>
            <div className="glass rounded-xl p-4 border border-cyan/20 text-sm text-ink/80 leading-relaxed font-mono">
              Congratulations <span className="neon-gold">[Name]</span>! You are a BEDUINE Lucky Draw Winner! Your coupon: <span className="neon-cyan">BEDWIN-JULY-12345</span>. Call <span className="text-ink">+91 8768903565</span> for details.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Credit Architecture System ---------- */
function CreditArchitecture(_props: { activePlan: string | null; ldcTokens: number; discountCredits: number }) {
  const [activeTab, setActiveTab] = useState<'domestic' | 'intl'>('domestic');

  const credits = [
    { type: 'LDC', name: 'Lucky Draw Credit', icon: Sparkles, accent: 'cyan',
      desc: '1 Credit is issued per subscription. This credit acts as a token that the user manually spends on the mobile app/web portal on Sunday to lock their participation in that week\'s draw.',
      rule: '1 Credit = 1 Entry in the weekly Lucky Draw',
      details: ['Automatically added upon payment verification', 'Used every Sunday to activate draw entry', 'Ticket ID confirmed and locked for that week', 'No extra credits can be purchased - fair chance for all'] },
    { type: 'DC', name: 'Discount Credits', icon: CreditCard, accent: 'teal',
      desc: 'These act as the protective floor for non-winners. If a user does not win, these credits allow them to claim a flat ₹500 off per tour booking.',
      rule: '1 Tour Booking = 1 Discount Credit applied',
      details: ['Domestic: ₹500 discount per credit (Up to ₹2,000 safety floor)', 'International: ₹500 discount per credit (Up to ₹7,500 safety floor)', 'Credits never expire and stack across bookings', 'Credits visible on your digital dashboard'] },
  ];

  const domesticCredits = [
    { plan: 'Silver', price: '₹499', ldc: '1', dc: '₹500', total: '₹500', color: 'from-slate-500 to-slate-700', image: '/images/sundarbans_mangrove_1779521789593.png' },
    { plan: 'Gold', price: '₹799', ldc: '1', dc: '₹1,000', total: '₹1,000', color: 'from-teal-400 to-emerald-600', image: '/images/darjeeling_tea_1779521805614.png' },
    { plan: 'Platinum', price: '₹1,499', ldc: '1', dc: '₹2,000', total: '₹2,000', color: 'from-neon-gold to-gold-deep', image: '/images/kashmir_dal_lake_1779521728036.png' },
  ];

  const intlCredits = [
    { plan: 'Silver', price: '₹4,999', ldc: '1 (Monthly)', dc: '₹2,500', total: '₹2,500', color: 'from-sky-400 to-blue-600', image: '/images/nepal.png' },
    { plan: 'Gold', price: '₹7,999', ldc: '1 (Monthly)', dc: '₹4,000', total: '₹4,000', color: 'from-emerald-400 to-teal-600', image: '/images/thailand.png' },
    { plan: 'Platinum', price: '₹14,999', ldc: '1 (Monthly)', dc: '₹7,500', total: '₹7,500', color: 'from-cyan via-cyan-bright to-cyan-deep', image: '/images/vietnam.png' },
  ];

  const currentCredits = activeTab === 'domestic' ? domesticCredits : intlCredits;

  return (
    <section id="credits" className="relative py-14 lg:py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Credit Architecture <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Two credits," />
              <br /><span className="gold-shimmer"><KineticText text="zero risk." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber receives two types of credits - one for the thrill of the draw, one as your guaranteed safety net. Win or not, you always gain.</p>
          </div>
        </Reveal>

        {/* Three Columns including Holographic pass */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {credits.map((c, i) => (
            <Reveal key={c.type} delay={i * 0.15}>
              <TiltCard className="h-full" intensity={5}>
                <div className={`rounded-3xl p-8 border h-full tilt-inner flex flex-col relative overflow-hidden transition-all duration-500 ${c.accent === 'cyan' ? 'glass glass-glow-cyan border-[#18D7F2]/25 shadow-lg shadow-[#18D7F2]/5' : 'glass-gold glass-glow-gold border-[#F7B500]/25 shadow-lg shadow-[#F7B500]/5'}`}>
                  {/* Ambient soft background glow */}
                  <div className={`absolute -top-20 -left-20 w-44 h-44 rounded-full blur-[80px] pointer-events-none opacity-30 ${c.accent === 'cyan' ? 'bg-[#18D7F2]' : 'bg-[#F7B500]'}`} />

                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <FloatingIcon delay={i * 0.5}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${c.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/40' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/40'}`}>
                        <c.icon className="w-8 h-8 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div>
                      <div className={`font-mono text-xs font-black tracking-widest ${c.accent === 'cyan' ? 'text-[#18D7F2]' : 'text-[#F7B500]'}`}>{c.type}</div>
                      <div className="font-display text-xl font-black text-white tracking-wide">{c.name}</div>
                    </div>
                  </div>

                  {/* Rule badge - Full Black and Stylish */}
                  <div className={`rounded-xl p-3 mb-5 border backdrop-blur-md relative z-10 ${c.accent === 'cyan' ? 'bg-[#18D7F2]/8 border-[#18D7F2]/20 text-[#18D7F2]' : 'bg-[#F7B500]/8 border-[#F7B500]/20 text-[#F7B500]'}`}>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="font-extrabold text-white tracking-tight">{c.rule}</span>
                    </div>
                  </div>

                  {/* Visual illustration slot */}
                  {c.type === 'LDC' ? (
                    /* Lucky Draw Token Image */
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40 bg-slate-950 shrink-0">
                      {/* Sweeping glare reflection effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-card-shine pointer-events-none z-10" />
                      <img src="/images/lucky_draw_token.png" alt="Lucky Draw Token" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-[2]" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-between z-[3]">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono tracking-widest text-[#18D7F2] font-black bg-slate-950/60 px-2 py-0.5 rounded border border-[#18D7F2]/30 shadow-md">
                            LUCKY TOKEN
                          </span>
                          <span className="text-[#18D7F2] font-mono text-[9px] flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded border border-[#18D7F2]/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#18D7F2] animate-pulse" /> active
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-mono text-xl tracking-widest mb-1 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            WEEKLY DRAW
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 font-bold">
                            <span>LDC UNIT</span>
                            <span>EXP: Sunday 8PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Discount Credit Voucher (CSS Holographic Card - Dark Premium) */
                    <div className="relative rounded-2xl overflow-hidden border border-[#F7B500]/30 group shadow-2xl mb-6 h-40 bg-gradient-to-br from-slate-900 via-[#0B1F2E] to-slate-950 flex flex-col justify-between p-5 shrink-0">
                      {/* Sweeping glare reflection effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-card-shine pointer-events-none z-10" />

                      {/* Ticket punch cuts */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#030C15] border-r border-[#F7B500]/25 z-20 pointer-events-none" />
                      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#030C15] border-l border-[#F7B500]/25 z-20 pointer-events-none" />
                      
                      {/* Ticket tear line */}
                      <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t border-dashed border-[#F7B500]/20 z-0 pointer-events-none" />

                      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-[#F7B500]/5 blur-xl pointer-events-none" />
                      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-teal-500/5 blur-xl pointer-events-none" />

                      <div className="flex justify-between items-start relative z-10">
                        <span className="text-[9px] font-mono tracking-widest text-[#F7B500] font-black bg-slate-950/60 px-2 py-0.5 rounded border border-[#F7B500]/30 shadow-md">
                          DISCOUNT VOUCHER
                        </span>
                        <span className="text-[#F7B500] font-mono text-[9px] font-bold flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded border border-[#F7B500]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F7B500] animate-pulse" /> redeemable
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-2 relative z-10">
                        <div className="text-left">
                          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Value</div>
                          <div className="text-3xl font-display font-black text-[#F7B500] tracking-tight leading-none drop-shadow-[0_0_8px_rgba(247,181,0,0.35)]">
                            ₹500
                          </div>
                        </div>
                        <div className="h-10 w-px border-l border-dashed border-slate-700/40" />
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Applicable on</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            Domestic Tours
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-semibold relative z-10 pt-2 border-t border-slate-800">
                        <span>SECURE CREDITS</span>
                        <span className="text-white/80">100% SECURED</span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 flex-1 font-medium relative z-10">{c.desc}</p>

                  <ul className="space-y-2.5 pt-5 border-t border-slate-line relative z-10">
                    {c.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-slate-200 font-semibold">
                        <GoldCheck size={15} variant={c.accent === 'cyan' ? 'cyan' : 'gold'} />
                        <span className="text-slate-300 font-medium">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}

          {/* Third Column: Interactive Holographic Member Pass */}
          <Reveal delay={0.3}>
            <TiltCard className="h-full" intensity={5}>
              <div className="rounded-3xl p-8 border h-full tilt-inner flex flex-col justify-between overflow-hidden relative transition-all duration-500 border-teal-500/20 glass glass-glow-teal shadow-lg shadow-teal-500/5">
                {/* Ambient soft background glow */}
                <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full blur-[80px] pointer-events-none opacity-30 bg-[#00C7A3]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan to-teal-deep shadow-lg shadow-cyan/20">
                      <Fingerprint className="w-8 h-8 text-cosmos" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-black tracking-widest text-[#00C7A3]">// BEDUINE DIGITAL PASS</div>
                      <div className="font-display text-xl font-black text-white tracking-wide">BEDUINE Member Pass</div>
                    </div>
                  </div>

                  {/* Digital Pass Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40 bg-slate-950 shrink-0">
                    {/* Sweeping glare reflection effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-card-shine pointer-events-none z-10" />
                    
                    <img src="/images/credit_card_holographic_1779521713449.png" alt="Holographic Credit Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 z-[2]" />
                    
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-[3]">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono tracking-widest text-white font-black bg-slate-950/60 px-2 py-0.5 rounded border border-white/20 shadow-md">
                          MEMBER CLUB
                        </span>
                        
                        {/* Realistic Smart Chip */}
                        <div className="w-8 h-6 rounded bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200/30 relative overflow-hidden flex flex-col justify-between p-1 shadow-md shadow-amber-500/20 opacity-90">
                          <div className="h-full w-full border-t border-b border-yellow-900/30 flex justify-between">
                            <div className="h-full w-[2px] bg-yellow-900/20" />
                            <div className="h-full w-[2px] bg-yellow-900/20" />
                            <div className="h-full w-[2px] bg-yellow-900/20" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-white font-mono text-base tracking-widest mb-1 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            BEDUINE PASS 2026
                          </div>
                          <div className="flex gap-4 text-[9px] font-mono text-slate-300">
                            <span>MEMBER PASS</span>
                            <span>EXP: 12 Months</span>
                          </div>
                        </div>
                        
                        {/* Barcode */}
                        <div className="flex gap-[1.5px] items-end h-5 opacity-60 shrink-0">
                          {[1.5, 3, 1, 4, 1.5, 2, 3, 1, 2.5, 1.5].map((w, index) => (
                            <div key={index} className="bg-white h-full" style={{ width: w }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-medium relative z-10">
                    Your virtual membership card stores your draw tokens and discount credits. Accessible instantly from your phone.
                  </p>
                </div>

                <div className="rounded-xl p-3.5 bg-slate-950/65 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300 font-semibold shadow-inner relative z-10">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan" /> Lucky Draw Entry</span>
                  <div className="h-4 w-px bg-slate-800" />
                  <span className="text-[#00C7A3] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#00C7A3]" /> Guaranteed DC
                  </span>
                </div>
              </div>
            </TiltCard>
          </Reveal>

        </div>

        {/* Credit Comparison Table */}
        <Reveal>
          <div className="glass rounded-3xl p-6 lg:p-8 border border-slate-line mb-12">
            <div className="text-center mb-8">
              <div className="text-[11px] uppercase tracking-widest text-cyan font-semibold mb-2 font-mono">// Credit Allocation by Plan</div>
              <div className="font-display text-xl lg:text-2xl font-bold text-ink mb-6">What you get - guaranteed</div>

              {/* Premium Segmented Switcher */}
              <div className="inline-flex p-1 rounded-full bg-cosmos border border-slate-line/50 shadow-inner">
                <button
                  onClick={() => setActiveTab('domestic')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold font-display tracking-wider transition-all duration-300 ${activeTab === 'domestic' ? 'bg-gradient-to-r from-neon-gold to-gold text-white shadow-md' : 'text-ink/60 hover:text-ink'}`}
                >
                  Domestic Plans
                </button>
                <button
                  onClick={() => setActiveTab('intl')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold font-display tracking-wider transition-all duration-300 ${activeTab === 'intl' ? 'bg-gradient-to-r from-cyan to-cyan-deep text-white shadow-md' : 'text-ink/60 hover:text-ink'}`}
                >
                  International Plans
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-line">
                    <th className="py-3 px-4 text-left text-[10px] uppercase tracking-widest text-ink/50 font-mono">Plan</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-ink/50 font-mono">Price</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-cyan font-mono">LDC</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-cyan font-mono">Discount Credits</th>
                    <th className="py-3 px-4 text-center text-[10px] uppercase tracking-widest text-emerald-600 font-mono">Min Value</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCredits.map((r) => (
                    <tr key={r.plan} className="border-b border-slate-line/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {r.image ? (
                            <img
                              src={r.image}
                              alt={r.plan}
                              className="w-10 h-10 rounded-full object-cover border border-cyan/30 shadow-md shadow-cyan/10"
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${r.color} flex items-center justify-center shadow-sm`}>
                              <Star className="w-4 h-4 text-white/80" />
                            </div>
                          )}
                          <span className="font-display font-bold text-ink">{r.plan}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-display font-bold text-ink">{r.price}</td>
                      <td className="py-4 px-4 text-center"><span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-xs font-semibold">{r.ldc}</span></td>
                      <td className="py-4 px-4 text-center"><span className="px-2.5 py-1 rounded-full glass-cyan text-cyan text-xs font-semibold">{r.dc}</span></td>
                      <td className="py-4 px-4 text-center font-display font-bold text-emerald-600">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Value Proposition Banner */}
        <Reveal>
          <div className="glass-gold rounded-2xl p-6 lg:p-8 border border-neon-gold/40 neon-border-gold">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <FloatingIcon>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shadow-2xl shadow-neon-gold/50 shrink-0">
                  <ShieldCheck className="w-10 h-10 text-cosmos" />
                </div>
              </FloatingIcon>
              <div className="flex-1">
                <div className="font-display text-xl lg:text-2xl font-bold text-ink mb-2">The Ultimate Value Proposition</div>
                <p className="text-lg text-ink/80 leading-relaxed font-serif italic gold-shimmer">
                  "Every Sunday, BEDUINE runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
                </p>
              </div>
              <a href="#plans"><ParticleButton variant="gold" className="px-8 py-4 rounded-full font-bold text-base shrink-0 inline-flex items-center gap-2"><Crown className="w-5 h-5" />Choose Your Plan<ChevronRight className="w-5 h-5" /></ParticleButton></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Non-Winner Guarantee Section ---------- */
function NonWinnerGuarantee() {
  const roiCards = [
    {
      plan: 'Silver', price: 499, dc: 1, dcValue: 500, roi: 100,
      color: 'from-slate-400 to-slate-600', glow: 'slate',
      image: '/images/sundarbans_mangrove_1779521789593.png',
      tours: ['Sundarban', 'Digha', 'Mousuni Island', 'Purulia'],
      example: {
        name: 'Riya Das',
        avatar: '/images/winner_priya_sen.png',
        story: 'Riya subscribed to Silver for ₹499. She didn\'t win the draw, but used her 1 Discount Credit to get ₹500 off her Sundarban trip. She saved ₹1 more than she paid!'
      },
    },
    {
      plan: 'Gold', price: 799, dc: 2, dcValue: 1000, roi: 125,
      color: 'from-teal-400 to-emerald-600', glow: 'teal',
      image: '/images/darjeeling_tea_1779521805614.png',
      tours: ['Darjeeling', 'Dooars', 'Puri', 'Daring Bari'],
      example: {
        name: 'Arjun Roy',
        avatar: '/images/winner_arjun_roy.png',
        story: 'Arjun paid ₹799 for Gold. He didn\'t win, but used his 2 DCs on two separate tours - ₹500 off each. Total savings: ₹1,000 on a ₹799 investment!'
      },
    },
    {
      plan: 'Platinum', price: 1499, dc: 4, dcValue: 2000, roi: 133,
      color: 'from-neon-gold via-gold to-gold-deep', glow: 'gold',
      image: '/images/kashmir_dal_lake_1779521728036.png',
      tours: ['Kashmir', 'Goa', 'Sikkim', 'Himachal (Shimla+Manali)'],
      example: {
        name: 'Priya Sen',
        avatar: '/images/winner_ananya_das.png',
        story: 'Priya invested ₹1,499 in Platinum. She didn\'t win, but received 4 DCs - ₹500 off on 4 different tours = ₹2,000 total savings. That\'s 133% return!'
      },
    },
  ];

  const faqs = [
    { q: 'Who can buy a subscription?', a: 'Individuals aged 18 years or above.' },
    { q: 'How long is the subscription valid?', a: '12 months from activation.' },
    { q: 'Is the subscription refundable?', a: 'No, subscription fees are non-refundable and non-transferable.' },
    { q: 'Can I exchange winner benefits for cash?', a: 'No, winner tour benefits cannot be exchanged for cash or other packages.' },
    { q: 'What is 1 Discount Credit?', a: '1 Discount Credit equals ₹500 discount for 1 person on an eligible paid tour booking.' },
    { q: 'Can domestic credits be used for international tours?', a: 'No, domestic and international credits cannot be interchanged.' },
    { q: 'How are winners selected?', a: 'Winners are selected through RNG or an approved automated digital system from active valid participants.' }
  ];

  return (
    <>
      <section id="nonwinner" className="relative py-14 lg:py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> Non-Winner Guarantee <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Didn't win?" />
              <br /><span className="gold-shimmer"><KineticText text="You still win." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber gets guaranteed value back through Discount Credits (DC). Each DC = ₹500 flat discount on any domestic tour. Your subscription cost is always fully recovered - and then some.</p>
          </div>
        </Reveal>

        {/* ₹499 = ₹500 Guarantee Badge */}
        <Reveal>
          <div className="glass rounded-3xl p-8 lg:p-12 border border-amber-500/30 mb-16 shadow-[0_0_50px_-10px_rgba(245,158,11,0.22),inset_0_1px_0_rgba(255,255,255,0.06)] text-center relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-[#00F5D4]/8 blur-3xl" />
            <div className="relative z-10">
              <FloatingIcon>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/40 mx-auto mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </FloatingIcon>
              <div className="font-display text-4xl lg:text-6xl font-bold mb-4 flex items-center justify-center gap-3 select-none">
                <span className="text-white">₹499</span>
                <span className="text-amber-400 animate-pulse font-mono font-medium">=</span>
                <span className="bg-gradient-to-r from-[#FFF6C3] via-[#FDE047] to-[#F59E0B] bg-clip-text text-transparent">₹500</span>
              </div>
              <p className="text-lg text-ink/75 max-w-xl mx-auto leading-relaxed">Every ₹499 in your subscription maps directly to ₹500 of real tour discount value. <span className="text-[#00F5D4] font-black">Zero loss. Guaranteed.</span></p>
              <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/45 border border-emerald-500/30 shadow-lg backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-semibold">100%+ Value Recovery on Every Plan</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3-Column ROI Cards */}
        <Reveal>
          <div className="text-center mb-6">
            <SubSectionBadge text="Plan-wise Breakdown" theme="cyan" />
            <div className="font-display text-2xl lg:text-3xl font-bold text-ink mt-3">What non-winners <span className="gradient-neon">actually receive</span></div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {roiCards.map((card, i) => (
            <Reveal key={card.plan} delay={i * 0.1}>
              <TiltCard className="h-full" intensity={5}>
                <div className="glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all h-full tilt-inner flex flex-col group">
                  {/* Visual Header Image */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-abyss to-void">
                    <img src={card.image} alt={card.plan} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-display text-lg font-bold text-ink drop-shadow-sm">{card.plan}</div>
                        <div className="text-[10px] text-ink/60 font-mono">₹{card.price} / 12 months</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-4 flex-1 flex flex-col justify-between">
                    {/* Amount Paid -> Value Received */}
                    <div className="rounded-xl p-4 glass-light border border-slate-line mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-center">
                          <div className="text-[9px] uppercase tracking-widest text-ink/40 mb-1">You Pay</div>
                          <div className="font-display text-lg font-bold text-ink">₹{card.price}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-neon-gold" />
                        <div className="text-center">
                          <div className="text-[9px] uppercase tracking-widest text-ink/40 mb-1">You Get Back</div>
                          <div className="font-display text-lg font-bold text-emerald-400">₹{card.dcValue.toLocaleString()}</div>
                        </div>
                      </div>
                      {/* ROI Progress Bar */}
                      <div className="relative h-3 rounded-full bg-slate-300/40 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${Math.min(card.roi, 150)}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-neon-gold"
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[9px] text-ink/40 font-mono">0%</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">{card.roi}% ROI</span>
                      </div>
                    </div>

                    {/* DC Breakdown */}
                    <div className="rounded-xl p-3 glass-gold border border-neon-gold/20 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-neon-gold" />
                        <span className="text-sm font-bold text-neon-gold">{card.dc} Discount Credit{card.dc > 1 ? 's' : ''}</span>
                      </div>
                      <div className="text-xs text-ink/60 leading-relaxed">
                        = {card.dc} x ₹500 = <span className="text-emerald-400 font-bold">₹{card.dcValue.toLocaleString()} off</span> on {card.dc} domestic tour{card.dc > 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Applicable Destinations */}
                    <div className="flex-1">
                      <div className="text-[9px] uppercase tracking-widest text-ink/40 mb-2 font-mono">Use DC on these tours</div>
                      <ul className="space-y-1.5">
                        {card.tours.map((t) => (
                          <li key={t} className="flex items-center gap-2 text-xs text-ink/70">
                            <GoldCheck size={13} /><span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* Real-Life Scenario Cards */}
        <Reveal>
          <div className="text-center mb-8">
            <div className="text-[11px] uppercase tracking-widest neon-cyan font-semibold mb-2 font-mono">// Real Scenarios</div>
            <div className="font-display text-2xl lg:text-3xl font-bold text-ink">See how non-winners <span className="gold-shimmer">still benefit</span></div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {roiCards.map((card, i) => (
            <Reveal key={`scenario-${card.plan}`} delay={i * 0.1}>
              <div className="glass rounded-2xl p-6 border border-slate-line hover:neon-border-gold transition-all h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative">
                      <img src={card.example.avatar} alt={card.example.name} className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md group-hover:scale-105 transition-transform" />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm text-white`}>
                        <HeartHandshake className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <div className="font-display font-bold text-ink text-sm">{card.example.name}</div>
                      <div className="text-[10px] text-ink/50 uppercase tracking-widest font-semibold">{card.plan} Subscriber</div>
                    </div>
                  </div>
                  <p className="text-sm text-ink/70 leading-relaxed mb-4 italic font-serif">"{card.example.story}"</p>
                </div>
                <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">Net ROI: {card.roi}% - Paid ₹{card.price}, got ₹{card.dcValue.toLocaleString()} value</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* Dedicated FAQ & Promise Section with Waterfall Background */}
    <section id="faq" className="faq-section">
      <div className="faq-wrapper">
        <div className="text-center mb-10">
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#0D9488] font-extrabold mb-2 font-mono">// Frequently Asked Questions</div>
          <h2 className="font-display text-2xl lg:text-4xl font-extrabold text-[#071833] leading-snug">Common questions about non-winner benefits</h2>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="faq-card">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-[#0D9488] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-teal-500/20">
                    <span className="text-white text-sm font-black">Q</span>
                  </div>
                  <div className="flex-1">
                    <h3>{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Value Proposition Callout / Promise Box */}
        <Reveal>
          <div className="promise-box">
            <div className="flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
              <FloatingIcon>
                <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-2xl shadow-teal-500/20 shrink-0">
                  <HeartHandshake className="w-8 h-8 text-[#0D9488]" />
                </div>
              </FloatingIcon>
              <div className="flex-1">
                <div className="font-display text-lg lg:text-xl font-extrabold text-white mb-1.5">The BEDUINE Promise</div>
                <p className="text-white/90 leading-relaxed font-semibold italic text-base">
                  "Every Sunday, BEDUINE runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
                </p>
              </div>
              <a href="#plans" className="shrink-0"><ParticleButton variant="gold" className="px-6 py-3.5 rounded-full font-extrabold text-sm inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><Crown className="w-4 h-4" />Choose Plan<ChevronRight className="w-4 h-4" /></ParticleButton></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
    </>
  );
}

/* ---------- Destinations Showcase ---------- */
function Destinations() {
  return (
    <section id="destinations" className="relative py-14 lg:py-20 bg-cosmos">
      {/* Cosmic background glows (isolated overflow container) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-950/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-gold/5 blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4">
              <div className="w-8 h-px bg-neon-gold" /> Destinations <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Explore Cinematic" />
              <br />
              <span className="gold-shimmer">
                <KineticText text="Travel Journeys" delay={0.3} />
              </span>
            </h2>
            <p className="mt-6 text-slate-300/80 text-lg leading-relaxed">
              Scroll through handpicked destinations crafted for unforgettable journeys.
            </p>
          </div>
        </Reveal>

        {/* Total Destinations Count */}
        <Reveal>
          <div className="flex justify-center mb-12 pb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/60 border border-slate-800/85 text-xs font-bold text-slate-400 select-none shadow-xl backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
              <span className="font-mono uppercase tracking-wider">{DESTINATIONS.length} Cinematic Destinations</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 3D Scattered Scroll Showcase */}
      <ScatteredShowcase destinations={DESTINATIONS} />
    </section>
  );
}

/* ---------- Winners Wall (Auto-scrolling carousel) ---------- */
function Winners() {
  const [seconds, setSeconds] = useState(5 * 24 * 3600 + 7 * 3600 + 23 * 60 + 45);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 7 * 24 * 3600)), 1000);
    return () => clearInterval(id);
  }, []);
  const t = { d: Math.floor(seconds / 86400), h: Math.floor((seconds % 86400) / 3600), m: Math.floor((seconds % 3600) / 60), s: seconds % 60 };

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-soft-pulse" />Live Winners Wall</div>
              <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
                <KineticText text="Real people." />
                <br /><span className="gold-shimmer"><KineticText text="Real wins." delay={0.3} /></span>
              </h2>
            </div>
            <div className="glass-gold rounded-2xl p-5 flex items-center gap-5 breathe-glow">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-gold to-gold-deep text-cosmos flex items-center justify-center"><Zap className="w-6 h-6" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-widest neon-gold font-semibold">Next Draw In</div>
                <div className="font-display text-2xl font-bold text-ink tabular flex gap-1 mt-1">
                  <span>{String(t.d).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">D</span></span>:
                  <span>{String(t.h).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">H</span></span>:
                  <span>{String(t.m).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">M</span></span>:
                  <span>{String(t.s).padStart(2, '0')}<span className="text-[9px] text-gold/70 ml-0.5">S</span></span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="relative overflow-hidden -mx-5 lg:-mx-8 px-5 lg:px-8">
          <div className="flex gap-5 marquee-track" style={{ width: 'max-content' }}>
            {[...WINNERS_DATA, ...WINNERS_DATA, ...WINNERS_DATA].map((w, i) => (
              <div key={i} className="w-96 glass rounded-3xl overflow-hidden border border-slate-line hover:neon-border-gold transition-all group">
                <div className="relative h-52 overflow-hidden">
                  <img src={w.destImg} alt={w.dest} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Award className="w-3 h-3" /> {w.plan} Winner</div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={w.img} alt={w.name} className="w-12 h-12 rounded-full border-2 border-neon-gold object-cover shadow-lg" loading="lazy" />
                    <div>
                      <div className="font-display font-bold text-ink">{w.name}</div>
                      <div className="text-xs text-ink/70">Won - {w.dest}</div>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink/50 font-mono">{w.week}</span>
                    <span className="neon-gold font-semibold flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const JOURNEY_FLOATS = [
  { x: [0, 8, -6, 5, 0], y: [0, -10, 8, -6, 0], rotate: [0, 1.8, -1.2, 1.2, 0], scale: [1, 1, 1], duration: 9.5 },
  { x: [0, -7, 8, -5, 0], y: [0, 12, -8, 6, 0], rotate: [0, -1.5, 2, -1, 0], scale: [1, 1, 1], duration: 11 },
  { x: [0, 10, 0, -10, 0], y: [0, -5, 10, -5, 0], rotate: [0, 1.2, -1.8, 1.2, 0], scale: [1, 1, 1], duration: 12.5 },
  { x: [0, -9, 6, -8, 0], y: [0, -8, 10, -7, 0], rotate: [0, -1.8, 1.5, -1, 0], scale: [1, 1, 1], duration: 10 },
  { x: [0, 5, -7, 6, 0], y: [0, 10, -10, 5, 0], rotate: [0, 2.2, -2.2, 1.2, 0], scale: [1, 1.015, 0.985, 1.01, 1], duration: 13.5 }
];

/* ---------- Journey Section (Image collage) ---------- */
function Journey() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCardStyle = (index: number) => {
    const isHovered = hoveredIndex === index;
    const isAnyHovered = hoveredIndex !== null;

    // Stacked state (default overlapping fan stack at the center)
    const stackedOffsets = isMobile ? [
      { x: -15, y: -25, rotate: -5, z: 20 },
      { x: 20, y: -10, rotate: 4, z: 15 },
      { x: -5, y: 10, rotate: -2, z: 25 },
      { x: -30, y: 35, rotate: -8, z: 10 },
      { x: 30, y: 25, rotate: 6, z: 12 }
    ] : [
      { x: -30, y: -45, rotate: -8, z: 20 },
      { x: 35, y: -20, rotate: 6, z: 15 },
      { x: -10, y: 15, rotate: -3, z: 25 },
      { x: -50, y: 60, rotate: -10, z: 10 },
      { x: 55, y: 45, rotate: 9, z: 12 }
    ];

    // Fanned state offsets - gorgeous distribution spread in space
    const fannedOffsets = isMobile ? [
      { x: -65, y: -65, rotate: -10, z: 10 },
      { x: 65, y: -55, rotate: 8, z: 12 },
      { x: -45, y: 65, rotate: -5, z: 14 },
      { x: 45, y: 75, rotate: 5, z: 16 },
      { x: 0, y: 5, rotate: 0, z: 20 }
    ] : [
      { x: -140, y: -100, rotate: -12, z: 10 },
      { x: 140, y: -80, rotate: 10, z: 12 },
      { x: -80, y: 100, rotate: -5, z: 14 },
      { x: 80, y: 120, rotate: 6, z: 16 },
      { x: 0, y: 10, rotate: 0, z: 20 }
    ];

    let baseX = isDeckHovered ? fannedOffsets[index].x : stackedOffsets[index].x;
    let baseY = isDeckHovered ? fannedOffsets[index].y : stackedOffsets[index].y;
    let baseRotate = isDeckHovered ? fannedOffsets[index].rotate : stackedOffsets[index].rotate;
    let zIndex = isDeckHovered ? fannedOffsets[index].z : stackedOffsets[index].z;

    if (isHovered) {
      return {
        x: baseX,
        y: baseY - 30, // floats up
        rotate: 0,
        scale: 1.18,
        zIndex: 100,
        opacity: 1,
        filter: 'brightness(1.1) saturate(1.15)'
      };
    }

    if (isAnyHovered) {
      return {
        x: baseX,
        y: baseY,
        rotate: baseRotate,
        scale: 0.9,
        zIndex,
        opacity: 0.8,
        filter: 'brightness(0.95) saturate(1.0)'
      };
    }

    return {
      x: baseX,
      y: baseY,
      rotate: baseRotate,
      scale: 1,
      zIndex,
      opacity: 1,
      filter: 'brightness(1.05) saturate(1.1)'
    };
  };

  return (
    <section className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4"><div className="w-8 h-px bg-cyan" /> Our Journey <div className="w-8 h-px bg-cyan" /></div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight">
                <KineticText text="Crafting memories," />
                <br /><span className="gradient-neon"><KineticText text="one journey at a time." delay={0.3} /></span>
              </h2>
              <p className="mt-6 text-white/80 text-lg leading-relaxed">From the misty peaks of Kashmir to the sun-drenched beaches of Goa - every trip we craft becomes a chapter in your life's most beautiful story.</p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[{ n: '10K+', l: 'Happy Travelers' }, { n: '50+', l: 'Destinations' }, { n: '100%', l: 'Verified' }].map((s) => (
                  <div key={s.l} className="glass rounded-2xl p-4 border border-slate-line">
                    <div className="font-display text-2xl lg:text-3xl font-bold neon-gold tabular">{s.n}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Dynamic 3D fanning-out gallery deck */}
          <Reveal delay={0.2}>
            <div
              className="relative h-[550px] lg:h-[650px] flex items-center justify-center select-none"
              onMouseEnter={() => setIsDeckHovered(true)}
              onMouseLeave={() => {
                setIsDeckHovered(false);
                setHoveredIndex(null);
              }}
              onTouchStart={() => setIsDeckHovered(true)}
            >
              {/* Decorative rotating ring behind the cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rotate-slow opacity-25 hidden lg:block pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-gold/30" />
                <div className="absolute inset-10 rounded-full border border-cyan/20" />
                <div className="absolute inset-20 rounded-full border border-gold/20" />
              </div>

              {/* Text instruction overlay */}
              <div className="absolute top-4 text-center z-10 w-full pointer-events-none transition-opacity duration-300">
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-white/50 uppercase bg-black/45 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                  {isDeckHovered ? 'Tap or hover cards to reveal' : 'Hover or tap to expand gallery'}
                </span>
              </div>

              {JOURNEY_IMAGES.map((img, i) => {
                const isHovered = hoveredIndex === i;
                return (
                  <motion.div
                    key={img.label}
                    animate={getCardStyle(i)}
                    transition={{
                      type: 'spring',
                      stiffness: isHovered ? 260 : 120,
                      damping: isHovered ? 20 : 18
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => setHoveredIndex(hoveredIndex === i ? null : i)}
                    className={`absolute w-[200px] h-[285px] lg:w-[250px] lg:h-[355px] left-1/2 top-1/2 -ml-[100px] -mt-[142px] lg:-ml-[125px] lg:-mt-[177px] rounded-3xl overflow-hidden border bg-slate-900 cursor-pointer shadow-2xl transition-all duration-300 group
                      ${img.theme === 'cyan' ? 'border-cyan/20 hover:border-cyan/80' : img.theme === 'gold' ? 'border-amber-400/20 hover:border-amber-400/80' : 'border-cyan/20 hover:border-cyan/80'}
                    `}
                  >
                    <motion.div
                      className="absolute -inset-4"
                      animate={(hoveredIndex !== null || isDeckHovered) ? {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        transition: { type: 'spring', stiffness: 200, damping: 20 }
                      } : {
                        x: JOURNEY_FLOATS[i].x,
                        y: JOURNEY_FLOATS[i].y,
                        rotate: JOURNEY_FLOATS[i].rotate,
                        scale: JOURNEY_FLOATS[i].scale,
                        transition: {
                          duration: JOURNEY_FLOATS[i].duration,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (i % 4) * 0.25
                        }
                      }}
                    >
                      {/* Image */}
                      <img
                        src={img.src}
                        alt={img.label}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Bottom-focused shadow gradient for contrast readability of text, keeping the top half bright and saturated */}
                      <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10" />
                    </motion.div>

                    {/* Content overlays */}
                    <div className="absolute inset-x-0 bottom-0 p-4 pt-12 z-20 flex flex-col justify-end pointer-events-none">
                      <span className={`text-[9px] font-bold uppercase tracking-widest font-mono mb-1 w-fit px-2 py-0.5 rounded-md bg-black/45 border
                        ${img.theme === 'cyan' ? 'text-cyan border-cyan/20' : img.theme === 'gold' ? 'text-neon-gold border-amber-500/20' : 'text-cyan border-cyan/20'}
                      `}>
                        {img.badge}
                      </span>
                      <h4 className="font-display font-bold text-white text-sm sm:text-base leading-snug">
                        {img.label}
                      </h4>
                      <p className="text-[11px] text-white/70 mt-1 leading-snug opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-12 transition-all duration-300 overflow-hidden">
                        {img.desc}
                      </p>
                    </div>

                    {/* Hover indicator corner border */}
                    <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 rounded-3xl transition-colors pointer-events-none" />
                  </motion.div>
                );
              })}

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute top-[80%] lg:top-[75%] right-[10%] lg:right-[15%] w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep flex items-center justify-center shadow-2xl shadow-neon-gold/40 z-30 animate-float-gentle pointer-events-none"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-center text-cosmos">
                  <div className="font-display font-bold text-lg">5-star</div>
                  <div className="text-[9px] uppercase tracking-widest font-semibold">Trusted</div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA Banner ---------- */
function CTABanner({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <section id="contact" className="pt-12 pb-32 lg:pt-16 lg:pb-48 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center z-10 -translate-y-10 lg:-translate-y-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-neon-gold text-[11px] uppercase tracking-widest font-semibold mb-6"><Zap className="w-3.5 h-3.5" /> Lock Your Entry</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
            <KineticText text="Your next story begins" />
            <br /><span className="gold-shimmer"><KineticText text="with a single subscription." delay={0.4} /></span>
          </h2>
          <p className="mt-6 text-lg text-ink/70 max-w-2xl mx-auto font-semibold">Join thousands of travelers who trust BEDUINE for AI-curated journeys, transparent draws, and guaranteed value.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button onClick={() => onSelectPlan('Silver')} className="cursor-pointer border-none bg-transparent p-0">
              <ParticleButton variant="gold" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base">
                <Crown className="w-5 h-5" /> Lock Your Entry <ChevronRight className="w-5 h-5" />
              </ParticleButton>
            </button>
            <a href="tel:+918768903565" data-magnetic><ParticleButton variant="cyan" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold"><Phone className="w-4 h-4" /> +91 87689 03565</ParticleButton></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Membership Inquiry Form ---------- */
function MembershipInquiryForm({ onStartRegistration }: { onStartRegistration: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    plan: 'Silver Domestic - ₹499',
    city: '',
    is18Plus: false,
    agreeTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.is18Plus || !formData.agreeTerms) {
      alert("Please confirm you are 18+ and agree to the Terms & Conditions.");
      return;
    }
    onStartRegistration(formData);
  };

  return (
    <section id="join" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 relative z-10">
        <Reveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-cyan font-semibold mb-4">
              <div className="w-8 h-px bg-cyan" /> Join Beduin <div className="w-8 h-px bg-cyan" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight">
              Membership Registration
            </h2>
            <p className="mt-4 text-ink/70 text-sm">
              Ready to start? Fill in the details below to begin your sign-up verification. Active 18+ status is required.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass rounded-3xl p-8 lg:p-10 border border-slate-line/80 shadow-2xl relative">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    required
                    placeholder="e.g. Rahul Sen"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-cosmos border border-slate-300 text-ink text-sm outline-none focus:border-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="mobileNumber">Mobile Number</label>
                  <input 
                    type="tel" 
                    id="mobileNumber" 
                    required
                    placeholder="e.g. +91 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-cosmos border border-slate-300 text-ink text-sm outline-none focus:border-cyan transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="emailAddress">Email Address</label>
                  <input 
                    type="email" 
                    id="emailAddress" 
                    required
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-cosmos border border-slate-300 text-ink text-sm outline-none focus:border-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="cityLocation">City / Location</label>
                  <input 
                    type="text" 
                    id="cityLocation" 
                    required
                    placeholder="e.g. Kolkata, Fulia"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-cosmos border border-slate-300 text-ink text-sm outline-none focus:border-cyan transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-ink/60 font-semibold mb-2" htmlFor="planSelection">Select Subscription Plan</label>
                <select 
                  id="planSelection" 
                  value={formData.plan}
                  onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-cosmos border border-slate-300 text-ink text-sm outline-none focus:border-cyan transition-colors font-semibold"
                >
                  <option>Silver Domestic - ₹499</option>
                  <option disabled>Gold Domestic - ₹799 (Coming Soon)</option>
                  <option disabled>Platinum Domestic - ₹1499 (Coming Soon)</option>
                  <option disabled>Silver International - ₹4999 (Coming Soon)</option>
                  <option disabled>Gold International - ₹7999 (Coming Soon)</option>
                  <option disabled>Platinum International - ₹14999 (Coming Soon)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-sm text-ink/75">
                  <input 
                    type="checkbox" 
                    checked={formData.is18Plus}
                    onChange={(e) => setFormData({...formData, is18Plus: e.target.checked})}
                    className="mt-1 accent-cyan w-4 h-4"
                  />
                  <span>I confirm that I am <strong>18 years of age or older</strong> and possess a valid government ID.</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-sm text-ink/75">
                  <input 
                    type="checkbox" 
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                    className="mt-1 accent-cyan w-4 h-4"
                  />
                  <span>I agree to the <a href="#terms" className="text-cyan underline font-semibold">Terms & Conditions</a> of Beduin Tour & Travels.</span>
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 premium-register-btn text-white font-bold rounded-full text-sm uppercase tracking-wider cursor-pointer border-none"
                >
                  Proceed to Register
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Terms And Conditions Accordion ---------- */
function TermsAndConditions() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sections = [
    {
      id: 'A',
      title: 'A. Membership & Subscription Rules',
      content: `1. Subscription plans are available only to individuals aged 18 years or above.
2. Each subscription is valid for a period of 12 (Twelve) months from the date of activation.
3. Subscription fees are strictly non-refundable and non-transferable.
4. A subscription will be activated only after successful payment verification, mobile number verification, and KYC verification (if required).
5. A customer may purchase multiple subscriptions under the same name, subject to company approval.
6. All subscription benefits are applicable only to active subscribers.`
    },
    {
      id: 'B',
      title: 'B. Lucky Draw Rules',
      content: `7. Each subscription includes 1 (One) Lucky Draw Credit (LDC).
8. Only active subscribers are eligible to participate in the Lucky Draw.
9. The Lucky Draw will be conducted through a Random Number Generator (RNG) or any other approved automated digital system.
10. The Company's decision regarding winner selection shall be final and binding.
11. Lucky Draw results cannot be challenged, modified, or reconsidered once announced.
12. In case of technical issues, system failures, force majeure events, or unforeseen circumstances, the Company reserves the right to postpone, reschedule, or modify the draw.
13. A minimum of 5% of the total valid participants will be selected as winners every week, using the "Round-Up" rule.
14. The draw may be conducted live, recorded, or through an automated digital platform.
15. Winner announcements may be published through the Company Website, Mobile App, Social Media Platforms, SMS, Email, or any other official communication channel.`
    },
    {
      id: 'C',
      title: 'C. Winner Benefits & Conditions',
      content: `16. Winner Tour benefits cannot be exchanged for cash or any monetary compensation.
17. Winner Tour benefits cannot be exchanged for any other tour package, service, voucher, or offer.
18. Winner Tours will be conducted only on destinations, dates, and itineraries selected by the Company.
19. Winners must confirm their participation within 15 days of the announcement or invitation. Failure to do so may result in cancellation of the benefit.
20. If a winner fails to join the allocated tour, the benefit shall be considered forfeited.
21. Winner Tour benefits are non-transferable except where Name Change benefits are specifically allowed under the subscriber's plan.
22. Winners must provide valid government-issued identification before joining the tour.
23. The Company reserves the sole right to determine destinations, hotels, transportation, sightseeing schedules, and tour inclusions.
24. A subscriber may avail Winner Tour benefits only once during the validity period of a subscription.`
    },
    {
      id: 'D',
      title: 'D. Name Change Policy',
      content: `25. No Name Change facility is available under the Silver Plan.
26. Gold Plan subscribers are entitled to one (1) Name Change for an eligible family member.
27. Platinum Plan subscribers are entitled to two (2) Name Changes for eligible family members.
28. Family Members include:
   - Spouse
   - Parents
   - Children
   - Brother
   - Sister
29. All Name Change requests are subject to verification and approval by the Company.`
    },
    {
      id: 'E',
      title: 'E. Discount Credit (DC) Policy',
      content: `General Rules:
30. 1 Discount Credit (DC) = 1 Person = ₹500 Discount.
31. A maximum of one (1) Discount Credit can be used per person per tour booking.
32. Multiple Discount Credits cannot be combined for a single person's tour cost.
33. Discount Credits are applicable only on Beduin Tour & Travels Paid Tour Packages.
34. Discount Credits cannot be redeemed for cash.
35. Discount Credits cannot be sold, transferred, exchanged, or resold.
36. Unused Discount Credits automatically expire upon subscription expiry.

Silver Plan (1 DC):
37. 1 DC = 1 Tour Booking (Subscriber Only). The subscriber may use the credit for one paid tour booking and receive a flat ₹500 discount.

Gold Plan (2 DC):
38. Option A – Two Separate Tours:
   - 2 DC may be used for two separate tour bookings by the subscriber, OR one approved Name Change for an eligible family member.
39. Option B – Two Persons in One Tour:
   - The subscriber may use 2 DC for Subscriber + 1 Family Member/Friend in the same tour. (1 DC = Subscriber, 1 DC = Additional Person). Example: Subscriber + Spouse, Subscriber + Child, Subscriber + Friend.

Platinum Plan (4 DC):
40. Option A – Four Separate Tours:
   - 4 DC may be used for four separate tour bookings by the subscriber, OR up to two approved Name Changes for eligible family members.
41. Option B – Four Persons in One Tour:
   - The subscriber may use 4 DC for Subscriber + 3 Family Members/Friends in the same tour (e.g., Subscriber + Spouse + Two Children, Subscriber + Three Friends, Subscriber + Two Family Members + One Friend).
42. Option C – Two Persons in Two Separate Tours:
   - The subscriber may use 4 DC for Tour 1 (Subscriber + 1 Family Member/Friend) and Tour 2 (Subscriber + 1 Family Member/Friend).`
    },
    {
      id: 'F',
      title: 'F. Domestic & International Discount Credit Policy',
      content: `43. Domestic Membership Discount Credits can only be used for Domestic Paid Tour Packages.
44. International Membership Discount Credits can only be used for International Paid Tour Packages.
45. Domestic Discount Credits cannot be used for International Tours, and International Discount Credits cannot be used for Domestic Tours.`
    },
    {
      id: 'G',
      title: 'G. Tour Operations & Travel Rules',
      content: `46. The Company reserves the right to determine and modify tour schedules, routes, hotels, transportation, and services whenever necessary.
47. Tours may be postponed, rescheduled, merged, or cancelled if the minimum required number of participants is not achieved.
48. Tour schedules, itineraries, or destinations may be altered due to weather conditions, natural disasters, political unrest, strikes, road closures, pandemics, government regulations, or any force majeure event.
49. Any personal expenses, including but not limited to shopping, laundry, room service, personal transportation, medical expenses, and optional activities, shall be borne by the subscriber.`
    },
    {
      id: 'H',
      title: 'H. Travel Insurance Policy',
      content: `50. Travel insurance benefits shall be governed by the terms and conditions of the respective insurance provider.
51. Beduin Tour & Travels shall not be responsible for any insurance claim approval, rejection, settlement, or dispute.`
    },
    {
      id: 'I',
      title: 'I. Fraud Prevention & Misuse Policy',
      content: `52. Any false, misleading, incomplete, or fraudulent information may result in suspension or termination of the subscription.
53. The Company reserves the right to cancel memberships found involved in duplicate registrations, fake payments, fraudulent activities, or attempts to manipulate the system.
54. No refund shall be provided in such cases.`
    },
    {
      id: 'J',
      title: 'J. Liability Disclaimer',
      content: `55. Beduin Tour & Travels shall not be held liable for accidents, illness, injury, theft, loss of personal belongings, natural disasters, delays, cancellations, or any third-party negligence during travel.
56. Subscribers are solely responsible for complying with local laws, regulations, and authorities during their travels.`
    },
    {
      id: 'K',
      title: 'K. Marketing & Publicity Rights',
      content: `57. Winners and participants grant Beduin Tour & Travels the right to use their names, photographs, videos, testimonials, and tour experiences for promotional, marketing, and advertising purposes.
58. By purchasing a subscription, the subscriber provides consent for such usage without any additional compensation.`
    },
    {
      id: 'L',
      title: 'L. Legal & Compliance',
      content: `59. The Beduin Lucky Draw Program is a promotional membership benefit program and shall not be considered a lottery, gambling, betting, or wagering activity.
60. The Company reserves the right to amend, modify, suspend, or update these Terms & Conditions at any time without prior notice.
61. Any dispute arising from the subscription program shall be subject to the exclusive jurisdiction of the courts of Nadia, West Bengal, India.
62. By purchasing and activating a subscription, the subscriber confirms that they have read, understood, and agreed to all the Terms & Conditions mentioned above.`
    }
  ];

  return (
    <section id="terms" className="relative py-14 lg:py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-5 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4">
              <div className="w-8 h-px bg-neon-gold" /> Legal & Policy <div className="w-8 h-px bg-neon-gold" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-ink leading-tight">
              Terms & Conditions
            </h2>
            <p className="mt-4 text-ink/70 text-sm max-w-2xl mx-auto font-mono">
              "Choose Your Plan. Try Your Luck. Travel Beyond Limits."
            </p>
          </div>
        </Reveal>

        {/* Recommended Legal Review Alert */}
        <Reveal>
          <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex items-start gap-3">
            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Important Notice:</span> Please read the Beduin Tour & Travels Subscription Membership Terms & Conditions carefully.
            </div>
          </div>
        </Reveal>

        {/* Accordion List */}
        <div className="space-y-3">
          {sections.map((sec, index) => {
            const isOpen = activeIndex === index;
            return (
              <Reveal key={sec.id} delay={index * 0.05}>
                <div className="glass rounded-2xl border border-slate-line/80 overflow-hidden hover:neon-border-gold transition-all">
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-ink select-none outline-none focus:bg-white/10 cursor-pointer border-none bg-transparent"
                    aria-expanded={isOpen}
                  >
                    <span>{sec.title}</span>
                    <ChevronRight className={`w-4 h-4 text-[#0096C7] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 border-t border-slate-line/50 text-ink/80 text-sm leading-relaxed whitespace-pre-line">
                          {sec.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Subject to policy banner */}
        <Reveal>
          <div className="mt-8 text-center text-xs text-ink/50 leading-relaxed font-mono">
            * Official Disclaimer: Beduin Tour & Travels reserves the right to modify tour destinations, schedules, benefits, offers, and operational policies whenever necessary for business, operational, safety, legal, or logistical reasons. All decisions taken by the Company in such matters shall be considered final and binding.
            <br />
            <span className="mt-2 block font-bold text-[#0096C7] text-sm font-display">"Safar Jo Yaad Rahe."</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
interface FooterProps {
  setView?: (v: 'landing' | 'login' | 'register' | 'terms' | 'dashboard') => void;
}

function Footer({ setView }: FooterProps) {
  const company = [
    { label: 'About BEDUINE', href: '#about' },
    { label: 'Our Story', href: '#about' },
    { label: 'Leadership', href: '#about' },
    { label: 'Careers', href: 'https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20am%20interested%20in%20career%20opportunities.' },
    { label: 'Press & Media', href: 'https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20have%20a%20press%20inquiry.' },
  ];
  const trust = [
    { label: 'Operational Integrity', href: '#audit' },
    { label: 'Digital Audit Archive', href: '#audit' },
    { label: 'Lucky Draw Rules', href: '#luckydraw' },
    { label: 'Regulatory Compliance', href: '#audit' },
    { label: 'RNG Certification', href: '#audit' },
  ];
  const support = [
    { label: 'Help Center', href: 'https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20need%20help.' },
    { label: 'Refund Policy', href: '#terms' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Privacy Policy', href: '#terms' },
    { label: 'Grievance Officer', href: 'https://wa.me/918768903565?text=Hello%20BEDUINE%2C%20I%20have%20a%20grievance.' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#terms' && setView) {
      e.preventDefault();
      setView('terms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#030C15] border-t border-slate-900/80 pt-16 pb-10 relative z-20">
      <StarField count={40} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900/80">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos flex items-center justify-center p-1.5">
                <img src="/images/bedune_logo_cropped.png" alt="BEDUINE Logo" className="w-full h-full object-contain" />
              </div>
              <div><div className="font-display text-xl font-bold text-white">BEDUINE</div><div className="text-[10px] uppercase tracking-[0.22em] neon-cyan">Tour & Travels</div></div>
            </div>
            <p className="font-serif italic text-neon-gold text-lg mb-3">Safar jo yaad rahe.</p>
            <p className="text-sm text-[#D8E4EA] leading-relaxed max-w-sm mb-6 opacity-85">India's subscription-first travel company - built on transparency, guaranteed value, and journeys that live forever.</p>
            <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
              <MapPin className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
              <div className="text-sm text-[#D8E4EA] leading-relaxed"><div className="font-semibold text-white">Registered Office</div>Fulia, Nadia,<br />West Bengal, India<br />Pin - 741402</div>
            </div>
          </div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest">Company</div><ul className="space-y-2.5">{company.map((l) => <li key={l.label}><a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noreferrer' : undefined} onClick={(e) => handleLinkClick(e, l.href)} data-magnetic className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all">{l.label}</a></li>)}</ul></div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest">Trust</div><ul className="space-y-2.5">{trust.map((l) => <li key={l.label}><a href={l.href} onClick={(e) => handleLinkClick(e, l.href)} data-magnetic className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all">{l.label}</a></li>)}</ul></div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest">Support</div><ul className="space-y-2.5">{support.map((l) => <li key={l.label}><a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noreferrer' : undefined} onClick={(e) => handleLinkClick(e, l.href)} data-magnetic className="text-sm text-[#AFC0CA] hover:text-[#18D7F2] transition-all">{l.label}</a></li>)}</ul></div>
          <div className="lg:col-span-2">
            <div className="font-display font-bold text-white mb-4 text-xs uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-neon-gold" /> Audit Archive</div>
            <ul className="space-y-2.5">
              {AUDIT_REPORTS.map((a) => <li key={a.week}><a href="#" data-magnetic className="group flex items-center gap-2 text-sm text-[#AFC0CA] hover:text-neon-gold transition-all"><Download className="w-3 h-3 opacity-50 group-hover:opacity-100" /><span className="text-xs font-mono">{a.week}</span></a></li>)}
              <li className="pt-2"><a href="#audit" onClick={(e) => handleLinkClick(e, '#audit')} className="text-xs font-semibold neon-cyan inline-flex items-center gap-1 font-mono">&gt; full_archive() <ArrowRight className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#AFC0CA] uppercase tracking-widest">Connect</span>
            <div className="flex gap-2">{[Video, Camera, Send, Tv, Share2].map((Icon, i) => <a key={i} href="#" data-magnetic className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-cyan/50 hover:bg-cyan/10 transition-all text-[#D8E4EA]"><Icon className="w-4 h-4" /></a>)}</div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#AFC0CA]/60">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-neon-gold" /> RNG Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-cyan" /> E2E Encrypted</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-neon-gold" /> Audited</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-900/80 text-center text-xs text-[#AFC0CA]/40 font-mono">
          (c) 2026 BEDUINE Tour & Travels. - <a href="#terms" onClick={(e) => handleLinkClick(e, '#terms')} className="hover:text-cyan">terms</a> - <a href="#terms" onClick={(e) => handleLinkClick(e, '#terms')} className="hover:text-cyan">privacy</a> - <a href="#terms" onClick={(e) => handleLinkClick(e, '#terms')} className="hover:text-cyan">refunds</a>
          <br /><span className="text-[10px] text-amber-500 mt-2 block font-sans">⚠️ 18+ Membership Only. Subscription plans are a promotional benefit program and not a gambling/lottery service. All travel operations are subject to company policy.</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingButtons() {
  return (
    <div className="hidden lg:flex fixed left-6 bottom-6 flex-col gap-3 z-40">
      <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" data-magnetic className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 transition-transform" title="WhatsApp" style={{ width: 52, height: 52 }}><MessageCircle className="w-5 h-5" /></a>
      <a href="tel:+918768903565" data-magnetic className="w-13 h-13 rounded-full bg-gradient-to-br from-neon-gold to-gold-deep text-cosmos flex items-center justify-center shadow-xl shadow-neon-gold/40 hover:scale-110 transition-transform" title="Call" style={{ width: 52, height: 52 }}><Phone className="w-5 h-5" /></a>
    </div>
  );
}

function MobileSticky({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-4">
      <div className="glass rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/60 border border-slate-line">
        <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <a href="tel:+918768903565" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl glass-light border border-slate-line text-ink text-xs font-bold"><Phone className="w-4 h-4" /> Call</a>
        <button 
          onClick={() => onSelectPlan('Silver')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-neon-gold to-gold text-[#0B1F2E] text-xs font-bold cursor-pointer border-none"
        >
          <Crown className="w-4 h-4" /> Join
        </button>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const [view, setView] = useState<'landing' | 'login' | 'register' | 'terms' | 'dashboard'>('landing');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string>('Silver');
  const [prefilledData, setPrefilledData] = useState<any>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');

  const handleSelectPlan = useCallback((planName: string) => {
    setSelectedPlanName(planName);
    setPrefilledData(null);
    if (currentUser) {
      setView('register');
    } else {
      setPendingPlan(planName);
      setLoginInitialMode('login');
      setView('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUser]);

  const handleStartRegistration = useCallback((data: any) => {
    const prefill = {
      fullName: data.name,
      mobile: data.mobile,
      email: data.email,
      city: data.city,
      is18Plus: data.is18Plus,
      agreeTerms: data.agreeTerms,
    };
    setPrefilledData(prefill);
    
    // Parse selection from "Silver Domestic - ₹499" format
    const planPart = data.plan.split(' ')[0];
    const isIntl = data.plan.toLowerCase().includes('international');
    const finalPlanName = planPart + (isIntl ? ' International' : '');
    setSelectedPlanName(finalPlanName);
    
    if (currentUser) {
      setView('register');
    } else {
      setPendingPlan(finalPlanName);
      setLoginInitialMode('login');
      setView('login');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentUser]);


  // Manage body cursor visibility: default cursor during intro, hidden after intro for the custom cursor
  useEffect(() => {
    if (!introComplete) {
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = 'none';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [introComplete]);

  return (
    <div className="min-h-screen bg-cosmos text-ink relative">
      <AnimatePresence>{!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}</AnimatePresence>
      
      {introComplete && <ScrollProgress />}
      {introComplete && <CustomCursor />}

      {/* Main page content container - invisible during intro to prevent menu leak, then fades in beautifully */}
      <div className={`transition-opacity duration-700 ${introComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="noise fixed inset-0 pointer-events-none z-30" />
        <Navbar 
          view={view} 
          setView={setView} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser}
          setLoginInitialMode={setLoginInitialMode}
        />

        <main className="relative z-10 flex flex-col gap-0">
          {view === 'landing' ? (
            <>
              <Hero />
              <TrustStrip />

              <div className="relative video-bg-container">
                {/* Cinematic fixed background video: constrained to screen width/height to prevent stretching and pixelation. */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/images/beduine_travel_hero_1779521651766.png"
                  className="fixed inset-0 w-full h-full object-cover pointer-events-none"
                  style={{
                    zIndex: 0,
                    transform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform'
                  }}
                >
                  <source src="/images/hero_bg_video.mp4" type="video/mp4" />
                </video>
                 {/* Clear cinematic overlay for text readability */}
                <div
                  className="fixed inset-0 pointer-events-none"
                  style={{
                    zIndex: 1,
                    background: `
                       linear-gradient(180deg, rgba(3,12,22,0.35) 0%, rgba(3,12,22,0.24) 24%, rgba(3,12,22,0.2) 62%, rgba(3,12,22,0.35) 100%)
                    `,
                  }}
                />
                {/* Subtle teal atmosphere glow - optimized without expensive fullscreen mix-blend-mode */}
                <div
                  className="fixed inset-0 pointer-events-none"
                  style={{
                    zIndex: 1,
                    background: 'radial-gradient(ellipse at 50% 28%, rgba(24,215,242,0.07) 0%, rgba(8,31,45,0.04) 38%, transparent 82%)',
                  }}
                />

                <div className="relative z-10 flex flex-col gap-8 lg:gap-12">
                  <ScrollRoundedSection><AboutUs /></ScrollRoundedSection>
                  <ScrollRoundedSection><Journey /></ScrollRoundedSection>
                  <ScrollRoundedSection><HowItWorks /></ScrollRoundedSection>
                  <ScrollRoundedSection><Plans onSelectPlan={handleSelectPlan} /></ScrollRoundedSection>
                  <ScrollRoundedSection><InternationalPlans onSelectPlan={handleSelectPlan} /></ScrollRoundedSection>
                  <ScrollRoundedSection><LuckyDrawSystem /></ScrollRoundedSection>
                  <ScrollRoundedSection><CreditArchitecture activePlan={null} ldcTokens={0} discountCredits={0} /></ScrollRoundedSection>
                  <ScrollRoundedSection><NonWinnerGuarantee /></ScrollRoundedSection>
                  <Destinations />
                  <ScrollRoundedSection><Winners /></ScrollRoundedSection>
                  <ScrollRoundedSection><Services /></ScrollRoundedSection>
                  <ScrollRoundedSection><Transparency /></ScrollRoundedSection>
                  <ScrollRoundedSection><MembershipInquiryForm onStartRegistration={handleStartRegistration} /></ScrollRoundedSection>
                  <ScrollRoundedSection><CTABanner onSelectPlan={handleSelectPlan} /></ScrollRoundedSection>
                </div>
              </div>
            </>
          ) : view === 'login' ? (
            <LoginPage 
              initialMode={loginInitialMode}
              onRedirectToRegister={() => {
                setView('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                setPendingPlan(null);
                setView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onLoginSuccess={(user) => {
                setCurrentUser(user);
                if (pendingPlan) {
                  setSelectedPlanName(pendingPlan);
                  setView('register');
                  setPendingPlan(null);
                } else {
                  setView('dashboard');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : view === 'register' ? (
            <RegistrationPage 
              initialPlanName={selectedPlanName} 
              prefilledData={prefilledData}
              currentUser={currentUser}
              onRedirectToLogin={() => {
                setPendingPlan(selectedPlanName);
                setView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBack={() => {
                setPrefilledData(null);
                setView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onRegisterSuccess={(userData) => {
                setCurrentUser(userData);
                setView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : view === 'dashboard' ? (
            <DashboardPage 
              user={currentUser} 
              onLogout={() => {
                setCurrentUser(null);
                setView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            <div className="pt-24 lg:pt-32 pb-16 min-h-[70vh] flex flex-col items-center">
              <div className="max-w-4xl w-full px-5">
                <button
                  onClick={() => {
                    setView('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mb-8 inline-flex items-center gap-2 text-sm text-[#0096C7] hover:text-[#00B4D8] font-bold transition-all focus:outline-none"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
                </button>
                <div className="glass rounded-3xl p-6 lg:p-12 border border-slate-line/80 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-neon-gold/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <TermsAndConditions />
                </div>
                <div className="mt-8 text-center">
                  <button
                    onClick={() => {
                      setView('landing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="glow-cta px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform inline-flex items-center gap-2"
                  >
                    Agree & Return Home <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        {(view === 'landing' || view === 'terms') && <Footer setView={setView} />}
        {view === 'landing' && <FloatingButtons />}
        {view === 'landing' && <MobileSticky onSelectPlan={handleSelectPlan} />}
        {view === 'landing' && (
          <button 
            onClick={() => handleSelectPlan('Silver')}
            className="choose-btn hidden lg:inline-flex cursor-pointer border-none bg-transparent p-0"
          >
            <ParticleButton variant="gold" className="px-5 py-3 rounded-full font-bold text-sm shadow-xl shadow-neon-gold/30 flex items-center gap-1.5 hover:scale-110 transition-transform">
              <Crown className="w-4 h-4" /> Choose Plan
            </ParticleButton>
          </button>
        )}
      </div>
    </div>
  );
}
