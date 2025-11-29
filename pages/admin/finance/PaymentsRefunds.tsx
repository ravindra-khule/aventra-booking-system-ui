import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const PaymentsRefunds: React.FC = () => {
  return (
    <ComingSoon
      title="Payments & Refunds"
      description="Comprehensive payment processing, tracking, and refund management system."
      features={[
        'View all payment transactions',
        'Payment status tracking (pending, completed, failed)',
        'Multiple payment methods support (card, bank transfer, Swish)',
        'Partial payment management',
        'Refund processing with reason tracking',
        'Payment reminders and follow-ups',
        'Dispute and chargeback handling',
        'Payment gateway integration logs',
        'Transaction search and filtering',
      ]}
    />
  );
};
