import {
  Award,
  Banknote,
  Compass,
  Crown,
  FileCheck2,
  Globe,
  Hotel,
  MapPin,
  MessageCircle,
  Plane,
  Rocket,
  Sparkles,
  Star,
  Ticket,
  Train,
} from 'lucide-react';

export const NAV = [
  { id: 'about', label: 'About', icon: Compass },
  { id: 'how', label: 'How It Works', icon: Sparkles },
  { id: 'plans', label: 'Plans', icon: Crown },
  { id: 'luckydraw', label: 'Travel Reward', icon: Ticket },
  { id: 'destinations', label: 'Destinations', icon: MapPin },
  { id: 'contact', label: 'Contact', icon: MessageCircle },
];

export const DESKTOP_NAV = [
  { id: 'about', label: 'About', icon: Compass },
  { id: 'plans', label: 'Plans', icon: Crown },
  { id: 'destinations', label: 'Destinations', icon: MapPin },
  { id: 'contact', label: 'Contact', icon: MessageCircle },
];

export const PLANS = [
  {
    name: 'Silver', price: 499, tagline: 'Smart Starter', icon: Star,
    color: 'from-slate-500 to-slate-700', glow: 'slate',
    tourValue: 3000, duration: '2N / 3D', discountCredits: 1, discountValue: 500,
    paidDiscount: 'Up to 5% off', nameChange: 'No Option',
    image: '/images/sundarbans_mangrove_1779521789593.png',
    imageLabel: 'Sundarbans - Boat Safari',
    destinations: ['Sundarban', 'Digha', 'Mousuni Island', 'Purulia'],
    benefits: ['1 Weekly Promotional Draw entry', 'Eligible for promotional winner benefits', '₹500 discount credit if not selected', 'Up to 5% off on paid domestic tours', '12-month subscription validity', '18+ Membership Only'],
  },
  {
    name: 'Gold', price: 799, tagline: 'Balanced Choice', icon: Award,
    color: 'from-teal-400 to-emerald-600', glow: 'teal',
    tourValue: 5000, duration: '2N / 3D', discountCredits: 2, discountValue: 1000,
    paidDiscount: 'Up to 7% off', nameChange: 'One time',
    image: '/images/darjeeling_tea_1779521805614.png',
    imageLabel: 'Darjeeling - Tea Gardens',
    destinations: ['Darjeeling', 'Dooars', 'Puri', 'Daring Bari'],
    benefits: ['1 Weekly Promotional Draw entry', 'Eligible for promotional winner benefits', '₹1,000 discount credits if not selected', 'Up to 7% off on paid domestic tours', 'One-time family name change allowed', '18+ Membership Only'],
  },
  {
    name: 'Platinum', price: 1499, tagline: 'Premium Experience', icon: Crown,
    color: 'from-neon-gold via-gold to-gold-deep', glow: 'gold',
    featured: true, tourValue: 10000, duration: '3N / 4D',
    discountCredits: 4, discountValue: 2000,
    paidDiscount: 'Up to 10% off',
    nameChange: 'Two times',
    image: '/images/kashmir_dal_lake_1779521728036.png',
    imageLabel: 'Kashmir - Dal Lake',
    destinations: ['Kashmir', 'Goa', 'Sikkim', 'Himachal (Shimla+Manali)'],
    benefits: [
      '1 Weekly Promotional Draw entry',
      'Eligible for promotional winner benefits',
      '₹2,000 discount credits if not selected',
      'Up to 10% off on paid domestic tours',
      'Two family name changes allowed',
      '18+ Membership Only'
    ],
  },
];

