import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';
import {
  PaymentType,
  calculatePaymentAmounts,
  processPaymentDevelopmentMode,
  formatPaymentType,
  getPaymentDescription,
} from '../services/payment.service';
import { Booking } from '../types/booking.types';

interface PaymentFormProps {
  booking: Booking;
  onSuccess: (result: any) => void;
  isDevelopmentMode: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  booking,
  onSuccess,
  isDevelopmentMode,
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType>('FULL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Ensure booking has required fields
  if (!booking || !booking.totalAmount) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Payment Form Error</p>
            <p className="text-sm text-red-700">Booking data is missing. Please refresh the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const calculation = calculatePaymentAmounts(booking.totalAmount, paymentType);
  const { payableAmount, remainingBalance } = calculation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // In development mode, mock the payment
      const result = processPaymentDevelopmentMode(payableAmount, booking, paymentType);

      if (result.success) {
        setSuccess(true);
        onSuccess(result);
      } else {
        setError(result.error || 'Payment processing failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-900">Payment Successful!</p>
            <p className="text-sm text-green-700">Your booking is being confirmed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Type Selection */}
      <div className="space-y-3">
        <label className="block font-semibold text-gray-900">Payment Option</label>
        <div className="space-y-3">
          {(['FULL', 'ADVANCE'] as const).map((type) => {
            const typeCalc = calculatePaymentAmounts(booking.totalAmount, type);
            return (
              <label
                key={type}
                className="flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors"
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
                  onChange={() => setPaymentType(type)}
                  className="w-5 h-5 mt-1 text-blue-600"
                  disabled={isProcessing}
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{formatPaymentType(type)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {getPaymentDescription(type, typeCalc.payableAmount, typeCalc.remainingBalance)}
                  </div>
                  <div className="mt-2 font-semibold text-lg text-blue-600">
                    {formatCurrency(typeCalc.payableAmount)} SEK
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Booking Total:</span>
          <span className="font-semibold">{formatCurrency(booking.totalAmount)} SEK</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">To Pay Now:</span>
          <span className="font-semibold text-blue-600">{formatCurrency(payableAmount)} SEK</span>
        </div>
        {remainingBalance > 0 && (
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="text-gray-600">Remaining Balance:</span>
            <span className="font-semibold text-orange-600">{formatCurrency(remainingBalance)} SEK</span>
          </div>
        )}
      </div>

      {/* Card Input - Currently in Development Mode Only */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
        <p className="text-sm text-blue-700 font-medium">🧪 Development Mode</p>
        <p className="text-xs text-blue-600 mt-1">
          This is a UI preview. Click "Pay" to simulate a successful payment. In production, users will enter real card details here securely with Stripe.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition"
      >
        {isProcessing && <Loader className="h-4 w-4 animate-spin" />}
        <span>
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(payableAmount)} SEK`}
        </span>
      </button>

      {/* Terms Checkbox */}
      <label className="flex items-start space-x-3 text-sm text-gray-600">
        <input
          type="checkbox"
          required
          className="w-4 h-4 mt-1 text-blue-600 rounded"
          disabled={isProcessing}
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
    </form>
  );
};
