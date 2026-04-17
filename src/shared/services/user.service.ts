/**
 * User Service - User management operations
 */

import { User, UserRole, UserStatus, UserActivity, UserInvitation } from '../types/common.types';
import { delay } from '../utils/api.utils';

// Mock data for development - matches DemoLoginModal users
let mockUsers: User[] = [
  {
    id: 'u_1',
    name: 'Super Admin',
    email: 'superadmin@swett.com',
    role: UserRole.SUPER_ADMIN,
    phone: '+46 70 100 0001',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SUPER_ADMIN',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2025-12-21T14:30:00'),
    twoFactorEnabled: true,
    createdBy: 'system',
    notes: 'System owner - Full access'
  },
  {
    id: 'u_2',
    name: 'Admin User',
    email: 'admin@swett.com',
    role: UserRole.ADMIN,
    phone: '+46 70 100 0002',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ADMIN',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2025-12-21T09:15:00'),
    twoFactorEnabled: true,
    createdBy: 'u_1',
    notes: 'Primary administrator'
  },
  {
    id: 'u_3',
    name: 'Support Agent',
    email: 'support@swett.com',
    role: UserRole.SUPPORT,
    phone: '+46 70 100 0003',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SUPPORT',
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date('2025-12-21T10:45:00'),
    twoFactorEnabled: false,
    createdBy: 'u_2',
    notes: 'Customer support specialist'
  },
  {
    id: 'u_4',
    name: 'Accountant',
    email: 'accountant@swett.com',
    role: UserRole.ACCOUNTANT,
    phone: '+46 70 100 0004',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ACCOUNTANT',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2025-12-20T15:20:00'),
    twoFactorEnabled: true,
    createdBy: 'u_1',
    notes: 'Financial operations manager'
  },
  {
    id: 'u_5',
    name: 'Developer',
    email: 'developer@swett.com',
    role: UserRole.DEVELOPER,
    phone: '+46 70 100 0005',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DEVELOPER',
    createdAt: new Date('2024-04-05'),
    lastLogin: new Date('2025-12-20T18:30:00'),
    twoFactorEnabled: true,
    createdBy: 'u_1',
    notes: 'System developer - Technical access'
  },
  {
    id: 'u_6',
    name: 'Guest User',
    email: 'guest@swett.com',
    role: UserRole.CUSTOMER,
    phone: '+46 70 100 0006',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CUSTOMER',
    createdAt: new Date('2024-05-15'),
    lastLogin: new Date('2025-12-20T12:00:00'),
    twoFactorEnabled: false,
    createdBy: 'u_2',
    notes: 'Customer account'
  }
];

let mockActivities: UserActivity[] = [
  {
    id: 'a_1',
    userId: 'u_1',
    action: 'LOGIN',
    description: 'User logged in successfully',
    timestamp: new Date('2024-12-30T10:30:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 'a_2',
    userId: 'u_1',
    action: 'UPDATE_USER',
    description: 'Updated user profile for u_5',
    timestamp: new Date('2024-12-30T09:15:00'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 'a_3',
    userId: 'u_2',
    action: 'LOGIN',
    description: 'User logged in successfully',
    timestamp: new Date('2024-12-29T15:20:00'),
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: 'a_4',
    userId: 'u_2',
    action: 'VIEW_BOOKING',
    description: 'Viewed booking BK-2024-1234',
    timestamp: new Date('2024-12-29T15:25:00'),
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
];

let mockInvitations: UserInvitation[] = [
  {
    id: 'inv_1',
    email: 'newuser@swett.com',
    role: UserRole.SUPPORT,
    invitedBy: 'u_1',
    invitedAt: new Date('2024-12-28'),
    expiresAt: new Date('2025-01-04'),
    status: 'PENDING'
  }
];

/**
 * User Service
 * Handles user management operations
 */
export const UserService = {
  /**
   * Get all users with optional filtering
   */
  getUsers: async (filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  }): Promise<User[]> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      let url = `${API_URL}/api/users-list.php`;
      const params = new URLSearchParams();
      
      if (filters?.role) params.append('role', filters.role);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      
      if (params.toString()) url += '?' + params.toString();
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch users:', response.statusText);
        return mockUsers; // Fallback to mock data
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('API error:', data.error);
        return mockUsers;
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return mockUsers; // Fallback to mock data
    }
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    await delay(200);
    return mockUsers.find(u => u.id === id) || null;
  },

  /**
   * Create a new user
   */
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password || 'TempPassword123!',
          role: userData.role,
          phone: userData.phone
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      return {
        ...userData,
        id: data.data.id,
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          ...updates
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      return { id, ...updates } as User;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Get user activity logs
   */
  getUserActivities: async (userId: string, limit: number = 50): Promise<UserActivity[]> => {
    await delay(300);
    
    return mockActivities
      .filter(a => a.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  },

  /**
   * Invite a new user
   */
  inviteUser: async (email: string, role: UserRole, invitedBy: string): Promise<UserInvitation> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-invite.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to invite user');
      }
      
      return {
        id: data.data.id,
        email,
        role,
        invitedBy,
        invitedAt: new Date(),
        expiresAt: new Date(data.data.expiresAt),
        status: 'PENDING'
      };
    } catch (error) {
      console.error('Error inviting user:', error);
      throw error;
    }
  },

  /**
   * Get pending invitations
   */
  getPendingInvitations: async (): Promise<UserInvitation[]> => {
    await delay(200);
    
    return mockInvitations.filter(inv => inv.status === 'PENDING');
  },

  /**
   * Update user status (activate/deactivate/suspend)
   */
  updateUserStatus: async (id: string, status: UserStatus): Promise<User> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update status');
      }
      
      return { id, status } as User;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  /**
   * Toggle 2FA for a user
   */
  toggleTwoFactor: async (id: string, enabled: boolean): Promise<User> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-2fa.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to toggle 2FA');
      }
      
      return { id, twoFactorEnabled: enabled } as User;
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      throw error;
    }
  },

  /**
   * Reset user password (send reset email)
   */
  resetPassword: async (userId: string): Promise<void> => {
    await delay(500);
    
    // Log activity
    mockActivities.push({
      id: `a_${Date.now()}`,
      userId: 'current_user',
      action: 'RESET_PASSWORD',
      description: `Password reset initiated for user: ${userId}`,
      timestamp: new Date(),
      ipAddress: '192.168.1.100'
    });
  },

  /**
   * Get user statistics
   */
  getUserStats: async (): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  }> => {
    try {
      const API_URL = (import.meta.env.VITE_REACT_APP_API_URL || 'http://127.0.0.1:5500');
      
      const response = await fetch(`${API_URL}/api/users-stats.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        console.error('Failed to fetch stats:', response.statusText);
        return { total: 0, active: 0, inactive: 0, suspended: 0 };
      }
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('API error:', data.error);
        return { total: 0, active: 0, inactive: 0, suspended: 0 };
      }
      
      return data.data || { total: 0, active: 0, inactive: 0, suspended: 0 };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { total: 0, active: 0, inactive: 0, suspended: 0 };
    }
  }
};
