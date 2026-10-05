import React, { useMemo, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentUI } from './PaymentUI';
import { Booking } from '../types/booking.types';
import { formatCurrency } from '../../../shared/utils';

interface StripeWrapperProps {
  booking: Booking;
  onPaymentSuccess: (updatedBooking: Booking) => void;
}

/**
 * Wrapper for PaymentUI that provides Stripe Elements context for admin panel
 * In development mode without a valid Stripe key, renders without Elements
 */
export const StripeWrapper: React.FC<StripeWrapperProps> = ({ booking, onPaymentSuccess }) => {
  const stripeKey = process.env.REACT_APP_STRIPE_KEY || 'pk_test_YourStripeKeyHere';
  const isProductionKey = stripeKey && !stripeKey.includes('YourStripeKeyHere');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const stripe = useMemo(() => {
    if (!isClient) return null;
    
    if (isProductionKey) {
      return loadStripe(stripeKey);
    }
    return Promise.resolve(null) as any;
  }, [isProductionKey, stripeKey, isClient]);

  // In development without a valid key, don't mount PaymentUI:
  // it renders Stripe <CardElement>/useElements() which throws outside <Elements>.
  if (isProductionKey === false) {
    return (
      <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
        <p className="text-sm font-semibold text-yellow-800 mb-1">Stripe not configured</p>
        <p className="text-xs text-yellow-700 mb-3">
          Set a publishable key to enable card payments. You can still simulate a payment in development.
        </p>
        <button
          type="button"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
          onClick={() => {
            const remaining = booking.totalAmount - booking.paidAmount;
            onPaymentSuccess({
              ...booking,
              paidAmount: booking.totalAmount,
              transactionId: `dev-sim-${Date.now()}`,
            });
          }}
        >
          Simulate Full Payment ({formatCurrency(booking.totalAmount - booking.paidAmount)})
        </button>
      </div>
    );
  }

  // With valid key, wrap with Elements provider
  return (
    <Elements stripe={stripe}>
      <PaymentUI booking={booking} onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
};
