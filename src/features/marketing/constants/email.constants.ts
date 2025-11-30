/**
 * Email Template Constants - Placeholder definitions and utilities
 */

import { TemplatePlaceholder, PlaceholderType } from '../types/email.types';

// All available placeholders with their definitions
export const EMAIL_PLACEHOLDERS: TemplatePlaceholder[] = [
  // Customer placeholders
  {
    key: PlaceholderType.CUSTOMER_FIRST_NAME,
    label: 'Customer First Name',
    description: 'First name of the customer',
    example: 'John',
    category: 'customer'
  },
  {
    key: PlaceholderType.CUSTOMER_LAST_NAME,
    label: 'Customer Last Name',
    description: 'Last name of the customer',
    example: 'Doe',
    category: 'customer'
  },
  {
    key: PlaceholderType.CUSTOMER_FULL_NAME,
    label: 'Customer Full Name',
    description: 'Full name of the customer',
    example: 'John Doe',
    category: 'customer'
  },
  {
    key: PlaceholderType.CUSTOMER_EMAIL,
    label: 'Customer Email',
    description: 'Email address of the customer',
    example: 'john.doe@example.com',
    category: 'customer'
  },
  {
    key: PlaceholderType.CUSTOMER_PHONE,
    label: 'Customer Phone',
    description: 'Phone number of the customer',
    example: '+46 70 123 4567',
    category: 'customer'
  },

  // Booking placeholders
  {
    key: PlaceholderType.BOOKING_ID,
    label: 'Booking ID',
    description: 'Unique booking reference number',
    example: 'BK-2025-001',
    category: 'booking'
  },
  {
    key: PlaceholderType.BOOKING_DATE,
    label: 'Booking Date',
    description: 'Date when the booking was made',
    example: '2025-11-30',
    category: 'booking'
  },
  {
    key: PlaceholderType.BOOKING_STATUS,
    label: 'Booking Status',
    description: 'Current status of the booking',
    example: 'Confirmed',
    category: 'booking'
  },
  {
    key: PlaceholderType.BOOKING_TOTAL,
    label: 'Booking Total',
    description: 'Total amount for the booking',
    example: '15,000 SEK',
    category: 'booking'
  },
  {
    key: PlaceholderType.BOOKING_DEPOSIT,
    label: 'Booking Deposit',
    description: 'Deposit amount paid',
    example: '5,000 SEK',
    category: 'booking'
  },
  {
    key: PlaceholderType.BOOKING_BALANCE,
    label: 'Booking Balance',
    description: 'Remaining balance to be paid',
    example: '10,000 SEK',
    category: 'booking'
  },

  // Tour placeholders
  {
    key: PlaceholderType.TOUR_NAME,
    label: 'Tour Name',
    description: 'Name of the tour',
    example: 'Arctic Aurora Adventure',
    category: 'tour'
  },
  {
    key: PlaceholderType.TOUR_DESCRIPTION,
    label: 'Tour Description',
    description: 'Brief description of the tour',
    example: 'Experience the Northern Lights...',
    category: 'tour'
  },
  {
    key: PlaceholderType.TOUR_DEPARTURE_DATE,
    label: 'Tour Departure Date',
    description: 'Tour start date',
    example: '2025-12-15',
    category: 'tour'
  },
  {
    key: PlaceholderType.TOUR_RETURN_DATE,
    label: 'Tour Return Date',
    description: 'Tour end date',
    example: '2025-12-20',
    category: 'tour'
  },
  {
    key: PlaceholderType.TOUR_DURATION,
    label: 'Tour Duration',
    description: 'Duration in days',
    example: '5 days',
    category: 'tour'
  },
  {
    key: PlaceholderType.TOUR_DIFFICULTY,
    label: 'Tour Difficulty',
    description: 'Difficulty level of the tour',
    example: 'Moderate',
    category: 'tour'
  },
  {
    key: PlaceholderType.TOUR_PRICE,
    label: 'Tour Price',
    description: 'Price per person',
    example: '15,000 SEK',
    category: 'tour'
  },

  // Payment placeholders
  {
    key: PlaceholderType.PAYMENT_AMOUNT,
    label: 'Payment Amount',
    description: 'Amount of the payment',
    example: '5,000 SEK',
    category: 'payment'
  },
  {
    key: PlaceholderType.PAYMENT_METHOD,
    label: 'Payment Method',
    description: 'Method used for payment',
    example: 'Credit Card',
    category: 'payment'
  },
  {
    key: PlaceholderType.PAYMENT_DATE,
    label: 'Payment Date',
    description: 'Date of the payment',
    example: '2025-11-30',
    category: 'payment'
  },
  {
    key: PlaceholderType.PAYMENT_STATUS,
    label: 'Payment Status',
    description: 'Status of the payment',
    example: 'Completed',
    category: 'payment'
  },
  {
    key: PlaceholderType.INVOICE_NUMBER,
    label: 'Invoice Number',
    description: 'Invoice reference number',
    example: 'INV-2025-001',
    category: 'payment'
  },

  // Company placeholders
  {
    key: PlaceholderType.COMPANY_NAME,
    label: 'Company Name',
    description: 'Name of the tour company',
    example: 'Aventra Tours',
    category: 'company'
  },
  {
    key: PlaceholderType.COMPANY_EMAIL,
    label: 'Company Email',
    description: 'Company contact email',
    example: 'info@aventra.com',
    category: 'company'
  },
  {
    key: PlaceholderType.COMPANY_PHONE,
    label: 'Company Phone',
    description: 'Company contact phone',
    example: '+46 8 123 4567',
    category: 'company'
  },
  {
    key: PlaceholderType.COMPANY_ADDRESS,
    label: 'Company Address',
    description: 'Company physical address',
    example: 'Kungsgatan 1, Stockholm',
    category: 'company'
  },
  {
    key: PlaceholderType.COMPANY_WEBSITE,
    label: 'Company Website',
    description: 'Company website URL',
    example: 'www.aventra.com',
    category: 'company'
  },

  // System placeholders
  {
    key: PlaceholderType.CURRENT_YEAR,
    label: 'Current Year',
    description: 'Current year',
    example: '2025',
    category: 'system'
  },
  {
    key: PlaceholderType.UNSUBSCRIBE_LINK,
    label: 'Unsubscribe Link',
    description: 'Link to unsubscribe from emails',
    example: 'https://aventra.com/unsubscribe',
    category: 'system'
  },
  {
    key: PlaceholderType.VIEW_ONLINE_LINK,
    label: 'View Online Link',
    description: 'Link to view email in browser',
    example: 'https://aventra.com/email/view',
    category: 'system'
  },
  {
    key: PlaceholderType.SUPPORT_LINK,
    label: 'Support Link',
    description: 'Link to customer support',
    example: 'https://aventra.com/support',
    category: 'system'
  }
];

