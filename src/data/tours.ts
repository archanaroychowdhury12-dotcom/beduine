import { DestinationCard, FAQItem, Testimonial, TourPackage, Voucher } from '../types';

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'sundarbans-mangrove-safari',
    name: 'Sundarbans Mangrove Safari Escape',
    destination: 'Sundarbans, West Bengal',
    durationDays: 3,
    durationNights: 2,
    basePrice: 12499,
    rating: 4.82,
    reviewCount: 186,
    availableDates: ['2026-07-05', '2026-07-12', '2026-07-19', '2026-08-02', '2026-08-16', '2026-09-06'],
    image: '/images/sundarbans_mangrove_premium.png',
    gallery: ['/images/sundarbans_mangrove_premium.png', '/images/sundarbans_mangrove_1779521789593.png', '/images/tropical_coast.png'],
    shortSummary: 'A guided river cruise, mangrove watchtower visits, folk evening, and island stay with member voucher savings.',
    overview: 'Explore the Sundarbans with a planned BEDUINE paid tour that balances safety, comfort, and local experience. The route covers river cruising, watchtower visits, village time, and flexible pickup support from Kolkata.',
    itinerary: [
      { day: 1, title: 'Kolkata Pickup & Island Arrival', time: '07:00 AM - 07:30 PM', description: 'Pickup from Kolkata, transfer to Godkhali, boat crossing, resort check-in, and evening folk program.', highlights: ['Kolkata pickup', 'Boat transfer', 'Bonbibi folk evening'] },
      { day: 2, title: 'Core Mangrove Safari', time: '06:30 AM - 05:00 PM', description: 'Full-day boat safari through marked forest routes with guide, lunch onboard, and watchtower stops.', highlights: ['Sajnekhali', 'Sudhanyakhali', 'DoBanki canopy walk'] },
      { day: 3, title: 'Village Walk & Return', time: '08:00 AM - 06:00 PM', description: 'Morning village walk, breakfast, checkout, and return transfer to Kolkata.', highlights: ['Local village walk', 'Fresh breakfast', 'Kolkata drop'] }
    ],
    placesCovered: ['Kolkata', 'Godkhali', 'Sajnekhali', 'Sudhanyakhali', 'DoBanki', 'Pakhiralay'],
    included: ['Kolkata pickup and drop', 'AC/non-AC transfer as per group size', '2 nights stay', 'All major meals', 'Boat safari', 'Forest permissions', 'Local guide'],
    notIncluded: ['Personal shopping', 'Camera fees if charged locally', 'Travel insurance', 'Anything not listed under inclusions'],
    groupSize: { min: 4, max: 18, privateOptionAvailable: true, privateSurchargePerPerson: 2500 },
    languages: ['Bengali', 'Hindi', 'English'],
    guideExpertise: 'Licensed Sundarbans local guide',
    difficultyLevel: 'Easy',
    bestFor: ['Families', 'Nature Lovers', 'Weekend Travelers', 'Photography']
  },
  {
    id: 'darjeeling-hills-tea',
    name: 'Darjeeling Hills, Tea Garden & Toy Train',
    destination: 'Darjeeling, West Bengal',
    durationDays: 4,
    durationNights: 3,
    basePrice: 17499,
    rating: 4.86,
    reviewCount: 214,
    availableDates: ['2026-07-09', '2026-07-23', '2026-08-06', '2026-08-20', '2026-09-10', '2026-10-01'],
    image: '/images/darjeeling_resort.png',
    gallery: ['/images/darjeeling_resort.png', '/images/darjeeling_tea_1779521805614.png', '/images/himachal_hills.png'],
    shortSummary: 'A hill station package with Tiger Hill sunrise, tea estate visit, toy train option, and guided sightseeing.',
    overview: 'A compact premium hill route covering Darjeeling viewpoints, tea gardens, heritage railway experiences, and relaxed evenings near Mall Road.',
    itinerary: [
      { day: 1, title: 'NJP/Bagdogra Pickup', time: '11:00 AM - 07:00 PM', description: 'Pickup and scenic drive to Darjeeling with hotel check-in and free evening.', highlights: ['NJP/IXB pickup', 'Hill drive', 'Mall Road evening'] },
      { day: 2, title: 'Tiger Hill & Local Sightseeing', time: '04:00 AM - 05:30 PM', description: 'Sunrise at Tiger Hill followed by Ghoom Monastery, Batasia Loop, zoo, HMI, and tea estate visit.', highlights: ['Tiger Hill', 'Batasia Loop', 'Tea garden'] },
      { day: 3, title: 'Toy Train & Mirik Option', time: '09:00 AM - 06:00 PM', description: 'Toy Train joy ride subject to availability or Mirik lake day trip.', highlights: ['Toy Train option', 'Mirik lake', 'Pine forest stop'] },
      { day: 4, title: 'Checkout & Drop', time: '08:00 AM - 02:00 PM', description: 'Breakfast, checkout, and transfer to NJP or Bagdogra.', highlights: ['Breakfast', 'NJP/IXB drop', 'Assisted checkout'] }
    ],
    placesCovered: ['Darjeeling', 'Tiger Hill', 'Ghoom', 'Batasia Loop', 'Happy Valley', 'Mirik'],
    included: ['3 nights hotel stay', 'Breakfast', 'Private/shared vehicle', 'Sightseeing', 'Pickup and drop', 'Trip coordinator'],
    notIncluded: ['Toy Train ticket if not selected', 'Lunch and dinner unless added', 'Entry tickets', 'Personal expenses'],
    groupSize: { min: 2, max: 14, privateOptionAvailable: true, privateSurchargePerPerson: 3000 },
    languages: ['Bengali', 'Hindi', 'English'],
    guideExpertise: 'Darjeeling hill route coordinator',
    difficultyLevel: 'Easy',
    bestFor: ['Couples', 'Families', 'Tea Lovers', 'Hill Trips']
  },
  {
    id: 'puri-konark-sea-temple',
    name: 'Puri, Konark & Chilika Sea Temple Tour',
    destination: 'Puri, Odisha',
    durationDays: 4,
    durationNights: 3,
    basePrice: 15499,
    rating: 4.8,
    reviewCount: 172,
    availableDates: ['2026-07-04', '2026-07-18', '2026-08-01', '2026-08-15', '2026-09-05', '2026-10-03'],
    image: '/images/puri_konark.png',
    gallery: ['/images/puri_konark.png', '/images/tropical_coast.png', '/images/vizag_araku.png'],
    shortSummary: 'A coastal Odisha tour with Jagannath Temple guidance, Konark Sun Temple, beach time, and Chilika add-on.',
    overview: 'Designed for travelers who want temple visits, sea beach time, and smooth transfers in one paid package with voucher support.',
    itinerary: [
      { day: 1, title: 'Puri Arrival', time: '10:00 AM - 07:00 PM', description: 'Pickup from station/airport, hotel check-in, beach evening, and tour briefing.', highlights: ['Station/airport pickup', 'Puri beach', 'Briefing'] },
      { day: 2, title: 'Jagannath Temple & Konark', time: '07:00 AM - 06:00 PM', description: 'Temple guidance followed by Konark Sun Temple and Chandrabhaga beach.', highlights: ['Jagannath Temple', 'Konark Sun Temple', 'Chandrabhaga'] },
      { day: 3, title: 'Chilika Lake Optional Route', time: '08:00 AM - 05:30 PM', description: 'Satapada/Chilika excursion subject to weather and route selection.', highlights: ['Chilika Lake', 'Boat option', 'Local seafood stops'] },
      { day: 4, title: 'Checkout & Drop', time: '08:30 AM - 12:30 PM', description: 'Breakfast and assisted drop at Puri/Bhubaneswar.', highlights: ['Breakfast', 'Assisted drop', 'Voucher invoice'] }
    ],
    placesCovered: ['Puri', 'Jagannath Temple', 'Konark', 'Chandrabhaga', 'Chilika', 'Bhubaneswar'],
    included: ['3 nights hotel stay', 'Breakfast', 'Local transfers', 'Sightseeing vehicle', 'Temple route assistance', 'Trip support'],
    notIncluded: ['Temple special darshan charges', 'Boat charges if selected', 'Meals not listed', 'Entry tickets'],
    groupSize: { min: 2, max: 16, privateOptionAvailable: true, privateSurchargePerPerson: 2200 },
    languages: ['Bengali', 'Hindi', 'English', 'Odia'],
    guideExpertise: 'Odisha temple and coastal route assistant',
    difficultyLevel: 'Easy',
    bestFor: ['Families', 'Pilgrimage', 'Beach Trips', 'Senior Travelers']
  },
  {
    id: 'kashmir-valley-houseboat',
    name: 'Kashmir Valley, Gulmarg & Houseboat Holiday',
    destination: 'Kashmir, India',
    durationDays: 6,
    durationNights: 5,
    basePrice: 32999,
    rating: 4.91,
    reviewCount: 248,
    availableDates: ['2026-07-11', '2026-07-25', '2026-08-08', '2026-08-22', '2026-09-12', '2026-10-10'],
    image: '/images/kashmir_resort.png',
    gallery: ['/images/kashmir_resort.png', '/images/kashmir_dal_lake_1779521728036.png', '/images/himachal_hills.png'],
    shortSummary: 'Srinagar, Gulmarg, Pahalgam, Sonmarg, Shikara ride, and houseboat stay in one guided paid tour.',
    overview: 'A complete Kashmir package with valley sightseeing, driver support, hotel and houseboat mix, and assisted itinerary planning.',
    itinerary: [
      { day: 1, title: 'Srinagar Arrival & Shikara', time: '12:00 PM - 07:00 PM', description: 'Airport pickup, hotel/houseboat check-in, Dal Lake Shikara ride.', highlights: ['Airport pickup', 'Dal Lake', 'Shikara ride'] },
      { day: 2, title: 'Gulmarg Day Trip', time: '08:00 AM - 06:00 PM', description: 'Drive to Gulmarg with Gondola assistance subject to ticket availability.', highlights: ['Gulmarg', 'Gondola option', 'Snow point'] },
      { day: 3, title: 'Pahalgam Valley', time: '08:00 AM - 07:00 PM', description: 'Visit Pahalgam and optional local union car routes.', highlights: ['Pahalgam', 'Aru/Betaab option', 'Lidder River'] },
      { day: 4, title: 'Sonmarg Glacier Route', time: '08:00 AM - 06:00 PM', description: 'Scenic Sonmarg drive and glacier route option as per weather.', highlights: ['Sonmarg', 'Thajiwas option', 'Valley views'] },
      { day: 5, title: 'Srinagar Gardens', time: '09:00 AM - 05:00 PM', description: 'Mughal gardens, local shopping, and houseboat evening.', highlights: ['Mughal gardens', 'Local market', 'Houseboat'] },
      { day: 6, title: 'Departure', time: '08:00 AM - 12:00 PM', description: 'Breakfast and airport drop.', highlights: ['Breakfast', 'Airport drop', 'Trip close'] }
    ],
    placesCovered: ['Srinagar', 'Dal Lake', 'Gulmarg', 'Pahalgam', 'Sonmarg', 'Mughal Gardens'],
    included: ['5 nights stay', 'Breakfast and dinner', 'Private vehicle', 'Airport pickup/drop', 'Shikara ride', 'Tour coordinator'],
    notIncluded: ['Flights', 'Gondola tickets', 'Union vehicle charges', 'Entry fees', 'Lunch'],
    groupSize: { min: 2, max: 12, privateOptionAvailable: true, privateSurchargePerPerson: 6500 },
    languages: ['Hindi', 'English', 'Bengali'],
    guideExpertise: 'Kashmir valley driver-guide coordinator',
    difficultyLevel: 'Moderate',
    bestFor: ['Couples', 'Families', 'Honeymoon', 'Snow Lovers']
  },
  {
    id: 'dubai-city-desert',
    name: 'Dubai City, Desert Safari & Marina Escape',
    destination: 'Dubai, UAE',
    durationDays: 5,
    durationNights: 4,
    basePrice: 52999,
    rating: 4.88,
    reviewCount: 196,
    availableDates: ['2026-07-16', '2026-08-13', '2026-09-17', '2026-10-15', '2026-11-12', '2026-12-10'],
    image: '/images/dubai_skyline_1779539448313.png',
    gallery: ['/images/dubai_skyline_1779539448313.png', '/images/singapore_skyline_1779539502293.png', '/images/maldives_resort.png'],
    shortSummary: 'A Dubai paid package with city tour, desert safari, marina cruise, Burj Khalifa option, and visa assistance.',
    overview: 'International package for members who want a compact Dubai experience with planned transfers, voucher savings, and guided local support.',
    itinerary: [
      { day: 1, title: 'Dubai Arrival', time: '02:00 PM - 08:00 PM', description: 'Airport pickup and hotel check-in with evening leisure.', highlights: ['Airport pickup', 'Hotel check-in', 'Marina evening'] },
      { day: 2, title: 'Dubai City Tour', time: '09:00 AM - 05:00 PM', description: 'Half-day city tour with photo stops and optional Burj Khalifa slot.', highlights: ['Jumeirah', 'Dubai Frame photo stop', 'Burj Khalifa option'] },
      { day: 3, title: 'Desert Safari', time: '03:00 PM - 10:00 PM', description: 'Desert safari with dune bashing, BBQ dinner, and live entertainment.', highlights: ['Dune bashing', 'BBQ dinner', 'Live shows'] },
      { day: 4, title: 'Marina Cruise & Shopping', time: '10:00 AM - 10:00 PM', description: 'Free shopping time and evening Dhow cruise dinner.', highlights: ['Dubai Mall', 'Gold Souk option', 'Dhow cruise'] },
      { day: 5, title: 'Departure', time: '08:00 AM - 12:00 PM', description: 'Checkout and airport transfer.', highlights: ['Breakfast', 'Airport drop', 'Invoice support'] }
    ],
    placesCovered: ['Dubai Marina', 'Jumeirah', 'Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Gold Souk'],
    included: ['4 nights hotel stay', 'Daily breakfast', 'Airport transfers', 'City tour', 'Desert safari with dinner', 'Dhow cruise', 'Visa assistance'],
    notIncluded: ['Flights', 'UAE visa fee unless selected', 'Tourism dirham tax', 'Optional attraction tickets'],
    groupSize: { min: 2, max: 18, privateOptionAvailable: true, privateSurchargePerPerson: 9000 },
    languages: ['English', 'Hindi'],
    guideExpertise: 'Dubai local operations coordinator',
    difficultyLevel: 'Easy',
    bestFor: ['First International Trip', 'Families', 'Shopping', 'Couples']
  },
  {
    id: 'thailand-bangkok-pattaya',
    name: 'Thailand Bangkok & Pattaya Value Holiday',
    destination: 'Thailand',
    durationDays: 5,
    durationNights: 4,
    basePrice: 45999,
    rating: 4.84,
    reviewCount: 203,
    availableDates: ['2026-07-18', '2026-08-15', '2026-09-19', '2026-10-17', '2026-11-14', '2026-12-12'],
    image: '/images/thailand.png',
    gallery: ['/images/thailand.png', '/images/bali.png', '/images/malaysia.png'],
    shortSummary: 'Bangkok, Pattaya, Coral Island, temple tour, airport transfers, and member voucher redemption in one flow.',
    overview: 'A smooth international starter package for members who want beaches, city sightseeing, and easy checkout with voucher discount.',
    itinerary: [
      { day: 1, title: 'Bangkok Arrival to Pattaya', time: '12:00 PM - 07:00 PM', description: 'Airport pickup and transfer to Pattaya hotel.', highlights: ['Airport pickup', 'Pattaya transfer', 'Evening leisure'] },
      { day: 2, title: 'Coral Island Tour', time: '08:00 AM - 04:00 PM', description: 'Coral Island excursion with Indian lunch and water sport options.', highlights: ['Speedboat', 'Coral Island', 'Indian lunch'] },
      { day: 3, title: 'Pattaya to Bangkok', time: '10:00 AM - 06:00 PM', description: 'Transfer to Bangkok with city orientation.', highlights: ['Bangkok transfer', 'City orientation', 'Shopping time'] },
      { day: 4, title: 'Bangkok Temple Tour', time: '09:00 AM - 05:00 PM', description: 'Temple tour and optional Safari World/Chao Phraya add-on.', highlights: ['Temple tour', 'Market visit', 'Optional add-ons'] },
      { day: 5, title: 'Departure', time: '08:00 AM - 12:00 PM', description: 'Checkout and airport transfer.', highlights: ['Breakfast', 'Airport drop', 'Trip close'] }
    ],
    placesCovered: ['Bangkok', 'Pattaya', 'Coral Island', 'Temple route', 'Local markets'],
    included: ['4 nights hotel stay', 'Daily breakfast', 'Airport transfers', 'Coral Island tour', 'Bangkok temple tour', 'Trip coordinator'],
    notIncluded: ['Flights', 'Visa/ETA if applicable', 'Optional water sports', 'Meals not listed'],
    groupSize: { min: 2, max: 18, privateOptionAvailable: true, privateSurchargePerPerson: 7500 },
    languages: ['English', 'Hindi'],
    guideExpertise: 'Thailand local ground handler',
    difficultyLevel: 'Easy',
    bestFor: ['Friends', 'Families', 'First International Trip', 'Beach Holiday']
  }
];

