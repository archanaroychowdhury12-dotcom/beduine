import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import {
  createAdminClient,
  requireAuthenticated,
  type AuthenticatedProfile,
} from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

type UnknownRecord = Record<string, unknown>;

const tripTypes = new Set(['Domestic', 'International']);
const hotelCategories = new Set([
  'Standard (2 Star)',
  'Deluxe (3 Star)',
  'Luxury Resort (5 Star)',
  'Heritage/Homestay',
  'Not Sure',
]);
const transportPreferences = new Set([
  'Sedan',
  'Premium SUV',
  'Luxury Traveler',
  'Flight Included',
  'Train Included',
  'None',
  'Not Sure',
]);
const mealPreferences = new Set([
  'Breakfast Only',
  'Half Board (MAP)',
  'Full Board (AP)',
  'Veg Only',
  'None',
  'Not Sure',
]);
const activities = new Set([
  'Sightseeing',
  'Adventure',
  'Wildlife Safari',
  'Trekking',
  'Shopping',
  'Food Tour',
  'Spa & Wellness',
]);

function asRecord(value: unknown, code = 'PAYLOAD_INVALID'): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new HttpError(400, code);
  }
  return value as UnknownRecord;
}

function text(value: unknown, code: string, max: number, min = 1): string {
  const normalized = String(value ?? '').trim();
  if (normalized.length < min || normalized.length > max) {
    throw new HttpError(400, code);
  }
  return normalized;
}

function optionalText(value: unknown, code: string, max: number): string | null {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  if (normalized.length > max) throw new HttpError(400, code);
  return normalized;
}

function integer(
  value: unknown,
  code: string,
  minimum: number,
  maximum: number,
): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new HttpError(400, code);
  }
  return parsed;
}

function enumValue(
  value: unknown,
  allowed: Set<string>,
  code: string,
): string {
  const parsed = String(value ?? '');
  if (!allowed.has(parsed)) throw new HttpError(400, code);
  return parsed;
}

function isoDate(value: unknown, code: string): string {
  const parsed = text(value, code, 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed) || Number.isNaN(Date.parse(`${parsed}T00:00:00Z`))) {
    throw new HttpError(400, code);
  }
  return parsed;
}

function stringList(
  value: unknown,
  code: string,
  maxItems: number,
  maxItemLength: number,
): string[] {
  if (!Array.isArray(value) || value.length > maxItems) {
    throw new HttpError(400, code);
  }
  return value.map((item) => text(item, code, maxItemLength));
}

function estimate(input: {
  tripType: string;
  durationNights: number;
  adults: number;
  children: number;
  rooms: number;
  hotelCategory: string;
  transportPreference: string;
  mealPreference: string;
  activities: string[];
}) {
  const travelers = input.adults + input.children;
  const basePerTraveler = input.tripType === 'International' ? 25_000 : 6_500;
  const hotelPerRoomNight = input.hotelCategory === 'Luxury Resort (5 Star)'
    ? 4_000
    : input.hotelCategory === 'Deluxe (3 Star)'
    ? 1_000
    : 0;
  const transport = input.transportPreference === 'Flight Included'
    ? 6_000 * travelers
    : input.transportPreference === 'Luxury Traveler'
    ? 3_000 * input.durationNights
    : input.transportPreference === 'Premium SUV'
    ? 1_500 * input.durationNights
    : 0;
  const mealPerPersonNight = input.mealPreference === 'Full Board (AP)'
    ? 900
    : input.mealPreference === 'Half Board (MAP)'
    ? 400
    : input.mealPreference === 'Veg Only'
    ? 250
    : 0;
  const activityRates: Record<string, number> = {
    Adventure: 1_500,
    'Wildlife Safari': 2_000,
    Trekking: 1_200,
    'Food Tour': 800,
    'Spa & Wellness': 2_500,
  };
  const activityTotal = input.activities.reduce(
    (sum, activity) => sum + (activityRates[activity] || 0) * travelers,
    0,
  );
  const total = basePerTraveler * travelers
    + hotelPerRoomNight * input.rooms * input.durationNights
    + transport
    + mealPerPersonNight * travelers * input.durationNights
    + activityTotal;

  return {
    min: Math.max(1_000, Math.round(total * 0.9 / 100) * 100),
    max: Math.max(1_000, Math.round(total * 1.15 / 100) * 100),
  };
}

