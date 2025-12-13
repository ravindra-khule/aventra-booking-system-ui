# Spacing System Visual Reference

## Spacing Scale Visualization

```
SPACING UNITS (from 4px base):

xs    sm     md      lg      xl      2xl     3xl
|_____|______|_________|_________|_________|_________|
4px   8px    16px    24px    32px    48px    64px
```

## Layout Spacing Examples

### 1. Page Layout with Container & Section Spacing

```
┌─────────────────────────────────────────────────────────┐
│ NAVIGATION BAR (sticky, h-16)                           │
└─────────────────────────────────────────────────────────┘
           ▼ container-padding-mobile/tablet/desktop
┌─────────────────────────────────────────────────────────┐
│ PAGE HEADER (section)                                   │
│ padding: var(--spacing-lg) or var(--spacing-xl)        │
└─────────────────────────────────────────────────────────┘
           ▼ section-separator
┌─────────────────────────────────────────────────────────┐
│ MAIN CONTENT AREA (section)                            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Card/Panel with gap: var(--spacing-md)             │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Padding: var(--spacing-lg)                         │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
           ▼ section-separator-lg
┌─────────────────────────────────────────────────────────┐
│ FOOTER (bg-gray-800)                                    │
│ padding: var(--spacing-2xl) var(--spacing-lg)          │
└─────────────────────────────────────────────────────────┘
```

### 2. Card Component Spacing

```
╔═════════════════════════════════════════════════════════╗
║ Card with padding: var(--spacing-lg)                    ║
║ ┌───────────────────────────────────────────────────┐   ║
║ │ Title (margin-bottom: var(--spacing-sm))          │   ║
║ │                                                   │   ║
║ │ Content gap: var(--spacing-md)                    │   ║
║ │ ┌─────────────────────┐  ┌──────────────────────┐│   ║
║ │ │ Element 1          │  │ Element 2            ││   ║
║ │ └─────────────────────┘  └──────────────────────┘│   ║
║ │                                                   │   ║
║ │ Button group gap: var(--spacing-sm)              │   ║
║ │ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │   ║
║ │ │ Cancel   │ │ Submit   │ │ Delete           │   │   ║
║ │ └──────────┘ └──────────┘ └──────────────────┘   │   ║
║ └───────────────────────────────────────────────────┘   ║
╚═════════════════════════════════════════════════════════╝
```

### 3. Form Field Spacing

```
┌──────────────────────────────────────┐
│ Form Group (margin-bottom: lg)       │
│ ┌────────────────────────────────┐   │
│ │ Label (margin-bottom: xs)      │   │
│ ├────────────────────────────────┤   │
│ │ Input Field                    │   │
│ │ padding: var(--spacing-sm)     │   │
│ │           var(--spacing-md)    │   │
│ └────────────────────────────────┘   │
│ Helper Text (margin-top: xs)         │
└──────────────────────────────────────┘
    ▼ form-group gap: var(--spacing-md)
┌──────────────────────────────────────┐
│ Form Group (margin-bottom: lg)       │
└──────────────────────────────────────┘
```

### 4. Table/List Item Spacing

```
┌─────────────────────────────────────────────────────────┐
│ TABLE HEADER                                            │
│ padding: var(--spacing-md) var(--spacing-lg)           │
│ gap: var(--spacing-md)                                 │
├─────────────────────────────────────────────────────────┤
│ TABLE ROW (transition on hover)                         │
│ padding: var(--spacing-md) var(--spacing-lg)           │
│ gap: var(--spacing-md)                                 │
├─────────────────────────────────────────────────────────┤
│ TABLE ROW                                               │
│ padding: var(--spacing-md) var(--spacing-lg)           │
│ gap: var(--spacing-md)                                 │
└─────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Mobile (< 640px)
```
Device Width: 375px

Container Padding: var(--spacing-md) = 16px
Section Gap: var(--spacing-md) = 16px
Component Padding: var(--spacing-md) = 16px

