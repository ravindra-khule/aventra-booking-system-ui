/**
 * Promo Code Service - Promotional code management and validation
 */

import { PromoCode, PromoCodeType, PromoCodeStatus, PromoCodeValidation } from '../types/promo.types';
import { delay } from '../../../shared/utils/api.utils';

// Mock Promo Codes Data
const MOCK_PROMO_CODES: PromoCode[] = [
  {
    id: 'PC-001',
    code: 'SUMMER2026',
    description: 'Summer promotion - 10% off all tours',
    type: PromoCodeType.PERCENTAGE,
    value: 10,
    minBookingAmount: 10000,
    maxDiscount: 5000,
    usageLimit: 100,
    usageCount: 23,
    validFrom: '2026-01-01',
    validUntil: '2026-08-31',
    status: PromoCodeStatus.ACTIVE,
    applicableTours: [], // Empty means all tours
    createdBy: 'admin',
    createdDate: '2025-11-01',
    lastModified: '2025-11-15'
  },
  {
    id: 'PC-002',
    code: 'KILIMANJARO500',
    description: 'Special discount for Kilimanjaro tours',
    type: PromoCodeType.FIXED_AMOUNT,
    value: 500,
    minBookingAmount: 40000,
    usageLimit: 50,
    usageCount: 12,
    validFrom: '2025-12-01',
    validUntil: '2026-03-31',
    status: PromoCodeStatus.ACTIVE,
    applicableTours: ['1'], // Only for Kilimanjaro
    createdBy: 'admin',
    createdDate: '2025-11-20',
  },
  {
    id: 'PC-003',
    code: 'EARLYBIRD20',
    description: 'Early bird 20% discount',
    type: PromoCodeType.PERCENTAGE,
    value: 20,
    minBookingAmount: 20000,
    maxDiscount: 10000,
    usageLimit: 30,
    usageCount: 30,
    validFrom: '2025-10-01',
    validUntil: '2025-12-31',
    status: PromoCodeStatus.EXPIRED,
    applicableTours: [],
    createdBy: 'admin',
    createdDate: '2025-09-15',
  },
  {
    id: 'PC-004',
    code: 'WINTER25',
    description: 'Winter special - 25% off',
    type: PromoCodeType.PERCENTAGE,
    value: 25,
    minBookingAmount: 30000,
    maxDiscount: 15000,
    usageLimit: null, // Unlimited
    usageCount: 0,
    validFrom: '2026-01-15',
    validUntil: '2026-03-15',
    status: PromoCodeStatus.INACTIVE,
    applicableTours: ['2', '3'], // Nepal and Patagonia
    createdBy: 'admin',
    createdDate: '2025-11-28',
  }
];

/**
 * Promo Code Service
 * Handles promo code CRUD operations and validation
 */
