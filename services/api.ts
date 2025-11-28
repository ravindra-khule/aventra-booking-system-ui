import { Tour, Booking, BookingStatus, PaymentStatus, DashboardStats, User, UserRole, PayerDetails } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const MOCK_TOURS: Tour[] = [
  {
    id: '1',
    title: 'Bestig Kilimanjaro',
    shortDescription: '8 DAGAR PÅ BERGET. Vandra genom fyra klimatzoner till toppen av Afrika.',
    description: 'Vandra genom fyra klimatzoner på vår unika rutt till toppen av Afrika, Uhuru Peak 5895 m höjd. En expedition utöver det vanliga med erfarna guider.',
    price: 45900,
    depositPrice: 5000,
    currency: 'SEK',
    durationDays: 10,
    difficulty: 'Extreme',
    imageUrl: 'https://images.unsplash.com/photo-1650635462886-069f20e98033?q=80&w=1000&auto=format&fit=crop', // Kilimanjaro
    location: 'Tanzania',
    nextDate: '2026-01-24',
    availableSpots: 4
  },
  {
    id: '2',
    title: 'Langtang & Tamang Heritage',
    shortDescription: '14 DAGAR. Äkta kulturmöten och storslagna Himalayavyer.',
    description: 'Följ med Aventra på en unik vandringsresa genom Tamang Heritage och Langtangdalen. Äkta kulturmöten, storslagna Himalayavyer och svensk guide.',
    price: 40900,
    depositPrice: 4000,
    currency: 'SEK',
    durationDays: 14,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop', // Himalayas
    location: 'Nepal',
    nextDate: '2026-02-23',
    availableSpots: 8
  },
  {
    id: '3',
    title: 'Patagonien',
    shortDescription: '12 DAGAR. Vandra W-trek i Torres del Paine.',
    description: 'Vandra W-trek i Torres del Paine och upplev Cerro Castillo i Aysén – en resa med svensk guide och storslagna naturupplevelser.',
    price: 64900,
    depositPrice: 6000,
    currency: 'SEK',
    durationDays: 12,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop', // Patagonia
    location: 'Chile',
    nextDate: '2026-02-25',
    availableSpots: 12
  }
];

// Helper to create a dummy payer
const mockPayer: PayerDetails = {
    firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', phone: '0701234567', 
    address: 'Sveavägen 1', zipCode: '111 57', city: 'Stockholm', country: 'Sweden'
};

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
      { firstName: 'Alice', lastName: 'Anderson', email: 'alice@example.com', phone: '0701234567', address: 'Sveavägen 1', zipCode: '111 57', city: 'Stockholm', country: 'Sweden', ssn: '19900101-1234', isPayer: true, roomPreference: 'Double Bed' },
      { firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com', phone: '0709876543', address: 'Sveavägen 1', zipCode: '111 57', city: 'Stockholm', country: 'Sweden', ssn: '19900102-5678', isPayer: false, roomPreference: 'Double Bed' }
    ],
    totalAmount: 91800, // 45900 * 2
    paidAmount: 91800,
    status: BookingStatus.CONFIRMED,
    paymentStatus: PaymentStatus.PAID,
    transactionId: 'pi_3M9e2jLkdiw812'
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
       { firstName: 'Bjorn', lastName: 'Borg', email: 'bjorn@tennis.se', phone: '0705555555', address: 'Center Court 1', zipCode: '269 00', city: 'Båstad', country: 'Sweden', ssn: '19800606-9999', isPayer: true, roomPreference: 'Single Room', travelCompanion: 'None' }
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
    travelers: [], // Simplified for mock
    totalAmount: 259600, // 64900 * 4
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
    totalAmount: 81800, // 40900 * 2
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
    totalAmount: 129800, // 64900 * 2
    paidAmount: 129800,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PAID,
    transactionId: 'pi_7H6g5fDsa221'
  }
];

export const TourService = {
  getAll: async (): Promise<Tour[]> => {
    await delay(500);
    return MOCK_TOURS;
  },
  getById: async (id: string): Promise<Tour | undefined> => {
    await delay(300);
    return MOCK_TOURS.find(t => t.id === id);
  }
};

export const BookingService = {
  create: async (bookingData: Partial<Booking>): Promise<Booking> => {
    await delay(1000);
    
    const newBooking: Booking = {
      id: `BK-${Math.floor(Math.random() * 10000)}`,
      tourId: bookingData.tourId || '',
      tourTitle: bookingData.tourTitle || '',
      customerId: 'cust_current',
      customerName: bookingData.payer ? `${bookingData.payer.firstName} ${bookingData.payer.lastName}` : 'Guest',
      payer: bookingData.payer || mockPayer,
      bookingDate: new Date().toISOString().split('T')[0],
      tripDate: bookingData.tripDate || '',
      participants: bookingData.participants || 1,
      travelers: bookingData.travelers || [],
      totalAmount: bookingData.totalAmount || 0,
      paidAmount: bookingData.paidAmount || 0,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PARTIAL,
      transactionId: `pi_mock_${Math.random().toString(36).substring(7)}`,
      ...bookingData
    } as Booking;
    
    MOCK_BOOKINGS.push(newBooking);
    console.log('API Call: Creating booking', newBooking);
    return newBooking;
  },
  
  update: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    await delay(800);
    const index = MOCK_BOOKINGS.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Booking not found');
    
    // Update the booking in mock db
    MOCK_BOOKINGS[index] = { ...MOCK_BOOKINGS[index], ...updates };
    
    // If payer name changed, update top level customer name too
    if (updates.payer) {
       MOCK_BOOKINGS[index].customerName = `${updates.payer.firstName} ${updates.payer.lastName}`;
    }

    return MOCK_BOOKINGS[index];
  },

  getAll: async (): Promise<Booking[]> => {
    await delay(600);
    return MOCK_BOOKINGS;
  },

  getStats: async (): Promise<DashboardStats> => {
    await delay(400);
    return {
      totalRevenue: 2540000, // SEK
      activeBookings: 45,
      pendingInquiries: 12,
      occupancyRate: 85
    };
  }
};

export const AuthService = {
  login: async (email: string, role: UserRole): Promise<User> => {
    await delay(500);
    return {
      id: 'u_123',
      name: email.split('@')[0],
      email: email,
      role: role
    };
  }
};