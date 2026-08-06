/**
 * Customer Service - Customer management and CRM operations
 * Calls real backend APIs for customer CRUD operations
 */

import { Customer } from '../types/customer.types';
import { Booking } from '../../bookings/types/booking.types';

/**
 * Map snake_case API response to camelCase Customer type
 */
const mapCustomerFromApi = (data: any): Customer => {
  return {
    id: String(data.id),
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone || '',
    address: data.address || '',
    zipCode: data.zip_code || '',
    city: data.city || '',
    country: data.country || '',
    totalBookings: data.total_bookings || 0,
    totalSpent: data.total_spent || 0,
    createdDate: data.created_at,
    lastBookingDate: data.last_booking_date || undefined,
    notes: data.notes || undefined
  };
};

/**
 * Customer Service
 * Handles customer-related operations and CRM functions
 */
export const CustomerService = {
  /**
   * Get all customers from the backend API
   */
  getAll: async (): Promise<Customer[]> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      console.log('[CustomerService.getAll] API_BASE:', API_BASE);
      
      const response = await fetch(`${API_BASE}/api/customers-list.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.error('Error fetching customers:', result.error);
        return [];
      }

      // Update created date if this booking is older
      if (booking.bookingDate < customer.createdDate) {
        customer.createdDate = booking.bookingDate;
      }
    });

    return Array.from(customerMap.values());
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  /**
   * Get a specific customer by ID from the backend API
   */
  getById: async (id: string): Promise<Customer | undefined> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      const response = await fetch(`${API_BASE}/api/customers-get.php?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        console.error('Error fetching customer:', result.error);
        return undefined;
      }

      return mapCustomerFromApi(result.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  /**
   * Create a new customer
   */
  create: async (customer: Omit<Customer, 'id' | 'totalBookings' | 'totalSpent' | 'createdDate'>): Promise<Customer> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      // Map camelCase to snake_case for API
      const payload = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        zipCode: customer.zipCode,
        city: customer.city,
        country: customer.country,
        notes: customer.notes
      };

      const response = await fetch(`${API_BASE}/api/customers-create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create customer');
      }

      return mapCustomerFromApi(result.data);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  /**
   * Update customer information
   */
  update: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      // Map camelCase to snake_case for API
      const payload: any = { id };
      
      if (updates.firstName !== undefined) payload.firstName = updates.firstName;
      if (updates.lastName !== undefined) payload.lastName = updates.lastName;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.address !== undefined) payload.address = updates.address;
      if (updates.zipCode !== undefined) payload.zipCode = updates.zipCode;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.country !== undefined) payload.country = updates.country;
      if (updates.notes !== undefined) payload.notes = updates.notes;
      if (updates.lastBookingDate !== undefined) payload.lastBookingDate = updates.lastBookingDate;

      const response = await fetch(`${API_BASE}/api/customers-update.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to update customer: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update customer');
      }

      return mapCustomerFromApi(result.data);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  /**
   * Delete a customer (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      const response = await fetch(`${API_BASE}/api/customers-delete.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete customer: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  /**
   * Get all bookings for a specific customer
   */
  getCustomerBookings: async (customerId: string): Promise<Booking[]> => {
    try {
      // Use BookingService to get all bookings, then filter by customer_id
      const { BookingService } = await import('../../bookings/services/booking.service');
      const allBookings = await BookingService.getAll();
      return allBookings.filter((b) => String(b.customerId) === String(customerId));
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      return [];
    }
  }
};

