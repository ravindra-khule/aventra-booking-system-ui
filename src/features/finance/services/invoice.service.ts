/**
 * Invoice Service - Invoice management and operations
 */

import {
  Invoice,
  InvoiceStatus,
  InvoiceFilters,
  InvoiceStats,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  RecordPaymentInput,
  SendInvoiceOptions,
  PaymentReminderOptions,
  InvoiceExportOptions,
  InvoiceLineItem,
  InvoiceTemplate,
  CreditNote,
  PaymentMethod,
} from '../types/invoice.types';

// Mock data storage
let invoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    bookingId: 'book-1',
    issueDate: '2025-11-15',
    dueDate: '2025-12-15',
    paidDate: '2025-11-20',
    status: InvoiceStatus.PAID,
    recipient: {
      customerId: 'cust-1',
      name: 'Erik Andersson',
      email: 'erik.andersson@example.com',
      phone: '+46701234567',
      address: 'Storgatan 1',
      zipCode: '111 22',
      city: 'Stockholm',
      country: 'Sweden',
    },
    lineItems: [
      {
        id: 'line-1',
        description: 'Island Adventure Tour - 2 persons',
        quantity: 2,
        unitPrice: 12000,
        taxRate: 12,
        amount: 24000,
        taxAmount: 2880,
        total: 26880,
      },
    ],
    subtotal: 24000,
    totalTax: 2880,
    totalAmount: 26880,
    paidAmount: 26880,
    paymentDetails: {
      method: PaymentMethod.STRIPE,
      paidAmount: 26880,
      paidDate: '2025-11-20',
      transactionId: 'pi_3abc123',
    },
    currency: 'SEK',
    remindersSent: 0,
    createdAt: '2025-11-15T10:00:00Z',
    createdBy: 'admin',
    updatedAt: '2025-11-20T14:30:00Z',
    sentAt: '2025-11-15T10:05:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    bookingId: 'book-2',
    issueDate: '2025-11-20',
    dueDate: '2025-12-20',
    status: InvoiceStatus.SENT,
    recipient: {
      customerId: 'cust-2',
      name: 'Anna Svensson',
      email: 'anna.svensson@example.com',
      phone: '+46709876543',
      address: 'Vasagatan 10',
      zipCode: '222 33',
      city: 'Gothenburg',
      country: 'Sweden',
    },
    lineItems: [
      {
        id: 'line-2',
        description: 'Mountain Hiking Tour - 1 person',
        quantity: 1,
        unitPrice: 8500,
        taxRate: 12,
        amount: 8500,
        taxAmount: 1020,
        total: 9520,
      },
      {
        id: 'line-3',
        description: 'Equipment Rental',
        quantity: 1,
        unitPrice: 500,
        taxRate: 25,
        amount: 500,
        taxAmount: 125,
        total: 625,
      },
    ],
    subtotal: 9000,
    totalTax: 1145,
    totalAmount: 10145,
    paidAmount: 0,
    currency: 'SEK',
    remindersSent: 0,
    createdAt: '2025-11-20T14:00:00Z',
    createdBy: 'admin',
    updatedAt: '2025-11-20T14:05:00Z',
    sentAt: '2025-11-20T14:05:00Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    issueDate: '2025-10-15',
    dueDate: '2025-11-15',
    status: InvoiceStatus.OVERDUE,
    recipient: {
      customerId: 'cust-3',
      name: 'Lars Johansson',
      email: 'lars.johansson@example.com',
      phone: '+46703456789',
      address: 'Kungsgatan 5',
      zipCode: '333 44',
      city: 'Malmö',
      country: 'Sweden',
    },
    lineItems: [
      {
        id: 'line-4',
        description: 'Coastal Experience - 3 persons',
        quantity: 3,
        unitPrice: 7500,
        taxRate: 12,
        amount: 22500,
        taxAmount: 2700,
        total: 25200,
      },
    ],
    subtotal: 22500,
    totalTax: 2700,
    totalAmount: 25200,
    paidAmount: 0,
    currency: 'SEK',
    remindersSent: 2,
    lastReminderDate: '2025-11-25',
    createdAt: '2025-10-15T09:00:00Z',
    createdBy: 'admin',
    updatedAt: '2025-11-25T10:00:00Z',
    sentAt: '2025-10-15T09:05:00Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-004',
    issueDate: '2025-11-28',
    dueDate: '2025-12-28',
    status: InvoiceStatus.DRAFT,
    recipient: {
      name: 'Maria Karlsson',
      email: 'maria.karlsson@example.com',
      address: 'Drottninggatan 20',
      zipCode: '444 55',
      city: 'Uppsala',
      country: 'Sweden',
    },
    lineItems: [
      {
        id: 'line-5',
        description: 'Winter Wonderland Tour - 4 persons',
        quantity: 4,
        unitPrice: 15000,
        taxRate: 12,
        amount: 60000,
        taxAmount: 7200,
        total: 67200,
      },
    ],
    subtotal: 60000,
    totalTax: 7200,
    totalAmount: 67200,
    paidAmount: 0,
    currency: 'SEK',
    remindersSent: 0,
    createdAt: '2025-11-28T11:00:00Z',
    createdBy: 'admin',
    updatedAt: '2025-11-28T11:00:00Z',
  },
];

