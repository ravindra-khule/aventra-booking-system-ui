/**
 * Marketing Analytics Page
 * Main page for comprehensive marketing analytics and reporting
 */

import React, { useState, useEffect } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { KeyMetricsDashboard } from '../components/KeyMetricsDashboard';
import { ConversionFunnelAnalysis } from '../components/ConversionFunnel';
import { CACTrackingAnalytics } from '../components/CACAnalytics';
import { EmailEngagementMetrics } from '../components/EmailEngagementMetrics';
import { PromoCodeAnalyticsComponent } from '../components/PromoCodeAnalytics';
import { CLVAnalyticsComponent } from '../components/CLVAnalytics';
import { TrafficSourceAnalysis } from '../components/TrafficSourceAnalytics';
import { ExportReports } from '../components/ExportReports';
import {
  DashboardMetrics,
  ConversionFunnel,
  CACAnalytics,
  EmailEngagementAnalytics,
  PromoAnalyticsSummary,
  CLVAnalytics,
  TrafficAnalytics,
  ExportFormat,
} from '../types/analytics.types';
import { DATE_RANGE_OPTIONS } from '../constants/analytics.constants';
import styles from './AnalyticsPage.module.css';

/**
 * Mock data generators - Replace with actual API calls in production
 */
const generateMockMetrics = (): DashboardMetrics => ({
  totalImpressions: {
    current: 125340,
    previous: 98200,
    changePercent: 27.6,
    trend: 'up',
  },
  totalClicks: {
    current: 8942,
    previous: 6500,
    changePercent: 37.6,
    trend: 'up',
  },
  clickThroughRate: {
    current: 7.14,
    previous: 6.62,
    changePercent: 7.8,
    trend: 'up',
  },
  conversions: {
    current: 1243,
    previous: 890,
    changePercent: 39.7,
    trend: 'up',
  },
  conversionRate: {
    current: 0.99,
    previous: 0.91,
    changePercent: 8.8,
    trend: 'up',
  },
  revenue: {
    current: 64850,
    previous: 45200,
    changePercent: 43.4,
    trend: 'up',
  },
  averageOrderValue: {
    current: 52.16,
    previous: 50.78,
    changePercent: 2.7,
    trend: 'up',
  },
});

const generateMockFunnel = (): ConversionFunnel => ({
  totalUsers: 125340,
  overallConversionRate: 0.99,
  stages: [
    { id: 'views', name: 'Tour Views', count: 125340, percentage: 100, conversionRate: 100 },
    { id: 'clicks', name: 'Clicks to Book', count: 45280, percentage: 36.1, conversionRate: 36.1 },
    { id: 'add_to_cart', name: 'Add to Cart', count: 12840, percentage: 10.2, conversionRate: 28.3 },
    { id: 'bookings', name: 'Completed Bookings', count: 1243, percentage: 0.99, conversionRate: 9.7 },
  ],
  data: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    views: Math.floor(Math.random() * 5000 + 3000),
    clicks: Math.floor(Math.random() * 2000 + 1000),
    addToCart: Math.floor(Math.random() * 600 + 300),
    bookings: Math.floor(Math.random() * 60 + 30),
  })),
});

const generateMockCACData = (): CACAnalytics => ({
  totalSpend: 45000,
  totalAcquisitions: 1243,
  averageCAC: 36.19,
  channels: [
    { channel: 'Google Ads', totalSpend: 15000, acquisitions: 520, cac: 28.85, roi: 2.24 },
    { channel: 'Facebook', totalSpend: 12000, acquisitions: 380, cac: 31.58, roi: 1.95 },
    { channel: 'Instagram', totalSpend: 10000, acquisitions: 250, cac: 40.0, roi: 1.62 },
    { channel: 'Email', totalSpend: 5000, acquisitions: 80, cac: 62.5, roi: 0.95 },
    { channel: 'Organic', totalSpend: 2000, acquisitions: 13, cac: 153.85, roi: 32.4 },
    { channel: 'Referral', totalSpend: 1000, acquisitions: 0, cac: 0, roi: 0 },
  ],
  data: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    spend: Math.floor(Math.random() * 2000 + 1000),
    acquisitions: Math.floor(Math.random() * 60 + 20),
  })),
});

