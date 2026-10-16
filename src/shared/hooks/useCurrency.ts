/**
 * useCurrency - React hook for the site-wide currency
 *
 * Returns the currency code configured in Admin > Settings > Payment
 * and re-renders the component when it changes.
 */

import { useEffect, useState } from 'react';
import { getActiveCurrency, subscribeCurrency } from '../utils/currency.utils';
import { ensureCurrencyLoaded } from '../services/currency.service';

export const useCurrency = (): string => {
  const [currency, setCurrency] = useState<string>(getActiveCurrency());

  useEffect(() => {
    ensureCurrencyLoaded();
    const unsubscribe = subscribeCurrency(setCurrency);
    return unsubscribe;
  }, []);

  return currency;
};
