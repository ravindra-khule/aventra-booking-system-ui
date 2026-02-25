/**
 * Stripe Payment Integration Service
 * Handles PaymentIntent creation and payment confirmation
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface CreatePaymentIntentRequest {
  amount: number; // in smallest currency unit (centesimal)
  currency: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Create a PaymentIntent on the backend
 */
export const createPaymentIntent = async (
  request: CreatePaymentIntentRequest
): Promise<CreatePaymentIntentResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payments/create-intent`,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to create payment intent');
    }
    throw error;
  }
};

/**
 * Development mode - Create mock PaymentIntent
 */
export const createPaymentIntentMock = async (
  amount: number,
  currency: string,
  metadata?: Record<string, any>
): Promise<CreatePaymentIntentResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    clientSecret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
    paymentIntentId: `pi_test_${Date.now()}`,
  };
};