const generateMockEmailMetrics = (): EmailEngagementAnalytics => ({
  totalSent: 125000,
  totalOpens: 42500,
  averageOpenRate: 34.0,
  totalClicks: 8950,
  averageClickThroughRate: 7.16,
  campaigns: [
    {
      campaignId: '1',
      campaignName: 'Spring Tours 2024',
      sentCount: 45000,
      openCount: 16200,
      openRate: 36.0,
      clickCount: 3564,
      clickThroughRate: 7.92,
      unsubscribeCount: 180,
      bounceCount: 1350,
      spamCount: 45,
    },
    {
      campaignId: '2',
      campaignName: 'Flash Sale - Europe',
      sentCount: 38000,
      openCount: 11400,
      openRate: 30.0,
      clickCount: 2280,
      clickThroughRate: 6.0,
      unsubscribeCount: 95,
      bounceCount: 950,
      spamCount: 30,
    },
    {
      campaignId: '3',
      campaignName: 'Newsletter - March',
      sentCount: 42000,
      openCount: 14900,
      openRate: 35.5,
      clickCount: 2906,
      clickThroughRate: 6.92,
      unsubscribeCount: 140,
      bounceCount: 1260,
      spamCount: 35,
    },
  ],
  data: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    sent: Math.floor(Math.random() * 5000 + 3000),
    opens: Math.floor(Math.random() * 1500 + 1000),
    clicks: Math.floor(Math.random() * 400 + 200),
  })),
});

const generateMockPromoAnalytics = (): PromoAnalyticsSummary => ({
  totalCodesCreated: 45,
  activeCodesCount: 12,
  totalDiscountGiven: 28500,
  totalRevenueFromPromos: 85200,
  averageRoi: 1.98,
  codes: [
    {
      code: 'SPRING20',
      timesUsed: 450,
      totalDiscount: 4500,
      revenue: 22500,
      roi: 4.0,
      status: 'active',
      expiryDate: '2024-06-30',
    },
    {
      code: 'SUMMER15',
      timesUsed: 380,
      totalDiscount: 5700,
      revenue: 38000,
      roi: 5.66,
      status: 'active',
      expiryDate: '2024-08-31',
    },
    {
      code: 'FLASH30',
      timesUsed: 240,
      totalDiscount: 7200,
      revenue: 16800,
      roi: 1.33,
      status: 'expired',
    },
    {
      code: 'LOYALTY10',
      timesUsed: 180,
      totalDiscount: 1800,
      revenue: 8100,
      roi: 3.5,
      status: 'active',
      expiryDate: '2024-12-31',
    },
    {
      code: 'WELCOME5',
      timesUsed: 320,
      totalDiscount: 1600,
      revenue: 12000,
      roi: 6.5,
      status: 'active',
      expiryDate: '2024-07-31',
    },
  ],
  data: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    codesUsed: Math.floor(Math.random() * 40 + 20),
    discountAmount: Math.floor(Math.random() * 1500 + 500),
    revenue: Math.floor(Math.random() * 3000 + 2000),
  })),
});

const generateMockCLVData = (): CLVAnalytics => ({
  overallAverageCLV: 1250.5,
  totalCustomerValue: 1543675,
  segments: [
    {
      segment: 'VIP Customers',
      customerCount: 120,
      averageCLV: 8500,
      totalCLV: 1020000,
      acquisitionCost: 85.0,
      profitMargin: 95.5,
    },
    {
      segment: 'Loyal Customers',
      customerCount: 480,
      averageCLV: 2800,
      totalCLV: 1344000,
      acquisitionCost: 45.0,
      profitMargin: 85.2,
    },
    {
      segment: 'Regular Customers',
      customerCount: 720,
      averageCLV: 650,
      totalCLV: 468000,
      acquisitionCost: 35.0,
      profitMargin: 65.3,
    },
    {
      segment: 'At-Risk Customers',
      customerCount: 450,
      averageCLV: 125,
      totalCLV: 56250,
      acquisitionCost: 25.0,
      profitMargin: 20.0,
    },
  ],
  topCustomers: [
    {
      customerId: 'C001',
      name: 'John Smith',
      clv: 12500,
      purchaseCount: 8,
      lastPurchaseDate: '2024-03-10',
    },
    {
      customerId: 'C002',
      name: 'Emma Johnson',
      clv: 10200,
      purchaseCount: 6,
      lastPurchaseDate: '2024-03-05',
    },
    {
      customerId: 'C003',
      name: 'Michael Brown',
      clv: 9800,
      purchaseCount: 7,
      lastPurchaseDate: '2024-03-12',
    },
    {
      customerId: 'C004',
      name: 'Sarah Davis',
      clv: 8500,
      purchaseCount: 5,
      lastPurchaseDate: '2024-02-28',
    },
    {
      customerId: 'C005',
      name: 'David Wilson',
      clv: 7600,
      purchaseCount: 4,
      lastPurchaseDate: '2024-03-08',
    },
  ],
});

