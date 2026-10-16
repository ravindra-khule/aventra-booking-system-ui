/**
 * Shared Utilities Index
 * 
 * Central export point for all utility functions
 */

// Date utilities
export {
  formatDate,
  formatDateShort,
  formatDateTime,
  getRelativeTime,
  isDatePast,
  isDateFuture,
  daysBetween,
} from './date.utils';

// Currency utilities
export {
  formatCurrency,
  formatNumber,
  formatCurrencyWithSuffix,
  calculatePercentage,
  formatPercentage,
  calculateDiscount,
  getDiscountAmount,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  getActiveCurrency,
  setActiveCurrency,
  subscribeCurrency,
} from './currency.utils';
export type { CurrencyInfo } from './currency.utils';

// Validation utilities
export {
  isValidEmail,
  isValidSwedishPhone,
  isValidSwedishPostalCode,
  isValidSwedishSSN,
  validatePassword,
  isRequired,
  minLength,
  maxLength,
  isInRange,
  sanitizeInput,
} from './validation.utils';

// String utilities
export {
  capitalize,
  truncate,
  slugify,
  getInitials,
  formatPhoneNumber,
  generateId,
  parseQueryString,
  buildQueryString,
} from './string.utils';

// API utilities (already created)
export {
  delay,
  generateId as generateApiId,
  generateTransactionId,
} from './api.utils';
