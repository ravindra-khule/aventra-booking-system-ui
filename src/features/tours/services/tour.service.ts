/**
 * Tour Service - Tour management and retrieval
 */

import { Tour, TourStatus, TourDifficulty, TourCategory, TourTag } from '../types/tour.types';
import { delay } from '../../../shared/utils/api.utils';

// Helper to generate slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Mock Categories
export const MOCK_CATEGORIES: TourCategory[] = [
  { id: 'cat-1', name: 'Mountain Trekking', slug: 'mountain-trekking', description: 'High altitude mountain expeditions', color: '#3b82f6' },
  { id: 'cat-2', name: 'Cultural Tours', slug: 'cultural-tours', description: 'Immersive cultural experiences', color: '#8b5cf6' },
  { id: 'cat-3', name: 'Wildlife Safari', slug: 'wildlife-safari', description: 'Wildlife viewing adventures', color: '#10b981' },
  { id: 'cat-4', name: 'Adventure Travel', slug: 'adventure-travel', description: 'Extreme adventure activities', color: '#f59e0b' },
  { id: 'cat-5', name: 'Nature & Hiking', slug: 'nature-hiking', description: 'Nature trails and hiking', color: '#06b6d4' },
];

// Mock Tags
export const MOCK_TAGS: TourTag[] = [
  { id: 'tag-1', name: 'Summit', slug: 'summit', color: '#ef4444' },
  { id: 'tag-2', name: 'UNESCO Site', slug: 'unesco-site', color: '#8b5cf6' },
  { id: 'tag-3', name: 'Photography', slug: 'photography', color: '#ec4899' },
  { id: 'tag-4', name: 'Family Friendly', slug: 'family-friendly', color: '#10b981' },
  { id: 'tag-5', name: 'Luxury', slug: 'luxury', color: '#f59e0b' },
  { id: 'tag-6', name: 'Budget', slug: 'budget', color: '#6366f1' },
  { id: 'tag-7', name: 'Small Group', slug: 'small-group', color: '#14b8a6' },
  { id: 'tag-8', name: 'Private Tour', slug: 'private-tour', color: '#f97316' },
];

