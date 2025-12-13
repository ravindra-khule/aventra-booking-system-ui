/**
 * Tour Pricing Types - Seasonal, dynamic, and discount pricing
 */

// Seasonal Period
export interface SeasonalPeriod {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  priceMultiplier: number; // 0.8 = 20% discount, 1.2 = 20% premium
  description?: string;
  color?: string;
}

// Dynamic Pricing Rule
export interface DynamicPricingRule {
  id: string;
  name: string;
  isActive: boolean;
  basePrice: number;
  
  // Demand-based pricing
  occupancyThresholds: {
    minOccupancy: number; // 0-100%
    maxOccupancy: number;
    priceMultiplier: number;
  }[];
  
  // Days to departure
  daysToDepatureRules: {
    daysRange: { min: number; max: number };
    priceMultiplier: number;
  }[];
  
  tourIds: string[]; // Which tours this applies to
}

// Group Discount Tier
export interface GroupDiscountTier {
  id: string;
  name: string;
  minGroupSize: number;
  maxGroupSize?: number;
  discountPercentage: number; // 0-100
  pricePerPerson?: number; // Optional fixed price for group
  description?: string;
}

// Pricing Rule - Early Bird & Last Minute
export interface EarlyBirdLastMinuteRule {
  id: string;
  
  // Early Bird
  earlyBirdEnabled: boolean;
  earlyBirdDaysBeforeDeparture: number;
  earlyBirdDiscount: number; // percentage
  
  // Last Minute
  lastMinuteEnabled: boolean;
  lastMinuteDaysBeforeDeparture: number;
  lastMinuteDiscount: number; // percentage
  
  tourIds: string[];
}

// Blackout Date Period
export interface BlackoutPeriod {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  reason?: string;
  blocksAllTours: boolean;
  tourIds: string[];
  allowManualOverride: boolean;
}

// Capacity Setting
export interface CapacitySetting {
  id: string;
  tourId: string;
  
  minCapacity: number;
  maxCapacity: number;
  preferredCapacity?: number;
  
  autoReleaseDate?: string; // Release spots if not filled by this date
  blockedSeats?: number; // Reserve seats for staff/guides
  
  bufferCapacity?: number; // Minimum capacity to maintain
}

// Price Calendar Entry
export interface PriceCalendarEntry {
  id: string;
  tourId: string;
  date: string; // YYYY-MM-DD
  price: number;
  depositPrice: number;
  availableSpots: number;
  status: 'available' | 'limited' | 'full' | 'blackout';
  occupancyPercentage: number;
  
  // Which pricing rule applies
  appliedRules: {
    seasonal?: string;
    dynamic?: string;
    groupDiscount?: string;
    earlyBird?: string;
    lastMinute?: string;
  };
}

// Price History Entry (Analytics)
export interface PriceHistoryEntry {
  id: string;
  tourId: string;
  date: string;
  
  originalPrice: number;
  finalPrice: number;
  priceChanges: {
    seasonal?: { amount: number; reason: string };
    dynamic?: { amount: number; reason: string };
    discount?: { amount: number; reason: string };
  };
  
  timestamp: string;
  changedBy?: string; // User ID or system
  notes?: string;
}

// Pricing Analytics
export interface PricingAnalytics {
  tourId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  
  statistics: {
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    priceRange: number;
    
    occupancyRate: number;
    bookingsCount: number;
    totalRevenue: number;
    
    priceElasticity?: number; // Revenue sensitivity to price changes
    demandTrend?: 'increasing' | 'stable' | 'decreasing';
  };
  
  byMonth: {
    month: string;
    averagePrice: number;
    occupancyRate: number;
    bookings: number;
    revenue: number;
  }[];
  
  discountsApplied: {
    type: 'seasonal' | 'group' | 'earlyBird' | 'lastMinute' | 'custom';
    count: number;
    totalAmount: number;
    averageDiscount: number;
  }[];
}

// Bulk Pricing Update
export interface BulkPricingUpdate {
  id: string;
  name: string;
  description?: string;
  
  tourIds: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  
  updateType: 'set' | 'increase' | 'decrease' | 'multiply';
  updateValue: number;
  
  includeDeposit: boolean;
  depositPercentage?: number; // If null, keep current ratio
  
  status: 'draft' | 'scheduled' | 'applied' | 'cancelled';
  scheduledDate?: string;
  appliedDate?: string;
  
  createdAt: string;
  createdBy?: string;
}

// Pricing Configuration (Main container)
export interface PricingConfiguration {
  tourId: string;
  
  basePricing: {
    basePrice: number;
    currency: string;
    depositPercentage: number;
  };
  
  seasonalPricing: SeasonalPeriod[];
  dynamicPricing: DynamicPricingRule[];
  groupDiscounts: GroupDiscountTier[];
  earlyBirdLastMinute: EarlyBirdLastMinuteRule[];
  blackoutPeriods: BlackoutPeriod[];
  capacitySettings: CapacitySetting;
  
  priceCalendar: PriceCalendarEntry[];
  priceHistory: PriceHistoryEntry[];
  
  updatedAt: string;
  updatedBy?: string;
}

// Filter for price calendar view
export interface PriceCalendarFilter {
  tourId?: string;
  startDate?: string;
  endDate?: string;
  status?: ('available' | 'limited' | 'full' | 'blackout')[];
  showPricingRules?: boolean;
}

// Settings for pricing calculations
export interface PricingCalculationSettings {
  applyRulesInOrder: boolean;
  maxDiscountPercentage: number; // Cap total discounts
  roundingMethod: 'up' | 'down' | 'nearest'; // How to round calculated prices
  minPriceFloor?: number; // Minimum price never go below
  maxPriceCeiling?: number; // Maximum price never go above
}
