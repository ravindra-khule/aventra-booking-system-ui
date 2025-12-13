import React from 'react';
import { CommunicationLog } from '../types/communication.types';
import { Mail, MessageSquare, Phone, Paperclip, Clock, Check, AlertCircle, Eye } from 'lucide-react';
import { Badge } from '../../../shared/components/ui';
import { formatDate } from '../../../shared/utils';

interface CommunicationCardProps {
  communication: CommunicationLog;
  onClick?: () => void;
  isSelected?: boolean;
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    sent: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    read: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getTypeIcon = (type: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    call: <Phone className="h-4 w-4" />,
    note: <Paperclip className="h-4 w-4" />,
  };
  return icons[type] || <MessageSquare className="h-4 w-4" />;
};

const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    email: 'text-blue-600 bg-blue-50',
    sms: 'text-green-600 bg-green-50',
    call: 'text-purple-600 bg-purple-50',
    note: 'text-orange-600 bg-orange-50',
  };
  return colors[type] || 'text-gray-600 bg-gray-50';
};

/**
 * Communication Card Component
 * Displays a single communication entry with key information
 */
export const CommunicationCard: React.FC<CommunicationCardProps> = ({ communication, onClick, isSelected = false }) => {
  const title = communication.subject || `${communication.type.charAt(0).toUpperCase() + communication.type.slice(1)} with ${communication.recipient.name}`;
  const isInbound = communication.direction === 'inbound';
  const senderName = isInbound ? communication.sender.name : 'You';

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon and Type */}
          <div className={`flex-shrink-0 p-2 rounded-lg ${getTypeColor(communication.type)}`}>
            {getTypeIcon(communication.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm truncate">{title}</h4>
              {communication.attachments.length > 0 && <Paperclip className="h-4 w-4 text-gray-400 flex-shrink-0" />}
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{communication.content}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">{senderName}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{formatDate(communication.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Status and Badges */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {communication.status === 'read' && <Eye className="h-4 w-4 text-green-600" />}
          {communication.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-600" />}
          <Badge variant="secondary" className={`whitespace-nowrap text-xs ${getStatusColor(communication.status)}`}>
            {communication.status}
          </Badge>
        </div>
      </div>

      {/* Tags */}
      {communication.tags.length > 0 && (
        <div className="flex gap-1 mt-3 flex-wrap">
          {communication.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {communication.tags.length > 3 && <span className="text-xs text-gray-500 px-2 py-1">+{communication.tags.length - 3}</span>}
        </div>
      )}
    </div>
  );
};

export default CommunicationCard;
