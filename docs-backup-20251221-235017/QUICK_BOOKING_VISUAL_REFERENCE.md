# Quick Booking Visual Reference

## Modal Layout

```
┌─────────────────────────────────────────┐
│ ⊕ Quick Booking                    [✕] │  ← Header with close button
├─────────────────────────────────────────┤
│                                         │
│  Select Tour *                          │  ← Form Section
│  [Dropdown with tour options]           │
│                                         │
│  Customer Name *                        │
│  [Text input field]                     │
│                                         │
│  Email Address *                        │
│  [Email input field]                    │
│                                         │
│  Trip Date *                            │
│  [Date picker field]                    │
│                                         │
├─────────────────────────────────────────┤
│  [Cancel]          [⊕ Create Booking]   │  ← Action buttons
└─────────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Primary Blue**: #3b82f6 (Submit button)
- **Dark Blue**: #2563eb (Hover state)
- **Light Blue**: rgba(59, 130, 246, 0.1) (Focus ring)

### Secondary Colors
- **Light Gray**: #f3f4f6 (Cancel button)
- **Medium Gray**: #e5e7eb (Hover state)
- **Border Gray**: #d1d5db (Borders)

### Text Colors
- **Dark Text**: #1f2937 (Headings, labels)
- **Medium Text**: #374151 (Button text)
- **Light Text**: #6b7280 (Placeholders)

## Animation Timeline

```
0ms     →    Open triggered
         →    Overlay appears (opacity: 0 → 1)
         →    Modal slides up (translateY: -20px → 0)
300ms   →    Animation complete, form ready
```

## Button States

### Normal
```
[✕ Close]        [⊕ Create Booking]
```

### Hover
```
[✕ Close] ← Light gray background
[⊕ Create Booking] ← Darker blue
```

### Active (Click)
```
[⊕ Create Booking] ← Slight scale down (0.98)
```

## Form Field States

### Idle
```
[─────────────────────]
Border: #d1d5db (light gray)
```

### Focus
```
[─────────────────────]  ← Border becomes blue
╰─ Box-shadow: blue glow
```

### Filled
```
[⊕ Mount Kilimanjaro]  ← Selected option/text
```

## Responsive Behavior

### Desktop (1200px+)
- Modal: 500px wide
- Buttons: Side by side (flex-direction: row)
- Two-column layout possible

### Tablet (640px - 1199px)
- Modal: 100% - 40px padding
- Buttons: Side by side with equal width
- Proper spacing maintained

### Mobile (< 640px)
- Modal: Full width - 24px padding
- Buttons: Stacked vertically (flex-direction: column-reverse)
- Full height inputs for touch-friendly experience

## Header Design

```
┌──────────────────────────────────────────┐
│  [⊕]  Quick Booking              [✕]    │
│        (icon 24px)              (close)  │
│  ← 12px gap →
└──────────────────────────────────────────┘
```

- **Icon**: 24px, blue (#3b82f6)
- **Title**: 20px, bold, dark gray
- **Close**: 24px, dark gray, hover → light gray bg
- **Padding**: 24px all sides

## Form Spacing

```
┌─────────────────────────────┐
│  Label                      │  ← 14px font, 600 weight
│  8px gap                    │
│  [─────────────]            │  ← 10px padding inside
│                             │
│  20px gap to next field     │
│                             │
│  Label                      │
│  8px gap                    │
│  [─────────────]            │
└─────────────────────────────┘
```

## Modal Shadow & Depth

```
Box Shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
- Provides depth and emphasis
- Subtle but prominent enough to draw attention
```

## Accessibility Features

✓ Semantic HTML (`<form>`, `<label>`, `<input>`)
✓ Focus states visible (blue border + box-shadow)
✓ ARIA labels for close button
✓ Proper label associations with inputs
✓ Form validation feedback
✓ Keyboard navigation support

## Overlay Behavior

```
┌─────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ▓                                       ▓ │
│  ▓    ┌─────────────────────────┐       ▓ │
│  ▓    │ ⊕ Quick Booking      [✕]│       ▓ │
│  ▓    │                         │       ▓ │
│  ▓    │    [Form fields]        │       ▓ │
│  ▓    │                         │       ▓ │
│  ▓    │ [Cancel] [Create]      │       ▓ │
│  ▓    └─────────────────────────┘       ▓ │
│  ▓                                       ▓ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────────────────────────────────┘
- Overlay: rgba(0, 0, 0, 0.5) (50% black)
- Click overlay to close
- Fixed positioning with z-index: 1000
```

## Integration with Booking Calendar

```
Header
├── Title & Subtitle
└── Action Buttons
    ├── PDF Export
    ├── iCal Export
    ├── CSV Export
    └── [⊕ Quick Booking] ← Triggers Modal
        │
        ├→ QuickBookingModal (isOpen: false)
        │  └→ Shows when button clicked
        │
        └→ onSubmit → onQuickBooking callback
           └→ Backend integration
```

## Tour Dropdown Option Format

```
[Bestig Kilimanjaro (Capacity: 12)        ▼]
[Langtang & Tamang Heritage (Capacity: 8) ▼]
[Everest Base Camp Trek (Capacity: 10)    ▼]
[Annapurna Circuit (Capacity: 6)          ▼]
```

Format shows:
- Tour name
- Max capacity for planning purposes
