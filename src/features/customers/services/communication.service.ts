/**
 * Communication Service
 * Handles communication logs, filtering, searching, and analytics
 * 
 * Mock data is used for UI-only development
 */

import {
  CommunicationLog,
  CommunicationFilter,
  CommunicationAnalytics,
  CommunicationTemplate,
  CommunicationTimelineEntry,
} from '../types/communication.types';

/**
 * Mock Communication Templates
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

/**
 * Mock Communication Logs
 */
const MOCK_COMMUNICATIONS: CommunicationLog[] = [
  {
    id: 'comm-1',
    customerId: 'cust-1',
    type: 'email',
    direction: 'outbound',
    status: 'read',
    subject: 'Your Arctic Adventure Tour Confirmation',
    content:
      'Dear Anna, your Arctic Adventure tour starting on March 15, 2025 has been confirmed. Your booking reference is BOOK-2025-001. Please review the attached itinerary and prepare for an unforgettable experience!',
    sender: {
      name: 'Swett Support Team',
      email: 'support@swett.com',
      type: 'staff',
    },
    recipient: {
      name: 'Anna Johnson',
      email: 'anna.johnson@email.com',
    },
    timestamp: '2024-12-10T09:30:00Z',
    sentAt: '2024-12-10T09:30:00Z',
    deliveredAt: '2024-12-10T09:31:00Z',
    readAt: '2024-12-10T10:15:00Z',
    responseTime: 45,
    templateId: 'tpl-1',
    templateName: 'Pre-Tour Confirmation',
    attachments: [
      {
        id: 'att-1',
        fileName: 'Arctic_Adventure_Itinerary.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        uploadedAt: '2024-12-10T09:30:00Z',
      },
    ],
    tags: ['booking-confirmation', 'important', 'attachment'],
    relatedBookingId: 'book-1',
    relatedBookingReference: 'BOOK-2025-001',
  },
  {
    id: 'comm-2',
    customerId: 'cust-1',
    type: 'sms',
    direction: 'outbound',
    status: 'delivered',
    content: 'Hi Anna! Quick reminder: Your Arctic Adventure tour starts in 5 days (March 15). Reply CONFIRM to acknowledge.',
    sender: {
      name: 'Swett Notifications',
      phone: '+46701234567',
      type: 'staff',
    },
    recipient: {
      name: 'Anna Johnson',
      phone: '+46701111111',
    },
    timestamp: '2024-12-13T14:00:00Z',
    sentAt: '2024-12-13T14:00:00Z',
    deliveredAt: '2024-12-13T14:00:30Z',
    templateId: 'tpl-2',
    templateName: 'Reminder SMS',
    attachments: [],
    tags: ['reminder', 'automated'],
    relatedBookingId: 'book-1',
    relatedBookingReference: 'BOOK-2025-001',
  },
  {
    id: 'comm-3',
    customerId: 'cust-1',
    type: 'sms',
    direction: 'inbound',
    status: 'delivered',
    content: 'Yes, I confirm! Really excited about the trip.',
    sender: {
      name: 'Anna Johnson',
      phone: '+46701111111',
      type: 'customer',
    },
    recipient: {
      name: 'Swett Support',
      phone: '+46701234567',
    },
    timestamp: '2024-12-13T14:05:00Z',
    sentAt: '2024-12-13T14:05:00Z',
    deliveredAt: '2024-12-13T14:05:15Z',
    attachments: [],
    tags: ['confirmation-reply', 'customer-response'],
    relatedBookingId: 'book-1',
  },
  {
    id: 'comm-4',
    customerId: 'cust-1',
    type: 'note',
    direction: 'inbound',
    status: 'completed',
    content: 'Customer called asking about dietary restrictions. Confirmed vegetarian meal options available. Special request noted in booking.',
    sender: {
      name: 'Maria Garcia',
      email: 'maria@swett.com',
      type: 'staff',
    },
    recipient: {
      name: 'Anna Johnson',
      email: 'anna.johnson@email.com',
    },
    timestamp: '2024-12-12T11:30:00Z',
    sentAt: '2024-12-12T11:30:00Z',
    internalNotes: 'Vegetarian meals confirmed. Update to be sent to catering team.',
    attachments: [],
    tags: ['call-log', 'special-request', 'important'],
    relatedBookingId: 'book-1',
  },
  {
    id: 'comm-5',
    customerId: 'cust-1',
    type: 'email',
    direction: 'outbound',
    status: 'sent',
    subject: 'Your Packing Checklist for Arctic Adventure',
    content: 'Dear Anna, here is your personalized packing checklist for your Arctic Adventure tour. We recommend packing light layers and waterproof clothing...',
    sender: {
      name: 'Swett Support Team',
      email: 'support@swett.com',
      type: 'staff',
    },
    recipient: {
      name: 'Anna Johnson',
      email: 'anna.johnson@email.com',
    },
    timestamp: '2024-12-11T16:45:00Z',
    sentAt: '2024-12-11T16:45:00Z',
    attachments: [
      {
        id: 'att-2',
        fileName: 'Packing_Checklist.pdf',
        fileSize: 512000,
        fileType: 'application/pdf',
        uploadedAt: '2024-12-11T16:45:00Z',
      },
    ],
    tags: ['preparation', 'attachment'],
    relatedBookingId: 'book-1',
  },
  {
    id: 'comm-6',
    customerId: 'cust-2',
    type: 'email',
    direction: 'outbound',
    status: 'failed',
    subject: 'Your Iceland Explorer Tour Confirmation',
    content: 'Dear Robert, your Iceland Explorer tour has been confirmed...',
    sender: {
      name: 'Swett Support Team',
      email: 'support@swett.com',
      type: 'staff',
    },
    recipient: {
      name: 'Robert Smith',
      email: 'invalid-email@invalid.com',
    },
    timestamp: '2024-12-09T08:00:00Z',
    sentAt: '2024-12-09T08:00:00Z',
    attachments: [],
    tags: ['failed-delivery', 'action-required'],
    relatedBookingId: 'book-2',
    relatedBookingReference: 'BOOK-2025-002',
  },
  {
    id: 'comm-7',
    customerId: 'cust-3',
    type: 'call',
    direction: 'inbound',
    status: 'completed',
    content: 'Customer inquired about group discount for 8 people. Discussed 12% group rate. Customer interested in early April dates.',
    sender: {
      name: 'Jennifer Lee',
      phone: '+46705555555',
      type: 'customer',
    },
    recipient: {
      name: 'Johan Schmidt',
      phone: '+46701234567',
    },
    timestamp: '2024-12-13T13:20:00Z',
    sentAt: '2024-12-13T13:20:00Z',
    internalNotes: 'Promising lead - group booking potential. Follow up with quote by Friday.',
    attachments: [],
    tags: ['inbound-call', 'group-inquiry', 'sales-lead'],
  },
  {
    id: 'comm-8',
    customerId: 'cust-1',
    type: 'email',
    direction: 'inbound',
    status: 'delivered',
    subject: 'RE: Your Packing Checklist for Arctic Adventure',
    content: 'Hi! Thanks for the checklist. One question - are hiking boots essential or can I wear regular waterproof shoes? Looking forward to the trip!',
    sender: {
      name: 'Anna Johnson',
      email: 'anna.johnson@email.com',
      type: 'customer',
    },
    recipient: {
      name: 'Swett Support Team',
      email: 'support@swett.com',
    },
    timestamp: '2024-12-12T09:15:00Z',
    sentAt: '2024-12-12T09:15:00Z',
    deliveredAt: '2024-12-12T09:16:00Z',
    attachments: [],
    tags: ['customer-inquiry', 'response-needed'],
    relatedBookingId: 'book-1',
  },
];

