import { AVAILABLE_VOUCHERS, FEATURED_DESTINATIONS, TESTIMONIALS, TOUR_PACKAGES } from './tours';
import { TourPackage } from '../types';

export const BEDUINE_BRAND = {
  name: 'BEDUINE',
  fullName: 'BEDUINE Tour & Travels',
  tagline: 'Safar Jo Yaad Rahe',
  phoneDisplay: '+91 87689 03565',
  phoneHref: 'tel:+918768903565',
  email: 'care@beduinetours.com',
  address: 'Fulia, Nadia, West Bengal, India - 741402',
  socialHandle: '@beduinetours',
};

export const formatINR = (value: number) => `INR ${value.toLocaleString('en-IN')}`;

const isInternationalTour = (tour: TourPackage) =>
  /dubai|thailand|uae|southeast asia/i.test(`${tour.name} ${tour.destination}`);

export const getTourRegion = (tour: TourPackage) => (isInternationalTour(tour) ? 'International' : 'Domestic');

export const getTourType = (tour: TourPackage) => {
  const text = `${tour.name} ${tour.destination} ${tour.bestFor.join(' ')}`.toLowerCase();
  if (isInternationalTour(tour)) return 'International';
  if (text.includes('sundarbans') || text.includes('nature')) return 'Nature';
  if (text.includes('puri') || text.includes('temple') || text.includes('pilgrimage')) return 'Pilgrimage';
  if (text.includes('darjeeling') || text.includes('kashmir') || text.includes('hill') || text.includes('snow')) return 'Hill';
  return 'Family';
};

export const PAID_TOUR_CARDS = TOUR_PACKAGES.map((tour, index) => ({
  id: tour.id,
  name: tour.name,
  location: tour.destination,
  region: getTourRegion(tour),
  type: getTourType(tour),
  price: tour.basePrice,
  priceText: formatINR(tour.basePrice),
  days: tour.durationDays,
  nights: tour.durationNights,
  durationText: `${tour.durationDays}D / ${tour.durationNights}N`,
  rating: tour.rating,
  reviews: tour.reviewCount,
  img: tour.image,
  featured: index < 3 || tour.rating >= 4.88,
  desc: tour.shortSummary,
  bestFor: tour.bestFor,
  groupText: `${tour.groupSize.min}-${tour.groupSize.max} travelers`,
}));

export const FEATURED_PAID_TOUR_CARDS = PAID_TOUR_CARDS.slice(0, 6);

export const DESTINATION_TILES = FEATURED_DESTINATIONS.map((destination, index) => {
  const matchedTour =
    TOUR_PACKAGES.find((tour) => tour.destination.toLowerCase().includes(destination.name.toLowerCase())) ??
    TOUR_PACKAGES[index % TOUR_PACKAGES.length];

  return {
    ...destination,
    tourId: matchedTour.id,
    h: index === 0 ? 'h-[480px] md:h-[560px]' : index === 1 ? 'h-[230px] md:h-[270px]' : 'h-[280px] md:h-[260px]',
    col: index === 0 ? 'row-span-2' : '',
  };
});

export const TOUR_REVIEW_CARDS = TESTIMONIALS.map((review) => ({
  name: review.name,
  role: `${review.role}, ${review.location}`,
  img: review.avatar,
  quote: review.comment,
  tour: review.tourName,
}));

export const ACTIVE_VOUCHER =
  AVAILABLE_VOUCHERS.find((voucher) => voucher.code === 'VIPTOUR' && voucher.status === 'active') ??
  AVAILABLE_VOUCHERS.find((voucher) => voucher.status === 'active');

export const voucherDisplay = ACTIVE_VOUCHER
  ? `${ACTIVE_VOUCHER.code} (${ACTIVE_VOUCHER.type === 'percentage' ? `${ACTIVE_VOUCHER.value}% off` : `${formatINR(ACTIVE_VOUCHER.value)} off`})`
  : 'BEDUINE member voucher';

export const totalReviewCount = TOUR_PACKAGES.reduce((sum, tour) => sum + tour.reviewCount, 0);

export const averageRating =
  TOUR_PACKAGES.reduce((sum, tour) => sum + tour.rating, 0) / Math.max(TOUR_PACKAGES.length, 1);

export const findTourIdByQuery = (query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return TOUR_PACKAGES[0]?.id;

  return TOUR_PACKAGES.find((tour) => {
    const haystack = [
      tour.name,
      tour.destination,
      tour.shortSummary,
      tour.overview,
      tour.placesCovered.join(' '),
      tour.bestFor.join(' '),
    ].join(' ').toLowerCase();

    return haystack.includes(normalized);
  })?.id ?? TOUR_PACKAGES[0]?.id;
};
