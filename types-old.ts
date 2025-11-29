/**
 * DEPRECATED: This file is kept for backward compatibility
 * 
 * Please import from the new structure instead:
 * - Common types: import { User, UserRole } from './src/shared/types/common.types'
 * - Booking types: import { Booking, BookingStatus } from './src/features/bookings/types/booking.types'
 * - Customer types: import { Customer } from './src/features/customers/types/customer.types'
 * - Promo types: import { PromoCode } from './src/features/marketing/types/promo.types'
 * - Tour types: import { Tour } from './src/features/tours/types/tour.types'
 * 
 * Or use the centralized export:
 * - import { User, Booking, Customer, PromoCode, Tour } from './src/shared/types'
 */

// Re-export all types from new structure for backward compatibility
export * from './src/shared/types';
