/**
 * Role and Permission Service
 * Handles all role and permission related API calls
 * This is a mock service - will be replaced with actual API calls
 */

import {
  Role,
  Permission,
  PermissionFeature,
  PermissionCategory,
  PermissionAction,
  RoleTemplate,
  UserRoleAssignment,
  PermissionAuditLog,
  PermissionCategoryGroup,
  RoleFormData,
} from '../types/role-permission.types';

// Mock data for roles
const MOCK_ROLES: Role[] = [
  {
    id: 'role_admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    isBuiltIn: true,
    isTemplate: false,
    permissions: Object.values(PermissionFeature),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    userCount: 2,
  },
  {
    id: 'role_manager',
    name: 'Manager',
    description: 'Can manage bookings, customers, and generate reports',
    isBuiltIn: true,
    isTemplate: false,
    permissions: [
      PermissionFeature.BOOKING_VIEW,
      PermissionFeature.BOOKING_CREATE,
      PermissionFeature.BOOKING_EDIT,
      PermissionFeature.BOOKING_CONFIRM,
      PermissionFeature.BOOKING_CANCEL,
      PermissionFeature.CUSTOMER_VIEW,
      PermissionFeature.CUSTOMER_EXPORT,
      PermissionFeature.CUSTOMER_COMMUNICATION,
      PermissionFeature.REPORT_VIEW,
      PermissionFeature.REPORT_EXPORT,
      PermissionFeature.TOUR_VIEW,
      PermissionFeature.FINANCE_VIEW,
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    userCount: 1,
  },
  {
    id: 'role_support',
    name: 'Support Agent',
    description: 'Can view bookings and customer information, handle customer communications',
    isBuiltIn: true,
    isTemplate: false,
    permissions: [
      PermissionFeature.BOOKING_VIEW,
      PermissionFeature.CUSTOMER_VIEW,
      PermissionFeature.CUSTOMER_COMMUNICATION,
      PermissionFeature.TOUR_VIEW,
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    userCount: 0,
  },
  {
    id: 'role_accountant',
    name: 'Accountant',
    description: 'Can manage invoices, payments, and financial reports',
    isBuiltIn: true,
    isTemplate: false,
    permissions: [
      PermissionFeature.FINANCE_VIEW,
      PermissionFeature.FINANCE_PAYMENTS,
      PermissionFeature.FINANCE_REFUNDS,
      PermissionFeature.FINANCE_INVOICES,
      PermissionFeature.FINANCE_REPORTS,
      PermissionFeature.REPORT_VIEW,
      PermissionFeature.BOOKING_VIEW,
      PermissionFeature.CUSTOMER_VIEW,
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'system',
    userCount: 0,
  },
];

// Role Templates for quick setup
const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'template_admin',
    name: 'Administrator',
    description: 'Full system access',
    icon: 'Shield',
    permissions: Object.values(PermissionFeature),
    category: 'preset',
  },
  {
    id: 'template_manager',
    name: 'Manager',
    description: 'Manage bookings and customers',
    icon: 'Users',
    permissions: [
      PermissionFeature.BOOKING_VIEW,
      PermissionFeature.BOOKING_CREATE,
      PermissionFeature.BOOKING_EDIT,
      PermissionFeature.BOOKING_CONFIRM,
      PermissionFeature.CUSTOMER_VIEW,
      PermissionFeature.CUSTOMER_EXPORT,
      PermissionFeature.REPORT_VIEW,
      PermissionFeature.TOUR_VIEW,
    ],
    category: 'preset',
  },
  {
    id: 'template_support',
    name: 'Support Agent',
    description: 'Handle customer inquiries and bookings',
    icon: 'Headset',
    permissions: [
      PermissionFeature.BOOKING_VIEW,
      PermissionFeature.CUSTOMER_VIEW,
      PermissionFeature.CUSTOMER_COMMUNICATION,
      PermissionFeature.TOUR_VIEW,
    ],
    category: 'preset',
  },
  {
    id: 'template_finance',
    name: 'Finance',
    description: 'Manage financial operations',
    icon: 'DollarSign',
    permissions: [
      PermissionFeature.FINANCE_VIEW,
      PermissionFeature.FINANCE_PAYMENTS,
      PermissionFeature.FINANCE_INVOICES,
      PermissionFeature.FINANCE_REPORTS,
      PermissionFeature.REPORT_VIEW,
      PermissionFeature.BOOKING_VIEW,
    ],
    category: 'preset',
  },
];

// Comprehensive permission list
const PERMISSIONS: Permission[] = [
  // Bookings
  { id: 'perm_booking_view', feature: PermissionFeature.BOOKING_VIEW, category: PermissionCategory.BOOKINGS, action: PermissionAction.VIEW, label: 'View Bookings', description: 'Can view all bookings and booking details' },
  { id: 'perm_booking_create', feature: PermissionFeature.BOOKING_CREATE, category: PermissionCategory.BOOKINGS, action: PermissionAction.CREATE, label: 'Create Bookings', description: 'Can create new bookings' },
  { id: 'perm_booking_edit', feature: PermissionFeature.BOOKING_EDIT, category: PermissionCategory.BOOKINGS, action: PermissionAction.EDIT, label: 'Edit Bookings', description: 'Can modify existing bookings' },
  { id: 'perm_booking_delete', feature: PermissionFeature.BOOKING_DELETE, category: PermissionCategory.BOOKINGS, action: PermissionAction.DELETE, label: 'Delete Bookings', description: 'Can delete bookings' },
  { id: 'perm_booking_confirm', feature: PermissionFeature.BOOKING_CONFIRM, category: PermissionCategory.BOOKINGS, action: PermissionAction.APPROVE, label: 'Confirm Bookings', description: 'Can confirm and approve bookings' },
  { id: 'perm_booking_cancel', feature: PermissionFeature.BOOKING_CANCEL, category: PermissionCategory.BOOKINGS, action: PermissionAction.DELETE, label: 'Cancel Bookings', description: 'Can cancel bookings' },
  { id: 'perm_booking_invoice', feature: PermissionFeature.BOOKING_INVOICE, category: PermissionCategory.BOOKINGS, action: PermissionAction.EXPORT, label: 'Generate Invoices', description: 'Can generate invoices for bookings' },

  // Customers
  { id: 'perm_customer_view', feature: PermissionFeature.CUSTOMER_VIEW, category: PermissionCategory.CUSTOMERS, action: PermissionAction.VIEW, label: 'View Customers', description: 'Can view customer information' },
  { id: 'perm_customer_create', feature: PermissionFeature.CUSTOMER_CREATE, category: PermissionCategory.CUSTOMERS, action: PermissionAction.CREATE, label: 'Create Customers', description: 'Can create new customer records' },
  { id: 'perm_customer_edit', feature: PermissionFeature.CUSTOMER_EDIT, category: PermissionCategory.CUSTOMERS, action: PermissionAction.EDIT, label: 'Edit Customers', description: 'Can modify customer information' },
  { id: 'perm_customer_delete', feature: PermissionFeature.CUSTOMER_DELETE, category: PermissionCategory.CUSTOMERS, action: PermissionAction.DELETE, label: 'Delete Customers', description: 'Can delete customer records' },
  { id: 'perm_customer_export', feature: PermissionFeature.CUSTOMER_EXPORT, category: PermissionCategory.CUSTOMERS, action: PermissionAction.EXPORT, label: 'Export Customers', description: 'Can export customer data' },
  { id: 'perm_customer_groups', feature: PermissionFeature.CUSTOMER_GROUPS, category: PermissionCategory.CUSTOMERS, action: PermissionAction.EDIT, label: 'Manage Groups', description: 'Can manage customer groups' },
  { id: 'perm_customer_communication', feature: PermissionFeature.CUSTOMER_COMMUNICATION, category: PermissionCategory.CUSTOMERS, action: PermissionAction.EDIT, label: 'Customer Communication', description: 'Can send messages and manage communications' },

  // Finance
  { id: 'perm_finance_view', feature: PermissionFeature.FINANCE_VIEW, category: PermissionCategory.FINANCE, action: PermissionAction.VIEW, label: 'View Finance', description: 'Can view financial data' },
  { id: 'perm_finance_payments', feature: PermissionFeature.FINANCE_PAYMENTS, category: PermissionCategory.FINANCE, action: PermissionAction.EDIT, label: 'Manage Payments', description: 'Can process and manage payments' },
  { id: 'perm_finance_refunds', feature: PermissionFeature.FINANCE_REFUNDS, category: PermissionCategory.FINANCE, action: PermissionAction.EDIT, label: 'Process Refunds', description: 'Can process refunds' },
  { id: 'perm_finance_invoices', feature: PermissionFeature.FINANCE_INVOICES, category: PermissionCategory.FINANCE, action: PermissionAction.EDIT, label: 'Manage Invoices', description: 'Can create and manage invoices' },
  { id: 'perm_finance_reports', feature: PermissionFeature.FINANCE_REPORTS, category: PermissionCategory.FINANCE, action: PermissionAction.VIEW, label: 'Financial Reports', description: 'Can view financial reports' },
  { id: 'perm_finance_fortnox', feature: PermissionFeature.FINANCE_FORTNOX, category: PermissionCategory.FINANCE, action: PermissionAction.EDIT, label: 'Fortnox Integration', description: 'Can manage Fortnox synchronization' },

  // Tours
  { id: 'perm_tour_view', feature: PermissionFeature.TOUR_VIEW, category: PermissionCategory.TOURS, action: PermissionAction.VIEW, label: 'View Tours', description: 'Can view tour information' },
  { id: 'perm_tour_create', feature: PermissionFeature.TOUR_CREATE, category: PermissionCategory.TOURS, action: PermissionAction.CREATE, label: 'Create Tours', description: 'Can create new tours' },
  { id: 'perm_tour_edit', feature: PermissionFeature.TOUR_EDIT, category: PermissionCategory.TOURS, action: PermissionAction.EDIT, label: 'Edit Tours', description: 'Can modify tour information' },
  { id: 'perm_tour_delete', feature: PermissionFeature.TOUR_DELETE, category: PermissionCategory.TOURS, action: PermissionAction.DELETE, label: 'Delete Tours', description: 'Can delete tours' },
  { id: 'perm_tour_pricing', feature: PermissionFeature.TOUR_PRICING, category: PermissionCategory.TOURS, action: PermissionAction.EDIT, label: 'Manage Pricing', description: 'Can set tour pricing and availability' },
  { id: 'perm_tour_addons', feature: PermissionFeature.TOUR_ADDONS, category: PermissionCategory.TOURS, action: PermissionAction.EDIT, label: 'Manage Add-ons', description: 'Can manage tour add-ons' },
  { id: 'perm_tour_itinerary', feature: PermissionFeature.TOUR_ITINERARY, category: PermissionCategory.TOURS, action: PermissionAction.EDIT, label: 'Edit Itinerary', description: 'Can modify tour itineraries' },

  // Marketing
  { id: 'perm_marketing_campaigns', feature: PermissionFeature.MARKETING_CAMPAIGNS, category: PermissionCategory.MARKETING, action: PermissionAction.EDIT, label: 'Manage Campaigns', description: 'Can create and manage marketing campaigns' },
  { id: 'perm_marketing_email', feature: PermissionFeature.MARKETING_EMAIL, category: PermissionCategory.MARKETING, action: PermissionAction.EDIT, label: 'Email Templates', description: 'Can manage email templates' },
  { id: 'perm_marketing_analytics', feature: PermissionFeature.MARKETING_ANALYTICS, category: PermissionCategory.MARKETING, action: PermissionAction.VIEW, label: 'Marketing Analytics', description: 'Can view marketing analytics' },
  { id: 'perm_marketing_promo', feature: PermissionFeature.MARKETING_PROMO, category: PermissionCategory.MARKETING, action: PermissionAction.EDIT, label: 'Promo Codes', description: 'Can manage promotional codes' },

  // Users & Roles
  { id: 'perm_user_manage', feature: PermissionFeature.USER_MANAGE, category: PermissionCategory.USERS, action: PermissionAction.EDIT, label: 'Manage Users', description: 'Can create, edit, and manage user accounts' },
  { id: 'perm_role_manage', feature: PermissionFeature.ROLE_MANAGE, category: PermissionCategory.USERS, action: PermissionAction.EDIT, label: 'Manage Roles', description: 'Can create and modify roles' },
  { id: 'perm_permission_manage', feature: PermissionFeature.PERMISSION_MANAGE, category: PermissionCategory.USERS, action: PermissionAction.EDIT, label: 'Manage Permissions', description: 'Can assign and modify permissions' },

  // Reports
  { id: 'perm_report_view', feature: PermissionFeature.REPORT_VIEW, category: PermissionCategory.REPORTS, action: PermissionAction.VIEW, label: 'View Reports', description: 'Can view reports' },
  { id: 'perm_report_export', feature: PermissionFeature.REPORT_EXPORT, category: PermissionCategory.REPORTS, action: PermissionAction.EXPORT, label: 'Export Reports', description: 'Can export report data' },

  // Settings
  { id: 'perm_settings_company', feature: PermissionFeature.SETTINGS_COMPANY, category: PermissionCategory.SETTINGS, action: PermissionAction.EDIT, label: 'Company Settings', description: 'Can modify company information' },
  { id: 'perm_settings_email', feature: PermissionFeature.SETTINGS_EMAIL, category: PermissionCategory.SETTINGS, action: PermissionAction.EDIT, label: 'Email Settings', description: 'Can configure email settings' },
  { id: 'perm_settings_system', feature: PermissionFeature.SETTINGS_SYSTEM, category: PermissionCategory.SETTINGS, action: PermissionAction.EDIT, label: 'System Settings', description: 'Can modify system settings' },
  { id: 'perm_settings_logs', feature: PermissionFeature.SETTINGS_LOGS, category: PermissionCategory.SETTINGS, action: PermissionAction.VIEW, label: 'System Logs', description: 'Can view system logs' },
];

// Mock audit logs
const MOCK_AUDIT_LOGS: PermissionAuditLog[] = [
  {
    id: 'log_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    action: 'ROLE_CREATED',
    targetType: 'role',
    targetId: 'role_custom_1',
    targetName: 'Custom Role 1',
    changedBy: 'user_1',
    changedByName: 'Admin User',
    details: 'Created new custom role with 15 permissions',
    affectedUsers: 0,
  },
  {
    id: 'log_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    action: 'PERMISSION_GRANTED',
    targetType: 'permission',
    targetId: 'perm_booking_create',
    targetName: 'Create Bookings',
    changedBy: 'user_1',
    changedByName: 'Admin User',
    details: 'Granted permission to role_manager',
    affectedUsers: 1,
  },
  {
    id: 'log_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    action: 'ROLE_ASSIGNED',
    targetType: 'user',
    targetId: 'user_5',
    targetName: 'John Doe',
    changedBy: 'user_1',
    changedByName: 'Admin User',
    details: 'Assigned Manager role to John Doe',
    affectedUsers: 1,
  },
];

// Service class
export class RolePermissionService {
  static async getRoles(): Promise<Role[]> {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_ROLES]), 300);
    });
  }

  static async getRoleById(id: string): Promise<Role | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = MOCK_ROLES.find((r) => r.id === id);
        resolve(role || null);
      }, 200);
    });
  }

  static async createRole(data: RoleFormData): Promise<Role> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole: Role = {
          id: `role_custom_${Date.now()}`,
          name: data.name,
          description: data.description,
          isBuiltIn: false,
          isTemplate: false,
          parentRoleId: data.parentRoleId,
          permissions: data.permissions,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current_user',
          userCount: 0,
        };
        MOCK_ROLES.push(newRole);
        resolve(newRole);
      }, 300);
    });
  }

  static async updateRole(id: string, data: RoleFormData): Promise<Role> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = MOCK_ROLES.find((r) => r.id === id);
        if (role && !role.isBuiltIn) {
          role.name = data.name;
          role.description = data.description;
          role.permissions = data.permissions;
          role.updatedAt = new Date();
        }
        resolve(role!);
      }, 300);
    });
  }

  static async deleteRole(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_ROLES.findIndex((r) => r.id === id);
        if (index !== -1 && !MOCK_ROLES[index].isBuiltIn) {
          MOCK_ROLES.splice(index, 1);
          resolve(true);
        }
        resolve(false);
      }, 300);
    });
  }

  static async duplicateRole(sourceId: string, newName: string): Promise<Role> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sourceRole = MOCK_ROLES.find((r) => r.id === sourceId);
        if (sourceRole) {
          const newRole: Role = {
            id: `role_custom_${Date.now()}`,
            name: newName,
            description: `Copy of ${sourceRole.description}`,
            isBuiltIn: false,
            isTemplate: false,
            permissions: [...sourceRole.permissions],
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'current_user',
            userCount: 0,
          };
          MOCK_ROLES.push(newRole);
          resolve(newRole);
        }
        resolve(null!);
      }, 300);
    });
  }

  static async getRoleTemplates(): Promise<RoleTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...ROLE_TEMPLATES]), 200);
    });
  }

  static async getPermissions(): Promise<Permission[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...PERMISSIONS]), 200);
    });
  }

  static async getPermissionsByCategory(): Promise<PermissionCategoryGroup[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categories = [
          {
            category: PermissionCategory.BOOKINGS,
            label: 'Bookings',
            icon: 'Briefcase',
            description: 'Booking management and operations',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.BOOKINGS),
          },
          {
            category: PermissionCategory.CUSTOMERS,
            label: 'Customers',
            icon: 'Users',
            description: 'Customer management and communications',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.CUSTOMERS),
          },
          {
            category: PermissionCategory.FINANCE,
            label: 'Finance',
            icon: 'DollarSign',
            description: 'Financial operations and reporting',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.FINANCE),
          },
          {
            category: PermissionCategory.TOURS,
            label: 'Tours',
            icon: 'MapPin',
            description: 'Tour management and inventory',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.TOURS),
          },
          {
            category: PermissionCategory.MARKETING,
            label: 'Marketing',
            icon: 'Megaphone',
            description: 'Marketing campaigns and analytics',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.MARKETING),
          },
          {
            category: PermissionCategory.USERS,
            label: 'Users & Roles',
            icon: 'Shield',
            description: 'User and role management',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.USERS),
          },
          {
            category: PermissionCategory.REPORTS,
            label: 'Reports',
            icon: 'BarChart3',
            description: 'Reporting and analytics',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.REPORTS),
          },
          {
            category: PermissionCategory.SETTINGS,
            label: 'Settings',
            icon: 'Settings',
            description: 'System configuration and logs',
            features: PERMISSIONS.filter((p) => p.category === PermissionCategory.SETTINGS),
          },
        ];
        resolve(categories);
      }, 200);
    });
  }

  static async getAuditLogs(limit = 50): Promise<PermissionAuditLog[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_AUDIT_LOGS].slice(0, limit));
      }, 300);
    });
  }

  static async getAuditLogsByRole(roleId: string): Promise<PermissionAuditLog[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const logs = MOCK_AUDIT_LOGS.filter(
          (log) => (log.action.includes('ROLE') && log.targetId === roleId) || log.details.includes(roleId)
        );
        resolve(logs);
      }, 300);
    });
  }
}