// Mock tour data with full details
let MOCK_TOURS: Tour[] = [
  {
    id: '1',
    title: 'Bestig Kilimanjaro',
    slug: 'bestig-kilimanjaro',
    shortDescription: '8 DAGAR PÅ BERGET. Vandra genom fyra klimatzoner till toppen av Afrika.',
    description: 'Vandra genom fyra klimatzoner på vår unika rutt till toppen av Afrika, Uhuru Peak 5895 m höjd. En expedition utöver det vanliga med erfarna guider.',
    status: TourStatus.ACTIVE,
    price: 45900,
    depositPrice: 5000,
    currency: 'SEK',
    durationDays: 10,
    difficulty: TourDifficulty.EXTREME,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=cropcrop',
    images: [
      { id: 'img-1', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=cropcrop', alt: 'Kilimanjaro Summit', isPrimary: true, order: 1 }
    ],
    location: 'Kilimanjaro',
    country: 'Tanzania',
    region: 'East Africa',
    maxCapacity: 12,
    minCapacity: 4,
    availableSpots: 4,
    nextDate: '2026-01-24',
    categories: ['cat-1', 'cat-4'],
    tags: ['tag-1', 'tag-7'],
    highlights: [
      'Summit Uhuru Peak at 5,895m',
      'Trek through 4 climate zones',
      'Experienced Swedish guide',
      'Small group expedition'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Moshi',
        description: 'Meet your guide and team briefing',
        activities: ['Hotel check-in', 'Equipment check', 'Welcome dinner'],
        accommodation: 'Hotel in Moshi',
        meals: ['Dinner']
      },
      {
        day: 2,
        title: 'Machame Gate to Machame Camp',
        description: 'Begin the trek through rainforest',
        activities: ['Trek to 3,000m', 'Rainforest exploration'],
        accommodation: 'Machame Camp',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        distance: '11km',
        elevation: '+1,200m'
      }
    ],
    includedItems: [
      'Professional mountain guide',
      'All meals during trek',
      'Camping equipment',
      'Park fees',
      'Airport transfers'
    ],
    excludedItems: [
      'International flights',
      'Travel insurance',
      'Personal equipment',
      'Tips for guides'
    ],
    requirements: [
      'Good physical fitness',
      'Medical clearance',
      'Travel insurance with high-altitude coverage'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: true,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    totalBookings: 45,
    revenue: 2065500,
    averageRating: 4.8,
    reviewCount: 42
  },
  {
    id: '2',
    title: 'Langtang & Tamang Heritage',
    slug: 'langtang-tamang-heritage',
    shortDescription: '14 DAGAR. Äkta kulturmöten och storslagna Himalayavyer.',
    description: 'Följ med Aventra på en unik vandringsresa genom Tamang Heritage och Langtangdalen. Äkta kulturmöten, storslagna Himalayavyer och svensk guide.',
    status: TourStatus.ACTIVE,
    price: 40900,
    depositPrice: 4000,
    currency: 'SEK',
    durationDays: 14,
    difficulty: TourDifficulty.HARD,
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop', alt: 'Langtang Valley', isPrimary: true, order: 1 }
    ],
    location: 'Langtang Valley',
    country: 'Nepal',
    region: 'Himalayas',
    maxCapacity: 12,
    minCapacity: 6,
    availableSpots: 0,
    nextDate: '2026-02-23',
    categories: ['cat-1', 'cat-2'],
    tags: ['tag-2', 'tag-3', 'tag-7'],
    highlights: [
      'Trek through Tamang villages',
      'Stunning Himalayan views',
      'Cultural immersion',
      'Visit Buddhist monasteries'
    ],
    itinerary: [],
    includedItems: [
      'Swedish speaking guide',
      'All accommodation',
      'All meals during trek',
      'Domestic flights',
      'Permits and fees'
    ],
    excludedItems: [
      'International flights',
      'Visa fees',
      'Travel insurance',
      'Personal expenses'
    ],
    requirements: [
      'Moderate to good fitness',
      'Hiking experience recommended'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: true,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
    totalBookings: 38,
    revenue: 1554200,
    averageRating: 4.9,
    reviewCount: 35
  },
  {
    id: '3',
    title: 'Patagonien',
    slug: 'patagonien',
    shortDescription: '12 DAGAR. Vandra W-trek i Torres del Paine.',
    description: 'Vandra W-trek i Torres del Paine och upplev Cerro Castillo i Aysén – en resa med svensk guide och storslagna naturupplevelser.',
    status: TourStatus.ACTIVE,
    price: 64900,
    depositPrice: 6000,
    currency: 'SEK',
    durationDays: 12,
    difficulty: TourDifficulty.HARD,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop', alt: 'Torres del Paine', isPrimary: true, order: 1 }
    ],
    location: 'Torres del Paine',
    country: 'Chile',
    region: 'Patagonia',
    maxCapacity: 10,
    minCapacity: 6,
    availableSpots: 12,
    nextDate: '2026-02-25',
    categories: ['cat-1', 'cat-5'],
    tags: ['tag-3', 'tag-5', 'tag-7'],
    highlights: [
      'W-Trek in Torres del Paine',
      'Cerro Castillo exploration',
      'Glacier viewing',
      'Luxury refugios'
    ],
    itinerary: [],
    includedItems: [
      'Expert guide',
      'Accommodation in refugios',
      'All transportation',
      'Park entrances',
      'Most meals'
    ],
    excludedItems: [
      'International flights',
      'Travel insurance',
      'Some meals in towns',
      'Personal gear'
    ],
    requirements: [
      'Good physical condition',
      'Multi-day hiking experience',
      'All-weather gear'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: true,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: false,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-11-25T00:00:00Z',
    totalBookings: 28,
    revenue: 1817200,
    averageRating: 4.7,
    reviewCount: 26
  },
  {
    id: '4',
    title: 'Safari i Serengeti',
    slug: 'safari-i-serengeti',
    shortDescription: '7 DAGAR. Upplev den stora djurvandrningen.',
    description: 'En oförglömlig safari i Serengeti National Park och Ngorongoro Crater. Bevittna den stora djurvandrningen och de fem stora.',
    status: TourStatus.DRAFT,
    price: 52900,
    depositPrice: 5000,
    currency: 'SEK',
    durationDays: 7,
    difficulty: TourDifficulty.EASY,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop', alt: 'Serengeti Wildlife', isPrimary: true, order: 1 }
    ],
    location: 'Serengeti',
    country: 'Tanzania',
    region: 'East Africa',
    maxCapacity: 8,
    minCapacity: 4,
    availableSpots: 8,
    nextDate: '2026-06-15',
    categories: ['cat-3'],
    tags: ['tag-4', 'tag-5', 'tag-3'],
    highlights: [
      'Witness the Great Migration',
      'Big Five game viewing',
      'Ngorongoro Crater',
      'Luxury lodge accommodation'
    ],
    itinerary: [],
    includedItems: [
      'Private safari vehicle',
      'Professional guide',
      'Luxury lodges',
      'All meals',
      'Park fees'
    ],
    excludedItems: [
      'International flights',
      'Visa',
      'Tips',
      'Beverages'
    ],
    requirements: [
      'No special fitness required',
      'Suitable for all ages'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: false,
    allowWaitlist: false,
    autoConfirm: true,
    requireApproval: false,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-28T00:00:00Z',
    totalBookings: 0,
    revenue: 0
  }
];

/**
 * Tour Service
 * Handles tour-related operations
 */
export const TourService = {
  /**
   * Get all tours with optional filtering
   */
  getAll: async (filters?: {
    status?: TourStatus;
    difficulty?: TourDifficulty;
    categoryId?: string;
    tagId?: string;
    search?: string;
  }): Promise<Tour[]> => {
    await delay(500);
    let result = [...MOCK_TOURS];

    if (filters) {
      if (filters.status) {
        result = result.filter(t => t.status === filters.status);
      }
      if (filters.difficulty) {
        result = result.filter(t => t.difficulty === filters.difficulty);
      }
      if (filters.categoryId) {
        result = result.filter(t => t.categories.includes(filters.categoryId));
      }
      if (filters.tagId) {
        result = result.filter(t => t.tags.includes(filters.tagId));
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(t => 
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
        );
      }
    }

    return result;
  },

  /**
   * Get a specific tour by ID
   */
  getById: async (id: string): Promise<Tour | undefined> => {
    await delay(300);
    return MOCK_TOURS.find(t => t.id === id);
  },

  /**
   * Create a new tour
   */
  create: async (tourData: Partial<Tour>): Promise<Tour> => {
    await delay(500);
    const newTour: Tour = {
      id: `tour-${Date.now()}`,
      title: tourData.title || 'New Tour',
      slug: tourData.slug || generateSlug(tourData.title || 'New Tour'),
      shortDescription: tourData.shortDescription || '',
      description: tourData.description || '',
      status: tourData.status || TourStatus.DRAFT,
      price: tourData.price || 0,
      depositPrice: tourData.depositPrice || 0,
      currency: tourData.currency || 'SEK',
      durationDays: tourData.durationDays || 1,
      difficulty: tourData.difficulty || TourDifficulty.MEDIUM,
      imageUrl: tourData.imageUrl || '',
      images: tourData.images || [],
      location: tourData.location || '',
      country: tourData.country || '',
      region: tourData.region,
      maxCapacity: tourData.maxCapacity || 10,
      minCapacity: tourData.minCapacity || 4,
      availableSpots: tourData.availableSpots || 10,
      nextDate: tourData.nextDate || new Date().toISOString().split('T')[0],
      categories: tourData.categories || [],
      tags: tourData.tags || [],
      highlights: tourData.highlights || [],
      itinerary: tourData.itinerary || [],
      includedItems: tourData.includedItems || [],
      excludedItems: tourData.excludedItems || [],
      requirements: tourData.requirements || [],
      translations: tourData.translations || [],
      defaultLanguage: tourData.defaultLanguage || 'sv',
      isFeatured: tourData.isFeatured || false,
      allowWaitlist: tourData.allowWaitlist !== undefined ? tourData.allowWaitlist : true,
      autoConfirm: tourData.autoConfirm || false,
      requireApproval: tourData.requireApproval !== undefined ? tourData.requireApproval : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBookings: 0,
      revenue: 0
    };

    MOCK_TOURS.push(newTour);
    return newTour;
  },

  /**
   * Update an existing tour
   */
  update: async (id: string, tourData: Partial<Tour>): Promise<Tour> => {
    await delay(500);
    const index = MOCK_TOURS.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tour with ID ${id} not found`);
    }

    const updatedTour = {
      ...MOCK_TOURS[index],
      ...tourData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    MOCK_TOURS[index] = updatedTour;
    return updatedTour;
  },

  /**
   * Delete a tour
   */
  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = MOCK_TOURS.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Tour with ID ${id} not found`);
    }
    MOCK_TOURS.splice(index, 1);
  },

  /**
   * Duplicate a tour
   */
  duplicate: async (id: string): Promise<Tour> => {
    await delay(500);
    const original = MOCK_TOURS.find(t => t.id === id);
    if (!original) {
      throw new Error(`Tour with ID ${id} not found`);
    }

    const duplicated: Tour = {
      ...original,
      id: `tour-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: TourStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalBookings: 0,
      revenue: 0
    };

    MOCK_TOURS.push(duplicated);
    return duplicated;
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<TourCategory[]> => {
    await delay(200);
    return MOCK_CATEGORIES;
  },

  /**
   * Get all tags
   */
  getTags: async (): Promise<TourTag[]> => {
    await delay(200);
    return MOCK_TAGS;
  }
};
