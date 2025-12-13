/**
 * AVENTRA BOOKING SYSTEM - COLOR CONSTANTS
 * 
 * Centralized color definitions following design system guidelines
 * Ensures consistency across all components and modules
 * 
 * All hex values follow Tailwind CSS color palette standards
 * Provides both primary/secondary variants for flexible theming
 */

// ============================================
// PRIMARY COLORS
// ============================================

export const PRIMARY_COLORS = {
  // Blue - Primary color for main CTAs and actions
  PRIMARY: '#2563eb',        // blue-600 - Main primary color
  PRIMARY_LIGHT: '#3b82f6',  // blue-500 - Lighter variant
  PRIMARY_LIGHTER: '#60a5fa',// blue-400 - Even lighter for backgrounds
  PRIMARY_DARK: '#1d4ed8',   // blue-700 - Darker for hover states
  PRIMARY_DARKER: '#1e40af', // blue-800 - Even darker variant
};

// ============================================
// SECONDARY COLORS
// ============================================

export const SECONDARY_COLORS = {
  // Purple - Secondary/accent color
  SECONDARY: '#8b5cf6',       // purple-600 - Main secondary color
  SECONDARY_LIGHT: '#a78bfa', // purple-400 - Lighter variant
  SECONDARY_LIGHTER: '#ddd6fe',// purple-200 - Light background variant
  SECONDARY_DARK: '#7c3aed',  // purple-700 - Darker for hover states
  SECONDARY_DARKER: '#6d28d9',// purple-800 - Even darker variant
};

// ============================================
// SEMANTIC STATUS COLORS
// ============================================

export const SEMANTIC_COLORS = {
  // Success - Green color palette
  SUCCESS: '#16a34a',         // green-600 - Main success color
  SUCCESS_LIGHT: '#4ade80',   // green-400 - Light success
  SUCCESS_LIGHTER: '#dcfce7', // green-100 - Background
  SUCCESS_DARK: '#15803d',    // green-700 - Dark success
  
  // Warning - Amber/Yellow color palette
  WARNING: '#f59e0b',         // amber-500 - Main warning color
  WARNING_LIGHT: '#fbbf24',   // amber-400 - Light warning
  WARNING_LIGHTER: '#fef3c7', // amber-100 - Background
  WARNING_DARK: '#d97706',    // amber-600 - Dark warning
  
  // Danger/Error - Red color palette
  DANGER: '#dc2626',          // red-600 - Main danger color
  DANGER_LIGHT: '#ef4444',    // red-500 - Light danger
  DANGER_LIGHTER: '#fee2e2',  // red-100 - Background
  DANGER_DARK: '#991b1b',     // red-900 - Dark danger
  
  // Info - Cyan color palette
  INFO: '#0ea5e9',            // cyan-500 - Main info color
  INFO_LIGHT: '#06b6d4',      // cyan-500 - Light info
  INFO_LIGHTER: '#cffafe',    // cyan-100 - Background
  INFO_DARK: '#0369a1',       // cyan-700 - Dark info
};

// ============================================
// NEUTRAL COLORS (Grays)
// ============================================

export const NEUTRAL_COLORS = {
  // Grays - Comprehensive gray scale
  GRAY_50: '#f9fafb',         // Very light background
  GRAY_100: '#f3f4f6',        // Light background
  GRAY_200: '#e5e7eb',        // Borders, dividers
  GRAY_300: '#d1d5db',        // Secondary borders
  GRAY_400: '#9ca3af',        // Disabled text
  GRAY_500: '#6b7280',        // Secondary text
  GRAY_600: '#4b5563',        // Tertiary text
  GRAY_700: '#374151',        // Secondary heading text
  GRAY_800: '#1f2937',        // Primary text
  GRAY_900: '#111827',        // Dark text/headings
  
  // White and Black
  WHITE: '#ffffff',
  BLACK: '#000000',
  
  // Transparent variants
  BLACK_TRANSPARENT_50: 'rgba(0, 0, 0, 0.5)',
  BLACK_TRANSPARENT_25: 'rgba(0, 0, 0, 0.25)',
  WHITE_TRANSPARENT_50: 'rgba(255, 255, 255, 0.5)',
};

