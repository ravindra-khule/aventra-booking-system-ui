/**
 * Itinerary Preview - Display itinerary in preview mode
 */

import React from 'react';
import { CompleteItinerary } from '../../types/itinerary.types';
import { MapPin, Clock, Users, Utensils, Building2, Truck, Image as ImageIcon } from 'lucide-react';
import styles from './ItineraryPreview.module.css';

interface ItineraryPreviewProps {
  itinerary: CompleteItinerary;
}

export const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ itinerary }) => {
  return (
    <div className={styles.preview}>
      {/* Itinerary Header */}
      <div className={styles.header}>
        <h1>{itinerary.title}</h1>
        {itinerary.description && (
          <p className={styles.description}>{itinerary.description}</p>
        )}
        <div className={styles.meta}>
          <span>{itinerary.days.length} Days</span>
          {itinerary.totalDistance && <span>{itinerary.totalDistance}</span>}
          {itinerary.totalElevation && <span>{itinerary.totalElevation}</span>}
        </div>
      </div>

      {/* Highlights */}
      {itinerary.highlights.length > 0 && (
        <div className={styles.section}>
          <h2>Highlights</h2>
          <ul className={styles.highlights}>
            {itinerary.highlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Days */}
      <div className={styles.daysSection}>
        <h2>Daily Itinerary</h2>
        {itinerary.days.map((day) => (
          <div key={day.id} className={styles.dayBlock}>
            <div className={styles.dayHeader}>
              <h3>Day {day.day}: {day.title}</h3>
              {(day.distance || day.elevation) && (
                <div className={styles.dayStats}>
                  {day.distance && <span>{day.distance}</span>}
                  {day.elevation && <span>{day.elevation}</span>}
                </div>
              )}
            </div>

            {day.description && (
              <p className={styles.dayDescription}>{day.description}</p>
            )}

            {day.highlightText && (
              <div className={styles.highlight}>
                <strong>Highlight:</strong> {day.highlightText}
              </div>
            )}

            <div className={styles.dayContent}>
              {/* Activities */}
              {day.activities.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Clock className="h-5 w-5" />
                    Activities
                  </h4>
                  <div className={styles.activitiesList}>
                    {[...day.activities]
                      .sort((a, b) => {
                        const timeA = parseInt(a.startTime.replace(':', ''));
                        const timeB = parseInt(b.startTime.replace(':', ''));
                        return timeA - timeB;
                      })
                      .map((activity) => (
                        <div key={activity.id} className={styles.activityBlock}>
                          <div className={styles.activityHeader}>
                            <div className={styles.activityTime}>
                              {activity.startTime} - {activity.endTime}
                            </div>
                            <h5>{activity.name}</h5>
                          </div>
                          {activity.location && (
                            <p className={styles.location}>
                              <MapPin className="h-4 w-4" />
                              {activity.location}
                            </p>
                          )}
                          {activity.description && (
                            <p className={styles.activityDescription}>
                              {activity.description}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Meals */}
              {day.meals.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Utensils className="h-5 w-5" />
                    Meals
                  </h4>
                  <div className={styles.mealsList}>
                    {day.meals.map((meal) => (
                      <div key={meal.id} className={styles.mealBlock}>
                        <span className={styles.mealType}>{meal.type}</span>
                        <h5>{meal.name}</h5>
                        {meal.restaurant && (
                          <p className={styles.restaurant}>{meal.restaurant}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accommodation */}
              {day.accommodation && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Building2 className="h-5 w-5" />
                    Accommodation
                  </h4>
                  <div className={styles.accommodationBlock}>
                    <h5>{day.accommodation.name}</h5>
                    <p className={styles.accommodationType}>{day.accommodation.type}</p>
                    <p>{day.accommodation.location}</p>
                    {day.accommodation.amenities.length > 0 && (
                      <div className={styles.amenities}>
                        {day.accommodation.amenities.map((amenity, i) => (
                          <span key={i} className={styles.amenityTag}>{amenity}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transportation */}
              {day.transportation.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Truck className="h-5 w-5" />
                    Transportation
                  </h4>
                  <div className={styles.transportationList}>
                    {day.transportation.map((transport) => (
                      <div key={transport.id} className={styles.transportBlock}>
                        <p className={styles.transportDescription}>
                          {transport.description}
                        </p>
                        <p className={styles.route}>
                          {transport.departureLocation} → {transport.arrivalLocation}
                        </p>
                        {transport.departureTime && (
                          <p className={styles.time}>
                            {transport.departureTime} - {transport.arrivalTime}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {day.galleryImages.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <ImageIcon className="h-5 w-5" />
                    Photos
                  </h4>
                  <div className={styles.gallery}>
                    {day.galleryImages.map((image) => (
                      <figure key={image.id} className={styles.galleryItem}>
                        <img src={image.url} alt={image.alt} />
                        {image.caption && (
                          <figcaption>{image.caption}</figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
