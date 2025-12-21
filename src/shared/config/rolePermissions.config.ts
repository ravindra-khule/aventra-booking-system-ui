/**
 * Role Permissions Configuration
 * Defines the hierarchical role structure and permissions for the booking system
 */

import { UserRole } from '../types/common.types';

export interface RoleConfig {
  key: UserRole;
  label: string;
  description: string;
  color: string; // Tailwind color classes
  icon: string;
  level: number; // Hierarchy level (higher = more access)
  canCreateRoles: UserRole[]; // Roles this role can create
  permissions: RolePermissions;
}

export interface RolePermissions {
  // Bookings
  viewBookings: boolean;
  createBookings: boolean;
  editBookings: boolean;
  deleteBookings: boolean;
  confirmBookings: boolean;
  cancelBookings: boolean;
  
  // Customers
  viewCustomers: boolean;
  createCustomers: boolean;
  editCustomers: boolean;
  deleteCustomers: boolean;
  exportCustomers: boolean;
  manageCustomerGroups: boolean;
  sendCustomerCommunications: boolean;
  
  // Tours/Packages
  viewTours: boolean;
  createTours: boolean;
  editTours: boolean;
  deleteTours: boolean;
  managePricing: boolean;
  manageAddons: boolean;
  manageItinerary: boolean;
  
  // Finance
  viewFinancials: boolean;
  createInvoices: boolean;
  editInvoices: boolean;
  deleteInvoices: boolean;
  processPayments: boolean;
  processRefunds: boolean;
  viewFinancialReports: boolean;
  exportFinancialReports: boolean;
  manageFortnoxIntegration: boolean;
  
  // Marketing
  viewMarketingCampaigns: boolean;
  createMarketingCampaigns: boolean;
  editMarketingCampaigns: boolean;
  deleteMarketingCampaigns: boolean;
  sendEmailCampaigns: boolean;
  viewMarketingAnalytics: boolean;
  managePromoCodes: boolean;
  
  // User Management
  viewUsers: boolean;
  createUsers: boolean;
  editUsers: boolean;
  deleteUsers: boolean;
  manageRoles: boolean;
  viewUserActivity: boolean;
  
  // Settings
  viewCompanySettings: boolean;
  editCompanySettings: boolean;
  viewSystemSettings: boolean;
  editSystemSettings: boolean;
  viewEmailTemplates: boolean;
  editEmailTemplates: boolean;
  
  // System & Logs
  viewSystemLogs: boolean;
  viewAuditTrail: boolean;
  viewErrorLogs: boolean;
  accessDeveloperTools: boolean;
  manageIntegrations: boolean;
  viewSystemHealth: boolean;
  
  // Reports
  viewReports: boolean;
  exportReports: boolean;
  createCustomReports: boolean;
}

/**
 * Role Configurations with detailed permissions
 */
