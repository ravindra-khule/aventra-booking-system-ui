import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement } from '@stripe/stripe-js';

interface StripeCardInputProps {
  disabled: boolean;
}

/**
 * Safe wrapper for Stripe CardElement that handles development mode without Elements provider
 * Uses try-catch to gracefully degrade if not wrapped by Elements provider
 */
export const StripeCardInput: React.FC<StripeCardInputProps> = ({ disabled }) => {
  let stripe = null;
  let elements = null;
  let hasElementsContext = true;

  try {
    stripe = useStripe();
    elements = useElements();
  } catch (error) {
    // In development mode without Elements provider, hooks will fail gracefully
    hasElementsContext = false;
  }

  // Development mode - no Elements provider available
  if (!hasElementsContext || !stripe) {
    return (
      <div className="space-y-4 max-w-md">
        <div className="border border-blue-300 rounded-lg p-3 bg-blue-50">
          <p className="text-sm text-blue-700 font-medium">Development Mode</p>
          <p className="text-xs text-blue-600 mt-1">Stripe is not configured yet. In production, users will enter card details here securely.</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          UI Development Mode - Backend integration pending
        </p>
      </div>
    );
  }

  // Production mode - render Stripe CardElement
  return (
    <div className="space-y-4 max-w-md">
      <div className="border border-gray-300 rounded-lg p-3 bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Secure payments powered by Stripe
      </p>
    </div>
  );
};
