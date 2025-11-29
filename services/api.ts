/**
 * ⚠️ DEPRECATED: This file is now a compatibility layer
 * 
 * The API services have been restructured into a feature-based architecture.
 * This file re-exports from the new modular structure for backward compatibility.
 * 
 * New import paths:
 * - TourService: ../src/features/tours/services/tour.service
 * - BookingService: ../src/features/bookings/services/booking.service
 * - WaitlistService: ../src/features/bookings/services/booking.service
 * - CustomerService: ../src/features/customers/services/customer.service
 * - PromoCodeService: ../src/features/marketing/services/promo.service
 * - AuthService: ../src/shared/services/auth.service
 * 
 * Or use the convenient central export:
 * import { TourService, BookingService } from '../src/shared/services';
 */

// Re-export everything from the new modular structure
export {
  TourService,
  BookingService,
  WaitlistService,
  CustomerService,
  PromoCodeService,
  AuthService
} from '../src/shared/services';
