/**
 * Booking Validation
 * Field-level validators for the booking flow. Each validator returns a map of
 * field name -> i18n error key (under booking:validation.*) so components can
 * render localized messages via their own t() function.
 */

import { PayerDetails, Traveler } from '../types/booking.types';
import {
  isValidEmail,
  isValidPhone,
  isValidZipCode,
  isValidSwedishSSN,
  isValidISODate,
  isDateTodayOrFuture,
  isValidName,
  isRequired,
} from '../../../shared/utils/validation.utils';

/** Maximum group size allowed through the booking wizard */
export const MAX_PARTICIPANTS = 10;

export type FieldErrors<T extends string = string> = Partial<Record<T, string>>;

export interface BookingDetailsValidation {
  payerErrors: FieldErrors<keyof PayerDetails>;
  travelerErrors: Record<number, FieldErrors<keyof Traveler>>;
  isValid: boolean;
  /** Key of the first error found (for summary banners) */
  firstErrorKey?: string;
}

const nameField = (value: string, errors: FieldErrors, field: string, maxLen = 100) => {
  if (!isRequired(value)) {
    errors[field] = 'required';
  } else if (value.trim().length > maxLen || !isValidName(value)) {
    errors[field] = 'invalidName';
  }
};

/**
 * Validate payer details (all fields required except none)
 */
export const validatePayerDetails = (payer: PayerDetails): FieldErrors<keyof PayerDetails> => {
  const errors: FieldErrors<keyof PayerDetails> = {};

  nameField(payer.firstName, errors, 'firstName', 50);
  nameField(payer.lastName, errors, 'lastName', 50);

  if (!isRequired(payer.email)) {
    errors.email = 'required';
  } else if (!isValidEmail(payer.email.trim())) {
    errors.email = 'invalidEmail';
  }

  if (!isRequired(payer.phone)) {
    errors.phone = 'required';
  } else if (!isValidPhone(payer.phone)) {
    errors.phone = 'invalidPhone';
  }

  if (!isRequired(payer.address)) {
    errors.address = 'required';
  } else if (payer.address.trim().length > 200) {
    errors.address = 'tooLong';
  }

  if (!isRequired(payer.zipCode)) {
    errors.zipCode = 'required';
  } else if (!isValidZipCode(payer.zipCode)) {
    errors.zipCode = 'invalidZip';
  }

  if (!isRequired(payer.city)) {
    errors.city = 'required';
  } else if (!isValidName(payer.city)) {
    errors.city = 'invalidName';
  }

  if (!isRequired(payer.country)) {
    errors.country = 'required';
  }

  return errors;
};

/**
 * Validate a single traveler. Travelers marked isPayer mirror payer fields,
 * so they share the same rules (SSN is always the traveler's own).
 */
export const validateTraveler = (traveler: Traveler): FieldErrors<keyof Traveler> => {
  const errors: FieldErrors<keyof Traveler> = {};

  nameField(traveler.firstName, errors, 'firstName', 50);
  nameField(traveler.lastName, errors, 'lastName', 50);

  if (!isRequired(traveler.email)) {
    errors.email = 'required';
  } else if (!isValidEmail(traveler.email.trim())) {
    errors.email = 'invalidEmail';
  }

  if (!isRequired(traveler.phone)) {
    errors.phone = 'required';
  } else if (!isValidPhone(traveler.phone)) {
    errors.phone = 'invalidPhone';
  }

  if (!isRequired(traveler.address)) {
    errors.address = 'required';
  } else if (traveler.address.trim().length > 200) {
    errors.address = 'tooLong';
  }

  if (!isRequired(traveler.zipCode)) {
    errors.zipCode = 'required';
  } else if (!isValidZipCode(traveler.zipCode)) {
    errors.zipCode = 'invalidZip';
  }

  if (!isRequired(traveler.city)) {
    errors.city = 'required';
  } else if (!isValidName(traveler.city)) {
    errors.city = 'invalidName';
  }

  if (!isRequired(traveler.ssn)) {
    errors.ssn = 'required';
  } else if (!isValidSwedishSSN(traveler.ssn)) {
    errors.ssn = 'invalidSsn';
  }

  return errors;
};

