import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const EmailTemplates: React.FC = () => {
  return (
    <ComingSoon
      title="Email Templates"
      description="Create and manage email templates for automated customer communications."
      features={[
        'Pre-designed email templates for bookings, confirmations, and reminders',
        'Drag-and-drop email editor with rich formatting',
        'Dynamic content placeholders (customer name, booking details, etc.)',
        'Multi-language template support (Swedish & English)',
        'Preview and test email sending',
        'Template versioning and history',
        'Integration with SendGrid for delivery',
      ]}
    />
  );
};
