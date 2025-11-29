/**
 * Promo Code Types - Promotional codes and discounts
 */

// Promo code type enum
export enum PromoCodeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

// Promo code status enum
export enum PromoCodeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED'
}

// Promo code interface
export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: PromoCodeType;
  value: number; // Percentage (e.g., 10 for 10%) or fixed amount
  minBookingAmount?: number; // Minimum booking amount required
  maxDiscount?: number; // Maximum discount amount (useful for percentage discounts)
  usageLimit?: number; // Total number of times this code can be used (null = unlimited)
  usageCount: number; // Current usage count
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  status: PromoCodeStatus;
  applicableTours?: string[]; // Tour IDs (empty = all tours)
  createdBy: string;
  createdDate: string;
  lastModified?: string;
}

// Promo code validation result
export interface PromoCodeValidation {
  isValid: boolean;
  message: string;
  discountAmount?: number;
  finalAmount?: number;
}
