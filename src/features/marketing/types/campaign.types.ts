/**
 * Campaign Management Types
 * Comprehensive types for multi-channel marketing campaigns
 */

/**
 * Campaign Channel Enums
 */
export enum CampaignChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
}

/**
 * Campaign Status Enums
 */
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED'
}

/**
 * A/B Test Status
 */
export enum ABTestStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  INCONCLUSIVE = 'INCONCLUSIVE'
}

/**
 * Audience Segment Type
 */
export enum AudienceSegmentType {
  BOOKING_HISTORY = 'BOOKING_HISTORY',
  CUSTOMER_VALUE = 'CUSTOMER_VALUE',
  GEOGRAPHIC = 'GEOGRAPHIC',
  BEHAVIORAL = 'BEHAVIORAL',
  CUSTOM = 'CUSTOM',
  DEMOGRAPHIC = 'DEMOGRAPHIC'
}

/**
 * Campaign Template Type
 */
export enum CampaignTemplateType {
  SEASONAL_PROMOTION = 'SEASONAL_PROMOTION',
  WELCOME_SERIES = 'WELCOME_SERIES',
  ABANDONED_CART = 'ABANDONED_CART',
  WIN_BACK = 'WIN_BACK',
  CROSS_SELL = 'CROSS_SELL',
  LOYALTY_REWARD = 'LOYALTY_REWARD'
}

/**
 * Audience Segment Interface
 * Defines customer groupings for targeting
 */
export interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  segmentType: AudienceSegmentType;
  criteria: SegmentCriteria;
  customerCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Segment Criteria
 */
export interface SegmentCriteria {
  bookingFrequency?: {
    min: number;
    max: number;
  };
  totalSpend?: {
    min: number;
    max: number;
  };
  lastBookingDaysAgo?: {
    min: number;
    max: number;
  };
  preferredTours?: string[];
  location?: string[];
  status?: string[];
  customFilters?: Record<string, any>;
}

/**
 * Campaign Template Interface
 * Pre-built templates for quick campaign setup
 */
export interface CampaignTemplate {
  id: string;
  name: string;
  description: string;
  templateType: CampaignTemplateType;
  thumbnail?: string;
  emailTemplate?: EmailTemplateContent;
  smsTemplate?: SMSTemplateContent;
  socialTemplate?: SocialTemplateContent;
  recommendedChannels: CampaignChannel[];
  targetSegments: AudienceSegmentType[];
  estimatedConversion?: number; // percentage
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

/**
 * Email Template Content
 */
export interface EmailTemplateContent {
  subject: string;
  preheader?: string;
  htmlContent: string;
  textContent: string;
  imageUrl?: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
}

/**
 * SMS Template Content
 */
export interface SMSTemplateContent {
  message: string;
  characterCount: number;
  includeLink: boolean;
  shortUrl?: string;
}

/**
 * Social Media Template Content
 */
export interface SocialTemplateContent {
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'TWITTER' | 'LINKEDIN';
  postText: string;
  imageUrl?: string;
  videoUrl?: string;
  hashTags: string[];
  callToAction?: string;
}

/**
 * A/B Test Variant
 */
export interface ABTestVariant {
  id: string;
  name: string;
  isControl: boolean;
  emailContent?: EmailTemplateContent;
  smsContent?: SMSTemplateContent;
  socialContent?: SocialTemplateContent;
  percentage: number; // Percentage of audience for this variant
  metrics?: VariantMetrics;
}

/**
 * A/B Test Metrics
 */
export interface VariantMetrics {
  sent: number;
  delivered: number;
  opened?: number; // For email
  clicked?: number;
  converted: number;
  openRate?: number;
  clickRate?: number;
  conversionRate: number;
  unsubscribeRate?: number;
  bounceRate?: number;
}

/**
 * Main Campaign Interface
 */
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  channels: CampaignChannel[];
  templateId?: string; // Reference to campaign template
  audienceSegments: AudienceSegment[];
  audienceSize: number;
  
  // Content
  emailContent?: EmailTemplateContent;
  smsContent?: SMSTemplateContent;
  socialContent?: SocialTemplateContent;
  
  // Scheduling
  scheduledFor?: Date;
  startDate: Date;
  endDate: Date;
  
  // A/B Testing
  hasABTest: boolean;
  abTestConfig?: ABTestConfig;
  
