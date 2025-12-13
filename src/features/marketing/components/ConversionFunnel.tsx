/**
 * Conversion Funnel Analysis
 * Visualizes user journey from views to bookings with drop-off analysis
 */

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { ConversionFunnel, FunnelStage } from '../types/analytics.types';
import { FUNNEL_STAGES } from '../constants/analytics.constants';
import styles from './ConversionFunnel.module.css';

interface ConversionFunnelProps {
  data: ConversionFunnel;
  isLoading?: boolean;
}

export const ConversionFunnelAnalysis: React.FC<ConversionFunnelProps> = ({
  data,
  isLoading = false,
}) => {
  const [chartType, setChartType] = useState<'funnel' | 'trend'>('funnel');

  if (isLoading) {
    return <div className={styles.loadingState}>Loading funnel data...</div>;
  }

  const funnelPercentages = data.stages.map((stage, index) => ({
    ...stage,
    dropoff: index > 0 ? 100 - (stage.percentage * 100) / (data.stages[index - 1].percentage) : 0,
  }));

  const maxCount = Math.max(...data.stages.map(s => s.count));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Conversion Funnel</h3>
        <div className={styles.controls}>
          <button
            className={`${styles.chartToggle} ${chartType === 'funnel' ? styles.active : ''}`}
            onClick={() => setChartType('funnel')}
          >
            Funnel
          </button>
          <button
            className={`${styles.chartToggle} ${chartType === 'trend' ? styles.active : ''}`}
            onClick={() => setChartType('trend')}
          >
            Trend
          </button>
        </div>
      </div>

      {chartType === 'funnel' ? (
        <>
          <div className={styles.stagesContainer}>
            {funnelPercentages.map((stage, index) => (
              <div key={stage.id} className={styles.stage}>
                <div className={styles.stageBar}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(stage.count / maxCount) * 100}%`,
                      backgroundColor: getStageColor(index),
                    }}
                  >
                    <span className={styles.count}>{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.stageInfo}>
                  <div className={styles.stageName}>{stage.name}</div>
                  <div className={styles.stageMetrics}>
                    <span className={styles.percentage}>{stage.percentage.toFixed(1)}%</span>
                    {index > 0 && (
                      <span className={styles.dropoff}>
                        ↓ {funnelPercentages[index - 1].dropoff.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total Users:</span>
              <span className={styles.summaryValue}>{data.totalUsers.toLocaleString()}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Overall Conversion:</span>
              <span className={styles.summaryValue}>{data.overallConversionRate.toFixed(2)}%</span>
            </div>
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
              formatter={(value) => (value as number).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="addToCart"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// Helper method to get stage color
function getStageColor(index: number): string {
  const colors = ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'];
  return colors[index % colors.length];
}
