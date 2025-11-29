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
    await delay(400);

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
  },

  /**
   * Get a specific customer by ID
   */
  getById: async (id: string): Promise<Customer | undefined> => {
    await delay(300);
    const customers = await CustomerService.getAll();
    return customers.find((c) => c.id === id);
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
