import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const UserManagement: React.FC = () => {
  return (
    <ComingSoon
      title="User Management"
      description="Manage admin users, their access levels, and activity monitoring."
      features={[
        'Create and manage admin user accounts',
        'Assign roles and permissions',
        'User activity logs and audit trail',
        'Two-factor authentication (2FA)',
        'Password policies and security',
        'User status management (active/inactive)',
        'Last login tracking',
        'Session management',
        'User invitation system',
        'Bulk user operations',
      ]}
    />
  );
};