// ============================================
// EXTENDED COLOR PALETTE
// ============================================

export const EXTENDED_COLORS = {
  // Pink
  PINK: '#ec4899',
  PINK_LIGHT: '#f472b6',
  PINK_LIGHTER: '#fbcfe8',
  
  // Orange
  ORANGE: '#f97316',
  ORANGE_LIGHT: '#fb923c',
  ORANGE_LIGHTER: '#fed7aa',
  
  // Teal
  TEAL: '#14b8a6',
  TEAL_LIGHT: '#2dd4bf',
  TEAL_LIGHTER: '#ccfbf1',
};

// ============================================
// STATUS COLORS (Booking/Payment States)
// ============================================

export const BOOKING_STATUS_COLORS = {
  CONFIRMED: '#10b981',       // green-600 - Booking confirmed
  PENDING: '#f59e0b',         // amber-500 - Pending confirmation
  CANCELLED: '#ef4444',       // red-500 - Cancelled booking
  COMPLETED: '#3b82f6',       // blue-500 - Completed tour
  POSTPONED: '#8b5cf6',       // purple-600 - Postponed booking
};

export const PAYMENT_STATUS_COLORS = {
  PAID: '#0ea5e9',            // cyan-500 - Payment received
  PARTIAL: '#f97316',         // orange-600 - Partial payment
  UNPAID: '#dc2626',          // red-600 - Not yet paid
  REFUNDED: '#10b981',        // green-600 - Refunded
  FAILED: '#ef4444',          // red-500 - Payment failed
};

// ============================================
// ROLE COLORS (User Roles)
// ============================================

export const ROLE_COLORS = {
  ADMIN: '#8b5cf6',           // purple-600 - Administrator
  SUPPORT: '#3b82f6',         // blue-600 - Support staff
  ACCOUNTANT: '#10b981',      // green-600 - Finance/Accounting
  MANAGER: '#f59e0b',         // amber-500 - Management
  USER: '#6b7280',            // gray-500 - Regular user
};

// ============================================
// BACKGROUND & TEXT COLOR COMBINATIONS
// ============================================

export const COLOR_PAIRS = {
  // Success state
  SUCCESS_BG: SEMANTIC_COLORS.SUCCESS_LIGHTER,
  SUCCESS_TEXT: SEMANTIC_COLORS.SUCCESS_DARK,
  SUCCESS_BORDER: SEMANTIC_COLORS.SUCCESS,
  
  // Warning state
  WARNING_BG: SEMANTIC_COLORS.WARNING_LIGHTER,
  WARNING_TEXT: SEMANTIC_COLORS.WARNING_DARK,
  WARNING_BORDER: SEMANTIC_COLORS.WARNING,
  
  // Danger state
  DANGER_BG: SEMANTIC_COLORS.DANGER_LIGHTER,
  DANGER_TEXT: SEMANTIC_COLORS.DANGER_DARK,
  DANGER_BORDER: SEMANTIC_COLORS.DANGER,
  
  // Info state
  INFO_BG: SEMANTIC_COLORS.INFO_LIGHTER,
  INFO_TEXT: SEMANTIC_COLORS.INFO_DARK,
  INFO_BORDER: SEMANTIC_COLORS.INFO,
  
  // Default/Neutral state
  DEFAULT_BG: NEUTRAL_COLORS.GRAY_100,
  DEFAULT_TEXT: NEUTRAL_COLORS.GRAY_800,
  DEFAULT_BORDER: NEUTRAL_COLORS.GRAY_200,
};

// ============================================
// BORDER & DIVIDER COLORS
// ============================================

