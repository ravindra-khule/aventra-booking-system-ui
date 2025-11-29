import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const CampaignManager: React.FC = () => {
  return (
    <ComingSoon
      title="Campaign Manager"
      description="Plan, execute, and track marketing campaigns to boost tour bookings."
      features={[
        'Create multi-channel marketing campaigns (email, SMS, social)',
        'Segment customer audiences based on booking history and preferences',
        'Schedule automated campaign delivery',
        'Track campaign performance with real-time analytics',
        'A/B testing for email subject lines and content',
        'Campaign templates for seasonal promotions',
        'ROI tracking and conversion metrics',
        'Integration with promo codes for campaign-specific discounts',
      ]}
    />
  );
};
