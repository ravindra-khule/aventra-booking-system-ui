import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Lock, Eye } from 'lucide-react';
import { AdminUser, RolePermission, Permission } from '../types/userManagementTypes';

interface RolePermissionsModalProps {
  user: AdminUser;
  onClose: () => void;
}

// Mock role permissions data
const ROLE_PERMISSIONS_DATA: Record<string, RolePermission> = {
  'Super Admin': {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access - Owner level control with all permissions',
    permissions: [
      // User Management
      { id: 'user-create', name: 'Create Users', description: 'Create new admin user accounts', category: 'User Management' },
      { id: 'user-edit', name: 'Edit Users', description: 'Edit existing user accounts and information', category: 'User Management' },
      { id: 'user-delete', name: 'Delete Users', description: 'Delete user accounts permanently', category: 'User Management' },
      { id: 'role-assign', name: 'Assign Roles', description: 'Assign and modify user roles (all roles)', category: 'User Management' },
      { id: 'role-manage', name: 'Manage Roles', description: 'Create and modify role definitions', category: 'User Management' },
      
      // Bookings
      { id: 'booking-view', name: 'View All Bookings', description: 'View all system bookings', category: 'Bookings' },
      { id: 'booking-create', name: 'Create Bookings', description: 'Create new bookings', category: 'Bookings' },
      { id: 'booking-edit', name: 'Edit Bookings', description: 'Modify existing bookings', category: 'Bookings' },
      { id: 'booking-delete', name: 'Delete Bookings', description: 'Delete bookings permanently', category: 'Bookings' },
      { id: 'booking-cancel', name: 'Cancel Bookings', description: 'Cancel bookings with refunds', category: 'Bookings' },
      
      // Customers
      { id: 'customer-view', name: 'View Customers', description: 'View all customer information', category: 'Customers' },
      { id: 'customer-create', name: 'Create Customers', description: 'Create new customer profiles', category: 'Customers' },
      { id: 'customer-edit', name: 'Edit Customers', description: 'Edit customer profiles and data', category: 'Customers' },
      { id: 'customer-delete', name: 'Delete Customers', description: 'Delete customer accounts', category: 'Customers' },
      { id: 'customer-export', name: 'Export Customer Data', description: 'Export customer information', category: 'Customers' },
      
      // Tours & Packages
      { id: 'tour-view', name: 'View Tours', description: 'View all tours and packages', category: 'Tours' },
      { id: 'tour-create', name: 'Create Tours', description: 'Create new tours and packages', category: 'Tours' },
      { id: 'tour-edit', name: 'Edit Tours', description: 'Modify tour details', category: 'Tours' },
      { id: 'tour-delete', name: 'Delete Tours', description: 'Delete tours permanently', category: 'Tours' },
      { id: 'tour-pricing', name: 'Manage Pricing', description: 'Set and modify tour pricing', category: 'Tours' },
      
      // Finance
      { id: 'finance-view', name: 'View Financials', description: 'Access financial data', category: 'Finance' },
      { id: 'finance-invoices', name: 'Manage Invoices', description: 'Create and manage invoices', category: 'Finance' },
      { id: 'finance-payments', name: 'Process Payments', description: 'Handle payment processing', category: 'Finance' },
      { id: 'finance-refunds', name: 'Process Refunds', description: 'Issue customer refunds', category: 'Finance' },
      { id: 'finance-reports', name: 'Financial Reports', description: 'Access and export financial reports', category: 'Finance' },
      
      // Marketing
      { id: 'marketing-campaigns', name: 'Manage Campaigns', description: 'Create and manage marketing campaigns', category: 'Marketing' },
      { id: 'marketing-email', name: 'Send Email Campaigns', description: 'Send marketing emails', category: 'Marketing' },
      { id: 'marketing-analytics', name: 'View Analytics', description: 'Access marketing analytics', category: 'Marketing' },
      { id: 'promo-manage', name: 'Manage Promotions', description: 'Create and manage promotional codes', category: 'Marketing' },
      
      // Settings
      { id: 'settings-company', name: 'Company Settings', description: 'Modify company information', category: 'Settings' },
      { id: 'settings-system', name: 'System Settings', description: 'Configure system settings', category: 'Settings' },
      { id: 'settings-email', name: 'Email Templates', description: 'Manage email templates', category: 'Settings' },
      
      // System & Logs
      { id: 'logs-view', name: 'View System Logs', description: 'Access system activity logs', category: 'System & Logs' },
      { id: 'logs-audit', name: 'Audit Trail', description: 'View complete audit trail', category: 'System & Logs' },
      { id: 'logs-error', name: 'Error Logs', description: 'Access error and debug logs', category: 'System & Logs' },
      { id: 'dev-tools', name: 'Developer Tools', description: 'Access developer tools and APIs', category: 'System & Logs' },
      
      // Reports
      { id: 'reports-view', name: 'View Reports', description: 'Access all reports and analytics', category: 'Reports' },
      { id: 'reports-export', name: 'Export Reports', description: 'Export reports in various formats', category: 'Reports' },
      { id: 'reports-custom', name: 'Custom Reports', description: 'Create custom report templates', category: 'Reports' },
    ],
  },
  Admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Administrative access - Can manage operations and create users',
    permissions: [
      // User Management (Limited)
      { id: 'user-create', name: 'Create Users', description: 'Create Support and Accountant users', category: 'User Management' },
      { id: 'user-edit', name: 'Edit Users', description: 'Edit user accounts', category: 'User Management' },
      { id: 'role-assign', name: 'Assign Roles', description: 'Assign Support and Accountant roles', category: 'User Management' },
      
      // Bookings (Full)
      { id: 'booking-view', name: 'View All Bookings', description: 'View all system bookings', category: 'Bookings' },
      { id: 'booking-create', name: 'Create Bookings', description: 'Create new bookings', category: 'Bookings' },
      { id: 'booking-edit', name: 'Edit Bookings', description: 'Modify existing bookings', category: 'Bookings' },
      { id: 'booking-cancel', name: 'Cancel Bookings', description: 'Cancel bookings', category: 'Bookings' },
      
      // Customers (Full)
      { id: 'customer-view', name: 'View Customers', description: 'View all customer information', category: 'Customers' },
      { id: 'customer-create', name: 'Create Customers', description: 'Create new customer profiles', category: 'Customers' },
      { id: 'customer-edit', name: 'Edit Customers', description: 'Edit customer data', category: 'Customers' },
      { id: 'customer-export', name: 'Export Customer Data', description: 'Export customer information', category: 'Customers' },
      
      // Tours (Full)
      { id: 'tour-view', name: 'View Tours', description: 'View all tours', category: 'Tours' },
      { id: 'tour-create', name: 'Create Tours', description: 'Create new tours', category: 'Tours' },
      { id: 'tour-edit', name: 'Edit Tours', description: 'Modify tour details', category: 'Tours' },
      { id: 'tour-pricing', name: 'Manage Pricing', description: 'Set tour pricing', category: 'Tours' },
      
      // Finance (View & Limited)
      { id: 'finance-view', name: 'View Financials', description: 'Access financial data', category: 'Finance' },
      { id: 'finance-invoices', name: 'Manage Invoices', description: 'Create and edit invoices', category: 'Finance' },
      { id: 'finance-payments', name: 'Process Payments', description: 'Handle payments', category: 'Finance' },
      { id: 'finance-reports', name: 'Financial Reports', description: 'View financial reports', category: 'Finance' },
      
      // Marketing (Full)
      { id: 'marketing-campaigns', name: 'Manage Campaigns', description: 'Create marketing campaigns', category: 'Marketing' },
      { id: 'marketing-email', name: 'Send Email Campaigns', description: 'Send marketing emails', category: 'Marketing' },
      { id: 'promo-manage', name: 'Manage Promotions', description: 'Manage promotional codes', category: 'Marketing' },
      
      // Settings (Limited)
      { id: 'settings-company', name: 'Company Settings', description: 'View and edit company info', category: 'Settings' },
      { id: 'settings-email', name: 'Email Templates', description: 'Manage email templates', category: 'Settings' },
      
      // Reports
      { id: 'reports-view', name: 'View Reports', description: 'Access reports', category: 'Reports' },
      { id: 'reports-export', name: 'Export Reports', description: 'Export reports', category: 'Reports' },
    ],
  },
  Support: {
    id: 'support',
    name: 'Support',
    description: 'Customer support access - Limited to bookings and customers',
    permissions: [
      // Bookings (View & Edit)
      { id: 'booking-view', name: 'View Bookings', description: 'View booking information', category: 'Bookings' },
      { id: 'booking-create', name: 'Create Bookings', description: 'Create new bookings', category: 'Bookings' },
      { id: 'booking-edit', name: 'Edit Bookings', description: 'Modify bookings', category: 'Bookings' },
      { id: 'booking-cancel', name: 'Cancel Bookings', description: 'Cancel bookings', category: 'Bookings' },
      
      // Customers (View & Edit)
      { id: 'customer-view', name: 'View Customers', description: 'View customer information', category: 'Customers' },
      { id: 'customer-create', name: 'Create Customers', description: 'Create customer profiles', category: 'Customers' },
      { id: 'customer-edit', name: 'Edit Customers', description: 'Update customer data', category: 'Customers' },
      { id: 'customer-export', name: 'Export Customer Data', description: 'Export customer lists', category: 'Customers' },
      
      // Tours (View & Update Content)
      { id: 'tour-view', name: 'View Tours', description: 'View tour information', category: 'Tours' },
      { id: 'tour-edit', name: 'Update Tour Content', description: 'Update tour descriptions and itineraries', category: 'Tours' },
      
      // Finance (View Only)
      { id: 'finance-view', name: 'View Invoice Status', description: 'View invoice and payment status', category: 'Finance' },
      
      // Marketing (View Only)
      { id: 'marketing-view', name: 'View Campaigns', description: 'View marketing campaigns', category: 'Marketing' },
      
      // Settings (View Only)
      { id: 'settings-view', name: 'View Company Info', description: 'View company settings', category: 'Settings' },
      
      // Reports (View Only)
      { id: 'reports-view', name: 'View Reports', description: 'View basic reports', category: 'Reports' },
    ],
  },
  Accountant: {
    id: 'accountant',
    name: 'Accountant',
    description: 'Finance access - Full financial operations and reporting',
    permissions: [
      // Bookings (View Only)
      { id: 'booking-view', name: 'View Bookings', description: 'View booking information for financial purposes', category: 'Bookings' },
      
      // Customers (View & Export)
      { id: 'customer-view', name: 'View Customers', description: 'View customer information', category: 'Customers' },
      { id: 'customer-export', name: 'Export Customer Data', description: 'Export customer data for financial records', category: 'Customers' },
      
      // Tours (View Pricing)
      { id: 'tour-view', name: 'View Tours', description: 'View tour information', category: 'Tours' },
      { id: 'tour-pricing', name: 'Manage Pricing', description: 'Set and update tour pricing', category: 'Tours' },
      
      // Finance (Full Access)
      { id: 'finance-view', name: 'View Financials', description: 'Access all financial data', category: 'Finance' },
      { id: 'finance-invoices', name: 'Manage Invoices', description: 'Create, edit, and delete invoices', category: 'Finance' },
      { id: 'finance-payments', name: 'Process Payments', description: 'Handle payment processing', category: 'Finance' },
      { id: 'finance-refunds', name: 'Process Refunds', description: 'Issue customer refunds', category: 'Finance' },
      { id: 'finance-reports', name: 'Financial Reports', description: 'Access and export all financial reports', category: 'Finance' },
      { id: 'finance-fortnox', name: 'Fortnox Integration', description: 'Manage Fortnox accounting integration', category: 'Finance' },
      
      // Marketing (View Analytics)
      { id: 'marketing-analytics', name: 'View Analytics', description: 'View marketing ROI and analytics', category: 'Marketing' },
      
      // Settings (View Only)
      { id: 'settings-view', name: 'View Company Settings', description: 'View company information', category: 'Settings' },
      
      // Reports (Full Financial)
      { id: 'reports-view', name: 'View Reports', description: 'Access financial reports', category: 'Reports' },
      { id: 'reports-export', name: 'Export Reports', description: 'Export financial reports', category: 'Reports' },
      { id: 'reports-custom', name: 'Custom Financial Reports', description: 'Create custom financial reports', category: 'Reports' },
    ],
  },
  Developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Technical access - Full system access plus developer tools and logs',
    permissions: [
      // User Management (View Only)
      { id: 'user-view', name: 'View Users', description: 'View user information', category: 'User Management' },
      { id: 'user-activity', name: 'View User Activity', description: 'Track user activity logs', category: 'User Management' },
      
      // Bookings (Full)
      { id: 'booking-view', name: 'View All Bookings', description: 'View all bookings', category: 'Bookings' },
      { id: 'booking-create', name: 'Create Bookings', description: 'Create bookings', category: 'Bookings' },
      { id: 'booking-edit', name: 'Edit Bookings', description: 'Modify bookings', category: 'Bookings' },
      { id: 'booking-delete', name: 'Delete Bookings', description: 'Delete bookings', category: 'Bookings' },
      
      // Customers (Full)
      { id: 'customer-view', name: 'View Customers', description: 'View customer data', category: 'Customers' },
      { id: 'customer-create', name: 'Create Customers', description: 'Create customers', category: 'Customers' },
      { id: 'customer-edit', name: 'Edit Customers', description: 'Edit customer data', category: 'Customers' },
      { id: 'customer-export', name: 'Export Customer Data', description: 'Export customer information', category: 'Customers' },
      
      // Tours (Full)
      { id: 'tour-view', name: 'View Tours', description: 'View all tours', category: 'Tours' },
      { id: 'tour-create', name: 'Create Tours', description: 'Create tours', category: 'Tours' },
      { id: 'tour-edit', name: 'Edit Tours', description: 'Modify tours', category: 'Tours' },
      { id: 'tour-pricing', name: 'Manage Pricing', description: 'Set pricing', category: 'Tours' },
      
      // Finance (Full)
      { id: 'finance-view', name: 'View Financials', description: 'Access financial data', category: 'Finance' },
      { id: 'finance-invoices', name: 'Manage Invoices', description: 'Manage invoices', category: 'Finance' },
      { id: 'finance-payments', name: 'Process Payments', description: 'Handle payments', category: 'Finance' },
      
      // Marketing (Full)
      { id: 'marketing-campaigns', name: 'Manage Campaigns', description: 'Manage campaigns', category: 'Marketing' },
      { id: 'marketing-email', name: 'Send Email Campaigns', description: 'Send emails', category: 'Marketing' },
      
      // Settings (Full)
      { id: 'settings-company', name: 'Company Settings', description: 'Configure company settings', category: 'Settings' },
      { id: 'settings-system', name: 'System Settings', description: 'Configure system settings', category: 'Settings' },
      { id: 'settings-email', name: 'Email Templates', description: 'Manage email templates', category: 'Settings' },
      
      // System & Logs (Full - Developer Specific)
      { id: 'logs-view', name: 'View System Logs', description: 'Access all system logs', category: 'System & Logs' },
      { id: 'logs-audit', name: 'Audit Trail', description: 'View complete audit trail', category: 'System & Logs' },
      { id: 'logs-error', name: 'Error Logs', description: 'Access error and debug logs', category: 'System & Logs' },
      { id: 'dev-tools', name: 'Developer Tools', description: 'Access developer tools, API, and debugging', category: 'System & Logs' },
      { id: 'integrations', name: 'Manage Integrations', description: 'Configure third-party integrations', category: 'System & Logs' },
      { id: 'system-health', name: 'System Health', description: 'Monitor system health and performance', category: 'System & Logs' },
      
      // Reports (Full)
      { id: 'reports-view', name: 'View Reports', description: 'Access all reports', category: 'Reports' },
      { id: 'reports-export', name: 'Export Reports', description: 'Export reports', category: 'Reports' },
      { id: 'reports-custom', name: 'Custom Reports', description: 'Create custom reports', category: 'Reports' },
    ],
  },
};

