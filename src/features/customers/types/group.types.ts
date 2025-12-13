/**
 * Customer Group Types - Segment management and grouping
 */

/**
 * Rule Operator for smart group conditions
 */
export type RuleOperator = 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'between' | 'in';

/**
 * Smart Group Rule - Dynamic condition for auto-segmentation
 */
export interface SmartGroupRule {
  id: string;
  field: 'totalBookings' | 'totalSpent' | 'lastBookingDate' | 'registrationDate' | 'country' | 'tags';
  operator: RuleOperator;
  value: string | number | string[] | { min: number; max: number };
  logicOperator?: 'AND' | 'OR'; // For multiple rules
}

/**
 * Pricing Rule for group-specific pricing
 */
export interface GroupPricingRule {
  id: string;
  tourId: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minGroupSize?: number;
  description?: string;
}

/**
 * Customer Group - Main group entity
 */
export interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  type: 'manual' | 'smart';
  
  // Membership
  memberIds: string[];
  memberCount: number;
  
  // Rules (for smart groups)
  smartRules?: SmartGroupRule[];
  
  // Pricing & Discounts
  pricingRules: GroupPricingRule[];
  defaultDiscount?: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  
  // Tags & Organization
  tags: string[];
  color?: string; // For UI display
  
  // Metadata
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  isActive: boolean;
  
  // Analytics
  stats: {
    totalRevenue: number;
    avgBookingValue: number;
    avgBookingsPerMember: number;
    lastActivityDate?: string;
  };
}

/**
 * Group Analytics - Detailed group insights
 */
export interface GroupAnalytics {
  groupId: string;
  groupName: string;
  memberCount: number;
  totalRevenue: number;
  avgRevenuePerMember: number;
  bookingCount: number;
  avgBookingValue: number;
  conversionRate: number;
  customerLifetimeValue: number;
  churnRate: number;
  topDestinations: Array<{ tourId: string; bookingCount: number; revenue: number }>;
  growthTrend: Array<{ date: string; memberCount: number; revenue: number }>;
}

/**
 * Bulk Action Request
 */
export interface BulkActionRequest {
  groupIds: string[];
  action: 'activate' | 'deactivate' | 'delete' | 'addTag' | 'applyDiscount';
  payload?: {
    tag?: string;
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
  };
}

/**
 * Group Export Format
 */
export interface GroupExportData {
  groupId: string;
  groupName: string;
  description: string;
  memberCount: number;
  members: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    bookingCount: number;
  }>;
  pricingRules: GroupPricingRule[];
  tags: string[];
  exportDate: string;
}
