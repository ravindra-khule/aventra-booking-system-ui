/**
 * Customer Group Service - Group management and business logic
 */

import {
  CustomerGroup,
  GroupAnalytics,
  BulkActionRequest,
  GroupExportData,
  SmartGroupRule,
  GroupPricingRule,
} from '../types/group.types';
import { Customer } from '../types/customer.types';
import { Booking } from '../../bookings/types/booking.types';
import { delay } from '../../../shared/utils/api.utils';

// Mock data store
let MOCK_GROUPS: CustomerGroup[] = [
  {
    id: 'g-001',
    name: 'VIP Customers',
    description: 'High-value customers with premium bookings',
    type: 'manual',
    memberIds: ['c-001', 'c-002'],
    memberCount: 2,
    pricingRules: [
      {
        id: 'pr-001',
        tourId: 't-001',
        discountType: 'percentage',
        discountValue: 15,
        description: 'VIP discount on premium tours',
      },
    ],
    defaultDiscount: { type: 'percentage', value: 10 },
    tags: ['premium', 'high-value'],
    color: '#FFD700',
    createdDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedDate: new Date().toISOString(),
    createdBy: 'admin',
    isActive: true,
    stats: {
      totalRevenue: 45000,
      avgBookingValue: 2500,
      avgBookingsPerMember: 5.5,
      lastActivityDate: new Date().toISOString(),
    },
  },
  {
    id: 'g-002',
    name: 'Frequent Travelers',
    description: 'Customers with 3+ bookings in the last year',
    type: 'smart',
    memberIds: ['c-001', 'c-003', 'c-004'],
    memberCount: 3,
    smartRules: [
      {
        id: 'r-001',
        field: 'totalBookings',
        operator: 'gte',
        value: 3,
      },
    ],
    pricingRules: [],
    defaultDiscount: { type: 'percentage', value: 8 },
    tags: ['active', 'loyal'],
    color: '#4CAF50',
    createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedDate: new Date().toISOString(),
    createdBy: 'admin',
    isActive: true,
    stats: {
      totalRevenue: 72000,
      avgBookingValue: 1800,
      avgBookingsPerMember: 4.2,
      lastActivityDate: new Date().toISOString(),
    },
  },
];

/**
 * Evaluate if a customer matches smart group rules
 */
const evaluateRules = (customer: Customer, rules: SmartGroupRule[]): boolean => {
  if (rules.length === 0) return false;

  return rules.every((rule) => {
    const fieldValue = (customer as any)[rule.field];

    switch (rule.operator) {
      case 'equals':
        return fieldValue === rule.value;
      case 'contains':
        return String(fieldValue).includes(String(rule.value));
      case 'gt':
        return fieldValue > rule.value;
      case 'lt':
        return fieldValue < rule.value;
      case 'gte':
        return fieldValue >= rule.value;
      case 'lte':
        return fieldValue <= rule.value;
      case 'between':
        if (typeof rule.value === 'object' && 'min' in rule.value) {
          return fieldValue >= rule.value.min && fieldValue <= rule.value.max;
        }
        return false;
      case 'in':
        if (Array.isArray(rule.value)) {
          return rule.value.includes(fieldValue);
        }
        return false;
      default:
        return false;
    }
  });
};

/**
 * Customer Group Service
 */
