/**
 * InvoiceStats Component - Display invoice statistics and KPIs
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Clock,
  XCircle,
} from 'lucide-react';
import { InvoiceStats as StatsType, InvoiceStatus } from '../types/invoice.types';
import { InvoiceService } from '../services/invoice.service';

interface InvoiceStatsProps {
  onFilterByStatus?: (status: InvoiceStatus) => void;
}

export const InvoiceStats: React.FC<InvoiceStatsProps> = ({ onFilterByStatus }) => {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await InvoiceService.getInvoiceStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load invoice stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statusCards = [
    {
      title: 'Draft',
      value: stats.draft,
      icon: FileText,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-600',
      status: InvoiceStatus.DRAFT,
    },
    {
      title: 'Sent',
      value: stats.sent,
      icon: Send,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      status: InvoiceStatus.SENT,
    },
    {
      title: 'Paid',
      value: stats.paid,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      status: InvoiceStatus.PAID,
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      status: InvoiceStatus.OVERDUE,
    },
  ];

  const revenueCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
      subtitle: `${stats.total} invoices`,
    },
    {
      title: 'Paid Revenue',
      value: formatCurrency(stats.paidRevenue),
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      subtitle: `${Math.round((stats.paidRevenue / stats.totalRevenue) * 100)}% collected`,
    },
    {
      title: 'Outstanding',
      value: formatCurrency(stats.outstandingRevenue),
      icon: Clock,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      subtitle: `${stats.sent + stats.overdue} invoices`,
    },
    {
      title: 'Overdue Amount',
      value: formatCurrency(stats.overdueRevenue),
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      iconColor: 'text-red-600',
      subtitle: `${stats.overdue} invoices`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => onFilterByStatus?.(card.status)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Overview */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {revenueCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <div className={`${card.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${card.textColor} mb-1`}>{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">Average Invoice Value</h4>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-700">
            {formatCurrency(stats.averageInvoiceValue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Per invoice</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-600">Average Payment Time</h4>
            <div className="bg-cyan-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-cyan-700">
            {Math.round(stats.averagePaymentTime)} days
          </p>
          <p className="text-xs text-gray-500 mt-1">From issue to payment</p>
        </div>
      </div>

      {/* Collection Rate Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Collection Progress</h4>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-green-600">
                {formatCurrency(stats.paidRevenue)} collected
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                {Math.round((stats.paidRevenue / stats.totalRevenue) * 100)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-4 mb-2 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${(stats.paidRevenue / stats.totalRevenue) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
            ></div>
            <div
              style={{ width: `${(stats.overdueRevenue / stats.totalRevenue) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500 transition-all duration-500"
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded"></span>
              Paid: {formatCurrency(stats.paidRevenue)}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded"></span>
              Overdue: {formatCurrency(stats.overdueRevenue)}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-300 rounded"></span>
              Pending: {formatCurrency(stats.outstandingRevenue - stats.overdueRevenue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