export const INTL_PLANS = [
  {
    name: 'Silver', price: 4999, tagline: 'International Starter', icon: Globe,
    color: 'from-sky-400 to-blue-600', glow: 'blue',
    tourValue: 25000, duration: '3N / 4D', discountCredits: 10, discountValue: 5000,
    paidDiscount: 'Up to 5% off', insurance: '50% off', nameChange: 'One time',
    image: '/images/nepal.png',
    imageLabel: 'Nepal - Valley & Peaks',
    destinations: ['Nepal', 'Bhutan'],
    benefits: ['1 Weekly Promotional Draw entry', 'Winner tour value up to ₹25,000 (3N/4D)', '₹5,000 discount credits if not selected', 'Up to 5% off on paid international tours', 'One-time family name change allowed', '18+ Membership Only'],
  },
  {
    name: 'Gold', price: 7999, tagline: 'Premium Explorer', icon: Plane,
    color: 'from-emerald-400 to-teal-600', glow: 'teal',
    featured: true, tourValue: 50000, duration: '4N / 5D', discountCredits: 20, discountValue: 10000,
    paidDiscount: 'Up to 7% off', insurance: 'Included free', nameChange: 'Two times',
    image: '/images/thailand.png',
    imageLabel: 'Thailand - Temples & Beaches',
    destinations: ['Thailand', 'Bali (Indonesia)'],
    benefits: ['1 Weekly Promotional Draw entry', 'Winner tour value up to ₹50,000 (4N/5D)', '₹10,000 discount credits if not selected', 'Up to 7% off on paid international tours', 'Two family name changes allowed', '18+ Membership Only'],
  },
  {
    name: 'Platinum', price: 14999, tagline: 'Ultimate World Pass', icon: Rocket,
    color: 'from-cyan via-cyan-bright to-cyan-deep', glow: 'cyan',
    tourValue: 100000, duration: '5N / 6D', discountCredits: 40, discountValue: 20000,
    paidDiscount: 'Up to 10% off', insurance: 'Included free', nameChange: 'Unlimited',
    image: '/images/vietnam.png',
    imageLabel: 'Vietnam - Bays & Cities',
    destinations: ['Dubai', 'Vietnam'],
    benefits: ['1 Weekly Promotional Draw entry', 'Winner tour value up to ₹1,00,000 (5N/6D)', '₹20,000 discount credits if not selected', 'Up to 10% off on paid international tours', 'Unlimited name changes allowed', '18+ Membership Only'],
  },
];

export const SERVICES = [
  { icon: Compass, title: 'Customized Tour Packages', desc: 'AI-curated itineraries built around your pace, interests, and travel style.', image: '/images/service_tours.png' },
  { icon: Hotel, title: 'Hotel Booking', desc: 'Curated stays from boutique hideaways to five-star retreats, worldwide.', image: '/images/service_hotels.png' },
  { icon: Train, title: 'Train Ticket Booking', desc: 'Seamless IRCTC reservations with confirmed berths and instant PNR updates.', image: '/images/service_trains.png' },
  { icon: Plane, title: 'Flight Ticket Booking', desc: 'Best fares across domestic and international carriers with flexible options.', image: '/images/service_flights.png' },
  { icon: FileCheck2, title: 'Visa Application', desc: 'End-to-end documentation, interview prep, and embassy coordination.', image: '/images/service_visas.png' },
  { icon: Banknote, title: 'Currency Exchange', desc: 'Competitive forex rates with doorstep delivery and zero hidden fees.', image: '/images/service_currency.png' },
];

export const AUDIT_REPORTS = [
  { week: 'Week 42 - 2026', status: 'Published', date: '19 Oct 2026' },
  { week: 'Week 41 - 2026', status: 'Published', date: '12 Oct 2026' },
  { week: 'Week 40 - 2026', status: 'Published', date: '05 Oct 2026' },
  { week: 'Week 39 - 2026', status: 'Published', date: '28 Sep 2026' },
];

