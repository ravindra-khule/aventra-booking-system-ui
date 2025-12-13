import React, { useState } from 'react';
import { ItineraryBuilder } from '../../../src/features/tours/components';
import { Button } from '../../../src/shared/components/ui';
import { Plus, ArrowLeft } from 'lucide-react';
import styles from './Itineraries.module.css';

export const Itineraries: React.FC = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  // Mock tour data - replace with real data from props
  const mockTour = {
    id: '1',
    title: 'Thailand Adventure',
    durationDays: 7
  };

  if (showBuilder) {
    return (
      <ItineraryBuilder
        tourId={mockTour.id}
        tourTitle={mockTour.title}
        durationDays={mockTour.durationDays}
        onBack={() => setShowBuilder(false)}
        onSave={(itinerary) => {
          console.log('Itinerary saved:', itinerary);
          setShowBuilder(false);
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Itineraries</h1>
          <p className={styles.subtitle}>Create detailed day-by-day itineraries with activities, locations, and timing.</p>
        </div>
        <Button
          onClick={() => setShowBuilder(true)}
          variant="primary"
          size="lg"
          icon={<Plus className="h-5 w-5" />}
        >
          Create New Itinerary
        </Button>
      </div>

      <div className={styles.features}>
        <h2>Available Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>📅 Drag-and-drop Itinerary Builder</h3>
            <p>Easily organize and reorder days and activities with intuitive drag-and-drop interface</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📍 Day-by-Day Activity Planning</h3>
            <p>Plan detailed activities for each day with timing, location, and difficulty levels</p>
          </div>
          <div className={styles.featureCard}>
            <h3>⏰ Time Scheduling</h3>
            <p>Set exact times for each activity with automatic duration calculation</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🗺️ Location Mapping</h3>
            <p>Add locations and GPS coordinates for each stop on the itinerary</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📸 Photo Galleries</h3>
            <p>Attach photos and images for each day and activity</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🍽️ Meal & Accommodation</h3>
            <p>Specify meals, dietary options, accommodations, and amenities for each day</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🚗 Transportation Info</h3>
            <p>Add transportation details including flights, buses, trains, and car rentals</p>
          </div>
          <div className={styles.featureCard}>
            <h3>📄 PDF Generation</h3>
            <p>Generate professional printable PDF itineraries for customers</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🔗 Sharing & Delivery</h3>
            <p>Share itineraries with customers via email or public links</p>
          </div>
        </div>
      </div>

      <div className={styles.emptyState}>
        <p>No itineraries created yet. Click "Create New Itinerary" to get started.</p>
      </div>
    </div>
  );
};