const generateMockTrafficData = (): TrafficAnalytics => ({
  totalVisits: 185640,
  totalUniqueVisitors: 142800,
  averageBounceRate: 32.5,
  sources: [
    {
      source: 'Google Organic',
      sourceType: 'organic',
      visits: 65420,
      uniqueVisitors: 52340,
      bounceRate: 28.5,
      averageSessionDuration: 245,
      conversions: 485,
      revenue: 25240,
    },
    {
      source: 'Google Ads',
      sourceType: 'paid',
      visits: 42180,
      uniqueVisitors: 38920,
      bounceRate: 35.2,
      averageSessionDuration: 180,
      conversions: 520,
      revenue: 27040,
    },
    {
      source: 'Facebook',
      sourceType: 'social',
      visits: 28540,
      uniqueVisitors: 24680,
      bounceRate: 42.3,
      averageSessionDuration: 150,
      conversions: 120,
      revenue: 6240,
    },
    {
      source: 'Direct',
      sourceType: 'direct',
      visits: 25840,
      uniqueVisitors: 18950,
      bounceRate: 25.0,
      averageSessionDuration: 320,
      conversions: 250,
      revenue: 13000,
    },
    {
      source: 'Instagram',
      sourceType: 'social',
      visits: 16280,
      uniqueVisitors: 14250,
      bounceRate: 48.5,
      averageSessionDuration: 120,
      conversions: 45,
      revenue: 2340,
    },
    {
      source: 'Referral',
      sourceType: 'referral',
      visits: 7380,
      uniqueVisitors: 6260,
      bounceRate: 22.0,
      averageSessionDuration: 280,
      conversions: 89,
      revenue: 4628,
    },
  ],
  data: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    organic: Math.floor(Math.random() * 2500 + 1500),
    paid: Math.floor(Math.random() * 2000 + 1000),
    referral: Math.floor(Math.random() * 400 + 200),
    direct: Math.floor(Math.random() * 1000 + 600),
    social: Math.floor(Math.random() * 800 + 400),
    email: Math.floor(Math.random() * 300 + 150),
  })),
});

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d' | 'custom' | 'all'>(
    '30d'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data state
  const [metrics, setMetrics] = useState<DashboardMetrics>(generateMockMetrics());
  const [funnel, setFunnel] = useState<ConversionFunnel>(generateMockFunnel());
  const [cac, setCac] = useState<CACAnalytics>(generateMockCACData());
  const [email, setEmail] = useState<EmailEngagementAnalytics>(generateMockEmailMetrics());
  const [promo, setPromo] = useState<PromoAnalyticsSummary>(generateMockPromoAnalytics());
  const [clv, setClv] = useState<CLVAnalytics>(generateMockCLVData());
  const [traffic, setTraffic] = useState<TrafficAnalytics>(generateMockTrafficData());

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Refresh all data
      setMetrics(generateMockMetrics());
      setFunnel(generateMockFunnel());
      setCac(generateMockCACData());
      setEmail(generateMockEmailMetrics());
      setPromo(generateMockPromoAnalytics());
      setClv(generateMockCLVData());
      setTraffic(generateMockTrafficData());
    } catch (err) {
      setError('Failed to refresh analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'excel' | 'pdf', options: ExportFormat) => {
    setIsExporting(true);
    try {
      // Simulate export processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, this would call an actual export API
      console.log('Exporting report as', format, 'with options:', options);

      // Create a simple download simulation
      const filename = `Analytics-Report-${new Date().toISOString().split('T')[0]}.${
        format === 'excel' ? 'xlsx' : 'pdf'
      }`;
      console.log('Report exported as:', filename);
    } catch (err) {
      setError('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>Marketing Analytics</h1>
          <p>Comprehensive insights into your marketing performance and customer behavior</p>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.dateRangeSelector}>
            <Calendar size={18} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className={styles.dateSelect}
            >
              {DATE_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={18} className={isLoading ? styles.spinning : ''} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Key Metrics Dashboard */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Performance Indicators</h2>
        <KeyMetricsDashboard
          metrics={{
            impressions: metrics.totalImpressions,
            clicks: metrics.totalClicks,
            ctr: metrics.clickThroughRate,
            conversions: metrics.conversions,
            conversionRate: metrics.conversionRate,
            revenue: metrics.revenue,
            aov: metrics.averageOrderValue,
          }}
          isLoading={isLoading}
        />
      </section>

      {/* Conversion Funnel */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Conversion Funnel Analysis</h2>
        <ConversionFunnelAnalysis data={funnel} isLoading={isLoading} />
      </section>

      {/* CAC Tracking */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Customer Acquisition Cost (CAC)</h2>
        <CACTrackingAnalytics data={cac} isLoading={isLoading} />
      </section>

      {/* Email Engagement */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Email Engagement Metrics</h2>
        <EmailEngagementMetrics data={email} isLoading={isLoading} />
      </section>

      {/* Promo Code Analytics */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Promo Code Analytics & ROI</h2>
        <PromoCodeAnalyticsComponent data={promo} isLoading={isLoading} />
      </section>

      {/* CLV Analysis */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Customer Lifetime Value (CLV)</h2>
        <CLVAnalyticsComponent data={clv} isLoading={isLoading} />
      </section>

      {/* Traffic Source Analysis */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Traffic Source Analysis</h2>
        <TrafficSourceAnalysis data={traffic} isLoading={isLoading} />
      </section>

      {/* Export Reports */}
      <section className={styles.section}>
        <ExportReports onExport={handleExport} isExporting={isExporting} />
      </section>
    </div>
  );
};
