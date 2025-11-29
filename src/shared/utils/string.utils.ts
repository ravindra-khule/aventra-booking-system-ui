/**
 * String Utilities
 */

/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Convert string to slug format
 * @param str - String to slugify
 * @returns Slug string
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[åä]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials (e.g., "John Doe" → "JD")
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Format phone number for display
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Swedish format: +46 70 123 45 67
  if (cleaned.startsWith('46')) {
    return `+46 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  
  // Local format: 070-123 45 67
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

/**
 * Generate a random ID
 * @param prefix - Optional prefix for the ID
 * @param length - Length of random portion (default: 8)
 * @returns Random ID string
 */
export const generateId = (prefix: string = '', length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}-${id}` : id;
};

/**
 * Parse query string to object
 * @param queryString - Query string (e.g., "?foo=bar&baz=qux")
 * @returns Object with key-value pairs
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Build query string from object
 * @param params - Object with key-value pairs
 * @returns Query string
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};