export const DESTINATIONS = [
  { name: 'Sundarbans', tag: 'Tiger Reserve - Mangrove Boats', duration: '2N/3D', rating: 4.7, season: 'Oct - Mar', img: '/images/sundarbans_mangrove_premium.png', category: 'escapes', planBadge: 'Silver+', price: '₹12,499', location: 'West Bengal' },
  { name: 'Bakkhali Beach', tag: 'Casuarina Shore - Delta Sunset', duration: '1N/2D', rating: 4.6, season: 'Oct - Apr', img: '/images/bakkhali_beach_premium.png', category: 'escapes', planBadge: 'Silver+', price: '₹4,999', location: 'West Bengal' },
  { name: 'Mousuni Island', tag: 'Seaside Camp - Huts & Palms', duration: '1N/2D', rating: 4.5, season: 'Nov - Mar', img: '/images/mousuni_island_premium.png', category: 'escapes', planBadge: 'Silver+', price: '₹3,499', location: 'West Bengal' },
  { name: 'Mukutmanipur', tag: 'Hills, Forests & Kangsabati Dam', duration: '1N/2D', rating: 4.5, season: 'Oct - Mar', img: '/images/mukutmanipur_premium.png', category: 'escapes', planBadge: 'Silver+', price: '₹5,999', location: 'West Bengal' },
  { name: 'Darjeeling', tag: 'Tiger Hill Sunrise - Tea Estates', duration: '3N/4D', rating: 4.8, season: 'Mar - Jun', img: '/images/darjeeling_tea_1779521805614.png', category: 'trails', planBadge: 'Gold+', price: '₹17,499', location: 'West Bengal' },
  { name: 'Dooars Safari', tag: 'Forest Huts - River Wilds', duration: '2N/3D', rating: 4.6, season: 'Sep - Apr', img: '/images/dooars_safari.png', category: 'trails', planBadge: 'Gold+', price: '₹14,999', location: 'West Bengal' },
  { name: 'Shimla & Manali', tag: 'Mall Road - Solang Valley Adventure', duration: '5N/6D', rating: 4.9, season: 'Oct - May', img: '/images/himachal_hills.png', category: 'trails', planBadge: 'Platinum+', price: '₹24,999', location: 'Himachal' },
  { name: 'Kashmir', tag: 'Paradise on Earth - Dal Lake & Houseboats', duration: '4N/5D', rating: 4.9, season: 'Apr - Oct', img: '/images/kashmir_dal_lake_1779521728036.png', category: 'trails', planBadge: 'Platinum+', price: '₹32,999', location: 'Kashmir' },
  { name: 'Vizag & Araku', tag: 'Araku Coffee Gardens & Borra Caves', duration: '3N/4D', rating: 4.7, season: 'Oct - Mar', img: '/images/vizag_araku.png', category: 'trails', planBadge: 'Gold+', price: '₹15,499', location: 'Andhra Pradesh' },
  { name: 'Rajasthan Royal', tag: 'Jaipur - Udaipur - Desert Dunes', duration: '5N/6D', rating: 4.8, season: 'Oct - Mar', img: '/images/rajasthan_palace_1779521744228.png', category: 'royal', planBadge: 'Gold+', price: '₹21,999', location: 'Rajasthan' },
  { name: 'Kerala Backwaters', tag: 'Houseboats - Munnar Hills', duration: '4N/5D', rating: 4.9, season: 'Sep - Mar', img: '/images/kerala_houseboat_1779521772928.png', category: 'royal', planBadge: 'Gold+', price: '₹19,499', location: 'Kerala' },
  { name: 'Puri & Konark', tag: 'Sun Temple - Golden Beach', duration: '3N/4D', rating: 4.7, season: 'Oct - Mar', img: '/images/puri_konark.png', category: 'royal', planBadge: 'Gold+', price: '₹15,499', location: 'Odisha' },
  { name: 'Goa', tag: 'Sun-kissed Beaches - Heritage & Nightlife', duration: '3N/4D', rating: 4.8, season: 'Oct - May', img: '/images/goa_beaches.png', category: 'royal', planBadge: 'Platinum+', price: '₹18,999', location: 'Goa' },
  { name: 'Dubai', tag: 'Burj Khalifa - Desert Safaris', duration: '4N/5D', rating: 4.9, season: 'Nov - Mar', img: '/images/dubai_skyline_1779539448313.png', category: 'intl', planBadge: 'Platinum+', price: '₹52,999', location: 'Dubai, UAE' },
  { name: 'Singapore', tag: 'Sentosa - Gardens by the Bay', duration: '4N/5D', rating: 4.8, season: 'Year-round', img: '/images/singapore_skyline_1779539502293.png', category: 'intl', planBadge: 'Platinum+', price: '₹59,999', location: 'Singapore' },
  { name: 'Maldives', tag: 'Overwater Bungalows - Reefs', duration: '4N/5D', rating: 4.9, season: 'Nov - Apr', img: '/images/maldives_overwater_1779539482305.png', category: 'intl', planBadge: 'Platinum+', price: '₹79,999', location: 'Maldives' },
  { name: 'Thailand', tag: 'Bangkok Temples & Pattaya Beaches', duration: '4N/5D', rating: 4.7, season: 'Nov - Apr', img: '/images/thailand.png', category: 'intl', planBadge: 'Platinum+', price: '₹45,999', location: 'Thailand' },
  { name: 'Sri Lanka', tag: 'Sigiriya Rock Fortress & Kandy Hills', duration: '4N/5D', rating: 4.6, season: 'Dec - Apr', img: '/images/sri_lanka.png', category: 'intl', planBadge: 'Platinum+', price: '₹39,999', location: 'Sri Lanka' },
  { name: 'Nepal', tag: 'Kathmandu Valley & Himalayan Pokhara', duration: '3N/4D', rating: 4.7, season: 'Sep - Nov', img: '/images/nepal.png', category: 'intl', planBadge: 'Platinum+', price: '₹24,999', location: 'Nepal' },
  { name: 'Malaysia', tag: 'Kuala Lumpur Skyline & Langkawi', duration: '4N/5D', rating: 4.7, season: 'Year-round', img: '/images/malaysia.png', category: 'intl', planBadge: 'Platinum+', price: '₹42,999', location: 'Malaysia' },
  { name: 'Bali', tag: 'Ubud Rice Terraces & Uluwatu Temple', duration: '4N/5D', rating: 4.9, season: 'Apr - Oct', img: '/images/bali.png', category: 'intl', planBadge: 'Platinum+', price: '₹49,999', location: 'Bali, Indonesia' },
  { name: 'Vietnam', tag: 'Halong Bay Cruise & Hanoi Old Quarter', duration: '5N/6D', rating: 4.8, season: 'Nov - Apr', img: '/images/vietnam.png', category: 'intl', planBadge: 'Platinum+', price: '₹41,999', location: 'Vietnam' },
  { name: 'Europe', tag: 'Paris Eiffel Tower & Swiss Alps', duration: '7N/8D', rating: 4.9, season: 'May - Sep', img: '/images/europe.png', category: 'intl', planBadge: 'Platinum+', price: '₹1,24,999', location: 'Europe' },
  { name: 'Turkey', tag: 'Cappadocia Balloons & Pamukkale Pools', duration: '5N/6D', rating: 4.8, season: 'Apr - Oct', img: '/images/turkey.png', category: 'intl', planBadge: 'Platinum+', price: '₹89,999', location: 'Turkey' },
  { name: 'Japan', tag: 'Tokyo Neon & Kyoto Cherry Blossoms', duration: '6N/7D', rating: 4.9, season: 'Mar - May', img: '/images/japan.png', category: 'intl', planBadge: 'Platinum+', price: '₹1,39,999', location: 'Japan' },
];