export const AVAILABLE_VOUCHERS: Voucher[] = [
  { code: 'BEDUINE500', type: 'fixed', value: 500, status: 'active', description: 'Instant INR 500 member discount credit.' },
  { code: 'SAVE1500', type: 'fixed', value: 1500, minSpend: 15000, status: 'active', description: 'INR 1,500 off on paid tour bookings above INR 15,000.' },
  { code: 'VIPTOUR', type: 'percentage', value: 10, status: 'active', description: 'VIP member voucher for 10% off the booking subtotal.' },
  { code: 'SUMMER24', type: 'percentage', value: 15, status: 'expired', description: 'Expired seasonal campaign code.' },
  { code: 'WELCOME10', type: 'fixed', value: 1000, status: 'used', description: 'Already redeemed welcome voucher.' }
];

export const FAQ_ITEMS: FAQItem[] = [
  { category: 'Booking & Vouchers', question: 'How do I use BEDUINE discount credits?', answer: 'Open Step 6, enter your active voucher code, and apply it. The live price summary updates immediately before payment.' },
  { category: 'Booking & Vouchers', question: 'Can I use more than one voucher?', answer: 'Only one voucher can be applied to one paid tour booking. This keeps invoice and member benefit tracking clear.' },
  { category: 'Tours & Itinerary', question: 'Can I customize a listed package?', answer: 'Yes. Add special requests in traveler details. The team can adjust hotels, pickup points, private vehicle choice, and optional sightseeing after review.' },
  { category: 'Pickup & Logistics', question: 'How does pickup work?', answer: 'You can select a partner pickup point or add a manual address. Final pickup timing is confirmed by the BEDUINE operations team before departure.' },
  { category: 'Cancellations & Refunds', question: 'What is the cancellation policy?', answer: 'Cancellation and refund depend on package, hotel, vehicle, flight, and local vendor rules. The booking policy section must be accepted before payment.' },
  { category: 'Tours & Itinerary', question: 'Are flights included?', answer: 'Domestic and international flights are excluded unless a package specifically mentions them or the team adds them to your custom quote.' },
  { category: 'Pickup & Logistics', question: 'Can I choose private tour mode?', answer: 'Yes. If available for the selected package, enable Private Tour Upgrade in Step 3 to calculate the updated total.' },
  { category: 'Cancellations & Refunds', question: 'Do I get a receipt?', answer: 'After successful simulated payment, the portal generates a booking ID and printable receipt for review.' }
];

