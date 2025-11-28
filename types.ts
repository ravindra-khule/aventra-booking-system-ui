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
}

export interface DashboardStats {
  totalRevenue: number;
  activeBookings: number;
  pendingInquiries: number;
  occupancyRate: number;
}