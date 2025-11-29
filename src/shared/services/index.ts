/**
 * Services Index - Central export point for all services
 * 
 * For backward compatibility with existing imports from services/api.ts
 * 
 * New code should import from feature-specific service files:
 * - import { TourService } from '../features/tours/services/tour.service'
 * - import { BookingService } from '../features/bookings/services/booking.service'
 * - import { CustomerService } from '../features/customers/services/customer.service'
 * - import { PromoCodeService } from '../features/marketing/services/promo.service'
 * - import { AuthService } from '../shared/services/auth.service'
 */

// Re-export all services for convenience
export { TourService } from '../../features/tours/services/tour.service';
export { AddOnService } from '../../features/tours/services/addon.service';
export { BookingService, WaitlistService } from '../../features/bookings/services/booking.service';
export { CustomerService } from '../../features/customers/services/customer.service';
export { PromoCodeService } from '../../features/marketing/services/promo.service';
export { AuthService } from './auth.service';

// Re-export types for convenience
export * from '../types';
