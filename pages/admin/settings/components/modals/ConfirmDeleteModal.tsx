import React, { useState } from 'react';
import { X, AlertCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { RolePermissionService } from '../../../../../src/shared/services/role-permission.service';
import { Role } from '../../../../../types';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  role: Role;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  role,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== role.name) {
      setError('Please type the role name to confirm deletion');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await RolePermissionService.deleteRole(role.id);
      onSuccess();
    } catch (err) {
      setError('Failed to delete role. Please try again.');
      console.error('Error deleting role:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-900">Delete Role</h2>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Warning</h3>
            <p className="text-sm text-yellow-800">
              You are about to permanently delete the <strong>{role.name}</strong> role.
            </p>
          </div>

          {/* Info */}
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">
              <strong>{role.userCount}</strong> {role.userCount === 1 ? 'user has' : 'users have'} this role assigned.
            </p>
            <p className="text-gray-600 text-sm">
              This action cannot be undone.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Type the role name to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${role.name}" to confirm`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This helps prevent accidental deletion
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
              onClick={handleDelete}
              disabled={loading || confirmText !== role.name}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  Delete Role
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
