/**
 * Customer Lifetime Value (CLV) Analytics
 * Analyzes customer value segments and profitability
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
  Cell,
} from 'recharts';
import { CLVAnalytics, CLVSegment } from '../types/analytics.types';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import styles from './CLVAnalytics.module.css';

interface CLVAnalyticsProps {
  data: CLVAnalytics;
  isLoading?: boolean;
}

const SEGMENT_COLORS: Record<string, string> = {
  vip: '#8b5cf6',
  loyal: '#2563eb',
  regular: '#06b6d4',
  at_risk: '#f59e0b',
};

export const CLVAnalyticsComponent: React.FC<CLVAnalyticsProps> = ({
  data,
  isLoading = false,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  if (isLoading) {
    return <div className={styles.loadingState}>Loading CLV data...</div>;
  }

  const segmentChartData = data.segments.map((segment) => ({
    name: segment.segment,
    average: segment.averageCLV,
    total: segment.totalCLV,
    acquisitionCost: segment.acquisitionCost,
  }));

  const selectedSegmentData = selectedSegment
    ? data.segments.find((s) => s.segment === selectedSegment)
    : data.segments[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Customer Lifetime Value (CLV) Analysis</h3>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#dbeafe' }}>
            <DollarSign size={24} color="#2563eb" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Average CLV</div>
            <div className={styles.cardValue}>€{data.overallAverageCLV.toFixed(2)}</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#dcfce7' }}>
            <Users size={24} color="#10b981" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Total Customer Value</div>
            <div className={styles.cardValue}>€{data.totalCustomerValue.toLocaleString()}</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#fef3c7' }}>
            <TrendingUp size={24} color="#f59e0b" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Total Customers</div>
            <div className={styles.cardValue}>
              {data.segments.reduce((sum, s) => sum + s.customerCount, 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <h4>CLV by Segment</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={segmentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => `€${(value as number).toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="average" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartContainer}>
          <h4>Acquisition Cost vs CLV</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={segmentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value) => `€${(value as number).toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="acquisitionCost" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="average" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.segmentsGrid}>
        {data.segments.map((segment) => (
          <div
            key={segment.segment}
            className={`${styles.segmentCard} ${
              selectedSegment === segment.segment ? styles.selected : ''
            }`}
            onClick={() => setSelectedSegment(segment.segment)}
            style={{
              borderLeftColor: SEGMENT_COLORS[segment.segment.toLowerCase()] || '#2563eb',
            }}
          >
            <div className={styles.segmentName}>{segment.segment}</div>
            <div className={styles.segmentMetrics}>
              <div className={styles.metric}>
                <span className={styles.label}>Customers</span>
                <span className={styles.value}>{segment.customerCount}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.label}>Avg CLV</span>
                <span className={styles.value}>€{segment.averageCLV.toFixed(2)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.label}>Total CLV</span>
                <span className={styles.value}>€{segment.totalCLV.toLocaleString()}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.label}>Acq. Cost</span>
                <span className={styles.value}>€{segment.acquisitionCost.toFixed(2)}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.label}>Margin</span>
                <span className={`${styles.value} ${styles.margin}`}>{segment.profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedSegmentData && (
        <div className={styles.topCustomers}>
          <h4>Top Customers - {selectedSegmentData.segment} Segment</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>CLV</th>
                <th>Purchase Count</th>
                <th>Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {data.topCustomers.slice(0, 5).map((customer) => (
                <tr key={customer.customerId}>
                  <td className={styles.customerName}>{customer.name}</td>
                  <td className={styles.clvValue}>€{customer.clv.toFixed(2)}</td>
                  <td>{customer.purchaseCount}</td>
                  <td className={styles.date}>{customer.lastPurchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
