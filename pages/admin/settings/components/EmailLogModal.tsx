import React from 'react';
import { EmailLog } from '../types/emailSettings';

interface EmailLogModalProps {
  isOpen: boolean;
  log: EmailLog;
  onClose: () => void;
}

export const EmailLogModal: React.FC<EmailLogModalProps> = ({ isOpen, log, onClose }) => {
  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Email Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Status</span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(log.status)}`}>
                {getStatusIcon(log.status)} {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
              </span>
            </div>
            {log.errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">
                  <span className="font-semibold">Error:</span> {log.errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Email Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
              <p className="text-base text-gray-900 font-mono bg-gray-50 rounded p-2">{log.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <p className="text-base text-gray-900">{log.subject}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <p className="text-base text-gray-900">{log.provider}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sent Time</label>
                <p className="text-base text-gray-900">{new Date(log.sentTime).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Additional Information</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-blue-800">Log ID:</dt>
                <dd className="text-blue-700 font-mono">{log.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-blue-800">Timestamp:</dt>
                <dd className="text-blue-700">{new Date(log.sentTime).toISOString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-blue-800">Provider Type:</dt>
                <dd className="text-blue-700">
                  {log.provider === 'SMTP' ? 'SMTP Server' : 'SendGrid API'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
              Resend Email
            </button>
            <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
              Export Details
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
