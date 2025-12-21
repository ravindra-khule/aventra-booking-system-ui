/**
 * Demo Login Modal
 * Provides role-based demo login with auto-populated credentials
 */

import React, { useState } from 'react';
import { X, Mail, Lock, Shield, Crown, Headphones, Calculator, Code, User, ChevronDown } from 'lucide-react';
import { UserRole } from '../src/shared/types/common.types';

interface DemoLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, role: UserRole) => Promise<void>;
}

interface RoleOption {
  role: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
  email: string;
  password: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    role: UserRole.SUPER_ADMIN,
    icon: <Crown className="w-5 h-5" />,
    title: 'Super Admin',
    description: 'Full system access - Owner level control',
    email: 'superadmin@aventra.com',
    password: 'Aventra2025!Super',
    color: 'text-purple-600',
  },
  {
    role: UserRole.ADMIN,
    icon: <Shield className="w-5 h-5" />,
    title: 'Admin',
    description: 'Administrative access - Manage operations & users',
    email: 'admin@aventra.com',
    password: 'Aventra2025!Admin',
    color: 'text-blue-600',
  },
  {
    role: UserRole.SUPPORT,
    icon: <Headphones className="w-5 h-5" />,
    title: 'Support',
    description: 'Customer support - Bookings & customer management',
    email: 'support@aventra.com',
    password: 'Aventra2025!Support',
    color: 'text-green-600',
  },
  {
    role: UserRole.ACCOUNTANT,
    icon: <Calculator className="w-5 h-5" />,
    title: 'Accountant',
    description: 'Finance access - Financial operations & reporting',
    email: 'accountant@aventra.com',
    password: 'Aventra2025!Finance',
    color: 'text-amber-600',
  },
  {
    role: UserRole.DEVELOPER,
    icon: <Code className="w-5 h-5" />,
    title: 'Developer',
    description: 'Technical access - System logs & developer tools',
    email: 'developer@aventra.com',
    password: 'Aventra2025!Dev',
    color: 'text-slate-600',
  },
  {
    role: UserRole.CUSTOMER,
    icon: <User className="w-5 h-5" />,
    title: 'Guest / Customer',
    description: 'Customer view - Book tours & view bookings',
    email: 'guest@aventra.com',
    password: 'Aventra2025!Guest',
    color: 'text-gray-600',
  },
];

export const DemoLoginModal: React.FC<DemoLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<RoleOption>(roleOptions[0]); // Default to Super Admin
  const [email, setEmail] = useState(roleOptions[0].email);
  const [password, setPassword] = useState(roleOptions[0].password);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  // Auto-populate credentials when role changes
  const handleRoleChange = (roleValue: string) => {
    const role = roleOptions.find(r => r.role === roleValue);
    if (role) {
      setSelectedRole(role);
      setEmail(role.email);
      setPassword(role.password);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    try {
      await onLogin(email, password, selectedRole.role);
      // Don't close here - let the parent component handle closing and navigation
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-7 h-7" />
                Demo Login
              </h2>
              <p className="text-blue-100 mt-1 text-sm">
                Select role and login to explore
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <div className="relative">
              <select
                value={selectedRole.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                {roleOptions.map((role) => (
                  <option key={role.role} value={role.role}>
                    {role.title} - {role.description}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Role Description */}
          <div className={`bg-gray-50 border-l-4 ${selectedRole.color.replace('text-', 'border-')} p-4 rounded-r-lg`}>
            <div className="flex items-start gap-3">
              <div className={selectedRole.color}>
                {selectedRole.icon}
              </div>
              <div>
                <h4 className={`font-semibold ${selectedRole.color}`}>
                  {selectedRole.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{selectedRole.description}</p>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="user@aventra.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <strong>Demo Mode:</strong> Credentials auto-populate when you select a role. 
                All passwords follow format: <code className="bg-blue-100 px-1 rounded">Aventra2025!{'{Role}'}</code>
              </p>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className={`
              w-full px-6 py-3 rounded-lg font-semibold text-white
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
              transition-all duration-200 shadow-lg hover:shadow-xl
            `}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              `Login as ${selectedRole.title}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
