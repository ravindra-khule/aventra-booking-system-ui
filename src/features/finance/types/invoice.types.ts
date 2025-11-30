/**
 * Invoice Types - Invoice generation, management, and tracking
 */

// Invoice status enum
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

// Payment method enum
export enum PaymentMethod {
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH',
  SWISH = 'SWISH',
  OTHER = 'OTHER'
}

// Invoice line item interface
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // Percentage (e.g., 25 for 25%)
  amount: number; // quantity * unitPrice
  taxAmount: number; // amount * (taxRate / 100)
  total: number; // amount + taxAmount
}

// Tax rate interface for VAT/sales tax
export interface TaxRate {
  id: string;
  name: string;
  rate: number; // Percentage
  isDefault: boolean;
}

// Invoice recipient (customer) interface
export interface InvoiceRecipient {
  customerId?: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  vatNumber?: string; // For B2B invoices
  organizationNumber?: string; // Swedish org.nr
}

// Payment details interface
export interface PaymentDetails {
  method: PaymentMethod;
  paidAmount: number;
  paidDate?: string;
  transactionId?: string;
  reference?: string; // OCR number or payment reference
}

// Invoice settings/template interface
export interface InvoiceTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  logoUrl?: string;
  primaryColor: string;
  headerText?: string;
  footerText?: string;
  termsAndConditions?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    swiftBic?: string;
    iban?: string;
  };
}

// Credit note interface (for adjustments and refunds)
export interface CreditNote {
  id: string;
  invoiceId: string;
  creditNoteNumber: string;
  issueDate: string;
  amount: number;
  reason: string;
  lineItems: InvoiceLineItem[];
}

// Main invoice interface
export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId?: string; // Link to booking if auto-generated
  
  // Dates
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  
  // Status
  status: InvoiceStatus;
  
  // Recipient
  recipient: InvoiceRecipient;
  
  // Line items and totals
  lineItems: InvoiceLineItem[];
  subtotal: number; // Sum of all line items before tax
  totalTax: number; // Sum of all tax amounts
  totalAmount: number; // subtotal + totalTax
  
  // Discounts
  discountAmount?: number;
  discountReason?: string;
  
  // Payment
  paidAmount: number;
  paymentDetails?: PaymentDetails;
  
  // Currency
  currency: string; // ISO code (SEK, EUR, USD, etc.)
  exchangeRate?: number; // If different from base currency
  
  // References
  reference?: string; // Customer reference
  ourReference?: string; // Internal reference
  
  // Template
  templateId?: string;
  
  // Notes
  notes?: string;
  internalNotes?: string; // Not visible to customer
  
  // Reminders
  remindersSent: number;
  lastReminderDate?: string;
  
  // Credit notes
  creditNotes?: CreditNote[];
  
  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  sentAt?: string;
  
  // Fortnox integration
  fortnoxId?: string;
  fortnoxUrl?: string;
}

// Invoice filter options
export interface InvoiceFilters {
  status?: InvoiceStatus[];
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  bookingId?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  search?: string; // Search in invoice number, customer name, etc.
}

// Invoice statistics
export interface InvoiceStats {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  cancelled: number;
  
  totalRevenue: number;
  paidRevenue: number;
  outstandingRevenue: number;
  overdueRevenue: number;
  
  averageInvoiceValue: number;
  averagePaymentTime: number; // Days
}

// Invoice creation input
export interface CreateInvoiceInput {
  bookingId?: string;
  recipient: InvoiceRecipient;
  lineItems: Omit<InvoiceLineItem, 'id' | 'amount' | 'taxAmount' | 'total'>[];
  dueDate: string;
  currency?: string;
  discountAmount?: number;
  discountReason?: string;
  reference?: string;
  ourReference?: string;
  notes?: string;
  internalNotes?: string;
  templateId?: string;
}

// Invoice update input
export interface UpdateInvoiceInput {
  recipient?: Partial<InvoiceRecipient>;
  lineItems?: Omit<InvoiceLineItem, 'id' | 'amount' | 'taxAmount' | 'total'>[];
  dueDate?: string;
  status?: InvoiceStatus;
  discountAmount?: number;
  discountReason?: string;
  reference?: string;
  ourReference?: string;
  notes?: string;
  internalNotes?: string;
}

// Payment recording input
export interface RecordPaymentInput {
  method: PaymentMethod;
  amount: number;
  paidDate: string;
  transactionId?: string;
  reference?: string;
}

// Invoice email options
export interface SendInvoiceOptions {
  to: string;
  cc?: string[];
  subject?: string;
  message?: string;
  attachPdf: boolean;
}

// Payment reminder options
export interface PaymentReminderOptions {
  invoiceId: string;
  reminderLevel: number; // 1st, 2nd, 3rd reminder
  customMessage?: string;
}

// Export options
export interface InvoiceExportOptions {
  format: 'PDF' | 'CSV' | 'EXCEL';
  invoiceIds?: string[];
  filters?: InvoiceFilters;
  includeLineItems?: boolean;
}