function parseCreate(value: unknown) {
  const input = asRecord(value, 'CUSTOM_TOUR_REQUEST_INVALID');
  const tripType = enumValue(input.tripType, tripTypes, 'TRIP_TYPE_INVALID');
  const durationNights = integer(input.durationNights, 'DURATION_INVALID', 1, 60);
  const adults = integer(input.adults, 'ADULTS_INVALID', 1, 20);
  const children = integer(input.children, 'CHILDREN_INVALID', 0, 10);
  const rooms = integer(input.rooms, 'ROOMS_INVALID', 1, 10);
  const hotelCategory = enumValue(
    input.hotelCategory,
    hotelCategories,
    'HOTEL_CATEGORY_INVALID',
  );
  const transportPreference = enumValue(
    input.transportPreference,
    transportPreferences,
    'TRANSPORT_PREFERENCE_INVALID',
  );
  const mealPreference = enumValue(
    input.mealPreference,
    mealPreferences,
    'MEAL_PREFERENCE_INVALID',
  );
  const selectedActivities = stringList(input.activities, 'ACTIVITIES_INVALID', 7, 60);
  if (selectedActivities.some((activity) => !activities.has(activity))) {
    throw new HttpError(400, 'ACTIVITIES_INVALID');
  }
  const flexibleDates = input.flexibleDates === true;
  const flexibleMonth = flexibleDates
    ? text(input.flexibleMonth, 'FLEXIBLE_MONTH_INVALID', 7, 7)
    : null;
  if (flexibleMonth && !/^\d{4}-\d{2}$/.test(flexibleMonth)) {
    throw new HttpError(400, 'FLEXIBLE_MONTH_INVALID');
  }
  const travelStartDate = flexibleDates
    ? null
    : isoDate(input.travelStartDate, 'TRAVEL_START_DATE_INVALID');
  const travelEndDate = flexibleDates
    ? null
    : isoDate(input.travelEndDate, 'TRAVEL_END_DATE_INVALID');
  if (travelStartDate && travelEndDate && travelEndDate < travelStartDate) {
    throw new HttpError(400, 'TRAVEL_DATE_RANGE_INVALID');
  }
  const childAges = children === 0
    ? []
    : Array.isArray(input.childAges)
    ? input.childAges.map((age) => integer(age, 'CHILD_AGES_INVALID', 0, 17))
    : [];
  if (childAges.length !== 0 && childAges.length !== children) {
    throw new HttpError(400, 'CHILD_AGES_INVALID');
  }
  const phone = text(input.phone, 'PHONE_INVALID', 20, 7);
  if (!/^[0-9+ ()-]{7,20}$/.test(phone)) throw new HttpError(400, 'PHONE_INVALID');
  const email = text(input.email, 'EMAIL_INVALID', 254, 3).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, 'EMAIL_INVALID');
  }
  const estimateRange = estimate({
    tripType,
    durationNights,
    adults,
    children,
    rooms,
    hotelCategory,
    transportPreference,
    mealPreference,
    activities: selectedActivities,
  });

  return {
    package_id: optionalText(input.packageId, 'PACKAGE_ID_INVALID', 120),
    trip_type: tripType,
    destination: text(input.destination, 'DESTINATION_INVALID', 120, 2),
    departure_city: text(input.departureCity, 'DEPARTURE_CITY_INVALID', 120, 2),
    flexible_dates: flexibleDates,
    travel_start_date: travelStartDate,
    travel_end_date: travelEndDate,
    flexible_month: flexibleMonth,
    duration_nights: durationNights,
    adults,
    children,
    child_ages: childAges,
    rooms,
    hotel_category: hotelCategory,
    transport_preference: transportPreference,
    meal_preference: mealPreference,
    budget: integer(input.budget, 'BUDGET_INVALID', 1_000, 100_000_000),
    activities: selectedActivities,
    special_requirements: optionalText(
      input.specialRequirements,
      'SPECIAL_REQUIREMENTS_INVALID',
      2_000,
    ),
    phone,
    email,
    estimated_min: estimateRange.min,
    estimated_max: estimateRange.max,
  };
}

