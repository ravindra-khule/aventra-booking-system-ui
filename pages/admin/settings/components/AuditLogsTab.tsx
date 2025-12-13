import React, { useState, useMemo } from 'react';
import { History, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { PermissionAuditLog } from '../../../../types';

interface AuditLogsTabProps {
  auditLogs: PermissionAuditLog[];
  onRefresh: () => void;
}

type FilterAction = 'all' | 'ROLE_CREATED' | 'ROLE_UPDATED' | 'PERMISSION_GRANTED' | 'ROLE_ASSIGNED';

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ auditLogs, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<FilterAction>('all');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.changedByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = filterAction === 'all' || log.action === filterAction;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, searchTerm, filterAction]);

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      ROLE_CREATED: 'bg-green-100 text-green-800',
      ROLE_UPDATED: 'bg-blue-100 text-blue-800',
      ROLE_DELETED: 'bg-red-100 text-red-800',
      PERMISSION_GRANTED: 'bg-purple-100 text-purple-800',
      PERMISSION_REVOKED: 'bg-yellow-100 text-yellow-800',
      ROLE_ASSIGNED: 'bg-indigo-100 text-indigo-800',
      ROLE_UNASSIGNED: 'bg-orange-100 text-orange-800',
    };
    return colors[action] || 'bg-gray-100 text-gray-800';
  };

  const getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      ROLE_CREATED: '✨',
      ROLE_UPDATED: '✏️',
      ROLE_DELETED: '🗑️',
      PERMISSION_GRANTED: '✅',
      PERMISSION_REVOKED: '❌',
      ROLE_ASSIGNED: '👤',
      ROLE_UNASSIGNED: '👥',
    };
    return icons[action] || '•';
  };

  const formatAction = (action: string) => {
    return action.split('_').join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by target, user, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh audit logs"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Filter className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
          <div className="flex gap-2 flex-wrap">
            {(['all', 'ROLE_CREATED', 'ROLE_UPDATED', 'PERMISSION_GRANTED', 'ROLE_ASSIGNED'] as FilterAction[]).map(
              (action) => (
                <button
                  key={action}
                  onClick={() => setFilterAction(action)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterAction === action
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action === 'all' ? 'All Actions' : formatAction(action)}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Logs List */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Action Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getActionColor(log.action)}`}>
                      {getActionIcon(log.action)}
                    </div>

                    {/* Log Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getActionColor(log.action)}`}>
                          {formatAction(log.action)}
                        </span>
                        <span className="font-semibold text-gray-900">{log.targetName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap mb-2">
                        <span className="font-medium">by {log.changedByName}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                        {log.affectedUsers && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                            Affected {log.affectedUsers} {log.affectedUsers === 1 ? 'user' : 'users'}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600">{log.details}</p>
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                      expandedLog === log.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              {expandedLog === log.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Timestamp</p>
                    <p className="text-sm text-gray-900">
                      {log.timestamp.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Target</p>
                    <p className="text-sm text-gray-900">
                      {log.targetName} (ID: {log.targetId})
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Changed By</p>
                    <p className="text-sm text-gray-900">
                      {log.changedByName} (ID: {log.changedBy})
                    </p>
                  </div>

                  {log.affectedUsers !== undefined && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
                        Affected Users
                      </p>
                      <p className="text-sm text-gray-900">{log.affectedUsers}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Full Details</p>
                    <p className="text-sm text-gray-900">{log.details}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-600">
            {searchTerm || filterAction !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Changes to roles and permissions will appear here'}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">About Audit Logs</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ All role and permission changes are logged automatically</li>
          <li>✓ Audit logs help you track who made what changes and when</li>
          <li>✓ You can see how many users were affected by each change</li>
          <li>✓ Logs are retained for compliance and security purposes</li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to format dates
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
