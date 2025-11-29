import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const CommunicationLogs: React.FC = () => {
  return (
    <ComingSoon
      title="Communication Logs"
      description="Track all customer communications in one centralized location with full history and context."
      features={[
        'Complete history of emails, SMS, and calls',
        'Search and filter communication logs',
        'Customer interaction timeline',
        'Email/SMS templates integration',
        'Automated communication tracking',
        'Response time analytics',
        'Notes and internal comments',
        'Attachment storage and management',
        'Export communication history',
      ]}
    />
  );
};
