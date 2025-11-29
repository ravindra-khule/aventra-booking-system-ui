import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const FortnoxIntegration: React.FC = () => {
  return (
    <ComingSoon
      title="Fortnox Integration"
      description="Seamless integration with Fortnox accounting system for automated bookkeeping."
      features={[
        'Automatic sync of bookings to Fortnox',
        'Invoice creation in Fortnox',
        'Customer data synchronization',
        'Payment reconciliation',
        'Chart of accounts mapping',
        'VAT handling and reporting',
        'Product/service sync',
        'Real-time sync status monitoring',
        'Error handling and retry mechanism',
        'Manual sync override options',
      ]}
    />
  );
};
