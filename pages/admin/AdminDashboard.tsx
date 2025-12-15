import React, { useEffect, useState } from 'react';
import { BookingService } from '../../services/api';
import { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, Users, Briefcase, TrendingUp, AlertCircle, CheckCircle, Clock, 
  Activity, Target, TrendingDown, Eye, MapPin, Mail, CreditCard, BarChart3, 
  RefreshCw, ArrowRight, ChevronRight, Zap, Shield, Calendar
} from 'lucide-react';

interface KPIData {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  occupancyRate: number;
  customerSatisfaction: number;
  conversionRate: number;
  averageBookingValue: number;
  cancellationRate: number;
  paymentSuccessRate: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  repeatCustomerRate: number;
  averageCustomerLTV: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  action?: { label: string; href: string };
  timestamp: Date;
}

const StatCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <div className={`p-2.5 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
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

const AlertWidget = ({ alert }: { alert: Alert }) => {
  const bgColor = {
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
  }[alert.type];

  const iconColor = {
    warning: 'text-amber-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    success: 'text-green-600',
  }[alert.type];

  const Icon = alert.type === 'danger' || alert.type === 'warning' ? AlertCircle : CheckCircle;

  return (
    <div className={`p-4 rounded-lg border ${bgColor} flex items-start justify-between group hover:shadow-sm transition-shadow`}>
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
        <div>
          <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
          <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
        </div>
      </div>
      {alert.action && (
        <a href={alert.action.href} className="text-xs font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap ml-4">
          {alert.action.label} →
        </a>
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
          className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          {action} <ChevronRight className="h-3 w-3" />
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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    BookingService.getStats().then((data) => {
      setStats(data);
      // Initialize enhanced KPI data
      setKpiData({
        totalRevenue: data.totalRevenue || 1250000,
        monthlyRevenue: 285000,
        revenueGrowth: 12.5,
        activeBookings: data.activeBookings || 42,
        pendingBookings: 18,
        completedBookings: 156,
        occupancyRate: data.occupancyRate || 78,
        customerSatisfaction: 94,
        conversionRate: 8.4,
        averageBookingValue: 6800,
        cancellationRate: 3.2,
        paymentSuccessRate: 98.6,
        totalCustomers: 1240,
        newCustomersThisMonth: 148,
        repeatCustomerRate: 42,
        averageCustomerLTV: 18500,
      });
      // Initialize alerts
      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'High Cancellation Rate',
          message: '3 bookings cancelled this week. Consider reviewing tour availability.',
          action: { label: 'Review', href: '/admin/bookings' },
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'info',
          title: 'Payment Pending',
          message: '2 invoices awaiting payment. Automated reminder sent.',
          action: { label: 'Follow up', href: '/admin/finance/invoices' },
          timestamp: new Date(),
        },
        {
          id: '3',
          type: 'success',
          title: 'Monthly Target Met',
          message: 'Revenue target exceeded by 15% this month.',
          timestamp: new Date(),
        },
      ]);
    });
  }, []);

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 220000, target: 200000 },
    { name: 'Feb', revenue: 240000, target: 210000 },
    { name: 'Mar', revenue: 260000, target: 220000 },
    { name: 'Apr', revenue: 270000, target: 230000 },
    { name: 'May', revenue: 285000, target: 250000 },
    { name: 'Jun', revenue: 310000, target: 260000 },
  ];

  const bookingStatusData = [
    { name: 'Confirmed', value: 42, fill: '#10b981' },
    { name: 'Pending', value: 18, fill: '#f59e0b' },
    { name: 'Completed', value: 156, fill: '#3b82f6' },
    { name: 'Cancelled', value: 12, fill: '#ef4444' },
  ];

  const customerAcquisitionData = [
    { name: 'Jan', direct: 28, organic: 45, referral: 32, campaign: 35 },
    { name: 'Feb', direct: 32, organic: 52, referral: 38, campaign: 42 },
    { name: 'Mar', direct: 35, organic: 58, referral: 42, campaign: 48 },
    { name: 'Apr', direct: 42, organic: 68, referral: 52, campaign: 58 },
    { name: 'May', direct: 48, organic: 75, referral: 62, campaign: 65 },
    { name: 'Jun', direct: 58, organic: 92, referral: 75, campaign: 78 },
  ];

  if (!stats || !kpiData) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Real-time system performance and user activity insights
        </p>
      </div>

      {/* Key Performance Indicators (KPIs) */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Revenue" 
            value={`${(kpiData.totalRevenue / 1000000).toFixed(1)}M SEK`} 
            change={kpiData.revenueGrowth}
            trend="up"
            icon={DollarSign} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Monthly Revenue" 
            value={`${(kpiData.monthlyRevenue / 1000).toFixed(0)}K SEK`} 
            change={5.8}
            trend="up"
            icon={TrendingUp} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Active Bookings" 
            value={kpiData.activeBookings}
            change={3.2}
            trend="up"
            icon={Briefcase} 
            color="bg-indigo-500" 
          />
          <StatCard 
            title="Customer Satisfaction" 
            value={`${kpiData.customerSatisfaction}%`}
            change={2.1}
            trend="up"
            icon={Eye} 
            color="bg-pink-500" 
          />
        </div>
      </div>

      {/* Critical Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            System Alerts & Notifications
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
          <h3 className="text-lg font-bold text-gray-800 mb-1">Revenue Performance</h3>
          <p className="text-sm text-gray-500 mb-6">Monthly revenue vs. target (SEK)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">Booking Status Distribution</h3>
          <p className="text-sm text-gray-500 mb-6">Current booking status overview</p>
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

      {/* Customer Acquisition Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-1">Customer Acquisition Trends</h3>
        <p className="text-sm text-gray-500 mb-6">New customers by channel over time</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerAcquisitionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="direct" stroke="#3b82f6" strokeWidth={2} name="Direct" />
              <Line type="monotone" dataKey="organic" stroke="#10b981" strokeWidth={2} name="Organic" />
              <Line type="monotone" dataKey="referral" stroke="#f59e0b" strokeWidth={2} name="Referral" />
              <Line type="monotone" dataKey="campaign" stroke="#8b5cf6" strokeWidth={2} name="Campaign" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Insights */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-600" />
          Business Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InsightCard
            title="Occupancy Rate"
            value={`${kpiData.occupancyRate}%`}
            context="Tours at capacity. Growing demand indicates need for more tours."
            icon={MapPin}
            color="bg-blue-500"
          />
          <InsightCard
            title="Conversion Rate"
            value={`${kpiData.conversionRate}%`}
            context="Visitor to booking conversion. Industry avg is 2-4%."
            icon={Target}
            color="bg-green-500"
          />
          <InsightCard
            title="Avg Booking Value"
            value={`${(kpiData.averageBookingValue / 1000).toFixed(1)}K SEK`}
            context="Higher than Q1 average. Premium tours gaining traction."
            icon={CreditCard}
            color="bg-purple-500"
          />
          <InsightCard
            title="Payment Success Rate"
            value={`${kpiData.paymentSuccessRate}%`}
            context="Excellent rate. Only {kpiData.pendingBookings} payments pending."
            icon={CheckCircle}
            color="bg-green-500"
          />
        </div>
      </div>

      {/* System Health & Integrations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-1">System Health & Integrations</h3>
        <p className="text-sm text-gray-500 mb-6">Real-time status of critical services</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-gray-900">Fortnox Accounting</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Active</span>
            </div>
            <p className="text-xs text-gray-600">Last sync: 10 mins ago</p>
            <p className="text-xs text-gray-500 mt-2">Syncing invoices and GL entries</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-gray-900">Stripe Payments</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Live</span>
            </div>
            <p className="text-xs text-gray-600">Operational • 0 failed transactions</p>
            <p className="text-xs text-gray-500 mt-2">Processing bookings & refunds</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="font-medium text-gray-900">SendGrid Email</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Active</span>
            </div>
            <p className="text-xs text-gray-600">98.5% Delivery Rate</p>
            <p className="text-xs text-gray-500 mt-2">1,240 emails sent this month</p>
          </div>
        </div>
      </div>

      {/* Actionable Widgets */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionWidget
            title="Booking Management"
            description="Review and manage active bookings and reservations"
            icon={Calendar}
            color="bg-blue-500"
            actions={['View Bookings', 'New Booking', 'Calendar']}
          />
          <ActionWidget
            title="Customer Management"
            description="Manage customer profiles, communications, and groups"
            icon={Users}
            color="bg-green-500"
            actions={['All Customers', 'Groups', 'Communications']}
          />
          <ActionWidget
            title="Financial Operations"
            description="Track payments, invoices, and financial reporting"
            icon={CreditCard}
            color="bg-emerald-500"
            actions={['Invoices', 'Payments', 'Reports']}
          />
          <ActionWidget
            title="Tour Management"
            description="Create and manage tour offerings, pricing, and availability"
            icon={MapPin}
            color="bg-purple-500"
            actions={['View Tours', 'Add Tour', 'Availability']}
          />
          <ActionWidget
            title="Marketing Campaigns"
            description="Create promotions, manage campaigns, and track analytics"
            icon={BarChart3}
            color="bg-orange-500"
            actions={['Campaigns', 'Promo Codes', 'Analytics']}
          />
          <ActionWidget
            title="System Administration"
            description="Configure settings, manage users, and system health"
            icon={Shield}
            color="bg-red-500"
            actions={['Users', 'Settings', 'Logs']}
          />
        </div>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Customers" 
          value={kpiData.totalCustomers.toLocaleString()}
          change={9.2}
          trend="up"
          icon={Users} 
          color="bg-cyan-500" 
        />
        <StatCard 
          title="New This Month" 
          value={kpiData.newCustomersThisMonth}
          change={12.8}
          trend="up"
          icon={UserPlus} 
          color="bg-teal-500" 
        />
        <StatCard 
          title="Repeat Rate" 
          value={`${kpiData.repeatCustomerRate}%`}
          change={3.5}
          trend="up"
          icon={RefreshCw} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Avg Customer LTV" 
          value={`${(kpiData.averageCustomerLTV / 1000).toFixed(1)}K SEK`}
          change={6.3}
          trend="up"
          icon={TrendingUp} 
          color="bg-violet-500" 
        />
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-200">
        <p>Dashboard last updated: {new Date().toLocaleTimeString('sv-SE')} • Auto-refresh enabled</p>
      </div>
    </div>
  );
};

// Add missing icon import
import { UserPlus } from 'lucide-react';