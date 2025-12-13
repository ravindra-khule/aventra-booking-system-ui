/**
 * Itinerary Builder - Main component for building itineraries
 */

import React, { useState, useCallback } from 'react';
import { CompleteItinerary, ItineraryDayDetails } from '../types/itinerary.types';
import { ItineraryService } from '../services/itinerary.service';
import { Button } from '../../../shared/components/ui';
import {
  Plus, Save, Download, Share2, Eye, ChevronDown, ChevronUp,
  Calendar, MapPin, Users, Clock, AlertCircle, Trash2, Copy,
  FileText, MoreVertical
} from 'lucide-react';
import { ItineraryDayCard } from './itinerary/ItineraryDayCard';
import { ItineraryDayBuilder } from './itinerary/ItineraryDayBuilder';
import { ItineraryShareModal } from './itinerary/ItineraryShareModal';
import { ItineraryPreview } from './itinerary/ItineraryPreview';
import styles from './ItineraryBuilder.module.css';

interface ItineraryBuilderProps {
  tourId: string;
  tourTitle: string;
  durationDays: number;
  onBack: () => void;
  onSave: (itinerary: CompleteItinerary) => void;
}

type ViewMode = 'builder' | 'preview';

export const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({
  tourId,
  tourTitle,
  durationDays,
  onBack,
  onSave
}) => {
  const [itinerary, setItinerary] = useState<CompleteItinerary>({
    id: Math.random().toString(36).substr(2, 9),
    tourId,
    title: `${tourTitle} Itinerary`,
    description: '',
    days: Array.from({ length: durationDays }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      day: i + 1,
      title: `Day ${i + 1}`,
      description: '',
      activities: [],
      meals: [],
      transportation: [],
      galleryImages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    highlights: [],
    isPublished: false,
    isSharedWithCustomers: false,
    pdfGenerated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  });

  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const toggleDayExpansion = useCallback((dayNumber: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  }, []);

  const updateDay = useCallback((dayId: string, updatedDay: ItineraryDayDetails) => {
    setItinerary(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId ? updatedDay : d),
      updatedAt: new Date().toISOString()
    }));
    setEditingDayId(null);
  }, []);

  const addDay = useCallback(() => {
    const newDay: ItineraryDayDetails = {
      id: Math.random().toString(36).substr(2, 9),
      day: itinerary.days.length + 1,
      title: `Day ${itinerary.days.length + 1}`,
      description: '',
      activities: [],
      meals: [],
      transportation: [],
      galleryImages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setItinerary(prev => ({
      ...prev,
      days: [...prev.days, newDay],
      updatedAt: new Date().toISOString()
    }));

    setExpandedDays(prev => new Set([...prev, newDay.day]));
  }, [itinerary.days.length]);

  const deleteDay = useCallback((dayId: string) => {
    if (itinerary.days.length <= 1) {
      alert('You must have at least one day in the itinerary');
      return;
    }

    setItinerary(prev => ({
      ...prev,
      days: prev.days
        .filter(d => d.id !== dayId)
        .map((d, index) => ({ ...d, day: index + 1 })),
      updatedAt: new Date().toISOString()
    }));
  }, [itinerary.days.length]);

  const duplicateDay = useCallback((dayId: string) => {
    const dayToDuplicate = itinerary.days.find(d => d.id === dayId);
    if (!dayToDuplicate) return;

    const newDay: ItineraryDayDetails = {
      ...JSON.parse(JSON.stringify(dayToDuplicate)),
      id: Math.random().toString(36).substr(2, 9),
      day: itinerary.days.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setItinerary(prev => ({
      ...prev,
      days: [...prev.days, newDay],
      updatedAt: new Date().toISOString()
    }));

    setExpandedDays(prev => new Set([...prev, newDay.day]));
  }, [itinerary.days]);

  const handleSave = async () => {
    // Validate itinerary
    const validation = ItineraryService.validateItinerary(itinerary);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setIsSaving(true);
    try {
      const savedItinerary = await ItineraryService.create({
        ...itinerary,
        id: undefined as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: undefined as any
      });
      onSave(savedItinerary);
    } catch (error) {
      console.error('Failed to save itinerary:', error);
      alert('Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const pdfUrl = await ItineraryService.generatePDF(itinerary.id);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  const handleShare = async (emails: string[], options: any) => {
    try {
      const shareUrl = await ItineraryService.share(itinerary.id, emails, options);
      setShowShareModal(false);
      alert(`Itinerary shared successfully!\nShare URL: ${shareUrl}`);
    } catch (error) {
      console.error('Failed to share itinerary:', error);
      alert('Failed to share itinerary');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>{itinerary.title}</h1>
            <p className={styles.subtitle}>{tourTitle} • {itinerary.days.length} days</p>
          </div>
          <div className={styles.viewToggle}>
            <button
              onClick={() => setViewMode('builder')}
              className={`${styles.toggleButton} ${viewMode === 'builder' ? styles.active : ''}`}
            >
              <FileText className="h-4 w-4" />
              Builder
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`${styles.toggleButton} ${viewMode === 'preview' ? styles.active : ''}`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionBar}>
          <Button onClick={onBack} variant="ghost" size="sm">
            Back
          </Button>
          <div className={styles.actionButtons}>
            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              size="sm"
              icon={<Download className="h-4 w-4" />}
              disabled={isSaving}
            >
              PDF
            </Button>
            <Button
              onClick={() => setShowShareModal(true)}
              variant="outline"
              size="sm"
              icon={<Share2 className="h-4 w-4" />}
              disabled={isSaving}
            >
              Share
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              size="sm"
              icon={<Save className="h-4 w-4" />}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className={styles.errorAlert}>
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3>Validation Errors</h3>
            <ul>
              {validationErrors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'builder' ? (
        <div className={styles.builderContent}>
          {/* Itinerary Settings */}
          <div className={styles.settingsPanel}>
            <h2>Itinerary Information</h2>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                value={itinerary.title}
                onChange={(e) => setItinerary(prev => ({ ...prev, title: e.target.value }))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={itinerary.description || ''}
                onChange={(e) => setItinerary(prev => ({ ...prev, description: e.target.value }))}
                className={styles.textarea}
                rows={3}
              />
            </div>
          </div>

          {/* Days */}
          <div className={styles.daysContainer}>
            <div className={styles.daysHeader}>
              <h2>Days ({itinerary.days.length})</h2>
              <Button
                onClick={addDay}
                variant="outline"
                size="sm"
                icon={<Plus className="h-4 w-4" />}
              >
                Add Day
              </Button>
            </div>

            <div className={styles.daysList}>
              {itinerary.days.map((day) => (
                <div key={day.id} className={styles.dayItem}>
                  {editingDayId === day.id ? (
                    <ItineraryDayBuilder
                      day={day}
                      onSave={(updatedDay) => updateDay(day.id, updatedDay)}
                      onCancel={() => setEditingDayId(null)}
                    />
                  ) : (
                    <>
                      <div
                        className={styles.dayCardHeader}
                        onClick={() => toggleDayExpansion(day.day)}
                      >
                        <div className={styles.dayInfo}>
                          <div className={styles.dayNumber}>Day {day.day}</div>
                          <div className={styles.dayTitle}>{day.title}</div>
                          <div className={styles.dayMeta}>
                            {day.activities.length} activities
                            {day.accommodation && ' • Accommodation'}
                            {day.meals.length > 0 && ` • ${day.meals.length} meals`}
                          </div>
                        </div>
                        <div className={styles.dayActions}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDayId(day.id);
                            }}
                            className={styles.actionBtn}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateDay(day.id);
                            }}
                            className={styles.actionBtn}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete ${day.title}?`)) {
                                deleteDay(day.id);
                              }
                            }}
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            className={styles.expandBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDayExpansion(day.day);
                            }}
                          >
                            {expandedDays.has(day.day) ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedDays.has(day.day) && (
                        <ItineraryDayCard day={day} />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ItineraryPreview itinerary={itinerary} />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ItineraryShareModal
          itineraryTitle={itinerary.title}
          onShare={handleShare}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};
