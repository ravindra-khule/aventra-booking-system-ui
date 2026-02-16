/**
 * Enhanced Payment Form using Stripe Payment Element
 * Shows all available payment methods: Google Pay, Apple Pay, Card, etc.
 */

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';
import { Booking } from '../types/booking.types';
import { createPaymentIntent, createPaymentIntentMock } from '../services/stripe-payment.service';
import { EmailService } from '../services/email.service';
import {
  PaymentType,
  calculatePaymentAmounts,
  formatPaymentType,
} from '../services/payment.service';

interface StripePaymentFormProps {
  booking: Booking;
  paymentType: PaymentType;
  onSuccess: (paymentIntentId: string) => void;
  isDevelopmentMode: boolean;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  booking,
  paymentType,
  onSuccess,
  isDevelopmentMode,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Check after hooks if we're in dev mode without Elements
  if (isDevelopmentMode && (!stripe || !elements)) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const mockId = `mock_payment_${Date.now()}`;
          
          // Send emails in dev mode too (for testing)
          await EmailService.sendBookingConfirmation(booking);
          const paymentAmounts = calculatePaymentAmounts(booking.totalAmount, paymentType);
          if (paymentAmounts.remainingBalance > 0) {
            await EmailService.scheduleReminderEmail(booking, 30);
          }
          
          onSuccess(mockId);
        }}
        className="space-y-6"
      >
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            🧪 Development Mode: Mock Payment
          </p>
          <p className="text-xs text-yellow-700">
            Stripe is not configured. Click "Complete Payment" to simulate a successful payment.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Type:</span>
            <span className="font-semibold">{formatPaymentType(paymentType)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
            <span className="text-gray-900">Amount:</span>
            <span className="text-lg text-blue-600">{formatCurrency(booking.totalAmount)} SEK</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          Complete Payment (Mock)
        </button>
      </form>
    );
  }

  const calculation = calculatePaymentAmounts(booking.totalAmount, paymentType);
  const { payableAmount } = calculation;

  // Create PaymentIntent when component mounts
  useEffect(() => {
    const createIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const intentResponse = isDevelopmentMode
          ? await createPaymentIntentMock(payableAmount * 100, 'sek', {
              bookingId: booking.id,
              paymentType,
            })
          : await createPaymentIntent({
              amount: payableAmount * 100,
              currency: 'sek',
              metadata: {
                bookingId: booking.id,
                paymentType,
                tourId: (booking as any).tourId,
              },
            });

        setClientSecret(intentResponse.clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    createIntent();
  }, [payableAmount, booking, paymentType, isDevelopmentMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    if (!clientSecret) {
      setError('Payment setup failed. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Confirm payment using Stripe
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/#/booking/confirmation`,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed. Please try again.');
      } else {
        // Payment succeeded
        const intentId = clientSecret.split('_secret_')[0];

        // Send confirmation email and schedule reminder
        const paymentAmounts = calculatePaymentAmounts(booking.totalAmount, paymentType);
        const paidAmount = paymentAmounts.payableAmount;
        const remainingAmount = paymentAmounts.remainingBalance;

        // Send booking confirmation email
        await EmailService.sendBookingConfirmation(booking);

        // If this is partial payment, schedule a reminder for remaining balance
        if (remainingAmount > 0 && (paymentType === 'ADVANCE_PAYMENT' || paymentType === 'PARTIAL')) {
          await EmailService.scheduleReminderEmail(booking, 30); // 30 days before trip
        }

        console.log('[StripePaymentForm] Payment success and emails sent/scheduled');
        onSuccess(intentId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      console.error('[StripePaymentForm] Payment error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading payment options...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-1">Choose Payment Method</h3>
        <p className="text-sm text-gray-600">
          Available methods: Google Pay, Apple Pay, Credit/Debit Card, and more
        </p>
      </div>

      {/* Stripe Payment Element - Shows available payment methods (Amazon Pay excluded) */}
      {clientSecret && (
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <PaymentElement
            options={{
              layout: 'tabs',
              paymentMethodOrder: [
                'card',
                'apple_pay',
                'google_pay',
                'sepa_debit',
                'ideal',
                'bancontact',
                'giropay',
                'eps',
              ],
            }}
          />
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payment Type:</span>
          <span className="font-semibold">{formatPaymentType(paymentType)}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
          <span className="text-gray-900">Amount to Pay:</span>
          <span className="text-lg text-blue-600">{formatCurrency(payableAmount)} SEK</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Terms Agreement */}
      <label className="flex items-start space-x-3 text-sm text-gray-600">
        <input
          type="checkbox"
          required
          className="w-4 h-4 mt-1 text-blue-600 rounded"
          disabled={isLoading}
        />
        <span>
          I agree to the{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !stripe || !clientSecret}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <span>Pay {formatCurrency(payableAmount)} SEK</span>
          </>
        )}
      </button>

      {/* Development Mode Notice */}
      {isDevelopmentMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-700">
            🧪 <strong>Development Mode:</strong> Using mock payment. In production, real payment processing will occur.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-start space-x-2 text-xs text-gray-500">
        <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>Payments are secure and encrypted. We use the latest PCI compliance standards.</span>
      </div>
    </form>
  );
};