function parseQuotation(value: unknown) {
  const quote = asRecord(value, 'QUOTATION_INVALID');
  return {
    total_price: integer(quote.totalPrice, 'QUOTE_TOTAL_INVALID', 1, 100_000_000),
    hotel_name: text(quote.hotelName, 'QUOTE_HOTEL_INVALID', 240, 2),
    hotel_category: enumValue(
      quote.hotelCategory,
      hotelCategories,
      'QUOTE_HOTEL_CATEGORY_INVALID',
    ),
    vehicle_assigned: text(quote.vehicleAssigned, 'QUOTE_VEHICLE_INVALID', 240, 2),
    meals_included: text(quote.mealsIncluded, 'QUOTE_MEALS_INVALID', 500, 2),
    itinerary_details: text(quote.itineraryDetails, 'QUOTE_ITINERARY_INVALID', 10_000, 10),
    inclusions: stringList(quote.inclusions, 'QUOTE_INCLUSIONS_INVALID', 50, 500),
    exclusions: stringList(quote.exclusions, 'QUOTE_EXCLUSIONS_INVALID', 50, 500),
    payment_terms: optionalText(quote.paymentTerms, 'QUOTE_PAYMENT_TERMS_INVALID', 2_000)
      || '50% advance to confirm, 50% before departure.',
    cancellation_policy: optionalText(
      quote.cancellationPolicy,
      'QUOTE_CANCELLATION_POLICY_INVALID',
      2_000,
    ) || 'Standard Beduine cancellation policy applies.',
    valid_until: new Date(Date.now() + 7 * 86_400_000).toISOString(),
  };
}

function mapQuotation(value: unknown) {
  const row = asRecord(value);
  return {
    id: row.id,
    requestId: row.request_id,
    version: row.version,
    totalPrice: row.total_price,
    currency: row.currency,
    hotelName: row.hotel_name,
    hotelCategory: row.hotel_category,
    vehicleAssigned: row.vehicle_assigned,
    mealsIncluded: row.meals_included,
    itineraryDetails: row.itinerary_details,
    inclusions: row.inclusions || [],
    exclusions: row.exclusions || [],
    paymentTerms: row.payment_terms,
    cancellationPolicy: row.cancellation_policy,
    validUntil: row.valid_until,
    createdAt: row.created_at,
    status: row.status,
  };
}

function mapRevision(value: unknown) {
  const row = asRecord(value);
  return {
    id: row.id,
    requestId: row.request_id,
    quotationId: row.quotation_id || undefined,
    message: row.message,
    createdAt: row.created_at,
    status: row.status,
  };
}

function mapRequest(value: unknown) {
  const row = asRecord(value);
  const quotations = Array.isArray(row.custom_tour_quotations)
    ? row.custom_tour_quotations.map(mapQuotation).sort((a, b) => a.version - b.version)
    : [];
  const revisions = Array.isArray(row.custom_tour_revisions)
    ? row.custom_tour_revisions.map(mapRevision)
    : [];
  const currentQuotation = [...quotations]
    .reverse()
    .find((quote) => quote.status !== 'Expired');

  return {
    id: row.id,
    displayCode: row.display_code,
    userId: row.user_id,
    tripType: row.trip_type,
    destination: row.destination,
    departureCity: row.departure_city,
    flexibleDates: row.flexible_dates,
    travelStartDate: row.travel_start_date || undefined,
    travelEndDate: row.travel_end_date || undefined,
    flexibleMonth: row.flexible_month || undefined,
    durationNights: row.duration_nights,
    adults: row.adults,
    children: row.children,
    childAges: row.child_ages || [],
    rooms: row.rooms,
    hotelCategory: row.hotel_category,
    transportPreference: row.transport_preference,
    mealPreference: row.meal_preference,
    budget: row.budget,
    currency: row.currency,
    activities: row.activities || [],
    specialRequirements: row.special_requirements || undefined,
    phone: row.phone,
    email: row.email,
    status: row.status,
    submissionDate: row.submitted_at,
    updatedAt: row.updated_at,
    estimatedPriceRange: {
      min: row.estimated_min,
      max: row.estimated_max,
      currency: 'INR',
      note: 'Estimate only. Final price depends on availability and confirmed itinerary.',
    },
    quotations,
    currentQuotationId: currentQuotation?.id,
    revisions,
    paymentStatus: row.payment_status,
    bookingId: row.booking_id || undefined,
    voucherCode: row.voucher_code || undefined,
  };
}

