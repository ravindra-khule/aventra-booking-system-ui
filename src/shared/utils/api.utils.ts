/**
 * API Utilities - Shared helper functions for API services
 */

/**
 * Simulate network delay for mock API calls
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate a random ID with prefix
 * @param prefix String prefix for the ID (e.g., 'BK-' for bookings)
 */
export const generateId = (prefix: string = ''): string => {
  const randomNum = Math.floor(Math.random() * 10000);
  return `${prefix}${randomNum}`;
};

/**
 * Generate a random transaction ID
 */
export const generateTransactionId = (): string => {
  return `pi_mock_${Math.random().toString(36).substring(7)}`;
};
