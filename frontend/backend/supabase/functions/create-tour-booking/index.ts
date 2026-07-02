import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createAdminClient, requireUser } from '../_shared/auth.ts';
import { HttpError, errorResponse, handleCors, json } from '../_shared/http.ts';

const bookingTypes = new Set([
  'fixed_departure',
  'customized_tailor_made',
]);
const pickupTypes = new Set(['hotel', 'manual', 'none', 'assistance']);

type UnknownRecord = Record<string, unknown>;

function limitedString(
  value: unknown,
  code: string,
  maxLength: number,
  required = true,
): string | undefined {
  const normalized = String(value ?? '').trim();
  if ((required && !normalized) || normalized.length > maxLength) {
    throw new HttpError(400, code);
  }
  return normalized || undefined;
}

function parseInput(value: unknown) {
  if (!value || typeof value !== 'object') {
    throw new HttpError(400, 'BOOKING_PAYLOAD_INVALID');
  }
  const input = value as UnknownRecord;
  const tourId = limitedString(input.tourId, 'TOUR_ID_INVALID', 100);
  const departureId = limitedString(
    input.departureId,
    'DEPARTURE_ID_INVALID',
    120,
  );
  const bookingType = String(input.bookingType || '');
  if (!bookingTypes.has(bookingType)) {
    throw new HttpError(400, 'BOOKING_TYPE_INVALID');
  }
  if (!/^[a-z0-9-]+$/.test(tourId || '')) {
    throw new HttpError(400, 'TOUR_ID_INVALID');
  }
  if (!/^[a-z0-9-]+:[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(departureId || '')) {
    throw new HttpError(400, 'DEPARTURE_ID_INVALID');
  }

  if (!Array.isArray(input.travelers) || input.travelers.length < 1 || input.travelers.length > 20) {
    throw new HttpError(400, 'TRAVELER_COUNT_INVALID');
  }
  const travelers = input.travelers.map((value, index) => {
    if (!value || typeof value !== 'object') {
      throw new HttpError(400, 'TRAVELER_INVALID');
    }
    const traveler = value as UnknownRecord;
    return {
      travelerKey: limitedString(
        traveler.travelerKey,
        `TRAVELER_${index + 1}_KEY_INVALID`,
        100,
      ),
      firstName: limitedString(
        traveler.firstName,
        `TRAVELER_${index + 1}_FIRST_NAME_INVALID`,
        100,
      ),
      lastName: limitedString(
        traveler.lastName,
        `TRAVELER_${index + 1}_LAST_NAME_INVALID`,
        100,
      ),
      email: limitedString(
        traveler.email,
        `TRAVELER_${index + 1}_EMAIL_INVALID`,
        254,
        false,
      ),
      phone: limitedString(
        traveler.phone,
        `TRAVELER_${index + 1}_PHONE_INVALID`,
        30,
        false,
      ),
    };
  });

  if (!input.pickup || typeof input.pickup !== 'object') {
    throw new HttpError(400, 'PICKUP_INVALID');
  }
  const pickupInput = input.pickup as UnknownRecord;
  const pickupType = String(pickupInput.type || '');
  if (!pickupTypes.has(pickupType)) {
    throw new HttpError(400, 'PICKUP_TYPE_INVALID');
  }
  const pickup = {
    type: pickupType,
    address: limitedString(pickupInput.address, 'PICKUP_ADDRESS_INVALID', 500, false),
    city: limitedString(pickupInput.city, 'PICKUP_CITY_INVALID', 100, false),
    pincode: limitedString(pickupInput.pincode, 'PICKUP_PINCODE_INVALID', 20, false),
    specialInstructions: limitedString(
      pickupInput.specialInstructions,
      'PICKUP_INSTRUCTIONS_INVALID',
      1000,
      false,
    ),
  };

  if (!Array.isArray(input.creditAssignments) || input.creditAssignments.length > travelers.length) {
    throw new HttpError(400, 'CREDIT_ASSIGNMENTS_INVALID');
  }
  const creditAssignments = input.creditAssignments.map((value) => {
    if (!value || typeof value !== 'object') {
      throw new HttpError(400, 'CREDIT_ASSIGNMENT_INVALID');
    }
    const assignment = value as UnknownRecord;
    const creditUnitId = limitedString(
      assignment.creditUnitId,
      'CREDIT_UNIT_INVALID',
      36,
    );
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(creditUnitId || '')) {
      throw new HttpError(400, 'CREDIT_UNIT_INVALID');
    }
    return {
      creditUnitId,
      travelerKey: limitedString(
        assignment.travelerKey,
        'CREDIT_TRAVELER_INVALID',
        100,
      ),
    };
  });

  return {
    tourId,
    departureId,
    bookingType,
    travelers,
    pickup,
    creditAssignments,
    instantBookingRequired: input.instantBookingRequired === true,
  };
}

const safeBookingErrors = [
  'TOUR_DEPARTURE_NOT_FOUND',
  'TOUR_DEPARTURE_CLOSED',
  'TOUR_NOT_AVAILABLE',
  'DEPARTURE_CAPACITY_EXCEEDED',
  'ONE_CREDIT_PER_TRAVELER',
  'CREDIT_UNIT_DUPLICATE',
  'CREDIT_TRAVELER_INVALID',
  'CREDIT_UNIT_INVALID',
  'CREDIT_UNIT_NOT_AVAILABLE',
  'CREDIT_CATEGORY_MISMATCH',
  'CREDIT_VALUE_INVALID',
  'BOOKING_TOTAL_INVALID',
];

function mapDatabaseError(message: string): HttpError {
  const code = safeBookingErrors.find((candidate) => message.includes(candidate));
  return new HttpError(409, code || 'BOOKING_DRAFT_REJECTED');
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== 'POST') throw new HttpError(405, 'METHOD_NOT_ALLOWED');
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 32_768) throw new HttpError(413, 'REQUEST_TOO_LARGE');

    const admin = createAdminClient();
    const { user } = await requireUser(req, admin);
    const input = parseInput(await req.json());
    const { data, error } = await admin.rpc('create_tour_booking_draft_v1', {
      p_user_id: user.id,
      p_tour_id: input.tourId,
      p_departure_id: input.departureId,
      p_booking_type: input.bookingType,
      p_travelers: input.travelers,
      p_pickup: input.pickup,
      p_credit_assignments: input.creditAssignments,
      p_instant_booking_required: input.instantBookingRequired,
    });
    if (error) throw mapDatabaseError(error.message);

    return json(data, {}, req);
  } catch (error) {
    return errorResponse(error, req);
  }
});
