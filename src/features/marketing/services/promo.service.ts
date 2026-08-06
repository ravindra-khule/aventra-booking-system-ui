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
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      console.log('[PromoCodeService.getAll] Fetching from:', `${API_URL}/api/promo-codes-list.php`);
      
      const response = await fetch(`${API_URL}/api/promo-codes-list.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.warn('[PromoCodeService] API error, fallback to mock data:', data.error);
        // Fallback to mock data on error
        localStorage.setItem('promoCodes', JSON.stringify(MOCK_PROMO_CODES));
        return MOCK_PROMO_CODES;
      }
      
      // Transform API response to PromoCode format
      const transformedCodes = (data.data || []).map((apiCode: any) => ({
        id: String(apiCode.id || ''),
        code: apiCode.code,
        description: apiCode.description || '',
        type: apiCode.discount_type === 'percentage' ? PromoCodeType.PERCENTAGE : PromoCodeType.FIXED_AMOUNT,
        value: parseFloat(apiCode.discount_value) || 0,
        minBookingAmount: parseFloat(apiCode.min_booking_amount) || 0,
        maxDiscount: parseFloat(apiCode.max_discount_amount) || 0,
        usageLimit: parseInt(apiCode.max_uses) || null,
        usageCount: parseInt(apiCode.current_uses) || 0,
        validFrom: apiCode.valid_from || '',
        validUntil: apiCode.valid_until || '',
        status: apiCode.is_active ? PromoCodeStatus.ACTIVE : PromoCodeStatus.INACTIVE,
        applicableTours: [],
        createdBy: 'admin', // Default value since DB doesn't store this
        createdDate: apiCode.created_at ? apiCode.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: apiCode.updated_at ? apiCode.updated_at.split('T')[0] : undefined
      })) as PromoCode[];
      
      return transformedCodes;
    } catch (error) {
      console.error('[PromoCodeService] Error fetching promo codes, using mock data:', error);
      // Fallback to mock data on error
      const stored = localStorage.getItem('promoCodes');
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem('promoCodes', JSON.stringify(MOCK_PROMO_CODES));
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
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      console.log('[PromoCodeService.validatePromoCode] Validating:', code, 'for amount:', bookingAmount);
      
      const response = await fetch(`${API_URL}/api/promo-codes-validate.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          bookingAmount
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return {
          isValid: false,
          message: data.error || 'Invalid promo code'
        };
      }
      
      return {
        isValid: true,
        message: 'Promo code applied successfully!',
        discountAmount: Math.round(data.data.discountAmount),
        finalAmount: Math.round(data.data.finalAmount)
      };
    } catch (error) {
      console.error('[PromoCodeService] Error validating promo code:', error);
      return {
        isValid: false,
        message: error instanceof Error ? error.message : 'Validation error'
      };
    }
  },

  /**
   * Create a new promo code
   */
  create: async (
    promoCodeData: Omit<PromoCode, 'id' | 'usageCount' | 'createdDate'>
  ): Promise<PromoCode> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const payload = {
        code: promoCodeData.code,
        description: promoCodeData.description,
        discountType: promoCodeData.type === PromoCodeType.PERCENTAGE ? 'percentage' : 'fixed',
        discountValue: promoCodeData.value,
        validFrom: promoCodeData.validFrom,
        validUntil: promoCodeData.validUntil,
        minBookingAmount: promoCodeData.minBookingAmount || 0,
        maxDiscountAmount: promoCodeData.maxDiscount || null,
        maxUses: promoCodeData.usageLimit || null
      };
      
      const response = await fetch(`${API_URL}/api/promo-codes-create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create promo code');
      }
      
      if (!data.data) {
        throw new Error('No data returned from create API');
      }
      
      const apiCode = data.data;
      
      return {
        id: String(apiCode.id || ''),
        code: apiCode.code || '',
        description: apiCode.description || '',
        type: apiCode.discount_type === 'percentage' ? PromoCodeType.PERCENTAGE : PromoCodeType.FIXED_AMOUNT,
        value: parseFloat(String(apiCode.discount_value || 0)) || 0,
        minBookingAmount: parseFloat(String(apiCode.min_booking_amount || 0)) || 0,
        maxDiscount: parseFloat(String(apiCode.max_discount_amount || 0)) || 0,
        usageLimit: parseInt(String(apiCode.max_uses || 0)) || null,
        usageCount: parseInt(String(apiCode.current_uses || 0)) || 0,
        validFrom: apiCode.valid_from || new Date().toISOString().split('T')[0],
        validUntil: apiCode.valid_until || '',
        status: apiCode.is_active !== false ? PromoCodeStatus.ACTIVE : PromoCodeStatus.INACTIVE,
        applicableTours: [],
        createdBy: 'admin', // Default value since DB doesn't store this
        createdDate: apiCode.created_at ? apiCode.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: apiCode.updated_at ? apiCode.updated_at.split('T')[0] : undefined
      };
    } catch (error) {
      console.error('[PromoCodeService] Error creating promo code:', error);
      throw error;
    }
  },

  /**
   * Update an existing promo code
   */
  update: async (id: string, updates: Partial<PromoCode>): Promise<PromoCode> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const payload: any = {
        id: parseInt(id)
      };
      
      // Only include fields that are explicitly provided (not undefined) to support 0 and falsy values
      if (updates.description !== undefined) {
        payload.description = updates.description;
      }
      if (updates.value !== undefined) {
        payload.discountValue = updates.value;
      }
      if (updates.validUntil !== undefined) {
        payload.validUntil = updates.validUntil;
      }
      if (updates.status !== undefined) {
        payload.isActive = updates.status === PromoCodeStatus.ACTIVE;
      }
      if (updates.usageLimit !== undefined) {
        payload.maxUses = updates.usageLimit;
      }
      if (updates.minBookingAmount !== undefined) {
        payload.minBookingAmount = updates.minBookingAmount;
      }
      if (updates.maxDiscount !== undefined) {
        payload.maxDiscountAmount = updates.maxDiscount;
      }
      
      const response = await fetch(`${API_URL}/api/promo-codes-update.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update promo code');
      }
      
      // Handle case where API returns the updated code in response
      if (!data.data) {
        throw new Error('No data returned from update API');
      }
      
      // Transform the updated code from API response
      const apiCode = data.data;
      
      // Validate required fields exist
      if (!apiCode.id && !id) {
        throw new Error('Promo code ID is missing');
      }
      
      const updated: PromoCode = {
        id: String(apiCode.id || id),
        code: apiCode.code || '',
        description: apiCode.description || '',
        type: apiCode.discount_type === 'percentage' ? PromoCodeType.PERCENTAGE : PromoCodeType.FIXED_AMOUNT,
        value: parseFloat(String(apiCode.discount_value || 0)) || 0,
        minBookingAmount: parseFloat(String(apiCode.min_booking_amount || 0)) || 0,
        maxDiscount: parseFloat(String(apiCode.max_discount_amount || 0)) || 0,
        usageLimit: parseInt(String(apiCode.max_uses || 0)) || null,
        usageCount: parseInt(String(apiCode.current_uses || 0)) || 0,
        validFrom: apiCode.valid_from || '',
        validUntil: apiCode.valid_until || '',
        status: apiCode.is_active ? PromoCodeStatus.ACTIVE : PromoCodeStatus.INACTIVE,
        applicableTours: [],
        createdBy: 'admin', // Default value since DB doesn't store this
        createdDate: apiCode.created_at ? apiCode.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        lastModified: apiCode.updated_at ? apiCode.updated_at.split('T')[0] : undefined
      };
      
      return updated;
    } catch (error) {
      console.error('[PromoCodeService] Error updating promo code:', error);
      throw error;
    }
  },

  /**
   * Delete a promo code
   */
  delete: async (id: string): Promise<void> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/promo-codes-delete.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: parseInt(id) })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete promo code');
      }
    } catch (error) {
      console.error('[PromoCodeService] Error deleting promo code:', error);
      throw error;
    }
  },

  /**
   * Increment usage count when promo code is used
   */
  incrementUsage: async (code: string): Promise<void> => {
    try {
      // Usage tracking would be done via the booking creation API
      // The backend automatically increments when a booking is created with a promo code
      console.log('[PromoCodeService] Usage tracked for code:', code);
    } catch (error) {
      console.error('[PromoCodeService] Error tracking usage:', error);
    }
  }
};
