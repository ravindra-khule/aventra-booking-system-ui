import React, { useEffect, useState } from 'react';
import { BookingService } from '../../services/api';
import { DashboardStats } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Briefcase, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </div>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    BookingService.getStats().then(setStats);
  }, []);

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 40000 },
    { name: 'Feb', revenue: 30000 },
    { name: 'Mar', revenue: 60000 },
    { name: 'Apr', revenue: 95000 },
    { name: 'May', revenue: 120000 },
    { name: 'Jun', revenue: 180000 },
  ];

  if (!stats) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`${stats.totalRevenue.toLocaleString()} SEK`} icon={DollarSign} color="bg-green-500" />
        <StatCard title="Active Bookings" value={stats.activeBookings} icon={Briefcase} color="bg-blue-500" />
        <StatCard title="Occupancy Rate" value={`${stats.occupancyRate}%`} icon={TrendingUp} color="bg-purple-500" />
        <StatCard title="Pending Inquiries" value={stats.pendingInquiries} icon={Users} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Revenue Trend (SEK)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fortnox Sync Status (Mock) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">System Health & Integrations</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
               <div className="flex items-center">
                 <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                 <div>
                   <p className="font-medium text-gray-900">Fortnox Accounting</p>
                   <p className="text-xs text-gray-500">Last sync: 10 mins ago</p>
                 </div>
               </div>
               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
               <div className="flex items-center">
                 <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                 <div>
                   <p className="font-medium text-gray-900">Stripe Payments</p>
                   <p className="text-xs text-gray-500">Operational</p>
                 </div>
               </div>
               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
               <div className="flex items-center">
                 <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                 <div>
                   <p className="font-medium text-gray-900">SendGrid Email</p>
                   <p className="text-xs text-gray-500">98.5% Delivery Rate</p>
                 </div>
               </div>
               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};