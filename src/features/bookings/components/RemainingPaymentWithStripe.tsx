/**
 * Wrapper for Remaining Payment that provides Stripe Elements context
 */

import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { RemainingPaymentModal } from './RemainingPaymentModal';
import { Booking } from '../../../../types';

interface RemainingPaymentWithStripeProps {
  booking: Booking;
  remainingAmount: number;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export const RemainingPaymentWithStripe: React.FC<RemainingPaymentWithStripeProps> = ({
  booking,
  remainingAmount,
  onClose,
  onSuccess,
}) => {
  const stripeKey = import.meta.env.VITE_REACT_APP_STRIPE_KEY;
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!stripeKey) {
      const errorMsg = 'Stripe key not configured';
      console.error(errorMsg);
      setLoadError(errorMsg);
      return;
    }

    const loadStripeAsync = async () => {
      try {
        console.log('[RemainingPayment] Loading Stripe...');
        const instance = await loadStripe(stripeKey);

        if (!instance) {
          throw new Error('Stripe failed to initialize');
        }

        console.log('[RemainingPayment] Stripe loaded successfully');
        setStripe(instance);
        setLoadError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[RemainingPayment] Failed to load Stripe:', message);
        setLoadError(message);
      }
    };

    loadStripeAsync();
  }, [stripeKey]);

  if (loadError) {
    return (
      <RemainingPaymentModal
        booking={booking}
        remainingAmount={remainingAmount}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
  }

  if (!stripe) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  const elementsOptions = {
    mode: 'payment' as const,
    currency: booking.currency?.toLowerCase() || 'sek',
    amount: remainingAmount * 100, // Convert to cents/öre
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripe} options={elementsOptions}>
      <RemainingPaymentModal
        booking={booking}
        remainingAmount={remainingAmount}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};
