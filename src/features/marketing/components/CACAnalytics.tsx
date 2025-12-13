/**
 * Customer Acquisition Cost (CAC) Analytics
 * Tracks acquisition efficiency across different channels and calculates ROI
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
  ComposedChart,
} from 'recharts';
import { CACAnalytics } from '../types/analytics.types';
import { DollarSign, TrendingUp } from 'lucide-react';
import styles from './CACAnalytics.module.css';

interface CACAnalyticsProps {
  data: CACAnalytics;
  isLoading?: boolean;
}

export const CACTrackingAnalytics: React.FC<CACAnalyticsProps> = ({
  data,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<'channels' | 'trend'>('channels');

  if (isLoading) {
    return <div className={styles.loadingState}>Loading CAC data...</div>;
  }

  const sortedChannels = [...data.channels].sort((a, b) => a.cac - b.cac);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Customer Acquisition Cost (CAC)</h3>
        <div className={styles.controls}>
          <button
            className={`${styles.viewToggle} ${viewMode === 'channels' ? styles.active : ''}`}
            onClick={() => setViewMode('channels')}
          >
            By Channel
          </button>
          <button
            className={`${styles.viewToggle} ${viewMode === 'trend' ? styles.active : ''}`}
            onClick={() => setViewMode('trend')}
          >
            Trend
          </button>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardLabel}>Total Spend</div>
          <div className={styles.cardValue}>€{data.totalSpend.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardLabel}>Total Acquisitions</div>
          <div className={styles.cardValue}>{data.totalAcquisitions.toLocaleString()}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardLabel}>Average CAC</div>
          <div className={styles.cardValue}>€{data.averageCAC.toFixed(2)}</div>
        </div>
      </div>

      {viewMode === 'channels' ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={sortedChannels}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="channel" stroke="#6b7280" />
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
                    return value.toFixed(2);
                  }
                  return value;
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="cac" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>

          <div className={styles.channelTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Spend</th>
                  <th>Acquisitions</th>
                  <th>CAC</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                {sortedChannels.map((channel) => (
                  <tr key={channel.channel}>
                    <td className={styles.channelName}>{channel.channel}</td>
                    <td>€{channel.totalSpend.toLocaleString()}</td>
                    <td>{channel.acquisitions.toLocaleString()}</td>
                    <td className={styles.cacValue}>€{channel.cac.toFixed(2)}</td>
                    <td className={channel.roi > 0 ? styles.positiveRoi : styles.negativeRoi}>
                      {channel.roi > 0 ? '+' : ''}
                      {channel.roi.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
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
              formatter={(value) => {
                if (typeof value === 'number') {
                  return value.toFixed(2);
                }
                return value;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="spend"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="acquisitions"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className={styles.insights}>
        <h4>Insights</h4>
        <ul className={styles.insightsList}>
          <li>
            Most efficient channel:{' '}
            <strong>
              {sortedChannels[0]?.channel} (€{sortedChannels[0]?.cac.toFixed(2)})
            </strong>
          </li>
          <li>
            Highest ROI: <strong>{sortedChannels.find(c => c.roi === Math.max(...sortedChannels.map(ch => ch.roi)))?.channel}</strong>
          </li>
          <li>
            Average CAC across all channels: <strong>€{data.averageCAC.toFixed(2)}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
};
