/**
 * Aventra Theme Configuration
 * Based on client website styling
 */

export const themeConfig = {
  colors: {
    primary: '#ff1b00',      // Primary red
    secondary: '#000000',    // Black
    tertiary: '#ffffff',     // White
    background: {
      primary: '#ffffff',
      secondary: '#f4e6d3',  // Beige background
      dark: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',
      muted: '#6b7280',
    },
    border: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
    }
  },
  
  fonts: {
    primary: '"Swett-Headline-Extra-Bold", "Avenir-Book", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fallback: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  
  buttons: {
    primary: {
      fontFamily: '"Swett-Headline-Extra-Bold", Avenir-Book',
      fontSize: '16px',
      fontWeight: '800',
      textTransform: 'uppercase',
      lineHeight: '23px',
      letterSpacing: '0.5px',
      backgroundColor: '#ff1b00',
      color: '#ffffff',
      borderRadius: '23px',
      padding: '7px 25px',
      border: 'none',
    },
    secondary: {
      fontFamily: '"Swett-Headline-Extra-Bold", Avenir-Book',
      fontSize: '15px',
      fontWeight: '800',
      textTransform: 'uppercase',
      lineHeight: '22px',
      letterSpacing: '0.45px',
      textShadow: '0px 0px 10px rgb(255 255 255 / 30%)',
      color: '#ffffff',
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: '#ffffff',
      borderRadius: '23px',
      padding: '6px 25px',
    },
    tertiary: {
      fontFamily: '"Swett-Headline-Extra-Bold", Avenir-Book',
      fontSize: '15px',
      fontWeight: '600',
      textTransform: 'uppercase',
      lineHeight: '23px',
      backgroundColor: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '50px',
      padding: '6px 35px',
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '23px',
    '2xl': '50px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    text: '0px 0px 10px rgb(255 255 255 / 30%)',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  }
} as const;

export type ThemeConfig = typeof themeConfig;