export const FEATURED_DESTINATIONS: DestinationCard[] = [
  { id: 'sundarbans', name: 'Sundarbans', country: 'West Bengal', tourCount: 4, image: '/images/sundarbans_mangrove_premium.png', tagline: 'Mangrove safari and island stay' },
  { id: 'darjeeling', name: 'Darjeeling', country: 'West Bengal', tourCount: 5, image: '/images/darjeeling_resort.png', tagline: 'Tea gardens and toy train' },
  { id: 'puri', name: 'Puri', country: 'Odisha', tourCount: 3, image: '/images/puri_konark.png', tagline: 'Sea beach and temple route' },
  { id: 'kashmir', name: 'Kashmir', country: 'India', tourCount: 6, image: '/images/kashmir_resort.png', tagline: 'Valley, houseboat and snow route' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', tourCount: 4, image: '/images/dubai_skyline_1779539448313.png', tagline: 'City, desert and marina' },
  { id: 'thailand', name: 'Thailand', country: 'Southeast Asia', tourCount: 4, image: '/images/thailand.png', tagline: 'Bangkok, Pattaya and island day' }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Ananya Das', role: 'BEDUINE Member', location: 'Kolkata', avatar: '/images/winner_ananya_das.png', comment: 'The voucher flow made the Sundarbans booking simple. Pickup, boat route, and confirmation were clearly handled.', tourName: 'Sundarbans Mangrove Safari Escape', rating: 5, date: 'May 2026' },
  { id: 'test-2', name: 'Subhadeep Ghosh', role: 'Family Traveler', location: 'Nadia', avatar: '/images/winner_subhadeep_ghosh.png', comment: 'Darjeeling package details were easy to compare, and the live price summary helped before confirming.', tourName: 'Darjeeling Hills, Tea Garden & Toy Train', rating: 5, date: 'June 2026' },
  { id: 'test-3', name: 'Priya Sen', role: 'International Traveler', location: 'Howrah', avatar: '/images/winner_priya_sen.png', comment: 'The Dubai trip form kept travelers, pickup, vouchers, and payment in one place.', tourName: 'Dubai City, Desert Safari & Marina Escape', rating: 5, date: 'June 2026' }
];
