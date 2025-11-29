import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const RolesPermissions: React.FC = () => {
  return (
    <ComingSoon
      title="Roles & Permissions"
      description="Define custom roles with granular permission controls for team members."
      features={[
        'Create custom user roles',
        'Granular permission settings per feature',
        'Role templates (Admin, Manager, Support, etc.)',
        'Permission categories (bookings, customers, finance)',
        'View-only vs. edit permissions',
        'Role inheritance and hierarchy',
        'Assign multiple roles to users',
        'Permission audit logs',
        'Role duplication for quick setup',
      ]}
    />
  );
};
