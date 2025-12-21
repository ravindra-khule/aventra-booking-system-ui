# Aventra Booking System - Global Spacing System

## Overview

A comprehensive, responsive spacing system has been implemented across the Aventra booking system UI. This ensures consistent padding, margins, and gaps throughout the application while maintaining clean layouts and proper section separation with mobile-friendly spacing.

## Spacing Scale

The system uses an 8px base unit for a harmonious and scalable spacing scale:

| Variable | Value | Usage |
|----------|-------|-------|
| `--spacing-xs` | 4px | Smallest gaps, button padding |
| `--spacing-sm` | 8px | Small gaps, component padding |
| `--spacing-md` | 16px | Standard gaps, form fields |
| `--spacing-lg` | 24px | Section gaps, card padding |
| `--spacing-xl` | 32px | Large sections, hero padding |
| `--spacing-2xl` | 48px | Extra large sections |
| `--spacing-3xl` | 64px | Full page sections |

## Container Padding

Responsive container padding that adjusts by screen size:

| Screen | Variable | Value |
|--------|----------|-------|
| Mobile | `--container-padding-mobile` | 16px |
| Tablet | `--container-padding-tablet` | 24px |
| Desktop | `--container-padding-desktop` | 32px |

## Section Spacing

Section gaps automatically adjust based on viewport:

- **Mobile**: 16px (`--spacing-md`)
- **Tablet**: 24px (`--spacing-lg`)
- **Desktop**: 32px (`--spacing-xl`)

## How to Use

### 1. CSS Variable Method (Preferred)

Apply spacing using CSS variables in your CSS modules:

```css
.component {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .component {
    padding: var(--container-padding-mobile);
  }
}
```

### 2. Utility Classes

Use pre-defined utility classes in your JSX/TSX:

#### Padding Classes
```tsx
<div className="p-md">Full padding</div>
<div className="px-lg">Horizontal padding</div>
<div className="py-md">Vertical padding</div>
<div className="pt-sm">Top padding only</div>
```

#### Margin Classes
```tsx
<div className="m-md">Full margin</div>
<div className="mx-lg">Horizontal margin</div>
<div className="my-md">Vertical margin</div>
<div className="mb-lg">Bottom margin only</div>
```

#### Gap Classes
```tsx
<div className="gap-md">Child gap spacing</div>
<div className="gap-lg">Larger gaps</div>
```

### 3. Container Classes

For consistent page/section containers:

```tsx
<div className="container">Content</div>
<div className="container-padded">Padded container</div>
<div className="container-tight">Tight padding</div>
<div className="container-relaxed">Relaxed padding</div>
```

### 4. Section Classes

For page sections:

```tsx
<section className="section">Normal section</section>
<section className="section-tight">Compact section</section>
<section className="section-spacious">Spacious section</section>
<section className="section-hero">Full-height hero</section>
```

### 5. Component Presets

Ready-to-use component styling:

```tsx
<div className="card">Standard card with padding and shadow</div>
<div className="card-compact">Compact card</div>
<div className="card-spacious">Large card</div>

<div className="panel">Panel component</div>
<div className="panel-spacious">Large panel</div>
```

## Responsive Spacing Example

```css
.myComponent {
  padding: var(--container-padding-mobile);
  gap: var(--spacing-md);
}

@media (min-width: 640px) {
  .myComponent {
    padding: var(--container-padding-tablet);
  }
}

@media (min-width: 1024px) {
  .myComponent {
    padding: var(--container-padding-desktop);
  }
}
```

Or use the simpler form method:

```css
.myComponent {
  padding: var(--spacing-md);
}

@media (min-width: 640px) {
  .myComponent {
    padding: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .myComponent {
    padding: var(--spacing-xl);
  }
}
```

## Breakpoints

The system uses standard responsive breakpoints:

- **Mobile**: 0px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

## Shadow Variables

Consistent shadows for depth:

```css
box-shadow: var(--shadow-sm);  /* 0 1px 2px */
box-shadow: var(--shadow-md);  /* 0 4px 6px */
box-shadow: var(--shadow-lg);  /* 0 10px 15px */
```

## Transition Variables

Consistent animation speeds:

```css
transition: all var(--transition-fast);    /* 150ms */
transition: all var(--transition-base);    /* 250ms */
transition: all var(--transition-slow);    /* 350ms */
```

## Border Radius Variables

```css
border-radius: var(--radius-sm);  /* 6px */
border-radius: var(--radius-md);  /* 8px */
border-radius: var(--radius-lg);  /* 12px */
border-radius: var(--radius-xl);  /* 16px */
```

## Best Practices

1. **Always Use Variables**: Replace hardcoded pixel values with CSS variables for consistency.

2. **Mobile-First Approach**: Define mobile spacing first, then add breakpoints for larger screens.

3. **Avoid Inline Styles**: Use CSS modules or utility classes instead of inline `style` attributes.

4. **Section Separation**: Use `section-separator` class for consistent spacing between major sections.

5. **Component Padding**: Use `card` and `panel` classes for consistent component styling.

6. **Accessibility**: The spacing system includes focus-visible states for keyboard navigation.

## File Location

The global styles file is located at:
```
/aventra-booking-system-ui/index.css
```

It is automatically imported in `index.html` and available throughout the application.

## Migration Guide

### Before (Hardcoded Values)
```css
.component {
  padding: 24px;
  margin-bottom: 20px;
  gap: 12px;
}

@media (max-width: 768px) {
  .component {
    padding: 16px;
    margin-bottom: 12px;
  }
}
```

### After (Using Variables)
```css
.component {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .component {
    padding: var(--spacing-md);
  }
}
```

## Updated Components

The following components have been updated to use the global spacing system:

- ✅ BookingCalendar.module.css
- ✅ AnalyticsPage.module.css
- ✅ GroupList.module.css
- ✅ CalendarFilters.module.css
- ✅ CalendarViews.module.css
- ✅ AvailabilityOverview.module.css
- ✅ EventDetailModal.module.css
- ✅ QuickBookingModal.module.css
- And more...

## Testing

To verify the spacing system is working correctly:

1. Check responsive behavior at different viewport sizes (375px, 768px, 1024px)
2. Verify padding/margin consistency across similar components
3. Test mobile menu spacing and touch targets
4. Confirm section separations are visually consistent
5. Check that no overflow occurs on small screens

## Color System Integration

The spacing system includes a color palette:

- `--color-bg-primary` (#ffffff)
- `--color-bg-secondary` (#f9fafb)
- `--color-text-primary` (#1f2937)
- `--color-text-secondary` (#6b7280)
- `--color-border` (#e5e7eb)

## Future Enhancements

Potential improvements:

1. Add CSS variables for typography scale
2. Implement theme support (light/dark modes)
3. Add RTL (right-to-left) language support adjustments
4. Create Storybook stories for spacing documentation
5. Add spacing presets for specific component types

## Support

For questions or issues with the spacing system, refer to:
1. This documentation file
2. The `index.css` file for variable definitions
3. CSS module files for implementation examples
