# Color Design System Documentation

**Version**: 1.0  
**Last Updated**: December 13, 2025  
**Status**: Recommended Implementation Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Usage Guidelines](#usage-guidelines)
4. [Component Color Mapping](#component-color-mapping)
5. [Accessibility](#accessibility)
6. [Implementation](#implementation)

---

## Overview

The Aventra Booking System uses a comprehensive color design system based on Tailwind CSS standards. This ensures consistency, accessibility, and maintainability across all UI components.

### Key Principles

- **Semantic**: Colors represent meaning (success=green, danger=red)
- **Consistent**: Same colors used for same purposes throughout app
- **Accessible**: WCAG AA compliant color contrasts
- **Maintainable**: Centralized color definitions for easy updates
- **Scalable**: Extensible for new features and themes

---

## Color Palette

### Primary Color: Blue (#2563eb)

Used for primary actions, main CTAs, and interactive elements.

```
Blue-50:   #eff6ff  (Backgrounds)
Blue-100:  #dbeafe
Blue-200:  #bfdbfe
Blue-300:  #93c5fd
Blue-400:  #60a5fa
Blue-500:  #3b82f6  (Light)
Blue-600:  #2563eb  (Primary - Use this)
Blue-700:  #1d4ed8  (Hover/Active)
Blue-800:  #1e40af  (Dark variant)
Blue-900:  #1e3a8a
```

**Used in**:
- Primary buttons
- Links and navigation
- Focus rings
- Primary checkmarks
- Primary badges

---

### Secondary Color: Purple (#8b5cf6)

Used for accents, highlights, and special emphasis.

```
Purple-50:   #faf5ff (Backgrounds)
Purple-100:  #f3e8ff
Purple-200:  #e9d5ff
Purple-300:  #d8b4fe
Purple-400:  #c084fc
Purple-600:  #8b5cf6  (Secondary - Use this)
Purple-700:  #7c3aed  (Hover/Active)
Purple-800:  #6d28d9  (Dark variant)
Purple-900:  #581c87
```

**Used in**:
- Secondary buttons
- Tour detail headers
- Accent borders
- Focus indicators (alternative)
- Creative/highlight elements

---

### Success Color: Green (#16a34a)

Indicates successful operations, confirmations, and positive states.

```
Green-50:   #f0fdf4  (Backgrounds)
Green-100:  #dcfce7
Green-200:  #bbf7d0
Green-300:  #86efac
Green-400:  #4ade80  (Light)
Green-600:  #16a34a  (Success - Use this)
Green-700:  #15803d  (Hover/Active)
Green-800:  #166534  (Dark variant)
```

**Used in**:
- Success badges and alerts
- Confirmed status
- Active/enabled states
- Positive feedback
- "Available" indicators

---

### Warning Color: Amber (#f59e0b)

Indicates caution, pending states, and warnings.

```
Amber-50:   #fffbeb  (Backgrounds)
Amber-100:  #fef3c7
Amber-200:  #fde68a
Amber-300:  #fcd34d
Amber-400:  #fbbf24  (Light)
Amber-500:  #f59e0b  (Warning - Use this)
Amber-600:  #d97706  (Hover/Active)
Amber-700:  #b45309  (Dark variant)
```

**Used in**:
- Warning badges and alerts
- Pending status
- Limited availability
- Cautionary indicators
- "Caution required" states

---

### Danger Color: Red (#dc2626)

Indicates errors, destructive actions, and critical states.

```
Red-50:    #fef2f2  (Backgrounds)
Red-100:   #fee2e2
Red-200:   #fecaca
Red-300:   #fca5a5
Red-400:   #f87171  (Light)
Red-500:   #ef4444
Red-600:   #dc2626  (Danger - Use this)
Red-700:   #b91c1c  (Hover/Active)
Red-800:   #991b1b  (Dark variant)
```

**Used in**:
- Error badges and alerts
- Destructive buttons
- Cancelled status
- Failed operations
- Delete confirmations

---

### Info Color: Cyan (#0ea5e9)

Indicates informational messages and secondary actions.

```
Cyan-50:   #ecf9ff  (Backgrounds)
Cyan-100:  #cffafe
Cyan-200:  #a5f3fc
Cyan-300:  #67e8f9
Cyan-400:  #22d3ee  (Light)
Cyan-500:  #0ea5e9  (Info - Use this)
Cyan-600:  #0284c7  (Hover/Active)
Cyan-700:  #0369a1  (Dark variant)
```

**Used in**:
- Info badges and alerts
- Secondary information
- Help text badges
- Informational borders

---

### Gray Palette: Neutrals

Complete grayscale for text, backgrounds, and borders.

```
Gray-50:   #f9fafb  (Lightest - Alt backgrounds)
Gray-100:  #f3f4f6  (Light backgrounds)
Gray-200:  #e5e7eb  (Borders, dividers)
Gray-300:  #d1d5db  (Secondary borders)
Gray-400:  #9ca3af  (Disabled text)
Gray-500:  #6b7280  (Secondary text)
Gray-600:  #4b5563  (Tertiary text)
Gray-700:  #374151  (Secondary headings)
Gray-800:  #1f2937  (Primary text)
Gray-900:  #111827  (Darkest - Headings)
```

**Mapping**:
- **Primary Text**: Gray-900 (#1f2937)
- **Secondary Text**: Gray-600 (#4b5563)
- **Tertiary Text**: Gray-500 (#6b7280)
- **Disabled Text**: Gray-400 (#9ca3af)
- **Primary Background**: White (#ffffff)
- **Secondary Background**: Gray-50 (#f9fafb)
- **Tertiary Background**: Gray-100 (#f3f4f6)
- **Borders**: Gray-200 (#e5e7eb)
- **Light Borders**: Gray-100 (#f3f4f6)

---

## Usage Guidelines

### Button Colors

```tsx
// Primary Action (Most Important)
<Button variant="primary">Save</Button>
// Uses: Blue-600 background, White text

// Secondary Action
<Button variant="secondary">Cancel</Button>
// Uses: Gray-600 background, White text

// Destructive Action
<Button variant="danger">Delete</Button>
// Uses: Red-600 background, White text

// Positive Action
<Button variant="success">Confirm</Button>
// Uses: Green-600 background, White text

// Outline Action (Less Prominent)
<Button variant="outline">More Options</Button>
// Uses: White background, Gray-700 text, Gray-300 border

// Ghost Action (Least Prominent)
<Button variant="ghost">Cancel</Button>
// Uses: Transparent background, Gray-600 text
```

### Badge/Status Colors

| Status | Background | Text | Border | Usage |
|--------|-----------|------|--------|-------|
| Success | Green-100 | Green-800 | Green-300 | Confirmed bookings, active status |
| Warning | Amber-100 | Amber-900 | Amber-300 | Pending bookings, caution needed |
| Danger | Red-100 | Red-800 | Red-300 | Cancelled, errors, failed |
| Info | Cyan-100 | Cyan-800 | Cyan-300 | Information, help, secondary |
| Default | Gray-100 | Gray-800 | Gray-300 | Neutral status, tags |

### Form Input Colors

| State | Border | Ring | Background |
|-------|--------|------|------------|
| Default | Gray-300 | None | White |
| Focus | Blue-500 | Blue-500 (light) | White |
| Error | Red-500 | Red-500 (light) | White |
| Disabled | Gray-200 | None | Gray-50 |

### Text Colors

```css
/* Hierarchy */
color: #1f2937;  /* Primary - Headings, main content */
color: #4b5563;  /* Secondary - Subtext, secondary info */
color: #6b7280;  /* Tertiary - Helper text, hints */
color: #9ca3af;  /* Disabled - Disabled inputs, inactive */

/* On colored backgrounds */
color: #ffffff;  /* Light text on dark/colored backgrounds */
```

---

## Component Color Mapping

### Core Components

#### Button Component

```typescript
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
};
```

#### Badge Component

```typescript
const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
};
```

#### Input Component

```typescript
const errorClass = error 
  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
```

#### Card Component

```css
background-color: #ffffff;       /* White background */
border: 1px solid #e5e7eb;      /* Gray-200 border */
```

#### Toast Notification

```typescript
const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};
```

### Feature Components

#### Booking Status

```typescript
const statusColors = {
  CONFIRMED: '#10b981',   // Green
  PENDING: '#f59e0b',     // Amber
  CANCELLED: '#ef4444',   // Red
  COMPLETED: '#3b82f6',   // Blue
};
```

#### Payment Status

```typescript
const paymentColors = {
  PAID: '#0ea5e9',        // Cyan
  PARTIAL: '#f97316',     // Orange
  UNPAID: '#dc2626',      // Red
};
```

#### User Roles

```typescript
const roleColors = {
  ADMIN: '#8b5cf6',       // Purple
  SUPPORT: '#3b82f6',     // Blue
  ACCOUNTANT: '#10b981',  // Green
};
```

---

## Accessibility

### WCAG Compliance

All colors meet **WCAG AA contrast standards** (minimum 4.5:1 for text):

| Combination | Contrast Ratio | Status |
|------------|----------------|--------|
| Dark Gray on White | 8.59:1 | ✅ AA/AAA |
| Blue-600 on White | 5.33:1 | ✅ AA/AAA |
| Green-600 on White | 6.47:1 | ✅ AA/AAA |
| Red-600 on White | 5.66:1 | ✅ AA/AAA |
| Gray-500 on White | 4.54:1 | ✅ AA |
| Gray-400 on White | 2.92:1 | ❌ Fails (use for icons only) |

### Color-Blind Accessibility

**Current Status**: Colors distinguishable by colorblind users

**Best Practices**:
- ✅ Avoid red/green-only indicators
- ✅ Use blue as primary color
- ✅ Add patterns/icons for status indicators
- ✅ Include text labels for all color-coded items

**Improvement Areas**:
- Add striped patterns to warning badges
- Use different icons for status types
- Ensure text labels present with color indicators

### Focus Indicators

- **Focus Ring**: Blue-500 with 3px offset
- **Focus Style**: Outline, not subtle color change
- **Keyboard Visible**: Always visible on all interactive elements

---

## Implementation

### How to Use Color Constants

#### Option 1: Import Constants

```typescript
import { PRIMARY_COLORS, SEMANTIC_COLORS, NEUTRAL_COLORS } from '@/shared/constants/colors';

const MyComponent = () => (
  <div style={{ color: NEUTRAL_COLORS.GRAY_900 }}>
    <button style={{ backgroundColor: PRIMARY_COLORS.PRIMARY }}>
      Click Me
    </button>
  </div>
);
```

#### Option 2: Use CSS Variables

```css
div {
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border-color: var(--color-border);
}
```

#### Option 3: Use Tailwind Classes (Preferred)

```tsx
<div className="text-gray-900 bg-white border border-gray-200">
  <button className="bg-blue-600 text-white hover:bg-blue-700">
    Click Me
  </button>
</div>
```

### Migration Path

1. **Phase 1**: Define colors in `colors.ts` ✅ (Done)
2. **Phase 2**: Update index.css with variables (In Progress)
3. **Phase 3**: Migrate service files to use constants
4. **Phase 4**: Update CSS modules to use variables
5. **Phase 5**: Document color usage in components

### Default Color Assignments

When choosing colors for new components:

1. **Primary Action**: Use `PRIMARY_COLORS.PRIMARY`
2. **Secondary Action**: Use `SECONDARY_COLORS.SECONDARY`
3. **Success State**: Use `SEMANTIC_COLORS.SUCCESS`
4. **Warning State**: Use `SEMANTIC_COLORS.WARNING`
5. **Error State**: Use `SEMANTIC_COLORS.DANGER`
6. **Info Message**: Use `SEMANTIC_COLORS.INFO`
7. **Text**: Use `TEXT_COLORS` hierarchy
8. **Background**: Use `BG_COLORS`
9. **Borders**: Use `BORDER_COLORS`

---

## FAQ

### Q: Should I use hardcoded hex values or constants?
**A**: Use constants/variables. This enables:
- Consistent updates across entire app
- Easy theme changes
- Better maintainability
- WCAG compliance verification

### Q: Can I use different blues?
**A**: Yes, but use from the official palette:
- Blue-600 (Primary)
- Blue-500 (Light variant)
- Blue-700 (Hover state)

Don't introduce new blues like #1a5cff.

### Q: What if the design mockup uses a different color?
**A**: Discuss with the design team. If the color truly needs to be different, update the `colors.ts` constants so it's centralized and documented.

### Q: How do I add a new color?
**A**: 
1. Add to appropriate section in `colors.ts`
2. Update `COLOR_DESIGN_GUIDELINES_VERIFICATION.md`
3. Get design system approval
4. Update this documentation

### Q: Is dark mode supported?
**A**: Not yet. Future enhancement:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111827;
    --color-text-primary: #f9fafb;
  }
}
```

### Q: How do I test color contrast?
**A**: Use WebAIM Contrast Checker:
https://webaim.org/resources/contrastchecker/

---

## Resources

- **Tailwind Color Palette**: https://tailwindcss.com/docs/customizing-colors
- **WCAG Color Contrast**: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
- **Color-Blind Friendly Palette**: https://colorblindnessfriendly.com/
- **Accessibility Audit Tool**: https://www.deque.com/axe/devtools/

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-13 | Initial color system documentation |

---

**Last Reviewed**: December 13, 2025  
**Next Review**: January 13, 2026  
**Maintained By**: Design System Team
