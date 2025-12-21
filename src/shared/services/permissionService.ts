/**
 * Permission API Service (Mock Implementation)
 * 
 * This is a mock implementation for demonstration purposes.
 * Replace with actual API calls to your backend.
 */

import {
  UserPermissions,
  PermissionModule,
  PermissionAction,
  CreateUserWithPermissionsRequest,
  CreateUserWithPermissionsResponse,
  UpdateUserPermissionsRequest,
  UpdateUserPermissionsResponse,
  GetUserPermissionsResponse,
  GrantTemporaryAccessRequest,
  GrantTemporaryAccessResponse,
  RevokeAccessRequest,
  RevokeAccessResponse,
  PermissionTemplate,
  GetPermissionTemplatesResponse,
  ApplyPermissionTemplateRequest,
  ApplyPermissionTemplateResponse,
  PermissionAuditLog,
  ModulePermission,
} from '../types/permissions.types';
import { createDefaultPermissions } from '../utils/permissions.utils';

// Mock database
const mockUserPermissions = new Map<string, UserPermissions>();
const mockAuditLog: PermissionAuditLog[] = [];

// Predefined templates
const mockTemplates: PermissionTemplate[] = [
  {
    id: 'template-1',
    name: 'Operations Manager',
    description: 'Full access to bookings, customers, and tools',
    modules: [
      { module: PermissionModule.BOOKING, actions: [PermissionAction.MANAGE], enabled: true },
      { module: PermissionModule.CUSTOMER, actions: [PermissionAction.MANAGE], enabled: true },
      { module: PermissionModule.TOOLS, actions: [PermissionAction.VIEW], enabled: true },
    ],
  },
  {
    id: 'template-2',
    name: 'Marketing Specialist',
    description: 'Marketing campaigns and customer communications',
    modules: [
      { module: PermissionModule.MARKETING, actions: [PermissionAction.MANAGE], enabled: true },
      { module: PermissionModule.CUSTOMER, actions: [PermissionAction.VIEW], enabled: true },
      { module: PermissionModule.REPORTS, actions: [PermissionAction.VIEW], enabled: true },
    ],
  },
  {
    id: 'template-3',
    name: 'Finance Manager',
    description: 'Complete finance and accounting access',
    modules: [
      { module: PermissionModule.FINANCE, actions: [PermissionAction.MANAGE], enabled: true },
      { module: PermissionModule.BOOKING, actions: [PermissionAction.VIEW], enabled: true },
      { module: PermissionModule.REPORTS, actions: [PermissionAction.MANAGE], enabled: true },
    ],
  },
  {
    id: 'template-4',
    name: 'Read-Only Auditor',
    description: 'View-only access to all modules',
    modules: [
      { module: PermissionModule.BOOKING, actions: [PermissionAction.VIEW], enabled: true },
      { module: PermissionModule.CUSTOMER, actions: [PermissionAction.VIEW], enabled: true },
      { module: PermissionModule.FINANCE, actions: [PermissionAction.VIEW], enabled: true },
      { module: PermissionModule.REPORTS, actions: [PermissionAction.VIEW], enabled: true },
    ],
  },
];

/**
 * Create user with custom permissions
 */
export const createUserWithPermissions = async (
  request: CreateUserWithPermissionsRequest
): Promise<CreateUserWithPermissionsResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const userId = `user_${Date.now()}`;

  // Create default permissions based on role
  const basePermissions = createDefaultPermissions(userId, request.role);

  // Apply custom module selections
  const selectedModules: ModulePermission[] = request.permissions.modules.map(module => ({
    module,
    actions: [PermissionAction.VIEW, PermissionAction.EDIT, PermissionAction.CREATE],
    enabled: true,
  }));

  const userPermissions: UserPermissions = {
    ...basePermissions,
    modules: selectedModules,
    customPermissions: request.permissions.customPermissions?.map(cp => ({
      module: cp.module,
      actions: cp.actions,
      expiresAt: cp.expiresAt ? new Date(cp.expiresAt) : undefined,
      reason: cp.reason,
      grantedBy: 'current_admin_id', // Would come from session
      grantedAt: new Date(),
    })),
  };

  mockUserPermissions.set(userId, userPermissions);

  // Log audit entry
  mockAuditLog.push({
    id: `audit_${Date.now()}`,
    userId,
    action: 'GRANTED',
    module: PermissionModule.USER_MANAGEMENT,
    permissions: [PermissionAction.CREATE],
    performedBy: 'current_admin_id',
    performedAt: new Date(),
    reason: 'User created with custom permissions',
  });

  return {
    success: true,
    user: {
      id: userId,
      name: request.name,
      email: request.email,
      role: request.role,
      permissions: userPermissions,
    },
    message: 'User created successfully with custom permissions',
  };
};

/**
 * Update user permissions
 */
