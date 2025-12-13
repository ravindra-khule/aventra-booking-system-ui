import React, { useState } from 'react';
import { X, Send, Mail, Shield, AlertCircle } from 'lucide-react';
import { UserRole } from '../types/userManagementTypes';

interface UserInvitationModalProps {
  onSend: (email: string, roles: UserRole[]) => void;
  onClose: () => void;
}

const AVAILABLE_ROLES: UserRole[] = ['Super Admin', 'Admin', 'Manager', 'Support'];

export const UserInvitationModal: React.FC<UserInvitationModalProps> = ({
  onSend,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Set<UserRole>>(new Set());
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleRoleToggle = (role: UserRole) => {
    const newRoles = new Set(selectedRoles);
    if (newRoles.has(role)) {
      newRoles.delete(role);
    } else {
      newRoles.add(role);
    }
    setSelectedRoles(newRoles);
  };

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || selectedRoles.size === 0) {
      alert('Please enter an email and select at least one role');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSending(true);

    // Simulate API call
    setTimeout(() => {
      onSend(email, Array.from(selectedRoles));
      setIsSending(false);
      setInvitationSent(true);

      // Auto close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 800);
  };

  if (invitationSent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation Sent!
          </h2>
          <p className="text-gray-600 mb-2">
            An invitation has been sent to <span className="font-semibold">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            The user will receive an email with instructions to create their account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Invite New Admin User
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSendInvitation} className="p-6 space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              An invitation link will be sent to this email address.
            </p>
          </div>

          {/* Roles Assignment */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Assign Roles
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRolesDropdown(!showRolesDropdown)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="text-gray-700">
                  {selectedRoles.size === 0
                    ? 'Select roles...'
                    : `${selectedRoles.size} role(s) selected`}
                </span>
                <Shield className="h-5 w-5 text-gray-400" />
              </button>

              {showRolesDropdown && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  {AVAILABLE_ROLES.map((role) => (
                    <label
                      key={role}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.has(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

                          {/* Selected Roles Display */}
            {selectedRoles.size > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from(selectedRoles).map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-2"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRoleToggle}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  What happens next?
                </p>
                <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                  <li>User receives invitation email</li>
                  <li>User clicks link to set up account</li>
                  <li>User creates password</li>
                  <li>Account becomes active</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition font-medium flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
