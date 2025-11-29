import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const TourManagement: React.FC = () => {
  return (
    <ComingSoon
      title="Tour Management"
      description="Complete tour administration with scheduling, capacity management, and content editing."
      features={[
        'Create and edit tour packages',
        'Manage tour descriptions, images, and details',
        'Set tour capacity and availability',
        'Multi-language tour content',
        'Tour status management (active/inactive/draft)',
        'Duplicate tours for quick setup',
        'Tour categories and tags',
        'Featured tours and highlighting',
        'SEO optimization for tour pages',
      ]}
    />
  );
};
