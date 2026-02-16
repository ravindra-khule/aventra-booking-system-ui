import React, { useState } from 'react';
import { CreditCard, Loader } from 'lucide-react';
import { StripePaymentForm } from './StripePaymentForm';
import { Booking } from '../types/booking.types';
import { PaymentType, calculatePaymentAmounts, formatPaymentType } from '../services/payment.service';

interface PaymentSectionProps {
  booking: Booking;
  isDevelopmentMode: boolean;
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
  onPaymentSuccess = (result) => {},
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType>('FULL');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculation = calculatePaymentAmounts(booking.totalAmount, paymentType);
  const { payableAmount, remainingBalance, advanceAmount } = calculation;

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
            const typeCalc = calculatePaymentAmounts(booking.totalAmount, type);
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
                    setPaymentType(type);
                    setError(null);
                  }}
                  className="w-5 h-5 mt-0.5 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{formatPaymentType(type)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {type === 'FULL'
                      ? 'Pay full booking amount now'
                      : `Pay 20% deposit now (${typeCalc.payableAmount} SEK), remaining ${typeCalc.remainingBalance} SEK due later`}
                  </div>
                  <div className="mt-2 font-semibold text-blue-600 text-lg">
                    {typeCalc.payableAmount} SEK {type === 'ADVANCE' && `(of ${booking.totalAmount} SEK)`}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Stripe Payment Form */}
      <div className="bg-white border border-gray-300 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Payment Details</h3>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        <StripePaymentForm
          booking={booking}
          paymentType={paymentType}
          onSuccess={handlePaymentSuccess}
          isDevelopmentMode={isDevelopmentMode}
        />
      </div>
    </div>
  );
};
