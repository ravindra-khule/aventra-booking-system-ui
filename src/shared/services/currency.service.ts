/**
 * Currency Service - Site-Wide Currency Management
 *
 * Loads the currency configured in Admin > Settings > Payment
 * (settings table: category 'Payment', key 'currency') and keeps
 * the shared currency state in sync so it is displayed everywhere.
 */

import { SettingsService, SETTINGS_CATEGORIES } from './settings.service';
import { getActiveCurrency, setActiveCurrency } from '../utils/currency.utils';

let loadPromise: Promise<string> | null = null;

/**
 * Fetch the configured currency once and activate it.
 * Safe to call multiple times - only fetches the first time.
 */
export const ensureCurrencyLoaded = (): Promise<string> => {
  if (!loadPromise) {
    loadPromise = (async () => {
      try {
        const value = await SettingsService.get(SETTINGS_CATEGORIES.PAYMENT, 'currency');
        if (value) {
          setActiveCurrency(value);
        }
      } catch (error) {
        console.error('Failed to load currency setting:', error);
      }
      return getActiveCurrency();
    })();
  }
  return loadPromise;
};

/**
 * Force a re-fetch of the currency setting (e.g. after saving new settings elsewhere).
 */
export const refreshCurrency = (): Promise<string> => {
  loadPromise = null;
  return ensureCurrencyLoaded();
};

/**
 * Persist a new site currency and activate it immediately.
 */
export const saveCurrency = async (code: string): Promise<boolean> => {
  const success = await SettingsService.update(SETTINGS_CATEGORIES.PAYMENT, 'currency', code);
  if (success) {
    setActiveCurrency(code);
  }
  return success;
};
