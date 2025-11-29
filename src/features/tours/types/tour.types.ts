/**
 * Tour Types - Tour management and display
 */

export interface Tour {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  depositPrice: number; // Added for partial payments
  currency: string;
  durationDays: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  imageUrl: string;
  location: string;
  nextDate: string;
  availableSpots: number;
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
