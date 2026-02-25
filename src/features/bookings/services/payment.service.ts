/**
 * Payment Service - Unified payment processing for all payment-related operations
 * Handles Stripe integration, payment intent creation, and payment flow
 */

import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { createPaymentIntent } from './stripe.service';
import { Booking, BookingStatus, PaymentStatus } from '../types/booking.types';

export type PaymentType = 'FULL' | 'ADVANCE';

export interface PaymentConfig {
  advancePercentage: number;
  currency: string;
}

export interface PaymentProcessingResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  remainingBalance?: number;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export interface PaymentCalculation {
  payableAmount: number;
  remainingBalance: number;
  advanceAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
}

const DEFAULT_CONFIG: PaymentConfig = {
  advancePercentage: 0.2, // 20% advance payment
  currency: 'sek',
};

/**
 * Calculate payment amounts based on payment type
 */
export const calculatePaymentAmounts = (
  totalAmount: number,
  paymentType: PaymentType,
  config: Partial<PaymentConfig> = {}
): PaymentCalculation => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const advanceAmount = Math.round(totalAmount * finalConfig.advancePercentage);

  if (paymentType === 'FULL') {
    return {
      payableAmount: totalAmount,
      remainingBalance: 0,
      advanceAmount,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
    };
  }

  return {
    payableAmount: advanceAmount,
    remainingBalance: totalAmount - advanceAmount,
    advanceAmount,
    bookingStatus: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PARTIAL,
  };
};

/**
 * Process payment with Stripe
 */
export const processPayment = async (
  stripe: Stripe | null,
  elements: StripeElements | null,
  amount: number,
  booking: Booking,
  paymentType: PaymentType,
  config: Partial<PaymentConfig> = {}
): Promise<PaymentProcessingResult> => {
  try {
    // Validation
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe not loaded. Please refresh the page.',
      };
    }

    if (!elements) {
      return {
        success: false,
        error: 'Payment form not loaded. Please refresh the page.',
      };
    }

    const cardElement = elements.getElement('card');
    if (!cardElement) {
      return {
        success: false,
        error: 'Card input not found. Please refresh the page.',
      };
    }

    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // Create payment intent
    const intent = await createPaymentIntent(amount * 100, finalConfig.currency, {
      bookingId: booking.id,
      paymentType,
    });

    if (!intent.clientSecret) {
      return {
        success: false,
        error: 'Failed to create payment. Please try again.',
      };
    }

    // Confirm payment with card
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(intent.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${booking.payer?.firstName} ${booking.payer?.lastName}`,
          email: booking.payer?.email,
          phone: booking.payer?.phone,
        },
      },
    });

    if (stripeError) {
      return {
        success: false,
        error: stripeError.message || 'Payment failed. Please try again.',
      };
    }

    if (!paymentIntent || paymentIntent.status === 'requires_action') {
      return {
        success: false,
        error: 'Payment requires additional action. Please try again.',
      };
    }

    if (paymentIntent.status !== 'succeeded') {
      return {
        success: false,
        error: `Payment ${paymentIntent.status}. Please try again.`,
      };
    }

    // Calculate final amounts
    const calculation = calculatePaymentAmounts(booking.totalAmount, paymentType, config);

    return {
      success: true,
      transactionId: paymentIntent.id,
      remainingBalance: calculation.remainingBalance,
      bookingStatus: calculation.bookingStatus,
      paymentStatus: calculation.paymentStatus,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Process payment in development mode (mock)
 */
export const processPaymentDevelopmentMode = (
  amount: number,
  booking: Booking,
  paymentType: PaymentType,
  config: Partial<PaymentConfig> = {}
): PaymentProcessingResult => {
  try {
    const calculation = calculatePaymentAmounts(booking.totalAmount, paymentType, config);

    return {
      success: true,
      transactionId: `DEV-MODE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      remainingBalance: calculation.remainingBalance,
      bookingStatus: calculation.bookingStatus,
      paymentStatus: calculation.paymentStatus,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Format payment type for display
 */
export const formatPaymentType = (paymentType: PaymentType): string => {
  return paymentType === 'FULL' ? 'Full Payment' : 'Advance Payment (20%)';
};

/**
 * Get payment description for display
 */
export const getPaymentDescription = (
  paymentType: PaymentType,
  payableAmount: number,
  remainingBalance: number,
  currency = 'SEK'
): string => {
  if (paymentType === 'FULL') {
    return `Pay full amount now`;
  }
  return `Pay 20% deposit now (${payableAmount} ${currency}), remaining ${remainingBalance} ${currency} due later`;
};
