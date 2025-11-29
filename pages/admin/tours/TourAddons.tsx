import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const TourAddons: React.FC = () => {
  return (
    <ComingSoon
      title="Tour Add-ons"
      description="Manage optional extras and upgrades that customers can add to their tour bookings."
      features={[
        'Create add-on products (insurance, equipment, meals, etc.)',
        'Pricing and availability for each add-on',
        'Link add-ons to specific tours',
        'Mandatory vs. optional add-ons',
        'Add-on categories and grouping',
        'Quantity limits and restrictions',
        'Add-on images and descriptions',
        'Bundle deals and packages',
        'Add-on revenue tracking',
      ]}
    />
  );
};
