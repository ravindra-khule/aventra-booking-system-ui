/**
 * Campaign Analytics Dashboard
 * Real-time performance tracking and ROI analytics
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Eye,
  MousePointerClick,
  CheckCircle,
  TrendingDown,
} from 'lucide-react';
import { CampaignAnalytics, Campaign } from '../types/campaign.types';
import { CampaignAnalyticsService } from '../services/campaign.service';
import styles from './CampaignAnalytics.module.css';

interface CampaignAnalyticsDashboardProps {
  campaign: Campaign;
  isLoading?: boolean;
}

export const CampaignAnalyticsDashboard: React.FC<CampaignAnalyticsDashboardProps> = ({
  campaign,
  isLoading = false,
}) => {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [campaign.id, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      let startDate = campaign.startDate;
      const endDate = campaign.endDate;

      if (dateRange === '7d') {
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '30d') {
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      } else if (dateRange === '90d') {
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      }

      const data = await CampaignAnalyticsService.getCampaignAnalytics({
        campaignId: campaign.id,
        startDate,
        endDate,
        groupBy: 'DAILY',
      });

      setAnalytics(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!analytics) {
    return <div className={styles.empty}>No analytics data available</div>;
  }

  const { metrics, roiMetrics, hourlyData, channelPerformance } = analytics;

  const metricCards = [
    {
      icon: Users,
      label: 'Delivered',
      value: metrics.delivered.toLocaleString(),
      subValue: `${metrics.deliveryRate.toFixed(1)}% delivery rate`,
      color: '#3b82f6',
    },
    {
      icon: Eye,
      label: 'Opened',
      value: metrics.opened?.toLocaleString() || '—',
      subValue: metrics.openRate ? `${metrics.openRate.toFixed(1)}% open rate` : '—',
      color: '#8b5cf6',
    },
    {
      icon: MousePointerClick,
      label: 'Clicked',
      value: metrics.clicked?.toLocaleString() || '—',
      subValue: metrics.clickRate ? `${metrics.clickRate.toFixed(1)}% click rate` : '—',
      color: '#ec4899',
    },
    {
      icon: CheckCircle,
      label: 'Converted',
      value: metrics.converted.toLocaleString(),
      subValue: `${metrics.conversionRate.toFixed(1)}% conversion rate`,
      color: '#10b981',
    },
    {
      icon: DollarSign,
      label: 'Revenue',
      value: `$${metrics.revenue.toFixed(2)}`,
      subValue: `${metrics.avgOrderValue ? `$${metrics.avgOrderValue.toFixed(2)} AOV` : ''}`,
      color: '#f59e0b',
    },
    {
      icon: TrendingUp,
      label: 'ROI',
      value: `${roiMetrics.roi.toFixed(1)}%`,
      subValue: `$${roiMetrics.profit.toFixed(2)} profit`,
      color: '#06b6d4',
    },
  ];

  const channelData = Object.entries(channelPerformance).map(([channel, perf]) => ({
    channel,
    sent: perf.metrics.sent,
    delivered: perf.metrics.delivered,
    converted: perf.metrics.converted,
    revenue: perf.metrics.revenue,
  }));

  const pieData = Object.entries(channelPerformance).map(([channel, perf]) => ({
    name: channel,
    value: perf.metrics.sent,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

  return (
    <div className={styles.container}>
      {/* Date Range Selector */}
      <div className={styles.controls}>
        <div className={styles.dateSelector}>
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <button
              key={range}
              className={`${styles.dateBtn} ${dateRange === range ? styles.active : ''}`}
              onClick={() => setDateRange(range)}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : range === '90d' ? 'Last 90 days' : 'All time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: card.color }}>
                <Icon />
              </div>
              <div className={styles.metricContent}>
                <p className={styles.metricLabel}>{card.label}</p>
                <h3 className={styles.metricValue}>{card.value}</h3>
                {card.subValue && <p className={styles.metricSubValue}>{card.subValue}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1: Trends and Distribution */}
      <div className={styles.chartsRow}>
        <div className={styles.chart}>
          <h3>Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timestamp"
                stroke="#9ca3af"
                tickFormatter={date => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                formatter={(value: number) => value.toLocaleString()}
              />
              <Legend />
              <Line type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="opened" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="clicked" stroke="#ec4899" strokeWidth={2} />
              <Line type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chart}>
          <h3>Channel Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Channel Performance */}
      <div className={styles.chartFull}>
        <h3>Channel Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={channelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="channel" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Legend />
            <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
            <Bar dataKey="delivered" fill="#8b5cf6" name="Delivered" />
            <Bar dataKey="clicked" fill="#ec4899" name="Clicked" />
            <Bar dataKey="converted" fill="#10b981" name="Converted" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ROI Summary */}
      <div className={styles.roiSummary}>
        <h3>ROI Summary</h3>
        <div className={styles.roiGrid}>
          <div className={styles.roiItem}>
            <span>Campaign Cost</span>
            <p>${roiMetrics.campaignCost.toFixed(2)}</p>
          </div>
          <div className={styles.roiItem}>
            <span>Revenue Generated</span>
            <p>${roiMetrics.revenue.toFixed(2)}</p>
          </div>
          <div className={styles.roiItem}>
            <span>Gross Profit</span>
            <p className={styles.positive}>${roiMetrics.profit.toFixed(2)}</p>
          </div>
          <div className={styles.roiItem}>
            <span>ROI</span>
            <p className={roiMetrics.roi >= 0 ? styles.positive : styles.negative}>
              {roiMetrics.roi.toFixed(1)}%
            </p>
          </div>
          <div className={styles.roiItem}>
            <span>ROAS</span>
            <p>{roiMetrics.roas.toFixed(2)}x</p>
          </div>
          <div className={styles.roiItem}>
            <span>Cost per Conversion</span>
            <p>${roiMetrics.costPerConversion.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
