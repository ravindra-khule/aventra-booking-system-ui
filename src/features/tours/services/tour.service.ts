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
    description: 'Följ med Swett på en unik vandringsresa genom Tamang Heritage och Langtangdalen. Äkta kulturmöten, storslagna Himalayavyer och svensk guide.',
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
  },
  {
    id: '5',
    title: 'Everest Base Camp',
    slug: 'everest-base-camp',
    shortDescription: '14 DAGAR. Vandra den unika Gokyo-rutten fram till Everest BC.',
    description: 'Vandra den unika Gokyo-rutten fram till Everest BC. Från Base Camp tar vi helikopter tillbaka ned. En expedition med svensk guide.',
    status: TourStatus.ACTIVE,
    price: 45900,
    depositPrice: 4500,
    currency: 'SEK',
    durationDays: 14,
    difficulty: TourDifficulty.HARD,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-5', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000&auto=format&fit=crop', alt: 'Everest Base Camp', isPrimary: true, order: 1 }
    ],
    location: 'Everest Region',
    country: 'Nepal',
    region: 'Himalayas',
    maxCapacity: 10,
    minCapacity: 6,
    availableSpots: 3,
    nextDate: '2026-03-23',
    categories: ['cat-1', 'cat-4'],
    tags: ['tag-1', 'tag-7', 'tag-3'],
    highlights: [
      'Trek to Everest Base Camp',
      'Gokyo Lakes circuit',
      'Helicopter return from Base Camp',
      'Incredible mountain views'
    ],
    itinerary: [],
    includedItems: [
      'Experienced guide',
      'Lodge accommodation',
      'All meals during trek',
      'Helicopter flight',
      'Permits and fees'
    ],
    excludedItems: [
      'International flights',
      'Personal porter',
      'Travel insurance',
      'Tips'
    ],
    requirements: [
      'Very good fitness level',
      'High altitude experience',
      'Medical clearance recommended'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: true,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: true,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    totalBookings: 52,
    revenue: 2386800,
    averageRating: 4.9,
    reviewCount: 48
  },
  {
    id: '6',
    title: 'Jordanien & Petra',
    slug: 'jordanien-petra',
    shortDescription: '9 DAGAR. Fantastisk ökenvandring till Petra.',
    description: 'Fantastisk ökenvandring hela vägen fram till underverket "Klippstaden Petra". Vi avslutar med härligt bad i Döda havet.',
    status: TourStatus.ACTIVE,
    price: 35900,
    depositPrice: 3500,
    currency: 'SEK',
    durationDays: 9,
    difficulty: TourDifficulty.MEDIUM,
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-6', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop', alt: 'Petra', isPrimary: true, order: 1 }
    ],
    location: 'Petra',
    country: 'Jordan',
    region: 'Middle East',
    maxCapacity: 12,
    minCapacity: 6,
    availableSpots: 5,
    nextDate: '2026-03-29',
    categories: ['cat-2', 'cat-5'],
    tags: ['tag-2', 'tag-3'],
    highlights: [
      'Visit ancient Petra',
      'Desert trekking',
      'Dead Sea floating',
      'Wadi Rum exploration'
    ],
    itinerary: [],
    includedItems: [
      'Swedish guide',
      'Hotels and camps',
      'Breakfast and dinner',
      'Entry fees',
      'Transportation'
    ],
    excludedItems: [
      'International flights',
      'Lunch (except some days)',
      'Travel insurance',
      'Personal expenses'
    ],
    requirements: [
      'Moderate fitness',
      'Desert hiking experience helpful',
      'Good heat tolerance'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: true,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: false,
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-11-22T00:00:00Z',
    totalBookings: 31,
    revenue: 1112900,
    averageRating: 4.6,
    reviewCount: 28
  },
  {
    id: '7',
    title: 'Sydafrika - Drakensberg',
    slug: 'sydafrika-drakensberg',
    shortDescription: '9 DAGAR. Vandra genom Drakensberg med kedjestegar och grottnätter.',
    description: 'Följ med Swett på en unik vandringsresa genom Drakensberg. Kedjestegar, grottnätter och Afrikas vildmark – kombinerat med kultur och komfort.',
    status: TourStatus.ACTIVE,
    price: 49900,
    depositPrice: 4900,
    currency: 'SEK',
    durationDays: 9,
    difficulty: TourDifficulty.HARD,
    imageUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-7', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1000&auto=format&fit=crop', alt: 'Drakensberg', isPrimary: true, order: 1 }
    ],
    location: 'Drakensberg',
    country: 'South Africa',
    region: 'Southern Africa',
    maxCapacity: 10,
    minCapacity: 6,
    availableSpots: 4,
    nextDate: '2026-04-09',
    categories: ['cat-1', 'cat-5'],
    tags: ['tag-4', 'tag-7', 'tag-5'],
    highlights: [
      'Chain ladders',
      'Wildflower season',
      'Mountain pools',
      'Local San culture'
    ],
    itinerary: [],
    includedItems: [
      'Expert mountain guide',
      'Accommodation in lodges',
      'All meals',
      'Park fees',
      'Equipment'
    ],
    excludedItems: [
      'International flights',
      'Travel insurance',
      'Beverages',
      'Tips'
    ],
    requirements: [
      'Good fitness',
      'Not suitable for acrophobia',
      'Multi-day hiking experience'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: false,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: true,
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    totalBookings: 24,
    revenue: 1197600,
    averageRating: 4.7,
    reviewCount: 22
  },
  {
    id: '8',
    title: 'Vandra Inkaleden',
    slug: 'vandra-inkaleden',
    shortDescription: '12 DAGAR. Vi vandrar på vår obefolkade rutt av Inkaleden.',
    description: 'Vi vandrar på vår obefolkade rutt av Inkaleden, utan trängsel, fram till slutmålet – Machu Picchu! En klassisk expedition.',
    status: TourStatus.ACTIVE,
    price: 45900,
    depositPrice: 4500,
    currency: 'SEK',
    durationDays: 12,
    difficulty: TourDifficulty.HARD,
    imageUrl: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-8', url: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?q=80&w=1000&auto=format&fit=crop', alt: 'Inca Trail', isPrimary: true, order: 1 }
    ],
    location: 'Machu Picchu',
    country: 'Peru',
    region: 'South America',
    maxCapacity: 12,
    minCapacity: 8,
    availableSpots: 6,
    nextDate: '2026-04-30',
    categories: ['cat-1', 'cat-2'],
    tags: ['tag-3', 'tag-7'],
    highlights: [
      'Inca Trail trek',
      'Machu Picchu sunrise',
      'Lesser-known route',
      'Archaeological sites'
    ],
    itinerary: [],
    includedItems: [
      'Professional guide',
      'All accommodation',
      'All meals',
      'Permits and fees',
      'Porter service'
    ],
    excludedItems: [
      'International flights',
      'Travel insurance',
      'Hot springs',
      'Tips'
    ],
    requirements: [
      'Good fitness level',
      'Altitude experience helpful',
      'Acclimatization recommended'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: true,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: true,
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2024-11-25T00:00:00Z',
    totalBookings: 67,
    revenue: 3075300,
    averageRating: 4.9,
    reviewCount: 64
  },
  {
    id: '9',
    title: 'Camino de Santiago',
    slug: 'camino-de-santiago',
    shortDescription: '8 DAGAR. Cykling på den mytomspunna pilgrimsleden.',
    description: 'Cykling på den fantastiskt vackra mytomspunna pilgrimsleden Camino de Santiago med oss! En unik cykelupplevelse.',
    status: TourStatus.ACTIVE,
    price: 21900,
    depositPrice: 2200,
    currency: 'SEK',
    durationDays: 8,
    difficulty: TourDifficulty.MEDIUM,
    imageUrl: 'https://images.unsplash.com/photo-1511575661531-b34d7da5d0bb?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-9', url: 'https://images.unsplash.com/photo-1511575661531-b34d7da5d0bb?q=80&w=1000&auto=format&fit=crop', alt: 'Camino Trail', isPrimary: true, order: 1 }
    ],
    location: 'Galicia',
    country: 'Spain',
    region: 'Europe',
    maxCapacity: 14,
    minCapacity: 8,
    availableSpots: 8,
    nextDate: '2026-05-10',
    categories: ['cat-5'],
    tags: ['tag-4', 'tag-7'],
    highlights: [
      'Historic pilgrimage route',
      'Spanish countryside',
      'Cultural towns',
      'Companionship with others'
    ],
    itinerary: [],
    includedItems: [
      'Cycling guide',
      'Hotels with breakfast',
      'Some dinners',
      'Bike rental',
      'Luggage transport'
    ],
    excludedItems: [
      'International flights',
      'Travel insurance',
      'Some meals',
      'Personal expenses'
    ],
    requirements: [
      'Basic cycling fitness',
      'Cycling experience required',
      'No extreme fitness needed'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: false,
    allowWaitlist: true,
    autoConfirm: false,
    requireApproval: false,
    createdAt: '2024-08-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    totalBookings: 44,
    revenue: 963600,
    averageRating: 4.5,
    reviewCount: 41
  },
  {
    id: '10',
    title: 'Upplev Cinque Terre',
    slug: 'upplev-cinque-terre',
    shortDescription: '5 DAGAR. Mat- och vandringsresa i Toscana och Ligurien.',
    description: 'En härlig mat- och vandringsresa i Toscana och Ligurien. Till fots upplever vi vingårdar och marmorberg. Perfekt för mat- och naturälskare.',
    status: TourStatus.ACTIVE,
    price: 19900,
    depositPrice: 2000,
    currency: 'SEK',
    durationDays: 5,
    difficulty: TourDifficulty.EASY,
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop',
    images: [
      { id: 'img-10', url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop', alt: 'Cinque Terre', isPrimary: true, order: 1 }
    ],
    location: 'Cinque Terre',
    country: 'Italy',
    region: 'Europe',
    maxCapacity: 12,
    minCapacity: 6,
    availableSpots: 9,
    nextDate: '2026-05-12',
    categories: ['cat-2', 'cat-5'],
    tags: ['tag-5', 'tag-4'],
    highlights: [
      'Coastal villages',
      'Italian cuisine',
      'Vineyard walks',
      'Seaside relaxation'
    ],
    itinerary: [],
    includedItems: [
      'Local guide',
      'Hotels in villages',
      'Most meals',
      'Wine tastings',
      'Local transportation'
    ],
    excludedItems: [
      'International flights',
      'Travel insurance',
      'Some meals',
      'Personal expenses'
    ],
    requirements: [
      'Minimal fitness',
      'Enjoy walking at own pace',
      'Love of food and wine'
    ],
    translations: [],
    defaultLanguage: 'sv',
    isFeatured: false,
    allowWaitlist: true,
    autoConfirm: true,
    requireApproval: false,
    createdAt: '2024-09-01T00:00:00Z',
    updatedAt: '2024-11-22T00:00:00Z',
    totalBookings: 29,
    revenue: 577100,
    averageRating: 4.8,
    reviewCount: 27
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
    try {
      // Fetch from PHP backend API
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      console.log('[DEBUG] API_URL:', API_URL);
      console.log('[DEBUG] ENV:', import.meta.env.VITE_REACT_APP_API_URL);
      
      // Use admin API if isAdmin flag is set, otherwise use public API
      const endpoint = filters?.isAdmin ? '/api/tours-admin-list.php' : '/api/tours.php';
      const response = await fetch(`${API_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch tours');
      }
      
      // Convert API response to Tour objects
      let result: Tour[] = data.data.map((apiTour: any) => ({
        id: apiTour.id,
        title: apiTour.title,
        slug: apiTour.slug,
        shortDescription: apiTour.shortDescription,
        description: apiTour.description,
        status: apiTour.status ? (apiTour.status as TourStatus) : TourStatus.ACTIVE,
        price: apiTour.price,
        depositPrice: apiTour.depositPrice || (apiTour.price * 0.2), // 20% deposit
        currency: apiTour.currency,
        durationDays: apiTour.durationDays,
        difficulty: apiTour.difficulty as TourDifficulty,
        imageUrl: apiTour.imageUrl,
        images: [
          { id: 'img-1', url: apiTour.imageUrl, alt: apiTour.title, isPrimary: true, order: 1 }
        ],
        location: apiTour.location,
        country: apiTour.country,
        region: apiTour.region || apiTour.location,
        maxCapacity: apiTour.maxCapacity,
        minCapacity: 1,
        availableSpots: apiTour.availableSpots,
        nextDate: apiTour.nextDate,
        categories: [],
        tags: [],
        highlights: [
          `${apiTour.durationDays} days in ${apiTour.location}`,
          `Located in ${apiTour.country}`,
          `${apiTour.difficulty} difficulty level`,
          `Starting from ${apiTour.currency} ${apiTour.price}`
        ],
        itinerary: [],
        includedItems: [],
        excludedItems: []
      }));

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
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },

  /**
   * Get a specific tour by ID
   */
  getById: async (id: string): Promise<Tour | undefined> => {
    try {
      // Fetch from PHP backend API
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      const response = await fetch(`${API_URL}/api/tour-detail.php?id=${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Tour detail API error:', data.error);
        return undefined;
      }
      
      const apiTour = data.data;
      
      // Convert API response to Tour object
      const tour: Tour = {
        id: apiTour.id,
        title: apiTour.title,
        slug: apiTour.slug,
        shortDescription: apiTour.shortDescription,
        description: apiTour.description,
        status: TourStatus.ACTIVE,
        price: apiTour.price,
        depositPrice: apiTour.depositPrice || apiTour.price * 0.2,
        currency: apiTour.currency,
        durationDays: apiTour.durationDays,
        difficulty: apiTour.difficulty as TourDifficulty,
        imageUrl: apiTour.imageUrl,
        images: [
          { id: 'img-1', url: apiTour.imageUrl, alt: apiTour.title, isPrimary: true, order: 1 }
        ],
        location: apiTour.location,
        country: apiTour.country,
        region: apiTour.region || apiTour.location,
        maxCapacity: apiTour.maxCapacity,
        minCapacity: 1,
        availableSpots: apiTour.availableSpots,
        nextDate: apiTour.nextDate,
        categories: [],
        tags: [],
        highlights: [
          `${apiTour.durationDays} days in ${apiTour.location}`,
          `Located in ${apiTour.country}`,
          `${apiTour.difficulty} difficulty level`,
          `Starting from ${apiTour.currency} ${apiTour.price}`
        ],
        itinerary: [],
        includedItems: [],
        excludedItems: []
      };
      
      return tour;
    } catch (error) {
      console.error('Error fetching tour details:', error);
      // Fallback to mock data if API fails
      return MOCK_TOURS.find(t => t.id === id);
    }
  },

  /**
   * Create a new tour
   */
  create: async (tourData: Partial<Tour>): Promise<Tour> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const payload = {
        title: tourData.title,
        slug: tourData.slug || generateSlug(tourData.title || 'New Tour'),
        imageUrl: tourData.imageUrl,
        shortDescription: tourData.shortDescription,
        description: tourData.description,
        status: tourData.status || TourStatus.ACTIVE,
        price: tourData.price || 0,
        depositPrice: tourData.depositPrice || (tourData.price || 0) * 0.2,
        currency: tourData.currency || 'USD',
        durationDays: tourData.durationDays || 1,
        difficulty: tourData.difficulty || TourDifficulty.MODERATE,
        location: tourData.location,
        country: tourData.country,
        region: tourData.region,
        maxCapacity: tourData.maxCapacity || 10,
        nextDate: tourData.nextDate || new Date().toISOString().split('T')[0]
      };

      const response = await fetch(`${API_URL}/api/tours-create.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create tour');
      }

      // Convert API response to Tour object
      const apiTour = data.data;
      const newTour: Tour = {
        id: apiTour.id,
        title: apiTour.title,
        slug: apiTour.slug,
        shortDescription: apiTour.shortDescription,
        description: apiTour.description,
        status: apiTour.status ? (apiTour.status as TourStatus) : TourStatus.ACTIVE,
        price: apiTour.price,
        depositPrice: apiTour.depositPrice,
        currency: apiTour.currency,
        durationDays: apiTour.durationDays,
        difficulty: apiTour.difficulty as TourDifficulty,
        imageUrl: apiTour.imageUrl,
        images: [
          { id: 'img-1', url: apiTour.imageUrl, alt: apiTour.title, isPrimary: true, order: 1 }
        ],
        location: apiTour.location,
        country: apiTour.country,
        region: apiTour.region || apiTour.location,
        maxCapacity: apiTour.maxCapacity,
        minCapacity: 1,
        availableSpots: apiTour.availableSpots,
        nextDate: apiTour.nextDate,
        categories: [],
        tags: [],
        highlights: [
          `${apiTour.durationDays} days in ${apiTour.location}`,
          `Located in ${apiTour.country}`,
          `${apiTour.difficulty} difficulty level`,
          `Starting from ${apiTour.currency} ${apiTour.price}`
        ],
        itinerary: [],
        includedItems: [],
        excludedItems: [],
        requirements: [],
        translations: [],
        defaultLanguage: 'sv',
        isFeatured: false,
        allowWaitlist: true,
        autoConfirm: false,
        requireApproval: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalBookings: 0,
        revenue: 0
      };

      return newTour;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  },

  /**
   * Update an existing tour
   */
  update: async (id: string, tourData: Partial<Tour>): Promise<Tour> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const payload: any = { id };
      
      if (tourData.title !== undefined) payload.title = tourData.title;
      if (tourData.slug !== undefined) payload.slug = tourData.slug;
      if (tourData.imageUrl !== undefined) payload.imageUrl = tourData.imageUrl;
      if (tourData.shortDescription !== undefined) payload.shortDescription = tourData.shortDescription;
      if (tourData.description !== undefined) payload.description = tourData.description;
      if (tourData.status !== undefined) payload.status = tourData.status;
      if (tourData.price !== undefined) payload.price = tourData.price;
      if (tourData.depositPrice !== undefined) payload.depositPrice = tourData.depositPrice;
      if (tourData.durationDays !== undefined) payload.durationDays = tourData.durationDays;
      if (tourData.difficulty !== undefined) payload.difficulty = tourData.difficulty;
      if (tourData.location !== undefined) payload.location = tourData.location;
      if (tourData.country !== undefined) payload.country = tourData.country;
      if (tourData.maxCapacity !== undefined) payload.maxCapacity = tourData.maxCapacity;
      if (tourData.nextDate !== undefined) payload.nextDate = tourData.nextDate;

      const response = await fetch(`${API_URL}/api/tours-update.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log('Tour update response status:', response.status);
      const data = await response.json();
      console.log('Tour update response data:', data);

      if (!data.success || !response.ok) {
        console.error('Tour update API error:', data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      // Convert API response to Tour object
      const apiTour = data.data;
      const tour: Tour = {
        id: apiTour.id,
        title: apiTour.title,
        slug: apiTour.slug,
        shortDescription: apiTour.shortDescription,
        description: apiTour.description,
        status: TourStatus.ACTIVE,
        price: apiTour.price,
        depositPrice: apiTour.depositPrice,
        currency: apiTour.currency,
        durationDays: apiTour.durationDays,
        difficulty: apiTour.difficulty as TourDifficulty,
        imageUrl: apiTour.imageUrl,
        images: [
          { id: 'img-1', url: apiTour.imageUrl, alt: apiTour.title, isPrimary: true, order: 1 }
        ],
        location: apiTour.location,
        country: apiTour.country,
        region: apiTour.region,
        maxCapacity: apiTour.maxCapacity,
        minCapacity: 1,
        availableSpots: apiTour.availableSpots,
        nextDate: apiTour.nextDate,
        categories: [],
        tags: [],
        highlights: [
          `${apiTour.durationDays} days in ${apiTour.location}`,
          `Located in ${apiTour.country}`,
          `${apiTour.difficulty} difficulty level`,
          `Starting from ${apiTour.currency} ${apiTour.price}`
        ],
        itinerary: [],
        includedItems: [],
        excludedItems: [],
        requirements: [],
        translations: [],
        defaultLanguage: 'sv',
        isFeatured: false,
        allowWaitlist: true,
        autoConfirm: false,
        requireApproval: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        totalBookings: 0,
        revenue: 0
      };

      return tour;
    } catch (error) {
      console.error('Error updating tour:', error);
      throw error;
    }
  },

  /**
   * Delete a tour
   */
  delete: async (id: string): Promise<void> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500') as string;
      
      const response = await fetch(`${API_URL}/api/tours-delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, _method: 'DELETE' })
      });

      console.log('Tour delete response status:', response.status);
      const data = await response.json();
      console.log('Tour delete response data:', data);

      if (!data.success || !response.ok) {
        console.error('Tour delete API error:', data);
        throw new Error(data.error || `API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      throw error;
    }
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
