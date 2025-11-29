/**
 * Tour Add-on Service
 * Handles CRUD operations for tour add-ons and extra nights
 */

import { TourAddOn, AddOnType, AddOnCategory } from '../types/tour.types';

// Mock data storage (replace with actual API calls)
const mockAddOns: TourAddOn[] = [
  {
    id: 'addon-1',
    name: 'Extra Night in Stockholm',
    description: 'Add an extra night accommodation before or after your tour in central Stockholm',
    type: AddOnType.EXTRA_NIGHT,
    category: AddOnCategory.ACCOMMODATION,
    price: 1200,
    currency: 'SEK',
    isAvailable: true,
    isMandatory: false,
    maxQuantity: 5,
    minQuantity: 1,
    tourIds: [], // Available for all tours
    pricePerPerson: true,
    displayOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addon-2',
    name: 'Travel Insurance Premium',
    description: 'Comprehensive travel insurance covering cancellation, medical emergencies, and lost luggage',
    type: AddOnType.INSURANCE,
    category: AddOnCategory.PROTECTION,
    price: 450,
    currency: 'SEK',
    isAvailable: true,
    isMandatory: false,
    maxQuantity: 1,
    minQuantity: 1,
    tourIds: [],
    pricePerPerson: true,
    displayOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addon-3',
    name: 'Hiking Equipment Rental',
    description: 'Complete hiking gear package including backpack, poles, and waterproof jacket',
    type: AddOnType.EQUIPMENT,
    category: AddOnCategory.GEAR,
    price: 800,
    currency: 'SEK',
    isAvailable: true,
    isMandatory: false,
    maxQuantity: 3,
    minQuantity: 1,
    tourIds: [],
    pricePerPerson: true,
    displayOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addon-4',
    name: 'Gourmet Dinner Package',
    description: 'Special 3-course dinner at a local restaurant during your tour',
    type: AddOnType.MEAL,
    category: AddOnCategory.FOOD_BEVERAGE,
    price: 650,
    currency: 'SEK',
    isAvailable: true,
    isMandatory: false,
    maxQuantity: 10,
    minQuantity: 1,
    tourIds: [],
    pricePerPerson: true,
    displayOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addon-5',
    name: 'Airport Transfer',
    description: 'Private transfer from airport to hotel and back',
    type: AddOnType.TRANSPORT,
    category: AddOnCategory.SERVICES,
    price: 950,
    currency: 'SEK',
    isAvailable: true,
    isMandatory: false,
    maxQuantity: 1,
    minQuantity: 1,
    tourIds: [],
    pricePerPerson: false, // Flat rate per group
    displayOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const AddOnService = {
  /**
   * Get all add-ons
   */
  async getAll(): Promise<TourAddOn[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockAddOns]);
      }, 300);
    });
  },

  /**
   * Get add-ons by tour ID
   */
  async getByTourId(tourId: string): Promise<TourAddOn[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter add-ons that are either global (empty tourIds) or specific to this tour
        const filtered = mockAddOns.filter(
          (addOn) =>
            addOn.isAvailable &&
            (addOn.tourIds.length === 0 || addOn.tourIds.includes(tourId))
        );
        resolve(filtered.sort((a, b) => a.displayOrder - b.displayOrder));
      }, 300);
    });
  },

  /**
   * Get add-on by ID
   */
  async getById(id: string): Promise<TourAddOn | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const addOn = mockAddOns.find((a) => a.id === id);
        resolve(addOn || null);
      }, 200);
    });
  },

  /**
   * Create new add-on
   */
  async create(addOn: Omit<TourAddOn, 'id' | 'createdAt' | 'updatedAt'>): Promise<TourAddOn> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAddOn: TourAddOn = {
          ...addOn,
          id: `addon-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockAddOns.push(newAddOn);
        resolve(newAddOn);
      }, 500);
    });
  },

  /**
   * Update existing add-on
   */
  async update(id: string, updates: Partial<TourAddOn>): Promise<TourAddOn | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAddOns.findIndex((a) => a.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        
        mockAddOns[index] = {
          ...mockAddOns[index],
          ...updates,
          id, // Preserve ID
          updatedAt: new Date().toISOString(),
        };
        resolve(mockAddOns[index]);
      }, 500);
    });
  },

  /**
   * Delete add-on
   */
  async delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockAddOns.findIndex((a) => a.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        mockAddOns.splice(index, 1);
        resolve(true);
      }, 500);
    });
  },

  /**
   * Calculate total price for selected add-ons
   */
  calculateAddOnsTotal(
    addOns: { addOn: TourAddOn; quantity: number }[],
    participants: number
  ): number {
    return addOns.reduce((total, { addOn, quantity }) => {
      const itemPrice = addOn.pricePerPerson
        ? addOn.price * quantity * participants
        : addOn.price * quantity;
      return total + itemPrice;
    }, 0);
  },

  /**
   * Validate add-on quantity against constraints
   */
  validateQuantity(addOn: TourAddOn, quantity: number): { isValid: boolean; message?: string } {
    if (quantity < addOn.minQuantity) {
      return {
        isValid: false,
        message: `Minimum quantity for ${addOn.name} is ${addOn.minQuantity}`,
      };
    }
    
    if (addOn.maxQuantity > 0 && quantity > addOn.maxQuantity) {
      return {
        isValid: false,
        message: `Maximum quantity for ${addOn.name} is ${addOn.maxQuantity}`,
      };
    }
    
    return { isValid: true };
  },

  /**
   * Get add-ons by category
   */
  async getByCategory(category: AddOnCategory): Promise<TourAddOn[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockAddOns.filter(
          (addOn) => addOn.category === category && addOn.isAvailable
        );
        resolve(filtered.sort((a, b) => a.displayOrder - b.displayOrder));
      }, 300);
    });
  },

  /**
   * Get add-ons by type
   */
  async getByType(type: AddOnType): Promise<TourAddOn[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockAddOns.filter(
          (addOn) => addOn.type === type && addOn.isAvailable
        );
        resolve(filtered.sort((a, b) => a.displayOrder - b.displayOrder));
      }, 300);
    });
  },
};
