/**
 * Communication Service
 * Handles communication logs, filtering, searching, and analytics
 * Calls real backend APIs for persistence
 */

import {
  CommunicationLog,
  CommunicationFilter,
  CommunicationAnalytics,
  CommunicationTemplate,
  CommunicationTimelineEntry,
} from '../types/communication.types';

const API_BASE = () => (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;

const parseJson = <T>(value: T | string | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch {
      return fallback;
    }
  }
  return value;
};

/**
 * Map API response (snake_case) to camelCase CommunicationLog type
 */
const mapCommunicationFromApi = (data: any): CommunicationLog => ({
  id: String(data.id),
  customerId: data.customer_id !== null && data.customer_id !== undefined
    ? String(data.customer_id)
    : String(data.customerId ?? ''),
  type: data.type,
  direction: data.direction,
  status: data.status,
  subject: data.subject || undefined,
  content: data.content || '',
  sender: {
    name: data.sender_name ?? data.sender?.name ?? '',
    email: data.sender_email ?? data.sender?.email ?? undefined,
    phone: data.sender_phone ?? data.sender?.phone ?? undefined,
    type: data.sender_type ?? data.sender?.type ?? 'staff',
  },
  recipient: {
    name: data.recipient_name ?? data.recipient?.name ?? '',
    email: data.recipient_email ?? data.recipient?.email ?? undefined,
    phone: data.recipient_phone ?? data.recipient?.phone ?? undefined,
  },
  timestamp: data.sent_at || data.timestamp || data.created_at || new Date().toISOString(),
  sentAt: data.sent_at || data.sentAt || data.created_at || new Date().toISOString(),
  deliveredAt: data.delivered_at || data.deliveredAt || undefined,
  readAt: data.read_at || data.readAt || undefined,
  responseTime: data.response_time ?? data.responseTime ?? undefined,
  templateId: data.template_id || data.templateId || undefined,
  templateName: data.template_name || data.templateName || undefined,
  internalNotes: data.internal_notes || data.internalNotes || undefined,
  attachments: parseJson(data.attachments, []),
  tags: parseJson(data.tags, []),
  relatedBookingId: data.related_booking_id || data.relatedBookingId || undefined,
  relatedBookingReference: data.related_booking_reference || data.relatedBookingReference || undefined,
  metadata: parseJson(data.metadata, undefined as any) || undefined,
});