const requestSelect = `
  *,
  custom_tour_quotations(*),
  custom_tour_revisions(*)
`;

async function audit(
  admin: ReturnType<typeof createAdminClient>,
  profile: AuthenticatedProfile,
  action: string,
  requestId: string,
) {
  const { error } = await admin.from('audit_logs').insert({
    action,
    actor_id: profile.id,
    actor_email: profile.email,
    actor_role: profile.role,
    target_id: requestId,
    status: 'success',
    reason: action,
    metadata: { requestId },
  });
  if (error) throw new HttpError(500, 'AUDIT_WRITE_FAILED');
}

async function fetchRequest(
  admin: ReturnType<typeof createAdminClient>,
  requestId: string,
) {
  const { data, error } = await admin
    .from('custom_tour_requests')
    .select(requestSelect)
    .eq('id', requestId)
    .maybeSingle();
  if (error) throw new HttpError(500, 'CUSTOM_TOUR_LOOKUP_FAILED');
  if (!data) throw new HttpError(404, 'CUSTOM_TOUR_NOT_FOUND');
  return data as UnknownRecord;
}

function assertUuid(value: unknown): string {
  const requestId = text(value, 'REQUEST_ID_INVALID', 36, 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    throw new HttpError(400, 'REQUEST_ID_INVALID');
  }
  return requestId;
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    }
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 32_768) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const admin = createAdminClient();
    const { user, profile } = await requireAuthenticated(req, admin);

    if (req.method === 'GET') {
      let query = admin
        .from('custom_tour_requests')
        .select(requestSelect)
        .order('submitted_at', { ascending: false })
        .limit(100);
      if (profile.role !== 'admin') query = query.eq('user_id', user.id);
      const { data, error } = await query;
      if (error) throw new HttpError(500, 'CUSTOM_TOUR_LIST_FAILED');
      return json({ requests: (data || []).map(mapRequest) }, {}, req);
    }

    const body = asRecord(await req.json().catch(() => null));
    const action = String(body.action || '');

    if (action === 'create') {
      if (profile.role !== 'customer') throw new HttpError(403, 'CUSTOMER_ONLY');
      const request = parseCreate(body.request);
      const { data, error } = await admin
        .from('custom_tour_requests')
        .insert({ ...request, user_id: user.id })
        .select(requestSelect)
        .single();
      if (error || !data) throw new HttpError(409, 'CUSTOM_TOUR_CREATE_FAILED');
      await audit(admin, profile, 'custom_tour.created', data.id);
      return json({ request: mapRequest(data) }, { status: 201 }, req);
    }

    const requestId = assertUuid(body.requestId);
    const existing = await fetchRequest(admin, requestId);
    const isOwner = existing.user_id === user.id;
    if (!isOwner && profile.role !== 'admin') throw new HttpError(403, 'FORBIDDEN');

    if (action === 'admin_quote') {
      if (profile.role !== 'admin') throw new HttpError(403, 'ADMIN_ONLY');
      if (!['Under Review', 'Revision Requested'].includes(String(existing.status))) {
        throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      }
      const quotation = parseQuotation(body.quotation);
      const existingQuotes = Array.isArray(existing.custom_tour_quotations)
        ? existing.custom_tour_quotations as UnknownRecord[]
        : [];
      const nextVersion = existingQuotes.reduce(
        (max, quote) => Math.max(max, Number(quote.version) || 0),
        0,
      ) + 1;
      const { error: expireError } = await admin
        .from('custom_tour_quotations')
        .update({ status: 'Expired', updated_at: new Date().toISOString() })
        .eq('request_id', requestId)
        .eq('status', 'Sent');
      if (expireError) throw new HttpError(500, 'QUOTATION_UPDATE_FAILED');
      const { error: quoteError } = await admin
        .from('custom_tour_quotations')
        .insert({
          ...quotation,
          request_id: requestId,
          version: nextVersion,
          created_by: user.id,
          status: 'Sent',
        });
      if (quoteError) throw new HttpError(409, 'QUOTATION_CREATE_FAILED');
      await admin
        .from('custom_tour_revisions')
        .update({ status: 'Resolved', resolved_at: new Date().toISOString() })
        .eq('request_id', requestId)
        .eq('status', 'Open');
      const { error: transitionError } = await admin
        .from('custom_tour_requests')
        .update({ status: 'Quotation Sent' })
        .eq('id', requestId);
      if (transitionError) throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      await audit(admin, profile, 'custom_tour.quotation_sent', requestId);
    } else if (action === 'request_revision') {
      if (!isOwner || profile.role !== 'customer') throw new HttpError(403, 'CUSTOMER_ONLY');
      if (existing.status !== 'Quotation Sent') {
        throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      }
      const message = text(body.message, 'REVISION_MESSAGE_INVALID', 2_000, 3);
      const quotes = Array.isArray(existing.custom_tour_quotations)
        ? existing.custom_tour_quotations as UnknownRecord[]
        : [];
      const currentQuote = [...quotes]
        .sort((a, b) => Number(b.version) - Number(a.version))
        .find((quote) => quote.status === 'Sent');
      const { error: revisionError } = await admin.from('custom_tour_revisions').insert({
        request_id: requestId,
        quotation_id: currentQuote?.id || null,
        user_id: user.id,
        message,
      });
      if (revisionError) throw new HttpError(409, 'REVISION_CREATE_FAILED');
      if (currentQuote?.id) {
        await admin
          .from('custom_tour_quotations')
          .update({ status: 'Revision Requested', updated_at: new Date().toISOString() })
          .eq('id', currentQuote.id);
      }
      const { error } = await admin
        .from('custom_tour_requests')
        .update({ status: 'Revision Requested' })
        .eq('id', requestId);
      if (error) throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      await audit(admin, profile, 'custom_tour.revision_requested', requestId);
    } else if (action === 'accept_quotation') {
      if (!isOwner || profile.role !== 'customer') throw new HttpError(403, 'CUSTOMER_ONLY');
      if (existing.status !== 'Quotation Sent') {
        throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      }
      await admin
        .from('custom_tour_quotations')
        .update({ status: 'Accepted', updated_at: new Date().toISOString() })
        .eq('request_id', requestId)
        .eq('status', 'Sent');
      const { error } = await admin
        .from('custom_tour_requests')
        .update({ status: 'Quotation Accepted' })
        .eq('id', requestId);
      if (error) throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      await audit(admin, profile, 'custom_tour.quotation_accepted', requestId);
    } else if (action === 'begin_payment') {
      if (!isOwner || profile.role !== 'customer') throw new HttpError(403, 'CUSTOMER_ONLY');
      if (existing.status !== 'Quotation Accepted') {
        throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      }
      const { error } = await admin
        .from('custom_tour_requests')
        .update({ status: 'Payment Pending', payment_status: 'Pending' })
        .eq('id', requestId);
      if (error) throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      await audit(admin, profile, 'custom_tour.payment_started', requestId);
    } else if (action === 'cancel') {
      const { error } = await admin
        .from('custom_tour_requests')
        .update({ status: 'Cancelled' })
        .eq('id', requestId);
      if (error) throw new HttpError(409, 'INVALID_CUSTOM_TOUR_TRANSITION');
      await audit(admin, profile, 'custom_tour.cancelled', requestId);
    } else {
      throw new HttpError(400, 'ACTION_INVALID');
    }

    const updated = await fetchRequest(admin, requestId);
    return json({ request: mapRequest(updated) }, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
