/**
 * Promo Code Analytics and ROI Tracking
 * Analyzes usage, effectiveness, and ROI of promotional codes
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
import { PromoAnalyticsSummary, PromoCodeAnalytics } from '../types/analytics.types';
import { Percent, TrendingUp, Gift } from 'lucide-react';
import styles from './PromoCodeAnalytics.module.css';

interface PromoCodeAnalyticsProps {
  data: PromoAnalyticsSummary;
  isLoading?: boolean;
}

export const PromoCodeAnalyticsComponent: React.FC<PromoCodeAnalyticsProps> = ({
  data,
  isLoading = false,
}) => {
  const [sortBy, setSortBy] = useState<'usage' | 'roi' | 'revenue'>('usage');

  if (isLoading) {
    return <div className={styles.loadingState}>Loading promo analytics...</div>;
  }

  const sortedCodes = [...data.codes].sort((a, b) => {
    switch (sortBy) {
      case 'usage':
        return b.timesUsed - a.timesUsed;
      case 'roi':
        return b.roi - a.roi;
      case 'revenue':
        return b.revenue - a.revenue;
      default:
        return 0;
    }
  });

  const statusColors = {
    active: '#10b981',
    expired: '#6b7280',
    disabled: '#ef4444',
  };

  const statusData = [
    {
      name: 'Active',
      value: data.activeCodesCount,
      color: '#10b981',
    },
    {
      name: 'Inactive',
      value: data.totalCodesCreated - data.activeCodesCount,
      color: '#e5e7eb',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Promo Code Analytics</h3>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#dbeafe' }}>
            <Gift size={24} color="#2563eb" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Total Codes</div>
            <div className={styles.cardValue}>{data.totalCodesCreated}</div>
            <div className={styles.cardSubtext}>{data.activeCodesCount} active</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#fee2e2' }}>
            <Percent size={24} color="#ef4444" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Total Discount Given</div>
            <div className={styles.cardValue}>€{data.totalDiscountGiven.toLocaleString()}</div>
            <div className={styles.cardSubtext}>Avg ROI: {data.averageRoi.toFixed(1)}%</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#dcfce7' }}>
            <TrendingUp size={24} color="#10b981" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Revenue from Promos</div>
            <div className={styles.cardValue}>€{data.totalRevenueFromPromos.toLocaleString()}</div>
            <div className={styles.cardSubtext}>
              ROI: €
              {(
                (data.totalRevenueFromPromos - data.totalDiscountGiven) /
                data.totalDiscountGiven
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h4>Code Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => (value as number).toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartContainer}>
          <h4>Top Promo Codes by Usage</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sortedCodes.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="code" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
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
              <Bar dataKey="timesUsed" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.trendChart}>
        <h4>Promo Usage Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis yAxisId="left" stroke="#6b7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => {
                if (typeof value === 'number') {
                  return value.toLocaleString();
                }
                return value;
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="codesUsed"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="discountAmount"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.codeTable}>
        <div className={styles.tableHeader}>
          <h4>All Promo Codes</h4>
          <div className={styles.sortControls}>
            <button
              className={`${styles.sortBtn} ${sortBy === 'usage' ? styles.active : ''}`}
              onClick={() => setSortBy('usage')}
            >
              Usage
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'revenue' ? styles.active : ''}`}
              onClick={() => setSortBy('revenue')}
            >
              Revenue
            </button>
            <button
              className={`${styles.sortBtn} ${sortBy === 'roi' ? styles.active : ''}`}
              onClick={() => setSortBy('roi')}
            >
              ROI
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Status</th>
              <th>Used</th>
              <th>Discount</th>
              <th>Revenue</th>
              <th>ROI</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {sortedCodes.map((code) => (
              <tr key={code.code}>
                <td className={styles.codeCell}>{code.code}</td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: `${statusColors[code.status]}20` }}
                  >
                    <span
                      className={styles.statusDot}
                      style={{ backgroundColor: statusColors[code.status] }}
                    />
                    {code.status}
                  </span>
                </td>
                <td>{code.timesUsed.toLocaleString()}</td>
                <td>€{code.totalDiscount.toLocaleString()}</td>
                <td className={styles.revenue}>€{code.revenue.toLocaleString()}</td>
                <td className={code.roi > 0 ? styles.positiveRoi : styles.negativeRoi}>
                  {code.roi > 0 ? '+' : ''}
                  {code.roi.toFixed(1)}%
                </td>
                <td className={styles.expiry}>{code.expiryDate || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
