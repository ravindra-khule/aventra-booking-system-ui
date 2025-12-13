/**
 * Price Calendar Component with Visual Indicators
 */
import React, { useState } from 'react';
import { PriceCalendarEntry } from '../../types/pricing.types';
import { ChevronLeft, ChevronRight, Calendar, Activity } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils';

interface PriceCalendarProps {
  entries: PriceCalendarEntry[];
  basePrice: number;
}

export const PriceCalendar: React.FC<PriceCalendarProps> = ({ entries, basePrice }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<PriceCalendarEntry | null>(null);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEntryForDate = (day: number): PriceCalendarEntry | undefined => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.find(e => e.date === dateStr);
  };

  const getStatusColor = (status: string, occupancy: number) => {
    switch (status) {
      case 'blackout':
        return 'bg-gray-200 text-gray-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'available':
        return occupancy < 25 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  const getPriceChange = (price: number) => {
    const change = price - basePrice;
    if (change === 0) return { text: 'Base', color: 'text-gray-600' };
    if (change > 0) return { text: `+${formatCurrency(change)}`, color: 'text-red-600' };
    return { text: `${formatCurrency(change)}`, color: 'text-green-600' };
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Price Calendar</h3>
        <p className="text-sm text-gray-600">Base price: {formatCurrency(basePrice)}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <h4 className="text-lg font-semibold text-gray-900">{monthName}</h4>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-green-100" />
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-blue-100" />
            <span className="text-gray-600">High Demand</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-yellow-100" />
            <span className="text-gray-600">Limited</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-red-100" />
            <span className="text-gray-600">Full/Blackout</span>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const entry = day ? getEntryForDate(day) : null;
            const priceChange = entry ? getPriceChange(entry.price) : null;

            return (
              <div
                key={index}
                onClick={() => entry && setSelectedDate(entry)}
                className={`aspect-square p-1 rounded border cursor-pointer transition-all ${
                  entry
                    ? `${getStatusColor(entry.status, entry.occupancyPercentage)} hover:shadow-md`
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {day && (
                  <div className="h-full flex flex-col text-center text-xs">
                    <span className="font-semibold">{day}</span>
                    {entry && (
                      <>
                        <span className="text-xs font-medium">{formatCurrency(entry.price)}</span>
                        <span className={`text-xs ${priceChange?.color}`}>
                          {priceChange?.text}
                        </span>
                        <div className="text-xs">
                          <Activity className="h-3 w-3 mx-auto opacity-60" />
                          {entry.occupancyPercentage}%
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{selectedDate.date}</h4>
              <p className="text-sm text-gray-600">Detailed pricing information</p>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Price/Person</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(selectedDate.price)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Deposit</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(selectedDate.depositPrice)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Available Spots</p>
              <p className="text-lg font-semibold text-gray-900">{selectedDate.availableSpots}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Occupancy</p>
              <p className="text-lg font-semibold text-gray-900">{selectedDate.occupancyPercentage}%</p>
            </div>
          </div>

          {selectedDate.appliedRules && Object.keys(selectedDate.appliedRules).length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">Applied Rules</p>
              <div className="space-y-1">
                {Object.entries(selectedDate.appliedRules).map(([key, value]) =>
                  value ? (
                    <div key={key} className="text-xs text-gray-700">
                      <span className="font-medium capitalize">{key}:</span> {value}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
