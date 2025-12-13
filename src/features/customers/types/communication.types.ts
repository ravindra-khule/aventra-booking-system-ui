/**
 * Communication Types - Customer communications, interactions, and history
 */

export type CommunicationType = 'email' | 'sms' | 'call' | 'note';
export type CommunicationStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'pending' | 'completed';
export type CommunicationDirection = 'inbound' | 'outbound';

/**
 * Communication Log Entry - Records all customer interactions
 */
export interface CommunicationLog {
  id: string;
  customerId: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  status: CommunicationStatus;
  subject?: string;
  content: string;
  sender: {
    name: string;
    email?: string;
    phone?: string;
    type: 'customer' | 'staff';
  };
  recipient: {
    name: string;
    email?: string;
    phone?: string;
  };
  timestamp: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  responseTime?: number; // in minutes
  templateId?: string;
  templateName?: string;
  attachments: Attachment[];
  internalNotes?: string;
  tags: string[];
  relatedBookingId?: string;
  relatedBookingReference?: string;
  metadata?: Record<string, any>;
}

/**
 * Communication Attachment
 */
export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  url?: string;
}

/**
 * Communication Timeline Entry - Simplified view for timeline
 */
export interface CommunicationTimelineEntry {
  id: string;
  type: CommunicationType;
  timestamp: string;
  title: string;
  preview: string;
  status: CommunicationStatus;
  tags: string[];
}

/**
 * Communication Template (reference data)
 */
export interface CommunicationTemplate {
  id: string;
  name: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  variables: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Communication Filter Options
 */
export interface CommunicationFilter {
  customerId?: string;
  types?: CommunicationType[];
  statuses?: CommunicationStatus[];
  directions?: CommunicationDirection[];
  dateFrom?: string;
  dateTo?: string;
  searchText?: string;
  templates?: string[];
  tags?: string[];
  hasAttachments?: boolean;
  relatedBookingId?: string;
}

/**
 * Communication Analytics
 */
export interface CommunicationAnalytics {
  totalCommunications: number;
  communicationsByType: {
    email: number;
    sms: number;
    call: number;
    note: number;
  };
  communicationsByStatus: Record<CommunicationStatus, number>;
  averageResponseTime: number; // in minutes
  deliveryRate: number; // percentage
  readRate: number; // percentage
  lastCommunicationDate: string;
  activeConversations: number;
}

/**
 * Communication Export Format
 */
export interface CommunicationExport {
  format: 'csv' | 'pdf' | 'json';
  includeAttachments: boolean;
  dateRange: {
    from: string;
    to: string;
  };
  filters: CommunicationFilter;
}

/**
 * Communication Statistics
 */
export interface CommunicationStats {
  date: string;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  averageResponseTime: number;
}
