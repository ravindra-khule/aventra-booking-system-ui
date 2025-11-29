import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const EmailSettings: React.FC = () => {
  return (
    <ComingSoon
      title="Email Settings"
      description="Configure email delivery, SMTP settings, and email preferences."
      features={[
        'SMTP server configuration',
        'SendGrid API integration',
        'From email address and name',
        'Reply-to address settings',
        'Email signature customization',
        'Default email templates',
        'Email sending limits and throttling',
        'Bounce handling',
        'Unsubscribe management',
        'Email delivery logs',
        'Test email functionality',
      ]}
    />
  );
};
