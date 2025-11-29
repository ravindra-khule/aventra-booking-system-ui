/**
 * Auth Service - Authentication and authorization
 */

import { User, UserRole } from '../types/common.types';
import { delay } from '../utils/api.utils';

/**
 * Auth Service
 * Handles user authentication (mock implementation)
 */
export const AuthService = {
  /**
   * Mock login function
   * In production, this would validate credentials and return a JWT token
   */
  login: async (email: string, role: UserRole): Promise<User> => {
    await delay(500);
    return {
      id: 'u_123',
      name: email.split('@')[0],
      email: email,
      role: role
    };
  }
};
