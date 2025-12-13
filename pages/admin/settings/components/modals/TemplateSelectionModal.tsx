import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { RolePermissionService } from '../../../../../src/shared/services/role-permission.service';
import { RoleTemplate } from '../../../../../types';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  template: RoleTemplate;
  onClose: () => void;
  onSuccess: () => void;
}

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  template,
  onClose,
  onSuccess,
}) => {
  const [roleName, setRoleName] = useState(`${template.name} - Custom`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCreate = async () => {
    setValidationError(null);

    if (!roleName.trim()) {
      setValidationError('Role name is required');
      return;
    }

    if (roleName.trim().length < 2) {
      setValidationError('Role name must be at least 2 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await RolePermissionService.createRole({
        name: roleName.trim(),
        description: `Created from ${template.name} template: ${template.description}`,
        permissions: template.permissions,
      });

      setRoleName(`${template.name} - Custom`);
      onSuccess();
    } catch (err) {
      setError('Failed to create role from template. Please try again.');
      console.error('Error creating role:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Role from Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-gray-700 mb-4">{template.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                {template.permissions.length} permissions included
              </span>
            </div>
          </div>

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

          {/* Role Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              New Role Name *
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationError && (
              <p className="text-red-600 text-sm mt-1">{validationError}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              You can customize this name after creation
            </p>
          </div>

          {/* Permissions Preview */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Permissions Preview</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {template.permissions.map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This role will be created as a custom role. You can edit permissions and assign it to users immediately after creation.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || !roleName.trim()}
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
        </div>
      </div>
    </div>
  );
};
