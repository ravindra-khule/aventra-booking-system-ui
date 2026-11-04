/**
 * Validation Utilities
 */

/**
 * Validate email address
 * @param email - Email address to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Swedish phone number
 * @param phone - Phone number to validate
 * @returns True if valid Swedish phone number
 */
export const isValidSwedishPhone = (phone: string): boolean => {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Check if it matches Swedish phone format
  const phoneRegex = /^(\+46|0)7\d{8}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Validate a generic phone number (domestic or international).
 * Accepts digits with optional leading +, spaces, dashes and parentheses.
 * Requires 7–15 digits (per E.164 max length).
 * @param phone - Phone number to validate
 * @returns True if valid phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
};

/**
 * Validate Swedish postal code
 * @param postalCode - Postal code to validate
 * @returns True if valid Swedish postal code
 */
export const isValidSwedishPostalCode = (postalCode: string): boolean => {
  const cleaned = postalCode.replace(/\s/g, '');
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(cleaned);
};

/**
 * Validate a generic postal/zip code (3–10 chars, letters, digits, space, hyphen).
 * Covers formats used by SE/NO/DK/UK/US.
 * @param zipCode - Postal code to validate
 * @returns True if valid postal code
 */
export const isValidZipCode = (zipCode: string): boolean => {
  return /^[A-Za-z0-9][A-Za-z0-9\s\-]{1,8}[A-Za-z0-9]$/.test(zipCode.trim());
};

/**
 * Validate Swedish personal number (personnummer) or a plain birth date.
 * Accepts YYYYMMDD, YYMMDDXXXX or YYYYMMDDXXXX with an optional
 * '-' or '+' separator. The date portion must be a real date.
 * @param ssn - Value to validate
 * @returns True if valid format
 */
export const isValidSwedishSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/[\s\-+]/g, '');
  if (!/^\d{8}$|^\d{10}$|^\d{12}$/.test(cleaned)) return false;
  // Date portion: first 6 digits for YYMMDDXXXX, first 8 for YYYYMMDD / YYYYMMDDXXXX
  const datePart = cleaned.slice(0, cleaned.length === 10 ? 6 : 8);
  return isPlausibleBirthDate(datePart);
};

/**
 * Check that a 6- or 8-digit string (YYMMDD / YYYYMMDD) is a real calendar date
 */
const isPlausibleBirthDate = (digits: string): boolean => {
  const year = parseInt(digits.slice(0, digits.length === 8 ? 4 : 2), 10);
  const month = parseInt(digits.slice(-4, -2), 10);
  const day = parseInt(digits.slice(-2), 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  if (digits.length === 8 && (year < 1900 || year > new Date().getFullYear())) return false;
  const daysInMonth = new Date(digits.length === 8 ? year : 2000, month, 0).getDate();
  return day <= daysInMonth;
};

/**
 * Validate an ISO date string (YYYY-MM-DD) that must be a real calendar date
 * @param dateString - Date string to validate
 * @returns True if valid date
 */
export const isValidISODate = (dateString: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return false;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

/**
 * Check that an ISO date string (YYYY-MM-DD) is today or in the future
 * @param dateString - Date string to validate
 * @returns True if the date is not before today
 */
export const isDateTodayOrFuture = (dateString: string): boolean => {
  if (!isValidISODate(dateString)) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return dateString >= todayStr;
};

/**
 * Validate a person's name (letters incl. diacritics, spaces, hyphens, apostrophes)
 * @param name - Name to validate
 * @returns True if valid name
 */
export const isValidName = (name: string): boolean => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+(\s[A-Za-zÀ-ÖØ-öø-ÿ'’\-]+)*$/.test(name.trim());
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation results
 */
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Calculate strength
  if (errors.length === 0) {
    strength = 'strong';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Validate required field
 * @param value - Value to validate
 * @returns True if not empty
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validate minimum length
 * @param value - String to validate
 * @param minLength - Minimum required length
 * @returns True if meets minimum length
 */
export const minLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param value - String to validate
 * @param maxLength - Maximum allowed length
 * @returns True if within maximum length
 */
export const maxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validate number range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Sanitize string input (remove HTML tags)
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input.replace(/<[^>]*>/g, '');
};
