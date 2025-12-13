import React from 'react';
import { CommunicationType, CommunicationStatus, CommunicationDirection } from '../types/communication.types';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { Input, Button } from '../../../shared/components/ui';

interface CommunicationFilterProps {
  onFilterChange: (filter: FilterState) => void;
  isExpanded?: boolean;
}

export interface FilterState {
  searchText: string;
  types: CommunicationType[];
  statuses: CommunicationStatus[];
  directions: CommunicationDirection[];
  hasAttachments: boolean | null;
  dateFrom: string;
  dateTo: string;
}

const COMMUNICATION_TYPES: CommunicationType[] = ['email', 'sms', 'call', 'note'];
const COMMUNICATION_STATUSES: CommunicationStatus[] = ['sent', 'delivered', 'read', 'failed', 'pending', 'completed'];
const COMMUNICATION_DIRECTIONS: CommunicationDirection[] = ['inbound', 'outbound'];

/**
 * Communication Filter Component
 * Provides advanced filtering options for communication logs
 */
export const CommunicationFilter: React.FC<CommunicationFilterProps> = ({ onFilterChange, isExpanded = false }) => {
  const [filter, setFilter] = React.useState<FilterState>({
    searchText: '',
    types: [],
    statuses: [],
    directions: [],
    hasAttachments: null,
    dateFrom: '',
    dateTo: '',
  });

  const [expanded, setExpanded] = React.useState(isExpanded);

  const handleSearchChange = (value: string) => {
    const newFilter = { ...filter, searchText: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleTypeToggle = (type: CommunicationType) => {
    const newTypes = filter.types.includes(type) ? filter.types.filter(t => t !== type) : [...filter.types, type];
    const newFilter = { ...filter, types: newTypes };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleStatusToggle = (status: CommunicationStatus) => {
    const newStatuses = filter.statuses.includes(status) ? filter.statuses.filter(s => s !== status) : [...filter.statuses, status];
    const newFilter = { ...filter, statuses: newStatuses };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleDirectionToggle = (direction: CommunicationDirection) => {
    const newDirections = filter.directions.includes(direction)
      ? filter.directions.filter(d => d !== direction)
      : [...filter.directions, direction];
    const newFilter = { ...filter, directions: newDirections };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleAttachmentsToggle = () => {
    const newValue = filter.hasAttachments === true ? null : true;
    const newFilter = { ...filter, hasAttachments: newValue };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleClearFilters = () => {
    const clearedFilter: FilterState = {
      searchText: '',
      types: [],
      statuses: [],
      directions: [],
      hasAttachments: null,
      dateFrom: '',
      dateTo: '',
    };
    setFilter(clearedFilter);
    onFilterChange(clearedFilter);
  };

  const hasActiveFilters =
    filter.searchText ||
    filter.types.length > 0 ||
    filter.statuses.length > 0 ||
    filter.directions.length > 0 ||
    filter.hasAttachments !== null ||
    filter.dateFrom ||
    filter.dateTo;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b flex items-center gap-2">
        <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <Input
          type="text"
          placeholder="Search communications..."
          value={filter.searchText}
          onChange={e => handleSearchChange(e.target.value)}
          className="border-0 p-0 text-sm"
        />
        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="text-gray-500 hover:text-gray-700" title="Clear filters">
            <X className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`text-gray-500 hover:text-gray-700 transition-transform ${expanded ? 'rotate-180' : ''}`}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Expandable Filters */}
      {expanded && (
        <div className="p-4 space-y-4 border-t">
          {/* Communication Types */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Type</label>
            <div className="flex flex-wrap gap-2">
              {COMMUNICATION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filter.types.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Communication Status */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {COMMUNICATION_STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filter.statuses.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Direction</label>
            <div className="flex gap-2">
              {COMMUNICATION_DIRECTIONS.map(direction => (
                <button
                  key={direction}
                  onClick={() => handleDirectionToggle(direction)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filter.directions.includes(direction)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {direction}
                </button>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">Other</label>
            <button
              onClick={handleAttachmentsToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter.hasAttachments === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Has Attachments
            </button>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">From</label>
              <input
                type="date"
                value={filter.dateFrom}
                onChange={e => handleDateChange('dateFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">To</label>
              <input
                type="date"
                value={filter.dateTo}
                onChange={e => handleDateChange('dateTo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationFilter;
