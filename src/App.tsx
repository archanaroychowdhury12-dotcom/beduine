import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useInView, useTransform } from 'framer-motion';
import {
  Compass, Sparkles, Gift, CreditCard, Award, ShieldCheck,
  ChevronRight, CheckCircle2, Check, Star,
  Phone, Calendar, MapPin, Hotel, Train, Plane,
  FileCheck2, Banknote, ArrowRight, Menu, X, MessageCircle,
  Download, Lock, BarChart3, Eye, Target, TrendingUp, Crown,
  Video, Camera, Send, Tv, Share2, FileText,
  BadgeCheck, Zap, Bot, Fingerprint, Scan,
  Heart, Globe, Users, Rocket, Wallet, History, IndianRupee, Info, AlertTriangle,
  Coins, ArrowUpDown, Shield, HeartHandshake
} from 'lucide-react';
import CinematicShowreel from './CinematicShowreel';
import ScatteredShowcase from './ScatteredShowcase';





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
  { id: 'audit', label: 'Transparency' },
  { id: 'contact', label: 'Contact' },
];

const DESKTOP_NAV = [
  { id: 'about', label: 'About' },
  { id: 'plans', label: 'Plans' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'audit', label: 'Trust' },
  { id: 'contact', label: 'Contact' },
];

const PLANS = [
  {
    name: 'Silver', price: 499, tagline: 'Smart Starter', icon: Star,
    color: 'from-slate-500 to-slate-700', glow: 'slate',
    tourValue: 3000, duration: '2N / 3D', discountCredits: 1, discountValue: 500,
    paidDiscount: 'Member rate', insurance: 'Payable', nameChange: 'Not available',
    image: '/images/sundarbans_mangrove_1779521789593.png',
    imageLabel: 'Sundarbans · Boat Safari',
    destinations: ['Sundarbans (Boat Safari + Tiger Reserve)', 'Bakkhali (Beach Escape)', 'Mousuni Island (Sea & Camping)', 'Mukutmanipur (Dam, Hills & Lake)'],
    benefits: ['1 Weekly Reward Draw entry', 'Winner tour value up to ₹3,000', '1 × ₹500 discount credit if not selected', 'Member-only rates on paid tours', '12-month subscription validity', 'Pickup & drop from selected points'],
  },
  {
    name: 'Emerald', price: 799, tagline: 'Balanced Choice', icon: Award,
    color: 'from-teal-400 to-emerald-600', glow: 'teal',
    tourValue: 5000, duration: '2N / 3D', discountCredits: 2, discountValue: 1000,
    paidDiscount: 'Member rate', insurance: '50% off', nameChange: 'One time',
    image: '/images/darjeeling_tea_1779521805614.png',
    imageLabel: 'Darjeeling · Tea Gardens',
    destinations: ['Darjeeling (Toy Train + Tiger Hill Sunrise)', 'Dooars (Jungle Safari + Tea Gardens)', 'Puri + Konark (Jagannath + Sun Temple)', 'Vizag + Araku Valley (Beach + Hills)'],
    benefits: ['1 Weekly Reward Draw entry', 'Winner tour value up to ₹5,000', '2 × ₹500 discount credits if not selected', 'Member-only rates on paid tours', 'Travel insurance at 50% off', 'One-time family name change allowed'],
  },
  {
    name: 'Platinum', price: 1499, tagline: 'Premium Experience', icon: Crown,
    color: 'from-indigo-400 via-purple-500 to-fuchsia-500', glow: 'purple',
    featured: true, tourValue: 10000, duration: '3N / 4D',
    discountCredits: 4, discountValue: 2000,
    paidDiscount: 'Member rate', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/kashmir_dal_lake_1779521728036.png',
    imageLabel: 'Kashmir · Dal Lake',
    destinations: ['Kashmir (Srinagar · Gulmarg · Pahalgam)', 'Rajasthan (Jaipur · Udaipur · Jaisalmer)', 'Kerala (Munnar · Alleppey · Kovalam)', 'Himachal (Shimla · Manali Circuit)'],
    benefits: ['1 Weekly Reward Draw entry', 'Winner tour value up to ₹10,000', '4 × ₹500 discount credits if not selected', 'Member-only rates on paid tours', 'Complimentary travel insurance', 'Two family name changes allowed', 'Priority quarterly tour batching'],
  },
];

