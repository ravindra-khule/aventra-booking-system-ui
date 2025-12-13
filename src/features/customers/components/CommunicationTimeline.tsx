import React from 'react';
import { CommunicationTimelineEntry } from '../types/communication.types';
import { Mail, MessageSquare, Phone, FileText, Check, AlertCircle, Clock } from 'lucide-react';
import { formatDate } from '../../../shared/utils';

interface CommunicationTimelineProps {
  entries: CommunicationTimelineEntry[];
  onEntryClick?: (entryId: string) => void;
  selectedId?: string;
}

const getTypeIcon = (type: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    call: <Phone className="h-4 w-4" />,
    note: <FileText className="h-4 w-4" />,
  };
  return icons[type] || <MessageSquare className="h-4 w-4" />;
};

const getStatusIcon = (status: string): React.ReactNode => {
  switch (status) {
    case 'delivered':
    case 'read':
    case 'completed':
      return <Check className="h-4 w-4 text-green-600" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case 'pending':
    case 'sent':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return null;
  }
};

const getTypeColor = (type: string): Record<string, string> => {
  const colors: Record<string, Record<string, string>> = {
    email: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
    sms: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600' },
    call: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600' },
    note: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
  };
  return colors[type] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600' };
};

/**
 * Communication Timeline Component
 * Displays communication history in chronological order
 */
export const CommunicationTimeline: React.FC<CommunicationTimelineProps> = ({ entries, onEntryClick, selectedId }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No communications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => {
        const typeColor = getTypeColor(entry.type);
        const isSelected = selectedId === entry.id;

        return (
          <div key={entry.id} className="relative">
            {/* Timeline connector */}
            {index < entries.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
            )}

            {/* Timeline item */}
            <div
              onClick={() => onEntryClick?.(entry.id)}
              className={`flex gap-4 cursor-pointer transition-all rounded-lg p-4 border-2 ${
                isSelected
                  ? `${typeColor.bg} border-current`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {/* Timeline dot */}
              <div className={`flex-shrink-0 relative mt-1 ${typeColor.bg} p-2 rounded-full border-2 ${typeColor.border}`}>
                <div className={typeColor.text}>{getTypeIcon(entry.type)}</div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {entry.title}
                  </h4>
                  <div className="flex-shrink-0">
                    {getStatusIcon(entry.status)}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{entry.preview}</p>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <time className="text-xs text-gray-500">{formatDate(entry.timestamp)}</time>

                  {entry.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {entry.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {entry.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{entry.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommunicationTimeline;
