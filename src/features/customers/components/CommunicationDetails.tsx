import React from 'react';
import { CommunicationLog } from '../types/communication.types';
import { Mail, MessageSquare, Phone, FileText, Clock, CheckCircle, AlertCircle, User, Copy } from 'lucide-react';
import { Button } from '../../../shared/components/ui';
import { formatDate } from '../../../shared/utils';

interface CommunicationDetailsProps {
  communication: CommunicationLog;
  onClose: () => void;
  onReply?: () => void;
}

const getTypeIcon = (type: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="h-5 w-5" />,
    sms: <MessageSquare className="h-5 w-5" />,
    call: <Phone className="h-5 w-5" />,
    note: <FileText className="h-5 w-5" />,
  };
  return icons[type] || <MessageSquare className="h-5 w-5" />;
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'delivered':
    case 'read':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'failed':
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

/**
 * Communication Details Panel
 * Shows complete details of a communication entry
 */
export const CommunicationDetails: React.FC<CommunicationDetailsProps> = ({ communication, onClose, onReply }) => {
  const [copiedContent, setCopiedContent] = React.useState(false);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(communication.content);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border shadow-lg overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-gray-50 border-b px-6 py-4 flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-3 rounded-lg bg-white border">
            {getTypeIcon(communication.type)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {communication.subject || `${communication.type.charAt(0).toUpperCase() + communication.type.slice(1)} Conversation`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {communication.direction === 'inbound' ? 'From' : 'To'}: {communication.direction === 'inbound' ? communication.sender.name : communication.recipient.name}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
          ×
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Status and Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(communication.status)}
              <span className="text-sm font-medium text-gray-900 capitalize">{communication.status}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
            <p className="text-sm font-medium text-gray-900 capitalize mt-1">{communication.type}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sent At</label>
            <p className="text-sm text-gray-700 mt-1">{formatDate(communication.sentAt)}</p>
          </div>
          {communication.deliveredAt && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Delivered</label>
              <p className="text-sm text-gray-700 mt-1">{formatDate(communication.deliveredAt)}</p>
            </div>
          )}
          {communication.readAt && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Read At</label>
              <p className="text-sm text-gray-700 mt-1">{formatDate(communication.readAt)}</p>
            </div>
          )}
          {communication.responseTime && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Response Time</label>
              <p className="text-sm text-gray-700 mt-1">{communication.responseTime} min</p>
            </div>
          )}
        </div>

        {/* Sender and Recipient */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Participants</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">From</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{communication.sender.name}</p>
                  {communication.sender.email && <p className="text-xs text-gray-600">{communication.sender.email}</p>}
                  {communication.sender.phone && <p className="text-xs text-gray-600">{communication.sender.phone}</p>}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">To</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{communication.recipient.name}</p>
                  {communication.recipient.email && <p className="text-xs text-gray-600">{communication.recipient.email}</p>}
                  {communication.recipient.phone && <p className="text-xs text-gray-600">{communication.recipient.phone}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Template Info */}
        {communication.templateName && (
          <div className="border-t pt-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Template Used</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900">{communication.templateName}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Message Content</h3>
            <button
              onClick={handleCopyContent}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              title="Copy content"
            >
              <Copy className="h-3 w-3" />
              {copiedContent ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{communication.content}</p>
          </div>
        </div>

        {/* Attachments */}
        {communication.attachments.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Attachments ({communication.attachments.length})</h3>
            <div className="space-y-2">
              {communication.attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{attachment.fileName}</p>
                      <p className="text-xs text-gray-600">{(attachment.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <a
                    href={attachment.url || '#'}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    download={attachment.fileName}
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Notes */}
        {communication.internalNotes && (
          <div className="border-t pt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-900 mb-2">Internal Notes</h3>
            <p className="text-sm text-yellow-800">{communication.internalNotes}</p>
          </div>
        )}

        {/* Tags */}
        {communication.tags.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Tags</h3>
            <div className="flex gap-2 flex-wrap">
              {communication.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Booking */}
        {communication.relatedBookingReference && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Related Booking</h3>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-sm font-medium text-gray-900">{communication.relatedBookingReference}</p>
              <p className="text-xs text-gray-600 mt-1">ID: {communication.relatedBookingId}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-gray-50 px-6 py-4 flex gap-2">
        {communication.status === 'delivered' && communication.direction === 'outbound' && (
          <Button variant="outline" size="sm">
            Resend
          </Button>
        )}
        {communication.direction === 'inbound' && onReply && (
          <Button variant="primary" size="sm" onClick={onReply}>
            Reply
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default CommunicationDetails;
