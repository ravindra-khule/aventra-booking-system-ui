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
    description: 'Full system access with all permissions',
    permissions: [
      {
        id: 'user-create',
        name: 'Create Users',
        description: 'Create new admin user accounts',
        category: 'User Management',
      },
      {
        id: 'user-edit',
        name: 'Edit Users',
        description: 'Edit existing user accounts and information',
        category: 'User Management',
      },
      {
        id: 'user-delete',
        name: 'Delete Users',
        description: 'Delete user accounts permanently',
        category: 'User Management',
      },
      {
        id: 'role-assign',
        name: 'Assign Roles',
        description: 'Assign and modify user roles',
        category: 'User Management',
      },
      {
        id: 'booking-view',
        name: 'View All Bookings',
        description: 'View all system bookings',
        category: 'Bookings',
      },
      {
        id: 'booking-create',
        name: 'Create Bookings',
        description: 'Create new bookings on behalf of customers',
        category: 'Bookings',
      },
      {
        id: 'booking-edit',
        name: 'Edit Bookings',
        description: 'Modify existing bookings',
        category: 'Bookings',
      },
      {
        id: 'booking-cancel',
        name: 'Cancel Bookings',
        description: 'Cancel bookings with full refunds',
        category: 'Bookings',
      },
      {
        id: 'customer-view',
        name: 'View Customers',
        description: 'View all customer information',
        category: 'Customers',
      },
      {
        id: 'customer-edit',
        name: 'Edit Customers',
        description: 'Edit customer profiles and data',
        category: 'Customers',
      },
      {
        id: 'tour-manage',
        name: 'Manage Tours',
        description: 'Create, edit, and delete tours',
        category: 'Tours',
      },
      {
        id: 'promo-manage',
        name: 'Manage Promotions',
        description: 'Create and manage promotional codes',
        category: 'Marketing',
      },
      {
        id: 'reports-view',
        name: 'View Reports',
        description: 'Access all reports and analytics',
        category: 'Reports',
      },
      {
        id: 'settings-configure',
        name: 'Configure Settings',
        description: 'Modify system settings and configuration',
        category: 'Settings',
      },
    ],
  },
  Admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Administrative access with limited restrictions',
    permissions: [
      {
        id: 'booking-view',
        name: 'View All Bookings',
        description: 'View all system bookings',
        category: 'Bookings',
      },
      {
        id: 'booking-create',
        name: 'Create Bookings',
        description: 'Create new bookings on behalf of customers',
        category: 'Bookings',
      },
      {
        id: 'booking-edit',
        name: 'Edit Bookings',
        description: 'Modify existing bookings',
        category: 'Bookings',
      },
      {
        id: 'booking-cancel',
        name: 'Cancel Bookings',
        description: 'Cancel bookings with full refunds',
        category: 'Bookings',
      },
      {
        id: 'customer-view',
        name: 'View Customers',
        description: 'View all customer information',
        category: 'Customers',
      },
      {
        id: 'customer-edit',
        name: 'Edit Customers',
        description: 'Edit customer profiles and data',
        category: 'Customers',
      },
      {
        id: 'tour-manage',
        name: 'Manage Tours',
        description: 'Create, edit, and delete tours',
        category: 'Tours',
      },
      {
        id: 'promo-manage',
        name: 'Manage Promotions',
        description: 'Create and manage promotional codes',
        category: 'Marketing',
      },
      {
        id: 'reports-view',
        name: 'View Reports',
        description: 'Access all reports and analytics',
        category: 'Reports',
      },
    ],
  },
  Manager: {
    id: 'manager',
    name: 'Manager',
    description: 'Operational management access',
    permissions: [
      {
        id: 'booking-view',
        name: 'View All Bookings',
        description: 'View all system bookings',
        category: 'Bookings',
      },
      {
        id: 'booking-create',
        name: 'Create Bookings',
        description: 'Create new bookings on behalf of customers',
        category: 'Bookings',
      },
      {
        id: 'booking-edit',
        name: 'Edit Bookings',
        description: 'Modify existing bookings',
        category: 'Bookings',
      },
      {
        id: 'customer-view',
        name: 'View Customers',
        description: 'View all customer information',
        category: 'Customers',
      },
      {
        id: 'reports-view',
        name: 'View Reports',
        description: 'Access all reports and analytics',
        category: 'Reports',
      },
    ],
  },
  Support: {
    id: 'support',
    name: 'Support',
    description: 'Customer support access',
    permissions: [
      {
        id: 'booking-view',
        name: 'View Bookings',
        description: 'View booking information for support purposes',
        category: 'Bookings',
      },
      {
        id: 'customer-view',
        name: 'View Customers',
        description: 'View customer information',
        category: 'Customers',
      },
      {
        id: 'support-ticket',
        name: 'Manage Support Tickets',
        description: 'Create and manage customer support tickets',
        category: 'Support',
      },
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
