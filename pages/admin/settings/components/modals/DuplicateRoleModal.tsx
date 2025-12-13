import React, { useState } from 'react';
import { X, AlertCircle, Check, Copy } from 'lucide-react';
import { RolePermissionService } from '../../../../../src/shared/services/role-permission.service';
import { Role } from '../../../../../types';

interface DuplicateRoleModalProps {
  isOpen: boolean;
  role: Role;
  onClose: () => void;
  onSuccess: () => void;
}

export const DuplicateRoleModal: React.FC<DuplicateRoleModalProps> = ({
  isOpen,
  role,
  onClose,
  onSuccess,
}) => {
  const [newName, setNewName] = useState(`Copy of ${role.name}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleDuplicate = async () => {
    setValidationError(null);

    if (!newName.trim()) {
      setValidationError('Role name is required');
      return;
    }

    if (newName.trim().length < 2) {
      setValidationError('Role name must be at least 2 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await RolePermissionService.duplicateRole(role.id, newName.trim());
      setNewName(`Copy of ${role.name}`);
      onSuccess();
    } catch (err) {
      setError('Failed to duplicate role. Please try again.');
      console.error('Error duplicating role:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Duplicate Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Creating a copy of <strong>{role.name}</strong> with all {role.permissions.length} permissions.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              New Role Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleDuplicate();
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationError ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {validationError && (
              <p className="text-red-600 text-sm mt-1">{validationError}</p>
            )}
          </div>

          {/* Details */}
          <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Permissions to copy:</span>
              <span className="font-semibold text-gray-900">{role.permissions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Source role:</span>
              <span className="font-semibold text-gray-900">{role.name}</span>
            </div>
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
              onClick={handleDuplicate}
              disabled={loading || !newName.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                  Duplicating...
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Duplicate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