┌─────────────────────┐
│▮▮▮ CONTENT ▮▮▮      │  ← 16px padding on sides
│                     │
└─────────────────────┘
```

### Tablet (640px - 1023px)
```
Device Width: 768px

Container Padding: var(--spacing-lg) = 24px
Section Gap: var(--spacing-lg) = 24px
Component Padding: var(--spacing-lg) = 24px

┌────────────────────────────────┐
│▮▮▮▮ CONTENT ▮▮▮▮                │  ← 24px padding on sides
│                                │
└────────────────────────────────┘
```

### Desktop (≥ 1024px)
```
Device Width: 1400px

Container Padding: var(--spacing-xl) = 32px
Section Gap: var(--spacing-xl) = 32px
Component Padding: var(--spacing-lg) = 24px

┌───────────────────────────────────────────────┐
│▮▮▮▮▮ CONTENT ▮▮▮▮▮                            │  ← 32px padding on sides
│                                               │
└───────────────────────────────────────────────┘
```

## Component-Specific Spacing Presets

### Card Preset
```
.card {
  padding: 16px;              ← var(--spacing-md)
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

Variations:
- .card-compact:   padding: 8px   (var(--spacing-sm))
- .card-spacious:  padding: 24px  (var(--spacing-lg))
```

### Panel Preset
```
.panel {
  padding: 16px;              ← var(--spacing-md)
  background: #f9fafb;
  border-radius: 8px;
}

Variations:
- .panel-compact:   padding: 8px   (var(--spacing-sm))
- .panel-spacious:  padding: 24px  (var(--spacing-lg))
```

### Section Preset
```
.section {
  padding-top: var(--spacing-md);     ← responsive
  padding-bottom: var(--spacing-md);
}

Variations:
- .section-tight:     padding: 16px
- .section-spacious:  padding: 24px
- .section-hero:      padding: 48px (mobile) → 64px (desktop)
```

## Spacing Combinations Reference

### Tight Layout (Compact)
```
--spacing-sm (8px) for gaps
--spacing-md (16px) for padding
--spacing-sm (8px) for margins
↓
Tight, professional look with less breathing room
```

### Normal Layout (Balanced)
```
--spacing-md (16px) for gaps
--spacing-lg (24px) for padding
--spacing-md (16px) for margins
↓
Clean, readable, well-balanced layout
```

### Spacious Layout (Breathing Room)
```
--spacing-lg (24px) for gaps
--spacing-xl (32px) for padding
--spacing-lg (24px) for margins
↓
Airy, premium look with more whitespace
```

## Common Spacing Patterns

### Header with Title + Subtitle
```
.header {
  h2 { margin: 0 0 var(--spacing-xs) 0; }
  p  { margin: 0; }
}
Result: 4px gap between title and subtitle
```

### Action Buttons Group
```
.button-group {
  display: flex;
  gap: var(--spacing-sm);  ← 8px between buttons
}
```

### List Items
```
.list-item {
  padding: var(--spacing-md);
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
}
```

### Modal Dialog
```
.modal {
  .header {
    padding: var(--spacing-lg);        ← 24px
    border-bottom: 1px solid;
  }
  
  .body {
    padding: var(--spacing-lg);        ← 24px
  }
  
  .footer {
    padding: var(--spacing-lg);        ← 24px
    gap: var(--spacing-sm);            ← 8px between buttons
  }
}
```

## Accessibility Spacing

All interactive elements have minimum touch targets:
- Button minimum height: 40-44px
- Input field minimum height: 40-44px
- Link padding includes focus-visible outline: 2px offset

## Performance Considerations

- CSS variables have minimal performance impact
- Media queries are grouped by breakpoint
- No duplicate values used across the system
- Transitions use optimized durations (150ms-350ms)

## Migration Checklist

When adding new components:

- [ ] Use CSS variables for all spacing values
- [ ] Define mobile-first styles
- [ ] Add media queries for tablet/desktop
- [ ] Use appropriate presets (card, panel, section)
- [ ] Ensure minimum touch target sizes
- [ ] Test responsive behavior
- [ ] Verify no horizontal overflow on mobile
- [ ] Check focus-visible states
