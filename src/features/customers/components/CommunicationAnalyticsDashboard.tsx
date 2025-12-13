import React from 'react';
import { CommunicationAnalytics } from '../types/communication.types';
import { Mail, MessageSquare, Phone, FileText, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../../shared/utils';

interface CommunicationAnalyticsDashboardProps {
  analytics: CommunicationAnalytics;
  loading?: boolean;
}

/**
 * Communication Analytics Dashboard
 * Displays key metrics and insights about customer communications
 */
export const CommunicationAnalyticsDashboard: React.FC<CommunicationAnalyticsDashboardProps> = ({ analytics, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
        ))}
      </div>
    );
  }

  const StatCard = ({ icon, label, value, change, color }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs font-semibold text-green-600">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">{label}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  const CommunicationTypeBreakdown = () => (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <h3 className="font-bold text-gray-900 mb-4">Communications by Type</h3>
      <div className="space-y-3">
        {[
          { type: 'Email', count: analytics.communicationsByType.email, icon: Mail, color: 'text-blue-600' },
          { type: 'SMS', count: analytics.communicationsByType.sms, icon: MessageSquare, color: 'text-green-600' },
          { type: 'Calls', count: analytics.communicationsByType.call, icon: Phone, color: 'text-purple-600' },
          { type: 'Notes', count: analytics.communicationsByType.note, icon: FileText, color: 'text-orange-600' },
        ].map(({ type, count, icon: Icon, color }) => (
          <div key={type} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="text-sm text-gray-700">{type}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <h3 className="font-bold text-gray-900 mb-4">Performance Metrics</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Delivery Rate</span>
            <span className="text-sm font-semibold text-gray-900">{analytics.deliveryRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${analytics.deliveryRate}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Read Rate</span>
            <span className="text-sm font-semibold text-gray-900">{analytics.readRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${analytics.readRate}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Avg. Response Time</span>
            <span className="text-sm font-semibold text-gray-900">{analytics.averageResponseTime} min</span>
          </div>
        </div>
      </div>
    </div>
  );

  const StatusBreakdown = () => (
    <div className="bg-white rounded-xl border shadow-sm p-4">
      <h3 className="font-bold text-gray-900 mb-4">Status Distribution</h3>
      <div className="space-y-2 text-sm">
        {[
          { status: 'Sent', count: analytics.communicationsByStatus.sent, icon: Clock, color: 'text-yellow-600' },
          { status: 'Delivered', count: analytics.communicationsByStatus.delivered, icon: CheckCircle, color: 'text-green-600' },
          { status: 'Read', count: analytics.communicationsByStatus.read, icon: CheckCircle, color: 'text-green-600' },
          { status: 'Failed', count: analytics.communicationsByStatus.failed, icon: AlertCircle, color: 'text-red-600' },
        ].map(({ status, count, icon: Icon, color }) => (
          <div key={status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-3.5 w-3.5 ${color}`} />
              <span>{status}</span>
            </div>
            <span className="font-semibold text-gray-900">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Mail className="h-5 w-5 text-blue-600" />}
          label="Total Communications"
          value={analytics.totalCommunications}
          color="bg-blue-100"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
          label="Delivery Rate"
          value={`${analytics.deliveryRate}%`}
          color="bg-green-100"
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5 text-purple-600" />}
          label="Read Rate"
          value={`${analytics.readRate}%`}
          color="bg-purple-100"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-orange-600" />}
          label="Avg Response Time"
          value={`${analytics.averageResponseTime}m`}
          color="bg-orange-100"
        />
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CommunicationTypeBreakdown />
        <PerformanceMetrics />
        <StatusBreakdown />
      </div>

      {/* Last Communication */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3">Last Communication</h3>
        <p className="text-sm text-gray-700">{formatDate(analytics.lastCommunicationDate)}</p>
      </div>
    </div>
  );
};

export default CommunicationAnalyticsDashboard;
