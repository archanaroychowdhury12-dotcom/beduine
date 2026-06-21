export interface ValidationErrors {
  destination?: string;
  departureCity?: string;
  travelDates?: string;
  adults?: string;
  rooms?: string;
  budget?: string;
  phone?: string;
  email?: string;
  specialRequirements?: string;
}

export function validateCustomTourForm(data: {
  destination: string;
  departureCity: string;
  flexibleDates: boolean;
  travelStartDate?: string;
  travelEndDate?: string;
  flexibleMonth?: string;
  adults: number;
  children: number;
  rooms: number;
  budget: number;
  phone: string;
  email: string;
  specialRequirements?: string;
}): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // Required Field: Destination
  if (!data.destination || data.destination.trim().length < 2) {
    errors.destination = 'Destination name must be at least 2 characters.';
  }

  // Required Field: Departure City
  if (!data.departureCity || data.departureCity.trim().length < 2) {
    errors.departureCity = 'Departure city must be at least 2 characters.';
  }

  // Travel Dates validation
  if (!data.flexibleDates) {
    if (!data.travelStartDate) {
      errors.travelDates = 'Please select a travel start date.';
    } else if (!data.travelEndDate) {
      errors.travelDates = 'Please select a travel end date.';
    } else {
      const start = new Date(data.travelStartDate);
      const end = new Date(data.travelEndDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        errors.travelDates = 'Start date cannot be in the past.';
      } else if (end < start) {
        errors.travelDates = 'End date must be on or after the start date.';
      }
    }
  } else {
    // If flexible, ensure either flexibleMonth or a placeholder is present
    if (!data.flexibleMonth) {
      errors.travelDates = 'Please select a target travel month.';
    }
  }

  // Counter Boundaries
  if (data.adults < 1) {
    errors.adults = 'There must be at least 1 adult traveler.';
  }
  if (data.rooms < 1) {
    errors.rooms = 'There must be at least 1 room requested.';
  }
  if (data.rooms > data.adults + data.children) {
    errors.rooms = 'Number of rooms cannot exceed total number of travelers.';
  }

  // Budget
  if (!data.budget || data.budget <= 0) {
    errors.budget = 'Please specify a budget greater than zero.';
  }

  // Contact: Phone (Indian 10-digit validation)
  const cleanPhone = data.phone.replace(/[\s-()]/g, '');
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  // Allow optional leading +91 or 0
  const normalizedPhone = cleanPhone.startsWith('+91') 
    ? cleanPhone.slice(3) 
    : cleanPhone.startsWith('91') && cleanPhone.length === 12 
      ? cleanPhone.slice(2) 
      : cleanPhone.startsWith('0') && cleanPhone.length === 11
        ? cleanPhone.slice(1)
        : cleanPhone;

  if (!data.phone) {
    errors.phone = 'Phone number is required.';
  } else if (!indianPhoneRegex.test(normalizedPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian phone number (e.g. 9876543210).';
  }

  // Contact: Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Special Requirements
  if (data.specialRequirements && data.specialRequirements.length > 500) {
    errors.specialRequirements = 'Special requirements must not exceed 500 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