let templates: InvoiceTemplate[] = [
  {
    id: 'template-1',
    name: 'Default Template',
    isDefault: true,
    primaryColor: '#2563eb',
    headerText: 'Aventra Tours',
    footerText: 'Thank you for choosing Aventra Tours!',
    termsAndConditions: 'Payment due within 30 days. Late payments may incur additional fees.',
    bankDetails: {
      bankName: 'Swedbank',
      accountNumber: '1234-567890',
      swiftBic: 'SWEDSESS',
      iban: 'SE45 5000 0000 0583 9825 7466',
    },
  },
];

class InvoiceServiceClass {
  // Generate next invoice number
  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, '0')}`;
  }

  // Calculate line item totals
  private calculateLineItem(
    item: Omit<InvoiceLineItem, 'id' | 'amount' | 'taxAmount' | 'total'>
  ): InvoiceLineItem {
    const amount = item.quantity * item.unitPrice;
    const taxAmount = amount * (item.taxRate / 100);
    const total = amount + taxAmount;

    return {
      ...item,
      id: `line-${Date.now()}-${Math.random()}`,
      amount,
      taxAmount,
      total,
    };
  }

  // Calculate invoice totals
  private calculateTotals(lineItems: InvoiceLineItem[], discountAmount: number = 0) {
    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = subtotal + totalTax - discountAmount;

    return { subtotal, totalTax, totalAmount };
  }

  // Get all invoices with optional filtering
  async getInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...invoices];

    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(inv => filters.status!.includes(inv.status));
      }

      if (filters.dateFrom) {
        filtered = filtered.filter(inv => inv.issueDate >= filters.dateFrom!);
      }

      if (filters.dateTo) {
        filtered = filtered.filter(inv => inv.issueDate <= filters.dateTo!);
      }

      if (filters.customerId) {
        filtered = filtered.filter(inv => inv.recipient.customerId === filters.customerId);
      }

      if (filters.bookingId) {
        filtered = filtered.filter(inv => inv.bookingId === filters.bookingId);
      }

      if (filters.minAmount !== undefined) {
        filtered = filtered.filter(inv => inv.totalAmount >= filters.minAmount!);
      }

      if (filters.maxAmount !== undefined) {
        filtered = filtered.filter(inv => inv.totalAmount <= filters.maxAmount!);
      }

      if (filters.currency) {
        filtered = filtered.filter(inv => inv.currency === filters.currency);
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(
          inv =>
            inv.invoiceNumber.toLowerCase().includes(search) ||
            inv.recipient.name.toLowerCase().includes(search) ||
            inv.recipient.email.toLowerCase().includes(search)
        );
      }
    }

    // Sort by issue date (newest first)
    return filtered.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  // Get single invoice by ID
  async getInvoiceById(id: string): Promise<Invoice | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return invoices.find(inv => inv.id === id) || null;
  }

  // Create new invoice
  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const lineItems = input.lineItems.map(item => this.calculateLineItem(item));
    const { subtotal, totalTax, totalAmount } = this.calculateTotals(
      lineItems,
      input.discountAmount || 0
    );

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: this.generateInvoiceNumber(),
      bookingId: input.bookingId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: input.dueDate,
      status: InvoiceStatus.DRAFT,
      recipient: input.recipient,
      lineItems,
      subtotal,
      totalTax,
      totalAmount,
      paidAmount: 0,
      discountAmount: input.discountAmount,
      discountReason: input.discountReason,
      currency: input.currency || 'SEK',
      reference: input.reference,
      ourReference: input.ourReference,
      notes: input.notes,
      internalNotes: input.internalNotes,
      templateId: input.templateId || templates.find(t => t.isDefault)?.id,
      remindersSent: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'admin', // TODO: Get from auth context
      updatedAt: new Date().toISOString(),
    };

    invoices.push(invoice);
    return invoice;
  }

  // Update existing invoice
  async updateInvoice(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
      throw new Error('Cannot update paid or cancelled invoice');
    }

    if (input.recipient) {
      invoice.recipient = { ...invoice.recipient, ...input.recipient };
    }

    if (input.lineItems) {
      invoice.lineItems = input.lineItems.map(item => this.calculateLineItem(item));
      const totals = this.calculateTotals(invoice.lineItems, invoice.discountAmount || 0);
      invoice.subtotal = totals.subtotal;
      invoice.totalTax = totals.totalTax;
      invoice.totalAmount = totals.totalAmount;
    }

    if (input.dueDate) invoice.dueDate = input.dueDate;
    if (input.status) invoice.status = input.status;
    if (input.discountAmount !== undefined) {
      invoice.discountAmount = input.discountAmount;
      const totals = this.calculateTotals(invoice.lineItems, input.discountAmount);
      invoice.totalAmount = totals.totalAmount;
    }
    if (input.discountReason !== undefined) invoice.discountReason = input.discountReason;
    if (input.reference !== undefined) invoice.reference = input.reference;
    if (input.ourReference !== undefined) invoice.ourReference = input.ourReference;
    if (input.notes !== undefined) invoice.notes = input.notes;
    if (input.internalNotes !== undefined) invoice.internalNotes = input.internalNotes;

    invoice.updatedAt = new Date().toISOString();

    return invoice;
  }

  // Delete invoice (only drafts)
  async deleteInvoice(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status !== InvoiceStatus.DRAFT) {
      throw new Error('Can only delete draft invoices');
    }

    invoices = invoices.filter(inv => inv.id !== id);
  }

  // Send invoice via email
  async sendInvoice(id: string, options: SendInvoiceOptions): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.DRAFT) {
      invoice.status = InvoiceStatus.SENT;
    }

    invoice.sentAt = new Date().toISOString();
    invoice.updatedAt = new Date().toISOString();

    // TODO: Integrate with email service
    console.log('Sending invoice via email:', options);

    return invoice;
  }

  // Record payment
  async recordPayment(id: string, payment: RecordPaymentInput): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.paidAmount += payment.amount;
    invoice.paymentDetails = {
      method: payment.method,
      paidAmount: payment.amount,
      paidDate: payment.paidDate,
      transactionId: payment.transactionId,
      reference: payment.reference,
    };

    if (invoice.paidAmount >= invoice.totalAmount) {
      invoice.status = InvoiceStatus.PAID;
      invoice.paidDate = payment.paidDate;
    }

    invoice.updatedAt = new Date().toISOString();

    return invoice;
  }

  // Send payment reminder
  async sendPaymentReminder(options: PaymentReminderOptions): Promise<Invoice> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const invoice = invoices.find(inv => inv.id === options.invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID || invoice.status === InvoiceStatus.CANCELLED) {
      throw new Error('Cannot send reminder for paid or cancelled invoice');
    }

    invoice.remindersSent += 1;
    invoice.lastReminderDate = new Date().toISOString().split('T')[0];
    invoice.updatedAt = new Date().toISOString();

    // TODO: Integrate with email service
    console.log('Sending payment reminder:', options);

    return invoice;
  }

  // Mark invoice as overdue (automated check)
  async checkOverdueInvoices(): Promise<Invoice[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const today = new Date().toISOString().split('T')[0];
    const overdueInvoices: Invoice[] = [];

    for (const invoice of invoices) {
      if (
        invoice.status === InvoiceStatus.SENT &&
        invoice.dueDate < today &&
        invoice.paidAmount < invoice.totalAmount
      ) {
        invoice.status = InvoiceStatus.OVERDUE;
        invoice.updatedAt = new Date().toISOString();
        overdueInvoices.push(invoice);
      }
    }

    return overdueInvoices;
  }

  // Get invoice statistics
  async getInvoiceStats(): Promise<InvoiceStats> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const stats: InvoiceStats = {
      total: invoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
      cancelled: 0,
      totalRevenue: 0,
      paidRevenue: 0,
      outstandingRevenue: 0,
      overdueRevenue: 0,
      averageInvoiceValue: 0,
      averagePaymentTime: 0,
    };

    let totalPaymentTime = 0;
    let paidInvoicesCount = 0;

    for (const invoice of invoices) {
      // Count by status
      if (invoice.status === InvoiceStatus.DRAFT) stats.draft++;
      else if (invoice.status === InvoiceStatus.SENT) stats.sent++;
      else if (invoice.status === InvoiceStatus.PAID) stats.paid++;
      else if (invoice.status === InvoiceStatus.OVERDUE) stats.overdue++;
      else if (invoice.status === InvoiceStatus.CANCELLED) stats.cancelled++;

      // Revenue calculations
      stats.totalRevenue += invoice.totalAmount;
      stats.paidRevenue += invoice.paidAmount;

      if (invoice.status !== InvoiceStatus.PAID && invoice.status !== InvoiceStatus.CANCELLED) {
        const outstanding = invoice.totalAmount - invoice.paidAmount;
        stats.outstandingRevenue += outstanding;

        if (invoice.status === InvoiceStatus.OVERDUE) {
          stats.overdueRevenue += outstanding;
        }
      }

      // Average payment time
      if (invoice.status === InvoiceStatus.PAID && invoice.paidDate) {
        const issueDate = new Date(invoice.issueDate);
        const paidDate = new Date(invoice.paidDate);
        const daysToPay = Math.floor(
          (paidDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalPaymentTime += daysToPay;
        paidInvoicesCount++;
      }
    }

    stats.averageInvoiceValue = stats.total > 0 ? stats.totalRevenue / stats.total : 0;
    stats.averagePaymentTime = paidInvoicesCount > 0 ? totalPaymentTime / paidInvoicesCount : 0;

    return stats;
  }

  // Generate invoice from booking
  async generateFromBooking(bookingId: string): Promise<Invoice> {
    // TODO: Fetch booking data and create invoice
    throw new Error('Not implemented - requires booking service integration');
  }

  // Export invoices
  async exportInvoices(options: InvoiceExportOptions): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Implement actual export functionality
    console.log('Exporting invoices:', options);

    return new Blob(['Export data'], { type: 'application/pdf' });
  }

  // Get invoice templates
  async getTemplates(): Promise<InvoiceTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...templates];
  }

  // Create or update template
  async saveTemplate(template: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (template.id) {
      const index = templates.findIndex(t => t.id === template.id);
      if (index >= 0) {
        templates[index] = { ...templates[index], ...template } as InvoiceTemplate;
        return templates[index];
      }
    }

    const newTemplate: InvoiceTemplate = {
      id: `template-${Date.now()}`,
      name: template.name || 'New Template',
      isDefault: template.isDefault || false,
      primaryColor: template.primaryColor || '#2563eb',
      headerText: template.headerText,
      footerText: template.footerText,
      termsAndConditions: template.termsAndConditions,
      bankDetails: template.bankDetails,
    };

    // If this is set as default, unset others
    if (newTemplate.isDefault) {
      templates.forEach(t => (t.isDefault = false));
    }

    templates.push(newTemplate);
    return newTemplate;
  }
}

export const InvoiceService = new InvoiceServiceClass();
