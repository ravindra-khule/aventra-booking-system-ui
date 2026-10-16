/**
 * Currency Formatting Utilities
 */

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

/**
 * Currencies offered in Admin > Settings > Payment
 */
export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
];

export const DEFAULT_CURRENCY = 'SEK';

let activeCurrency = DEFAULT_CURRENCY;
const currencyListeners = new Set<(currency: string) => void>();

/**
 * Get the site-wide currency selected in backend settings.
 * Falls back to DEFAULT_CURRENCY until settings are loaded.
 */
export const getActiveCurrency = (): string => activeCurrency;

/**
 * Set the site-wide currency and notify subscribers (e.g. useCurrency hooks).
 */
export const setActiveCurrency = (code: string): void => {
  const normalized = (code || '').trim().toUpperCase();
  if (!normalized || normalized === activeCurrency) return;
  activeCurrency = normalized;
  currencyListeners.forEach((listener) => listener(activeCurrency));
};

/**
 * Subscribe to currency changes. Returns an unsubscribe function.
 */
export const subscribeCurrency = (listener: (currency: string) => void): (() => void) => {
  currencyListeners.add(listener);
  return () => {
    currencyListeners.delete(listener);
  };
};

/**
 * Format a number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: currency configured in admin settings)
 * @param locale - Locale string (default: 'sv-SE')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = getActiveCurrency(),
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
 * @param currency - Currency code (default: currency configured in admin settings)
 * @param locale - Locale string (default: 'sv-SE')
 * @returns Formatted string with amount and currency
 */
export const formatCurrencyWithSuffix = (
  amount: number,
  currency: string = getActiveCurrency(),
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
