# Quick Reference - Global Spacing System

## 🎯 Quick Start

### Import (Already Included)
The system is automatically imported in `index.html` and `index.css` - no additional imports needed!

### Method 1: CSS Variables (Recommended)
```css
.component {
  padding: var(--spacing-md);       /* 16px */
  margin-bottom: var(--spacing-lg); /* 24px */
  gap: var(--spacing-sm);           /* 8px */
}
```

### Method 2: Utility Classes
```jsx
<div className="p-md mb-lg gap-sm">Content</div>
<div className="card px-lg py-md">Card content</div>
<div className="container">Full-width with responsive padding</div>
```

### Method 3: Component Presets
```jsx
<div className="card">Standard card</div>
<div className="panel">Light panel</div>
<section className="section">Page section</section>
```

## 📏 Spacing Values

| Class/Variable | Value | Use Case |
|---|---|---|
| `xs` / `--spacing-xs` | 4px | Button padding, tiny gaps |
| `sm` / `--spacing-sm` | 8px | Small gaps, button groups |
| `md` / `--spacing-md` | 16px | Standard padding, form fields |
| `lg` / `--spacing-lg` | 24px | Cards, section padding |
| `xl` / `--spacing-xl` | 32px | Large sections, page padding |
| `2xl` / `--spacing-2xl` | 48px | Extra large spacing |
| `3xl` / `--spacing-3xl` | 64px | Full-page sections |

## 📱 Responsive Padding

Automatically adjusts based on screen size:

| Screen | Value |
|--------|-------|
| Mobile (<640px) | 16px |
| Tablet (640-1023px) | 24px |
| Desktop (≥1024px) | 32px |

Use: `padding: var(--container-padding-mobile)` → auto-responsive

## 🎨 Available Classes

### Padding
```
.p-xs .p-sm .p-md .p-lg .p-xl .p-2xl
.px-sm .py-md .pt-lg .pb-md .pl-lg .pr-sm
```

### Margin
```
.m-xs .m-sm .m-md .m-lg .m-xl .m-2xl
.mx-sm .my-md .mt-lg .mb-md .ml-lg .mr-sm
```

### Gap
```
.gap-xs .gap-sm .gap-md .gap-lg .gap-xl .gap-2xl
```

### Containers
```
.container           /* Full-width + responsive padding */
.container-padded    /* With responsive padding */
.container-tight     /* Minimal padding (16px) */
.container-relaxed   /* Extra padding (32px) */
```

### Sections
```
.section             /* Normal responsive section */
.section-tight       /* Compact padding */
.section-spacious    /* More breathing room */
.section-hero        /* Large hero padding */
```

### Components
```
.card                /* Standard card (16px padding) */
.card-compact        /* Small padding (8px) */
.card-spacious       /* Large padding (24px) */
.panel               /* Light background panel */
.panel-spacious      /* Large padding panel */
```

## 💡 Common Patterns

### Form Layout
```jsx
<div className="form-group mb-lg">
  <label className="block mb-sm">Field Label</label>
  <input className="form-field w-full" />
</div>
```

### Card Grid
```jsx
<div className="gap-lg">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>
```

### Section with Header
```jsx
<section className="section">
  <div className="page-header mb-lg">
    <h1>Title</h1>
    <p>Description</p>
  </div>
  <div className="gap-md">
    {/* Content */}
  </div>
</section>
```

### Modal Dialog
```jsx
<div className="modal">
  <div className="p-lg border-b">Header</div>
  <div className="p-lg">Body</div>
  <div className="p-lg flex gap-sm justify-end">
    <button>Cancel</button>
    <button>Submit</button>
  </div>
</div>
```

## 🔄 Responsive Example

```css
.myComponent {
  /* Mobile first (default) */
  padding: var(--spacing-md);      /* 16px */
  gap: var(--spacing-sm);          /* 8px */
}

@media (min-width: 640px) {
  /* Tablet */
  .myComponent {
    padding: var(--spacing-lg);    /* 24px */
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .myComponent {
    padding: var(--spacing-xl);    /* 32px */
  }
}
```

Or use responsive containers:

```jsx
<div className="container">
  {/* Automatically uses responsive padding */}
</div>
```

## 🎯 What to Use When

### For Component Padding → `--spacing-md` or `--spacing-lg`
```css
.card { padding: var(--spacing-lg); } /* 24px */
```

### For Gaps Between Items → `--spacing-sm` or `--spacing-md`
```css
.list { gap: var(--spacing-md); } /* 16px */
```

### For Section Margins → `--spacing-lg` or `--spacing-xl`
```css
.section { margin-bottom: var(--spacing-xl); } /* 32px */
```

### For Button Padding → `--spacing-xs` or `--spacing-sm`
```css
button { padding: var(--spacing-xs) var(--spacing-md); } /* 4px 16px */
```

## 🚫 What NOT to Do

❌ Don't use hardcoded pixels:
```css
/* WRONG */
padding: 24px;
margin: 16px;
```

✅ Do use variables:
```css
/* RIGHT */
padding: var(--spacing-lg);
margin: var(--spacing-md);
```

❌ Don't use inconsistent values:
```css
/* WRONG */
gap: 15px;  /* Use 16px instead */
margin: 23px;  /* Use 24px instead */
```

✅ Use the scale:
```css
/* RIGHT */
gap: var(--spacing-md);  /* 16px */
margin: var(--spacing-lg);  /* 24px */
```

## 📋 Implementation Checklist

- [ ] Use CSS variables for all spacing
- [ ] No inline style props with padding/margin
- [ ] Mobile-first approach
- [ ] Add media queries for larger screens
- [ ] Use component presets when applicable
- [ ] Test at 375px, 768px, 1024px viewports
- [ ] Verify no horizontal overflow on mobile
- [ ] Check focus-visible states on interactive elements

## 🔗 Reference Files

- **Complete Guide**: `SPACING_SYSTEM.md`
- **Visual Diagrams**: `SPACING_VISUAL_REFERENCE.md`
- **Implementation**: `index.css`
- **Examples**: Updated CSS module files

## ⚡ Most Common Uses

| Task | Use This |
|------|----------|
| Page padding | `padding: var(--container-padding-mobile)` |
| Card padding | `padding: var(--spacing-lg)` (24px) |
| Section gap | `margin-bottom: var(--spacing-xl)` (32px) |
| List gap | `gap: var(--spacing-md)` (16px) |
| Button padding | `padding: var(--spacing-sm) var(--spacing-md)` |
| Form field padding | `padding: var(--spacing-sm) var(--spacing-md)` |
| Modal padding | `padding: var(--spacing-lg)` (24px) |
| Component gap | `gap: var(--spacing-sm)` (8px) |

---

**For detailed information, see:**
- [Complete Spacing System Documentation](./SPACING_SYSTEM.md)
- [Visual Reference Guide](./SPACING_VISUAL_REFERENCE.md)
- [Implementation Summary](./SPACING_IMPLEMENTATION_SUMMARY.md)
