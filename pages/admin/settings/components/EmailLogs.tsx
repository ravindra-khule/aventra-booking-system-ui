import React, { useState } from 'react';
import { EmailLog } from '../types/emailSettings';
import { EmailLogModal } from './EmailLogModal';

interface EmailLogsComponentProps {
  logs: EmailLog[];
}

export const EmailLogsComponent: React.FC<EmailLogsComponentProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<EmailLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Sample logs for demo
  const sampleLogs: EmailLog[] = [
    {
      id: '1',
      email: 'customer@example.com',
      subject: 'Your Booking is Confirmed - #BK123456',
      status: 'sent',
      sentTime: '2024-12-12T10:30:00',
      provider: 'SMTP',
    },
    {
      id: '2',
      email: 'invalid@example.com',
      subject: 'Payment Receipt - INV-789',
      status: 'bounced',
      sentTime: '2024-12-12T09:15:00',
      provider: 'SendGrid',
      errorMessage: 'Mailbox does not exist',
    },
    {
      id: '3',
      email: 'john@example.com',
      subject: 'Tour Details - Iceland Adventure',
      status: 'sent',
      sentTime: '2024-12-12T08:45:00',
      provider: 'SMTP',
    },
    {
      id: '4',
      email: 'sarah@example.com',
      subject: 'Booking Reminder',
      status: 'failed',
      sentTime: '2024-12-12T07:20:00',
      provider: 'SendGrid',
      errorMessage: 'Timeout while connecting to server',
    },
    {
      id: '5',
      email: 'unsubscribed@example.com',
      subject: 'Special Offers - December',
      status: 'unsubscribed',
      sentTime: '2024-12-11T14:30:00',
      provider: 'SMTP',
      errorMessage: 'User has unsubscribed',
    },
  ];

  const displayLogs = logs.length > 0 ? logs : sampleLogs;

  // Filter and search
  const filteredLogs = displayLogs.filter((log) => {
    const statusMatch = filterStatus === 'all' || log.status === filterStatus;
    const searchMatch =
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleViewDetails = (log: EmailLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'bounced':
        return 'bg-orange-100 text-orange-800';
      case 'unsubscribed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'pending':
        return '⏳';
      case 'failed':
        return '✗';
      case 'bounced':
        return '⚠';
      case 'unsubscribed':
        return '🚫';
      default:
        return '•';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Activity Logs</h3>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by email or subject..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="sent">Sent</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="bounced">Bounced</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Sent</p>
            <p className="text-lg font-bold text-green-700">
              {displayLogs.filter((l) => l.status === 'sent').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Pending</p>
            <p className="text-lg font-bold text-yellow-700">
              {displayLogs.filter((l) => l.status === 'pending').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Failed</p>
            <p className="text-lg font-bold text-red-700">
              {displayLogs.filter((l) => l.status === 'failed').length}
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Bounced</p>
            <p className="text-lg font-bold text-orange-700">
              {displayLogs.filter((l) => l.status === 'bounced').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">Unsubscribed</p>
            <p className="text-lg font-bold text-gray-700">
              {displayLogs.filter((l) => l.status === 'unsubscribed').length}
            </p>
          </div>
        </div>

        {/* Table */}
        {paginatedLogs.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No email logs found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Subject</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Sent Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{log.email}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={log.subject}>
                        {log.subject}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)} {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{log.provider}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {new Date(log.sentTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of{' '}
                  {filteredLogs.length} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {selectedLog && (
        <EmailLogModal
          isOpen={isModalOpen}
          log={selectedLog}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLog(null);
          }}
        />
      )}
    </>
  );
};
