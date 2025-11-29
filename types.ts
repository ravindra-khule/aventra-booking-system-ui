/**
 * Main Types Export - Backward Compatibility Layer
 * 
 * This file re-exports all types from the new modular structure.
 * All type definitions have been moved to feature-specific modules:
 * 
 * - Common types: src/shared/types/common.types.ts
 * - Booking types: src/features/bookings/types/booking.types.ts
 * - Customer types: src/features/customers/types/customer.types.ts
 * - Promo types: src/features/marketing/types/promo.types.ts
 * - Tour types: src/features/tours/types/tour.types.ts
 * 
 * You can now import types in two ways:
 * 
 * 1. From specific feature modules (recommended for new code):
 *    import { Booking, BookingStatus } from './src/features/bookings/types/booking.types'
 * 
 * 2. From this central file (for backward compatibility):
 *    import { Booking, BookingStatus } from './types'
 */

// Re-export all types from the new modular structure
export * from './src/shared/types';