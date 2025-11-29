import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const CompanySettings: React.FC = () => {
  return (
    <ComingSoon
      title="Company Information"
      description="Manage your company profile, contact details, and business settings."
      features={[
        'Company name and logo',
        'Contact information (address, phone, email)',
        'Business registration details',
        'VAT/tax ID numbers',
        'Banking information',
        'Social media links',
        'Business hours',
        'Company description and about text',
        'Multi-language company information',
      ]}
    />
  );
};
