/**
 * User Service - User management operations
 */

import { User, UserRole, UserStatus, UserActivity, UserInvitation } from '../types/common.types';
import { delay } from '../utils/api.utils';

// Mock data for development
let mockUsers: User[] = [
  {
    id: 'u_1',
    name: 'Admin User',
    email: 'admin@aventra.com',
    role: UserRole.ADMIN,
    phone: '+46 70 123 4567',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-12-30T10:30:00'),
    twoFactorEnabled: true,
    createdBy: 'system',
    notes: 'Primary system administrator'
  },
  {
    id: 'u_2',
    name: 'Sarah Johnson',
    email: 'sarah@aventra.com',
    role: UserRole.SUPPORT,
    phone: '+46 70 234 5678',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date('2024-12-29T15:20:00'),
    twoFactorEnabled: true,
    createdBy: 'u_1',
    notes: 'Customer support specialist'
  },
  {
    id: 'u_3',
    name: 'Michael Chen',
    email: 'michael@aventra.com',
    role: UserRole.ACCOUNTANT,
    phone: '+46 70 345 6789',
    status: UserStatus.ACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2024-12-28T09:15:00'),
    twoFactorEnabled: false,
    createdBy: 'u_1',
    notes: 'Financial operations manager'
  },
  {
    id: 'u_4',
    name: 'Emma Peterson',
    email: 'emma@aventra.com',
    role: UserRole.SUPPORT,
    phone: '+46 70 456 7890',
    status: UserStatus.INACTIVE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    createdAt: new Date('2024-04-05'),
    lastLogin: new Date('2024-11-20T14:30:00'),
    twoFactorEnabled: false,
    createdBy: 'u_1',
    notes: 'On leave'
  },
  {
    id: 'u_5',
    name: 'David Anderson',
    email: 'david@aventra.com',
    role: UserRole.ADMIN,
    phone: '+46 70 567 8901',
    status: UserStatus.SUSPENDED,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    createdAt: new Date('2024-05-15'),
    lastLogin: new Date('2024-12-15T11:45:00'),
    twoFactorEnabled: true,
    createdBy: 'u_1',
    notes: 'Account under review'
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
    email: 'newuser@aventra.com',
    role: UserRole.SUPPORT,
    invitedBy: 'u_1',
    invitedAt: new Date('2024-12-28'),
    expiresAt: new Date('2025-01-04'),
    status: 'PENDING'
  }
];

/**
 * User Service
 * Handles user management operations (mock implementation)
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
    await delay(300);
    
    let filtered = [...mockUsers];
    
    if (filters?.role) {
      filtered = filtered.filter(u => u.role === filters.role);
    }
    
    if (filters?.status) {
      filtered = filtered.filter(u => u.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }
    
    return filtered;
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
    await delay(500);
    
    const newUser: User = {
      ...userData,
      id: `u_${Date.now()}`,
      createdAt: new Date()
    };
    
    mockUsers.push(newUser);
    
    // Log activity
    mockActivities.push({
      id: `a_${Date.now()}`,
      userId: userData.createdBy || 'system',
      action: 'CREATE_USER',
      description: `Created new user: ${newUser.email}`,
      timestamp: new Date(),
      ipAddress: '192.168.1.100'
    });
    
    return newUser;
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await delay(400);
    
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[index] = { ...mockUsers[index], ...updates };
    
    // Log activity
    mockActivities.push({
      id: `a_${Date.now()}`,
      userId: 'current_user',
      action: 'UPDATE_USER',
      description: `Updated user: ${mockUsers[index].email}`,
      timestamp: new Date(),
      ipAddress: '192.168.1.100'
    });
    
    return mockUsers[index];
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    await delay(400);
    
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    mockUsers = mockUsers.filter(u => u.id !== id);
    
    // Log activity
    mockActivities.push({
      id: `a_${Date.now()}`,
      userId: 'current_user',
      action: 'DELETE_USER',
      description: `Deleted user: ${user.email}`,
      timestamp: new Date(),
      ipAddress: '192.168.1.100'
    });
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
    await delay(500);
    
    const invitation: UserInvitation = {
      id: `inv_${Date.now()}`,
      email,
      role,
      invitedBy,
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'PENDING'
    };
    
    mockInvitations.push(invitation);
    
    // Log activity
    mockActivities.push({
      id: `a_${Date.now()}`,
      userId: invitedBy,
      action: 'INVITE_USER',
      description: `Invited new user: ${email}`,
      timestamp: new Date(),
      ipAddress: '192.168.1.100'
    });
    
    return invitation;
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
    await delay(300);
    
    return UserService.updateUser(id, { status });
  },

  /**
   * Toggle 2FA for a user
   */
  toggleTwoFactor: async (id: string, enabled: boolean): Promise<User> => {
    await delay(300);
    
    return UserService.updateUser(id, { twoFactorEnabled: enabled });
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
    byRole: Record<UserRole, number>;
  }> => {
    await delay(200);
    
    const stats = {
      total: mockUsers.length,
      active: mockUsers.filter(u => u.status === UserStatus.ACTIVE).length,
      inactive: mockUsers.filter(u => u.status === UserStatus.INACTIVE).length,
      suspended: mockUsers.filter(u => u.status === UserStatus.SUSPENDED).length,
      byRole: {} as Record<UserRole, number>
    };
    
    // Count by role
    Object.values(UserRole).forEach(role => {
      stats.byRole[role] = mockUsers.filter(u => u.role === role).length;
    });
    
    return stats;
  }
};
