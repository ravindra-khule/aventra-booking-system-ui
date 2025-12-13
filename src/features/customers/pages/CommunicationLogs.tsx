import React, { useEffect, useState } from 'react';
import {
  CommunicationLog,
  CommunicationFilter as CommunicationFilterType,
  CommunicationAnalytics,
} from '../types/communication.types';
import CommunicationService from '../services/communication.service';
import {
  CommunicationCard,
  CommunicationDetails,
  CommunicationFilter,
  CommunicationTimeline,
  CommunicationAnalyticsDashboard,
} from '../components';
import { Button } from '../../../shared/components/ui';
import {
  Search,
  Download,
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  Loader,
  AlertCircle,
} from 'lucide-react';

type ViewMode = 'list' | 'timeline' | 'analytics';

/**
 * CommunicationLogs Page
 * Main page for viewing and managing customer communications
 * 
 * Features:
 * - View complete history of emails, SMS, and calls
 * - Search and filter communication logs
 * - Customer interaction timeline
 * - Email and SMS template integration
 * - Response time analytics
 * - Notes and internal comments
 * - Attachment management
 * - Export communication history
 */
export const CommunicationLogs = () => {
  // State Management
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [filteredCommunications, setFilteredCommunications] = useState<CommunicationLog[]>([]);
  const [selectedCommunication, setSelectedCommunication] = useState<CommunicationLog | null>(null);
  const [analytics, setAnalytics] = useState<CommunicationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [customerFilter, setCustomerFilter] = useState<string>('');
  const [filter, setFilter] = useState<CommunicationFilterType>({});
  const [exporting, setExporting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all communications
        const commData = await CommunicationService.getAll();
        setCommunications(commData);
        setFilteredCommunications(commData);

        // Fetch analytics
        const analyticsData = await CommunicationService.getAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to fetch communications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters when filter state changes
  useEffect(() => {
    const applyFilters = async () => {
      const filterPayload: CommunicationFilterType = {
        ...filter,
        ...(customerFilter ? { customerId: customerFilter } : {}),
      };

      const filtered = await CommunicationService.getAll(filterPayload);
      setFilteredCommunications(filtered);

      // Update analytics based on filters
      const newAnalytics = await CommunicationService.getAnalytics(
        customerFilter || undefined,
        filterPayload.dateFrom,
        filterPayload.dateTo,
      );
      setAnalytics(newAnalytics);
    };

    applyFilters();
  }, [filter, customerFilter]);

  // Handle export
  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setExporting(true);
    try {
      const data = await CommunicationService.exportCommunications(format, filter);
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `communications.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Handle communication selection
  const handleSelectCommunication = async (commId: string) => {
    const comm = filteredCommunications.find(c => c.id === commId);
    if (comm) {
      setSelectedCommunication(comm);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                Communication Logs
              </h1>
              <p className="text-gray-600 mt-1">Track all customer interactions in one place</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="More options"
                  onClick={e => {
                    const menu = e.currentTarget.nextElementSibling as HTMLElement;
                    menu?.classList.toggle('hidden');
                  }}
                >
                  <Settings className="h-5 w-5 text-gray-600" />
                </button>
                <div
                  className="hidden absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20"
                  onClick={e => {
                    (e.currentTarget.parentElement?.querySelector('button') as HTMLElement)?.click?.();
                  }}
                >
                  <button
                    onClick={() => handleExport('csv')}
                    disabled={exporting}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                  >
                    <Download className="h-4 w-4" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    disabled={exporting}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={exporting}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 last:rounded-b-lg"
                  >
                    <Download className="h-4 w-4" />
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 border-b -mb-px">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                viewMode === 'list'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                viewMode === 'timeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                viewMode === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* List View */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filter and List */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                  Customer Filter
                </label>
                <input
                  type="text"
                  placeholder="Enter customer ID..."
                  value={customerFilter}
                  onChange={e => setCustomerFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <CommunicationFilter onFilterChange={setFilter} isExpanded={true} />

              {/* Results Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">
                  Showing <strong>{filteredCommunications.length}</strong> of{' '}
                  <strong>{communications.length}</strong> communications
                </p>
              </div>
            </div>

            {/* Communications List or Details */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : selectedCommunication ? (
                <CommunicationDetails
                  communication={selectedCommunication}
                  onClose={() => setSelectedCommunication(null)}
                  onReply={() => alert('Reply feature coming soon')}
                />
              ) : filteredCommunications.length > 0 ? (
                <div className="space-y-3">
                  {filteredCommunications.map(comm => (
                    <CommunicationCard
                      key={comm.id}
                      communication={comm}
                      onClick={() => handleSelectCommunication(comm.id)}
                      isSelected={selectedCommunication?.id === comm.id}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No communications found</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="max-w-2xl">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                    Customer Filter
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer ID..."
                    value={customerFilter}
                    onChange={e => setCustomerFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <CommunicationTimeline
                  entries={filteredCommunications.map(c => ({
                    id: c.id,
                    type: c.type,
                    timestamp: c.timestamp,
                    title: c.subject || `${c.type.charAt(0).toUpperCase() + c.type.slice(1)} with ${c.recipient.name}`,
                    preview: c.content.substring(0, 80) + (c.content.length > 80 ? '...' : ''),
                    status: c.status,
                    tags: c.tags,
                  }))}
                  selectedId={selectedCommunication?.id}
                  onEntryClick={handleSelectCommunication}
                />

                {selectedCommunication && (
                  <div className="mt-6">
                    <CommunicationDetails
                      communication={selectedCommunication}
                      onClose={() => setSelectedCommunication(null)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <>
            {loading || !analytics ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                    Customer Filter
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer ID (optional)..."
                    value={customerFilter}
                    onChange={e => setCustomerFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <CommunicationAnalyticsDashboard analytics={analytics} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunicationLogs;