class CommunicationService {
  /**
   * Get all communications with optional filtering
   */
  static async getAll(filter?: CommunicationFilter): Promise<CommunicationLog[]> {
    await this.delay(300);
    return this.filterCommunications(MOCK_COMMUNICATIONS, filter);
  }

  /**
   * Get communications for a specific customer
   */
  static async getByCustomer(customerId: string, filter?: CommunicationFilter): Promise<CommunicationLog[]> {
    await this.delay(250);
    const filtered = MOCK_COMMUNICATIONS.filter(c => c.customerId === customerId);
    return this.filterCommunications(filtered, filter);
  }

  /**
   * Get a single communication by ID
   */
  static async getById(id: string): Promise<CommunicationLog | null> {
    await this.delay(100);
    return MOCK_COMMUNICATIONS.find(c => c.id === id) || null;
  }

  /**
   * Search communications
   */
  static async search(query: string, customerId?: string): Promise<CommunicationLog[]> {
    await this.delay(300);
    const q = query.toLowerCase();
    let results = MOCK_COMMUNICATIONS;

    if (customerId) {
      results = results.filter(c => c.customerId === customerId);
    }

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
   * Get communication timeline for a customer
   */
  static async getTimeline(customerId: string, limit: number = 20): Promise<CommunicationTimelineEntry[]> {
    await this.delay(250);
    const communications = MOCK_COMMUNICATIONS.filter(c => c.customerId === customerId).sort(
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
    await this.delay(150);
    if (type) {
      return MOCK_TEMPLATES.filter(t => t.type === type);
    }
    return MOCK_TEMPLATES;
  }

  /**
   * Get communication analytics
   */
  static async getAnalytics(customerId?: string, dateFrom?: string, dateTo?: string): Promise<CommunicationAnalytics> {
    await this.delay(400);

    let communications = MOCK_COMMUNICATIONS;

    if (customerId) {
      communications = communications.filter(c => c.customerId === customerId);
    }

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
    await this.delay(500);
    const communications = this.filterCommunications(MOCK_COMMUNICATIONS, filter);

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

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default CommunicationService;
