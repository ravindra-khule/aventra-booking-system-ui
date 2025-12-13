/**
 * Itinerary Day Card - Display and manage a single day
 */

import React from 'react';
import { ItineraryDayDetails, Activity, Meal } from '../../types/itinerary.types';
import {
  Clock, MapPin, Users, Utensils, Building2, Truck,
  Image as ImageIcon, AlertCircle
} from 'lucide-react';
import styles from './ItineraryDayCard.module.css';

interface ItineraryDayCardProps {
  day: ItineraryDayDetails;
}

export const ItineraryDayCard: React.FC<ItineraryDayCardProps> = ({ day }) => {
  const sortedActivities = [...day.activities].sort((a, b) => {
    const timeA = parseInt(a.startTime.replace(':', ''));
    const timeB = parseInt(b.startTime.replace(':', ''));
    return timeA - timeB;
  });

  return (
    <div className={styles.container}>
      {/* Day Description */}
      {day.description && (
        <div className={styles.description}>
          <p>{day.description}</p>
          {day.highlightText && (
            <div className={styles.highlight}>
              <AlertCircle className="h-4 w-4" />
              {day.highlightText}
            </div>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Activities Column */}
        <div className={styles.column}>
          <h3 className={styles.sectionTitle}>
            <Clock className="h-5 w-5" />
            Activities ({sortedActivities.length})
          </h3>
          <div className={styles.sectionContent}>
            {sortedActivities.length === 0 ? (
              <p className={styles.empty}>No activities added yet</p>
            ) : (
              <div className={styles.activitiesList}>
                {sortedActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityTime}>
                      {activity.startTime} - {activity.endTime}
                    </div>
                    <div className={styles.activityContent}>
                      <h4>{activity.name}</h4>
                      {activity.location && (
                        <p className={styles.meta}>
                          <MapPin className="h-3 w-3" />
                          {activity.location}
                        </p>
                      )}
                      {activity.description && (
                        <p className={styles.description}>{activity.description}</p>
                      )}
                      <div className={styles.tags}>
                        <span className={`${styles.tag} ${styles[activity.difficulty]}`}>
                          {activity.difficulty}
                        </span>
                        {!activity.included && (
                          <span className={styles.paidTag}>Paid</span>
                        )}
                        {activity.mandatory && (
                          <span className={styles.mandatoryTag}>Required</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accommodation & Transportation */}
        <div className={styles.column}>
          {/* Accommodation */}
          <h3 className={styles.sectionTitle}>
            <Building2 className="h-5 w-5" />
            Accommodation
          </h3>
          <div className={styles.sectionContent}>
            {day.accommodation ? (
              <div className={styles.accommodationCard}>
                <h4>{day.accommodation.name}</h4>
                <p className={styles.type}>{day.accommodation.type}</p>
                <p className={styles.location}>{day.accommodation.location}</p>
                {day.accommodation.amenities.length > 0 && (
                  <div className={styles.amenities}>
                    {day.accommodation.amenities.map((amenity, i) => (
                      <span key={i} className={styles.amenity}>{amenity}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className={styles.empty}>No accommodation specified</p>
            )}
          </div>

          {/* Transportation */}
          <h3 className={styles.sectionTitle}>
            <Truck className="h-5 w-5" />
            Transportation ({day.transportation.length})
          </h3>
          <div className={styles.sectionContent}>
            {day.transportation.length === 0 ? (
              <p className={styles.empty}>No transportation info added</p>
            ) : (
              <div className={styles.transportationList}>
                {day.transportation.map((transport) => (
                  <div key={transport.id} className={styles.transportItem}>
                    <div className={styles.transportType}>{transport.type}</div>
                    <p>{transport.description}</p>
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
            )}
          </div>
        </div>

        {/* Meals & Gallery */}
        <div className={styles.column}>
          {/* Meals */}
          <h3 className={styles.sectionTitle}>
            <Utensils className="h-5 w-5" />
            Meals ({day.meals.length})
          </h3>
          <div className={styles.sectionContent}>
            {day.meals.length === 0 ? (
              <p className={styles.empty}>No meals specified</p>
            ) : (
              <div className={styles.mealsList}>
                {day.meals.map((meal) => (
                  <div key={meal.id} className={styles.mealItem}>
                    <span className={styles.mealType}>{meal.type}</span>
                    <h4>{meal.name}</h4>
                    {meal.restaurant && (
                      <p className={styles.restaurant}>{meal.restaurant}</p>
                    )}
                    {!meal.included && (
                      <span className={styles.paidTag}>Paid</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gallery */}
          <h3 className={styles.sectionTitle}>
            <ImageIcon className="h-5 w-5" />
            Photos ({day.galleryImages.length})
          </h3>
          <div className={styles.sectionContent}>
            {day.galleryImages.length === 0 ? (
              <p className={styles.empty}>No photos added</p>
            ) : (
              <div className={styles.gallery}>
                {day.galleryImages.map((image) => (
                  <div key={image.id} className={styles.galleryItem}>
                    <img src={image.url} alt={image.alt} />
                    {image.caption && (
                      <p className={styles.caption}>{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Day Footer */}
      {(day.distance || day.elevation) && (
        <div className={styles.dayFooter}>
          {day.distance && <span>Distance: {day.distance}</span>}
          {day.elevation && <span>Elevation: {day.elevation}</span>}
        </div>
      )}
    </div>
  );
};
