/**
 * Customer Types - Customer management and CRM
 */

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
