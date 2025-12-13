/**
 * Marketing Analytics Types
 * Defines types for marketing analytics dashboards and reporting
 */

export interface MetricValue {
  current: number;
  previous?: number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface KeyMetric {
  id: string;
  label: string;
  value: MetricValue;
  icon?: string;
  unit?: string;
  color?: string;
}

export interface DashboardMetrics {
  totalImpressions: MetricValue;
  totalClicks: MetricValue;
  clickThroughRate: MetricValue;
  conversions: MetricValue;
  conversionRate: MetricValue;
  revenue: MetricValue;
  averageOrderValue: MetricValue;
}

// Conversion Funnel Analysis
export interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  conversionRate?: number;
}

export interface ConversionFunnel {
  stages: FunnelStage[];
  totalUsers: number;
  overallConversionRate: number;
  data: {
    date: string;
    views: number;
    clicks: number;
    addToCart: number;
    bookings: number;
  }[];
}

// Customer Acquisition Cost
export interface CACData {
  channel: string;
  totalSpend: number;
  acquisitions: number;
  cac: number;
  roi: number;
}

export interface CACAnalytics {
  totalSpend: number;
  totalAcquisitions: number;
  averageCAC: number;
  channels: CACData[];
  data: {
    date: string;
    spend: number;
    acquisitions: number;
  }[];
}

// Email Engagement Metrics
export interface EmailMetrics {
  campaignId: string;
  campaignName: string;
  sentCount: number;
  openCount: number;
  openRate: number;
  clickCount: number;
  clickThroughRate: number;
  unsubscribeCount: number;
  bounceCount: number;
  spamCount: number;
}

export interface EmailEngagementAnalytics {
  totalSent: number;
  totalOpens: number;
  averageOpenRate: number;
  totalClicks: number;
  averageClickThroughRate: number;
  campaigns: EmailMetrics[];
  data: {
    date: string;
    sent: number;
    opens: number;
    clicks: number;
  }[];
}

// Promo Code Analytics
export interface PromoCodeAnalytics {
  code: string;
  timesUsed: number;
  totalDiscount: number;
  revenue: number;
  roi: number;
  status: 'active' | 'expired' | 'disabled';
  expiryDate?: string;
}

export interface PromoAnalyticsSummary {
  totalCodesCreated: number;
  activeCodesCount: number;
  totalDiscountGiven: number;
  totalRevenueFromPromos: number;
  averageRoi: number;
  codes: PromoCodeAnalytics[];
  data: {
    date: string;
    codesUsed: number;
    discountAmount: number;
    revenue: number;
  }[];
}

// Customer Lifetime Value
export interface CLVSegment {
  segment: string;
  customerCount: number;
  averageCLV: number;
  totalCLV: number;
  acquisitionCost: number;
  profitMargin: number;
}

export interface CLVAnalytics {
  overallAverageCLV: number;
  totalCustomerValue: number;
  segments: CLVSegment[];
  topCustomers: {
    customerId: string;
    name: string;
    clv: number;
    purchaseCount: number;
    lastPurchaseDate: string;
  }[];
}

// Traffic Source Analysis
export interface TrafficSource {
  source: string;
  sourceType: 'organic' | 'paid' | 'referral' | 'direct' | 'social' | 'email';
  visits: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversions: number;
  revenue: number;
}

export interface TrafficAnalytics {
  totalVisits: number;
  totalUniqueVisitors: number;
  averageBounceRate: number;
  sources: TrafficSource[];
  data: {
    date: string;
    organic: number;
    paid: number;
    referral: number;
    direct: number;
    social: number;
    email: number;
  }[];
}

// Export Report Types
export interface ExportFormat {
  format: 'excel' | 'pdf';
  includeCharts: boolean;
  includeMetrics: boolean;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface AnalyticsReport {
  title: string;
  generatedAt: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  metrics?: DashboardMetrics;
  funnel?: ConversionFunnel;
  cac?: CACAnalytics;
  email?: EmailEngagementAnalytics;
  promoAnalytics?: PromoAnalyticsSummary;
  clv?: CLVAnalytics;
  traffic?: TrafficAnalytics;
}

// Analytics Filters
export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  channels?: string[];
  campaigns?: string[];
  sourceTypes?: string[];
  segment?: string;
}

// Analytics Service Response Types
export interface AnalyticsResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface DateRangeOption {
  label: string;
  value: 'today' | '7d' | '30d' | '90d' | 'custom' | 'all';
  getDates?: () => { startDate: string; endDate: string };
}
