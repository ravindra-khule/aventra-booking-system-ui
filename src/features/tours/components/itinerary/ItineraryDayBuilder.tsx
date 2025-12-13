/**
 * Itinerary Day Builder - Edit and manage activities for a single day
 */

import React, { useState } from 'react';
import { ItineraryDayDetails, Activity, Meal, Accommodation, Transportation } from '../../types/itinerary.types';
import { Button } from '../../../../shared/components/ui';
import {
  Plus, Save, X, Clock, MapPin, Users, AlertCircle,
  ChevronDown
} from 'lucide-react';
import { ActivityForm } from './ActivityForm';
import { MealForm } from './MealForm';
import { AccommodationForm } from './AccommodationForm';
import { TransportationForm } from './TransportationForm';
import { GalleryManager } from './GalleryManager';
import styles from './ItineraryDayBuilder.module.css';

interface ItineraryDayBuilderProps {
  day: ItineraryDayDetails;
  onSave: (day: ItineraryDayDetails) => void;
  onCancel: () => void;
}

type Section = 'info' | 'activities' | 'meals' | 'accommodation' | 'transportation' | 'gallery';

export const ItineraryDayBuilder: React.FC<ItineraryDayBuilderProps> = ({
  day,
  onSave,
  onCancel
}) => {
  const [editingDay, setEditingDay] = useState<ItineraryDayDetails>(day);
  const [expandedSections, setExpandedSections] = useState<Set<Section>>(
    new Set(['info', 'activities'])
  );
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [showAccommodationForm, setShowAccommodationForm] = useState(false);
  const [showTransportationForm, setShowTransportationForm] = useState(false);
  const [editingTransportId, setEditingTransportId] = useState<string | null>(null);
  const [showGalleryManager, setShowGalleryManager] = useState(false);

  const toggleSection = (section: Section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Activity handlers
  const handleAddActivity = (activity: Activity) => {
    setEditingDay(prev => ({
      ...prev,
      activities: [...prev.activities, activity]
    }));
    setShowActivityForm(false);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingDay(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === activity.id ? activity : a)
    }));
    setEditingActivityId(null);
  };

  const handleDeleteActivity = (activityId: string) => {
    setEditingDay(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== activityId)
    }));
  };

  // Meal handlers
  const handleAddMeal = (meal: Meal) => {
    setEditingDay(prev => ({
      ...prev,
      meals: [...prev.meals, meal]
    }));
    setShowMealForm(false);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingDay(prev => ({
      ...prev,
      meals: prev.meals.map(m => m.id === meal.id ? meal : m)
    }));
    setEditingMealId(null);
  };

  const handleDeleteMeal = (mealId: string) => {
    setEditingDay(prev => ({
      ...prev,
      meals: prev.meals.filter(m => m.id !== mealId)
    }));
  };

  // Accommodation handlers
  const handleSaveAccommodation = (accommodation: Accommodation) => {
    setEditingDay(prev => ({
      ...prev,
      accommodation
    }));
    setShowAccommodationForm(false);
  };

  const handleDeleteAccommodation = () => {
    setEditingDay(prev => ({
      ...prev,
      accommodation: undefined
    }));
  };

  // Transportation handlers
  const handleAddTransportation = (transport: Transportation) => {
    setEditingDay(prev => ({
      ...prev,
      transportation: [...prev.transportation, transport]
    }));
    setShowTransportationForm(false);
  };

  const handleEditTransportation = (transport: Transportation) => {
    setEditingDay(prev => ({
      ...prev,
      transportation: prev.transportation.map(t => t.id === transport.id ? transport : t)
    }));
    setEditingTransportId(null);
  };

  const handleDeleteTransportation = (transportId: string) => {
    setEditingDay(prev => ({
      ...prev,
      transportation: prev.transportation.filter(t => t.id !== transportId)
    }));
  };

  // Gallery handlers
  const handleSaveGallery = (images: any[]) => {
    setEditingDay(prev => ({
      ...prev,
      galleryImages: images
    }));
    setShowGalleryManager(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.builderHeader}>
        <h3>Edit Day {editingDay.day}</h3>
        <div className={styles.buttons}>
          <Button onClick={onCancel} variant="ghost" size="sm" icon={<X className="h-4 w-4" />}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editingDay)} variant="primary" size="sm" icon={<Save className="h-4 w-4" />}>
            Save Day
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Day Info Section */}
        <section className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('info')}
          >
            <span>Day Information</span>
            <ChevronDown
              className={`h-5 w-5 ${expandedSections.has('info') ? styles.expanded : ''}`}
            />
          </button>

          {expandedSections.has('info') && (
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label>Day Title</label>
                <input
                  type="text"
                  value={editingDay.title}
                  onChange={(e) => setEditingDay(prev => ({ ...prev, title: e.target.value }))}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={editingDay.description}
                  onChange={(e) => setEditingDay(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Highlight Text (optional)</label>
                <textarea
                  value={editingDay.highlightText || ''}
                  onChange={(e) => setEditingDay(prev => ({ ...prev, highlightText: e.target.value }))}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Special note or highlight for this day"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Distance (optional)</label>
                  <input
                    type="text"
                    value={editingDay.distance || ''}
                    onChange={(e) => setEditingDay(prev => ({ ...prev, distance: e.target.value }))}
                    className={styles.input}
                    placeholder="e.g., 25 km"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Elevation (optional)</label>
                  <input
                    type="text"
                    value={editingDay.elevation || ''}
                    onChange={(e) => setEditingDay(prev => ({ ...prev, elevation: e.target.value }))}
                    className={styles.input}
                    placeholder="e.g., 800 m"
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Activities Section */}
        <section className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('activities')}
          >
            <span>Activities ({editingDay.activities.length})</span>
            <ChevronDown
              className={`h-5 w-5 ${expandedSections.has('activities') ? styles.expanded : ''}`}
            />
          </button>

          {expandedSections.has('activities') && (
            <div className={styles.sectionContent}>
              {showActivityForm || editingActivityId ? (
                <ActivityForm
                  day={editingDay}
                  activity={editingActivityId ? editingDay.activities.find(a => a.id === editingActivityId) : undefined}
                  onSave={editingActivityId ? handleEditActivity : handleAddActivity}
                  onCancel={() => {
                    setShowActivityForm(false);
                    setEditingActivityId(null);
                  }}
                />
              ) : (
                <>
                  {editingDay.activities.length === 0 ? (
                    <p className={styles.empty}>No activities added yet</p>
                  ) : (
                    <div className={styles.itemsList}>
                      {editingDay.activities
                        .sort((a, b) => {
                          const timeA = parseInt(a.startTime.replace(':', ''));
                          const timeB = parseInt(b.startTime.replace(':', ''));
                          return timeA - timeB;
                        })
                        .map((activity) => (
                          <div key={activity.id} className={styles.listItem}>
                            <div className={styles.listItemContent}>
                              <div className={styles.listItemTime}>{activity.startTime} - {activity.endTime}</div>
                              <div>
                                <div className={styles.listItemName}>{activity.name}</div>
                                {activity.location && (
                                  <div className={styles.listItemMeta}>
                                    <MapPin className="h-3 w-3" />
                                    {activity.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={styles.listItemActions}>
                              <button
                                onClick={() => setEditingActivityId(activity.id)}
                                className={styles.editBtn}
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteActivity(activity.id)}
                                className={styles.deleteBtn}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  <Button
                    onClick={() => setShowActivityForm(true)}
                    variant="outline"
                    size="sm"
                    icon={<Plus className="h-4 w-4" />}
                    className={styles.addButton}
                  >
                    Add Activity
                  </Button>
                </>
              )}
            </div>
          )}
        </section>

        {/* Meals Section */}
        <section className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('meals')}
          >
            <span>Meals ({editingDay.meals.length})</span>
            <ChevronDown
              className={`h-5 w-5 ${expandedSections.has('meals') ? styles.expanded : ''}`}
            />
          </button>

          {expandedSections.has('meals') && (
            <div className={styles.sectionContent}>
              {showMealForm || editingMealId ? (
                <MealForm
                  meal={editingMealId ? editingDay.meals.find(m => m.id === editingMealId) : undefined}
                  onSave={editingMealId ? handleEditMeal : handleAddMeal}
                  onCancel={() => {
                    setShowMealForm(false);
                    setEditingMealId(null);
                  }}
                />
              ) : (
                <>
                  {editingDay.meals.length === 0 ? (
                    <p className={styles.empty}>No meals added yet</p>
                  ) : (
                    <div className={styles.itemsList}>
                      {editingDay.meals.map((meal) => (
                        <div key={meal.id} className={styles.listItem}>
                          <div className={styles.listItemContent}>
                            <span className={styles.mealType}>{meal.type}</span>
                            <div>
                              <div className={styles.listItemName}>{meal.name}</div>
                              {meal.restaurant && (
                                <div className={styles.listItemMeta}>{meal.restaurant}</div>
                              )}
                            </div>
                          </div>
                          <div className={styles.listItemActions}>
                            <button
                              onClick={() => setEditingMealId(meal.id)}
                              className={styles.editBtn}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteMeal(meal.id)}
                              className={styles.deleteBtn}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => setShowMealForm(true)}
                    variant="outline"
                    size="sm"
                    icon={<Plus className="h-4 w-4" />}
                    className={styles.addButton}
                  >
                    Add Meal
                  </Button>
                </>
              )}
            </div>
          )}
        </section>

        {/* Accommodation Section */}
        <section className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('accommodation')}
          >
            <span>Accommodation</span>
            <ChevronDown
              className={`h-5 w-5 ${expandedSections.has('accommodation') ? styles.expanded : ''}`}
            />
          </button>

          {expandedSections.has('accommodation') && (
            <div className={styles.sectionContent}>
              {showAccommodationForm ? (
                <AccommodationForm
                  accommodation={editingDay.accommodation}
                  onSave={handleSaveAccommodation}
                  onCancel={() => setShowAccommodationForm(false)}
                />
              ) : (
                <>
                  {editingDay.accommodation ? (
                    <div className={styles.accommodationDisplay}>
                      <h4>{editingDay.accommodation.name}</h4>
                      <p className={styles.type}>{editingDay.accommodation.type}</p>
                      <p>{editingDay.accommodation.location}</p>
                      <div className={styles.buttonGroup}>
                        <button
                          onClick={() => setShowAccommodationForm(true)}
                          className={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteAccommodation}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.empty}>No accommodation specified</p>
                  )}

                  {!editingDay.accommodation && (
                    <Button
                      onClick={() => setShowAccommodationForm(true)}
                      variant="outline"
                      size="sm"
                      icon={<Plus className="h-4 w-4" />}
                      className={styles.addButton}
                    >
                      Add Accommodation
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </section>

        {/* Transportation Section */}
        <section className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('transportation')}
          >
            <span>Transportation ({editingDay.transportation.length})</span>
            <ChevronDown
              className={`h-5 w-5 ${expandedSections.has('transportation') ? styles.expanded : ''}`}
            />
          </button>

          {expandedSections.has('transportation') && (
            <div className={styles.sectionContent}>
              {showTransportationForm || editingTransportId ? (
                <TransportationForm
                  transport={editingTransportId ? editingDay.transportation.find(t => t.id === editingTransportId) : undefined}
                  onSave={editingTransportId ? handleEditTransportation : handleAddTransportation}
                  onCancel={() => {
                    setShowTransportationForm(false);
                    setEditingTransportId(null);
                  }}
                />
              ) : (
                <>
                  {editingDay.transportation.length === 0 ? (
                    <p className={styles.empty}>No transportation info added</p>
                  ) : (
                    <div className={styles.itemsList}>
                      {editingDay.transportation.map((transport) => (
                        <div key={transport.id} className={styles.listItem}>
                          <div className={styles.listItemContent}>
                            <span className={styles.transportType}>{transport.type}</span>
                            <div>
                              <div className={styles.listItemName}>{transport.description}</div>
                              <div className={styles.listItemMeta}>
                                {transport.departureLocation} → {transport.arrivalLocation}
                              </div>
                            </div>
                          </div>
                          <div className={styles.listItemActions}>
                            <button
                              onClick={() => setEditingTransportId(transport.id)}
                              className={styles.editBtn}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteTransportation(transport.id)}
                              className={styles.deleteBtn}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => setShowTransportationForm(true)}
                    variant="outline"
                    size="sm"
                    icon={<Plus className="h-4 w-4" />}
                    className={styles.addButton}
                  >
                    Add Transportation
                  </Button>
                </>
              )}
            </div>
          )}
        </section>

        {/* Gallery Section */}
        <section className={styles.section}>
          <button
            className={styles.sectionHeader}
            onClick={() => toggleSection('gallery')}
          >
            <span>Photos ({editingDay.galleryImages.length})</span>
            <ChevronDown
              className={`h-5 w-5 ${expandedSections.has('gallery') ? styles.expanded : ''}`}
            />
          </button>

          {expandedSections.has('gallery') && (
            <div className={styles.sectionContent}>
              {showGalleryManager ? (
                <GalleryManager
                  images={editingDay.galleryImages}
                  onSave={handleSaveGallery}
                  onCancel={() => setShowGalleryManager(false)}
                />
              ) : (
                <>
                  {editingDay.galleryImages.length === 0 ? (
                    <p className={styles.empty}>No photos added yet</p>
                  ) : (
                    <div className={styles.gallery}>
                      {editingDay.galleryImages.map((image) => (
                        <div key={image.id} className={styles.galleryItem}>
                          <img src={image.url} alt={image.alt} />
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => setShowGalleryManager(true)}
                    variant="outline"
                    size="sm"
                    icon={<Plus className="h-4 w-4" />}
                    className={styles.addButton}
                  >
                    Manage Gallery
                  </Button>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
