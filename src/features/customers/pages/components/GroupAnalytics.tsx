import React, { useState, useEffect } from 'react';
import { X, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
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
import { CustomerGroup, GroupAnalytics } from '../../types/group.types';
import { CustomerGroupService } from '../../services/group.service';
import styles from '../styles/GroupAnalytics.module.css';

interface GroupAnalyticsDialogProps {
  group: CustomerGroup;
  onClose: () => void;
}

export const GroupAnalyticsDialog: React.FC<GroupAnalyticsDialogProps> = ({
  group,
  onClose,
}) => {
  const [analytics, setAnalytics] = useState<GroupAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'revenue' | 'destinations' | 'growth'
  >('overview');

  useEffect(() => {
    loadAnalytics();
  }, [group.id]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await CustomerGroupService.getAnalytics(group.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!analytics) {
    return (
      <div className="analytics-overlay">
        <div className="analytics-dialog">
          <div className="dialog-header">
            <h2>Group Analytics - {group.name}</h2>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="loading-state">
            {loading ? 'Loading analytics...' : 'Failed to load analytics'}
          </div>
        </div>
      </div>
    );
  }

  const COLORS = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ];

  const StatCard = ({ icon: Icon, title, value, unit, color }: any) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon size={20} color="white" />
      </div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">
          {value}
          {unit && <span className="stat-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="analytics-overlay">
      <div className="analytics-dialog">
        {/* Header */}
        <div className="dialog-header">
          <div>
            <h2>Group Analytics</h2>
            <p>{group.name}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="analytics-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue
          </button>
          <button
            className={`tab ${activeTab === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            Destinations
          </button>
          <button
            className={`tab ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveTab('growth')}
          >
            Growth
          </button>
        </div>

        {/* Content */}
        <div className="analytics-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <StatCard
                  icon={Users}
                  title="Total Members"
                  value={analytics.memberCount}
                  color="#3b82f6"
                />
                <StatCard
                  icon={DollarSign}
                  title="Total Revenue"
                  value={`$${analytics.totalRevenue.toLocaleString()}`}
                  color="#10b981"
                />
                <StatCard
                  icon={BarChart3}
                  title="Avg Booking Value"
                  value={`$${Math.round(analytics.avgBookingValue)}`}
                  color="#f59e0b"
                />
                <StatCard
                  icon={TrendingUp}
                  title="Conversion Rate"
                  value={analytics.conversionRate.toFixed(1)}
                  unit="%"
                  color="#8b5cf6"
                />
              </div>

              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-label">Customer Lifetime Value</div>
                  <div className="metric-value">
                    ${analytics.customerLifetimeValue.toLocaleString()}
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Churn Rate</div>
                  <div className="metric-value">{analytics.churnRate}%</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Total Bookings</div>
                  <div className="metric-value">{analytics.bookingCount}</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Avg Revenue Per Member</div>
                  <div className="metric-value">
                    ${Math.round(analytics.avgRevenuePerMember)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="chart-section">
              <h3>Revenue Overview</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[analytics]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="groupName" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Bar dataKey="totalRevenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="revenue-details">
                <div className="detail-item">
                  <span>Total Revenue</span>
                  <strong>${analytics.totalRevenue.toLocaleString()}</strong>
                </div>
                <div className="detail-item">
                  <span>Avg Revenue Per Member</span>
                  <strong>
                    ${Math.round(analytics.avgRevenuePerMember)}
                  </strong>
                </div>
                <div className="detail-item">
                  <span>Avg Booking Value</span>
                  <strong>${Math.round(analytics.avgBookingValue)}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="chart-section">
              <h3>Top Destinations</h3>
              <div className="destinations-list">
                {analytics.topDestinations.map((dest, idx) => (
                  <div key={dest.tourId} className="destination-item">
                    <div className="dest-number">{idx + 1}</div>
                    <div className="dest-info">
                      <div className="dest-name">Tour {dest.tourId}</div>
                      <div className="dest-stats">
                        {dest.bookingCount} bookings · $
                        {dest.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div className="dest-percentage">
                      {(
                        (dest.bookingCount /
                          analytics.topDestinations.reduce(
                            (sum, d) => sum + d.bookingCount,
                            0
                          )) *
                        100
                      ).toFixed(0)}
                      %
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.topDestinations}
                      dataKey="bookingCount"
                      nameKey="tourId"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {analytics.topDestinations.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'growth' && (
            <div className="chart-section">
              <h3>Growth Trend</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.growthTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="memberCount"
                      stroke="#3b82f6"
                      name="Members"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      name="Revenue"
                      formatter={(value) => `$${value}`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="growth-summary">
                <div className="summary-item">
                  <span>Starting Members</span>
                  <strong>
                    {analytics.growthTrend[0]?.memberCount || 0}
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Current Members</span>
                  <strong>
                    {analytics.growthTrend[analytics.growthTrend.length - 1]
                      ?.memberCount || 0}
                  </strong>
                </div>
                <div className="summary-item">
                  <span>Growth</span>
                  <strong>
                    {(
                      analytics.growthTrend[analytics.growthTrend.length - 1]
                        ?.memberCount -
                      analytics.growthTrend[0]?.memberCount
                    ).toFixed(0)}
                  </strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
