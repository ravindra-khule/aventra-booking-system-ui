/**
 * Email Engagement Metrics
 * Displays open rates, click-through rates, and email performance data
 */

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { EmailEngagementAnalytics, EmailMetrics } from '../types/analytics.types';
import { Mail, Send, Eye, MousePointerClick } from 'lucide-react';
import styles from './EmailEngagementMetrics.module.css';

interface EmailEngagementProps {
  data: EmailEngagementAnalytics;
  isLoading?: boolean;
}

export const EmailEngagementMetrics: React.FC<EmailEngagementProps> = ({
  data,
  isLoading = false,
}) => {
  const [sortBy, setSortBy] = useState<'openRate' | 'ctr' | 'sent'>('openRate');

  if (isLoading) {
    return <div className={styles.loadingState}>Loading email metrics...</div>;
  }

  const sortedCampaigns = [...data.campaigns].sort((a, b) => {
    switch (sortBy) {
      case 'openRate':
        return b.openRate - a.openRate;
      case 'ctr':
        return b.clickThroughRate - a.clickThroughRate;
      case 'sent':
        return b.sentCount - a.sentCount;
      default:
        return 0;
    }
  });

  const bounceData = [
    {
      name: 'Delivered',
      value: data.totalSent - data.campaigns.reduce((sum, c) => sum + c.bounceCount, 0),
      color: '#10b981',
    },
    {
      name: 'Bounced',
      value: data.campaigns.reduce((sum, c) => sum + c.bounceCount, 0),
      color: '#ef4444',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Email Engagement Metrics</h3>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#dbeafe' }}>
            <Send size={24} color="#2563eb" />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Sent</div>
            <div className={styles.metricValue}>{data.totalSent.toLocaleString()}</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#dcfce7' }}>
            <Eye size={24} color="#10b981" />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Opens</div>
            <div className={styles.metricValue}>{data.totalOpens.toLocaleString()}</div>
            <div className={styles.metricSubValue}>{data.averageOpenRate.toFixed(2)}% avg open rate</div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon} style={{ backgroundColor: '#fef3c7' }}>
            <MousePointerClick size={24} color="#f59e0b" />
          </div>
          <div className={styles.metricContent}>
            <div className={styles.metricLabel}>Total Clicks</div>
            <div className={styles.metricValue}>{data.totalClicks.toLocaleString()}</div>
            <div className={styles.metricSubValue}>
              {data.averageClickThroughRate.toFixed(2)}% avg CTR
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h4>Campaign Performance</h4>
          <div className={styles.sortControls}>
            <button
              className={`${styles.sortBtn} ${sortBy === 'openRate' ? styles.active : ''}`}
              onClick={() => setSortBy('openRate')}
            >
              By Open Rate
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'ctr' ? styles.active : ''}`}
              onClick={() => setSortBy('ctr')}
            >
              By CTR
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'sent' ? styles.active : ''}`}
              onClick={() => setSortBy('sent')}
            >
              By Volume
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedCampaigns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="campaignName"
                stroke="#6b7280"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => {
                  if (typeof value === 'number') {
                    return value.toFixed(2) + '%';
                  }
                  return value;
                }}
              />
              <Bar dataKey="openRate" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartContainer}>
          <h4>Delivery Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bounceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, value, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {bounceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => (value as number).toLocaleString()}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.trendChart}>
        <h4>Email Engagement Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => (value as number).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sent"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="opens"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.campaignTable}>
        <h4>Detailed Campaign Results</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Sent</th>
              <th>Opens</th>
              <th>Open Rate</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Unsubscribes</th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.campaignId}>
                <td className={styles.campaignName}>{campaign.campaignName}</td>
                <td>{campaign.sentCount.toLocaleString()}</td>
                <td>{campaign.openCount.toLocaleString()}</td>
                <td className={styles.rate}>{campaign.openRate.toFixed(2)}%</td>
                <td>{campaign.clickCount.toLocaleString()}</td>
                <td className={styles.rate}>{campaign.clickThroughRate.toFixed(2)}%</td>
                <td>{campaign.unsubscribeCount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
