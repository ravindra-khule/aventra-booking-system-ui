/**
 * Currency Formatting Utilities
 */

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'SEK')
 * @param locale - Locale string (default: 'sv-SE')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'SEK',
  locale: string = 'sv-SE'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number with thousand separators
 * @param amount - Amount to format
 * @param locale - Locale string (default: 'sv-SE')
 * @returns Formatted number string
 */
export const formatNumber = (amount: number, locale: string = 'sv-SE'): string => {
  return new Intl.NumberFormat(locale).format(amount);
};

/**
 * Format currency with custom suffix (e.g., "45,900 SEK")
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'SEK')
 * @param locale - Locale string (default: 'sv-SE')
 * @returns Formatted string with amount and currency
 */
export const formatCurrencyWithSuffix = (
  amount: number,
  currency: string = 'SEK',
  locale: string = 'sv-SE'
): string => {
  return `${formatNumber(amount, locale)} ${currency}`;
};

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Percentage as number
 */
export const calculatePercentage = (value: number, total: number, decimals: number = 2): number => {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
};

/**
 * Format percentage
 * @param value - Current value
 * @param total - Total value
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, total: number, decimals: number = 0): string => {
  return `${calculatePercentage(value, total, decimals)}%`;
};

/**
 * Calculate discount amount
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage (e.g., 10 for 10%)
 * @returns Discounted price
 */
export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
  return originalPrice - (originalPrice * discountPercent) / 100;
};

/**
 * Calculate discount amount (absolute value)
 * @param originalPrice - Original price
 * @param discountPercent - Discount percentage (e.g., 10 for 10%)
 * @returns Discount amount
 */
export const getDiscountAmount = (originalPrice: number, discountPercent: number): number => {
  return (originalPrice * discountPercent) / 100;
};
