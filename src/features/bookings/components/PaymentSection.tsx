import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { StripePaymentForm } from './StripePaymentForm';
import { Booking } from '../types/booking.types';
import { PaymentType, calculatePaymentAmounts, formatPaymentType } from '../services/payment.service';
import { EmailService } from '../services/email.service';

// Stripe is only available when the publishable key is configured
const STRIPE_CONFIGURED = !!import.meta.env.VITE_REACT_APP_STRIPE_KEY;

interface PaymentSectionProps {
  booking: Booking;
  isDevelopmentMode: boolean;
  /** Controlled payment type selected by the user */
  paymentType: PaymentType;
  onPaymentTypeChange: (type: PaymentType) => void;
  /** Explicit advance/deposit amount (e.g. tour deposit); falls back to 20% of total */
  advanceAmount?: number;
  currency?: string;
  onPaymentSuccess?: (result: {
    success: boolean;
    transactionId: string;
    payableAmount: number;
    remainingBalance: number;
    paymentType: PaymentType;
  }) => void;
}

/**
 * Payment Section - Main payment UI container with payment type selection and Stripe integration
 */
export const PaymentSection: React.FC<PaymentSectionProps> = ({
  booking,
  isDevelopmentMode,
  paymentType,
  onPaymentTypeChange,
  advanceAmount,
  currency = 'SEK',
  onPaymentSuccess = (result) => {},
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentConfig = { advanceAmount };
  const calculation = calculatePaymentAmounts(booking.totalAmount, paymentType, paymentConfig);
  const { payableAmount, remainingBalance } = calculation;

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setIsSubmitted(true);
    onPaymentSuccess({
      success: true,
      transactionId: paymentIntentId,
      payableAmount,
      remainingBalance,
      paymentType,
    });
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border border-gray-300 rounded-xl p-6 mb-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-sm text-gray-600">Your payment has been processed and your booking is being confirmed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Type Selection */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <span>Select Payment Option</span>
        </h3>

        <div className="space-y-3">
          {(['FULL', 'ADVANCE'] as const).map((type) => {
            const typeCalc = calculatePaymentAmounts(booking.totalAmount, type, paymentConfig);
            return (
              <label
                key={type}
                className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
                style={{
                  borderColor: paymentType === type ? '#3b82f6' : '#e5e7eb',
                  backgroundColor: paymentType === type ? '#eff6ff' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="paymentType"
                  value={type}
                  checked={paymentType === type}
                  onChange={() => {
                    onPaymentTypeChange(type);
                    setError(null);
                  }}
                  className="w-5 h-5 mt-0.5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{formatPaymentType(type)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {type === 'FULL'
                      ? 'Pay full booking amount now'
                      : `Pay deposit now (${typeCalc.payableAmount} ${currency}), remaining ${typeCalc.remainingBalance} ${currency} due later`}
                  </div>
                  <div className="mt-2 font-semibold text-blue-600 text-lg">
                    {typeCalc.payableAmount} {currency} {type === 'ADVANCE' && `(of ${booking.totalAmount} ${currency})`}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Payment Details</h3>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Only mount StripePaymentForm when <Elements> context is available (key configured).
            useStripe() throws if rendered outside <Elements>, so we gate it here. */}
        {STRIPE_CONFIGURED ? (
          <StripePaymentForm
            booking={booking}
            paymentType={paymentType}
            advanceAmount={advanceAmount}
            onSuccess={handlePaymentSuccess}
            isDevelopmentMode={isDevelopmentMode}
          />
        ) : (
          /* Stripe not configured — mock payment so the booking flow still works */
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const mockId = `mock_payment_${Date.now()}`;
              await EmailService.sendBookingConfirmation(booking);
              const calc = calculatePaymentAmounts(booking.totalAmount, paymentType, paymentConfig);
              if (calc.remainingBalance > 0) {
                await EmailService.scheduleReminderEmail(booking, 30);
              }
              handlePaymentSuccess(mockId);
            }}
            className="space-y-6"
          >
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-semibold mb-1">Payment not configured</p>
              <p className="text-xs text-yellow-700">
                Stripe is not set up yet. Click "Complete Booking" to proceed with a simulated payment.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-gray-900">Amount due now:</span>
                <span className="text-blue-600 text-lg">{payableAmount} {currency}</span>
              </div>
              {remainingBalance > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Due later:</span>
                  <span className="text-gray-700">{remainingBalance} {currency}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Complete Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
