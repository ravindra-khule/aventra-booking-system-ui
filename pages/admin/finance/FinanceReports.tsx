import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const FinanceReports: React.FC = () => {
  return (
    <ComingSoon
      title="Financial Reports"
      description="Comprehensive financial reporting and analytics for business insights."
      features={[
        'Revenue reports by tour, period, and source',
        'Profit and loss statements',
        'Cash flow analysis',
        'Sales forecasting',
        'Tax reports and summaries',
        'Commission tracking',
        'Payment method breakdown',
        'Refund and cancellation analysis',
        'Custom date range reports',
        'Export to Excel/CSV format',
        'Scheduled email reports',
      ]}
    />
  );
};
