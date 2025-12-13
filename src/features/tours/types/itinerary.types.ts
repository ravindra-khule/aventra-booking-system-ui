/**
 * Itinerary Types - Enhanced itinerary builder and day-by-day planning
 */

// GPS Coordinates
export interface GpsCoordinates {
  latitude: number;
  longitude: number;
}

// Location with mapping
export interface ItineraryLocation {
  id: string;
  name: string;
  description?: string;
  coordinates?: GpsCoordinates;
  address?: string;
  city?: string;
  country?: string;
  mapUrl?: string;
  order: number;
}

// Meal information
export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  restaurant?: string;
  location?: string;
  included: boolean; // Whether included in tour price
  dietaryOptions?: string[];
}

// Accommodation details
export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'lodge' | 'resort' | 'camp' | 'guesthouse' | 'apartment' | 'other';
  location: string;
  description?: string;
  address?: string;
  amenities: string[];
  roomType?: string;
  checkInTime?: string;
  checkOutTime?: string;
  contactInfo?: string;
  website?: string;
  imageUrl?: string;
}

// Transportation segment
export interface Transportation {
  id: string;
  type: 'flight' | 'bus' | 'train' | 'car' | 'boat' | 'cable_car' | 'hiking' | 'other';
  description: string;
  departureLocation: string;
  arrivalLocation: string;
  departureTime?: string;
  arrivalTime?: string;
  duration?: string;
  distance?: string;
  provider?: string;
  bookingReference?: string;
  notes?: string;
  includedInPrice: boolean;
}

// Activity details
export interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'hiking' | 'sightseeing' | 'cultural' | 'adventure' | 'relaxation' | 'wildlife' | 'water' | 'food' | 'other';
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location?: string;
  difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme';
  physicalLevel?: 'low' | 'moderate' | 'high';
  durationMinutes?: number;
  guide?: string;
  groupSize?: number;
  costPerPerson?: number;
  included: boolean;
  equipment?: string[];
  notes?: string;
  mandatory: boolean; // Whether required for tour completion
  order: number;
}

// Photo/Gallery item
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  photographer?: string;
  tags?: string[];
}

// Complete day itinerary
export interface ItineraryDayDetails {
  id: string;
  day: number;
  title: string;
  description: string;
  highlightText?: string;
  
  // Activities
  activities: Activity[];
  
  // Location
  location?: ItineraryLocation;
  additionalLocations?: ItineraryLocation[];
  
  // Meals
  meals: Meal[];
  
  // Accommodation
  accommodation?: Accommodation;
  
  // Transportation
  transportation: Transportation[];
  
  // Media
  galleryImages: GalleryImage[];
  
  // Metadata
  distance?: string; // Total distance for the day
  elevation?: string; // Total elevation gain
  weatherInfo?: string;
  bestTimeToVisit?: string;
  notes?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Complete itinerary
export interface CompleteItinerary {
  id: string;
  tourId: string;
  title: string;
  description?: string;
  
  // Days
  days: ItineraryDayDetails[];
  
  // Overall info
  totalDistance?: string;
  totalElevation?: string;
  highlights: string[];
  
  // Sharing & Publishing
  isPublished: boolean;
  isSharedWithCustomers: boolean;
  sharingUrl?: string;
  
  // PDF
  pdfGenerated: boolean;
  pdfUrl?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

// Drag-and-drop state
export interface DraggedActivity {
  sourceDay: number;
  activityId: string;
  activity: Activity;
}

// Share options
export interface ItineraryShareOptions {
  shareWithEmail: string[];
  shareWithCustomers: boolean;
  allowDownload: boolean;
  allowPrint: boolean;
  expiresAt?: string;
  accessCode?: string;
  publicShare: boolean;
}
