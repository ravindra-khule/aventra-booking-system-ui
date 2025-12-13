/**
 * Key Metrics Dashboard
 * Displays top-level KPIs with trend indicators
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Zap,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { MetricValue } from '../types/analytics.types';
import styles from './KeyMetricsDashboard.module.css';

interface MetricCardProps {
  label: string;
  value: MetricValue;
  icon: React.ReactNode;
  unit?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  unit = '',
  color = '#2563eb',
}) => {
  const isTrendingUp = value.trend === 'up';
  const isTrendingDown = value.trend === 'down';

  return (
    <div className={styles.card} style={{ borderLeftColor: color }}>
      <div className={styles.header}>
        <div className={styles.title}>{label}</div>
        <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15` }}>
          {icon}
        </div>
      </div>

      <div className={styles.value}>
        {typeof value.current === 'number'
          ? value.current.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 0,
            })
          : value.current}
        <span className={styles.unit}>{unit}</span>
      </div>

      {value.changePercent !== undefined && (
        <div className={styles.change}>
          <div
            className={`${styles.trendIndicator} ${
              isTrendingUp ? styles.up : isTrendingDown ? styles.down : styles.stable
            }`}
          >
            {isTrendingUp && <TrendingUp size={16} />}
            {isTrendingDown && <TrendingDown size={16} />}
            {!isTrendingUp && !isTrendingDown && <span>→</span>}
            <span>
              {Math.abs(value.changePercent)}% {value.changePercent > 0 ? 'increase' : 'decrease'}
            </span>
          </div>
          {value.previous !== undefined && (
            <div className={styles.previousLabel}>vs {value.previous} previously</div>
          )}
        </div>
      )}
    </div>
  );
};

interface KeyMetricsDashboardProps {
  metrics: {
    impressions: MetricValue;
    clicks: MetricValue;
    ctr: MetricValue;
    conversions: MetricValue;
    conversionRate: MetricValue;
    revenue: MetricValue;
    aov: MetricValue;
  };
  isLoading?: boolean;
}

export const KeyMetricsDashboard: React.FC<KeyMetricsDashboardProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingPlaceholder}>Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <MetricCard
        label="Impressions"
        value={metrics.impressions}
        icon={<Eye size={20} color="#06b6d4" />}
        color="#06b6d4"
      />
      <MetricCard
        label="Clicks"
        value={metrics.clicks}
        icon={<MousePointerClick size={20} color="#3b82f6" />}
        color="#3b82f6"
      />
      <MetricCard
        label="CTR"
        value={metrics.ctr}
        icon={<Zap size={20} color="#f59e0b" />}
        unit="%"
        color="#f59e0b"
      />
      <MetricCard
        label="Conversions"
        value={metrics.conversions}
        icon={<ShoppingCart size={20} color="#10b981" />}
        color="#10b981"
      />
      <MetricCard
        label="Conversion Rate"
        value={metrics.conversionRate}
        icon={<TrendingUp size={20} color="#8b5cf6" />}
        unit="%"
        color="#8b5cf6"
      />
      <MetricCard
        label="Revenue"
        value={metrics.revenue}
        icon={<DollarSign size={20} color="#ec4899" />}
        unit="€"
        color="#ec4899"
      />
      <MetricCard
        label="AOV"
        value={metrics.aov}
        icon={<DollarSign size={20} color="#14b8a6" />}
        unit="€"
        color="#14b8a6"
      />
    </div>
  );
};
