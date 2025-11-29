import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const Invoices: React.FC = () => {
  return (
    <ComingSoon
      title="Invoices"
      description="Professional invoice generation, management, and tracking system."
      features={[
        'Automatic invoice generation from bookings',
        'Customizable invoice templates',
        'Invoice numbering system',
        'Send invoices via email',
        'Track invoice status (draft, sent, paid, overdue)',
        'Payment reminders for overdue invoices',
        'Credit notes and adjustments',
        'Multi-currency support',
        'Export invoices to PDF',
        'VAT/tax calculations',
      ]}
    />
  );
};
