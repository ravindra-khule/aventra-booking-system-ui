import React, { useState } from 'react';
import { X, Calendar, MapPin, Zap, Filter, ChevronDown } from 'lucide-react';
import { AdminUser, ActivityLog, ActionType } from '../types/userManagementTypes';

interface ActivityLogsModalProps {
  user: AdminUser;
  onClose: () => void;
}

// Mock activity data
const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    timestamp: new Date('2025-12-12T14:30:00'),
    action: 'login',
    module: 'Authentication',
    ipAddress: '192.168.1.100',
    details: 'Successful login from Chrome on MacBook Pro',
  },
  {
    id: '2',
    userId: '1',
    timestamp: new Date('2025-12-12T14:15:00'),
    action: 'edit_user',
    module: 'User Management',
    ipAddress: '192.168.1.100',
    details: 'Updated user Emma Wilson roles',
  },
  {
    id: '3',
    userId: '1',
    timestamp: new Date('2025-12-11T10:22:00'),
    action: 'create_user',
    module: 'User Management',
    ipAddress: '192.168.1.100',
    details: 'Created new user David Chen',
  },
  {
    id: '4',
    userId: '1',
    timestamp: new Date('2025-12-11T09:45:00'),
    action: 'change_password',
    module: 'Account Settings',
    ipAddress: '192.168.1.100',
    details: 'Password changed successfully',
  },
  {
    id: '5',
    userId: '1',
    timestamp: new Date('2025-12-10T16:30:00'),
    action: 'enable_2fa',
    module: 'Security',
    ipAddress: '192.168.1.100',
    details: 'Two-factor authentication enabled',
  },
  {
    id: '6',
    userId: '1',
    timestamp: new Date('2025-12-09T13:15:00'),
    action: 'update_role',
    module: 'User Management',
    ipAddress: '192.168.1.101',
    details: 'Assigned Admin role to Marcus Johnson',
  },
  {
    id: '7',
    userId: '1',
    timestamp: new Date('2025-12-08T11:00:00'),
    action: 'delete_user',
    module: 'User Management',
    ipAddress: '192.168.1.100',
    details: 'Deleted user account',
  },
  {
    id: '8',
    userId: '1',
    timestamp: new Date('2025-12-07T15:45:00'),
    action: 'logout',
    module: 'Authentication',
    ipAddress: '192.168.1.100',
    details: 'User logged out',
  },
];

const ACTION_ICONS: Record<ActionType, React.ReactNode> = {
  login: '🔓',
  logout: '🔐',
  create_user: '👤',
  edit_user: '✏️',
  delete_user: '🗑️',
  change_password: '🔑',
  enable_2fa: '🔐',
  disable_2fa: '🔓',
  update_role: '👑',
};

const ACTION_COLORS: Record<ActionType, string> = {
  login: 'bg-green-100 text-green-700',
  logout: 'bg-gray-100 text-gray-700',
  create_user: 'bg-blue-100 text-blue-700',
  edit_user: 'bg-blue-100 text-blue-700',
  delete_user: 'bg-red-100 text-red-700',
  change_password: 'bg-purple-100 text-purple-700',
  enable_2fa: 'bg-purple-100 text-purple-700',
  disable_2fa: 'bg-purple-100 text-purple-700',
  update_role: 'bg-orange-100 text-orange-700',
};

export const ActivityLogsModal: React.FC<ActivityLogsModalProps> = ({
  user,
  onClose,
}) => {
  const [filters, setFilters] = useState<{
    actionType: ActionType | 'all';
    dateRange: 'all' | '7days' | '30days' | '90days';
  }>({
    actionType: 'all',
    dateRange: '30days',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Filter logs based on selected filters
  const filteredLogs = MOCK_ACTIVITY_LOGS.filter((log) => {
    const actionMatch =
      filters.actionType === 'all' || log.action === filters.actionType;

    let dateMatch = true;
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const logDate = new Date(log.timestamp);
      const daysAgo =
        (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);

      const maxDays =
        filters.dateRange === '7days'
          ? 7
          : filters.dateRange === '30days'
            ? 30
            : 90;

      dateMatch = daysAgo <= maxDays;
    }

    return actionMatch && dateMatch;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity Logs</h2>
            <p className="text-sm text-gray-600 mt-1">
              Activity history for {user.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="relative inline-block">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              Filters
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showFilters && (
              <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-72">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Type
                  </label>
                  <select
                    value={filters.actionType}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        actionType: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Actions</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="create_user">Create User</option>
                    <option value="edit_user">Edit User</option>
                    <option value="delete_user">Delete User</option>
                    <option value="change_password">Change Password</option>
                    <option value="enable_2fa">Enable 2FA</option>
                    <option value="disable_2fa">Disable 2FA</option>
                    <option value="update_role">Update Role</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        dateRange: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setFilters({
                      actionType: 'all',
                      dateRange: '30days',
                    });
                    setShowFilters(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          <span className="ml-4 text-sm text-gray-600">
            {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          ACTION_COLORS[log.action]
                        }`}
                      >
                        {ACTION_ICONS[log.action]}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {log.module}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {log.details}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatTime(log.timestamp)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {log.ipAddress}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            ACTION_COLORS[log.action]
                          }`}
                        >
                          {log.action
                            .split('_')
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
