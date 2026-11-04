/**
 * Customer Group Service - Group management and business logic
 * Calls real backend APIs for group CRUD operations
 */

import {
  CustomerGroup,
  GroupAnalytics,
  BulkActionRequest,
  GroupExportData,
  SmartGroupRule,
} from '../types/group.types';
import { Customer } from '../types/customer.types';

const API_BASE = () => (import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5500') as string;

const parseJson = <T>(value: T | string | null | undefined, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch {
      return fallback;
    }
  }
  return value;
};

/**
 * Map API response (snake_case) to camelCase CustomerGroup type
 */
const mapGroupFromApi = (data: any): CustomerGroup => {
  const memberIds = parseJson<string[]>(data.member_ids ?? data.memberIds, []);
  return {
    id: String(data.id),
    name: data.name,
    description: data.description || '',
    type: data.type === 'smart' ? 'smart' : 'manual',
    memberIds: memberIds.map(String),
    memberCount: data.member_count ?? memberIds.length,
    smartRules: parseJson(data.smart_rules ?? data.smartRules, undefined as any) || undefined,
    pricingRules: parseJson(data.pricing_rules ?? data.pricingRules, []),
    defaultDiscount: parseJson(data.default_discount ?? data.defaultDiscount, undefined as any) || undefined,
    tags: parseJson<string[]>(data.tags, []),
    color: data.color || undefined,
    createdDate: data.created_at || data.createdDate || new Date().toISOString(),
    updatedDate: data.updated_at || data.updatedDate || new Date().toISOString(),
    createdBy: data.created_by || data.createdBy || 'admin',
    isActive: data.is_active !== undefined ? Boolean(data.is_active) : (data.isActive !== undefined ? Boolean(data.isActive) : true),
    stats: parseJson(data.stats, {
      totalRevenue: 0,
      avgBookingValue: 0,
      avgBookingsPerMember: 0,
    }),
  };
};

