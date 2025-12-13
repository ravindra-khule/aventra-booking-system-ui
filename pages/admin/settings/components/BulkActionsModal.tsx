import React, { useState } from 'react';
import { X, AlertCircle, Shield } from 'lucide-react';

interface BulkActionsModalProps {
  selectedCount: number;
  onAction: (action: {
    action: 'activate' | 'deactivate' | 'delete' | 'assignRole';
    roleToAssign?: string;
  }) => void;
  onClose: () => void;
}

export const BulkActionsModal: React.FC<BulkActionsModalProps> = ({
  selectedCount,
  onAction,
  onClose,
}) => {
  const [selectedAction, setSelectedAction] = useState<
    'activate' | 'deactivate' | 'delete' | 'assignRole' | null
  >(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleSubmit = () => {
    if (!selectedAction) {
      alert('Please select an action');
      return;
    }

    if (selectedAction === 'assignRole' && !selectedRole) {
      alert('Please select a role');
      return;
    }

    onAction({
      action: selectedAction,
      roleToAssign: selectedAction === 'assignRole' ? selectedRole : undefined,
    });
  };

  const getConfirmationMessage = () => {
    const userText = selectedCount === 1 ? 'user' : 'users';
    switch (selectedAction) {
      case 'activate':
        return `Activate ${selectedCount} ${userText}?`;
      case 'deactivate':
        return `Deactivate ${selectedCount} ${userText}?`;
      case 'delete':
        return `Delete ${selectedCount} ${userText}? This action cannot be undone.`;
      case 'assignRole':
        return `Assign ${selectedRole} role to ${selectedCount} ${userText}?`;
      default:
        return '';
    }
  };

  const getDangerText = () => {
    switch (selectedAction) {
      case 'delete':
        return 'This action cannot be undone. The selected users will be permanently deleted.';
      case 'deactivate':
        return 'Deactivated users will not be able to access the system.';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Bulk Actions</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selected Count */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </p>
          </div>

          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Action
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="activate"
                  checked={selectedAction === 'activate'}
                  onChange={(e) => setSelectedAction(e.target.value as any)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Activate Users</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="deactivate"
                  checked={selectedAction === 'deactivate'}
                  onChange={(e) => setSelectedAction(e.target.value as any)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Deactivate Users</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="assignRole"
                  checked={selectedAction === 'assignRole'}
                  onChange={(e) => setSelectedAction(e.target.value as any)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Assign Role</span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="delete"
                  checked={selectedAction === 'delete'}
                  onChange={(e) => setSelectedAction(e.target.value as any)}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm text-red-600 font-medium">Delete Users</span>
              </label>
            </div>
          </div>

          {/* Role Selection */}
          {selectedAction === 'assignRole' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a role...</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Support">Support</option>
                </select>
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          {selectedAction && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">
                {getConfirmationMessage()}
              </p>
            </div>
          )}

          {/* Danger Warning */}
          {getDangerText() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{getDangerText()}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedAction}
            className={`px-6 py-2 rounded-lg transition font-medium text-white ${
              selectedAction === 'delete'
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
            }`}
          >
            Apply Action
          </button>
        </div>
      </div>
    </div>
  );
};
