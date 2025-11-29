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
 * Validate Swedish personal number (personnummer)
 * @param ssn - Swedish personal number to validate
 * @returns True if valid format
 */
export const isValidSwedishSSN = (ssn: string): boolean => {
  const cleaned = ssn.replace(/[\s\-]/g, '');
  // Basic format check: YYYYMMDDXXXX or YYMMDDXXXX
  const ssnRegex = /^(\d{8}|\d{10}|\d{12})\d{4}$/;
  return ssnRegex.test(cleaned);
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
