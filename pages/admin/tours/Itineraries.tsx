import React from 'react';
import { ComingSoon } from '../../../components/ComingSoon';

export const Itineraries: React.FC = () => {
  return (
    <ComingSoon
      title="Itineraries"
      description="Create detailed day-by-day itineraries with activities, locations, and timing."
      features={[
        'Drag-and-drop itinerary builder',
        'Day-by-day activity planning',
        'Time scheduling for each activity',
        'Location mapping with GPS coordinates',
        'Photo galleries for each stop',
        'Meal and accommodation details',
        'Transportation information',
        'Printable itinerary PDFs',
        'Share itineraries with customers',
      ]}
    />
  );
};