export const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({
  user,
  onClose,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Get all permissions from user's roles
  const allPermissions: Map<string, { permission: Permission; roles: string[] }> = new Map();

  user.roles.forEach((role) => {
    const roleData = ROLE_PERMISSIONS_DATA[role];
    if (roleData) {
      roleData.permissions.forEach((permission) => {
        if (!allPermissions.has(permission.id)) {
          allPermissions.set(permission.id, {
            permission,
            roles: [role],
          });
        } else {
          const existing = allPermissions.get(permission.id)!;
          existing.roles.push(role);
        }
      });
    }
  });

  // Group permissions by category
  const groupedPermissions: Map<string, Permission[]> = new Map();
  allPermissions.forEach(({ permission }) => {
    if (!groupedPermissions.has(permission.category)) {
      groupedPermissions.set(permission.category, []);
    }
    groupedPermissions.get(permission.category)!.push(permission);
  });

  const categories = Array.from(groupedPermissions.keys()).sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Role & Permissions
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Permissions for {user.name} - {user.roles.join(', ')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {user.roles.length === 0 ? (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No roles assigned to this user</p>
            </div>
          ) : (
            <>
              {/* Assigned Roles Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-3">
                  Assigned Roles ({user.roles.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* Permissions List */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
                    >
                      <h3 className="font-semibold text-gray-900">{category}</h3>
                      {expandedCategories.has(category) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedCategories.has(category) && (
                      <div className="border-t border-gray-100 divide-y divide-gray-100">
                        {groupedPermissions.get(category)?.map((permission) => (
                          <div key={permission.id} className="p-4">
                            <div className="flex items-start gap-3">
                              <Eye className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {permission.name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <span className="font-semibold">Note:</span> Permissions are
                  managed through role assignments. To modify permissions, edit the
                  user's assigned roles.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
