import React from 'react';
import { BusinessHour } from '../types/companyInfo';
import { Clock, X } from 'lucide-react';

interface BusinessHoursProps {
  data: BusinessHour[];
  onChange: (data: BusinessHour[]) => void;
}

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const;

export const BusinessHoursSection: React.FC<BusinessHoursProps> = ({
  data,
  onChange,
}) => {
  const handleTimeChange = (
    day: BusinessHour['day'],
    field: 'openingTime' | 'closingTime',
    value: string
  ) => {
    const updated = data.map(hour =>
      hour.day === day ? { ...hour, [field]: value } : hour
    );
    onChange(updated);
  };

  const handleClosedToggle = (day: BusinessHour['day'], isClosed: boolean) => {
    const updated = data.map(hour =>
      hour.day === day ? { ...hour, isClosed } : hour
    );
    onChange(updated);
  };

  const ensureAllDays = () => {
    const existingDays = new Set(data.map(h => h.day));
    const missingDays = daysOfWeek.filter(d => !existingDays.has(d.value as BusinessHour['day']));
    
    if (missingDays.length > 0) {
      const newHours: BusinessHour[] = missingDays.map(day => ({
        day: day.value as BusinessHour['day'],
        openingTime: '09:00',
        closingTime: '18:00',
        isClosed: false,
      }));
      onChange([...data, ...newHours]);
    }
  };

  React.useEffect(() => {
    if (data.length === 0) {
      ensureAllDays();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Clock size={20} className="text-orange-500" />
        Business Hours
      </h3>

      <div className="space-y-3">
        {daysOfWeek.map(({ value, label }) => {
          const dayData = data.find(h => h.day === value);

          if (!dayData) return null;

          return (
            <div
              key={value}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 w-24">{label}</h4>

                <label className="flex items-center gap-2 ml-auto">
                  <input
                    type="checkbox"
                    checked={dayData.isClosed}
                    onChange={(e) =>
                      handleClosedToggle(value as BusinessHour['day'], e.target.checked)
                    }
                    className="w-4 h-4 text-red-500 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">Closed</span>
                </label>
              </div>

              {!dayData.isClosed && (
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={dayData.openingTime}
                      onChange={(e) =>
                        handleTimeChange(
                          value as BusinessHour['day'],
                          'openingTime',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 mb-1">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={dayData.closingTime}
                      onChange={(e) =>
                        handleTimeChange(
                          value as BusinessHour['day'],
                          'closingTime',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div className="flex items-end">
                    <span className="text-xs text-gray-600 px-3 py-2 bg-gray-50 rounded-lg">
                      {dayData.openingTime} - {dayData.closingTime}
                    </span>
                  </div>
                </div>
              )}

              {dayData.isClosed && (
                <p className="text-sm text-red-600 italic">
                  This day the business is closed
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>💡 Tip:</strong> Set your regular business hours above. Mark days as "Closed" if you don't operate on those days.
        </p>
      </div>
    </div>
  );
};
