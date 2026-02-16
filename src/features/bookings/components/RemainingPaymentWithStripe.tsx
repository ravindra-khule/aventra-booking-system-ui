import React, { useState } from 'react';
import { Booking } from '../../../../types';
import { X } from 'lucide-react';

interface RemainingPaymentWithStripeProps {
  booking: Booking;
  remainingAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentForm: React.FC<RemainingPaymentWithStripeProps> = ({
  remainingAmount,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          Remaining Amount: <span className="font-bold">${remainingAmount.toFixed(2)}</span>
        </p>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <input
          type="text"
          placeholder="Card Number (Demo)"
          className="w-full p-2 border border-gray-300 rounded"
          disabled
        />
      </div>

      {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-3">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        {loading ? 'Processing...' : `Pay $${remainingAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

export const RemainingPaymentWithStripe: React.FC<RemainingPaymentWithStripeProps> = (props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button
            onClick={props.onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Booking ID: {props.booking.id}</p>
          <p className="text-sm text-gray-600">Tour: {props.booking.tourTitle}</p>
        </div>

        <PaymentForm {...props} />
      </div>
    </div>
  );
};
