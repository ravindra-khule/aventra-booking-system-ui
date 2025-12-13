import React, { useState } from 'react';
import { X, Square, CheckSquare, Edit2, Trash2, Eye, Lock, Unlock, Clock } from 'lucide-react';
import { AdminUser, UserRole, UserStatus } from '../types/userManagementTypes';
import { UserStatusIndicator } from './UserStatusIndicator';

interface UserTableProps {
  users: AdminUser[];
  selectedUsers: Set<string>;
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
  onViewPermissions: (user: AdminUser) => void;
  onViewActivityLogs: (user: AdminUser) => void;
  onViewSessions: (user: AdminUser) => void;
  onToggleStatus: (userId: string) => void;
  onToggle2FA: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onViewPermissions,
  onViewActivityLogs,
  onViewSessions,
  onToggleStatus,
  onToggle2FA,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  const toggleRowExpansion = (userId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const formatLastLogin = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days === 0 && hours === 0) return 'Just now';
    if (days === 0) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={onSelectAll}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  {selectedUsers.size === users.length && users.length > 0 ? (
                    <CheckSquare className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                2FA
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onSelectUser(user.id)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      {selectedUsers.has(user.id) ? (
                        <CheckSquare className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <UserStatusIndicator status={user.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatLastLogin(user.lastLogin)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onToggle2FA(user.id)}
                      className={`p-2 rounded-lg transition ${
                        user.twoFactorEnabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    >
                      {user.twoFactorEnabled ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                        title="Edit user"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          onViewPermissions(user);
                          setActionMenuOpen(null);
                        }}
                        className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg transition"
                        title="View permissions"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row - Additional Info */}
                {expandedRows.has(user.id) && (
                  <tr className="bg-gray-50 border-t border-gray-100">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                            Last Login Info
                          </p>
                          <p className="text-sm text-gray-900">{user.lastLoginBrowser}</p>
                          <p className="text-xs text-gray-500">{user.lastLoginIP}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                            Device
                          </p>
                          <p className="text-sm text-gray-900">{user.lastLoginDevice || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                            Phone
                          </p>
                          <p className="text-sm text-gray-900">{user.phone || 'Not provided'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onViewActivityLogs(user)}
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                          >
                            Activity Logs
                          </button>
                          <button
                            onClick={() => onViewSessions(user)}
                            className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                          >
                            Sessions
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {users.map((user) => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                checked={selectedUsers.has(user.id)}
                onChange={() => onSelectUser(user.id)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
              />
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <UserStatusIndicator status={user.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Roles:</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">2FA:</span>
                <span className={user.twoFactorEnabled ? 'text-green-600 font-medium' : 'text-gray-500'}>
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onEditUser(user)}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 text-sm rounded hover:bg-blue-200 transition font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onViewPermissions(user)}
                className="flex-1 px-3 py-2 bg-purple-100 text-purple-600 text-sm rounded hover:bg-purple-200 transition font-medium"
              >
                Permissions
              </button>
              <button
                onClick={() => onViewActivityLogs(user)}
                className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-600 text-sm rounded hover:bg-yellow-200 transition font-medium"
              >
                Logs
              </button>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="flex-1 px-3 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
};
