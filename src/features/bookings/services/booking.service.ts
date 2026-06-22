/**
 * Booking Service - Booking management and operations
 * Integrates with PHP backend APIs at localhost:5500
 */

import { Booking, BookingStatus, PaymentStatus, PayerDetails, Waitlist } from '../types/booking.types';
import { DashboardStats } from '../../../shared/types/common.types';
import { delay, generateId, generateTransactionId } from '../../../shared/utils/api.utils';

/**
 * Get current date in local timezone formatted as YYYY-MM-DD
 */
const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Helper mock payer data
const mockPayer: PayerDetails = {
  firstName: 'Alice',
  lastName: 'Anderson',
  email: 'alice@example.com',
  phone: '0701234567',
  address: 'Sveavägen 1',
  zipCode: '111 57',
  city: 'Stockholm',
  country: 'Sweden'
};

// Mock booking data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    tourId: '1',
    tourTitle: 'Bestig Kilimanjaro',
    customerId: 'cust_1',
    customerName: 'Alice Anderson',
    payer: mockPayer,
    bookingDate: '2024-01-15',
    tripDate: '2026-01-24',
    participants: 2,
    travelers: [
      {
        firstName: 'Alice',
        lastName: 'Anderson',
        email: 'alice@example.com',
        phone: '0701234567',
        address: 'Sveavägen 1',
        zipCode: '111 57',
        city: 'Stockholm',
        country: 'Sweden',
        ssn: '19900101-1234',
        isPayer: true,
        roomPreference: 'Double Bed'
      },
      {
        firstName: 'Bob',
        lastName: 'Builder',
        email: 'bob@example.com',
        phone: '0709876543',
        address: 'Sveavägen 1',
        zipCode: '111 57',
        city: 'Stockholm',
        country: 'Sweden',
        ssn: '19900102-5678',
        isPayer: false,
        roomPreference: 'Double Bed'
      }
    ],
    totalAmount: 82620, // 91800 - 9180 (10% discount with SUMMER2026)
    paidAmount: 82620,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    transactionId: 'pi_3M9e2jLkdiw812',
    promoCode: 'SUMMER2026',
    discountAmount: 9180
  },
  {
    id: 'BK-1002',
    tourId: '2',
    tourTitle: 'Langtang & Tamang Heritage',
    customerId: 'cust_2',
    customerName: 'Bjorn Borg',
    payer: { ...mockPayer, firstName: 'Bjorn', lastName: 'Borg', email: 'bjorn@tennis.se' },
    bookingDate: '2024-02-10',
    tripDate: '2026-02-23',
    participants: 1,
    travelers: [
      {
        firstName: 'Bjorn',
        lastName: 'Borg',
        email: 'bjorn@tennis.se',
        phone: '0705555555',
        address: 'Center Court 1',
        zipCode: '269 00',
        city: 'Båstad',
        country: 'Sweden',
        ssn: '19800606-9999',
        isPayer: true,
        roomPreference: 'Single Room',
        travelCompanion: 'None'
      }
    ],
    totalAmount: 40900,
    paidAmount: 4000,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PARTIAL,
    transactionId: 'pi_3L8x1kMjaus901'
  },
  {
    id: 'BK-1003',
    tourId: '3',
    tourTitle: 'Patagonien',
    customerId: 'cust_3',
    customerName: 'Charlie Chaplin',
    payer: { ...mockPayer, firstName: 'Charlie', lastName: 'Chaplin', email: 'charlie@movies.com' },
    bookingDate: '2024-03-05',
    tripDate: '2026-02-25',
    participants: 4,
    travelers: [],
    totalAmount: 259600,
    paidAmount: 0,
    status: BookingStatus.CANCELLED,
    paymentStatus: PaymentStatus.UNPAID,
    transactionId: undefined
  },
  {
    id: 'BK-1004',
    tourId: '1',
    tourTitle: 'Bestig Kilimanjaro',
    customerId: 'cust_4',
    customerName: 'David Davidson',
    payer: { ...mockPayer, firstName: 'David', lastName: 'Davidson', email: 'david@example.com' },
    bookingDate: '2024-03-12',
    tripDate: '2026-01-24',
    participants: 1,
    travelers: [],
    totalAmount: 45900,
    paidAmount: 45900,
    status: BookingStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    transactionId: 'pi_9K2j1kLqa771'
  },
  {
    id: 'BK-1005',
    tourId: '2',
    tourTitle: 'Langtang & Tamang Heritage',
    customerId: 'cust_5',
    customerName: 'Eva Evans',
    payer: { ...mockPayer, firstName: 'Eva', lastName: 'Evans', email: 'eva@example.com' },
    bookingDate: '2024-03-20',
    tripDate: '2026-02-23',
    participants: 2,
    travelers: [],
    totalAmount: 81800,
    paidAmount: 8000,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PARTIAL,
    transactionId: 'pi_8J1h2gFda332'
  },
  {
    id: 'BK-1006',
    tourId: '3',
    tourTitle: 'Patagonien',
    customerId: 'cust_6',
    customerName: 'Frank Franklin',
    payer: { ...mockPayer, firstName: 'Frank', lastName: 'Franklin', email: 'frank@example.com' },
    bookingDate: '2024-04-01',
    tripDate: '2026-02-25',
    participants: 2,
    travelers: [],
    totalAmount: 129800,
    paidAmount: 129800,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PAID,
    transactionId: 'pi_7H6g5fDsa221'
  }
];

