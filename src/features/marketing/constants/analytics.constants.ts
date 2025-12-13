/**
 * Marketing Analytics Constants
 * Common values and configurations for analytics features
 */

import { DateRangeOption } from '../types/analytics.types';

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  {
    label: 'Today',
    value: 'today',
    getDates: () => {
      const today = new Date();
      return {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Last 7 Days',
    value: '7d',
    getDates: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Last 30 Days',
    value: '30d',
    getDates: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'Last 90 Days',
    value: '90d',
    getDates: () => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };
    },
  },
  {
    label: 'All Time',
    value: 'all',
  },
];

export const TRAFFIC_SOURCE_COLORS = {
  organic: '#10b981',
  paid: '#3b82f6',
  referral: '#f59e0b',
  direct: '#8b5cf6',
  social: '#ec4899',
  email: '#06b6d4',
};

export const TRAFFIC_SOURCE_ICONS = {
  organic: 'Search',
  paid: 'DollarSign',
  referral: 'Share2',
  direct: 'Eye',
  social: 'Share',
  email: 'Mail',
};

export const METRIC_COLORS = {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#6b7280',
};

export const PROMO_CODE_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  DISABLED: 'disabled',
};

export const CAC_CHANNELS = [
  'Google Ads',
  'Facebook',
  'Instagram',
  'Email',
  'Organic',
  'Referral',
];

export const FUNNEL_STAGES = [
  { id: 'views', name: 'Tour Views', order: 1 },
  { id: 'clicks', name: 'Clicks', order: 2 },
  { id: 'add_to_cart', name: 'Add to Cart', order: 3 },
  { id: 'bookings', name: 'Bookings', order: 4 },
];

export const EMAIL_METRICS_KEYS = [
  { key: 'openRate', label: 'Open Rate', unit: '%', decimals: 2 },
  { key: 'clickThroughRate', label: 'Click-through Rate', unit: '%', decimals: 2 },
  { key: 'bounceRate', label: 'Bounce Rate', unit: '%', decimals: 2 },
  { key: 'unsubscribeRate', label: 'Unsubscribe Rate', unit: '%', decimals: 2 },
];

export const CHART_CONFIG = {
  responsive: true,
  margin: { top: 20, right: 30, left: 0, bottom: 20 },
  colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
};

export const EXPORT_FORMATS = [
  { value: 'excel', label: 'Excel (.xlsx)', icon: 'FileText' },
  { value: 'pdf', label: 'PDF Document', icon: 'FileText' },
];

export const CLV_SEGMENTS = [
  { id: 'vip', label: 'VIP Customers', minCLV: 5000 },
  { id: 'loyal', label: 'Loyal Customers', minCLV: 1000, maxCLV: 5000 },
  { id: 'regular', label: 'Regular Customers', minCLV: 100, maxCLV: 1000 },
  { id: 'at_risk', label: 'At-Risk Customers', minCLV: 0, maxCLV: 100 },
];