const INTL_PLANS = [
  {
    name: 'Explorer', price: 4999, tagline: 'International Starter', icon: Globe,
    color: 'from-sky-400 to-blue-600', glow: 'blue',
    tourValue: 25000, duration: '3N / 4D', discountCredits: 5, discountValue: 2500,
    paidDiscount: 'Member rate', insurance: '50% off', nameChange: 'One time',
    image: '/images/dubai_skyline_1779539448313.png',
    imageLabel: 'Dubai · Skyline & Dunes',
    destinations: ['Dubai (Burj Khalifa · Desert Safari · Marina)', 'Thailand (Bangkok · Pattaya · Floating Market)', 'Sri Lanka (Colombo · Kandy · Sigiriya)', 'Nepal (Kathmandu · Pokhara · Chitwan)'],
    benefits: ['1 Monthly Reward Draw entry', 'Winner tour value up to ₹25,000', '5 × ₹500 discount credits if not selected', 'Member-only rates on international tours', 'Travel insurance at 50% off', 'One-time name change allowed', 'Visa assistance included'],
  },
  {
    name: 'Voyager', price: 7999, tagline: 'Premium Explorer', icon: Plane,
    color: 'from-emerald-400 to-teal-600', glow: 'teal',
    featured: true, tourValue: 50000, duration: '4N / 5D', discountCredits: 8, discountValue: 4000,
    paidDiscount: 'VIP rate', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/singapore_skyline_1779539502293.png',
    imageLabel: 'Singapore · City of Future',
    destinations: ['Singapore (Gardens by the Bay · Sentosa · Marina Bay)', 'Malaysia (Kuala Lumpur · Langkawi · Genting)', 'Bali (Ubud · Kuta · Tanah Lot · Uluwatu)', 'Vietnam (Hanoi · Ha Long Bay · Ho Chi Minh)'],
    benefits: ['1 Monthly Reward Draw entry', 'Winner tour value up to ₹50,000', '8 × ₹500 discount credits if not selected', 'VIP rates on all international tours', 'Complimentary travel insurance', 'Two name changes allowed', 'Visa assistance + Airport lounge access', 'Priority tour batching'],
  },
  {
    name: 'Globetrotter', price: 14999, tagline: 'Ultimate World Pass', icon: Rocket,
    color: 'from-rose-400 via-pink-500 to-violet-600', glow: 'pink',
    tourValue: 100000, duration: '5N / 6D', discountCredits: 15, discountValue: 7500,
    paidDiscount: 'VIP rate', insurance: 'Included free', nameChange: 'Unlimited',
    image: '/images/maldives_overwater_1779539482305.png',
    imageLabel: 'Maldives · Paradise',
    destinations: ['Maldives (Overwater Villa · Snorkeling · Sunset Cruise)', 'Europe (Paris · Switzerland · Rome · Barcelona)', 'Turkey (Istanbul · Cappadocia · Pamukkale)', 'Japan (Tokyo · Kyoto · Osaka · Mount Fuji)'],
    benefits: ['1 Monthly Reward Draw entry', 'Winner tour value up to ₹1,00,000', '15 × ₹500 discount credits if not selected', 'VIP rates on all international tours', 'Premium travel insurance', 'Unlimited name changes', 'Full visa processing + Airport lounge', 'Dedicated travel concierge', 'Priority booking & upgrades'],
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
  { week: 'Week 42 · 2026', status: 'Published', date: '19 Oct 2026' },
  { week: 'Week 41 · 2026', status: 'Published', date: '12 Oct 2026' },
  { week: 'Week 40 · 2026', status: 'Published', date: '05 Oct 2026' },
  { week: 'Week 39 · 2026', status: 'Published', date: '28 Sep 2026' },
];

const DESTINATIONS = [
  // Weekend Escapes
  { name: 'Sundarbans', tag: 'Tiger Reserve · Mangrove Boats', duration: '2N/3D', rating: 4.7, season: 'Oct – Mar', img: '/images/sundarbans_mangrove_premium.png', category: 'escapes', planBadge: 'Silver+' },
  { name: 'Bakkhali Beach', tag: 'Casuarina Shore · Delta Sunset', duration: '1N/2D', rating: 4.6, season: 'Oct – Apr', img: '/images/bakkhali_beach_premium.png', category: 'escapes', planBadge: 'Silver+' },
  { name: 'Mousuni Island', tag: 'Seaside Camp · Huts & Palms', duration: '1N/2D', rating: 4.5, season: 'Nov – Mar', img: '/images/mousuni_island_premium.png', category: 'escapes', planBadge: 'Silver+' },
  { name: 'Mukutmanipur', tag: 'Hills, Forests & Kangsabati Dam', duration: '1N/2D', rating: 4.5, season: 'Oct – Mar', img: '/images/mukutmanipur.png', category: 'escapes', planBadge: 'Silver+' },

  // Hill & Tea Trails
  { name: 'Darjeeling', tag: 'Tiger Hill Sunrise · Tea Estates', duration: '3N/4D', rating: 4.8, season: 'Mar – Jun', img: '/images/darjeeling_tea_1779521805614.png', category: 'trails', planBadge: 'Gold+' },
  { name: 'Dooars Safari', tag: 'Forest Huts · River Wilds', duration: '2N/3D', rating: 4.6, season: 'Sep – Apr', img: '/images/dooars_safari.png', category: 'trails', planBadge: 'Gold+' },
  { name: 'Shimla & Manali', tag: 'Mall Road · Solang Valley Adventure', duration: '5N/6D', rating: 4.9, season: 'Oct – May', img: '/images/himachal_hills.png', category: 'trails', planBadge: 'Platinum+' },
  { name: 'Kashmir', tag: 'Paradise on Earth · Dal Lake & Houseboats', duration: '4N/5D', rating: 4.9, season: 'Apr – Oct', img: '/images/kashmir_dal_lake_1779521728036.png', category: 'trails', planBadge: 'Platinum+' },
  { name: 'Vizag & Araku', tag: 'Araku Coffee Gardens & Borra Caves', duration: '3N/4D', rating: 4.7, season: 'Oct – Mar', img: '/images/vizag_araku.png', category: 'trails', planBadge: 'Gold+' },

  // Royal India Tours
  { name: 'Rajasthan Royal', tag: 'Jaipur · Udaipur · Desert Dunes', duration: '5N/6D', rating: 4.8, season: 'Oct – Mar', img: '/images/rajasthan_palace_1779521744228.png', category: 'royal', planBadge: 'Gold+' },
  { name: 'Kerala Backwaters', tag: 'Houseboats · Munnar Hills', duration: '4N/5D', rating: 4.9, season: 'Sep – Mar', img: '/images/kerala_houseboat_1779521772928.png', category: 'royal', planBadge: 'Gold+' },
  { name: 'Puri & Konark', tag: 'Sun Temple · Golden Beach', duration: '3N/4D', rating: 4.7, season: 'Oct – Mar', img: '/images/puri_konark.png', category: 'royal', planBadge: 'Silver+' },
  { name: 'Goa', tag: 'Sun-kissed Beaches · Heritage & Nightlife', duration: '3N/4D', rating: 4.8, season: 'Oct – May', img: '/images/goa_beaches.png', category: 'royal', planBadge: 'Gold+' },

  // Premium International Trips
  { name: 'Dubai', tag: 'Burj Khalifa · Desert Safaris', duration: '4N/5D', rating: 4.9, season: 'Nov – Mar', img: '/images/dubai_skyline_1779539448313.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Singapore', tag: 'Sentosa · Gardens by the Bay', duration: '4N/5D', rating: 4.8, season: 'Year-round', img: '/images/singapore_skyline_1779539502293.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Maldives', tag: 'Overwater Bungalows · Reefs', duration: '4N/5D', rating: 4.9, season: 'Nov – Apr', img: '/images/maldives_overwater_1779539482305.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Thailand', tag: 'Bangkok Temples & Pattaya Beaches', duration: '4N/5D', rating: 4.7, season: 'Nov – Apr', img: '/images/thailand.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Sri Lanka', tag: 'Sigiriya Rock Fortress & Kandy Hills', duration: '4N/5D', rating: 4.6, season: 'Dec – Apr', img: '/images/sri_lanka.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Nepal', tag: 'Kathmandu Valley & Himalayan Pokhara', duration: '3N/4D', rating: 4.7, season: 'Sep – Nov', img: '/images/nepal.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Malaysia', tag: 'Kuala Lumpur Skyline & Langkawi', duration: '4N/5D', rating: 4.7, season: 'Year-round', img: '/images/malaysia.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Bali', tag: 'Ubud Rice Terraces & Uluwatu Temple', duration: '4N/5D', rating: 4.9, season: 'Apr – Oct', img: '/images/bali.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Vietnam', tag: 'Halong Bay Cruise & Hanoi Old Quarter', duration: '5N/6D', rating: 4.8, season: 'Nov – Apr', img: '/images/vietnam.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Europe', tag: 'Paris Eiffel Tower & Swiss Alps', duration: '7N/8D', rating: 4.9, season: 'May – Sep', img: '/images/europe.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Turkey', tag: 'Cappadocia Balloons & Pamukkale Pools', duration: '5N/6D', rating: 4.8, season: 'Apr – Oct', img: '/images/turkey.png', category: 'intl', planBadge: 'Platinum+' },
  { name: 'Japan', tag: 'Tokyo Neon & Kyoto Cherry Blossoms', duration: '6N/7D', rating: 4.9, season: 'Mar – May', img: '/images/japan.png', category: 'intl', planBadge: 'Platinum+' },
];

const WINNERS_DATA = [
  { name: 'Ananya Das', plan: 'Platinum', dest: 'Kashmir', week: 'Week 42', img: '/images/winner_ananya_das.png', destImg: '/images/kashmir_dal_lake_1779521728036.png' },
  { name: 'Rajesh Kumar', plan: 'Emerald', dest: 'Darjeeling', week: 'Week 41', img: '/images/winner_rajesh_kumar.png', destImg: '/images/darjeeling_tea_1779521805614.png' },
  { name: 'Priya Sen', plan: 'Silver', dest: 'Sundarbans', week: 'Week 40', img: '/images/winner_priya_sen.png', destImg: '/images/sundarbans_mangrove_1779521789593.png' },
  { name: 'Arjun Roy', plan: 'Platinum', dest: 'Kerala', week: 'Week 39', img: '/images/winner_arjun_roy.png', destImg: '/images/kerala_houseboat_1779521772928.png' },
  { name: 'Meera Bose', plan: 'Emerald', dest: 'Rajasthan', week: 'Week 38', img: '/images/winner_meera_bose.png', destImg: '/images/rajasthan_palace_1779521744228.png' },
  { name: 'Subhadeep Ghosh', plan: 'Platinum', dest: 'Himachal', week: 'Week 37', img: '/images/winner_subhadeep_ghosh.png', destImg: '/images/himachal_hills.png' },
];

const HERO_HUMAN_PROOF = WINNERS_DATA.slice(0, 3);

const JOURNEY_IMAGES = [
  { src: '/images/happy_family_travelers.png', label: 'Happy Families', desc: 'Crafting lifetime memories', badge: 'Silver+', theme: 'cyan' },
  { src: '/images/rajasthan_palace_1779521744228.png', label: 'Royal Rajasthan', desc: 'Golden sands & majestic palaces', badge: 'Gold+', theme: 'gold' },
  { src: '/images/kerala_houseboat_1779521772928.png', label: 'Kerala Backwaters', desc: 'Serene houseboats & palms', badge: 'Silver+', theme: 'cyan' },
  { src: '/images/sundarbans_mangrove_1779521789593.png', label: 'Sundarbans Safari', desc: 'Mysterious mangrove boat trails', badge: 'Silver+', theme: 'gold' },
  { src: '/images/kashmir_dal_lake_1779521728036.png', label: 'Heavenly Kashmir', desc: 'Misty peaks & shikara rides', badge: 'Platinum+', theme: 'violet' }
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

function GoldCheck({ size = 18, variant = 'gold' }: { size?: number; variant?: 'gold' | 'cyan' | 'violet' }) {
  const checkClass = variant === 'cyan' ? 'cyan-check' : variant === 'violet' ? 'violet-check' : 'gold-check';
  return (
    <span className={`inline-flex items-center justify-center rounded-full ${checkClass} shrink-0`} style={{ width: size, height: size }}>
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

function AuroraBackground({ variant = 'cyan' }: { variant?: 'cyan' | 'gold' }) {
  return <div className={`aurora ${variant === 'gold' ? 'aurora-gold' : ''}`} />;
}

function GradientMesh() {
  return <div className="gradient-mesh"><span /><span /><span /></div>;
}

/* ---------- Floating Orbs (animated background) ---------- */
function FloatingOrbs({ count = 5, variant = 'mixed' }: { count?: number; variant?: 'cyan' | 'gold' | 'mixed' }) {
  const orbs = useMemo(() => Array.from({ length: count }).map((_, i) => {
    const colors = variant === 'cyan' ? ['#00D9FF', '#67E8F9'] : variant === 'gold' ? ['#2DD4BF', '#8B5CF6'] : ['#00D9FF', '#2DD4BF', '#A855F7', '#67E8F9', '#8B5CF6'];
    return {
      id: i,
      size: 200 + Math.random() * 300,
      top: Math.random() * 80,
      left: Math.random() * 80,
      color: colors[i % colors.length],
      delay: i * 2,
      duration: 15 + Math.random() * 10,
    };
  }), [count, variant]);
  return (
    <div className="floating-orbs">
      {orbs.map((o) => (
        <div key={o.id} className="orb-particle" style={{
          width: `${o.size}px`, height: `${o.size}px`,
          top: `${o.top}%`, left: `${o.left}%`,
          background: o.color,
          animationDelay: `${o.delay}s`,
          animationDuration: `${o.duration}s`,
        }} />
      ))}
    </div>
  );
}

/* ---------- Wave Background (animated SVG waves) ---------- */
function WaveBackground({ color = 'cyan' }: { color?: 'cyan' | 'gold' | 'mixed' }) {
  const stroke = color === 'cyan' ? '#00D9FF' : color === 'gold' ? '#8B5CF6' : '#A855F7';
  return (
    <div className="wave-bg">
      <svg viewBox="0 0 1440 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M0,150 C240,220 480,80 720,150 C960,220 1200,80 1440,150 L1440,300 L0,300 Z" fill="url(#wave-grad)" opacity="0.5" />
        <path d="M0,180 C240,250 480,110 720,180 C960,250 1200,110 1440,180 L1440,300 L0,300 Z" fill={stroke} opacity="0.15" />
        <path d="M0,210 C240,280 480,140 720,210 C960,280 1200,140 1440,210 L1440,300 L0,300 Z" fill={stroke} opacity="0.1" />
      </svg>
    </div>
  );
}

/* ---------- Morphing Blobs ---------- */
function MorphBlobs() {
  return (
    <>
      <div className="morph-blob" style={{ width: '500px', height: '500px', top: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(0,217,255,0.3), transparent 70%)', animationDelay: '0s' }} />
      <div className="morph-blob" style={{ width: '400px', height: '400px', bottom: '10%', right: '-5%', background: 'radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%)', animationDelay: '5s' }} />
      <div className="morph-blob" style={{ width: '450px', height: '450px', top: '40%', left: '30%', background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)', animationDelay: '10s' }} />
    </>
  );
}

/* ---------- Flowing Lines ---------- */
function FlowingLines({ count = 5 }: { count?: number }) {
  return (
    <div className="flow-lines">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flow-line" style={{ top: `${15 + i * 18}%`, animationDelay: `${i * 1.5}s`, animationDuration: `${6 + i}s`, transform: `rotate(${-5 + i * 3}deg)` }} />
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
  const btnClass = variant === 'gold' ? 'glow-cta' : 'glow-cta-cyan';
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

function StaggerText({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className="stagger-letter" style={{ animationDelay: `${delay + i * 0.05}s` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
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

function LiquidFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden>
      <defs>
        <filter id="liquid-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" seed="3">
            <animate attributeName="baseFrequency" dur="15s" values="0.015 0.02; 0.02 0.025; 0.015 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="20" />
        </filter>
      </defs>
    </svg>
  );
}

/* Custom Cursor */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100, magnetX = 0, magnetY = 0, hovering = false;
    let prevX = -100, prevY = -100;
    let currentAngle = 45;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX; mouseY = e.clientY;
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        const angleRad = Math.atan2(dy, dx);
        let angleDeg = (angleRad * 180) / Math.PI + 90;
        currentAngle = angleDeg;
        prevX = mouseX;
        prevY = mouseY;
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
      if (planeRef.current) {
        planeRef.current.style.transform = `rotate(${currentAngle}deg)`;
      }
    };
    const onMouseDown = () => {
      document.body.classList.add('cursor-clicked');
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
      <div ref={ringRef} className="cursor-ring" />
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
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1900);
    const t4 = setTimeout(() => setPhase(4), 2700);
    const t5 = setTimeout(() => onComplete(), 3100);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onComplete]);

  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => {
    const angle = (i / 40) * Math.PI * 2;
    const radius = 400 + Math.random() * 200;
    return { id: i, startX: Math.cos(angle) * radius, startY: Math.sin(angle) * radius, isCyan: i % 3 === 0, delay: i * 0.015 };
  }), []);

  return (
    <motion.div className="fixed inset-0 z-[300] bg-cosmos overflow-hidden cinematic-stage" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <StarField count={120} />
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Shockwaves */}
      <AnimatePresence>
        {phase === 2 && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="intro-shockwave" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="intro-shockwave" style={{ animationDelay: '0.3s' }} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="intro-flash" />
          </>
        )}
      </AnimatePresence>

      {/* Phase 1: Particle swarm */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {particles.map((p) => (
            <motion.div key={p.id}
              initial={{ x: p.startX, y: p.startY, scale: 0, opacity: 0 }}
              animate={{ x: [p.startX, p.startX * 0.3, 0], y: [p.startY, p.startY * 0.3, 0], scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.9, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
              className={`intro-particle ${p.isCyan ? 'intro-particle-cyan' : ''}`} />
          ))}
        </div>
      )}

      {/* Phase 2: 3D Compass + SAFAR */}
      <AnimatePresence>
        {phase >= 2 && phase < 4 && (
          <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 3D rotating compass */}
            <motion.div initial={{ rotateY: -180, rotateX: 20, scale: 0.3, opacity: 0 }} animate={{ rotateY: 0, rotateX: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative mb-10" style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, ease: 'linear', repeat: Infinity }} className="relative">
                <div className="absolute -inset-10 rounded-full border border-gold/30" style={{ boxShadow: '0 0 60px rgba(255,209,102,0.4)' }} />
                <div className="absolute -inset-20 rounded-full border border-cyan/20" />
                <div className="absolute -inset-32 rounded-full border border-gold/10" />
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden bg-cosmos/80 shadow-lg border border-cyan/20" style={{ background: 'radial-gradient(circle, rgba(255,209,102,0.15) 0%, rgba(13,148,136,0.1) 70%, transparent 100%)', boxShadow: '0 0 80px rgba(0,217,255,0.3), inset 0 0 40px rgba(0,217,255,0.2)' }}>
                  <div className="absolute inset-2 rounded-full border-2 border-cyan/30 z-20 pointer-events-none" />
                  <div className="absolute inset-6 rounded-full border border-cyan/20 z-20 pointer-events-none" />
                  <img src="/images/bedune_logo_cropped.png" alt="Bedune Logo" className="w-4/5 h-4/5 object-contain relative z-10 scale-110" />
                </div>
                <div className="orbit absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan" style={{ ['--r' as any]: '80px', boxShadow: '0 0 15px #00D9FF' }} />
                <div className="orbit absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold" style={{ ['--r' as any]: '140px', animationDelay: '-5s', boxShadow: '0 0 12px #FFD166' }} />
              </motion.div>
            </motion.div>

            {/* SAFAR 3D text */}
            <motion.div initial={{ y: 60, opacity: 0, scale: 0.7, rotateX: -40 }} animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-display text-7xl lg:text-9xl font-bold tracking-[0.3em] intro-text-3d" style={{ transformStyle: 'preserve-3d' }}>
              SAFAR
            </motion.div>

            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '300px', opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-6" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 3: "jo yaad rahe" */}
      <AnimatePresence>
        {phase >= 3 && phase < 4 && (
          <motion.div key="phase3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0.5, opacity: 0, y: -120 }} animate={{ scale: 1, opacity: 1, y: -120 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-display text-7xl lg:text-9xl font-bold tracking-[0.3em] intro-text-3d">SAFAR</motion.div>
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '300px', opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-serif italic text-4xl lg:text-6xl gold-shimmer mt-6">jo yaad rahe</motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }} className="mt-8 text-xs uppercase tracking-[0.5em] text-cyan/80 font-mono">· Bedune Tour & Travels ·</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 4: Exit */}
      <AnimatePresence>
        {phase >= 4 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-cosmos" />}
      </AnimatePresence>

      <button onClick={onComplete} className="absolute bottom-8 right-8 px-4 py-2 rounded-full glass text-ink/60 hover:text-ink text-xs uppercase tracking-widest z-10 border border-slate-line">Skip Intro →</button>
    </motion.div>
  );
}

/* ---------- Navbar ---------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className={`glass rounded-2xl transition-all duration-500 ${scrolled ? 'neon-border-cyan' : ''}`}>
          <div className="flex items-center justify-between px-4 lg:px-6 h-14 lg:h-16">
            <a href="#top" className="flex items-center gap-2.5" data-magnetic>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos flex items-center justify-center p-1.5">
                <img src="/images/bedune_logo_cropped.png" alt="Bedune Logo" className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <div className="font-display text-base font-bold text-ink tracking-tight">BEDUNE</div>
                <div className="text-[9px] uppercase tracking-[0.22em] neon-cyan">Tour & Travels</div>
              </div>
            </a>
            <nav className="hidden lg:flex items-center gap-6">
              {DESKTOP_NAV.map((n) => <a key={n.id} href={`#${n.id}`} data-magnetic className="text-sm text-ink/80 hover:neon-cyan transition-all font-medium whitespace-nowrap">{n.label}</a>)}
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              <a href="https://wa.me/918768903565?text=Hello%20Bedune%2C%20I%20want%20to%20inquire%20about%20my%20membership." target="_blank" rel="noreferrer" data-magnetic className="text-sm text-ink/75 hover:text-ink transition-colors font-medium px-3 py-2 whitespace-nowrap">Member Login</a>
              <a href="#plans"><ParticleButton variant="cyan" className="px-4 py-2 rounded-full font-semibold text-sm inline-flex items-center gap-1.5">Choose Plan <ArrowRight className="w-3.5 h-3.5" /></ParticleButton></a>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden text-ink p-2"
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
              <motion.div id="mobile-menu" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-slate-line">
                <div className="px-4 py-3 flex flex-col gap-1">
                  {NAV.map((n) => <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)} className="py-2.5 text-ink/90 text-sm font-medium">{n.label}</a>)}
                  <a href="#plans" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos font-semibold text-sm">Choose Plan <ArrowRight className="w-4 h-4" /></a>
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
    tagline: 'Bedune Tour & Travels',
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

function HeroHumanProof() {
  return (
    <div className="mb-6 max-w-xl rounded-2xl border border-white/60 bg-white/75 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center shrink-0">
          {HERO_HUMAN_PROOF.map((winner) => (
            <img
              key={winner.name}
              src={winner.img}
              alt={`${winner.name}, Bedune ${winner.plan} winner`}
              className="-ml-2 first:ml-0 h-11 w-11 rounded-full border-2 border-white object-cover shadow-md"
              loading="lazy"
            />
          ))}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-teal-700">
            <BadgeCheck className="h-3.5 w-3.5" />
            Real travelers, verified support
          </div>
          <p className="mt-1 text-sm font-bold leading-snug text-slate-800">
            Recent Bedune members traveled to Kashmir, Darjeeling and Sundarbans with guided booking help.
          </p>
        </div>
      </div>
    </div>
  );
}

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
    <section id="top" className="relative min-h-screen flex items-center bg-cosmos overflow-hidden">
      {/* Background with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-cosmos">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlideIndex}
            style={{ y: yParallax }}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt={slide.tagline} className="w-full h-full object-cover" fetchPriority="high" width="1920" height="1080" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos/30 via-transparent to-cosmos/50 z-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cosmos/50 via-transparent to-transparent z-[2]" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-15 z-[1]" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-32 pb-24 w-full z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headline, Pitch, and Pulse CTA Button */}
        <div className="lg:col-span-6 text-left text-ink flex flex-col justify-center">
          <div className="mb-5 flex flex-col gap-2.5 items-start">
            <SubSectionBadge text="Welcome to Bedune Tour & Travels" theme="cyan" />
            <span className="py-0.5 select-none">
              <span className="font-pacifico text-3xl md:text-4xl bg-gradient-to-r from-[#FFF6C3] via-[#FDE047] to-[#F59E0B] bg-clip-text text-transparent leading-relaxed">
                “Safar Jo Yaad Rahe”
              </span>
            </span>
          </div>
          
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-ink uppercase mb-6 animate-fade-in flex flex-col">
            <span className="text-white">TRAVEL MORE.</span>
            <span className="bg-gradient-to-r from-[#00F5D4] to-[#00B4D8] bg-clip-text text-transparent">SAVE MORE.</span>
            <span className="gold-shimmer">WIN MORE.</span>
          </h1>

          <div className="h-0.5 w-20 bg-gradient-to-r from-teal-600 to-cyan mb-6 rounded-full" />
          
          <p className="text-sm sm:text-base text-ink/90 leading-relaxed font-bold max-w-lg mb-4">
            Premium tour plans, custom trips, weekly lucky draws, and guaranteed member benefits — all in one trusted travel club.
          </p>
          <p className="text-sm sm:text-base text-ink/70 leading-relaxed font-medium max-w-lg mb-8">
            Explore handpicked destinations across India and abroad with safe planning, transparent pricing, and WhatsApp support from start to finish.
          </p>

          <HeroHumanProof />

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <a href="#destinations" className="cursor-pointer">
              <button className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full shadow-lg breathe-glow hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2.5 uppercase tracking-wider border-none cursor-pointer">
                Explore Packages <ArrowRight className="w-5 h-5" />
              </button>
            </a>
            <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="cursor-pointer">
              <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2.5 uppercase tracking-wider border-none cursor-pointer">
                Plan My Trip on WhatsApp <MessageCircle className="w-5 h-5 fill-current" />
              </button>
            </a>
          </div>
        </div>

        {/* Right Column: Floating collage + route line + airplane */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px]">
          {/* Dashboard Route Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <svg viewBox="0 0 300 400" className="w-full h-full" fill="none">
              <path
                d="M 50,300 C 150,350 200,100 250,50"
                stroke="rgba(13, 148, 136, 0.4)"
                strokeWidth="2"
                strokeDasharray="4,6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Floating Collage Cards */}
          <div className="relative w-full h-[360px] flex items-center justify-center">
            {/* Card 1: Darjeeling Tea (Back/Left) */}
            <div className="float-card-1 absolute left-2 top-4 bg-white p-2.5 pb-4 shadow-xl rounded-lg w-36 border border-slate-100 rotate-[-8deg] z-10">
              <img src="/images/darjeeling_tea_1779521805614.png" alt="Darjeeling Tea" className="w-full h-24 object-cover rounded-sm" />
              <div className="text-[10px] text-slate-800 font-pacifico mt-1.5 text-center">Darjeeling Hills</div>
            </div>

            {/* Card 2: Kerala Houseboat (Middle/Right) */}
            <div className="float-card-2 absolute right-2 top-8 bg-white p-2.5 pb-4 shadow-xl rounded-lg w-38 border border-slate-100 rotate-[6deg] z-10">
              <img src="/images/kerala_houseboat_1779521772928.png" alt="Kerala Houseboat" className="w-full h-26 object-cover rounded-sm" />
              <div className="text-[10px] text-slate-800 font-pacifico mt-1.5 text-center">Kerala Backwaters</div>
            </div>

            {/* Card 3: Dubai Skyline (Front/Center) */}
            <div className="float-card-3 absolute left-12 bottom-2 bg-white p-3 pb-5 shadow-2xl rounded-lg w-40 border border-slate-100 rotate-[-2deg] z-20">
              <img src="/images/dubai_skyline_1779539448313.png" alt="Dubai Skyline" className="w-full h-28 object-cover rounded-sm" />
              <div className="text-[10px] text-slate-800 font-pacifico mt-2 text-center">Dubai Marina</div>
            </div>
          </div>

          {/* Floating airplane on top */}
          <motion.div
            animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-4 top-16 w-52 h-52 z-30 pointer-events-none"
          >
            <img src="/images/airplane_nobg.png" alt="Airplane" className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.18)]" style={{ transform: 'rotate(42deg) scale(1.1)' }} />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ink/40 text-[10px] tracking-[0.3em] uppercase z-10">
        <span>Scroll</span><div className="w-px h-10 bg-gradient-to-b from-teal-600 to-transparent" />
      </div>
    </section>
  );
}

function LegacyHero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);
  return (
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden">
      <LiquidFilter />
      <StarField count={100} />
      <AuroraBackground variant="cyan" />
      <GradientMesh />
      <FloatingOrbs count={4} variant="mixed" />
      <FlowingLines count={4} />
      <WaveBackground color="mixed" />

      {/* Cinematic background */}
      <div className="absolute inset-0">
        <motion.div initial={{ scale: 1.2, opacity: 0, filter: 'blur(30px)' }} animate={loaded ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}} transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0" style={{ filter: 'url(#liquid-filter)' }}>
          <img src="/images/beduin_travel_hero_1779521651766.png" alt="Bedune Travel Hero" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos/90 via-void/80 to-cosmos" />
        <div className="absolute inset-0 bg-gradient-to-r from-cosmos via-cosmos/70 to-transparent" />
      </div>

      <div className="absolute inset-0 grid-pattern opacity-70" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[400px] rounded-full bg-cyan/15 blur-[120px]" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-neon-gold/10 blur-[120px]" />

      <div className="hero-floating-picture" aria-hidden="true">
        <img src="/images/beduine-floating-plane.png" alt="" />
      </div>

      <div className="absolute top-1/2 right-1/4 hidden lg:block" style={{ width: 200, height: 200 }}>
        <div className="absolute inset-0 rounded-full border border-cyan/20" />
        <div className="absolute inset-6 rounded-full border border-neon-gold/20" />
        <div className="orbit absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyan" style={{ ['--r' as any]: '100px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-32 pb-24 w-full z-10">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-cyan text-cyan text-xs uppercase tracking-widest font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-soft-pulse" />
            <span>AI-Powered · 100% Transparent · Blockchain-Verified</span>
          </motion.div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-[6.5rem] font-bold text-ink leading-[0.95] tracking-tight">
            <StaggerText text="Safar jo" delay={0.6} className="block" />
            <span className="block gold-shimmer mt-2"><StaggerText text="yaad rahe." delay={1.2} /></span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 2, ease: [0.22, 1, 0.36, 1] }} className="mt-8 text-lg lg:text-xl text-ink/80 max-w-2xl leading-relaxed">
            A <span className="neon-cyan font-semibold">futuristic travel subscription</span> that combines AI-curated journeys, weekly reward draws, and guaranteed travel credits.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 2.3 }} className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#plans"><ParticleButton variant="gold" className="group inline-flex items-center justify-center gap-3 px-8 py-5 rounded-full font-bold text-base lg:text-lg"><Sparkles className="w-5 h-5" />Choose Your Plan. Try Your Luck. Travel Beyond Limits.<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></ParticleButton></a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.6 }} className="mt-14 grid grid-cols-3 gap-4 lg:gap-10 max-w-2xl">
            {[{ n: '100%', l: 'Operational Integrity' }, { n: '50+', l: 'Curated Destinations' }, { n: '12 mo', l: 'Subscription Life' }].map((s) => (
              <div key={s.l} className="border-l-2 border-cyan/50 pl-4">
                <div className="font-display text-2xl lg:text-4xl font-bold text-ink tabular">{s.n}</div>
                <div className="text-[11px] lg:text-xs text-ink/60 mt-1 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ink/40 text-[10px] tracking-[0.3em] uppercase">
        <span>Scroll</span><div className="w-px h-10 bg-gradient-to-b from-cyan to-transparent" />
      </div>
    </section>
  );
}

/* ---------- Trust Strip ---------- */
function TrustStrip() {
  const items = [
    { icon: ShieldCheck, t: 'RNG Certified' }, { icon: Lock, t: 'End-to-End Encrypted' },
    { icon: FileText, t: 'Public Audit Reports' }, { icon: Fingerprint, t: 'Biometric Verified' },
    { icon: Bot, t: 'AI-Powered Curation' },
  ];
  return (
    <section className="relative py-10 border-y border-slate-line bg-cosmos/60 scanline z-10">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {items.map((it) => (
            <div key={it.t} className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full bg-cyan-bright/35 border border-cyan/20 flex items-center justify-center shrink-0 shadow-sm shadow-cyan/5 transition-all duration-300 hover:scale-105 hover:bg-cyan-bright/55">
                <it.icon className="w-5 h-5 text-cyan-deep" />
              </div>
              <div className="text-xs lg:text-sm text-ink/75 font-medium">{it.t}</div>
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
    { icon: Heart, title: 'Our Mission', accent: 'cyan', image: '/images/about_mission.png',
      text: 'Transform travel into an accessible, reliable, and rewarding experience for everyone. We offer carefully crafted tours that balance culture, comfort and adventure — delivering a subscription model where members enjoy weekly lucky draws and guaranteed discounts.',
      points: ['Curated tours for every traveller', 'Subscription model with guaranteed value', 'A trusted partner in creating memories'] },
    { icon: Globe, title: 'Our Vision', accent: 'teal', image: '/images/about_vision.png',
      text: 'Revolutionize the travel industry with a sustainable, inclusive, and transparent model. Expand across India with a franchise and agent-driven network — integrating cutting-edge technology for seamless subscriptions and tour management.',
      points: ['Pan-India franchise network', 'Technology-first transparency', 'From domestic roots to global journeys'] },
    { icon: Users, title: 'Our Promise', accent: 'violet', image: '/images/about_promise.png',
      text: 'Every subscriber gets more value than their subscription fee — whether they win or not. We believe travel is not just about visiting destinations — it\'s about building stories, emotions, and connections that last a lifetime.',
      points: ['Winners enjoy luxury tours free', 'Non-winners always get assured discounts', 'Fair, transparent, community-driven'] },
  ];
  return (
    <section id="about" className="relative py-14 lg:py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] neon-gold font-semibold mb-4"><div className="w-8 h-px bg-neon-gold" /> About Bedune <div className="w-8 h-px bg-neon-gold" /></div>
            <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
              <KineticText text="Safar jo" />
              <br /><span className="gold-shimmer"><KineticText text="yaad rahe." delay={0.3} /></span>
            </h2>
            <p className="mt-6 text-ink/70 text-lg leading-relaxed max-w-2xl mx-auto">Bedune Tour & Travels is a customer-first travel company dedicated to crafting memorable journeys across India and beyond. We combine curated itineraries, transparent pricing, and a unique subscription model that rewards every member.</p>
          </div>
        </Reveal>

        {/* Pillar Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.12}>
              <TiltCard className="h-full" intensity={6}>
                <div className={`glass rounded-3xl overflow-hidden border border-slate-line ${p.accent === 'cyan' ? 'hover:neon-border-cyan' : (p.accent === 'teal' || p.accent === 'gold') ? 'hover:neon-border-gold' : 'hover:neon-border-violet'} transition-all h-full tilt-inner flex flex-col group`}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b22] via-[#0d1b22]/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <FloatingIcon delay={i * 0.5}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-violet shadow-cyan/30' : p.accent === 'teal' ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal/30' : 'bg-gradient-to-br from-violet to-fuchsia-500 shadow-violet/30'}`}>
                          <p.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} />
                        </div>
                      </FloatingIcon>
                    </div>
                    <Rocket className="absolute top-4 right-4 w-5 h-5 text-ink/20" />
                  </div>
                  <div className="p-8 pt-5 flex-1 flex flex-col">
                    <h3 className="font-display text-xl font-black text-slate-950 mb-3">{p.title}</h3>
                    <p className="text-sm text-slate-800 leading-relaxed mb-5 flex-1 font-semibold">{p.text}</p>
                    <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                      {p.points.map((pt) => <li key={pt} className="flex items-center gap-2.5 text-sm text-slate-900 font-bold"><GoldCheck size={16} variant={p.accent as any} /><span>{pt}</span></li>)}
                    </ul>
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
                    Fulia, Nadia,<br />West Bengal — 741402
                  </h3>
                  <p className="text-sm text-ink/75 leading-relaxed mb-6">
                    Step inside Bedune Tour & Travels. Visit our head office in Fulia for customized tour planning, group holiday bookings, or to grab a hot cup of tea while we design your next memory.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-line/50">
                  <a href="https://www.beduine.in" target="_blank" rel="noreferrer" data-magnetic className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-cyan/50 text-cyan text-sm font-semibold hover:bg-cyan/10 transition-all"><Globe className="w-4 h-4" />www.beduine.in</a>
                  <a href="tel:+918768903565" data-magnetic className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-neon-gold/50 text-neon-gold text-sm font-semibold hover:bg-neon-gold/10 transition-all"><Phone className="w-4 h-4" />+91 87689 03565</a>
                </div>
              </div>
              <div className="relative min-h-[300px] lg:min-h-full overflow-hidden group">
                <img src="/images/office_setup.png" alt="Bedune Fulia Office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 z-10 p-4 bg-slate-950/75 border border-white/10 rounded-2xl backdrop-blur-md">
                  <div className="text-xs text-neon-gold font-mono">// Fulia HQ Setup</div>
                  <div className="font-display font-semibold text-white text-sm mt-0.5">Welcome to Bedune Tour & Travels</div>
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
    { n: '01', icon: CreditCard, title: 'Choose Your Subscription', desc: 'Pick Silver, Gold, or Platinum — each valid for 12 months.', details: ['12-month validity', 'Digital dashboard', 'Instant credit allocation'], img: '/images/beduin_travel_hero_1779521651766.png' },
    { n: '02', icon: Target, title: 'Enter the Weekly Draw', desc: 'Every Sunday, eligible subscribers enter a verified draw for a fully-paid luxury tour.', details: ['Certified RNG process', 'Live-streamed selection', 'Publicly archived results'], img: '/images/lucky_draw_ticket_1779521667122.png' },
    { n: '03', icon: Gift, title: 'Win Tour — or Use Credit', desc: 'Selected members get a luxury journey. Everyone else gets guaranteed credits.', details: ['Luxury tour covered', '₹500 – ₹2,000 in credits', 'Never empty-handed'], img: '/images/happy_family_travelers.png' },
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

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-lg shadow-cyan/30"><s.icon className="w-6 h-6 text-cosmos" strokeWidth={2.2} /></div>
                      </FloatingIcon>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink mb-3">{s.title}</h3>
                    <p className="text-sm text-ink/65 leading-relaxed mb-5">{s.desc}</p>
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

/* ---------- Silver Plan 3D Character Interaction (₹499 Pulling Child) ---------- */
function SilverPullingChild({ hovered }: { hovered: boolean }) {
  // Leaning and tugging physics based on card hover state!
  const tugAnim = {
    animate: hovered ? {
      x: [0, 4, -1, 5, -0.5, 3, 0],
      y: [0, -0.5, 1, -1.2, 0.4, -0.8, 0],
      rotate: [0, 2, -1, 3, -0.5, 1.5, 0],
      transition: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut"
      }
    } : {
      x: [0, 1.5, -0.5, 2.0, -0.2, 1.0, 0],
      y: [0, -0.2, 0.4, -0.5, 0.2, -0.3, 0],
      rotate: [0, 0.8, -0.4, 1.0, -0.2, 0.5, 0],
      transition: {
        repeat: Infinity,
        duration: 1.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={tugAnim}
      animate="animate"
      className="absolute -right-3.5 -top-7 w-32 h-36 z-20 pointer-events-none overflow-visible filter drop-shadow-[0_12px_24px_rgba(2,6,23,0.45)]"
    >
      <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="childSkin3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4EB" />
            <stop offset="50%" stopColor="#FED6BA" />
            <stop offset="100%" stopColor="#F3A77C" />
          </linearGradient>
          <linearGradient id="shirtRed3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="60%" stopColor="#ee5253" />
            <stop offset="100%" stopColor="#c0392b" />
          </linearGradient>
          <linearGradient id="jeansBlue3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#54a0ff" />
            <stop offset="60%" stopColor="#2e86de" />
            <stop offset="100%" stopColor="#130cb7" />
          </linearGradient>
          <filter id="childShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="2" dy="8" stdDeviation="3.5" floodColor="#020617" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 3D floor shadow */}
        <ellipse cx="60" cy="128" rx="28" ry="4.5" fill="rgba(2,6,23,0.4)" filter="blur(2.5px)" />

        {/* The Body (Leaning backwards to the right!) */}
        <g filter="url(#childShadow)" className="overflow-visible">
          {/* Legs (Stretched forward, resisting the pull!) */}
          <rect x="42" y="104" width="9" height="20" rx="2" fill="url(#jeansBlue3D)" transform="rotate(-30 42 104)" />
          <rect x="52" y="106" width="9" height="20" rx="2" fill="url(#jeansBlue3D)" transform="rotate(-20 52 106)" />
          
          {/* Sneakers */}
          <rect x="26" y="112" width="10" height="6" rx="2" fill="#ffffff" stroke="#ee5253" strokeWidth="0.8" />
          <rect x="38" y="114" width="10" height="6" rx="2" fill="#ffffff" stroke="#ee5253" strokeWidth="0.8" />

          {/* Torso / Shirt */}
          <path d="M 52,82 C 52,74 72,74 72,82 L 80,112 L 48,112 Z" fill="url(#shirtRed3D)" transform="rotate(18 60 97)" />

          {/* Glowing Star Graphic on Shirt */}
          <polygon points="62,90 63.2,92.5 65.8,92.5 63.8,94 64.5,96.5 62,95 59.5,96.5 60.2,94 58.2,92.5 60.8,92.5" fill="#fef08a" transform="rotate(18 60 97)" />

          {/* Head (Facing slightly left toward the price tag, gritting teeth and winking!) */}
          <g transform="rotate(12 60 62)">
            <rect x="57" y="68" width="6" height="8" fill="url(#childSkin3D)" />
            <circle cx="60" cy="58" r="13" fill="url(#childSkin3D)" />
            
            {/* Cute Hair */}
            <path d="M 46,58 C 46,42 74,42 74,58 C 74,72 46,72 46,58 Z" fill="#3B2314" opacity="0.95" />

            {/* Winking struggling eyes */}
            <path d="M 50,54 L 54,58 M 54,54 L 50,58" stroke="#1E1008" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 64,54 Q 67,51 70,54" stroke="#1E1008" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Gritting struggling cute mouth */}
            <path d="M 54,66 Q 60,69 66,65" stroke="#9a3412" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <line x1="55" y1="65.5" x2="65" y2="65" stroke="#ffffff" strokeWidth="1.2" />

            {/* Blushing Cheeks */}
            <circle cx="49" cy="62" r="2.2" fill="#ff7a90" opacity="0.6" />
            <circle cx="71" cy="62" r="2.2" fill="#ff7a90" opacity="0.6" />

            {/* Backward Cap with Visor */}
            <path d="M 50,49 C 50,40 70,40 70,49 Z" fill="#1e293b" />
            <path d="M 52,48 L 38,45" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Grabbing Hands stretching to the left to hold onto the price */}
          <path d="M 56,88 Q 32,84 2,82" stroke="url(#childSkin3D)" strokeWidth="6.5" strokeLinecap="round" fill="none" />
          <path d="M 56,92 Q 34,92 2,90" stroke="url(#childSkin3D)" strokeWidth="6.5" strokeLinecap="round" fill="none" />

          {/* Little fingers gripping the card/price edge */}
          <g transform="translate(0, 0)">
            <circle cx="2" cy="82" r="4.5" fill="url(#childSkin3D)" />
            <circle cx="3" cy="78" r="1.5" fill="#fecaca" />
            <circle cx="4.5" cy="80" r="1.5" fill="#fecaca" />
            <circle cx="5" cy="82" r="1.5" fill="#fecaca" />
            <circle cx="4.5" cy="84" r="1.5" fill="#fecaca" />

            <circle cx="2" cy="90" r="4.5" fill="url(#childSkin3D)" />
            <circle cx="3" cy="86" r="1.5" fill="#fecaca" />
            <circle cx="4.5" cy="88" r="1.5" fill="#fecaca" />
            <circle cx="5" cy="90" r="1.5" fill="#fecaca" />
            <circle cx="4.5" cy="92" r="1.5" fill="#fecaca" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}

/* ---------- Plan Card ---------- */
function PlanCard({ plan, index, onSelectPlan }: { plan: typeof PLANS[number]; index: number; onSelectPlan: (planName: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const priceTug = {
    animate: hovered ? {
      x: [0, 2, -1, 3, -0.5, 2, 0],
      y: [0, -0.5, 0.5, -0.8, 0.2, -0.5, 0],
      skewX: [0, 1.2, -0.6, 1.8, -0.3, 0.9, 0],
      transition: {
        repeat: Infinity,
        duration: 0.8,
        ease: "easeInOut"
      }
    } : {
      x: [0, 0.6, -0.3, 0.8, -0.1, 0.5, 0],
      y: [0, -0.2, 0.2, -0.3, 0.1, -0.2, 0],
      skewX: [0, 0.4, -0.2, 0.5, -0.1, 0.3, 0],
      transition: {
        repeat: Infinity,
        duration: 1.8,
        ease: "easeInOut"
      }
    }
  };

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
        <div ref={cardRef} onMouseMove={onMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); onLeave(); }} className={`relative rounded-3xl overflow-hidden h-full transition-all duration-500 tilt-inner bg-gradient-to-b from-slate-950 to-slate-900 border ${plan.featured ? 'border-2 border-neon-gold/80 shadow-2xl shadow-neon-gold/10' : 'border-slate-800/80 hover:border-cyan/50 hover:shadow-2xl hover:shadow-cyan/5'}`}>
          {plan.featured && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-gold via-cyan to-neon-gold z-10" />}
          {plan.featured && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Crown className="w-3 h-3 fill-current" /> Premium Choice</div>}

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
            <div className="mt-2 text-sm text-slate-300 font-bold">Winner tour value up to <span className="font-extrabold text-white">₹{plan.tourValue.toLocaleString('en-IN')}</span> · {plan.duration}</div>
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
            <div className="grid grid-cols-2 gap-2">
              {[{ l: 'Discount Credits', v: `${plan.discountCredits} × ₹500` }, { l: 'Paid Tour Off', v: `Up to ${plan.paidDiscount}` }, { l: 'Insurance', v: plan.insurance }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{c.l}</div>
                  <div className="text-xs font-black text-slate-100 mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            <ParticleButton 
              onClick={() => onSelectPlan(plan.name)} 
              variant={plan.featured ? 'gold' : 'cyan'} 
              className="block text-center w-full py-3.5 rounded-full font-bold"
            >
              {plan.featured ? 'Lock Platinum Entry' : `Choose ${plan.name}`}
            </ParticleButton>
            <div className="text-center text-[11px] text-slate-400 font-bold mt-3 font-mono">// 12-mo validity · pickup included</div>
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
function IntlPlanCard({ plan, index, onSelectPlan }: { plan: typeof INTL_PLANS[number]; index: number; onSelectPlan: (planName: string) => void }) {
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
          {plan.featured && <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Plane className="w-3 h-3 fill-current" /> Best Value</div>}

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
              <span className="text-cyan text-lg font-bold">₹</span>
              <span className="font-display text-5xl font-black text-white tracking-tight tabular">{plan.price.toLocaleString('en-IN')}</span>
              <span className="text-slate-400 font-extrabold text-sm">/ 12 mo</span>
            </div>
            <div className="mt-2 text-sm text-slate-300 font-bold">Winner tour value up to <span className="font-extrabold text-white">₹{plan.tourValue.toLocaleString('en-IN')}</span> · {plan.duration}</div>
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
            <div className="grid grid-cols-2 gap-2">
              {[{ l: 'Discount Credits', v: `${plan.discountCredits} × ₹500` }, { l: 'Tour Discount', v: `Up to ${plan.paidDiscount}` }, { l: 'Insurance', v: plan.insurance }, { l: 'Name Change', v: plan.nameChange }].map((c) => (
                <div key={c.l} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2.5">
                  <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{c.l}</div>
                  <div className="text-xs font-black text-slate-100 mt-0.5">{c.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-7 pt-0">
            <ParticleButton 
              onClick={() => onSelectPlan(plan.name)} 
              variant={plan.featured ? 'cyan' : 'gold'} 
              className="block text-center w-full py-3.5 rounded-full font-bold"
            >
              {plan.featured ? '✈ Lock Voyager Entry' : `Choose ${plan.name}`}
            </ParticleButton>
            <div className="text-center text-[11px] text-slate-400 font-bold mt-3 font-mono">// 12-mo validity · visa assist included</div>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[{ type: 'calendar', t: '12 Months Validity', d: 'Full subscription coverage' }, { type: 'filecheck', t: 'Visa Assistance', d: 'End-to-end documentation' }, { type: 'plane', t: 'Airport Lounge', d: 'Premium access included' }, { type: 'shield', t: 'Travel Insurance', d: 'International coverage' }].map((b) => (
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
    { icon: Lock,      t: 'Verifiable coupons',       d: 'Unique QR / UUID codes — impossible to duplicate.',          color: 'from-sky-500 to-cyan-600', glow: 'rgba(34,211,238,0.25)' },
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
              Trust isn't claimed — it's proven. Our weekly reward draws use certified RNG, are live-streamed, and archived as downloadable audit reports.
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
                {AUDIT_REPORTS.map((r, i) => (
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
    { n: '03', icon: FileText, title: 'Reports & Audits', accent: 'violet',
      img: '/images/transparency_audit.png',
      desc: 'A comprehensive draw report containing all pool metrics is compiled weekly and archived.',
      details: ['PDF/CSV with total pool, winning IDs & timestamps', 'RNG seed logs included for verification', 'Archived for transparent internal & external audits'] },
    { n: '04', icon: Send, title: 'Winner Announcement', accent: 'cyan',
      img: '/images/transparency_winner.png',
      desc: 'Winners are announced every Sunday evening across all company channels with unique digital coupons.',
      details: ['Website Winners Page + Social Media posts', 'SMS & Email notification with coupon code', 'Unique QR/UUID codes — impossible to duplicate'] },
  ];

  const schedule = [
    { quarter: 'Jan – Mar', tour: 'July', color: 'from-cyan to-blue-500', img: '/images/sundarbans_mangrove_1779521789593.png' },
    { quarter: 'Apr – Jun', tour: 'October', color: 'from-teal-400 to-emerald-600', img: '/images/darjeeling_tea_1779521805614.png' },
    { quarter: 'Jul – Sep', tour: 'January', color: 'from-violet to-purple-500', img: '/images/kashmir_dal_lake_1779521728036.png' },
    { quarter: 'Oct – Dec', tour: 'April', color: 'from-emerald-400 to-teal-500', img: '/images/kerala_houseboat_1779521772928.png' },
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
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Members can follow the draw experience clearly. Results are checked, documented, and shared through official Bedune channels.</p>
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
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${p.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/30' : p.accent === 'teal' ? 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal/30' : 'bg-gradient-to-br from-violet to-fuchsia-500 shadow-violet/30'}`}>
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
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${p.n === '01' ? 'bg-cyan' : p.n === '02' ? 'bg-teal-500' : p.n === '03' ? 'bg-violet' : 'bg-rose-500'}`} />
                        {p.n === '01' ? 'Verification Live' : p.n === '02' ? 'Secure Entropy' : p.n === '03' ? 'Certified Logs' : 'Winner Declared'}
                      </span>
                      <span className="font-bold opacity-60">Step {p.n}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                    {p.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-ink/80">
                        <GoldCheck size={15} variant={p.accent === 'cyan' ? 'cyan' : p.accent === 'violet' ? 'violet' : 'gold'} />
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
                <div className="font-display text-2xl lg:text-3xl font-bold text-ink mb-4">You don't just wait — you <span className="gradient-neon">participate.</span></div>
                <p className="text-sm text-ink/70 leading-relaxed mb-6">Every Sunday, subscribers log in to their Bedune account, use their Lucky Draw Credit to enter, and see results instantly. The draw is triggered by the system itself — not secretly by the company.</p>
                <div className="space-y-3">
                  {[
                    { step: '1', t: 'Log in on Sunday', d: 'Open your Bedune app or web portal' },
                    { step: '2', t: 'Activate your entry', d: 'Use your 1 Lucky Draw Credit to lock your ticket' },
                    { step: '3', t: 'Watch the draw', d: 'Digital scratch card or RNG animation reveals results' },
                    { step: '4', t: 'Instant result', d: 'Win → Tour coupon | Not selected → Discount credits confirmed' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center shrink-0 text-cosmos font-bold text-sm">{s.step}</div>
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
                      <div className="font-display text-sm font-semibold neon-gold tracking-wide">🏆 WEEKLY DRAW WINNER</div>
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
              ✓ Congratulations <span className="neon-gold">[Name]</span>! You are a Bedune Lucky Draw Winner! Your coupon: <span className="neon-cyan">BEDWIN-JULY-12345</span>. Call <span className="text-ink">+91 8768903565</span> for details.
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Credit Architecture System ---------- */
function CreditArchitecture({ activePlan, ldcTokens, discountCredits }: { activePlan: string | null; ldcTokens: number; discountCredits: number }) {
  const [activeTab, setActiveTab] = useState<'domestic' | 'intl'>('domestic');

  const credits = [
    { type: 'LDC', name: 'Lucky Draw Credit', icon: Sparkles, accent: 'cyan',
      desc: '1 Credit is issued per subscription. This credit acts as a token that the user manually spends on the mobile app/web portal on Sunday to lock their participation in that week\'s draw.',
      rule: '1 Credit = 1 Entry in the weekly Lucky Draw',
      details: ['Automatically added upon payment verification', 'Used every Sunday to activate draw entry', 'Ticket ID confirmed and locked for that week', 'No extra credits can be purchased — fair chance for all'] },
    { type: 'DC', name: 'Discount Credits', icon: CreditCard, accent: 'teal',
      desc: 'These act as the protective floor for non-winners. If a user does not win, these credits allow them to claim a flat ₹500 off per tour booking.',
      rule: '1 Tour Booking = 1 Discount Credit applied',
      details: ['Domestic: ₹500 discount per credit (Up to ₹2,000 safety floor)', 'International: ₹500 discount per credit (Up to ₹7,500 safety floor)', 'Credits never expire and stack across bookings', 'Credits visible on your digital dashboard'] },
  ];

  const domesticCredits = [
    { plan: 'Silver', price: '₹499', ldc: '1', dc: '1 × ₹500', total: '₹500', color: 'from-slate-500 to-slate-700', image: '/images/sundarbans_mangrove_1779521789593.png' },
    { plan: 'Emerald', price: '₹799', ldc: '1', dc: '2 × ₹500', total: '₹1,000', color: 'from-teal-400 to-emerald-600', image: '/images/darjeeling_tea_1779521805614.png' },
    { plan: 'Platinum', price: '₹1,499', ldc: '1', dc: '4 × ₹500', total: '₹2,000', color: 'from-indigo-400 to-purple-500', image: '/images/kashmir_dal_lake_1779521728036.png' },
  ];

  const intlCredits = [
    { plan: 'Explorer', price: '₹4,999', ldc: '1 (Monthly)', dc: '5 × ₹500', total: '₹2,500', color: 'from-sky-400 to-blue-600', image: '/images/dubai_skyline_1779539448313.png' },
    { plan: 'Voyager', price: '₹7,999', ldc: '1 (Monthly)', dc: '8 × ₹500', total: '₹4,000', color: 'from-emerald-400 to-teal-600', image: '/images/maldives_overwater_1779539482305.png' },
    { plan: 'Globetrotter', price: '₹14,999', ldc: '1 (Monthly)', dc: '15 × ₹500', total: '₹7,500', color: 'from-rose-400 via-pink-500 to-violet-600', image: '/images/singapore_skyline_1779539502293.png' },
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
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber receives two types of credits — one for the thrill of the draw, one as your guaranteed safety net. Win or not, you always gain.</p>
          </div>
        </Reveal>

        {/* Three Columns including Holographic pass */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {credits.map((c, i) => (
            <Reveal key={c.type} delay={i * 0.15}>
              <TiltCard className="h-full" intensity={5}>
                <div className={`rounded-3xl p-8 border h-full tilt-inner flex flex-col ${c.accent === 'cyan' ? 'glass neon-border-cyan border-cyan/30' : 'glass-gold neon-border-gold border-neon-gold/30'}`}>
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <FloatingIcon delay={i * 0.5}>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${c.accent === 'cyan' ? 'bg-gradient-to-br from-cyan to-blue-500 shadow-cyan/40' : 'bg-gradient-to-br from-neon-gold to-gold-deep shadow-neon-gold/40'}`}>
                        <c.icon className="w-8 h-8 text-cosmos" strokeWidth={2} />
                      </div>
                    </FloatingIcon>
                    <div>
                      <div className={`font-mono text-xs font-extrabold tracking-wider ${c.accent === 'cyan' ? 'text-cyan-deep' : 'text-teal-700'}`}>{c.type}</div>
                      <div className="font-display text-xl font-black text-slate-900">{c.name}</div>
                    </div>
                  </div>

                  {/* Rule badge - Full Black and Stylish */}
                  <div className={`rounded-xl p-3 mb-5 border ${c.accent === 'cyan' ? 'bg-cyan/5 border-cyan/30' : 'bg-teal-500/5 border-teal-500/30'}`}>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <span className={c.accent === 'cyan' ? 'text-cyan-deep' : 'text-teal-600'}>⚡</span>
                      <span className="font-extrabold text-slate-900 tracking-tight">{c.rule}</span>
                    </div>
                  </div>

                  {/* Visual illustration slot */}
                  {c.type === 'LDC' ? (
                    /* Lucky Draw Token Image */
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40 bg-cosmos shrink-0">
                      <img src="/images/lucky_draw_token.png" alt="Lucky Draw Token" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono tracking-widest text-cyan font-bold">
                            LUCKY TOKEN
                          </span>
                          <span className="text-cyan/80 font-mono text-[9px]">
                            &gt;_ active
                          </span>
                        </div>
                        <div>
                          <div className="text-cyan font-mono text-xl tracking-widest mb-1 font-bold">
                            WEEKLY DRAW
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-cyan-deep/80 font-semibold">
                            <span>LDC UNIT</span>
                            <span>EXP: Sunday 8PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Discount Credit Voucher (CSS Holographic Card - Dark Premium) */
                    <div className="relative rounded-2xl overflow-hidden border border-teal-500/30 group shadow-2xl mb-6 h-40 bg-slate-950 flex flex-col justify-between p-5 shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-500/10 to-transparent pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-teal-500/5 blur-xl pointer-events-none" />
                      <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-cyan-500/5 blur-xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <span className="text-[10px] font-mono tracking-widest text-teal-400 font-bold">
                          DISCOUNT VOUCHER
                        </span>
                        <span className="text-teal-400 font-mono text-[9px] animate-pulse flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-teal-400" /> redeemable
                        </span>
                      </div>

                      <div className="flex items-center justify-between my-2 relative z-10">
                        <div className="text-left">
                          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Value</div>
                          <div className="text-3xl font-display font-black text-teal-400 tracking-tight leading-none">
                            ₹500
                          </div>
                        </div>
                        <div className="h-10 w-px border-l border-dashed border-teal-500/30" />
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">Applicable on</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            Domestic Tours
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-teal-400/80 font-semibold relative z-10 pt-2 border-t border-slate-800">
                        <span>SECURE CREDITS</span>
                        <span className="text-white/80">100% SECURED</span>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-slate-700 leading-relaxed mb-6 flex-1 font-medium">{c.desc}</p>

                  <ul className="space-y-2.5 pt-5 border-t border-slate-line">
                    {c.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-slate-900 font-semibold">
                        <GoldCheck size={15} variant={c.accent === 'cyan' ? 'cyan' : 'gold'} />
                        <span className="text-slate-900 font-bold">{d}</span>
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
              <div className="rounded-3xl p-8 border h-full tilt-inner flex flex-col justify-between overflow-hidden relative transition-all duration-500 border-teal-500/30 glass shadow-teal-500/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan to-teal-deep shadow-lg shadow-cyan/20">
                      <Fingerprint className="w-8 h-8 text-cosmos" strokeWidth={2} />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-extrabold tracking-wider text-teal-700">// BEDUNE DIGITAL PASS</div>
                      <div className="font-display text-xl font-black text-slate-900">Bedune Member Pass</div>
                    </div>
                  </div>
                  
                  {/* Digital Pass Image */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl mb-6 h-40">
                    <img src="/images/credit_card_holographic_1779521713449.png" alt="Holographic Credit Card" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono tracking-widest text-white font-bold">
                          MEMBER CLUB
                        </span>
                        <span className="text-white/80 font-mono text-[9px]">
                          &gt;_ active
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-mono text-base tracking-widest mb-1">
                          •••• •••• •••• 2026
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-white/90">
                          <span>MEMBER PASS</span>
                          <span>EXP: 12 Months</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">
                    Your virtual membership card stores your draw tokens and discount credits. Accessible instantly from your phone.
                  </p>
                </div>
                
                <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-900 font-bold">
                  <span>Lucky Draw entry included</span>
                  <span className="text-teal-600 font-black">
                    Guaranteed Discounts
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
              <div className="font-display text-xl lg:text-2xl font-bold text-ink mb-6">What you get — guaranteed</div>
              
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
                  "Every Sunday, Bedune runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
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
      tours: ['Sundarbans Boat Safari', 'Bakkhali Beach', 'Mousuni Island', 'Mukutmanipur'],
      example: { 
        name: 'Riya Das', 
        avatar: '/images/winner_priya_sen.png',
        story: 'Riya subscribed to Silver for ₹499. She didn\'t win the draw, but used her 1 Discount Credit to get ₹500 off her Sundarbans trip. She saved ₹1 more than she paid!' 
      },
    },
    {
      plan: 'Gold', price: 799, dc: 2, dcValue: 1000, roi: 125,
      color: 'from-amber-400 to-yellow-600', glow: 'gold',
      image: '/images/darjeeling_tea_1779521805614.png',
      tours: ['Darjeeling', 'Dooars Safari', 'Puri + Konark', 'Vizag + Araku Valley'],
      example: { 
        name: 'Arjun Roy', 
        avatar: '/images/winner_arjun_roy.png',
        story: 'Arjun paid ₹799 for Gold. He didn\'t win, but used his 2 DCs on two separate tours — ₹500 off each. Total savings: ₹1,000 on a ₹799 investment!' 
      },
    },
    {
      plan: 'Platinum', price: 1499, dc: 4, dcValue: 2000, roi: 133,
      color: 'from-indigo-400 via-purple-500 to-fuchsia-500', glow: 'purple',
      image: '/images/kashmir_dal_lake_1779521728036.png',
      tours: ['Kashmir', 'Rajasthan Royal', 'Kerala Backwaters', 'Shimla-Manali'],
      example: { 
        name: 'Priya Sen', 
        avatar: '/images/winner_ananya_das.png',
        story: 'Priya invested ₹1,499 in Platinum. She didn\'t win, but received 4 DCs — ₹500 off on 4 different tours = ₹2,000 total savings. That\'s 133% return!' 
      },
    },
  ];

  const faqs = [
    { q: 'What if I never win the lucky draw?', a: 'You still receive your full Discount Credits (DC). Each DC gives you ₹500 off on any domestic tour. Your subscription cost is always recovered — guaranteed.' },
    { q: 'Can I use multiple DCs on one tour?', a: 'No — 1 DC per tour booking. But you can use them on separate tours throughout your 12-month subscription period.' },
    { q: 'Do Discount Credits expire?', a: 'DCs are valid for the entire 12-month subscription period. Use them anytime within that window.' },
    { q: 'What happens if I DO win?', a: 'Winners get a fully paid tour (₹3,000–₹10,000 value depending on plan) with pickup, drop, hotel, and meals included. You travel free!' },
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
            <p className="mt-6 text-ink/70 text-lg leading-relaxed">Every subscriber gets guaranteed value back through Discount Credits (DC). Each DC = ₹500 flat discount on any domestic tour. Your subscription cost is always fully recovered — and then some.</p>
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
                    {/* Amount Paid → Value Received */}
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
                        = {card.dc} × ₹500 = <span className="text-emerald-400 font-bold">₹{card.dcValue.toLocaleString()} off</span> on {card.dc} domestic tour{card.dc > 1 ? 's' : ''}
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
                  <span className="text-xs text-emerald-400 font-semibold">Net ROI: {card.roi}% — Paid ₹{card.price}, got ₹{card.dcValue.toLocaleString()} value</span>
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
                <div className="font-display text-lg lg:text-xl font-extrabold text-white mb-1.5">The Bedune Promise</div>
                <p className="text-white/90 leading-relaxed font-semibold italic text-base">
                  "Every Sunday, Bedune runs a fair digital draw. If I win, I travel free. If not, I still get discounts. Either way, I gain."
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

/* ---------- Interactive India Map ---------- */
const MAP_3D_FRAMES = [
  'frame_001.jpg',
  'frame_002.jpg',
  'frame_003.jpg',
  'frame_004.jpg',
  'frame_005.jpg',
  'frame_006.jpg',
  'frame_008.jpg',
  'frame_010.jpg'
];

const HUB_PINS = [
  { name: 'Kashmir', top: '28%', left: '50%', plan: 'Platinum+', tag: 'Paradise on Earth · Houseboats', rating: 4.9 },
  { name: 'Darjeeling', top: '35%', left: '55.5%', plan: 'Gold+', tag: 'Tea Gardens · Toy Train', rating: 4.8 },
  { name: 'Rajasthan', top: '38%', left: '47.5%', plan: 'Gold+', tag: 'Royal Palaces & Forts', rating: 4.8 },
  { name: 'Goa', top: '48%', left: '48.5%', plan: 'Gold+', tag: 'Sun-kissed Beaches & Parties', rating: 4.8 },
  { name: 'Kerala', top: '54%', left: '50.5%', plan: 'Gold+', tag: 'Houseboats & Spices', rating: 4.9 },
  { name: 'Sundarbans', top: '41%', left: '54.5%', plan: 'Silver+', tag: 'Mangrove Forests & Tigers', rating: 4.7 },
  { name: 'Puri & Konark', top: '43%', left: '52.5%', plan: 'Silver+', tag: 'Golden Beach & Sun Temple', rating: 4.7 },
  { name: 'Dubai', top: '41%', left: '40%', plan: 'Platinum+', tag: 'Desert Safari & Burj Khalifa', rating: 4.9 },
  { name: 'Singapore', top: '56%', left: '58%', plan: 'Platinum+', tag: 'Gardens by the Bay', rating: 4.8 },
  { name: 'Maldives', top: '63%', left: '49.5%', plan: 'Platinum+', tag: 'Luxury Overwater Villas', rating: 4.9 }
];

function InteractiveIndiaMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePin, setActivePin] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Premium scroll physics: lower stiffness and higher damping for a "weighty", silky globe feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 25,
    mass: 1.2,
    restDelta: 0.001
  });

  const frameTransform = useTransform(smoothProgress, [0.15, 0.85], [0, 7]);

  useEffect(() => {
    return frameTransform.on("change", (latest) => {
      const rounded = Math.min(Math.max(Math.round(latest), 0), 7);
      setActiveFrameIndex(rounded);
    });
  }, [frameTransform]);

  const handlePinHover = (index: number, e: React.MouseEvent) => {
    setActivePin(index);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pin = HUB_PINS[index];
      const px = (parseFloat(pin.left) / 100) * rect.width;
      const py = (parseFloat(pin.top) / 100) * rect.height - 130;
      setTooltipPos({ x: px, y: py });
    }
  };

  const handlePinLeave = () => setActivePin(null);

  const pinColors = {
    'Silver+': '#94a3b8',
    'Gold+': '#f59e0b',
    'Platinum+': '#c084fc',
  };

  return (
    <Reveal>
      <div ref={containerRef} className="relative w-full h-[95vh] hidden md:block my-4">
        <div className="sticky top-20 w-full h-[520px] rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/60 shadow-2xl flex items-center justify-center">
          
          {/* Active 3D Globe Frame - Stacked layout to eliminate load flashes and enable smooth crossfades */}
          <div className="absolute inset-0 w-full h-full z-0 select-none bg-slate-950">
            {MAP_3D_FRAMES.map((frame, index) => (
              <img
                key={frame}
                src={`/images/map_3d_frames/${frame}`}
                alt={`3D Interactive Map Frame ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out will-change-opacity"
                style={{ 
                  opacity: activeFrameIndex === index ? 1 : 0,
                  zIndex: activeFrameIndex === index ? 1 : 0
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-transparent mix-blend-overlay pointer-events-none z-[2]" />
            <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none z-[2]" />
          </div>

          {/* HUD Status Bar */}
          <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-cyan-400">
              {activeFrameIndex === 0 
                ? "HUD status: flat map calibration" 
                : activeFrameIndex < 6 
                  ? "HUD status: compiling 3d synapse..." 
                  : "HUD status: global travel network active"}
            </span>
          </div>

          {/* Flat Map hotspots (only active on frame 0) */}
          <AnimatePresence>
            {activeFrameIndex === 0 && (
              <motion.div
                key="flat-pins"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                {HUB_PINS.map((pin, i) => {
                  const color = pinColors[pin.plan as keyof typeof pinColors] || '#00D9FF';
                  const isHovered = activePin === i;
                  return (
                    <div
                      key={pin.name}
                      style={{ top: pin.top, left: pin.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center"
                      onMouseEnter={(e) => handlePinHover(i, e)}
                      onMouseLeave={handlePinLeave}
                    >
                      <span className="absolute inline-flex h-6 w-6 rounded-full opacity-60 animate-ping" style={{ backgroundColor: color }} />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 shadow-lg" style={{ borderColor: color }} />
                      <motion.span 
                        animate={{ y: isHovered ? -4 : 0 }}
                        className="text-[9px] font-black uppercase tracking-wider mt-1.5 px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-800/80 text-white select-none whitespace-nowrap"
                        style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
                      >
                        {pin.name}
                      </motion.span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Tooltip Card overlay */}
          <AnimatePresence>
            {activePin !== null && activeFrameIndex === 0 && (
              <motion.div
                className="map-tooltip"
                initial={{ opacity: 0, y: 15, scale: 0.94, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  left: tooltipPos.x,
                  top: tooltipPos.y,
                  borderColor: pinColors[HUB_PINS[activePin].plan as keyof typeof pinColors] || 'rgba(0, 217, 255, 0.3)',
                  boxShadow: `0 20px 50px -12px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 217, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                }}
              >
                <div className="map-tooltip-body p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="map-tooltip-name text-[15px] font-black text-white">{HUB_PINS[activePin].name}</span>
                    <span className="text-[7.5px] font-extrabold tracking-widest px-2 py-0.5 rounded bg-slate-900 border text-white uppercase" style={{ borderColor: pinColors[HUB_PINS[activePin].plan as keyof typeof pinColors] }}>
                      {HUB_PINS[activePin].plan}
                    </span>
                  </div>
                  <div className="map-tooltip-tag text-[10px] text-slate-400 font-medium mb-3">{HUB_PINS[activePin].tag}</div>
                  
                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 text-[10px] text-slate-300">
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      {HUB_PINS[activePin].rating}
                    </span>
                    <span className="text-cyan-400 font-bold uppercase tracking-widest text-[8px] flex items-center gap-1">
                      Explore Route <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative scroll prompt in bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-80 pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.25em] text-cyan-400 font-bold font-mono">Scroll down to rotate globe</span>
            <div className="w-4 h-6 rounded-full border border-cyan/40 flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-cyan" 
              />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- Scenic Slideshow Component ---------- */
function ScenicSlideshow({ baseImage, name }: { baseImage: string; name: string }) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = useMemo(() => {
    if (name === 'Sundarbans') {
      return [baseImage, '/images/sundarbans_mangrove_1779521789593.png', baseImage];
    }
    if (name === 'Bakkhali Beach') {
      return [baseImage, '/images/bakkhali_beach.png', baseImage];
    }
    if (name === 'Mousuni Island') {
      return [baseImage, '/images/mousuni_island.png', baseImage];
    }
    return [baseImage, baseImage, baseImage];
  }, [baseImage, name]);

  useEffect(() => {
    if (!isHovered) {
      setIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
    }, 1800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const styles = [
    {
      label: 'Natural Vista',
      filter: 'none',
      overlay: 'linear-gradient(180deg, transparent 40%, rgba(2, 6, 23, 0.7) 100%)'
    },
    {
      label: 'Golden Hour',
      filter: 'sepia(0.25) saturate(1.8) hue-rotate(-12deg) contrast(1.1) brightness(0.95)',
      overlay: 'linear-gradient(180deg, rgba(245, 158, 11, 0.06) 0%, transparent 40%, rgba(2, 6, 23, 0.8) 100%)'
    },
    {
      label: 'Neon Aurora',
      filter: 'saturate(1.8) contrast(1.15) hue-rotate(145deg) brightness(0.88)',
      overlay: 'linear-gradient(180deg, rgba(0, 217, 255, 0.08) 0%, transparent 40%, rgba(2, 6, 23, 0.85) 100%)'
    }
  ];

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={images[index]}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              filter: images[index] === baseImage ? styles[index].filter : 'none'
            }}
            loading="lazy"
          />
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{ background: styles[index].overlay }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Floating Style Label Badge */}
      {isHovered && (
        <div className="absolute top-16 left-4 z-20">
          <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-black/60 border border-slate-700/50 text-cyan-400 backdrop-blur-sm shadow-sm">
            Style: {images[index] !== baseImage ? 'Alternative View' : styles[index].label}
          </span>
        </div>
      )}

      {/* Slide Indicators */}
      {isHovered && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/55 px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm">
          {styles.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-cyan animate-pulse' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Destination Card Component ---------- */
function DestinationCard({ d, index, activeTab, scrollLeft }: { d: typeof DESTINATIONS[number]; index: number; activeTab: string; scrollLeft: number }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const categoryAccents = {
    escapes: { text: 'text-cyan-400 bg-cyan-950/20 border-cyan/30', border: 'hover:border-cyan/50', glow: 'hover:shadow-cyan/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]', spotlight: 'rgba(0, 217, 255, 0.15)', label: 'cyan-check' },
    trails: { text: 'text-emerald-400 bg-emerald-950/20 border-emerald/30', border: 'hover:border-emerald/50', glow: 'hover:shadow-emerald/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]', spotlight: 'rgba(52, 211, 153, 0.15)', label: 'emerald-check' },
    royal: { text: 'text-amber-400 bg-amber-950/20 border-amber/30', border: 'hover:border-amber/50', glow: 'hover:shadow-amber/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]', spotlight: 'rgba(251, 191, 36, 0.15)', label: 'gold-check' },
    intl: { text: 'text-purple-400 bg-purple-950/20 border-purple/30', border: 'hover:border-purple/50', glow: 'hover:shadow-purple/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)]', spotlight: 'rgba(167, 139, 250, 0.15)', label: 'violet-check' }
  };
  
  const theme = categoryAccents[activeTab as keyof typeof categoryAccents] || categoryAccents.escapes;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const features = d.tag.split('·').map(f => f.trim());

  // Set up circular/elliptical orbital paths to float in multiple directions (no straight lines!)
  const radiusX = 14 + (index % 3) * 3; // 14px, 17px, 20px
  const radiusY = 10 + (index % 2) * 4; // 10px, 14px
  const speed = 9 + (index % 3) * 1.5;  // 9s, 10.5s, 12s
  
  // Calculate phase shift based on card index so they don't move together
  const phase = (index * Math.PI) / 2;
  
  // Generate orbital frames covering a full 360-degree rotation path
  const xFrames = [
    0,
    radiusX * Math.cos(phase),
    radiusX * Math.cos(phase + Math.PI / 2),
    radiusX * Math.cos(phase + Math.PI),
    radiusX * Math.cos(phase + 3 * Math.PI / 2),
    0
  ];
  const yFrames = [
    0,
    radiusY * Math.sin(phase),
    radiusY * Math.sin(phase + Math.PI / 2),
    radiusY * Math.sin(phase + Math.PI),
    radiusY * Math.sin(phase + 3 * Math.PI / 2),
    0
  ];
  const rotateFrames = [
    0,
    2.2 * Math.cos(phase + Math.PI / 4),
    2.2 * Math.cos(phase + Math.PI / 4 + Math.PI / 2),
    2.2 * Math.cos(phase + Math.PI / 4 + Math.PI),
    2.2 * Math.cos(phase + Math.PI / 4 + 3 * Math.PI / 2),
    0
  ];

  // Calculate dynamic scroll-linked scale and y-axis lift
  const cardSpacing = window.innerWidth < 640 ? 314 : 354;
  const distance = Math.abs((index * cardSpacing) - scrollLeft);
  const centerWeight = Math.max(0, 1 - distance / (cardSpacing * 1.5)); // 1 when centered, 0 when far

  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        animate={isHovered ? {
          x: 0,
          y: -16 - 10, // Rises even more on hover
          rotate: 0,
          scale: 1.08,
          transition: { type: 'spring', stiffness: 200, damping: 20 }
        } : {
          x: xFrames,
          y: yFrames.map(y => y + (-centerWeight * 16)), // Offset vertically based on viewport scroll center
          rotate: rotateFrames,
          scale: 0.94 + centerWeight * 0.12, // Scale up dynamically as it scrolls into center
          transition: {
            duration: speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: (index % 4) * 0.2
          }
        }}
        className="h-full"
      >
        <TiltCard intensity={4} className="h-full">
          <div 
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative h-[400px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/60 transition-all duration-500 zoom-hover-img cursor-pointer backdrop-blur-md ${theme.border} ${theme.glow}`}
          >
            {/* Interactive Mouse Spotlight gradient */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
              style={{
                background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${theme.spotlight}, transparent 80%)`
              }}
            />

            {/* Background Images ScenicSlideshow */}
            <div className="absolute inset-0 overflow-hidden z-0">
              <ScenicSlideshow baseImage={d.img} name={d.name} />
            </div>
            
            {/* Cinema dynamic grading shaders */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

            {/* Top Info Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10 pointer-events-none select-none">
              <div className="flex gap-1.5">
                <div className="px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 text-white text-[9px] font-mono tracking-wider font-extrabold uppercase backdrop-blur-md shadow-lg">{d.duration}</div>
                <div className="px-2.5 py-1.5 rounded-full bg-slate-950/80 border text-[9px] font-mono tracking-wider font-extrabold uppercase backdrop-blur-md shadow-lg text-white" style={{ borderColor: theme.spotlight.replace('0.15', '0.4') }}>{d.planBadge}</div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-black backdrop-blur-md shadow-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {d.rating}
              </div>
            </div>

            {/* Info Details Content */}
            <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end">
              <div className="text-[10px] uppercase tracking-widest font-mono font-bold mb-1.5 flex items-center gap-1.5 animate-pulse" style={{ color: theme.accentColor || theme.text.split(' ')[0] }}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                // Season: {d.season}
              </div>
              
              <h3 className="font-display text-2xl font-black text-white leading-snug group-hover:translate-y-[-4px] transition-transform duration-350">{d.name}</h3>
              
              {/* Dynamic tag capsules */}
              <div className="flex flex-wrap gap-1.5 mt-2.5 transition-transform duration-350 group-hover:translate-y-[-2px]">
                {features.map((feat) => (
                  <span 
                    key={feat} 
                    className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold tracking-tight bg-slate-950/70 border border-white/5 text-slate-300"
                  >
                    {feat}
                  </span>
                ))}
              </div>

              {/* Explore trigger overlay */}
              <div className="mt-4 flex items-center gap-2 text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-350" style={{ color: theme.text.split(' ')[0] }}>
                Explore itinerary details 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Visual glow element */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ backgroundColor: theme.spotlight.replace('0.15', '0.28') }} />
          </div>
        </TiltCard>
      </motion.div>
    </Reveal>
  );
}

/* ---------- Destinations Showcase ---------- */
function Destinations() {
  const [activeTab, setActiveTab] = useState<'escapes' | 'trails' | 'royal' | 'intl'>('escapes');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const filtered = DESTINATIONS.filter(d => d.category === activeTab);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: any) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setActiveTab(tabId);
      });
    } else {
      setActiveTab(tabId);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
    setScrollProgress(0);
    setScrollLeft(0);
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollLeft(target.scrollLeft);
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(target.scrollLeft / maxScroll);
    } else {
      setScrollProgress(0);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.75;
      carouselRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
                <KineticText text="Weekend Escapes" delay={0.3} />
              </span>
            </h2>
            <p className="mt-6 text-slate-300/80 text-lg leading-relaxed">
              Scroll through handpicked destinations crafted for unforgettable journeys.
            </p>
          </div>
        </Reveal>

        {/* Cinematic Travel Showreel */}
        <CinematicShowreel />

        {/* Premium Filters Tab & Map Pin Hover Animation */}
        <Reveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6">
            <div className="inline-flex flex-wrap p-1.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 shadow-2xl backdrop-blur-md gap-1">
              {[
                { id: 'escapes', label: 'Weekend Escapes' },
                { id: 'trails', label: 'Hill & Tea Trails' },
                { id: 'royal', label: 'Royal India Tours' },
                { id: 'intl', label: 'Premium International Trips' },
              ].map((tab) => {
                const count = DESTINATIONS.filter(d => d.category === tab.id).length;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`relative px-5 py-2.5 rounded-xl text-xs font-bold font-display tracking-wider transition-all duration-300 select-none cursor-pointer z-10 ${
                      isActive
                        ? 'text-white font-black'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeDestTabPill"
                        className="absolute inset-0 bg-gradient-to-r from-neon-gold to-gold-deep rounded-xl z-[-1] shadow-lg shadow-teal-500/25"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{tab.label}</span>
                    <span className={`ml-1.5 font-mono text-[9px] ${isActive ? 'opacity-85 text-emerald-250' : 'opacity-50'}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cinematic Studio navigation badge */}
            <a 
              href="#cinematic-showreel"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/60 border border-slate-800/60 text-xs font-bold text-cyan-400 hover:text-cyan-300 group cursor-pointer hover:border-cyan-500/50 transition-all shadow-lg backdrop-blur-md select-none animate-float-gentle"
            >
              <div className="relative flex items-center justify-center">
                <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span className="absolute w-6 h-6 rounded-full bg-cyan-500/25 scale-150 animate-ping group-hover:scale-[2] duration-700" />
              </div>
              <span className="font-mono tracking-tight uppercase">Enter Cinematic Studio</span>
            </a>
          </div>
        </Reveal>
      </div>

      {/* 3D Scattered Scroll Showcase */}
      <ScatteredShowcase destinations={filtered} activeTab={activeTab} />
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
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmos via-cosmos/40 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-neon-gold to-gold text-cosmos text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg"><Award className="w-3 h-3" /> {w.plan} Winner</div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <img src={w.img} alt={w.name} className="w-12 h-12 rounded-full border-2 border-neon-gold object-cover shadow-lg" loading="lazy" />
                    <div>
                      <div className="font-display font-bold text-ink">{w.name}</div>
                      <div className="text-xs text-ink/70">Won · {w.dest}</div>
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
        opacity: 1
      };
    }

    if (isAnyHovered) {
      return {
        x: baseX,
        y: baseY,
        rotate: baseRotate,
        scale: 0.9,
        zIndex,
        opacity: 0.45
      };
    }

    return {
      x: baseX,
      y: baseY,
      rotate: baseRotate,
      scale: 1,
      zIndex,
      opacity: 1
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
              <p className="mt-6 text-white/80 text-lg leading-relaxed">From the misty peaks of Kashmir to the sun-drenched beaches of Goa — every trip we craft becomes a chapter in your life's most beautiful story.</p>
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
                  {isDeckHovered ? '✨ Tap or hover cards to reveal' : '👉 Hover or tap to expand gallery'}
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
                      ${img.theme === 'cyan' ? 'border-cyan/20 hover:border-cyan/80' : img.theme === 'gold' ? 'border-amber-400/20 hover:border-amber-400/80' : 'border-purple-500/20 hover:border-purple-500/80'}
                    `}
                  >
                    <motion.div
                      className="w-full h-full relative"
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
                      
                      {/* Atmospheric overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                      {/* Content overlays */}
                      <div className="absolute inset-x-0 bottom-0 p-4 pt-12 z-20 flex flex-col justify-end">
                        <span className={`text-[9px] font-bold uppercase tracking-widest font-mono mb-1 w-fit px-2 py-0.5 rounded-md bg-black/45 border
                          ${img.theme === 'cyan' ? 'text-cyan border-cyan/20' : img.theme === 'gold' ? 'text-neon-gold border-amber-500/20' : 'text-purple-300 border-purple-500/20'}
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
                  <div className="font-display font-bold text-lg">5★</div>
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
function CTABanner() {
  return (
    <section id="contact" className="pt-12 pb-32 lg:pt-16 lg:pb-48 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-5 lg:px-8 text-center z-10 -translate-y-10 lg:-translate-y-16">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-neon-gold text-[11px] uppercase tracking-widest font-semibold mb-6"><Zap className="w-3.5 h-3.5" /> Lock Your Entry</div>
          <h2 className="font-display text-4xl lg:text-6xl font-bold text-ink leading-tight">
            <KineticText text="Your next story begins" />
            <br /><span className="gold-shimmer"><KineticText text="with a single subscription." delay={0.4} /></span>
          </h2>
          <p className="mt-6 text-lg text-ink/70 max-w-2xl mx-auto font-semibold">Join thousands of travelers who trust Bedune for AI-curated journeys, transparent draws, and guaranteed value.</p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a href="#plans"><ParticleButton variant="gold" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base"><Crown className="w-5 h-5" /> Lock Your Entry <ChevronRight className="w-5 h-5" /></ParticleButton></a>
            <a href="tel:+918768903565" data-magnetic><ParticleButton variant="cyan" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold"><Phone className="w-4 h-4" /> +91 87689 03565</ParticleButton></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const company = ['About Bedune', 'Our Story', 'Leadership', 'Careers', 'Press & Media'];
  const trust = ['Operational Integrity', 'Digital Audit Archive', 'Lucky Draw Rules', 'Regulatory Compliance', 'RNG Certification'];
  const support = ['Help Center', 'Refund Policy', 'Terms of Service', 'Privacy Policy', 'Grievance Officer'];
  return (
    <footer className="bg-cosmos border-t border-slate-line pt-16 pb-10 relative">
      <StarField count={30} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 pb-12 border-b border-slate-line">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan/30 shadow-lg shadow-cyan/20 bg-cosmos flex items-center justify-center p-1.5">
                <img src="/images/bedune_logo_cropped.png" alt="Bedune Logo" className="w-full h-full object-contain" />
              </div>
              <div><div className="font-display text-xl font-bold text-ink">BEDUNE</div><div className="text-[10px] uppercase tracking-[0.22em] neon-cyan">Tour & Travels</div></div>
            </div>
            <p className="font-serif italic text-neon-gold text-lg mb-3">Safar jo yaad rahe.</p>
            <p className="text-sm text-ink/60 leading-relaxed max-w-sm mb-6">India's subscription-first travel company — built on transparency, guaranteed value, and journeys that live forever.</p>
            <div className="flex items-start gap-3 p-4 glass-light rounded-xl border border-slate-line">
              <MapPin className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
              <div className="text-sm text-ink/75 leading-relaxed"><div className="font-semibold text-ink">Registered Office</div>Fulia, Nadia,<br />West Bengal, India<br />Pin — 741402</div>
            </div>
          </div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest">Company</div><ul className="space-y-2.5">{company.map((l) => <li key={l}><a href="#" data-magnetic className="text-sm text-ink/60 hover:neon-cyan transition-all">{l}</a></li>)}</ul></div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest">Trust</div><ul className="space-y-2.5">{trust.map((l) => <li key={l}><a href="#" data-magnetic className="text-sm text-ink/60 hover:neon-cyan transition-all">{l}</a></li>)}</ul></div>
          <div className="lg:col-span-2"><div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest">Support</div><ul className="space-y-2.5">{support.map((l) => <li key={l}><a href="#" data-magnetic className="text-sm text-ink/60 hover:neon-cyan transition-all">{l}</a></li>)}</ul></div>
          <div className="lg:col-span-2">
            <div className="font-display font-bold text-ink mb-4 text-xs uppercase tracking-widest flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-neon-gold" /> Audit Archive</div>
            <ul className="space-y-2.5">
              {AUDIT_REPORTS.map((a) => <li key={a.week}><a href="#" data-magnetic className="group flex items-center gap-2 text-sm text-ink/60 hover:neon-gold transition-all"><Download className="w-3 h-3 opacity-50 group-hover:opacity-100" /><span className="text-xs font-mono">{a.week}</span></a></li>)}
              <li className="pt-2"><a href="#audit" className="text-xs font-semibold neon-cyan inline-flex items-center gap-1 font-mono">&gt; full_archive() <ArrowRight className="w-3 h-3" /></a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-ink/50 uppercase tracking-widest">Connect</span>
            <div className="flex gap-2">{[Video, Camera, Send, Tv, Share2].map((Icon, i) => <a key={i} href="#" data-magnetic className="w-9 h-9 rounded-lg glass-light flex items-center justify-center hover:neon-border-cyan transition-all border border-slate-line"><Icon className="w-4 h-4" /></a>)}</div>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink/45">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-neon-gold" /> RNG Certified</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-cyan" /> E2E Encrypted</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-neon-gold" /> Audited</span>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-slate-line text-center text-xs text-ink/40 font-mono">© 2026 Bedune Tour & Travels. · <a href="#" className="hover:neon-cyan">terms</a> · <a href="#" className="hover:neon-cyan">privacy</a> · <a href="#" className="hover:neon-cyan">refunds</a></div>
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

function MobileSticky() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-3 pb-4">
      <div className="glass rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/60 border border-slate-line">
        <a href="https://wa.me/918768903565" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
        <a href="tel:+918768903565" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl glass-light border border-slate-line text-ink text-xs font-bold"><Phone className="w-4 h-4" /> Call</a>
        <a href="#plans" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-neon-gold to-gold text-cosmos text-xs font-bold"><Crown className="w-4 h-4" /> Join</a>
      </div>
    </div>
  );
}

function ScrollRouteLine() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 50, damping: 25 });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '98%']);

  return (
    <div className="hidden xl:block absolute left-[3%] top-[110vh] bottom-[10vh] w-1 z-20 pointer-events-none animate-fade-in" style={{ minHeight: 'calc(100% - 120vh)' }}>
      <div className="sticky top-[25vh] h-[50vh] w-8 overflow-visible flex flex-col items-center">
        <svg className="w-8 h-full overflow-visible route-line-svg" fill="none">
          {/* Base path */}
          <line
            x1="16"
            y1="0"
            x2="16"
            y2="400"
            stroke="rgba(13, 148, 136, 0.15)"
            strokeWidth="3"
            strokeDasharray="6,6"
            strokeLinecap="round"
          />
          {/* Draw path */}
          <motion.path
            d="M 16 0 V 400"
            stroke="#0D9488"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
        <motion.div
          style={{ y }}
          className="route-airplane-tracker absolute left-1/2 -translate-x-1/2 top-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 border-2 border-white/80 flex items-center justify-center shadow-lg shadow-teal-500/30 z-30"
        >
          <Plane className="w-5 h-5 text-white rotate-180" />
        </motion.div>
      </div>
    </div>
  );
}



/* ---------- App ---------- */
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  const handleSelectPlan = useCallback((planName: string) => {
    const text = `Hello Bedune, I want to subscribe to the ${planName} plan. Please guide me on the payment process.`;
    const whatsappUrl = `https://wa.me/918768903565?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  return (
    <div className="min-h-screen bg-cosmos text-ink relative">
      <AnimatePresence>{!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}</AnimatePresence>
      <ScrollProgress />
      <CustomCursor />
      <ScrollRouteLine />

      <div className="noise fixed inset-0 pointer-events-none z-30" />
      <Navbar />


      <main className="relative z-10 flex flex-col gap-8 lg:gap-12">
        <Hero />
        <TrustStrip />

        
        <div className="relative video-bg-container">
          {/* ── CINEMATIC FIXED BACKGROUND VIDEO: constrained to screen width/height to prevent stretching and pixelation ── */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
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
           {/* Dark cinematic overlay — Lightened to make the video brighter */}
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
            <ScrollRoundedSection><CTABanner /></ScrollRoundedSection>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
      <MobileSticky />
      <a href="#plans" className="choose-btn hidden lg:inline-flex">
        <ParticleButton variant="gold" className="px-5 py-3 rounded-full font-bold text-sm shadow-xl shadow-neon-gold/30 flex items-center gap-1.5 hover:scale-110 transition-transform">
          <Crown className="w-4 h-4" /> Choose Plan
        </ParticleButton>
      </a>
    </div>
  );
}
