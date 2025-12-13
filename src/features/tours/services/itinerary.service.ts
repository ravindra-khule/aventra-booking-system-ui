/**
 * Itinerary Service - Handles itinerary data operations
 */

import { CompleteItinerary, ItineraryDayDetails, Activity } from '../types/itinerary.types';

export class ItineraryService {
  /**
   * Get all itineraries for a tour
   */
  static async getByTourId(tourId: string): Promise<CompleteItinerary[]> {
    // TODO: Replace with actual API call
    return [];
  }

  /**
   * Get single itinerary
   */
  static async getById(itineraryId: string): Promise<CompleteItinerary> {
    // TODO: Replace with actual API call
    return {
      id: itineraryId,
      tourId: '',
      title: '',
      days: [],
      highlights: [],
      isPublished: false,
      isSharedWithCustomers: false,
      pdfGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
  }

  /**
   * Create new itinerary
   */
  static async create(itinerary: Omit<CompleteItinerary, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<CompleteItinerary> {
    // TODO: Replace with actual API call
    return {
      ...itinerary,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
  }

  /**
   * Update itinerary
   */
  static async update(itinerary: CompleteItinerary): Promise<CompleteItinerary> {
    // TODO: Replace with actual API call
    return {
      ...itinerary,
      updatedAt: new Date().toISOString(),
      version: itinerary.version + 1
    };
  }

  /**
   * Delete itinerary
   */
  static async delete(itineraryId: string): Promise<void> {
    // TODO: Replace with actual API call
  }

  /**
   * Duplicate itinerary
   */
  static async duplicate(itineraryId: string, newTourId: string): Promise<CompleteItinerary> {
    // TODO: Replace with actual API call
    const itinerary = await this.getById(itineraryId);
    return this.create({
      ...itinerary,
      id: undefined as any,
      tourId: newTourId,
      title: `${itinerary.title} (Copy)`,
      version: undefined as any
    });
  }

  /**
   * Publish itinerary
   */
  static async publish(itineraryId: string): Promise<CompleteItinerary> {
    // TODO: Replace with actual API call
    const itinerary = await this.getById(itineraryId);
    return this.update({
      ...itinerary,
      isPublished: true
    });
  }

  /**
   * Generate PDF
   */
  static async generatePDF(itineraryId: string): Promise<string> {
    // TODO: Replace with actual API call - returns PDF URL
    return '/pdfs/itinerary.pdf';
  }

  /**
   * Share itinerary
   */
  static async share(itineraryId: string, emails: string[], options?: any): Promise<string> {
    // TODO: Replace with actual API call - returns sharing URL
    return `${window.location.origin}/itinerary/${itineraryId}/share/${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Reorder days
   */
  static reorderDays(days: ItineraryDayDetails[], sourceIndex: number, destinationIndex: number): ItineraryDayDetails[] {
    const result = Array.from(days);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    // Re-number days
    return result.map((day, index) => ({
      ...day,
      day: index + 1
    }));
  }

  /**
   * Reorder activities within a day
   */
  static reorderActivities(
    activities: Activity[],
    sourceIndex: number,
    destinationIndex: number
  ): Activity[] {
    const result = Array.from(activities);
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);
    
    // Re-order by time
    return result.sort((a, b) => {
      const timeA = parseInt(a.startTime.replace(':', ''));
      const timeB = parseInt(b.startTime.replace(':', ''));
      return timeA - timeB;
    });
  }

  /**
   * Calculate day duration (earliest to latest activity)
   */
  static calculateDayDuration(activities: Activity[]): string {
    if (activities.length === 0) return '';
    
    const times = activities.map(a => parseInt(a.startTime.replace(':', '')));
    const earliest = Math.min(...times);
    const latest = Math.max(...activities.map(a => parseInt(a.endTime.replace(':', ''))));
    
    const hours = Math.floor((latest - earliest) / 100);
    const minutes = (latest - earliest) % 100;
    
    return `${hours}h ${minutes}m`;
  }

  /**
   * Validate itinerary completeness
   */
  static validateItinerary(itinerary: CompleteItinerary): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!itinerary.title) errors.push('Itinerary title is required');
    if (itinerary.days.length === 0) errors.push('At least one day must be added');

    itinerary.days.forEach((day, index) => {
      if (!day.title) errors.push(`Day ${index + 1}: Title is required`);
      if (day.activities.length === 0) errors.push(`Day ${index + 1}: At least one activity is required`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
