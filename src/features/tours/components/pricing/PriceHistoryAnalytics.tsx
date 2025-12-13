/**
 * Price History & Analytics Component
 */
import React, { useState } from 'react';
import { PricingAnalytics, PriceHistoryEntry } from '../../types/pricing.types';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Eye } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils';

interface PriceHistoryAnalyticsProps {
  analytics: PricingAnalytics | null;
  history: PriceHistoryEntry[];
}

export const PriceHistoryAnalytics: React.FC<PriceHistoryAnalyticsProps> = ({ analytics, history }) => {
  const [historyTab, setHistoryTab] = useState<'chart' | 'list'>('chart');

  if (!analytics) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const trendArrow = analytics.statistics.demandTrend === 'increasing' 
    ? <TrendingUp className="h-5 w-5 text-green-600" />
    : analytics.statistics.demandTrend === 'decreasing'
    ? <TrendingDown className="h-5 w-5 text-red-600" />
    : <Activity className="h-5 w-5 text-gray-600" />;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Average Price</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(analytics.statistics.averagePrice)}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.statistics.occupancyRate}%
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(analytics.statistics.totalRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Bookings Count</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.statistics.bookingsCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Demand Trend</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-gray-900 capitalize">
                  {analytics.statistics.demandTrend}
                </span>
                {trendArrow}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Monthly Trends</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue & Bookings */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-4">Revenue & Bookings</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" />
                <Bar yAxisId="right" dataKey="bookings" fill="#10B981" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Price & Occupancy Trend */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-4">Price & Occupancy Rate</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.byMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value) => {
                  if (value > 100) return formatCurrency(value as number);
                  return `${value}%`;
                }} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="averagePrice" stroke="#3B82F6" name="Avg Price" />
                <Line yAxisId="right" type="monotone" dataKey="occupancyRate" stroke="#F59E0B" name="Occupancy %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Discounts Applied */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Discounts Applied</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Discount Distribution */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-4">By Type</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.discountsApplied}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.discountsApplied.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Discount Details */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-4">Discount Summary</p>
            <div className="space-y-3">
              {analytics.discountsApplied.map((discount, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">{discount.type}</p>
                      <p className="text-xs text-gray-500">{discount.count} applied</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(discount.totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Avg: {formatCurrency(discount.averageDiscount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Price History</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setHistoryTab('chart')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                historyTab === 'chart'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => setHistoryTab('list')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                historyTab === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {historyTab === 'chart' ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history.slice(0, 20).reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Line type="monotone" dataKey="originalPrice" stroke="#9CA3AF" name="Original" />
              <Line type="monotone" dataKey="finalPrice" stroke="#3B82F6" name="Final Price" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.slice(0, 10).map((entry) => (
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{entry.date}</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(entry.originalPrice)} → {formatCurrency(entry.finalPrice)}
                  </span>
                </div>
                {entry.notes && <p className="text-xs text-gray-600">{entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
