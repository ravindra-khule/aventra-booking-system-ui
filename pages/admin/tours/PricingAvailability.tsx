import React, { useState, useEffect } from 'react';
import { ToursPricingPage } from '../../../src/features/tours/components/pricing';
import { Tour } from '../../../src/features/tours/types/tour.types';
import { TourService } from '../../../src/features/tours/services/tour.service';

export const PricingAvailability: React.FC = () => {
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const toursData = await TourService.getAll();
      setTours(toursData);
      if (toursData.length > 0) {
        setSelectedTourId(toursData[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading tours...</div>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-yellow-900">No tours available</h3>
          <p className="text-yellow-800 mt-1">Please create a tour first before configuring pricing.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tour Selector */}
      {tours.length > 1 && (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Tour</label>
          <select
            value={selectedTourId || ''}
            onChange={(e) => setSelectedTourId(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Pricing Configuration */}
      {selectedTourId && <ToursPricingPage tourId={selectedTourId} />}
    </div>
  );
};
