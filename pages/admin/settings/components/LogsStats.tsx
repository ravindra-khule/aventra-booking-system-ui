import React from 'react';
import { TrendingUp, AlertCircle, Activity, Lock } from 'lucide-react';

export const LogsStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Events',
      value: '24,582',
      change: '+12%',
      icon: Activity,
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Errors',
      value: '142',
      change: '+5%',
      icon: AlertCircle,
      color: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Login Attempts',
      value: '8,342',
      change: '+23%',
      icon: Lock,
      color: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Security Events',
      value: '18',
      change: '+2%',
      icon: TrendingUp,
      color: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.color} rounded-lg p-6 border border-gray-200`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-green-600 text-xs mt-2">{stat.change} from last 7 days</p>
              </div>
              <Icon className={`${stat.textColor}`} size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
