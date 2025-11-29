/**
 * Date Formatting Utilities
 */

/**
 * Format a date string to a localized date
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'sv-SE' for Swedish)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, locale: string = 'sv-SE'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date string to a short date format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'sv-SE' for Swedish)
 * @returns Short formatted date string (e.g., "2025-11-29")
 */
export const formatDateShort = (dateString: string | Date, locale: string = 'sv-SE'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString(locale);
};

/**
 * Format a date with time
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'sv-SE' for Swedish)
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string | Date, locale: string = 'sv-SE'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time string (e.g., "2 days ago")
 * @param dateString - ISO date string or Date object
 * @param locale - Locale string (default: 'sv-SE' for Swedish)
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string | Date, locale: string = 'sv-SE'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date, locale);
};

/**
 * Check if a date is in the past
 * @param dateString - ISO date string or Date object
 * @returns True if date is in the past
 */
export const isDatePast = (dateString: string | Date): boolean => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date < new Date();
};

/**
 * Check if a date is in the future
 * @param dateString - ISO date string or Date object
 * @returns True if date is in the future
 */
export const isDateFuture = (dateString: string | Date): boolean => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date > new Date();
};

/**
 * Calculate days between two dates
 * @param date1 - First date
 * @param date2 - Second date (default: today)
 * @returns Number of days between dates
 */
export const daysBetween = (date1: string | Date, date2: string | Date = new Date()): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  const diffInMs = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};
