/**
 * Email Template Types - Email template management and automation
 */

// Language support
export type TemplateLanguage = 'en' | 'sv';

// Template categories
export enum EmailTemplateCategory {
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  REMINDER = 'REMINDER',
  CANCELLATION = 'CANCELLATION',
  WAITLIST = 'WAITLIST',
  MARKETING = 'MARKETING',
  NOTIFICATION = 'NOTIFICATION',
  CUSTOM = 'CUSTOM'
}

// Template status
export enum EmailTemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

// Dynamic placeholder types for template variables
export enum PlaceholderType {
  // Customer placeholders
  CUSTOMER_FIRST_NAME = 'customerFirstName',
  CUSTOMER_LAST_NAME = 'customerLastName',
  CUSTOMER_FULL_NAME = 'customerFullName',
  CUSTOMER_EMAIL = 'customerEmail',
  CUSTOMER_PHONE = 'customerPhone',
  
  // Booking placeholders
  BOOKING_ID = 'bookingId',
  BOOKING_DATE = 'bookingDate',
  BOOKING_STATUS = 'bookingStatus',
  BOOKING_TOTAL = 'bookingTotal',
  BOOKING_DEPOSIT = 'bookingDeposit',
  BOOKING_BALANCE = 'bookingBalance',
  
  // Tour placeholders
  TOUR_NAME = 'tourName',
  TOUR_DESCRIPTION = 'tourDescription',
  TOUR_DEPARTURE_DATE = 'tourDepartureDate',
  TOUR_RETURN_DATE = 'tourReturnDate',
  TOUR_DURATION = 'tourDuration',
  TOUR_DIFFICULTY = 'tourDifficulty',
  TOUR_PRICE = 'tourPrice',
  
  // Payment placeholders
  PAYMENT_AMOUNT = 'paymentAmount',
  PAYMENT_METHOD = 'paymentMethod',
  PAYMENT_DATE = 'paymentDate',
  PAYMENT_STATUS = 'paymentStatus',
  INVOICE_NUMBER = 'invoiceNumber',
  
  // Company placeholders
  COMPANY_NAME = 'companyName',
  COMPANY_EMAIL = 'companyEmail',
  COMPANY_PHONE = 'companyPhone',
  COMPANY_ADDRESS = 'companyAddress',
  COMPANY_WEBSITE = 'companyWebsite',
  
  // System placeholders
  CURRENT_YEAR = 'currentYear',
  UNSUBSCRIBE_LINK = 'unsubscribeLink',
  VIEW_ONLINE_LINK = 'viewOnlineLink',
  SUPPORT_LINK = 'supportLink'
}

// Placeholder definition
export interface TemplatePlaceholder {
  key: PlaceholderType;
  label: string;
  description: string;
  example: string;
  category: 'customer' | 'booking' | 'tour' | 'payment' | 'company' | 'system';
}

// Multi-language content for a template
export interface TemplateContent {
  language: TemplateLanguage;
  subject: string;
  preheader?: string; // Email preheader text (appears after subject in inbox)
  htmlContent: string; // HTML email body
  textContent?: string; // Plain text fallback
}

// Email template interface
export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: EmailTemplateCategory;
  status: EmailTemplateStatus;
  content: TemplateContent[]; // Multi-language support
  
  // Metadata
  version: number;
  isDefault: boolean; // Is this a system default template?
  tags?: string[]; // For organization and search
  
  // Usage tracking
  usageCount: number; // Number of times sent
  lastSent?: string; // ISO date string
  
  // Audit fields
  createdBy: string;
  createdDate: string;
  lastModifiedBy?: string;
  lastModified?: string;
}

// Template version for history tracking
export interface EmailTemplateVersion {
  id: string;
  templateId: string;
  version: number;
  content: TemplateContent[];
  changeDescription?: string;
  createdBy: string;
  createdDate: string;
}

// Template with version history
export interface EmailTemplateWithHistory extends EmailTemplate {
  versions: EmailTemplateVersion[];
}

// Test email payload
export interface TestEmailPayload {
  templateId: string;
  language: TemplateLanguage;
  recipientEmail: string;
  testData?: Record<string, any>; // Sample data for placeholders
}

// Email sending result
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt?: string;
}

// Template validation result
export interface TemplateValidation {
  isValid: boolean;
  errors: TemplateValidationError[];
  warnings: TemplateValidationWarning[];
}

// Validation error
export interface TemplateValidationError {
  field: string;
  message: string;
  severity: 'error';
}

// Validation warning
export interface TemplateValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}

// Template filter options
export interface TemplateFilter {
  category?: EmailTemplateCategory;
  status?: EmailTemplateStatus;
  language?: TemplateLanguage;
  searchQuery?: string;
  tags?: string[];
}

// Template statistics
export interface TemplateStatistics {
  totalTemplates: number;
  activeTemplates: number;
  draftTemplates: number;
  archivedTemplates: number;
  totalSent: number;
  byCategory: Record<EmailTemplateCategory, number>;
}

// SendGrid configuration (for future integration)
export interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  enableTracking?: boolean;
  enableClickTracking?: boolean;
}

// Email sending options
export interface EmailSendOptions {
  templateId: string;
  language: TemplateLanguage;
  to: string;
  data: Record<string, any>; // Placeholder values
  cc?: string[];
  bcc?: string[];
  attachments?: EmailAttachment[];
  scheduledFor?: string; // ISO date string for scheduled sending
}

// Email attachment
export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded content
  type: string; // MIME type
  disposition?: 'attachment' | 'inline';
}

// Pre-designed template definition
export interface PreDesignedTemplate {
  name: string;
  description: string;
  category: EmailTemplateCategory;
  thumbnail?: string; // URL or base64 image
  content: TemplateContent[];
  tags: string[];
}

// Template export/import format
export interface TemplateExport {
  template: EmailTemplate;
  versions?: EmailTemplateVersion[];
  exportedAt: string;
  exportedBy: string;
}