const request = async (path: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(`${API_BASE()}/api/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.error || `Request failed: ${response.status} ${response.statusText}`);
  }

  return result;
};

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
    try {
      const result = await request('customer-groups-list.php');
      return (result.data || []).map(mapGroupFromApi);
    } catch (error) {
      console.error('Error fetching customer groups:', error);
      return [];
    }
  },

  /**
   * Get a specific group by ID
   */
  getById: async (id: string): Promise<CustomerGroup | undefined> => {
    try {
      const result = await request(`customer-groups-get.php?id=${encodeURIComponent(id)}`);
      return result.data ? mapGroupFromApi(result.data) : undefined;
    } catch (error) {
      console.error('Error fetching group:', error);
      return undefined;
    }
  },

  /**
   * Create a new customer group
   */
  create: async (data: Omit<CustomerGroup, 'id' | 'createdDate' | 'updatedDate' | 'stats' | 'createdBy'>): Promise<CustomerGroup> => {
    const payload = {
      name: data.name,
      description: data.description,
      type: data.type,
      memberIds: data.memberIds || [],
      smartRules: data.smartRules,
      pricingRules: data.pricingRules || [],
      defaultDiscount: data.defaultDiscount,
      tags: data.tags || [],
      color: data.color,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    const result = await request('customer-groups-create.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapGroupFromApi(result.data);
  },

  /**
   * Update an existing group
   */
  update: async (id: string, updates: Partial<Omit<CustomerGroup, 'id' | 'createdDate'>>): Promise<CustomerGroup> => {
    const payload: any = { id };

    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.memberIds !== undefined) payload.memberIds = updates.memberIds;
    if (updates.smartRules !== undefined) payload.smartRules = updates.smartRules;
    if (updates.pricingRules !== undefined) payload.pricingRules = updates.pricingRules;
    if (updates.defaultDiscount !== undefined) payload.defaultDiscount = updates.defaultDiscount;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.color !== undefined) payload.color = updates.color;
    if (updates.isActive !== undefined) payload.isActive = updates.isActive;
    if (updates.createdBy !== undefined) payload.createdBy = updates.createdBy;

    const result = await request('customer-groups-update.php', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return mapGroupFromApi(result.data);
  },

  /**
   * Delete a group
   */
  delete: async (id: string): Promise<void> => {
    await request('customer-groups-delete.php', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },

  /**
   * Add members to a group
   */
  addMembers: async (groupId: string, memberIds: string[]): Promise<CustomerGroup> => {
    const group = await CustomerGroupService.getById(groupId);
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
    const group = await CustomerGroupService.getById(groupId);
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
    const group = await CustomerGroupService.getById(groupId);
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
    const group = await CustomerGroupService.getById(groupId);
    if (!group) throw new Error('Group not found');

    // Import services to get related data
    const { CustomerService } = await import('./customer.service');
    const { BookingService } = await import('../../bookings/services/booking.service');

    const customers = await CustomerService.getAll();
    const members = customers.filter((c) => group.memberIds.includes(c.id));

    const allBookings = await BookingService.getAll();
    const groupBookings = allBookings.filter((b) => group.memberIds.includes(String(b.customerId)));

    const totalRevenue = groupBookings.reduce((sum, b: any) => sum + (b.totalAmount || b.total_amount || 0), 0);
    const bookingCount = groupBookings.length;
    const avgBookingValue = bookingCount > 0 ? totalRevenue / bookingCount : 0;
    const avgRevenuePerMember = group.memberCount > 0 ? totalRevenue / group.memberCount : 0;
    const avgBookingsPerMember = group.memberCount > 0 ? bookingCount / group.memberCount : 0;

    return {
      groupId,
      groupName: group.name,
      memberCount: group.memberCount,
      totalRevenue,
      avgRevenuePerMember,
      bookingCount,
      avgBookingValue,
      conversionRate: group.memberCount > 0 ? (members.length / group.memberCount) * 100 : 0,
      customerLifetimeValue: avgRevenuePerMember,
      churnRate: 0,
      topDestinations: [],
      growthTrend: [
        { date: new Date().toISOString().split('T')[0], memberCount: group.memberCount, revenue: totalRevenue },
      ],
    };
  },

  /**
   * Export group data
   */
  exportGroup: async (groupId: string): Promise<GroupExportData> => {
    const group = await CustomerGroupService.getById(groupId);
    if (!group) throw new Error('Group not found');

    const { CustomerService } = await import('./customer.service');
    const customers = await CustomerService.getAll();
    const members = customers.filter((c) => group.memberIds.includes(c.id));

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
    for (const groupId of request.groupIds) {
      const group = await CustomerGroupService.getById(groupId);
      if (!group) continue;

      switch (request.action) {
        case 'activate':
          await CustomerGroupService.update(groupId, { isActive: true });
          break;
        case 'deactivate':
          await CustomerGroupService.update(groupId, { isActive: false });
          break;
        case 'delete':
          await CustomerGroupService.delete(groupId);
          break;
        case 'addTag':
          if (request.payload?.tag && !group.tags.includes(request.payload.tag)) {
            await CustomerGroupService.update(groupId, {
              tags: [...group.tags, request.payload.tag],
            });
          }
          break;
        case 'applyDiscount':
          if (request.payload?.discountType && request.payload.discountValue !== undefined) {
            await CustomerGroupService.update(groupId, {
              defaultDiscount: {
                type: request.payload.discountType,
                value: request.payload.discountValue,
              },
            });
          }
          break;
      }
    }
  },

  /**
   * Search groups by criteria
   */
  search: async (query: string): Promise<CustomerGroup[]> => {
    const groups = await CustomerGroupService.getAll();
    const lowerQuery = query.toLowerCase();
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(lowerQuery) ||
        g.description?.toLowerCase().includes(lowerQuery) ||
        g.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  },
};
