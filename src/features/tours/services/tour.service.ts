/**
 * Tour Service - Tour management and retrieval
 */

import { Tour } from '../types/tour.types';
import { delay } from '../../../shared/utils/api.utils';

// Mock tour data
const MOCK_TOURS: Tour[] = [
  {
    id: '1',
    title: 'Bestig Kilimanjaro',
    shortDescription: '8 DAGAR PÅ BERGET. Vandra genom fyra klimatzoner till toppen av Afrika.',
    description: 'Vandra genom fyra klimatzoner på vår unika rutt till toppen av Afrika, Uhuru Peak 5895 m höjd. En expedition utöver det vanliga med erfarna guider.',
    price: 45900,
    depositPrice: 5000,
    currency: 'SEK',
    durationDays: 10,
    difficulty: 'Extreme',
    imageUrl: 'https://images.unsplash.com/photo-1650635462886-069f20e98033?q=80&w=1000&auto=format&fit=crop', // Kilimanjaro
    location: 'Tanzania',
    nextDate: '2026-01-24',
    availableSpots: 4
  },
  {
    id: '2',
    title: 'Langtang & Tamang Heritage',
    shortDescription: '14 DAGAR. Äkta kulturmöten och storslagna Himalayavyer.',
    description: 'Följ med Aventra på en unik vandringsresa genom Tamang Heritage och Langtangdalen. Äkta kulturmöten, storslagna Himalayavyer och svensk guide.',
    price: 40900,
    depositPrice: 4000,
    currency: 'SEK',
    durationDays: 14,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop', // Himalayas
    location: 'Nepal',
    nextDate: '2026-02-23',
    availableSpots: 0  // Fully booked for testing
  },
  {
    id: '3',
    title: 'Patagonien',
    shortDescription: '12 DAGAR. Vandra W-trek i Torres del Paine.',
    description: 'Vandra W-trek i Torres del Paine och upplev Cerro Castillo i Aysén – en resa med svensk guide och storslagna naturupplevelser.',
    price: 64900,
    depositPrice: 6000,
    currency: 'SEK',
    durationDays: 12,
    difficulty: 'Hard',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop', // Patagonia
    location: 'Chile',
    nextDate: '2026-02-25',
    availableSpots: 12
  }
];

/**
 * Tour Service
 * Handles tour-related operations
 */
export const TourService = {
  /**
   * Get all tours
   */
  getAll: async (): Promise<Tour[]> => {
    await delay(500);
    return MOCK_TOURS;
  },

  /**
   * Get a specific tour by ID
   */
  getById: async (id: string): Promise<Tour | undefined> => {
    await delay(300);
    return MOCK_TOURS.find(t => t.id === id);
  }
};
