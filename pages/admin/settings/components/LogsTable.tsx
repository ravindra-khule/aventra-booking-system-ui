import React, { useState } from 'react';
import { Eye, Copy } from 'lucide-react';

interface LogsTableProps {
  activeTab: string;
  filters: any;
}

export const LogsTable: React.FC<LogsTableProps> = ({ activeTab, filters }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sample data - Replace with actual API call
  const sampleLogs = [
    {
      id: 'LOG-001',
      timestamp: '2025-12-12 14:32:45',
      type: 'Error',
      severity: 'critical',
      user: 'admin@example.com',
      message: 'Database connection timeout',
      details: 'Connection to database cluster failed after 30 seconds',
      ipAddress: '192.168.1.1',
      statusCode: 500,
    },
    {
      id: 'LOG-002',
      timestamp: '2025-12-12 14:25:12',
      type: 'Login',
      severity: 'info',
      user: 'user@example.com',
      message: 'User login successful',
      details: 'Authentication successful from Chrome on Windows',
      ipAddress: '192.168.1.5',
      statusCode: 200,
    },
    {
      id: 'LOG-003',
      timestamp: '2025-12-12 14:18:33',
      type: 'API Request',
      severity: 'warning',
      user: 'api-client',
      message: 'Slow API response',
      details: 'Response time exceeded 5 seconds for GET /api/users',
      ipAddress: '10.0.0.1',
      statusCode: 200,
    },
    {
      id: 'LOG-004',
      timestamp: '2025-12-12 14:10:22',
      type: 'Security',
      severity: 'error',
      user: 'unknown',
      message: 'Multiple failed login attempts',
      details: '5 failed login attempts from same IP in 10 minutes',
      ipAddress: '203.0.113.45',
      statusCode: 401,
    },
  ];

  const getSeverityBadgeColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      error: 'bg-orange-100 text-orange-800',
      warning: 'bg-yellow-100 text-yellow-800',
      info: 'bg-blue-100 text-blue-800',
      debug: 'bg-gray-100 text-gray-800',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User/Source</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Message</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sampleLogs.map((log) => (
              <React.Fragment key={log.id}>
                <tr className="hover:bg-gray-50 transition cursor-pointer">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{log.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{log.type}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadgeColor(log.severity)}`}>
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.user}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{log.message}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {expandedRow === log.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Full Message</p>
                            <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">{log.message}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Details</p>
                            <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">{log.details}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">IP Address</p>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-white p-2 rounded border border-gray-200 flex-1">{log.ipAddress}</code>
                              <button
                                onClick={() => copyToClipboard(log.ipAddress, log.id)}
                                className="p-2 hover:bg-white rounded transition"
                              >
                                <Copy size={14} className={copiedId === log.id ? 'text-green-600' : 'text-gray-600'} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Status Code</p>
                            <code className="text-sm bg-white p-2 rounded border border-gray-200 block">{log.statusCode}</code>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">User</p>
                            <code className="text-sm bg-white p-2 rounded border border-gray-200 block">{log.user}</code>
                          </div>
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">Showing 1 to 4 of 24,582 logs</p>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm">
            Previous
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">1</button>
          <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm">2</button>
          <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};
