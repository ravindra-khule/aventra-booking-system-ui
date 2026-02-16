import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { BookingWizard } from './BookingWizard';

/**
 * Wrapper for BookingWizard that provides Stripe Elements context
 * Ensures Stripe is fully loaded before rendering
 */
export const BookingWizardWithStripe: React.FC = () => {
  const stripeKey = import.meta.env.VITE_REACT_APP_STRIPE_KEY;
  const isDevelopmentMode = import.meta.env.DEV;
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripeKey) {
      const errorMsg = 'Stripe key not configured. Check .env.local: VITE_REACT_APP_STRIPE_KEY';
      console.error(errorMsg);
      setLoadError(errorMsg);
      return;
    }

    const loadStripeAsync = async () => {
      try {
        console.log('[Stripe] Loading with key:', stripeKey.substring(0, 20) + '...');
        const instance = await loadStripe(stripeKey);
        
        if (!instance) {
          throw new Error('Stripe failed to initialize');
        }
        
        console.log('[Stripe] Successfully loaded');
        setStripe(instance);
        setLoadError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[Stripe] Failed to load:', message);
        setLoadError(`Stripe initialization failed: ${message}`);
      }
    };

    loadStripeAsync();
  }, [stripeKey]);

  const wizardElement = <BookingWizard isDevelopmentMode={isDevelopmentMode} />;

  // Show error if Stripe key missing
  if (loadError) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-900 mb-2">Configuration Error</h2>
        <p className="text-red-700">{loadError}</p>
      </div>
    );
  }

  // While loading Stripe, show wizard without payment form
  if (!stripe) {
    return wizardElement;
  }

  // Stripe ready - wrap with Elements provider for hooks to work
  const elementsOptions = {
    mode: 'payment' as const,
    currency: 'sek',
    amount: 50000, // 500 SEK default for testing - will be replaced with actual booking amount
    appearance: {
      theme: 'stripe' as const,
    }
  };

  return (
    <Elements stripe={stripe} options={elementsOptions}>
      {wizardElement}
    </Elements>
  );
};