  // Promo Code Integration
  associatedPromoCode?: string;
  promoCodeId?: string;
  
  // Metrics
  metrics: CampaignMetrics;
  
  // ROI Tracking
  roiTracking: ROIMetrics;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastScheduledAt?: Date;
  notes?: string;
}

/**
 * A/B Test Configuration
 */
export interface ABTestConfig {
  id: string;
  testName: string;
  status: ABTestStatus;
  variants: ABTestVariant[];
  testDuration: number; // in hours
  startedAt: Date;
  endedAt?: Date;
  winningVariant?: string; // variant ID
  confidence?: number; // percentage confidence
  statisticalSignificance?: number;
  winner?: {
    variantId: string;
    improvement: number; // percentage
  };
}

/**
 * Campaign Metrics
 */
export interface CampaignMetrics {
  sent: number;
  delivered: number;
  bounced: number;
  opened?: number; // Email specific
  clicked?: number;
  converted: number;
  unsubscribed?: number;
  complained?: number;
  
  // Calculated rates
  deliveryRate: number;
  openRate?: number;
  clickRate?: number;
  conversionRate: number;
  bounceRate: number;
  unsubscribeRate?: number;
  
  // Performance
  revenue: number;
  avgOrderValue?: number;
  avgCustomerValue?: number;
}

/**
 * ROI Metrics
 */
export interface ROIMetrics {
  campaignCost: number;
  revenue: number;
  profit: number;
  roi: number; // percentage
  roas: number; // Return on Ad Spend
  costPerConversion: number;
  costPerClick?: number;
  costPerOpen?: number;
  breakEvenDate?: Date;
  projectedROI?: number; // If campaign is still running
}

/**
 * Campaign Performance Analytics
 */
export interface CampaignAnalytics {
  campaignId: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  metrics: CampaignMetrics;
  roiMetrics: ROIMetrics;
  channelPerformance: Record<CampaignChannel, CampaignMetrics>;
  segmentPerformance: Record<string, SegmentPerformance>; // segmentId -> metrics
  hourlyData: HourlyMetrics[];
  topPerformingContent?: ContentPerformance[];
}

/**
 * Segment Performance
 */
export interface SegmentPerformance {
  segmentId: string;
  segmentName: string;
  metrics: CampaignMetrics;
  conversionsBySegment: number;
  revenuBySegment: number;
}

/**
 * Hourly Metrics for trend analysis
 */
export interface HourlyMetrics {
  timestamp: Date;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
}

/**
 * Content Performance
 */
export interface ContentPerformance {
  contentId: string;
  contentType: CampaignChannel;
  title: string;
  metrics: CampaignMetrics;
  rank: number;
}

/**
 * Campaign Schedule
 */
export interface CampaignSchedule {
  campaignId: string;
  scheduledFor: Date;
  sendImmediately: boolean;
  recurringPattern?: RecurringPattern;
  timezone: string;
}

/**
 * Recurring Pattern for scheduled campaigns
 */
export interface RecurringPattern {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  interval: number;
  daysOfWeek?: number[]; // 0-6
  dayOfMonth?: number;
  endDate?: Date;
  occurrences?: number;
}

/**
 * Campaign Create/Update Request
 */
export interface CampaignRequest {
  name: string;
  description?: string;
  channels: CampaignChannel[];
  templateId?: string;
  audienceSegments: string[]; // segment IDs
  emailContent?: EmailTemplateContent;
  smsContent?: SMSTemplateContent;
  socialContent?: SocialTemplateContent;
  scheduledFor?: Date;
  startDate: Date;
  endDate: Date;
  hasABTest: boolean;
  abTestConfig?: Omit<ABTestConfig, 'id' | 'startedAt'>;
  associatedPromoCode?: string;
  promoCodeId?: string;
  notes?: string;
}

/**
 * Campaign Analytics Request
 */
export interface CampaignAnalyticsRequest {
  campaignId: string;
  startDate: Date;
  endDate: Date;
  groupBy?: 'CHANNEL' | 'SEGMENT' | 'HOURLY' | 'DAILY';
}

/**
 * Campaign List Filter
 */
export interface CampaignFilter {
  status?: CampaignStatus[];
  channels?: CampaignChannel[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  createdBy?: string;
  segmentIds?: string[];
  searchTerm?: string;
}
