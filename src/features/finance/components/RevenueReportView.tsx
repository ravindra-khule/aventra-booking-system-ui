import React from 'react';
import { DollarSign, TrendingUp, ShoppingBag, MapPin } from 'lucide-react';
import { RevenueReport } from '../types/report.types';
import { MetricCard } from './ReportFilters';

interface RevenueReportViewProps {
  report: RevenueReport;
}

export const RevenueReportView: React.FC<RevenueReportViewProps> = ({ report }) => {
  const { summary, byTour, bySource, byPeriod } = report;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={summary.totalRevenue}
          change={summary.revenueGrowth}
          icon={<DollarSign className="h-5 w-5" />}
          format="currency"
          currency={summary.currency}
        />
        <MetricCard
          title="Total Bookings"
          value={summary.totalBookings}
          icon={<ShoppingBag className="h-5 w-5" />}
          format="number"
        />
        <MetricCard
          title="Average Booking Value"
          value={summary.averageBookingValue}
          icon={<TrendingUp className="h-5 w-5" />}
          format="currency"
          currency={summary.currency}
        />
        <MetricCard
          title="Revenue Growth"
          value={summary.revenueGrowth}
          icon={<TrendingUp className="h-5 w-5" />}
          format="percentage"
        />
      </div>

      {/* Revenue by Tour */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Revenue by Tour
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tour Name
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg/Booking
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {byTour.map((tour) => (
                <tr key={tour.tourId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tour.tourName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: summary.currency,
                      minimumFractionDigits: 0
                    }).format(tour.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${tour.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-600">{tour.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                    {tour.bookingsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: summary.currency,
                      minimumFractionDigits: 0
                    }).format(tour.revenue / tour.bookingsCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Source */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Revenue by Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bySource.map((source, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">{source.source}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: summary.currency,
                  minimumFractionDigits: 0
                }).format(source.revenue)}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{source.percentage}% of total</span>
                <span className="text-gray-600">{source.bookingsCount} bookings</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue by Period */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Revenue by Period</h3>
        <div className="space-y-3">
          {byPeriod.map((period, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{period.period}</div>
                <div className="text-sm text-gray-600">{period.bookingsCount} bookings</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat('sv-SE', {
                    style: 'currency',
                    currency: summary.currency,
                    minimumFractionDigits: 0
                  }).format(period.revenue)}
                </div>
                <div className="text-sm text-gray-600">
                  {new Intl.NumberFormat('sv-SE', {
                    style: 'currency',
                    currency: summary.currency,
                    minimumFractionDigits: 0
                  }).format(period.revenue / period.bookingsCount)}/booking
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
