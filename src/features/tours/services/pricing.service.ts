/**
 * Tour Pricing Service - CRUD operations for pricing management
 */

import {
  PricingConfiguration,
  SeasonalPeriod,
  DynamicPricingRule,
  GroupDiscountTier,
  EarlyBirdLastMinuteRule,
  BlackoutPeriod,
  CapacitySetting,
  PriceCalendarEntry,
  PriceHistoryEntry,
  PricingAnalytics,
  BulkPricingUpdate,
  PricingCalculationSettings,
  PriceCalendarFilter,
} from '../types/pricing.types';

class TourPricingService {
  private baseUrl = '/api/tours/pricing';

  /**
   * Get pricing configuration for a tour
   */
  async getPricingConfiguration(tourId: string): Promise<PricingConfiguration> {
    // Mock data
    return {
      tourId,
      basePricing: {
        basePrice: 2500,
        currency: 'SEK',
        depositPercentage: 30,
      },
      seasonalPricing: [
        {
          id: 'sp1',
          name: 'High Season (Summer)',
          startDate: '2025-06-01',
          endDate: '2025-08-31',
          priceMultiplier: 1.4,
          description: 'Peak tourist season',
          color: '#EF4444',
        },
        {
          id: 'sp2',
          name: 'Shoulder Season',
          startDate: '2025-04-01',
          endDate: '2025-05-31',
          priceMultiplier: 1.15,
          description: 'Spring and early summer',
          color: '#F59E0B',
        },
        {
          id: 'sp3',
          name: 'Low Season (Winter)',
          startDate: '2025-12-01',
          endDate: '2025-02-28',
          priceMultiplier: 0.8,
          description: 'Winter discounts',
          color: '#3B82F6',
        },
      ],
      dynamicPricing: [
        {
          id: 'dp1',
          name: 'Occupancy-based Pricing',
          isActive: true,
          basePrice: 2500,
          occupancyThresholds: [
            { minOccupancy: 0, maxOccupancy: 25, priceMultiplier: 0.85 },
            { minOccupancy: 25, maxOccupancy: 50, priceMultiplier: 1.0 },
            { minOccupancy: 50, maxOccupancy: 75, priceMultiplier: 1.15 },
            { minOccupancy: 75, maxOccupancy: 100, priceMultiplier: 1.3 },
          ],
          daysToDepatureRules: [
            { daysRange: { min: 60, max: 120 }, priceMultiplier: 0.9 },
            { daysRange: { min: 30, max: 60 }, priceMultiplier: 1.1 },
            { daysRange: { min: 14, max: 30 }, priceMultiplier: 1.25 },
            { daysRange: { min: 0, max: 14 }, priceMultiplier: 1.4 },
          ],
          tourIds: [tourId],
        },
      ],
      groupDiscounts: [
        {
          id: 'gd1',
          name: 'Small Group',
          minGroupSize: 4,
          maxGroupSize: 6,
          discountPercentage: 5,
          description: 'For groups of 4-6 people',
        },
        {
          id: 'gd2',
          name: 'Medium Group',
          minGroupSize: 7,
          maxGroupSize: 12,
          discountPercentage: 10,
          description: 'For groups of 7-12 people',
        },
        {
          id: 'gd3',
          name: 'Large Group',
          minGroupSize: 13,
          maxGroupSize: undefined,
          discountPercentage: 15,
          description: 'For groups of 13+ people',
        },
      ],
      earlyBirdLastMinute: [
        {
          id: 'ebm1',
          earlyBirdEnabled: true,
          earlyBirdDaysBeforeDeparture: 60,
          earlyBirdDiscount: 12,
          lastMinuteEnabled: true,
          lastMinuteDaysBeforeDeparture: 14,
          lastMinuteDiscount: 15,
          tourIds: [tourId],
        },
      ],
      blackoutPeriods: [
        {
          id: 'bp1',
          name: 'Maintenance Period',
          startDate: '2025-01-15',
          endDate: '2025-01-25',
          reason: 'Annual equipment maintenance',
          blocksAllTours: true,
          tourIds: [],
          allowManualOverride: false,
        },
        {
          id: 'bp2',
          name: 'Religious Holiday',
          startDate: '2025-04-18',
          endDate: '2025-04-20',
          reason: 'Easter holiday',
          blocksAllTours: false,
          tourIds: [tourId],
          allowManualOverride: true,
        },
      ],
      capacitySettings: {
        id: 'cs1',
        tourId,
        minCapacity: 4,
        maxCapacity: 16,
        preferredCapacity: 12,
        blockedSeats: 2,
        bufferCapacity: 4,
      },
      priceCalendar: this.generateMockPriceCalendar(tourId),
      priceHistory: this.generateMockPriceHistory(tourId),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update seasonal pricing
   */
  async updateSeasonalPricing(
    tourId: string,
    periods: SeasonalPeriod[]
  ): Promise<SeasonalPeriod[]> {
    // Mock implementation
    console.log(`Updated seasonal pricing for tour ${tourId}:`, periods);
    return periods;
  }

  /**
   * Create or update dynamic pricing rule
   */
  async updateDynamicPricingRule(
    tourId: string,
    rule: DynamicPricingRule
  ): Promise<DynamicPricingRule> {
    console.log(`Updated dynamic pricing rule for tour ${tourId}:`, rule);
    return { ...rule, id: rule.id || 'dp_' + Date.now() };
  }

  /**
   * Update group discounts
   */
  async updateGroupDiscounts(
    tourId: string,
    discounts: GroupDiscountTier[]
  ): Promise<GroupDiscountTier[]> {
    console.log(`Updated group discounts for tour ${tourId}:`, discounts);
    return discounts;
  }

  /**
   * Update early bird and last minute rules
   */
  async updateEarlyBirdLastMinute(
    tourId: string,
    rule: EarlyBirdLastMinuteRule
  ): Promise<EarlyBirdLastMinuteRule> {
    console.log(`Updated early bird/last minute rule for tour ${tourId}:`, rule);
    return { ...rule, id: rule.id || 'ebm_' + Date.now() };
  }

  /**
   * Add or update blackout period
   */
  async updateBlackoutPeriod(
    tourId: string,
    period: BlackoutPeriod
  ): Promise<BlackoutPeriod> {
    console.log(`Updated blackout period for tour ${tourId}:`, period);
    return { ...period, id: period.id || 'bp_' + Date.now() };
  }

  /**
   * Delete blackout period
   */
  async deleteBlackoutPeriod(tourId: string, periodId: string): Promise<void> {
    console.log(`Deleted blackout period ${periodId} for tour ${tourId}`);
  }

  /**
   * Update capacity settings
   */
  async updateCapacitySettings(
    tourId: string,
    settings: CapacitySetting
  ): Promise<CapacitySetting> {
    console.log(`Updated capacity settings for tour ${tourId}:`, settings);
    return settings;
  }

  /**
   * Get price calendar for a tour
   */
  async getPriceCalendar(
    tourId: string,
    filter?: PriceCalendarFilter
  ): Promise<PriceCalendarEntry[]> {
    return this.generateMockPriceCalendar(tourId);
  }

  /**
   * Get price history and analytics
   */
  async getPricingAnalytics(
    tourId: string,
    startDate: string,
    endDate: string
  ): Promise<PricingAnalytics> {
    return {
      tourId,
      period: { startDate, endDate },
      statistics: {
        averagePrice: 2845,
        minPrice: 1800,
        maxPrice: 3500,
        priceRange: 1700,
        occupancyRate: 72,
        bookingsCount: 28,
        totalRevenue: 79660,
        priceElasticity: 0.65,
        demandTrend: 'increasing',
      },
      byMonth: [
        {
          month: '2025-01',
          averagePrice: 2100,
          occupancyRate: 45,
          bookings: 6,
          revenue: 12600,
        },
        {
          month: '2025-02',
          averagePrice: 2300,
          occupancyRate: 58,
          bookings: 8,
          revenue: 18400,
        },
        {
          month: '2025-03',
          averagePrice: 2750,
          occupancyRate: 75,
          bookings: 9,
          revenue: 24750,
        },
        {
          month: '2025-04',
          averagePrice: 3200,
          occupancyRate: 85,
          bookings: 5,
          revenue: 16000,
        },
      ],
      discountsApplied: [
        {
          type: 'group',
          count: 8,
          totalAmount: 3400,
          averageDiscount: 425,
        },
        {
          type: 'earlyBird',
          count: 12,
          totalAmount: 4200,
          averageDiscount: 350,
        },
        {
          type: 'seasonal',
          count: 20,
          totalAmount: 8500,
          averageDiscount: 425,
        },
      ],
    };
  }

  /**
   * Apply bulk pricing update
   */
  async applyBulkPricingUpdate(update: BulkPricingUpdate): Promise<BulkPricingUpdate> {
    console.log('Applied bulk pricing update:', update);
    return { ...update, status: 'applied', appliedDate: new Date().toISOString() };
  }

  /**
   * Get price history for a tour
   */
  async getPriceHistory(
    tourId: string,
    limit: number = 50
  ): Promise<PriceHistoryEntry[]> {
    return this.generateMockPriceHistory(tourId).slice(0, limit);
  }

  /**
   * Calculate final price for a specific date
   */
  async calculatePrice(
    tourId: string,
    date: string,
    groupSize: number,
    occupancyPercentage: number
  ): Promise<{
    basePrice: number;
    finalPrice: number;
    breakdown: Array<{ rule: string; amount: number }>;
  }> {
    const basePrice = 2500;
    let finalPrice = basePrice;
    const breakdown = [];

    // Seasonal adjustment
    const month = new Date(date).getMonth();
    if (month >= 5 && month <= 7) {
      finalPrice *= 1.4;
      breakdown.push({ rule: 'Seasonal (Summer)', amount: basePrice * 0.4 });
    }

    // Group discount
    if (groupSize >= 13) {
      const discount = finalPrice * 0.15;
      finalPrice -= discount;
      breakdown.push({ rule: 'Large Group (15% off)', amount: -discount });
    } else if (groupSize >= 7) {
      const discount = finalPrice * 0.1;
      finalPrice -= discount;
      breakdown.push({ rule: 'Medium Group (10% off)', amount: -discount });
    }

    return {
      basePrice,
      finalPrice: Math.round(finalPrice),
      breakdown,
    };
  }

  // Helper methods
  private generateMockPriceCalendar(tourId: string): PriceCalendarEntry[] {
    const calendar: PriceCalendarEntry[] = [];
    const startDate = new Date(2025, 0, 1);
    const endDate = new Date(2025, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const month = d.getMonth();

      // Determine price based on season
      let price = 2500;
      let multiplier = 1;

      if (month >= 5 && month <= 7) {
        multiplier = 1.4; // Summer
      } else if ((month >= 3 && month <= 4) || (month >= 8 && month <= 9)) {
        multiplier = 1.15; // Shoulder
      } else if (month === 0 || month === 1 || month === 11) {
        multiplier = 0.8; // Winter
      }

      price = Math.round(2500 * multiplier);

      // Random occupancy
      const occupancyPercentage = Math.floor(Math.random() * 100);
      let status: 'available' | 'limited' | 'full' | 'blackout' = 'available';
      if (occupancyPercentage > 90) status = 'full';
      else if (occupancyPercentage > 70) status = 'limited';

      calendar.push({
        id: `pc_${tourId}_${dateStr}`,
        tourId,
        date: dateStr,
        price,
        depositPrice: Math.round(price * 0.3),
        availableSpots: Math.max(0, 16 - Math.floor((occupancyPercentage / 100) * 16)),
        status,
        occupancyPercentage,
        appliedRules: {
          seasonal: multiplier !== 1 ? `${multiplier}x multiplier` : undefined,
        },
      });
    }

    return calendar;
  }

  private generateMockPriceHistory(tourId: string): PriceHistoryEntry[] {
    const history: PriceHistoryEntry[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      history.push({
        id: `ph_${tourId}_${i}`,
        tourId,
        date: dateStr,
        originalPrice: 2500,
        finalPrice: 2500 + (i * 10),
        priceChanges: {
          dynamic: { amount: i * 10, reason: 'Occupancy increased' },
        },
        timestamp: date.toISOString(),
        changedBy: 'system',
        notes: `Automatic adjustment based on occupancy`,
      });
    }

    return history;
  }
}

export const pricingService = new TourPricingService();
export type { TourPricingService };