export const WINNERS_DATA = [
  { name: 'Ananya Das', plan: 'Platinum', dest: 'Kashmir', week: 'Week 42', img: '/images/winner_ananya_das.png', destImg: '/images/kashmir_dal_lake_1779521728036.png' },
  { name: 'Rajesh Kumar', plan: 'Gold', dest: 'Darjeeling', week: 'Week 41', img: '/images/winner_rajesh_kumar.png', destImg: '/images/darjeeling_tea_1779521805614.png' },
  { name: 'Priya Sen', plan: 'Silver', dest: 'Sundarbans', week: 'Week 40', img: '/images/winner_priya_sen.png', destImg: '/images/sundarbans_mangrove_1779521789593.png' },
  { name: 'Arjun Roy', plan: 'Platinum', dest: 'Kerala', week: 'Week 39', img: '/images/winner_arjun_roy.png', destImg: '/images/kerala_houseboat_1779521772928.png' },
  { name: 'Meera Bose', plan: 'Gold', dest: 'Rajasthan', week: 'Week 38', img: '/images/winner_meera_bose.png', destImg: '/images/rajasthan_palace_1779521744228.png' },
  { name: 'Subhadeep Ghosh', plan: 'Platinum', dest: 'Himachal', week: 'Week 37', img: '/images/winner_subhadeep_ghosh.png', destImg: '/images/himachal_hills.png' },
];

export const JOURNEY_IMAGES = [
  { src: '/images/happy_family_travelers.png', label: 'Happy Families', desc: 'Crafting lifetime memories', badge: 'Silver+', theme: 'cyan' },
  { src: '/images/rajasthan_palace_1779521744228.png', label: 'Royal Rajasthan', desc: 'Golden sands & majestic palaces', badge: 'Gold+', theme: 'gold' },
  { src: '/images/kerala_houseboat_1779521772928.png', label: 'Kerala Backwaters', desc: 'Serene houseboats & palms', badge: 'Silver+', theme: 'cyan' },
  { src: '/images/sundarbans_mangrove_1779521789593.png', label: 'Sundarbans Safari', desc: 'Mysterious mangrove boat trails', badge: 'Silver+', theme: 'gold' },
  { src: '/images/kashmir_dal_lake_1779521728036.png', label: 'Heavenly Kashmir', desc: 'Misty peaks & shikara rides', badge: 'Platinum+', theme: 'cyan' }
];

