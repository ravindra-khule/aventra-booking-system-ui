import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const CustomerGroups: React.FC = () => {
  return (
    <ComingSoon
      title="Customer Groups"
      description="Segment and organize customers into groups for targeted marketing and personalized experiences."
      features={[
        'Create custom customer segments (VIPs, frequent travelers, etc.)',
        'Auto-segmentation based on booking history',
        'Group-specific pricing and discounts',
        'Bulk actions on customer groups',
        'Group analytics and insights',
        'Export group lists for marketing campaigns',
        'Tag-based organization',
        'Smart groups with dynamic rules',
      ]}
    />
  );
};
