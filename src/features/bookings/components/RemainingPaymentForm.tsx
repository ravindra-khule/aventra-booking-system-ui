/**
 * Remaining Payment Form with Stripe Payment Element
 */

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Booking } from '../../../../types';
import { formatCurrency } from '../../../shared/utils';
import { EmailService } from '../services/email.service';
import { Loader, AlertCircle } from 'lucide-react';

interface RemainingPaymentFormProps {
  booking: Booking;
  remainingAmount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onProcessing: () => void;
}

export const RemainingPaymentForm: React.FC<RemainingPaymentFormProps> = ({
  booking,
  remainingAmount,
  onSuccess,
  onError,
  onProcessing,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [completePaymentError, setCompletePaymentError] = useState<string | null>(null);
  const isDevelopmentMode = import.meta.env.DEV;

  // Dev mode mock payment
  if (isDevelopmentMode && (!stripe || !elements)) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onProcessing();
          setIsLoading(true);
          // Simulate payment processing
          setTimeout(() => {
            onSuccess(`mock_remaining_${Date.now()}`);
            setIsLoading(false);
          }, 2000);
        }}
        className="space-y-4"
      >
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-semibold mb-2">
            🧪 Development Mode: Mock Payment
          </p>
          <p className="text-xs text-yellow-700">
            Click "Pay Now" to simulate a successful remaining balance payment.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount to Pay:</span>
            <span className="font-semibold">{formatCurrency(remainingAmount, booking.currency)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay Now ${formatCurrency(remainingAmount, booking.currency)}`
          )}
        </button>
      </form>
    );
  }

  // Real Stripe payment
  if (!stripe || !elements) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Loader className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Loading payment form...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onProcessing();
    setIsLoading(true);
    setCompletePaymentError(null);

    if (!stripe || !elements) {
      setCompletePaymentError('Payment system not initialized');
      setIsLoading(false);
      onError('Payment system not initialized');
      return;
    }

    try {
      // In a real app, this would call your backend to create a PaymentIntent
      // For now, we'll simulate it
      console.log('[RemainingPayment] Processing payment:', {
        bookingId: booking.id,
        amount: remainingAmount,
        currency: booking.currency,
      });

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        const errorMsg = error.message || 'Payment failed';
        setCompletePaymentError(errorMsg);
        onError(errorMsg);
      } else if (paymentIntent && paymentIntent.client_secret) {
        // Payment successful - Send confirmation email
        console.log('[RemainingPayment] Payment successful:', paymentIntent.id);
        
        // Send payment confirmation email
        const emailResult = await EmailService.sendPaymentConfirmation(
          booking,
          paymentIntent.id,
          remainingAmount
        );

        if (emailResult.success) {
          console.log('[RemainingPayment] Confirmation email sent successfully');
        } else {
          console.warn('[RemainingPayment] Failed to send confirmation email:', emailResult.error);
          // Don't fail the payment - email sending is not critical
        }

        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment processing failed';
      setCompletePaymentError(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {completePaymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{completePaymentError}</p>
        </div>
      )}

      {/* Stripe Payment Element - Amazon Pay excluded */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
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

      {/* Amount to Pay */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-blue-900 font-semibold">Total Amount to Pay:</span>
          <span className="text-2xl font-bold text-blue-600">{formatCurrency(remainingAmount, booking.currency)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !stripe}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader className="h-5 w-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ${formatCurrency(remainingAmount, booking.currency)}`
        )}
      </button>

      {/* Security Message */}
      <p className="text-xs text-gray-500 text-center">
        🔒 This is a secure, PCI-DSS compliant payment processed by Stripe
      </p>
    </form>
  );
};