export const PromoCodeService = {
  /**
   * Get all promo codes (for admin)
   */
  getAll: async (): Promise<PromoCode[]> => {
    await delay(400);
    try {
      const stored = localStorage.getItem('promoCodes');
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with mock data
      localStorage.setItem('promoCodes', JSON.stringify(MOCK_PROMO_CODES));
      return MOCK_PROMO_CODES;
    } catch (error) {
      console.error('Failed to load promo codes', error);
      return MOCK_PROMO_CODES;
    }
  },

  /**
   * Get a single promo code by ID
   */
  getById: async (id: string): Promise<PromoCode | undefined> => {
    await delay(300);
    const promoCodes = await PromoCodeService.getAll();
    return promoCodes.find((pc) => pc.id === id);
  },

  /**
   * Validate and apply promo code to booking
   */
  validatePromoCode: async (
    code: string,
    tourId: string,
    bookingAmount: number
  ): Promise<PromoCodeValidation> => {
    await delay(600);

    const promoCodes = await PromoCodeService.getAll();
    const promoCode = promoCodes.find((pc) => pc.code.toUpperCase() === code.toUpperCase());

    // Validation checks
    if (!promoCode) {
      return {
        isValid: false,
        message: 'Invalid promo code'
      };
    }

    // Check status
    if (promoCode.status !== PromoCodeStatus.ACTIVE) {
      return {
        isValid: false,
        message: 'This promo code is not active'
      };
    }

    // Check date validity
    const now = new Date();
    const validFrom = new Date(promoCode.validFrom);
    const validUntil = new Date(promoCode.validUntil);

    if (now < validFrom) {
      return {
        isValid: false,
        message: `This promo code is not valid until ${promoCode.validFrom}`
      };
    }

    if (now > validUntil) {
      return {
        isValid: false,
        message: 'This promo code has expired'
      };
    }

    // Check usage limit
    if (promoCode.usageLimit !== null && promoCode.usageLimit !== undefined) {
      if (promoCode.usageCount >= promoCode.usageLimit) {
        return {
          isValid: false,
          message: 'This promo code has reached its usage limit'
        };
      }
    }

    // Check minimum booking amount
    if (promoCode.minBookingAmount && bookingAmount < promoCode.minBookingAmount) {
      return {
        isValid: false,
        message: `Minimum booking amount of ${promoCode.minBookingAmount} SEK required`
      };
    }

    // Check applicable tours
    if (promoCode.applicableTours && promoCode.applicableTours.length > 0) {
      if (!promoCode.applicableTours.includes(tourId)) {
        return {
          isValid: false,
          message: 'This promo code is not applicable to this tour'
        };
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.type === PromoCodeType.PERCENTAGE) {
      discountAmount = (bookingAmount * promoCode.value) / 100;

      // Apply max discount cap if specified
      if (promoCode.maxDiscount && discountAmount > promoCode.maxDiscount) {
        discountAmount = promoCode.maxDiscount;
      }
    } else if (promoCode.type === PromoCodeType.FIXED_AMOUNT) {
      discountAmount = promoCode.value;
    }

    // Ensure discount doesn't exceed booking amount
    discountAmount = Math.min(discountAmount, bookingAmount);

    const finalAmount = bookingAmount - discountAmount;

    return {
      isValid: true,
      message: 'Promo code applied successfully!',
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(finalAmount)
    };
  },

  /**
   * Create a new promo code
   */
  create: async (
    promoCodeData: Omit<PromoCode, 'id' | 'usageCount' | 'createdDate'>
  ): Promise<PromoCode> => {
    await delay(500);

    const promoCodes = await PromoCodeService.getAll();

    // Check if code already exists
    const existingCode = promoCodes.find(
      (pc) => pc.code.toUpperCase() === promoCodeData.code.toUpperCase()
    );

    if (existingCode) {
      throw new Error('A promo code with this code already exists');
    }

    const newPromoCode: PromoCode = {
      id: `PC-${Date.now()}`,
      ...promoCodeData,
      usageCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    promoCodes.push(newPromoCode);
    localStorage.setItem('promoCodes', JSON.stringify(promoCodes));

    return newPromoCode;
  },

  /**
   * Update an existing promo code
   */
  update: async (id: string, updates: Partial<PromoCode>): Promise<PromoCode> => {
    await delay(500);

    const promoCodes = await PromoCodeService.getAll();
    const index = promoCodes.findIndex((pc) => pc.id === id);

    if (index === -1) {
      throw new Error('Promo code not found');
    }

    // If code is being updated, check for duplicates
    if (updates.code && updates.code !== promoCodes[index].code) {
      const duplicate = promoCodes.find(
        (pc) => pc.id !== id && pc.code.toUpperCase() === updates.code!.toUpperCase()
      );
      if (duplicate) {
        throw new Error('A promo code with this code already exists');
      }
    }

    promoCodes[index] = {
      ...promoCodes[index],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('promoCodes', JSON.stringify(promoCodes));

    return promoCodes[index];
  },

  /**
   * Delete a promo code
   */
  delete: async (id: string): Promise<void> => {
    await delay(400);

    const promoCodes = await PromoCodeService.getAll();
    const filtered = promoCodes.filter((pc) => pc.id !== id);

    if (filtered.length === promoCodes.length) {
      throw new Error('Promo code not found');
    }

    localStorage.setItem('promoCodes', JSON.stringify(filtered));
  },

  /**
   * Increment usage count when promo code is used
   */
  incrementUsage: async (code: string): Promise<void> => {
    await delay(300);

    const promoCodes = await PromoCodeService.getAll();
    const promoCode = promoCodes.find((pc) => pc.code.toUpperCase() === code.toUpperCase());

    if (promoCode) {
      promoCode.usageCount++;
      localStorage.setItem('promoCodes', JSON.stringify(promoCodes));
    }
  }
};
