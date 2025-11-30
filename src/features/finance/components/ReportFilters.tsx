import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { ReportFilters, ReportPeriod } from '../types/report.types';

interface ReportFiltersProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
  showTourFilter?: boolean;
  showCustomerFilter?: boolean;
  showGroupBy?: boolean;
}

export const ReportFiltersComponent: React.FC<ReportFiltersProps> = ({
  filters,
  onChange,
  showTourFilter = false,
  showCustomerFilter = false,
  showGroupBy = false
}) => {
  const handlePeriodChange = (period: ReportPeriod) => {
    onChange({ ...filters, period });
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onChange({ ...filters, [field]: value, period: ReportPeriod.CUSTOM });
  };

  const handleGroupByChange = (groupBy: any) => {
    onChange({ ...filters, groupBy });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Report Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Period Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            value={filters.period || ReportPeriod.THIS_MONTH}
            onChange={(e) => handlePeriodChange(e.target.value as ReportPeriod)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={ReportPeriod.TODAY}>Today</option>
            <option value={ReportPeriod.YESTERDAY}>Yesterday</option>
            <option value={ReportPeriod.THIS_WEEK}>This Week</option>
            <option value={ReportPeriod.LAST_WEEK}>Last Week</option>
            <option value={ReportPeriod.THIS_MONTH}>This Month</option>
            <option value={ReportPeriod.LAST_MONTH}>Last Month</option>
            <option value={ReportPeriod.THIS_QUARTER}>This Quarter</option>
            <option value={ReportPeriod.LAST_QUARTER}>Last Quarter</option>
            <option value={ReportPeriod.THIS_YEAR}>This Year</option>
            <option value={ReportPeriod.LAST_YEAR}>Last Year</option>
            <option value={ReportPeriod.CUSTOM}>Custom Range</option>
          </select>
        </div>

        {/* Date From */}
        {filters.period === ReportPeriod.CUSTOM && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Group By */}
        {showGroupBy && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group By
            </label>
            <select
              value={filters.groupBy || 'month'}
              onChange={(e) => handleGroupByChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
              <option value="year">Year</option>
              {showTourFilter && <option value="tour">Tour</option>}
              {showCustomerFilter && <option value="customer">Customer</option>}
            </select>
          </div>
        )}

        {/* Compare with Previous */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.compareWithPrevious || false}
              onChange={(e) => onChange({ ...filters, compareWithPrevious: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Compare with previous period
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  format?: 'currency' | 'number' | 'percentage';
  currency?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  format = 'number',
  currency = 'SEK'
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    if (format === 'currency') {
      return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    
    if (format === 'percentage') {
      return `${val.toFixed(1)}%`;
    }
    
    return new Intl.NumberFormat('sv-SE').format(val);
  };

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="text-blue-600">{icon}</div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {formatValue(value)}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp className="h-4 w-4 text-green-600" />}
          {isNegative && <TrendingDown className="h-4 w-4 text-red-600" />}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
          }`}>
            {Math.abs(change).toFixed(1)}% {changeLabel || 'vs previous period'}
          </span>
        </div>
      )}
    </div>
  );
};
