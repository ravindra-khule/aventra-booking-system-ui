// Enums for standardizing status across the app
export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  ACCOUNTANT = 'ACCOUNTANT'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export enum PromoCodeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

export enum PromoCodeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

// Data Models
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}

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

export interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  depositPrice: number; // Added for partial payments
  currency: string;
  durationDays: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  imageUrl: string;
  location: string;
  nextDate: string;
  availableSpots: number;
}

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
}

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

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  totalBookings: number;
  totalSpent: number;
  createdDate: string;
  lastBookingDate?: string;
  notes?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  pendingInquiries: number;
  occupancyRate: number;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: PromoCodeType;
  value: number; // Percentage (e.g., 10 for 10%) or fixed amount
  minBookingAmount?: number; // Minimum booking amount required
  maxDiscount?: number; // Maximum discount amount (useful for percentage discounts)
  usageLimit?: number; // Total number of times this code can be used (null = unlimited)
  usageCount: number; // Current usage count
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  status: PromoCodeStatus;
  applicableTours?: string[]; // Tour IDs (empty = all tours)
  createdBy: string;
  createdDate: string;
  lastModified?: string;
}

export interface PromoCodeValidation {
  isValid: boolean;
  message: string;
  discountAmount?: number;
  finalAmount?: number;
}