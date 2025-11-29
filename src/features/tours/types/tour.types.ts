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