export const BORDER_COLORS = {
  DEFAULT: NEUTRAL_COLORS.GRAY_200,      // Standard border
  LIGHT: NEUTRAL_COLORS.GRAY_100,        // Very light border
  SUBTLE: NEUTRAL_COLORS.GRAY_200,       // Subtle border (standard)
  STRONG: NEUTRAL_COLORS.GRAY_300,       // Darker border
  FOCUS: PRIMARY_COLORS.PRIMARY,         // Focus state border
  ERROR: SEMANTIC_COLORS.DANGER,         // Error state border
};

// ============================================
// BACKGROUND COLORS
// ============================================

export const BG_COLORS = {
  PRIMARY: NEUTRAL_COLORS.WHITE,         // Main background
  SECONDARY: NEUTRAL_COLORS.GRAY_50,     // Secondary background
  TERTIARY: NEUTRAL_COLORS.GRAY_100,     // Tertiary background
  ACCENT: PRIMARY_COLORS.PRIMARY_LIGHTER,// Accent background
};

// ============================================
// TEXT COLORS
// ============================================

export const TEXT_COLORS = {
  PRIMARY: NEUTRAL_COLORS.GRAY_900,      // Main text
  SECONDARY: NEUTRAL_COLORS.GRAY_600,    // Secondary text
  TERTIARY: NEUTRAL_COLORS.GRAY_500,     // Tertiary text
  DISABLED: NEUTRAL_COLORS.GRAY_400,     // Disabled text
  LIGHT: NEUTRAL_COLORS.GRAY_300,        // Very light text
  INVERSE: NEUTRAL_COLORS.WHITE,         // Text on dark background
};

// ============================================
// UTILITY: Get color pair by type
// ============================================

export function getStatusColorPair(status: 'success' | 'warning' | 'danger' | 'info' | 'default') {
  switch (status) {
    case 'success':
      return COLOR_PAIRS.SUCCESS_BG;
    case 'warning':
      return COLOR_PAIRS.WARNING_BG;
    case 'danger':
      return COLOR_PAIRS.DANGER_BG;
    case 'info':
      return COLOR_PAIRS.INFO_BG;
    default:
      return COLOR_PAIRS.DEFAULT_BG;
  }
}

export function getStatusTextColor(status: 'success' | 'warning' | 'danger' | 'info' | 'default') {
  switch (status) {
    case 'success':
      return COLOR_PAIRS.SUCCESS_TEXT;
    case 'warning':
      return COLOR_PAIRS.WARNING_TEXT;
    case 'danger':
      return COLOR_PAIRS.DANGER_TEXT;
    case 'info':
      return COLOR_PAIRS.INFO_TEXT;
    default:
      return COLOR_PAIRS.DEFAULT_TEXT;
  }
}

export function getStatusBorderColor(status: 'success' | 'warning' | 'danger' | 'info' | 'default') {
  switch (status) {
    case 'success':
      return COLOR_PAIRS.SUCCESS_BORDER;
    case 'warning':
      return COLOR_PAIRS.WARNING_BORDER;
    case 'danger':
      return COLOR_PAIRS.DANGER_BORDER;
    case 'info':
      return COLOR_PAIRS.INFO_BORDER;
    default:
      return COLOR_PAIRS.DEFAULT_BORDER;
  }
}

// ============================================
// EXPORT ALL COLORS AS SINGLE OBJECT
// ============================================

export const COLORS = {
  primary: PRIMARY_COLORS,
  secondary: SECONDARY_COLORS,
  semantic: SEMANTIC_COLORS,
  neutral: NEUTRAL_COLORS,
  extended: EXTENDED_COLORS,
  bookingStatus: BOOKING_STATUS_COLORS,
  paymentStatus: PAYMENT_STATUS_COLORS,
  roles: ROLE_COLORS,
  pairs: COLOR_PAIRS,
  borders: BORDER_COLORS,
  backgrounds: BG_COLORS,
  text: TEXT_COLORS,
};

export default COLORS;
