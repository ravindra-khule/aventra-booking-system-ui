import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeCardElement } from '@stripe/stripe-js';
import { createPaymentIntent } from '../services/stripe.service';
import { Booking, BookingStatus, PaymentStatus } from '../types/booking.types';
import { formatCurrency } from '../../../shared/utils';
import { Button } from '../../../shared/components/ui/Button';

interface PaymentUIProps {
  booking: Booking;
  onPaymentSuccess: (updatedBooking: Booking) => void;
}

const ADVANCE_PERCENTAGE = 0.2; // 20% advance

export const PaymentUI: React.FC<PaymentUIProps> = ({ booking, onPaymentSuccess }) => {
  const [paymentType, setPaymentType] = useState<'FULL' | 'ADVANCE'>('FULL');
  // Only Card is supported with Stripe Elements
    const stripe = useStripe();
    const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const advanceAmount = Math.round(booking.totalAmount * ADVANCE_PERCENTAGE);
  const payableAmount = paymentType === 'FULL' ? booking.totalAmount : advanceAmount;
  const remaining = booking.totalAmount - (paymentType === 'FULL' ? booking.totalAmount : advanceAmount);

  const handlePayment = async () => {
    setIsPaying(true);
    setError(null);
    try {
      // Create PaymentIntent on backend
      const intent = await createPaymentIntent(
        payableAmount * 100, // Stripe expects amount in smallest currency unit
        'sek',
        { bookingId: booking.id, paymentType }
      );
      if (!stripe || !elements) {
        setError('Stripe not loaded');
        setIsPaying(false);
        return;
      }
      const cardElement = elements.getElement(CardElement) as unknown as StripeCardElement | null;
      if (!cardElement) {
        setError('Card input not found');
        setIsPaying(false);
        return;
      }
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(intent.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking.customerName,
            email: booking.payer.email,
          },
        },
      });
      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setIsPaying(false);
        return;
      }
      setPaymentSuccess(true);
      const updatedBooking: Booking = {
        ...booking,
        paidAmount: booking.paidAmount + payableAmount,
        paymentStatus: paymentType === 'FULL' ? PaymentStatus.PAID : PaymentStatus.PARTIAL,
        status: paymentType === 'FULL' ? BookingStatus.CONFIRMED : BookingStatus.PENDING,
        transactionId: paymentIntent?.id,
      };
      onPaymentSuccess(updatedBooking);
    } catch (err: any) {
      setError(err.message || 'Payment error');
    }
    setIsPaying(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Complete Your Payment</h2>
      {/* Booking Summary */}
      <div className="mb-6 border rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Booking ID:</span>
          <span className="font-mono">{booking.id}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tour:</span>
          <span>{booking.tourTitle}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Customer:</span>
          <span>{booking.customerName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Trip Date:</span>
          <span>{booking.tripDate}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-bold">{formatCurrency(booking.totalAmount)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Already Paid:</span>
          <span className="font-bold text-green-700">{formatCurrency(booking.paidAmount)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-bold text-red-600">{formatCurrency(booking.totalAmount - booking.paidAmount)}</span>
        </div>
      </div>
      {/* Payment Options */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">Choose Payment Type:</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded border ${paymentType === 'FULL' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setPaymentType('FULL')}
            disabled={isPaying}
          >
            Pay Full Amount
          </button>
          <button
            className={`px-4 py-2 rounded border ${paymentType === 'ADVANCE' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            onClick={() => setPaymentType('ADVANCE')}
            disabled={isPaying}
          >
            Pay Advance ({formatCurrency(advanceAmount)})
          </button>
        </div>
      </div>
      {/* Card Payment (Stripe Elements) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-700">Card Details:</label>
        <div className="border rounded p-3 bg-white">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      {/* Payable Amount */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">Payable Now:</span>
          <span className="text-2xl font-bold text-blue-700">{formatCurrency(payableAmount)}</span>
        </div>
      </div>
      {/* Payment Button */}
      <Button
        variant="primary"
        className="w-full py-3 text-lg"
        onClick={handlePayment}
        disabled={isPaying || paymentSuccess}
      >
        {isPaying ? 'Processing...' : 'Pay Now'}
      </Button>
      {error && <div className="text-red-600 mt-3 text-center">{error}</div>}
      {/* Success Message */}
      {paymentSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="text-green-700 font-bold text-lg mb-2">Payment Successful!</div>
          <div className="mb-2">
            Status: <span className="font-semibold">{paymentType === 'FULL' ? 'Confirmed' : 'Partially Paid'}</span>
          </div>
          {paymentType === 'ADVANCE' && (
            <div className="text-gray-700">Remaining Balance: <span className="font-bold">{formatCurrency(remaining)}</span></div>
          )}
        </div>
      )}
    </div>
  );
};
