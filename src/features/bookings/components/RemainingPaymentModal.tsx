/**
 * Remaining Payment Modal/Form
 * Allows guests to pay remaining balance after partial payment
 */

import React, { useState } from 'react';
import { Booking } from '../../../../types';
import { X, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils';
import { RemainingPaymentForm } from './RemainingPaymentForm';

interface RemainingPaymentModalProps {
  booking: Booking;
  remainingAmount: number;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export const RemainingPaymentModal: React.FC<RemainingPaymentModalProps> = ({
  booking,
  remainingAmount,
  onClose,
  onSuccess,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePaymentSuccess = (transactionId: string) => {
    setPaymentStatus('success');
    setTimeout(() => {
      onSuccess(transactionId);
      onClose();
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    setErrorMessage(error);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Pay Remaining Balance</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Booking Reference:</span>
                <span className="font-mono font-bold text-gray-900">{booking.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Amount:</span>
                <span className="font-bold text-lg text-gray-900">{formatCurrency(booking.totalAmount, booking.currency)}</span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                <span className="text-gray-700">Already Paid:</span>
                <span className="font-bold text-green-600">{formatCurrency(booking.paidAmount, booking.currency)}</span>
              </div>
              <div className="flex justify-between items-center text-xl">
                <span className="text-gray-900 font-bold">Remaining Balance:</span>
                <span className="font-bold text-orange-600">{formatCurrency(remainingAmount, booking.currency)}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Payment Failed</h3>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Payment Successful!</h3>
                <p className="text-sm text-green-700">Your remaining balance has been paid. Closing...</p>
              </div>
            </div>
          )}

          {/* Payment Form */}
          {paymentStatus !== 'success' && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                <RemainingPaymentForm
                  booking={booking}
                  remainingAmount={remainingAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onProcessing={() => setPaymentStatus('processing')}
                />
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 text-center border-t border-gray-100 pt-4">
                <p>🔒 Your payment is processed securely by Stripe</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