export const HERO_SLIDES = [
  {
    image: '/images/beduine_travel_hero_1779521651766.png',
    tagline: 'Safar Jo Yaad Rahe',
    title1: 'Explore More.',
    title2: 'Pay Less.',
    desc: "India's first subscription-based travel company. Get guaranteed non-cash Discount Credits and weekly promotional member tour benefits.",
  },
  {
    image: '/images/kashmir_dal_lake_1779521728036.png',
    tagline: 'Paradise on Earth',
    title1: 'Misty Peaks &',
    title2: 'Heavenly Valleys.',
    desc: 'Glide through the tranquil Dal Lake in a Shikara and explore the snow-kissed mountains of Gulmarg.',
  },
  {
    image: '/images/kerala_houseboat_1779521772928.png',
    tagline: "God's Own Country",
    title1: 'Emerald Backwaters &',
    title2: 'Tropical Sunsets.',
    desc: "Unwind in private luxury houseboats and walk through the mist-laden green tea plantations of Munnar.",
  },
  {
    image: '/images/darjeeling_tea_1779521805614.png',
    tagline: 'Queen of the Hills',
    title1: 'Golden Sunrise &',
    title2: 'Himalayan Peaks.',
    desc: 'Watch the sunrise paint Mount Kanchenjunga from Tiger Hill and ride the historic Himalayan Toy Train.',
  },
  {
    image: '/images/dubai_skyline_1779539448313.png',
    tagline: 'City of Gold',
    title1: 'Modern Wonders &',
    title2: 'Golden Dunes.',
    desc: 'Gaze out from the heights of Burj Khalifa, cruise the Dubai Marina, and enjoy a traditional desert safari sunset.',
  },
  {
    image: '/images/singapore_skyline_1779539502293.png',
    tagline: 'Urban Oasis',
    title1: 'Futuristic Gardens &',
    title2: 'Neon Supertrees.',
    desc: 'Explore the spectacular Gardens by the Bay, walk the iconic modern skyline, and enjoy the beauty of Sentosa.',
  },
  {
    image: '/images/rajasthan_palace_1779521744228.png',
    tagline: 'Land of Kings',
    title1: 'Heritage Forts &',
    title2: 'Royal Luxury.',
    desc: 'Step into history with royal palaces in Udaipur, ancient forts in Jaipur, and camps under the stars in Jaisalmer.',
  },
  {
    image: '/images/maldives_overwater_1779539482305.png',
    tagline: 'Ocean Paradise',
    title1: 'Overwater Villas &',
    title2: 'Turquoise Waters.',
    desc: 'Relax on powder-white sands, stay over crystal-clear lagoons, and snorkel with colorful marine life in tropical warmth.',
  },
];

export const JOURNEY_FLOATS = [
  { x: [0, 8, -6, 5, 0], y: [0, -10, 8, -6, 0], rotate: [0, 1.8, -1.2, 1.2, 0], scale: [1, 1, 1], duration: 9.5 },
  { x: [0, -7, 8, -5, 0], y: [0, 12, -8, 6, 0], rotate: [0, -1.5, 2, -1, 0], scale: [1, 1, 1], duration: 11 },
  { x: [0, 10, 0, -10, 0], y: [0, -5, 10, -5, 0], rotate: [0, 1.2, -1.8, 1.2, 0], scale: [1, 1, 1], duration: 12.5 },
  { x: [0, -9, 6, -8, 0], y: [0, -8, 10, -7, 0], rotate: [0, -1.8, 1.5, -1, 0], scale: [1, 1, 1], duration: 10 },
  { x: [0, 5, -7, 6, 0], y: [0, 10, -10, 5, 0], rotate: [0, 2.2, -2.2, 1.2, 0], scale: [1, 1.015, 0.985, 1.01, 1], duration: 13.5 }
];

export function getPlanDetails(planName: string) {
  if (!planName) return null;
  const name = planName.toLowerCase().trim();
  
  // Search in domestic plans
  const domestic = PLANS.find(p => p.name.toLowerCase() === name);
  if (domestic) return { ...domestic, isInternational: false };
  
  // Search in international plans
  const intl = INTL_PLANS.find(p => p.name.toLowerCase() === name);
  if (intl) return { ...intl, isInternational: true };
  
  // Fallback/Partial matches
  if (name.includes('silver')) {
    return name.includes('international')
      ? { ...INTL_PLANS[0], isInternational: true }
      : { ...PLANS[0], isInternational: false };
  }
  if (name.includes('gold')) {
    return name.includes('international')
      ? { ...INTL_PLANS[1], isInternational: true }
      : { ...PLANS[1], isInternational: false };
  }
  if (name.includes('platinum')) {
    return name.includes('international')
      ? { ...INTL_PLANS[2], isInternational: true }
      : { ...PLANS[2], isInternational: false };
  }
  return null;
}

