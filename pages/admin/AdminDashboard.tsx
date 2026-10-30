import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingService } from '../../services/api';
import { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Users, Briefcase, TrendingUp, AlertCircle, CheckCircle, Clock, 
  Activity, Target, TrendingDown, Eye, MapPin, Mail, CreditCard, BarChart3, 
  RefreshCw, ArrowRight, ChevronRight, Zap, Shield, Calendar, UserPlus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
  timestamp: Date;
}

const AUTO_REFRESH_MS = 60000;

const formatSEK = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M SEK`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K SEK`;
  return `${Math.round(value)} SEK`;
};

const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className={`p-2.5 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-5 w-5`} style={{ color: color === 'bg-primary' ? '#ff1b00' : color === 'bg-success' ? '#16a34a' : color === 'bg-warning' ? '#f59e0b' : '#3b82f6' }} />
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
      {change !== undefined && (
        <div className={`flex items-center text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span>{Math.abs(change)}% {change >= 0 ? 'increase' : 'decrease'}</span>
        </div>
      )}
    </div>
  </div>
);

const AlertWidget: React.FC<{ alert: Alert }> = ({ alert }) => {
  const bgColor = {
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    info: 'border-blue-200',
    success: 'bg-green-50 border-green-200',
  }[alert.type];

  const iconColor = {
    warning: 'text-amber-600',
    danger: 'text-red-600',
    info: '',
    success: 'text-green-600',
  }[alert.type];

  const Icon = alert.type === 'danger' || alert.type === 'warning' ? AlertCircle : CheckCircle;

  return (
    <div 
      className={`p-4 rounded-lg border ${bgColor} flex items-start justify-between group hover:shadow-sm transition-shadow`}
      style={alert.type === 'info' ? { backgroundColor: '#eff6ff' } : {}}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} style={alert.type === 'info' ? { color: '#3b82f6' } : {}} />
        <div>
          <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
          <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
        </div>
      </div>
      {alert.action && (
        <button
          onClick={alert.action.onClick}
          className="text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline whitespace-nowrap ml-4"
        >
          {alert.action.label} →
        </button>
      )}
    </div>
  );
};

const ActionWidget = ({ title, description, icon: Icon, color, actions }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <div className="flex flex-wrap gap-2">
      {actions.map((action: any, idx: number) => (
        <button
          key={idx}
          onClick={action.onClick}
          className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          {action.label} <ChevronRight className="h-3 w-3" />
        </button>
      ))}
    </div>
  </div>
);

const InsightCard = ({ title, value, context, icon: Icon, color }: any) => (
  <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-100">
    <div className="flex items-start justify-between mb-3">
      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      <div className={`p-1.5 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <p className="text-lg font-bold text-gray-900 mb-1">{value}</p>
    <p className="text-xs text-gray-600">{context}</p>
  </div>
);

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const buildAlerts = useCallback((data: DashboardStats): Alert[] => {
    const now = new Date();
    const list: Alert[] = [];

    const cancelled = data.cancelledBookings ?? 0;
    if (cancelled > 0) {
      list.push({
        id: 'cancellations',
        type: (data.cancellationRate ?? 0) >= 15 ? 'danger' : 'warning',
        title: t('admin:highCancellationRate'),
        message: t('admin:cancellationAlertMessage')
          .replace('{count}', cancelled.toString())
          .replace('{rate}', (data.cancellationRate ?? 0).toString()),
        action: { label: t('admin:review'), onClick: () => navigate('/admin/bookings') },
        timestamp: now,
      });
    }

    const pendingPayments = data.pendingPayments ?? 0;
    if (pendingPayments > 0) {
      list.push({
        id: 'pending-payments',
        type: 'info',
        title: t('admin:paymentPending'),
        message: t('admin:pendingPaymentsMessage')
          .replace('{count}', pendingPayments.toString())
          .replace('{amount}', formatSEK(data.unpaidBalance ?? 0)),
        action: { label: t('admin:followUp'), onClick: () => navigate('/admin/finance/invoices') },
        timestamp: now,
      });
    }

    const lowAvailability = data.lowAvailabilityTours ?? 0;
    if (lowAvailability > 0) {
      list.push({
        id: 'low-availability',
        type: 'warning',
        title: t('admin:lowAvailabilityTitle'),
        message: t('admin:lowAvailabilityMessage').replace('{count}', lowAvailability.toString()),
        action: { label: t('admin:review'), onClick: () => navigate('/admin/tours') },
        timestamp: now,
      });
    }

    if ((data.revenueGrowth ?? 0) > 0 && (data.monthlyRevenue ?? 0) > 0) {
      list.push({
        id: 'revenue-growth',
        type: 'success',
        title: t('admin:revenueGrowthTitle'),
        message: t('admin:revenueGrowthMessage').replace('{growth}', (data.revenueGrowth ?? 0).toString()),
        timestamp: now,
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'all-clear',
        type: 'success',
        title: t('admin:allClearTitle'),
        message: t('admin:allClearMessage'),
        timestamp: now,
      });
    }

    return list;
  }, [t, navigate]);

  const loadDashboard = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const data = await BookingService.getStats();
      setStats(data);
      setAlerts(buildAlerts(data));
      setLastUpdated(new Date());
      setLoadError(null);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setLoadError(t('admin:dashboardLoadError'));
    } finally {
      setIsRefreshing(false);
    }
  }, [buildAlerts, t]);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => loadDashboard(), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  if (!stats) {
    return (
      <div className="p-8 text-center">
        {loadError ? (
          <div className="text-red-600">
            <p>{loadError}</p>
            <button
              onClick={() => loadDashboard(true)}
              className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
            >
              {t('admin:refresh')}
            </button>
          </div>
        ) : (
          t('common:loading')
        )}
      </div>
    );
  }

  // Booking growth vs previous month (from monthly chart data)
  const monthlyBookings = stats.revenueByMonth ?? [];
  const thisMonthBookings = monthlyBookings[monthlyBookings.length - 1]?.bookings ?? 0;
  const lastMonthBookings = monthlyBookings[monthlyBookings.length - 2]?.bookings ?? 0;
  const bookingsGrowth = lastMonthBookings > 0
    ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 1000) / 10
    : (thisMonthBookings > 0 ? 100 : 0);

  const customersGrowth = (stats.newCustomersLastMonth ?? 0) > 0
    ? Math.round((((stats.newCustomersThisMonth ?? 0) - (stats.newCustomersLastMonth ?? 0)) / (stats.newCustomersLastMonth ?? 1)) * 1000) / 10
    : ((stats.newCustomersThisMonth ?? 0) > 0 ? 100 : 0);

  const revenueData = (stats.revenueByMonth ?? []).map((m) => ({ name: m.month, revenue: m.revenue }));

  const breakdown = stats.statusBreakdown ?? {};
  const bookingStatusData = [
    { name: t('admin:confirmed'), value: breakdown.confirmed ?? 0, fill: '#10b981' },
    { name: t('admin:pending'), value: breakdown.pending ?? 0, fill: '#f59e0b' },
    { name: t('admin:completed'), value: breakdown.completed ?? 0, fill: '#3b82f6' },
    { name: t('admin:cancelled'), value: breakdown.cancelled ?? 0, fill: '#ef4444' },
  ];

  const customerAcquisitionData = (stats.customersByMonth ?? []).map((m) => ({ name: m.month, customers: m.count }));

  const quickActionGroups = [
    {
      title: t('admin:bookingManagement'),
      description: t('admin:bookingManagementDesc'),
      icon: Calendar,
      color: 'bg-primary',
      actions: [
        { label: t('admin:viewBookings'), onClick: () => navigate('/admin/bookings') },
        { label: t('admin:newBooking'), onClick: () => navigate('/admin/bookings') },
        { label: t('admin:calendar'), onClick: () => navigate('/admin/bookings') },
      ],
    },
    {
      title: t('admin:customerManagement'),
      description: t('admin:customerManagementDesc'),
      icon: Users,
      color: 'bg-success',
      actions: [
        { label: t('admin:allCustomers'), onClick: () => navigate('/admin/customers') },
        { label: t('admin:groups'), onClick: () => navigate('/admin/customers/groups') },
        { label: t('admin:communications'), onClick: () => navigate('/admin/customers/communications') },
      ],
    },
    {
      title: t('admin:financialOperations'),
      description: t('admin:financialOperationsDesc'),
      icon: CreditCard,
      color: 'bg-emerald-500',
      actions: [
        { label: t('admin:invoices'), onClick: () => navigate('/admin/finance/invoices') },
        { label: t('admin:payments'), onClick: () => navigate('/admin/finance/payments') },
        { label: t('admin:reports'), onClick: () => navigate('/admin/finance/reports') },
      ],
    },
    {
      title: t('admin:tourManagement'),
      description: t('admin:tourManagementDesc'),
      icon: MapPin,
      color: 'bg-purple-500',
      actions: [
        { label: t('admin:viewTours'), onClick: () => navigate('/admin/tours') },
        { label: t('admin:addTour'), onClick: () => navigate('/admin/tours') },
        { label: t('admin:availability'), onClick: () => navigate('/admin/tours/pricing') },
      ],
    },
    {
      title: t('admin:marketingCampaigns'),
      description: t('admin:marketingCampaignsDesc'),
      icon: BarChart3,
      color: 'bg-orange-500',
      actions: [
        { label: t('admin:campaigns'), onClick: () => navigate('/admin/marketing/email-templates') },
        { label: t('admin:promoCodes'), onClick: () => navigate('/admin/marketing/promo-codes') },
        { label: t('admin:analytics'), onClick: () => navigate('/admin/finance/reports') },
      ],
    },
    {
      title: t('admin:systemAdministration'),
      description: t('admin:systemAdministrationDesc'),
      icon: Shield,
      color: 'bg-red-500',
      actions: [
        { label: t('admin:users'), onClick: () => navigate('/admin/settings/users') },
        { label: t('admin:settings'), onClick: () => navigate('/admin/settings/company') },
        { label: t('admin:logs'), onClick: () => navigate('/admin/settings/logs') },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('admin:dashboardOverview')}</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('admin:realtimeInsights')}
          </p>
        </div>
        <button
          onClick={() => loadDashboard(true)}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t('admin:refresh')}
        </button>
      </div>

      {/* Key Performance Indicators (KPIs) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          {t('admin:kpiTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title={t('admin:totalRevenue')}
            value={formatSEK(stats.totalRevenue)} 
            change={stats.revenueGrowth}
            trend={(stats.revenueGrowth ?? 0) >= 0 ? 'up' : 'down'}
            icon={DollarSign} 
            color="bg-success" 
          />
          <StatCard 
            title={t('admin:monthlyRevenue')}
            value={formatSEK(stats.monthlyRevenue ?? 0)} 
            change={stats.revenueGrowth}
            trend={(stats.revenueGrowth ?? 0) >= 0 ? 'up' : 'down'}
            icon={TrendingUp} 
            color="bg-primary" 
          />
          <StatCard 
            title={t('admin:activeBookings')}
            value={stats.activeBookings}
            change={bookingsGrowth}
            trend={bookingsGrowth >= 0 ? 'up' : 'down'}
            icon={Briefcase} 
            color="bg-info" 
          />
          <StatCard 
            title={t('admin:occupancyRate')}
            value={`${stats.occupancyRate}%`}
            icon={Eye} 
            color="bg-warning" 
          />
        </div>
      </div>

      {/* Critical Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            {t('admin:systemAlertsTitle')}
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertWidget key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{t('admin:revenuePerformance')}</h3>
          <p className="text-sm text-gray-500 mb-6">{t('admin:monthlyRevenueTrend')}</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{t('admin:bookingStatusDistribution')}</h3>
          <p className="text-sm text-gray-500 mb-6">{t('admin:bookingStatusOverview')}</p>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {bookingStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }}></div>
                <span className="text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Customers Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{t('admin:customerAcquisitionTrends')}</h3>
        <p className="text-sm text-gray-500 mb-6">{t('admin:newCustomersOverTime')}</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerAcquisitionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={2} name={t('admin:newCustomers')} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Insights */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          {t('admin:businessInsights')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard
            title={t('admin:occupancyRate')}
            value={`${stats.occupancyRate}%`}
            context={t('admin:ofUpcomingCapacity')}
            icon={MapPin}
            color="bg-info"
          />
          <InsightCard
            title={t('admin:cancellationRate')}
            value={`${stats.cancellationRate ?? 0}%`}
            context={t('admin:ofAllBookings')}
            icon={AlertCircle}
            color="bg-warning"
          />
          <InsightCard
            title={t('admin:avgBookingValue')}
            value={formatSEK(stats.averageBookingValue ?? 0)}
            context={t('admin:perActiveBooking')}
            icon={CreditCard}
            color="bg-purple-500"
          />
          <InsightCard
            title={t('admin:paymentSuccessRate')}
            value={`${stats.paymentSuccessRate ?? 0}%`}
            context={t('admin:excellentRate').replace('{count}', (stats.pendingPayments ?? 0).toString())}
            icon={CheckCircle}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" style={{ color: '#ff1b00' }} />
          {t('admin:quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActionGroups.map((group) => (
            <ActionWidget
              key={group.title}
              title={group.title}
              description={group.description}
              icon={group.icon}
              color={group.color}
              actions={group.actions}
            />
          ))}
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title={t('admin:totalCustomers')}
          value={(stats.totalCustomers ?? 0).toLocaleString()}
          icon={Users} 
          color="bg-cyan-500" 
        />
        <StatCard 
          title={t('admin:newThisMonth')} 
          value={stats.newCustomersThisMonth ?? 0}
          change={customersGrowth}
          trend={customersGrowth >= 0 ? 'up' : 'down'}
          icon={UserPlus} 
          color="bg-info" 
        />
        <StatCard 
          title={t('admin:repeatRate')}
          value={`${stats.repeatCustomerRate ?? 0}%`}
          icon={RefreshCw} 
          color="bg-success" 
        />
        <StatCard 
          title={t('admin:avgCustomerLTV')} 
          value={formatSEK(stats.averageCustomerLTV ?? 0)}
          icon={TrendingUp} 
          color="bg-warning" 
        />
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        <p>
          {t('admin:dashboardLastUpdated')}: {lastUpdated ? lastUpdated.toLocaleString('sv-SE') : '—'} • {t('admin:autoRefreshEnabled')}
        </p>
      </div>
    </div>
  );
};