/**
 * Validate the trip date: required, a real ISO date, and not in the past
 */
export const validateTripDate = (date: string): string | undefined => {
  if (!isRequired(date)) return 'required';
  if (!isValidISODate(date)) return 'invalidDate';
  if (!isDateTodayOrFuture(date)) return 'dateInPast';
  return undefined;
};

/**
 * Validate the participants count against the wizard limit and tour capacity
 */
export const validateParticipants = (
  participants: number,
  maxCapacity?: number,
  availableSpots?: number
): string | undefined => {
  if (!Number.isInteger(participants) || participants < 1) return 'minParticipants';
  if (participants > MAX_PARTICIPANTS) return 'tooManyParticipants';
  if (maxCapacity && participants > maxCapacity) return 'exceedsCapacity';
  if (availableSpots !== undefined && availableSpots >= 0 && participants > availableSpots) {
    return 'exceedsAvailability';
  }
  return undefined;
};

/**
 * Validate the whole details step (payer + every traveler)
 */
export const validateBookingDetails = (
  payer: PayerDetails,
  travelers: Traveler[]
): BookingDetailsValidation => {
  const payerErrors = validatePayerDetails(payer);
  const travelerErrors: Record<number, FieldErrors<keyof Traveler>> = {};
  let firstErrorKey = Object.values(payerErrors)[0];

  travelers.forEach((traveler, index) => {
    const errors = validateTraveler(traveler);
    if (Object.keys(errors).length > 0) {
      travelerErrors[index] = errors;
      if (!firstErrorKey) firstErrorKey = Object.values(errors)[0];
    }
  });

  return {
    payerErrors,
    travelerErrors,
    isValid: Object.keys(payerErrors).length === 0 && Object.keys(travelerErrors).length === 0,
    firstErrorKey,
  };
};

/**
 * Validate the fields editable in the admin booking panel.
 * Returns an English error message (admin UI is not localized) or null when valid.
 * Only checks fields an admin can actually edit — legacy records may legitimately
 * lack address/SSN data that is mandatory in the customer-facing wizard.
 */
export const validateBookingEdit = (booking: {
  payer: PayerDetails;
  travelers: Traveler[];
  participants: number;
}): string | null => {
  const { payer, travelers, participants } = booking;

  if (!isRequired(payer.firstName) || !isRequired(payer.lastName)) {
    return 'Payer first and last name are required.';
  }
  if (!isValidName(payer.firstName) || !isValidName(payer.lastName)) {
    return 'Payer name contains invalid characters.';
  }
  if (!isRequired(payer.email) || !isValidEmail(payer.email.trim())) {
    return 'Enter a valid payer email address.';
  }
  if (payer.phone && !isValidPhone(payer.phone)) {
    return 'Enter a valid payer phone number.';
  }
  if (!Number.isInteger(participants) || participants < 1) {
    return 'Number of participants must be at least 1.';
  }

  for (let i = 0; i < travelers.length; i++) {
    const traveler = travelers[i];
    if (!isRequired(traveler.firstName) || !isRequired(traveler.lastName)) {
      return `Traveler ${i + 1} needs a first and last name.`;
    }
    if (!isValidName(traveler.firstName) || !isValidName(traveler.lastName)) {
      return `Traveler ${i + 1}'s name contains invalid characters.`;
    }
    if (traveler.email && !isValidEmail(traveler.email.trim())) {
      return `Traveler ${i + 1}'s email is invalid.`;
    }
    if (traveler.ssn && !isValidSwedishSSN(traveler.ssn)) {
      return `Traveler ${i + 1}'s SSN / date of birth is invalid.`;
    }
  }

  return null;
};
