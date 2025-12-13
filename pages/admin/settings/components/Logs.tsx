import React, { useState } from 'react';
import { LogsFilter } from './LogsFilter';
import { LogsTable } from './LogsTable';
import { LogsExport } from './LogsExport';
import { LogsStats } from './LogsStats';
import { Settings } from 'lucide-react';

export const Logs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    logType: 'all',
    dateRange: 'last7days',
    searchQuery: '',
    severity: 'all',
  });

  const logTabs = [
    { id: 'all', label: 'All Logs', icon: '📋' },
    { id: 'errors', label: 'Application Errors', icon: '❌' },
    { id: 'activity', label: 'User Activity', icon: '👥' },
    { id: 'api', label: 'API Requests', icon: '🔌' },
    { id: 'auth', label: 'Authentication', icon: '🔐' },
    { id: 'security', label: 'Security Events', icon: '🛡️' },
    { id: 'performance', label: 'Performance', icon: '⚡' },
    { id: 'database', label: 'Database Queries', icon: '💾' },
  ];

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze system activities, errors, and events</p>
        </div>
        <div className="flex gap-3">
          <LogsExport />
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <LogsStats />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {logTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter & Search */}
      <LogsFilter filters={filters} onFilterChange={setFilters} />

      {/* Logs Table */}
      <LogsTable activeTab={activeTab} filters={filters} />
    </div>
    </div>
  );
};
