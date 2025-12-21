/**
 * Permission Manager Component
 * 
 * Visual interface for managing user permissions
 * - Assign module access during user creation
 * - Update permissions for existing users
 * - Grant temporary access
 * - View permission history
 */

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Megaphone,
  DollarSign,
  Wrench,
  Settings,
  UserCog,
  BarChart3,
  Check,
  X,
  Clock,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Shield,
} from 'lucide-react';
import {
  PermissionModule,
  PermissionAction,
  ModulePermission,
  MODULE_METADATA,
  DEFAULT_ROLE_PERMISSIONS,
} from '../src/shared/types/permissions.types';
import { UserRole } from '../src/shared/types/common.types';

interface PermissionManagerProps {
  selectedRole: UserRole;
  selectedModules: PermissionModule[];
  onModulesChange: (modules: PermissionModule[]) => void;
  customPermissions?: {
    module: PermissionModule;
    actions: PermissionAction[];
    expiresAt?: Date;
    reason?: string;
  }[];
  onCustomPermissionsChange?: (permissions: any[]) => void;
  mode?: 'create' | 'edit';
  userId?: string;
}

// Icon mapping
const moduleIcons: Record<string, React.ComponentType<any>> = {
  Calendar,
  Users,
  Megaphone,
  DollarSign,
  Wrench,
  Settings,
  UserCog,
  BarChart3,
};

export const PermissionManager: React.FC<PermissionManagerProps> = ({
  selectedRole,
  selectedModules,
  onModulesChange,
  customPermissions = [],
  onCustomPermissionsChange,
  mode = 'create',
  userId,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTemporaryAccess, setShowTemporaryAccess] = useState(false);
  const [temporaryAccessForm, setTemporaryAccessForm] = useState({
    module: '' as PermissionModule,
    duration: 24, // hours
    reason: '',
  });

  // Get default permissions for selected role
  const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[selectedRole] || [];

  // Check if module is selected
  const isModuleSelected = (module: PermissionModule) => {
    return selectedModules.includes(module);
  };

  // Toggle module selection
  const toggleModule = (module: PermissionModule) => {
    if (isModuleSelected(module)) {
      onModulesChange(selectedModules.filter(m => m !== module));
    } else {
      onModulesChange([...selectedModules, module]);
    }
  };

  // Select all default permissions
  const selectDefaultPermissions = () => {
    onModulesChange(defaultPermissions);
  };

  // Clear all permissions
  const clearAllPermissions = () => {
    onModulesChange([]);
  };

  // Grant temporary access
  const handleGrantTemporaryAccess = () => {
    if (!temporaryAccessForm.module || !temporaryAccessForm.reason) {
      alert('Please select a module and provide a reason');
      return;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + temporaryAccessForm.duration);

    const newPermission = {
      module: temporaryAccessForm.module,
      actions: [PermissionAction.VIEW, PermissionAction.EDIT],
      expiresAt,
      reason: temporaryAccessForm.reason,
    };

    if (onCustomPermissionsChange) {
      onCustomPermissionsChange([...customPermissions, newPermission]);
    }

    // Reset form
    setTemporaryAccessForm({
      module: '' as PermissionModule,
      duration: 24,
      reason: '',
    });
    setShowTemporaryAccess(false);
  };

  // Remove custom permission
  const removeCustomPermission = (index: number) => {
    if (onCustomPermissionsChange) {
      onCustomPermissionsChange(customPermissions.filter((_, i) => i !== index));
    }
  };

  // Get icon component for module
  const getModuleIcon = (iconName: string) => {
    const IconComponent = moduleIcons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <Shield className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Permission Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select which modules this {selectedRole.toLowerCase().replace('_', ' ')} can access
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectDefaultPermissions}
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            Use Default for {selectedRole}
          </button>
          <button
            type="button"
            onClick={clearAllPermissions}
            className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Default Permissions Info */}
      {defaultPermissions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-700">
              <strong>Default for {selectedRole}:</strong>{' '}
              {defaultPermissions.map(m => MODULE_METADATA[m].label).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Module Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.values(PermissionModule).map((module) => {
          const metadata = MODULE_METADATA[module];
          const isSelected = isModuleSelected(module);
          const isDefault = defaultPermissions.includes(module);

          return (
            <button
              key={module}
              type="button"
              onClick={() => toggleModule(module)}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${isSelected
                  ? `border-${metadata.color}-500 bg-${metadata.color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`
                    p-2 rounded-lg
                    ${isSelected ? `text-${metadata.color}-600 bg-white` : 'text-gray-400 bg-gray-50'}
                  `}
                >
                  {getModuleIcon(metadata.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${isSelected ? `text-${metadata.color}-900` : 'text-gray-900'}`}>
                      {metadata.label}
                    </h4>
                    {isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {metadata.description}
                  </p>
                </div>

                {/* Checkbox */}
                <div
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected
                      ? `bg-${metadata.color}-600 border-${metadata.color}-600`
                      : 'bg-white border-gray-300'
                    }
                  `}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Modules Summary */}
      {selectedModules.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Selected Modules ({selectedModules.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedModules.map((module) => {
              const metadata = MODULE_METADATA[module];
              return (
                <div
                  key={module}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${metadata.color}-100 text-${metadata.color}-700 text-xs font-medium`}
                >
                  {getModuleIcon(metadata.icon)}
                  <span>{metadata.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleModule(module)}
                    className="hover:bg-white/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced Options (Edit Mode Only) */}
      {mode === 'edit' && (
        <div className="border-t pt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {showAdvanced ? '▼' : '▶'} Advanced Options
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4">
              {/* Temporary Access */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Grant Temporary Access
                    </h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Give time-limited access to specific modules
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTemporaryAccess(!showTemporaryAccess)}
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add
                  </button>
                </div>

                {showTemporaryAccess && (
                  <div className="bg-white rounded-lg p-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Module
                      </label>
                      <select
                        value={temporaryAccessForm.module}
                        onChange={(e) => setTemporaryAccessForm({
                          ...temporaryAccessForm,
                          module: e.target.value as PermissionModule,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select module...</option>
                        {Object.values(PermissionModule).map((module) => (
                          <option key={module} value={module}>
                            {MODULE_METADATA[module].label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={temporaryAccessForm.duration}
                        onChange={(e) => setTemporaryAccessForm({
                          ...temporaryAccessForm,
                          duration: parseInt(e.target.value),
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Reason (required)
                      </label>
                      <textarea
                        value={temporaryAccessForm.reason}
                        onChange={(e) => setTemporaryAccessForm({
                          ...temporaryAccessForm,
                          reason: e.target.value,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows={2}
                        placeholder="Why is this temporary access needed?"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleGrantTemporaryAccess}
                        className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700"
                      >
                        Grant Access
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTemporaryAccess(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Temporary Permissions */}
                {customPermissions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-amber-900">
                      Active Temporary Permissions:
                    </p>
                    {customPermissions.map((perm, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 border border-amber-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">
                                {MODULE_METADATA[perm.module].label}
                              </span>
                              {perm.expiresAt && (
                                <span className="text-xs text-amber-700">
                                  Expires: {new Date(perm.expiresAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                            {perm.reason && (
                              <p className="text-xs text-gray-600">
                                Reason: {perm.reason}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomPermission(index)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Permission Guidelines */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          💡 Permission Guidelines
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Grant only the modules needed for the user's role and responsibilities</li>
          <li>• Use temporary access for short-term needs instead of permanent changes</li>
          <li>• Review and audit permissions regularly</li>
          <li>• Document the reason for any custom or temporary permissions</li>
        </ul>
      </div>
    </div>
  );
};
