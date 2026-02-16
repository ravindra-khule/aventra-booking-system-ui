import React, { useMemo, useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentUI } from './PaymentUI';
import { Booking } from '../types/booking.types';

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

  // In development without valid key, render without Elements provider
  if (isProductionKey === false) {
    return <PaymentUI booking={booking} onPaymentSuccess={onPaymentSuccess} />;
  }

  // With valid key, wrap with Elements provider
  return (
    <Elements stripe={stripe}>
      <PaymentUI booking={booking} onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
};
