/**
 * Booking Types - Booking management, travelers, and payments
 */

import { SelectedAddOn } from '../../tours/types/tour.types';

// Booking status enum
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Payment status enum
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

// Payer details interface
export interface PayerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
}

// Traveler interface
export interface Traveler {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  ssn: string; // YYYYMMDD
  travelCompanion?: string;
  roomPreference?: string;
  isPayer: boolean; // Acts as "Same as payer" flag
}

// Main booking interface
export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerId: string;
  customerName: string;
  payer: PayerDetails;
  bookingDate: string;
  tripDate: string;
  participants: number;
  travelers: Traveler[];
  totalAmount: number;
  paidAmount: number; // Track how much was paid
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  transactionId?: string; // Stripe Payment Intent ID
  specialRequests?: string;
  tourImageUrl?: string;
  promoCode?: string; // Applied promo code
  discountAmount?: number; // Discount applied
  selectedAddOns?: SelectedAddOn[]; // Tour add-ons selected
}

// Waitlist interface
export interface Waitlist {
  id: string;
  tourId: string;
  tourTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  participants: number;
  preferredDate?: string;
  message?: string;
  submittedDate: string;
  status: 'PENDING' | 'CONTACTED' | 'CONVERTED' | 'CANCELLED';
}
