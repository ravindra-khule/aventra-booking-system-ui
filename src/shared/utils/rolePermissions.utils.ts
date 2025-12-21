/**
 * Role Permission Utility Service
 * Helper functions for role-based access control
 */

import { UserRole } from '../types/common.types';
import { ROLE_CONFIGS, RolePermissions, hasPermission, canCreateRole, getRoleInfo } from '../config/rolePermissions.config';

/**
 * Check if user has permission for specific action
 */
export const checkPermission = (
  userRole: UserRole, 
  permission: keyof RolePermissions
): boolean => {
  return hasPermission(userRole, permission);
};

/**
 * Check if user can create a specific role
 */
export const checkCanCreateRole = (
  currentUserRole: UserRole, 
  targetRole: UserRole
): boolean => {
  return canCreateRole(currentUserRole, targetRole);
};

/**
 * Get available roles for current user to assign
 */
export const getAvailableRolesForUser = (currentUserRole: UserRole): UserRole[] => {
  const roleConfig = ROLE_CONFIGS[currentUserRole];
  return roleConfig?.canCreateRoles || [];
};

/**
 * Get role display information
 */
export const getRoleDisplayInfo = (role: UserRole) => {
  return getRoleInfo(role);
};

/**
 * Get role badge color classes
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  const roleInfo = getRoleInfo(role);
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    slate: 'bg-slate-100 text-slate-800 border-slate-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return colorMap[roleInfo.color] || colorMap.gray;
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (
  userRole: UserRole,
  permissions: (keyof RolePermissions)[]
): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (
  userRole: UserRole,
  permissions: (keyof RolePermissions)[]
): boolean => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

/**
 * Get all permissions for a role grouped by category
 */
export const getPermissionsByCategory = (userRole: UserRole) => {
  const roleConfig = ROLE_CONFIGS[userRole];
  if (!roleConfig) return {};

  const permissions = roleConfig.permissions;
  
  return {
    bookings: {
      label: 'Bookings Management',
      permissions: {
        view: permissions.viewBookings,
        create: permissions.createBookings,
        edit: permissions.editBookings,
        delete: permissions.deleteBookings,
        confirm: permissions.confirmBookings,
        cancel: permissions.cancelBookings,
      }
    },
    customers: {
      label: 'Customer Management',
      permissions: {
        view: permissions.viewCustomers,
        create: permissions.createCustomers,
        edit: permissions.editCustomers,
        delete: permissions.deleteCustomers,
        export: permissions.exportCustomers,
        manageGroups: permissions.manageCustomerGroups,
        sendCommunications: permissions.sendCustomerCommunications,
      }
    },
    tours: {
      label: 'Tours & Packages',
      permissions: {
        view: permissions.viewTours,
        create: permissions.createTours,
        edit: permissions.editTours,
        delete: permissions.deleteTours,
        managePricing: permissions.managePricing,
        manageAddons: permissions.manageAddons,
        manageItinerary: permissions.manageItinerary,
      }
    },
    finance: {
      label: 'Financial Operations',
      permissions: {
        view: permissions.viewFinancials,
        createInvoices: permissions.createInvoices,
        editInvoices: permissions.editInvoices,
        deleteInvoices: permissions.deleteInvoices,
        processPayments: permissions.processPayments,
        processRefunds: permissions.processRefunds,
        viewReports: permissions.viewFinancialReports,
        exportReports: permissions.exportFinancialReports,
        manageFortnox: permissions.manageFortnoxIntegration,
      }
    },
    marketing: {
      label: 'Marketing & Campaigns',
      permissions: {
        view: permissions.viewMarketingCampaigns,
        create: permissions.createMarketingCampaigns,
        edit: permissions.editMarketingCampaigns,
        delete: permissions.deleteMarketingCampaigns,
        sendEmails: permissions.sendEmailCampaigns,
        viewAnalytics: permissions.viewMarketingAnalytics,
        managePromoCodes: permissions.managePromoCodes,
      }
    },
    users: {
      label: 'User Management',
      permissions: {
        view: permissions.viewUsers,
        create: permissions.createUsers,
        edit: permissions.editUsers,
        delete: permissions.deleteUsers,
        manageRoles: permissions.manageRoles,
        viewActivity: permissions.viewUserActivity,
      }
    },
    settings: {
      label: 'System Settings',
      permissions: {
        viewCompany: permissions.viewCompanySettings,
        editCompany: permissions.editCompanySettings,
        viewSystem: permissions.viewSystemSettings,
        editSystem: permissions.editSystemSettings,
        viewTemplates: permissions.viewEmailTemplates,
        editTemplates: permissions.editEmailTemplates,
      }
    },
    system: {
      label: 'System & Logs',
      permissions: {
        viewLogs: permissions.viewSystemLogs,
        viewAudit: permissions.viewAuditTrail,
        viewErrors: permissions.viewErrorLogs,
        developerTools: permissions.accessDeveloperTools,
        manageIntegrations: permissions.manageIntegrations,
        viewHealth: permissions.viewSystemHealth,
      }
    },
    reports: {
      label: 'Reports & Analytics',
      permissions: {
        view: permissions.viewReports,
        export: permissions.exportReports,
        createCustom: permissions.createCustomReports,
      }
    }
  };
};

/**
 * Format role name for display
 */
export const formatRoleName = (role: UserRole): string => {
  const roleInfo = getRoleInfo(role);
  return roleInfo?.label || role;
};

/**
 * Get role hierarchy level
 */
export const getRoleLevel = (role: UserRole): number => {
  const roleInfo = getRoleInfo(role);
  return roleInfo?.level || 0;
};

/**
 * Compare two roles by hierarchy
 * Returns: 1 if role1 > role2, -1 if role1 < role2, 0 if equal
 */
export const compareRoles = (role1: UserRole, role2: UserRole): number => {
  const level1 = getRoleLevel(role1);
  const level2 = getRoleLevel(role2);
  
  if (level1 > level2) return 1;
  if (level1 < level2) return -1;
  return 0;
};

/**
 * Check if a role is administrative (Super Admin or Admin)
 */
export const isAdministrativeRole = (role: UserRole): boolean => {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
};

/**
 * Check if a role has technical access
 */
export const hasTechnicalAccess = (role: UserRole): boolean => {
  return role === UserRole.SUPER_ADMIN || role === UserRole.DEVELOPER;
};

/**
 * Check if a role has financial access
 */
export const hasFinancialAccess = (role: UserRole): boolean => {
  return hasPermission(role, 'viewFinancials');
};

export default {
  checkPermission,
  checkCanCreateRole,
  getAvailableRolesForUser,
  getRoleDisplayInfo,
  getRoleBadgeColor,
  hasAnyPermission,
  hasAllPermissions,
  getPermissionsByCategory,
  formatRoleName,
  getRoleLevel,
  compareRoles,
  isAdministrativeRole,
  hasTechnicalAccess,
  hasFinancialAccess,
};