export const CustomerGroupService = {
  /**
   * Get all customer groups
   */
  getAll: async (): Promise<CustomerGroup[]> => {
    await delay(400);
    return [...MOCK_GROUPS];
  },

  /**
   * Get a specific group by ID
   */
  getById: async (id: string): Promise<CustomerGroup | undefined> => {
    await delay(300);
    return MOCK_GROUPS.find((g) => g.id === id);
  },

  /**
   * Create a new customer group
   */
  create: async (data: Omit<CustomerGroup, 'id' | 'createdDate' | 'updatedDate' | 'stats' | 'createdBy'>): Promise<CustomerGroup> => {
    await delay(500);

    const newGroup: CustomerGroup = {
      ...data,
      id: `g-${Date.now()}`,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      createdBy: 'admin',
      stats: {
        totalRevenue: 0,
        avgBookingValue: 0,
        avgBookingsPerMember: 0,
      },
    };

    MOCK_GROUPS.push(newGroup);
    return newGroup;
  },

  /**
   * Update an existing group
   */
  update: async (id: string, updates: Partial<Omit<CustomerGroup, 'id' | 'createdDate'>>): Promise<CustomerGroup> => {
    await delay(400);

    const groupIndex = MOCK_GROUPS.findIndex((g) => g.id === id);
    if (groupIndex === -1) throw new Error('Group not found');

    const updated: CustomerGroup = {
      ...MOCK_GROUPS[groupIndex],
      ...updates,
      id: MOCK_GROUPS[groupIndex].id,
      createdDate: MOCK_GROUPS[groupIndex].createdDate,
      updatedDate: new Date().toISOString(),
    };

    MOCK_GROUPS[groupIndex] = updated;
    return updated;
  },

  /**
   * Delete a group
   */
  delete: async (id: string): Promise<void> => {
    await delay(300);
    MOCK_GROUPS = MOCK_GROUPS.filter((g) => g.id !== id);
  },

  /**
   * Add members to a group
   */
  addMembers: async (groupId: string, memberIds: string[]): Promise<CustomerGroup> => {
    await delay(400);

    const group = MOCK_GROUPS.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    const newMemberIds = Array.from(new Set([...group.memberIds, ...memberIds]));

    return CustomerGroupService.update(groupId, {
      memberIds: newMemberIds,
      memberCount: newMemberIds.length,
    });
  },

  /**
   * Remove members from a group
   */
  removeMembers: async (groupId: string, memberIds: string[]): Promise<CustomerGroup> => {
    await delay(400);

    const group = MOCK_GROUPS.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    const newMemberIds = group.memberIds.filter((id) => !memberIds.includes(id));

    return CustomerGroupService.update(groupId, {
      memberIds: newMemberIds,
      memberCount: newMemberIds.length,
    });
  },

  /**
   * Apply smart segmentation based on rules
   */
  applySmartSegmentation: async (groupId: string): Promise<CustomerGroup> => {
    await delay(600);

    const group = MOCK_GROUPS.find((g) => g.id === groupId);
    if (!group || !group.smartRules) throw new Error('Group not found or not a smart group');

    // Import customer service to get all customers
    const { CustomerService } = await import('./customer.service');
    const customers = await CustomerService.getAll();

    // Evaluate rules for each customer
    const matchingMemberIds = customers
      .filter((customer) => evaluateRules(customer, group.smartRules || []))
      .map((customer) => customer.id);

    return CustomerGroupService.update(groupId, {
      memberIds: matchingMemberIds,
      memberCount: matchingMemberIds.length,
    });
  },

  /**
   * Get group analytics
   */
  getAnalytics: async (groupId: string): Promise<GroupAnalytics> => {
    await delay(500);

    const group = MOCK_GROUPS.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    // Import services to get related data
    const { CustomerService } = await import('./customer.service');
    const { BookingService } = await import('../../bookings/services/booking.service');

    const members = (await Promise.all(group.memberIds.map((id) => CustomerService.getById(id)))).filter(
      (m) => m !== undefined
    ) as Customer[];

    const allBookings = await BookingService.getAll();
    const groupBookings = allBookings.filter((b) => group.memberIds.includes(b.customerId));

    const totalRevenue = group.stats.totalRevenue;
    const bookingCount = groupBookings.length;
    const avgBookingValue = bookingCount > 0 ? totalRevenue / bookingCount : 0;
    const avgRevenuePerMember = group.memberCount > 0 ? totalRevenue / group.memberCount : 0;

    return {
      groupId,
      groupName: group.name,
      memberCount: group.memberCount,
      totalRevenue,
      avgRevenuePerMember,
      bookingCount,
      avgBookingValue,
      conversionRate: (bookingCount / group.memberCount) * 100,
      customerLifetimeValue: avgRevenuePerMember,
      churnRate: 5, // Mock value
      topDestinations: [
        { tourId: 't-001', bookingCount: 12, revenue: 24000 },
        { tourId: 't-002', bookingCount: 8, revenue: 16000 },
        { tourId: 't-003', bookingCount: 5, revenue: 10000 },
      ],
      growthTrend: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], memberCount: group.memberCount - 5, revenue: totalRevenue - 5000 },
        { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], memberCount: group.memberCount - 2, revenue: totalRevenue - 2000 },
        { date: new Date().toISOString().split('T')[0], memberCount: group.memberCount, revenue: totalRevenue },
      ],
    };
  },

  /**
   * Export group data
   */
  exportGroup: async (groupId: string): Promise<GroupExportData> => {
    await delay(400);

    const group = MOCK_GROUPS.find((g) => g.id === groupId);
    if (!group) throw new Error('Group not found');

    const { CustomerService } = await import('./customer.service');
    const members = (await Promise.all(group.memberIds.map((id) => CustomerService.getById(id)))).filter(
      (m) => m !== undefined
    ) as Customer[];

    return {
      groupId: group.id,
      groupName: group.name,
      description: group.description || '',
      memberCount: group.memberCount,
      members: members.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        email: m.email,
        totalSpent: m.totalSpent,
        bookingCount: m.totalBookings,
      })),
      pricingRules: group.pricingRules,
      tags: group.tags,
      exportDate: new Date().toISOString(),
    };
  },

  /**
   * Perform bulk actions on groups
   */
  bulkAction: async (request: BulkActionRequest): Promise<void> => {
    await delay(500);

    for (const groupId of request.groupIds) {
      const group = MOCK_GROUPS.find((g) => g.id === groupId);
      if (!group) continue;

      switch (request.action) {
        case 'activate':
          group.isActive = true;
          break;
        case 'deactivate':
          group.isActive = false;
          break;
        case 'delete':
          MOCK_GROUPS = MOCK_GROUPS.filter((g) => g.id !== groupId);
          break;
        case 'addTag':
          if (request.payload?.tag && !group.tags.includes(request.payload.tag)) {
            group.tags.push(request.payload.tag);
          }
          break;
        case 'applyDiscount':
          if (request.payload?.discountType && request.payload?.discountValue !== undefined) {
            group.defaultDiscount = {
              type: request.payload.discountType,
              value: request.payload.discountValue,
            };
          }
          break;
      }
    }
  },

  /**
   * Search groups by criteria
   */
  search: async (query: string): Promise<CustomerGroup[]> => {
    await delay(300);

    const lowerQuery = query.toLowerCase();
    return MOCK_GROUPS.filter(
      (g) =>
        g.name.toLowerCase().includes(lowerQuery) ||
        g.description?.toLowerCase().includes(lowerQuery) ||
        g.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
};
