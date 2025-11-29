import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const PricingAvailability: React.FC = () => {
  return (
    <ComingSoon
      title="Pricing & Availability"
      description="Dynamic pricing management and real-time availability tracking for all tours."
      features={[
        'Seasonal pricing configurations',
        'Dynamic pricing based on demand',
        'Group discounts and tier pricing',
        'Early bird and last-minute pricing',
        'Block out dates and blacklist periods',
        'Minimum/maximum capacity settings',
        'Price calendars with visual indicators',
        'Bulk pricing updates',
        'Price history and analytics',
      ]}
    />
  );
};
