/**
 * Booking Service - Booking management and operations
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
    await delay(1000);

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