/**
 * Get a sample booking for demo/initial display
 * Returns the first mock booking with updated dates
 */
export const getSampleBooking = (): Booking => {
  const sample = { ...MOCK_BOOKINGS[0] };
  // Update to current date for bookingDate
  sample.bookingDate = getCurrentDate();
  // Set trip date to future
  sample.tripDate = '2026-03-15';
  // Update paidAmount to show partial payment
  sample.paidAmount = Math.round(sample.totalAmount * 0.1); // 10% deposit
  sample.paymentStatus = PaymentStatus.PARTIAL;
  
  return sample;
};

/**
 * Booking Service
 * Handles all booking-related operations
 */
export const BookingService = {
  /**
   * Create a new booking
   */
  create: async (bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      // Define API_URL at runtime
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      
      // Get auth token
      const token = localStorage.getItem('auth_token');
      
      // Prepare booking payload for PHP API - use exact field names from PHP API
      const payload = {
        userId: bookingData.userId || 1,
        tourId: bookingData.tourId || 0,
        numberOfPeople: bookingData.numberOfPeople || 1,
        customerName: bookingData.customerName || 'Guest',
        customerEmail: bookingData.customerEmail || '',
        customerPhone: bookingData.customerPhone || '',
        specialRequirements: bookingData.specialRequirements || ''
      };

      console.log('Creating booking with payload:', payload);

      const response = await fetch(`${API_URL}/api/bookings-create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      console.log('Booking create response status:', response.status);
      const data = await response.json();
      console.log('Booking create response data:', data);

      if (!data.success || !response.ok) {
        console.error('Booking creation API error:', data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      // Convert API response to Booking type
      const apiBooking = data.data;
      return {
        id: String(apiBooking.id || apiBooking.bookingReference),
        userId: bookingData.userId || 1,
        tourId: bookingData.tourId || 0,
        bookingReference: apiBooking.bookingReference || '',
        numberOfPeople: bookingData.numberOfPeople || 1,
        totalPrice: apiBooking.totalPrice || 0,
        depositPaid: apiBooking.depositPaid || 0,
        balanceDue: apiBooking.balanceDue || 0,
        status: apiBooking.status || 'pending' as any,
        paymentStatus: apiBooking.paymentStatus || 'pending' as any,
        customerName: bookingData.customerName || '',
        customerEmail: bookingData.customerEmail || '',
        customerPhone: bookingData.customerPhone || '',
        createdAt: new Date().toISOString(),
        bookingDate: new Date().toISOString().split('T')[0],
        // Extended fields for UI
        tourTitle: bookingData.tourTitle || '',
        customerId: String(bookingData.userId || 1),
        payer: bookingData.payer || {} as PayerDetails,
        tripDate: bookingData.tripDate || '',
        participants: bookingData.numberOfPeople || 1,
        travelers: bookingData.travelers || [],
        totalAmount: apiBooking.totalPrice || 0,
        paidAmount: apiBooking.depositPaid || 0,
        transactionId: apiBooking.bookingReference
      } as Booking;
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  },

  /**
   * Get booking by ID
   */
  getById: async (id: string): Promise<Booking | undefined> => {
    try {
      // Define API_URL at runtime
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      
      const token = localStorage.getItem('auth_token');

      console.log('Fetching booking with ID:', id);

      const response = await fetch(`${API_URL}/api/bookings-list.php?id=${id}&admin=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      console.log('Booking fetch response status:', response.status);
      const data = await response.json();
      console.log('Booking fetch response data:', data);

      if (!data.success || !response.ok) {
        console.error('API Error:', data.error);
        throw new Error(data.error || 'Failed to fetch booking');
      }

      if (!data.data || data.data.length === 0) {
        console.log('Booking not found:', id);
        return undefined;
      }

      // Convert API response to Booking type
      const apiBooking = data.data[0];
      return {
        id: apiBooking.id,
        tourId: apiBooking.tour_id,
        tourTitle: apiBooking.tour_title || '',
        customerId: apiBooking.user_id,
        customerName: apiBooking.customer_name,
        payer: {
          firstName: apiBooking.customer_name?.split(' ')[0] || '',
          lastName: apiBooking.customer_name?.split(' ')[1] || '',
          email: apiBooking.customer_email || '',
          phone: apiBooking.customer_phone || '',
          address: '',
          zipCode: '',
          city: '',
          country: ''
        },
        bookingDate: apiBooking.booking_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        tripDate: apiBooking.departure_date || '',
        participants: apiBooking.number_of_people || 1,
        travelers: [],
        totalAmount: apiBooking.total_price || 0,
        paidAmount: apiBooking.deposit_paid || 0,
        status: apiBooking.status as any,
        paymentStatus: apiBooking.payment_status as any,
        transactionId: apiBooking.booking_reference
      } as Booking;
    } catch (error) {
      console.error('Booking fetch error:', error);
      throw error;
    }
  },

  /**
   * Get all bookings (or user's bookings)
   */
  getAll: async (userId?: string): Promise<Booking[]> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      const token = localStorage.getItem('auth_token');
      const queryParam = userId ? `?userId=${userId}` : '?admin=true';

      console.log('[BookingService.getAll] API_URL:', API_URL);
      console.log('Fetching bookings from:', `${API_URL}/api/bookings-list.php${queryParam}`);

      const response = await fetch(`${API_URL}/api/bookings-list.php${queryParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      console.log('Bookings list response status:', response.status);
      const data = await response.json();
      console.log('Bookings list response data:', data);

      if (!data.success || !response.ok) {
        console.error('Bookings list API error:', data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      // Convert API response array to Booking types
      return (data.data || []).map((apiBooking: any) => ({
        id: String(apiBooking.id),
        userId: apiBooking.user_id,
        tourId: apiBooking.tour_id,
        bookingReference: apiBooking.booking_reference,
        numberOfPeople: apiBooking.number_of_people,
        totalPrice: apiBooking.total_price,
        depositPaid: apiBooking.deposit_paid,
        balanceDue: apiBooking.balance_due,
        status: apiBooking.status,
        paymentStatus: apiBooking.payment_status,
        customerName: apiBooking.customer_name,
        customerEmail: apiBooking.customer_email,
        customerPhone: apiBooking.customer_phone,
        createdAt: apiBooking.booking_date,
        tourTitle: apiBooking.tour_title || '',
        customerId: apiBooking.customer_id ? String(apiBooking.customer_id) : String(apiBooking.user_id),
        payer: {
          firstName: apiBooking.customer_name?.split(' ')[0] || '',
          lastName: apiBooking.customer_name?.split(' ')[1] || '',
          email: apiBooking.customer_email || '',
          phone: apiBooking.customer_phone || '',
          address: '',
          zipCode: '',
          city: '',
          country: ''
        },
        bookingDate: apiBooking.booking_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        tripDate: apiBooking.departure_date || apiBooking.next_date || '',
        participants: apiBooking.number_of_people || 1,
        travelers: [],
        totalAmount: apiBooking.total_price || 0,
        paidAmount: apiBooking.deposit_paid || 0,
        transactionId: apiBooking.booking_reference
      })) as Booking[];
    } catch (error) {
      console.error('Bookings fetch error:', error);
      throw error;
    }
  },

  /**
   * Update booking status
   */
  update: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    try {
      // Define API_URL at runtime
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      
      const token = localStorage.getItem('auth_token');

      const payload: any = { id };
      
      if (updates.status) payload.status = updates.status;
      if (updates.paymentStatus) payload.paymentStatus = updates.paymentStatus;

      console.log('Updating booking with payload:', payload);

      const response = await fetch(`${API_URL}/api/bookings-update.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      console.log('Booking update response status:', response.status);
      const data = await response.json();
      console.log('Booking update response data:', data);

      if (!data.success || !response.ok) {
        console.error('Booking update API error:', data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      // Return updated booking
      const updated = await BookingService.getById(id);
      if (!updated) {
        throw new Error('Failed to retrieve updated booking');
      }
      return updated;
    } catch (error) {
      console.error('Booking update error:', error);
      throw error;
    }
  },

  /**
   * Delete a booking
   */
  delete: async (id: string): Promise<void> => {
    try {
      // Define API_URL at runtime
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;
      
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_URL}/api/bookings-delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ id, _method: 'DELETE' })
      });

      console.log('Booking delete response status:', response.status);
      const data = await response.json();
      console.log('Booking delete response data:', data);

      if (!data.success || !response.ok) {
        console.error('Booking delete API error:', data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Define API_URL at runtime
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:8000') as string;
      
      const token = localStorage.getItem('auth_token');

      const response = await fetch(`${API_URL}/api/dashboard-stats.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      const data = await response.json();

      if (!data.success || !response.ok) {
        console.warn('API Error:', data.error, '- Using mock stats');
        return BookingService._getMockStats();
      }

      // Convert API response to DashboardStats type
      const stats = data.data?.summary || {};
      return {
        totalRevenue: stats.totalRevenue || 0,
        activeBookings: stats.confirmedBookings || 0,
        pendingInquiries: stats.pendingBookings || 0,
        occupancyRate: 85 // Calculate from data if available
      } as DashboardStats;
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Fallback to mock
      return BookingService._getMockStats();
    }
  },

  /**
   * Send bulk email to customers
   */
  sendBulkEmail: async (emailData: {
    email: string;
    subject: string;
    message: string;
    bookingCount: number;
  }): Promise<void> => {
    await delay(800);
    // TODO: Integrate with backend email API
    console.log('Email sent:', {
      to: emailData.email,
      subject: emailData.subject,
      message: emailData.message,
      bookingsAffected: emailData.bookingCount
    });
  },

  // ===== MOCK DATA HELPERS =====

  /**
   * Create mock booking for fallback
   */
  _createMockBooking: (bookingData: Partial<Booking>): Booking => {
    const newBooking: Booking = {
      id: generateId('BK-'),
      tourId: bookingData.tourId || '',
      tourTitle: bookingData.tourTitle || '',
      customerId: 'cust_current',
      customerName: bookingData.payer
        ? `${bookingData.payer.firstName} ${bookingData.payer.lastName}`
        : 'Guest',
      payer: bookingData.payer || mockPayer,
      bookingDate: getCurrentDate(),
      tripDate: bookingData.tripDate || '',
      participants: bookingData.participants || 1,
      travelers: bookingData.travelers || [],
      totalAmount: bookingData.totalAmount || 0,
      paidAmount: bookingData.paidAmount || 0,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PARTIAL,
      transactionId: generateTransactionId(),
      tourImageUrl: bookingData.tourImageUrl,
      ...bookingData
    } as Booking;

    MOCK_BOOKINGS.push(newBooking);
    console.log('API Call: Creating booking', newBooking);
    console.log('Tour Image URL:', newBooking.tourImageUrl);
    return newBooking;
  },

  /**
   * Update an existing booking
   */
  update: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    await delay(800);
    const index = MOCK_BOOKINGS.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    // Update the booking in mock db
    MOCK_BOOKINGS[index] = { ...MOCK_BOOKINGS[index], ...updates };

    // If payer name changed, update top level customer name too
    if (updates.payer) {
      MOCK_BOOKINGS[index].customerName = `${updates.payer.firstName} ${updates.payer.lastName}`;
    }

    return MOCK_BOOKINGS[index];
  },

  /**
   * Get all bookings
   */
  getAll: async (): Promise<Booking[]> => {
    await delay(600);
    return MOCK_BOOKINGS;
  },

  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    await delay(400);
    return {
      totalRevenue: 2540000, // SEK
      activeBookings: 45,
      pendingInquiries: 12,
      occupancyRate: 85
    };
  },

  /**
   * Send bulk email to customers
   */
  sendBulkEmail: async (emailData: {
    email: string;
    subject: string;
    message: string;
    bookingCount: number;
  }): Promise<void> => {
    await delay(800);
    // Simulate email sending
    console.log('Email sent:', {
      to: emailData.email,
      subject: emailData.subject,
      message: emailData.message,
      bookingsAffected: emailData.bookingCount
    });
    // In a real implementation, this would call an email API
  }
};

// Mock waitlist data
const MOCK_WAITLIST: Waitlist[] = [
  {
    id: 'WL-1001',
    tourId: '2',
    tourTitle: 'Langtang & Tamang Heritage',
    firstName: 'Sara',
    lastName: 'Svensson',
    email: 'sara@example.com',
    phone: '0708887777',
    participants: 2,
    preferredDate: '2026-03-15',
    message: 'Would love to join this adventure!',
    submittedDate: '2024-02-15',
    status: 'PENDING'
  },
  {
    id: 'WL-1002',
    tourId: '2',
    tourTitle: 'Langtang & Tamang Heritage',
    firstName: 'Marcus',
    lastName: 'Magnusson',
    email: 'marcus@example.com',
    phone: '0706665555',
    participants: 1,
    preferredDate: '2026-04-01',
    message: 'First trip to Nepal, very excited!',
    submittedDate: '2024-02-20',
    status: 'CONTACTED'
  }
];

/**
 * Waitlist Service
 * Handles waitlist management
 */
export const WaitlistService = {
  /**
   * Create a new waitlist entry
   */
  create: async (waitlistData: Partial<Waitlist>): Promise<Waitlist> => {
    await delay(500);

    const newWaitlist: Waitlist = {
      id: generateId('WL-'),
      tourId: waitlistData.tourId || '',
      tourTitle: waitlistData.tourTitle || '',
      firstName: waitlistData.firstName || '',
      lastName: waitlistData.lastName || '',
      email: waitlistData.email || '',
      phone: waitlistData.phone || '',
      participants: waitlistData.participants || 1,
      preferredDate: waitlistData.preferredDate,
      message: waitlistData.message,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };

    MOCK_WAITLIST.push(newWaitlist);
    return newWaitlist;
  },

  /**
   * Get all waitlist entries
   */
  getAll: async (): Promise<Waitlist[]> => {
    await delay(400);
    return MOCK_WAITLIST;
  },

  /**
   * Update waitlist entry status
   */
  updateStatus: async (
    id: string,
    status: 'PENDING' | 'CONTACTED' | 'CONVERTED' | 'CANCELLED'
  ): Promise<Waitlist> => {
    await delay(500);
    const index = MOCK_WAITLIST.findIndex((w) => w.id === id);
    if (index === -1) throw new Error('Waitlist entry not found');

    MOCK_WAITLIST[index].status = status;
    return MOCK_WAITLIST[index];
  },

  /**
   * Delete a waitlist entry
   */
  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = MOCK_WAITLIST.findIndex((w) => w.id === id);
    if (index !== -1) {
      MOCK_WAITLIST.splice(index, 1);
    }
  }
};
