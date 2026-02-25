import axios from 'axios';

export async function createPaymentIntent(amount: number, currency: string, metadata: Record<string, any> = {}) {
  // This should call your backend endpoint that creates a PaymentIntent
  // Example endpoint: /api/create-payment-intent
  const response = await axios.post('/api/create-payment-intent', {
    amount,
    currency,
    metadata,
  });
  return response.data;
}