// Helper function to get placeholder by key
export const getPlaceholder = (key: PlaceholderType): TemplatePlaceholder | undefined => {
  return EMAIL_PLACEHOLDERS.find(p => p.key === key);
};

// Helper function to get placeholders by category
export const getPlaceholdersByCategory = (category: string): TemplatePlaceholder[] => {
  return EMAIL_PLACEHOLDERS.filter(p => p.category === category);
};

// Helper function to format placeholder for use in templates
export const formatPlaceholder = (key: PlaceholderType): string => {
  return `{{${key}}}`;
};

// Helper function to extract placeholders from template content
export const extractPlaceholders = (content: string): PlaceholderType[] => {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = [...content.matchAll(regex)];
  return matches.map(match => match[1] as PlaceholderType);
};

// Helper function to replace placeholders with actual values
export const replacePlaceholders = (
  content: string,
  data: Record<string, any>
): string => {
  let result = content;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = formatPlaceholder(key as PlaceholderType);
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  });
  
  return result;
};

// Sample data for testing templates
export const SAMPLE_TEMPLATE_DATA = {
  [PlaceholderType.CUSTOMER_FIRST_NAME]: 'John',
  [PlaceholderType.CUSTOMER_LAST_NAME]: 'Doe',
  [PlaceholderType.CUSTOMER_FULL_NAME]: 'John Doe',
  [PlaceholderType.CUSTOMER_EMAIL]: 'john.doe@example.com',
  [PlaceholderType.CUSTOMER_PHONE]: '+46 70 123 4567',
  
  [PlaceholderType.BOOKING_ID]: 'BK-2025-001',
  [PlaceholderType.BOOKING_DATE]: '2025-11-30',
  [PlaceholderType.BOOKING_STATUS]: 'Confirmed',
  [PlaceholderType.BOOKING_TOTAL]: '15,000 SEK',
  [PlaceholderType.BOOKING_DEPOSIT]: '5,000 SEK',
  [PlaceholderType.BOOKING_BALANCE]: '10,000 SEK',
  
  [PlaceholderType.TOUR_NAME]: 'Arctic Aurora Adventure',
  [PlaceholderType.TOUR_DESCRIPTION]: 'Experience the magical Northern Lights in Swedish Lapland',
  [PlaceholderType.TOUR_DEPARTURE_DATE]: '2025-12-15',
  [PlaceholderType.TOUR_RETURN_DATE]: '2025-12-20',
  [PlaceholderType.TOUR_DURATION]: '5 days',
  [PlaceholderType.TOUR_DIFFICULTY]: 'Moderate',
  [PlaceholderType.TOUR_PRICE]: '15,000 SEK',
  
  [PlaceholderType.PAYMENT_AMOUNT]: '5,000 SEK',
  [PlaceholderType.PAYMENT_METHOD]: 'Credit Card',
  [PlaceholderType.PAYMENT_DATE]: '2025-11-30',
  [PlaceholderType.PAYMENT_STATUS]: 'Completed',
  [PlaceholderType.INVOICE_NUMBER]: 'INV-2025-001',
  
  [PlaceholderType.COMPANY_NAME]: 'Aventra Tours',
  [PlaceholderType.COMPANY_EMAIL]: 'info@aventra.com',
  [PlaceholderType.COMPANY_PHONE]: '+46 8 123 4567',
  [PlaceholderType.COMPANY_ADDRESS]: 'Kungsgatan 1, 111 43 Stockholm',
  [PlaceholderType.COMPANY_WEBSITE]: 'www.aventra.com',
  
  [PlaceholderType.CURRENT_YEAR]: new Date().getFullYear().toString(),
  [PlaceholderType.UNSUBSCRIBE_LINK]: 'https://aventra.com/unsubscribe',
  [PlaceholderType.VIEW_ONLINE_LINK]: 'https://aventra.com/email/view',
  [PlaceholderType.SUPPORT_LINK]: 'https://aventra.com/support'
};