export const updateUserPermissions = async (
  request: UpdateUserPermissionsRequest
): Promise<UpdateUserPermissionsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const existingPermissions = mockUserPermissions.get(request.userId);

  if (!existingPermissions) {
    throw new Error('User not found');
  }

  // Update modules
  const updatedModules: ModulePermission[] = request.permissions.modules.map(module => ({
    module,
    actions: [PermissionAction.VIEW, PermissionAction.EDIT, PermissionAction.CREATE],
    enabled: true,
  }));

  const updatedPermissions: UserPermissions = {
    ...existingPermissions,
    modules: updatedModules,
    customPermissions: request.permissions.customPermissions?.map(cp => ({
      module: cp.module,
      actions: cp.actions,
      expiresAt: cp.expiresAt ? new Date(cp.expiresAt) : undefined,
      reason: cp.reason,
      grantedBy: request.updatedBy,
      grantedAt: new Date(),
    })),
    lastUpdated: new Date(),
    updatedBy: request.updatedBy,
  };

  mockUserPermissions.set(request.userId, updatedPermissions);

  // Log audit entry
  mockAuditLog.push({
    id: `audit_${Date.now()}`,
    userId: request.userId,
    action: 'UPDATED',
    module: PermissionModule.USER_MANAGEMENT,
    permissions: [PermissionAction.EDIT],
    performedBy: request.updatedBy,
    performedAt: new Date(),
  });

  return {
    success: true,
    permissions: updatedPermissions,
    message: 'Permissions updated successfully',
  };
};

/**
 * Get user permissions
 */
export const getUserPermissions = async (
  userId: string
): Promise<GetUserPermissionsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const permissions = mockUserPermissions.get(userId);

  if (!permissions) {
    throw new Error('User permissions not found');
  }

  return {
    success: true,
    permissions,
  };
};

/**
 * Grant temporary access
 */
export const grantTemporaryAccess = async (
  request: GrantTemporaryAccessRequest
): Promise<GrantTemporaryAccessResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const permissions = mockUserPermissions.get(request.userId);

  if (!permissions) {
    throw new Error('User not found');
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + request.duration);

  const newPermission = {
    module: request.module,
    actions: request.actions,
    expiresAt,
    reason: request.reason,
    grantedBy: request.grantedBy,
    grantedAt: new Date(),
  };

  const updatedPermissions: UserPermissions = {
    ...permissions,
    customPermissions: [...(permissions.customPermissions || []), newPermission],
    lastUpdated: new Date(),
    updatedBy: request.grantedBy,
  };

  mockUserPermissions.set(request.userId, updatedPermissions);

  // Log audit entry
  mockAuditLog.push({
    id: `audit_${Date.now()}`,
    userId: request.userId,
    action: 'GRANTED',
    module: request.module,
    permissions: request.actions,
    performedBy: request.grantedBy,
    performedAt: new Date(),
    expiresAt,
    reason: request.reason,
  });

  return {
    success: true,
    permission: newPermission,
    message: `Temporary access granted until ${expiresAt.toLocaleString()}`,
  };
};

/**
 * Revoke access
 */
export const revokeAccess = async (
  request: RevokeAccessRequest
): Promise<RevokeAccessResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const permissions = mockUserPermissions.get(request.userId);

  if (!permissions) {
    throw new Error('User not found');
  }

  // Remove module from standard permissions
  const updatedModules = permissions.modules.filter(m => m.module !== request.module);

  // Remove from custom permissions
  const updatedCustom = permissions.customPermissions?.filter(
    cp => cp.module !== request.module
  );

  const updatedPermissions: UserPermissions = {
    ...permissions,
    modules: updatedModules,
    customPermissions: updatedCustom,
    lastUpdated: new Date(),
    updatedBy: request.revokedBy,
  };

  mockUserPermissions.set(request.userId, updatedPermissions);

  // Log audit entry
  mockAuditLog.push({
    id: `audit_${Date.now()}`,
    userId: request.userId,
    action: 'REVOKED',
    module: request.module,
    permissions: [],
    performedBy: request.revokedBy,
    performedAt: new Date(),
  });

  return {
    success: true,
    message: 'Access revoked successfully',
  };
};

/**
 * Get permission templates
 */
export const getPermissionTemplates = async (): Promise<GetPermissionTemplatesResponse> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    success: true,
    templates: mockTemplates,
  };
};

/**
 * Apply permission template
 */
export const applyPermissionTemplate = async (
  request: ApplyPermissionTemplateRequest
): Promise<ApplyPermissionTemplateResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const template = mockTemplates.find(t => t.id === request.templateId);

  if (!template) {
    throw new Error('Template not found');
  }

  const permissions = mockUserPermissions.get(request.userId);

  if (!permissions) {
    throw new Error('User not found');
  }

  const updatedPermissions: UserPermissions = {
    ...permissions,
    modules: template.modules,
    lastUpdated: new Date(),
    updatedBy: request.appliedBy,
  };

  mockUserPermissions.set(request.userId, updatedPermissions);

  // Log audit entry
  mockAuditLog.push({
    id: `audit_${Date.now()}`,
    userId: request.userId,
    action: 'UPDATED',
    module: PermissionModule.USER_MANAGEMENT,
    permissions: [PermissionAction.EDIT],
    performedBy: request.appliedBy,
    performedAt: new Date(),
    reason: `Applied template: ${template.name}`,
  });

  return {
    success: true,
    permissions: updatedPermissions,
    message: `Template "${template.name}" applied successfully`,
  };
};

/**
 * Get audit log for a user
 */
export const getPermissionAuditLog = async (
  userId: string,
  limit: number = 50
): Promise<PermissionAuditLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockAuditLog
    .filter(log => log.userId === userId)
    .slice(0, limit)
    .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
};
