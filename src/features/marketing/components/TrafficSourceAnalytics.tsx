/**
 * Traffic Source Analysis
 * Analyzes traffic from different sources (organic, paid, referral, direct, social, email)
 */

import React, { useState } from 'react';
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
import { TrafficAnalytics, TrafficSource } from '../types/analytics.types';
import { TRAFFIC_SOURCE_COLORS } from '../constants/analytics.constants';
import { Zap, Users, Eye } from 'lucide-react';
import styles from './TrafficSourceAnalytics.module.css';

interface TrafficAnalyticsProps {
  data: TrafficAnalytics;
  isLoading?: boolean;
}

export const TrafficSourceAnalysis: React.FC<TrafficAnalyticsProps> = ({
  data,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

  if (isLoading) {
    return <div className={styles.loadingState}>Loading traffic data...</div>;
  }

  const pieData = data.sources.map((source) => ({
    name: source.source,
    value: source.visits,
    color: TRAFFIC_SOURCE_COLORS[source.sourceType as keyof typeof TRAFFIC_SOURCE_COLORS],
  }));

  const sortedByConversions = [...data.sources].sort((a, b) => b.conversions - a.conversions);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Traffic Source Analysis</h3>
        <div className={styles.controls}>
          <button
            className={`${styles.viewToggle} ${viewMode === 'overview' ? styles.active : ''}`}
            onClick={() => setViewMode('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.viewToggle} ${viewMode === 'detailed' ? styles.active : ''}`}
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </button>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#dbeafe' }}>
            <Eye size={24} color="#2563eb" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Total Visits</div>
            <div className={styles.cardValue}>{data.totalVisits.toLocaleString()}</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#dcfce7' }}>
            <Users size={24} color="#10b981" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Unique Visitors</div>
            <div className={styles.cardValue}>{data.totalUniqueVisitors.toLocaleString()}</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon} style={{ backgroundColor: '#fef3c7' }}>
            <Zap size={24} color="#f59e0b" />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Avg Bounce Rate</div>
            <div className={styles.cardValue}>{data.averageBounceRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          <div className={styles.chartsGrid}>
            <div className={styles.chartContainer}>
              <h4>Traffic Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color || '#2563eb'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => (value as number).toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chartContainer}>
              <h4>Top Sources by Conversions</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sortedByConversions.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="source" stroke="#6b7280" />
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
                  <Bar dataKey="conversions" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.sourcesGrid}>
            {data.sources.map((source) => (
              <div
                key={source.source}
                className={styles.sourceCard}
                style={{
                  borderLeftColor:
                    TRAFFIC_SOURCE_COLORS[source.sourceType as keyof typeof TRAFFIC_SOURCE_COLORS],
                }}
              >
                <div className={styles.sourceName}>{source.source}</div>
                <div className={styles.sourceType}>{source.sourceType.toUpperCase()}</div>
                <div className={styles.sourceMetrics}>
                  <div className={styles.metric}>
                    <span className={styles.value}>{source.visits.toLocaleString()}</span>
                    <span className={styles.label}>Visits</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.value}>{source.conversions.toLocaleString()}</span>
                    <span className={styles.label}>Conversions</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.value}>{source.bounceRate.toFixed(1)}%</span>
                    <span className={styles.label}>Bounce Rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
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
                dataKey="organic"
                stroke={TRAFFIC_SOURCE_COLORS.organic}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="paid"
                stroke={TRAFFIC_SOURCE_COLORS.paid}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="referral"
                stroke={TRAFFIC_SOURCE_COLORS.referral}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="direct"
                stroke={TRAFFIC_SOURCE_COLORS.direct}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="social"
                stroke={TRAFFIC_SOURCE_COLORS.social}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="email"
                stroke={TRAFFIC_SOURCE_COLORS.email}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className={styles.detailedTable}>
            <h4>Detailed Traffic Source Metrics</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Visits</th>
                  <th>Unique Visitors</th>
                  <th>Bounce Rate</th>
                  <th>Avg Duration</th>
                  <th>Conversions</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((source) => (
                  <tr key={source.source}>
                    <td className={styles.sourceName}>{source.source}</td>
                    <td>
                      <span
                        className={styles.typeBadge}
                        style={{
                          backgroundColor: `${TRAFFIC_SOURCE_COLORS[source.sourceType as keyof typeof TRAFFIC_SOURCE_COLORS]}20`,
                          color:
                            TRAFFIC_SOURCE_COLORS[source.sourceType as keyof typeof TRAFFIC_SOURCE_COLORS],
                        }}
                      >
                        {source.sourceType}
                      </span>
                    </td>
                    <td>{source.visits.toLocaleString()}</td>
                    <td>{source.uniqueVisitors.toLocaleString()}</td>
                    <td>{source.bounceRate.toFixed(1)}%</td>
                    <td>{Math.floor(source.averageSessionDuration)}s</td>
                    <td className={styles.conversions}>{source.conversions.toLocaleString()}</td>
                    <td className={styles.revenue}>€{source.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