const request = async (path: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(`${API_BASE()}/api/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.error || `Request failed: ${response.status} ${response.statusText}`);
  }

  return result;
};

/**
 * Communication Templates (static reference data)
 */
const MOCK_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Pre-Tour Confirmation',
    type: 'email',
    subject: 'Your {{tour_name}} Tour Confirmation',
    content: 'Dear {{customer_name}}, your tour is confirmed for {{departure_date}}...',
    variables: ['customer_name', 'tour_name', 'departure_date', 'booking_reference'],
    category: 'Booking',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'tpl-2',
    name: 'Reminder SMS',
    type: 'sms',
    content: 'Hi {{customer_name}}, reminder: Your tour starts {{days_until}} days from now. Reply CONFIRM to confirm.',
    variables: ['customer_name', 'days_until', 'tour_name'],
    category: 'Reminder',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: 'tpl-3',
    name: 'Post-Tour Feedback',
    type: 'email',
    subject: 'How was your {{tour_name}} experience?',
    content: 'Dear {{customer_name}}, we would love to hear your feedback about your recent tour...',
    variables: ['customer_name', 'tour_name', 'booking_reference'],
    category: 'Feedback',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
];

class CommunicationService {
  /**
   * Get all communications with optional filtering
   */
  static async getAll(filter?: CommunicationFilter): Promise<CommunicationLog[]> {
    try {
      const customerParam = filter?.customerId ? `?customer_id=${encodeURIComponent(filter.customerId)}` : '';
      const result = await request(`communication-logs-list.php${customerParam}`);
      const communications = (result.data || []).map(mapCommunicationFromApi);
      return this.filterCommunications(communications, filter);
    } catch (error) {
      console.error('Error fetching communications:', error);
      return [];
    }
  }

  /**
   * Get communications for a specific customer
   */
  static async getByCustomer(customerId: string, filter?: CommunicationFilter): Promise<CommunicationLog[]> {
    try {
      const result = await request(`communication-logs-list.php?customer_id=${encodeURIComponent(customerId)}`);
      const communications = (result.data || []).map(mapCommunicationFromApi);
      return this.filterCommunications(communications, filter);
    } catch (error) {
      console.error('Error fetching customer communications:', error);
      return [];
    }
  }

  /**
   * Get a single communication by ID
   */
  static async getById(id: string): Promise<CommunicationLog | null> {
    try {
      const result = await request('communication-logs-list.php');
      const communications = (result.data || []).map(mapCommunicationFromApi);
      return communications.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error fetching communication:', error);
      return null;
    }
  }

  /**
   * Search communications
   */
  static async search(query: string, customerId?: string): Promise<CommunicationLog[]> {
    const results = customerId
      ? await this.getByCustomer(customerId)
      : await this.getAll();

    const q = query.toLowerCase();
    return results.filter(
      c =>
        c.subject?.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.sender.name.toLowerCase().includes(q) ||
        c.recipient.name.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)),
    );
  }

  /**
   * Create a new communication log entry
   */
  static async create(log: Omit<CommunicationLog, 'id'>): Promise<CommunicationLog> {
    const payload = {
      customerId: log.customerId,
      type: log.type,
      direction: log.direction,
      status: log.status,
      subject: log.subject,
      content: log.content,
      sender: log.sender,
      recipient: log.recipient,
      sentAt: log.sentAt,
      deliveredAt: log.deliveredAt,
      readAt: log.readAt,
      responseTime: log.responseTime,
      templateId: log.templateId,
      templateName: log.templateName,
      internalNotes: log.internalNotes,
      attachments: log.attachments,
      tags: log.tags,
      relatedBookingId: log.relatedBookingId,
      relatedBookingReference: log.relatedBookingReference,
      metadata: log.metadata,
    };

    const result = await request('communication-logs-create.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapCommunicationFromApi(result.data);
  }

  /**
   * Update a communication log entry
   */
  static async update(id: string, updates: Partial<CommunicationLog>): Promise<CommunicationLog> {
    const payload: any = { id };

    if (updates.customerId !== undefined) payload.customerId = updates.customerId;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.direction !== undefined) payload.direction = updates.direction;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.subject !== undefined) payload.subject = updates.subject;
    if (updates.content !== undefined) payload.content = updates.content;
    if (updates.sender !== undefined) payload.sender = updates.sender;
    if (updates.recipient !== undefined) payload.recipient = updates.recipient;
    if (updates.sentAt !== undefined) payload.sentAt = updates.sentAt;
    if (updates.deliveredAt !== undefined) payload.deliveredAt = updates.deliveredAt;
    if (updates.readAt !== undefined) payload.readAt = updates.readAt;
    if (updates.responseTime !== undefined) payload.responseTime = updates.responseTime;
    if (updates.templateId !== undefined) payload.templateId = updates.templateId;
    if (updates.templateName !== undefined) payload.templateName = updates.templateName;
    if (updates.internalNotes !== undefined) payload.internalNotes = updates.internalNotes;
    if (updates.attachments !== undefined) payload.attachments = updates.attachments;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.relatedBookingId !== undefined) payload.relatedBookingId = updates.relatedBookingId;
    if (updates.relatedBookingReference !== undefined) payload.relatedBookingReference = updates.relatedBookingReference;
    if (updates.metadata !== undefined) payload.metadata = updates.metadata;

    const result = await request('communication-logs-update.php', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return mapCommunicationFromApi(result.data);
  }

  /**
   * Delete a communication log entry
   */
  static async delete(id: string): Promise<void> {
    await request('communication-logs-delete.php', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  }

  /**
   * Get communication timeline for a customer
   */
  static async getTimeline(customerId: string, limit: number = 20): Promise<CommunicationTimelineEntry[]> {
    const communications = (await this.getByCustomer(customerId)).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return communications.slice(0, limit).map(c => ({
      id: c.id,
      type: c.type,
      timestamp: c.timestamp,
      title: c.subject || this.getCommunicationTitle(c),
      preview: c.content.substring(0, 80) + (c.content.length > 80 ? '...' : ''),
      status: c.status,
      tags: c.tags,
    }));
  }

  /**
   * Get templates by type
   */
  static async getTemplates(type?: string): Promise<CommunicationTemplate[]> {
    if (type) {
      return MOCK_TEMPLATES.filter(t => t.type === type);
    }
    return MOCK_TEMPLATES;
  }

  /**
   * Get communication analytics
   */
  static async getAnalytics(customerId?: string, dateFrom?: string, dateTo?: string): Promise<CommunicationAnalytics> {
    let communications = customerId
      ? await this.getByCustomer(customerId)
      : await this.getAll();

    if (dateFrom && dateTo) {
      const from = new Date(dateFrom).getTime();
      const to = new Date(dateTo).getTime();
      communications = communications.filter(c => {
        const time = new Date(c.timestamp).getTime();
        return time >= from && time <= to;
      });
    }

    const emailCount = communications.filter(c => c.type === 'email').length;
    const smsCount = communications.filter(c => c.type === 'sms').length;
    const callCount = communications.filter(c => c.type === 'call').length;
    const noteCount = communications.filter(c => c.type === 'note').length;

    const deliveredCount = communications.filter(c => c.status === 'delivered' || c.status === 'read').length;
    const readCount = communications.filter(c => c.status === 'read').length;
    const totalSent = communications.filter(c => c.direction === 'outbound').length;
    const failedCount = communications.filter(c => c.status === 'failed').length;

    const responseTimes = communications
      .filter(c => c.responseTime)
      .map(c => c.responseTime || 0);
    const avgResponseTime = responseTimes.length > 0 ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;

    return {
      totalCommunications: communications.length,
      communicationsByType: {
        email: emailCount,
        sms: smsCount,
        call: callCount,
        note: noteCount,
      },
      communicationsByStatus: {
        sent: communications.filter(c => c.status === 'sent').length,
        delivered: deliveredCount,
        read: readCount,
        failed: failedCount,
        pending: communications.filter(c => c.status === 'pending').length,
        completed: communications.filter(c => c.status === 'completed').length,
      },
      averageResponseTime: avgResponseTime,
      deliveryRate: totalSent > 0 ? Math.round((deliveredCount / totalSent) * 100) : 0,
      readRate: deliveredCount > 0 ? Math.round((readCount / deliveredCount) * 100) : 0,
      lastCommunicationDate: communications.length > 0
        ? communications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp
        : new Date().toISOString(),
      activeConversations: new Set(communications.map(c => c.customerId)).size,
    };
  }

  /**
   * Export communications
   */
  static async exportCommunications(format: 'csv' | 'pdf' | 'json', filter?: CommunicationFilter): Promise<string> {
    const communications = await this.getAll(filter);

    switch (format) {
      case 'json':
        return JSON.stringify(communications, null, 2);
      case 'csv':
        return this.generateCSV(communications);
      case 'pdf':
        return 'pdf-export-data'; // PDF generation would be handled client-side
      default:
        return '';
    }
  }

  /**
   * Private helper methods
   */
  private static filterCommunications(communications: CommunicationLog[], filter?: CommunicationFilter): CommunicationLog[] {
    if (!filter) return communications;

    return communications.filter(c => {
      if (filter.types && !filter.types.includes(c.type)) return false;
      if (filter.statuses && !filter.statuses.includes(c.status)) return false;
      if (filter.directions && !filter.directions.includes(c.direction)) return false;

      if (filter.searchText) {
        const q = filter.searchText.toLowerCase();
        if (
          !c.subject?.toLowerCase().includes(q) &&
          !c.content.toLowerCase().includes(q) &&
          !c.sender.name.toLowerCase().includes(q) &&
          !c.recipient.name.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (filter.dateFrom) {
        const from = new Date(filter.dateFrom).getTime();
        if (new Date(c.timestamp).getTime() < from) return false;
      }

      if (filter.dateTo) {
        const to = new Date(filter.dateTo).getTime();
        if (new Date(c.timestamp).getTime() > to) return false;
      }

      if (filter.hasAttachments !== undefined) {
        const hasAttachments = c.attachments.length > 0;
        if (filter.hasAttachments !== hasAttachments) return false;
      }

      if (filter.templates && filter.templates.length > 0) {
        if (!c.templateId || !filter.templates.includes(c.templateId)) return false;
      }

      if (filter.tags && filter.tags.length > 0) {
        if (!filter.tags.some(tag => c.tags.includes(tag))) return false;
      }

      return true;
    });
  }

  private static getCommunicationTitle(comm: CommunicationLog): string {
    if (comm.subject) return comm.subject;
    if (comm.type === 'call') return `Call with ${comm.sender.type === 'customer' ? comm.sender.name : comm.recipient.name}`;
    if (comm.type === 'note') return 'Internal Note';
    return `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} to ${comm.recipient.name}`;
  }

  private static generateCSV(communications: CommunicationLog[]): string {
    const headers = ['ID', 'Type', 'Status', 'Direction', 'Sent At', 'Subject', 'From', 'To', 'Tags'];
    const rows = communications.map(c => [
      c.id,
      c.type,
      c.status,
      c.direction,
      new Date(c.sentAt).toLocaleString(),
      c.subject || '',
      c.sender.name,
      c.recipient.name,
      c.tags.join('; '),
    ]);

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
}

export default CommunicationService;