export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  [UserRole.SUPER_ADMIN]: {
    key: UserRole.SUPER_ADMIN,
    label: 'Super Admin',
    description: 'Full system access - Owner of the booking system with complete control',
    color: 'purple',
    icon: 'Crown',
    level: 100,
    canCreateRoles: [UserRole.ADMIN, UserRole.SUPPORT, UserRole.ACCOUNTANT, UserRole.DEVELOPER],
    permissions: {
      // Bookings - Full Access
      viewBookings: true,
      createBookings: true,
      editBookings: true,
      deleteBookings: true,
      confirmBookings: true,
      cancelBookings: true,
      
      // Customers - Full Access
      viewCustomers: true,
      createCustomers: true,
      editCustomers: true,
      deleteCustomers: true,
      exportCustomers: true,
      manageCustomerGroups: true,
      sendCustomerCommunications: true,
      
      // Tours - Full Access
      viewTours: true,
      createTours: true,
      editTours: true,
      deleteTours: true,
      managePricing: true,
      manageAddons: true,
      manageItinerary: true,
      
      // Finance - Full Access
      viewFinancials: true,
      createInvoices: true,
      editInvoices: true,
      deleteInvoices: true,
      processPayments: true,
      processRefunds: true,
      viewFinancialReports: true,
      exportFinancialReports: true,
      manageFortnoxIntegration: true,
      
      // Marketing - Full Access
      viewMarketingCampaigns: true,
      createMarketingCampaigns: true,
      editMarketingCampaigns: true,
      deleteMarketingCampaigns: true,
      sendEmailCampaigns: true,
      viewMarketingAnalytics: true,
      managePromoCodes: true,
      
      // User Management - Full Access
      viewUsers: true,
      createUsers: true,
      editUsers: true,
      deleteUsers: true,
      manageRoles: true,
      viewUserActivity: true,
      
      // Settings - Full Access
      viewCompanySettings: true,
      editCompanySettings: true,
      viewSystemSettings: true,
      editSystemSettings: true,
      viewEmailTemplates: true,
      editEmailTemplates: true,
      
      // System & Logs - Full Access
      viewSystemLogs: true,
      viewAuditTrail: true,
      viewErrorLogs: true,
      accessDeveloperTools: true,
      manageIntegrations: true,
      viewSystemHealth: true,
      
      // Reports - Full Access
      viewReports: true,
      exportReports: true,
      createCustomReports: true,
    }
  },
  
  [UserRole.ADMIN]: {
    key: UserRole.ADMIN,
    label: 'Admin',
    description: 'Administrative access - Can manage operations, users, and most system features',
    color: 'blue',
    icon: 'Shield',
    level: 80,
    canCreateRoles: [UserRole.SUPPORT, UserRole.ACCOUNTANT],
    permissions: {
      // Bookings - Full Access
      viewBookings: true,
      createBookings: true,
      editBookings: true,
      deleteBookings: true,
      confirmBookings: true,
      cancelBookings: true,
      
      // Customers - Full Access
      viewCustomers: true,
      createCustomers: true,
      editCustomers: true,
      deleteCustomers: true,
      exportCustomers: true,
      manageCustomerGroups: true,
      sendCustomerCommunications: true,
      
      // Tours - Full Access
      viewTours: true,
      createTours: true,
      editTours: true,
      deleteTours: true,
      managePricing: true,
      manageAddons: true,
      manageItinerary: true,
      
      // Finance - View & Create Only
      viewFinancials: true,
      createInvoices: true,
      editInvoices: true,
      deleteInvoices: false,
      processPayments: true,
      processRefunds: false,
      viewFinancialReports: true,
      exportFinancialReports: true,
      manageFortnoxIntegration: false,
      
      // Marketing - Full Access
      viewMarketingCampaigns: true,
      createMarketingCampaigns: true,
      editMarketingCampaigns: true,
      deleteMarketingCampaigns: true,
      sendEmailCampaigns: true,
      viewMarketingAnalytics: true,
      managePromoCodes: true,
      
      // User Management - Limited
      viewUsers: true,
      createUsers: true,
      editUsers: true,
      deleteUsers: false,
      manageRoles: false,
      viewUserActivity: true,
      
      // Settings - View & Edit
      viewCompanySettings: true,
      editCompanySettings: true,
      viewSystemSettings: true,
      editSystemSettings: false,
      viewEmailTemplates: true,
      editEmailTemplates: true,
      
      // System & Logs - View Only
      viewSystemLogs: true,
      viewAuditTrail: true,
      viewErrorLogs: false,
      accessDeveloperTools: false,
      manageIntegrations: false,
      viewSystemHealth: true,
      
      // Reports - Full Access
      viewReports: true,
      exportReports: true,
      createCustomReports: true,
    }
  },
  
  [UserRole.SUPPORT]: {
    key: UserRole.SUPPORT,
    label: 'Support',
    description: 'Customer support access - Limited to bookings, customers, and content updates',
    color: 'green',
    icon: 'Headphones',
    level: 50,
    canCreateRoles: [],
    permissions: {
      // Bookings - View & Edit
      viewBookings: true,
      createBookings: true,
      editBookings: true,
      deleteBookings: false,
      confirmBookings: true,
      cancelBookings: true,
      
      // Customers - View & Edit
      viewCustomers: true,
      createCustomers: true,
      editCustomers: true,
      deleteCustomers: false,
      exportCustomers: true,
      manageCustomerGroups: false,
      sendCustomerCommunications: true,
      
      // Tours - View & Edit Limited
      viewTours: true,
      createTours: false,
      editTours: true,
      deleteTours: false,
      managePricing: false,
      manageAddons: false,
      manageItinerary: true,
      
      // Finance - View Only
      viewFinancials: true,
      createInvoices: false,
      editInvoices: false,
      deleteInvoices: false,
      processPayments: false,
      processRefunds: false,
      viewFinancialReports: false,
      exportFinancialReports: false,
      manageFortnoxIntegration: false,
      
      // Marketing - View Only
      viewMarketingCampaigns: true,
      createMarketingCampaigns: false,
      editMarketingCampaigns: false,
      deleteMarketingCampaigns: false,
      sendEmailCampaigns: false,
      viewMarketingAnalytics: false,
      managePromoCodes: false,
      
      // User Management - None
      viewUsers: false,
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      manageRoles: false,
      viewUserActivity: false,
      
      // Settings - View Only
      viewCompanySettings: true,
      editCompanySettings: false,
      viewSystemSettings: false,
      editSystemSettings: false,
      viewEmailTemplates: true,
      editEmailTemplates: false,
      
      // System & Logs - None
      viewSystemLogs: false,
      viewAuditTrail: false,
      viewErrorLogs: false,
      accessDeveloperTools: false,
      manageIntegrations: false,
      viewSystemHealth: false,
      
      // Reports - View Only
      viewReports: true,
      exportReports: false,
      createCustomReports: false,
    }
  },
  
  [UserRole.ACCOUNTANT]: {
    key: UserRole.ACCOUNTANT,
    label: 'Accountant',
    description: 'Finance access - Full financial operations and reporting capabilities',
    color: 'amber',
    icon: 'Calculator',
    level: 60,
    canCreateRoles: [],
    permissions: {
      // Bookings - View Only
      viewBookings: true,
      createBookings: false,
      editBookings: false,
      deleteBookings: false,
      confirmBookings: false,
      cancelBookings: false,
      
      // Customers - View Only
      viewCustomers: true,
      createCustomers: false,
      editCustomers: false,
      deleteCustomers: false,
      exportCustomers: true,
      manageCustomerGroups: false,
      sendCustomerCommunications: false,
      
      // Tours - View Pricing
      viewTours: true,
      createTours: false,
      editTours: false,
      deleteTours: false,
      managePricing: true,
      manageAddons: false,
      manageItinerary: false,
      
      // Finance - Full Access
      viewFinancials: true,
      createInvoices: true,
      editInvoices: true,
      deleteInvoices: true,
      processPayments: true,
      processRefunds: true,
      viewFinancialReports: true,
      exportFinancialReports: true,
      manageFortnoxIntegration: true,
      
      // Marketing - View Analytics
      viewMarketingCampaigns: true,
      createMarketingCampaigns: false,
      editMarketingCampaigns: false,
      deleteMarketingCampaigns: false,
      sendEmailCampaigns: false,
      viewMarketingAnalytics: true,
      managePromoCodes: false,
      
      // User Management - None
      viewUsers: false,
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      manageRoles: false,
      viewUserActivity: false,
      
      // Settings - View Only
      viewCompanySettings: true,
      editCompanySettings: false,
      viewSystemSettings: false,
      editSystemSettings: false,
      viewEmailTemplates: false,
      editEmailTemplates: false,
      
      // System & Logs - None
      viewSystemLogs: false,
      viewAuditTrail: false,
      viewErrorLogs: false,
      accessDeveloperTools: false,
      manageIntegrations: false,
      viewSystemHealth: false,
      
      // Reports - Financial Reports
      viewReports: true,
      exportReports: true,
      createCustomReports: true,
    }
  },
  
  [UserRole.DEVELOPER]: {
    key: UserRole.DEVELOPER,
    label: 'Developer',
    description: 'Technical access - Full system access plus developer tools, logs, and debugging',
    color: 'slate',
    icon: 'Code',
    level: 90,
    canCreateRoles: [],
    permissions: {
      // Bookings - Full Access
      viewBookings: true,
      createBookings: true,
      editBookings: true,
      deleteBookings: true,
      confirmBookings: true,
      cancelBookings: true,
      
      // Customers - Full Access
      viewCustomers: true,
      createCustomers: true,
      editCustomers: true,
      deleteCustomers: true,
      exportCustomers: true,
      manageCustomerGroups: true,
      sendCustomerCommunications: true,
      
      // Tours - Full Access
      viewTours: true,
      createTours: true,
      editTours: true,
      deleteTours: true,
      managePricing: true,
      manageAddons: true,
      manageItinerary: true,
      
      // Finance - Full Access
      viewFinancials: true,
      createInvoices: true,
      editInvoices: true,
      deleteInvoices: true,
      processPayments: true,
      processRefunds: true,
      viewFinancialReports: true,
      exportFinancialReports: true,
      manageFortnoxIntegration: true,
      
      // Marketing - Full Access
      viewMarketingCampaigns: true,
      createMarketingCampaigns: true,
      editMarketingCampaigns: true,
      deleteMarketingCampaigns: true,
      sendEmailCampaigns: true,
      viewMarketingAnalytics: true,
      managePromoCodes: true,
      
      // User Management - View Only (cannot create/edit users)
      viewUsers: true,
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      manageRoles: false,
      viewUserActivity: true,
      
      // Settings - Full Access
      viewCompanySettings: true,
      editCompanySettings: true,
      viewSystemSettings: true,
      editSystemSettings: true,
      viewEmailTemplates: true,
      editEmailTemplates: true,
      
      // System & Logs - Full Access (Developer Specific)
      viewSystemLogs: true,
      viewAuditTrail: true,
      viewErrorLogs: true,
      accessDeveloperTools: true,
      manageIntegrations: true,
      viewSystemHealth: true,
      
      // Reports - Full Access
      viewReports: true,
      exportReports: true,
      createCustomReports: true,
    }
  },
  
  // Legacy roles for backward compatibility
  [UserRole.GUEST]: {
    key: UserRole.GUEST,
    label: 'Guest',
    description: 'Guest user with minimal access',
    color: 'gray',
    icon: 'User',
    level: 0,
    canCreateRoles: [],
    permissions: {
      viewBookings: false,
      createBookings: false,
      editBookings: false,
      deleteBookings: false,
      confirmBookings: false,
      cancelBookings: false,
      viewCustomers: false,
      createCustomers: false,
      editCustomers: false,
      deleteCustomers: false,
      exportCustomers: false,
      manageCustomerGroups: false,
      sendCustomerCommunications: false,
      viewTours: true,
      createTours: false,
      editTours: false,
      deleteTours: false,
      managePricing: false,
      manageAddons: false,
      manageItinerary: false,
      viewFinancials: false,
      createInvoices: false,
      editInvoices: false,
      deleteInvoices: false,
      processPayments: false,
      processRefunds: false,
      viewFinancialReports: false,
      exportFinancialReports: false,
      manageFortnoxIntegration: false,
      viewMarketingCampaigns: false,
      createMarketingCampaigns: false,
      editMarketingCampaigns: false,
      deleteMarketingCampaigns: false,
      sendEmailCampaigns: false,
      viewMarketingAnalytics: false,
      managePromoCodes: false,
      viewUsers: false,
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      manageRoles: false,
      viewUserActivity: false,
      viewCompanySettings: false,
      editCompanySettings: false,
      viewSystemSettings: false,
      editSystemSettings: false,
      viewEmailTemplates: false,
      editEmailTemplates: false,
      viewSystemLogs: false,
      viewAuditTrail: false,
      viewErrorLogs: false,
      accessDeveloperTools: false,
      manageIntegrations: false,
      viewSystemHealth: false,
      viewReports: false,
      exportReports: false,
      createCustomReports: false,
    }
  },
  
  [UserRole.CUSTOMER]: {
    key: UserRole.CUSTOMER,
    label: 'Customer',
    description: 'Customer user with booking access',
    color: 'gray',
    icon: 'User',
    level: 10,
    canCreateRoles: [],
    permissions: {
      viewBookings: true,
      createBookings: true,
      editBookings: false,
      deleteBookings: false,
      confirmBookings: false,
      cancelBookings: true,
      viewCustomers: false,
      createCustomers: false,
      editCustomers: false,
      deleteCustomers: false,
      exportCustomers: false,
      manageCustomerGroups: false,
      sendCustomerCommunications: false,
      viewTours: true,
      createTours: false,
      editTours: false,
      deleteTours: false,
      managePricing: false,
      manageAddons: false,
      manageItinerary: false,
      viewFinancials: false,
      createInvoices: false,
      editInvoices: false,
      deleteInvoices: false,
      processPayments: true,
      processRefunds: false,
      viewFinancialReports: false,
      exportFinancialReports: false,
      manageFortnoxIntegration: false,
      viewMarketingCampaigns: false,
      createMarketingCampaigns: false,
      editMarketingCampaigns: false,
      deleteMarketingCampaigns: false,
      sendEmailCampaigns: false,
      viewMarketingAnalytics: false,
      managePromoCodes: false,
      viewUsers: false,
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      manageRoles: false,
      viewUserActivity: false,
      viewCompanySettings: false,
      editCompanySettings: false,
      viewSystemSettings: false,
      editSystemSettings: false,
      viewEmailTemplates: false,
      editEmailTemplates: false,
      viewSystemLogs: false,
      viewAuditTrail: false,
      viewErrorLogs: false,
      accessDeveloperTools: false,
      manageIntegrations: false,
      viewSystemHealth: false,
      viewReports: false,
      exportReports: false,
      createCustomReports: false,
    }
  }
};

/**
 * Helper function to check if a user has a specific permission
 */
export const hasPermission = (userRole: UserRole, permission: keyof RolePermissions): boolean => {
  const roleConfig = ROLE_CONFIGS[userRole];
  return roleConfig?.permissions[permission] || false;
};

/**
 * Helper function to check if a role can create another role
 */
export const canCreateRole = (userRole: UserRole, targetRole: UserRole): boolean => {
  const roleConfig = ROLE_CONFIGS[userRole];
  return roleConfig?.canCreateRoles.includes(targetRole) || false;
};

/**
 * Get role display information
 */
export const getRoleInfo = (role: UserRole) => {
  return ROLE_CONFIGS[role];
};

/**
 * Get roles that can be created by a specific role
 */
export const getCreatableRoles = (userRole: UserRole): UserRole[] => {
  const roleConfig = ROLE_CONFIGS[userRole];
  return roleConfig?.canCreateRoles || [];
};

/**
 * Check if a role has higher level than another
 */
export const hasHigherLevel = (role1: UserRole, role2: UserRole): boolean => {
  return ROLE_CONFIGS[role1].level > ROLE_CONFIGS[role2].level;
};
