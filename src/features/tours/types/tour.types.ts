/**
 * Tour Types - Tour management and display
 */

// Tour Status
export enum TourStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

// Tour Difficulty
export enum TourDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXTREME = 'Extreme'
}

// Multi-language content
export interface TourTranslation {
  language: 'en' | 'sv';
  title: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  includedItems: string[];
  excludedItems: string[];
  requirements: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

// Itinerary Day
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals?: string[];
  distance?: string;
  elevation?: string;
}

// Tour Category
export interface TourCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

// Tour Tag
export interface TourTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

// Tour Image
export interface TourImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
}

// Main Tour Interface
export interface Tour {
  id: string;
  
  // Basic Info
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: TourStatus;
  
  // Pricing
  price: number;
  depositPrice: number;
  currency: string;
  
  // Trip Details
  durationDays: number;
  difficulty: TourDifficulty;
  location: string;
  country: string;
  region?: string;
  
  // Capacity & Availability
  maxCapacity: number;
  minCapacity: number;
  availableSpots: number;
  nextDate: string;
  
  // Media
  imageUrl: string; // Primary image
  images: TourImage[];
  videoUrl?: string;
  galleryImages?: string[];
  
  // Categorization
  categories: string[]; // Category IDs
  tags: string[]; // Tag IDs
  
  // Content
  highlights: string[];
  itinerary: ItineraryDay[];
  includedItems: string[];
  excludedItems: string[];
  requirements: string[];
  
  // Multi-language
  translations: TourTranslation[];
  defaultLanguage: 'en' | 'sv';
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  
  // Settings
  isFeatured: boolean;
  allowWaitlist: boolean;
  autoConfirm: boolean;
  requireApproval: boolean;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  
  // Statistics (read-only)
  totalBookings?: number;
  revenue?: number;
  averageRating?: number;
  reviewCount?: number;
}

/**
 * Tour Add-on Types
 */

// Add-on type enum
export enum AddOnType {
  EXTRA_NIGHT = 'EXTRA_NIGHT',
  INSURANCE = 'INSURANCE',
  EQUIPMENT = 'EQUIPMENT',
  MEAL = 'MEAL',
  ACTIVITY = 'ACTIVITY',
  TRANSPORT = 'TRANSPORT',
  OTHER = 'OTHER'
}

// Add-on category enum
export enum AddOnCategory {
  ACCOMMODATION = 'ACCOMMODATION',
  PROTECTION = 'PROTECTION',
  GEAR = 'GEAR',
  FOOD_BEVERAGE = 'FOOD_BEVERAGE',
  EXPERIENCES = 'EXPERIENCES',
  SERVICES = 'SERVICES'
}

// Tour Add-on interface
export interface TourAddOn {
  id: string;
  name: string;
  description: string;
  type: AddOnType;
  category: AddOnCategory;
  price: number;
  currency: string;
  imageUrl?: string;
  
  // Availability & Restrictions
  isAvailable: boolean;
  isMandatory: boolean; // Some add-ons might be required
  maxQuantity: number; // Maximum quantity per booking (0 = unlimited)
  minQuantity: number; // Minimum quantity if selected
  
  // Tour associations
  tourIds: string[]; // Array of tour IDs this add-on applies to (empty = all tours)
  
  // Additional info
  includedInPrice?: boolean; // Already included in base tour price
  pricePerPerson?: boolean; // Price is per person or flat rate
  availableFrom?: string; // Date from which add-on is available
  availableTo?: string; // Date until which add-on is available
  
  // Metadata
  displayOrder: number; // Order in which to display
  createdAt: string;
  updatedAt: string;
}

// Selected add-on in a booking (with quantity)
export interface SelectedAddOn {
  addOnId: string;
  addOn: TourAddOn; // Full add-on details
  quantity: number;
  totalPrice: number; // Calculated: price * quantity (* participants if pricePerPerson)
}
