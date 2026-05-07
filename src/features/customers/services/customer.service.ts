/**
 * Customer Service - Customer management and CRM operations
 */

import { Customer } from '../types/customer.types';
import { Booking } from '../../bookings/types/booking.types';
import { delay } from '../../../shared/utils/api.utils';

// Note: Customer data is dynamically generated from bookings
// Import MOCK_BOOKINGS from booking service when needed
// For now, we'll create a reference

/**
 * Customer Service
 * Handles customer-related operations and CRM functions
 */
export const CustomerService = {
  /**
   * Get all customers
   * Dynamically generates customer list from bookings
   */
  getAll: async (): Promise<Customer[]> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      console.log('[CustomerService.getAll] API_BASE:', API_BASE);
      
      const response = await fetch(`${API_BASE}/api/customers-list.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

    // Import bookings dynamically to avoid circular dependencies
    const { BookingService } = await import('../../bookings/services/booking.service');
    const bookings = await BookingService.getAll();

    // Extract unique customers from bookings
    const customerMap = new Map<string, Customer>();

    bookings.forEach((booking) => {
      const customerId = booking.customerId;
      const payer = booking.payer;

      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          firstName: payer.firstName,
          lastName: payer.lastName,
          email: payer.email,
          phone: payer.phone,
          address: payer.address,
          zipCode: payer.zipCode,
          city: payer.city,
          country: payer.country,
          totalBookings: 0,
          totalSpent: 0,
          createdDate: booking.bookingDate,
          lastBookingDate: booking.bookingDate,
          notes: ''
        });
      }

      const customer = customerMap.get(customerId)!;
      customer.totalBookings++;
      customer.totalSpent += booking.paidAmount;

      // Update last booking date if this booking is more recent
      if (booking.bookingDate > (customer.lastBookingDate || '')) {
        customer.lastBookingDate = booking.bookingDate;
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
   * Get a specific customer by ID
   */
  getById: async (id: string): Promise<Customer | undefined> => {
    try {
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
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
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
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
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
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
      const API_BASE = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
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
    await delay(400);
    const { BookingService } = await import('../../bookings/services/booking.service');
    const bookings = await BookingService.getAll();
    return bookings.filter((b) => b.customerId === customerId);
  },

  /**
   * Update customer information
   * Updates the customer data across all their bookings
   */
  update: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    await delay(500);

    // Import bookings to update payer info
    const { BookingService } = await import('../../bookings/services/booking.service');
    const bookings = await BookingService.getAll();

    // Update all bookings with this customer's payer info
    bookings.forEach((booking) => {
      if (booking.customerId === id && updates) {
        if (
          updates.firstName ||
          updates.lastName ||
          updates.email ||
          updates.phone ||
          updates.address ||
          updates.zipCode ||
          updates.city ||
          updates.country
        ) {
          booking.payer = {
            ...booking.payer,
            ...(updates.firstName && { firstName: updates.firstName }),
            ...(updates.lastName && { lastName: updates.lastName }),
            ...(updates.email && { email: updates.email }),
            ...(updates.phone && { phone: updates.phone }),
            ...(updates.address && { address: updates.address }),
            ...(updates.zipCode && { zipCode: updates.zipCode }),
            ...(updates.city && { city: updates.city }),
            ...(updates.country && { country: updates.country })
          };

          booking.customerName = `${booking.payer.firstName} ${booking.payer.lastName}`;
        }
      }
    });

    const customer = await CustomerService.getById(id);
    if (!customer) throw new Error('Customer not found');

    return { ...customer, ...updates };
  }
};
