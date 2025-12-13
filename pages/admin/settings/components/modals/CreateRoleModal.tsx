import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Check, Plus, Minus } from 'lucide-react';
import { RolePermissionService } from '../../../../../src/shared/services/role-permission.service';
import { PermissionCategoryGroup, PermissionFeature, RoleFormData, Role } from '../../../../../types';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<PermissionFeature[]>([]);
  const [parentRoleId, setParentRoleId] = useState<string>('');
  const [permissionCategories, setPermissionCategories] = useState<PermissionCategoryGroup[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [categoriesData, rolesData] = await Promise.all([
        RolePermissionService.getPermissionsByCategory(),
        RolePermissionService.getRoles(),
      ]);
      setPermissionCategories(categoriesData);
      setRoles(rolesData);
    } catch (err) {
      setError('Failed to load permissions');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = 'Role name is required';
    }
    if (name.trim().length < 2) {
      errors.name = 'Role name must be at least 2 characters';
    }
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    if (permissions.length === 0) {
      errors.permissions = 'At least one permission must be selected';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData: RoleFormData = {
        name: name.trim(),
        description: description.trim(),
        permissions,
        parentRoleId: parentRoleId || undefined,
      };

      await RolePermissionService.createRole(formData);
      setName('');
      setDescription('');
      setPermissions([]);
      setParentRoleId('');
      setValidationErrors({});
      onSuccess();
    } catch (err) {
      setError('Failed to create role. Please try again.');
      console.error('Error creating role:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permission: PermissionFeature) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const selectAllInCategory = (categoryFeatures: PermissionFeature[]) => {
    const allSelected = categoryFeatures.every((f) => permissions.includes(f));
    if (allSelected) {
      setPermissions((prev) =>
        prev.filter((p) => !categoryFeatures.includes(p))
      );
    } else {
      setPermissions((prev) => [
        ...prev,
        ...categoryFeatures.filter((f) => !prev.includes(f)),
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="flex gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Role Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Role Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tour Operator, Regional Manager"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose and responsibilities of this role..."
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationErrors.description && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.description}</p>
            )}
          </div>

          {/* Parent Role (Inheritance) */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Parent Role (Optional - for inheritance)
            </label>
            <select
              value={parentRoleId}
              onChange={(e) => setParentRoleId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">None - Create standalone role</option>
              {roles
                .filter((r) => r.id !== 'role_' + name)
                .map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Inherit permissions from a parent role as a base
            </p>
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-semibold text-gray-900">
                Permissions * ({permissions.length} selected)
              </label>
            </div>

            {validationErrors.permissions && (
              <p className="text-red-600 text-sm mb-3">{validationErrors.permissions}</p>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
              {permissionCategories.map((category) => (
                <div key={category.category}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.category)}
                    className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span className="font-semibold text-gray-900">{category.label}</span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {category.features.filter((f) =>
                          permissions.includes(f.feature)
                        ).length}/{category.features.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllInCategory(category.features.map((f) => f.feature));
                      }}
                      className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
                    >
                      Toggle All
                    </button>
                  </button>

                  {expandedCategories.includes(category.category) && (
                    <div className="ml-4 mt-2 space-y-2">
                      {category.features.map((feature) => (
                        <label
                          key={feature.id}
                          className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={permissions.includes(feature.feature)}
                            onChange={() => togglePermission(feature.feature)}
                            className="mt-1 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{feature.label}</p>
                            <p className="text-xs text-gray-600">{feature.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Create Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
