# 🏗️ Scalable Architecture Plan - Aventra Booking System

## 📋 Current Issues

### Navigation Problems
- ❌ Flat menu structure - all items at same level
- ❌ No logical grouping of related features
- ❌ Difficult to find features as system grows
- ❌ No visual hierarchy

### Code Organization Problems
- ❌ Single `types.ts` file - will become huge
- ❌ All admin pages in one folder
- ❌ No clear separation of concerns
- ❌ Hard for multiple developers to work simultaneously
- ❌ Risk of merge conflicts

---

## 🎯 Proposed Solution

### 1. Navigation Structure (Menu Categories)

```
┌─────────────────────────────────────┐
│  AVENTRA ADMIN                      │
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│                                     │
│  📅 Bookings ▼                      │
│     • All Bookings                  │
│     • Booking Calendar              │
│     • Waitlist                      │
│                                     │
│  🎯 Marketing ▼                     │
│     • Promo Codes                   │
│     • Email Templates               │
│     • Campaign Manager              │
│     • Analytics                     │
│                                     │
│  👥 Customers ▼                     │
│     • Customer List                 │
│     • Customer Groups               │
│     • Communication Logs            │
│                                     │
│  🗺️ Tours ▼                         │
│     • Tour Management               │
│     • Pricing & Availability        │
│     • Itineraries                   │
│     • Add-ons                       │
│                                     │
│  💰 Finance ▼                       │
│     • Payments & Refunds            │
│     • Invoices                      │
│     • Reports                       │
│     • Fortnox Integration           │
│                                     │
│  ⚙️ Settings ▼                      │
│     • Company Info                  │
│     • User Management               │
│     • Roles & Permissions           │
│     • Email Settings                │
│     • System Logs                   │
└─────────────────────────────────────┘
```

### 2. File Structure (Feature-Based)

```
src/
├── features/                    # Feature modules
│   ├── bookings/
│   │   ├── components/
│   │   │   ├── BookingCard.tsx
│   │   │   ├── BookingFilters.tsx
│   │   │   └── BookingDetailsPanel.tsx
│   │   ├── pages/
│   │   │   ├── BookingList.tsx
│   │   │   ├── BookingCalendar.tsx
│   │   │   └── WaitlistManager.tsx
│   │   ├── hooks/
│   │   │   ├── useBookings.ts
│   │   │   └── useBookingFilters.ts
│   │   ├── services/
│   │   │   └── booking.service.ts
│   │   ├── types/
│   │   │   └── booking.types.ts
│   │   └── constants/
│   │       └── booking.constants.ts
│   │
│   ├── customers/
│   │   ├── components/
│   │   │   ├── CustomerCard.tsx
│   │   │   └── CustomerDetailsPanel.tsx
│   │   ├── pages/
│   │   │   ├── CustomerList.tsx
│   │   │   └── CustomerGroups.tsx
│   │   ├── services/
│   │   │   └── customer.service.ts
│   │   └── types/
│   │       └── customer.types.ts
│   │
│   ├── marketing/
│   │   ├── components/
│   │   │   ├── PromoCodeCard.tsx
│   │   │   └── EmailTemplateEditor.tsx
│   │   ├── pages/
│   │   │   ├── PromoCodeManager.tsx
│   │   │   ├── EmailTemplates.tsx
│   │   │   └── CampaignManager.tsx
│   │   ├── services/
│   │   │   ├── promo.service.ts
│   │   │   └── email.service.ts
│   │   └── types/
│   │       ├── promo.types.ts
│   │       └── email.types.ts
│   │
│   ├── tours/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── finance/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   │
│   └── settings/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── types/
│
├── shared/                      # Shared across features
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Basic UI elements
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── PageContainer.tsx
│   │   └── data/                # Data display components
│   │       ├── DataTable.tsx
│   │       ├── StatCard.tsx
│   │       └── Chart.tsx
│   │
│   ├── hooks/                   # Reusable hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── usePagination.ts
│   │   └── useSearch.ts
│   │
│   ├── utils/                   # Helper functions
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── validation.utils.ts
│   │   └── format.utils.ts
│   │
│   ├── types/                   # Shared types
│   │   ├── common.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── constants/               # App-wide constants
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   └── index.ts
│   │
│   └── services/                # Core services
│       ├── api.service.ts
│       ├── auth.service.ts
│       └── storage.service.ts
│
├── context/                     # React contexts
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
│
└── routes/                      # Route configuration
    ├── AppRoutes.tsx
    ├── ProtectedRoute.tsx
    └── routeConfig.ts
```

---

## 🎨 Component Design Patterns

### 1. Feature Module Pattern
Each feature is self-contained with its own:
- Components (UI)
- Pages (routes)
- Services (API calls)
- Types (TypeScript definitions)
- Hooks (custom logic)
- Constants (feature-specific values)

### 2. Shared Components Pattern
```typescript
// shared/components/ui/Button.tsx
export const Button = ({ variant, size, children, ...props }) => {
  // Reusable button component
};

// shared/components/data/DataTable.tsx
export const DataTable = ({ columns, data, onRowClick }) => {
  // Reusable table component
};
```

### 3. Service Layer Pattern
```typescript
// features/bookings/services/booking.service.ts
export const BookingService = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
};
```

---

## 🔄 Migration Strategy

### Phase 1: Navigation Structure (Week 1)
1. Create new Sidebar component with categories
2. Define menu structure in config file
3. Implement collapsible menus
4. Add icons and active states
5. Test responsiveness

### Phase 2: Type Definitions (Week 1-2)
1. Create feature-specific type files
2. Move types from types.ts to feature folders
3. Create shared types folder
4. Update all imports
5. Remove old types.ts

### Phase 3: Feature Modules (Week 2-3)
1. Create feature folders
2. Move existing pages to feature/pages
3. Extract reusable components
4. Create feature services
5. Update imports and routes

### Phase 4: Shared Components (Week 3-4)
1. Identify reusable components
2. Create shared/components structure
3. Extract and refactor components
4. Update all usages
5. Document component APIs

### Phase 5: Utils & Hooks (Week 4)
1. Create shared utilities
2. Extract custom hooks
3. Create constants files
4. Update all imports

---

## 📝 Naming Conventions

### Files
- **Components:** PascalCase (e.g., `BookingCard.tsx`)
- **Services:** camelCase with .service (e.g., `booking.service.ts`)
- **Types:** camelCase with .types (e.g., `booking.types.ts`)
- **Hooks:** camelCase with use prefix (e.g., `useBookings.ts`)
- **Utils:** camelCase with .utils (e.g., `date.utils.ts`)
- **Constants:** camelCase with .constants (e.g., `booking.constants.ts`)

### Exports
```typescript
// Named exports for components
export const BookingCard = () => { ... };

// Default exports for pages
export default function BookingList() { ... }

// Named exports for services
export const BookingService = { ... };
```

---

## 🔐 Access Control

### Route Configuration
```typescript
// routes/routeConfig.ts
export const routes = {
  dashboard: { path: '/admin', roles: ['ADMIN', 'SUPPORT'] },
  bookings: {
    list: { path: '/admin/bookings', roles: ['ADMIN', 'SUPPORT'] },
    create: { path: '/admin/bookings/new', roles: ['ADMIN'] },
  },
  marketing: {
    promoCodes: { path: '/admin/marketing/promo-codes', roles: ['ADMIN'] },
  },
};
```

---

## 🧪 Testing Structure

```
src/
└── features/
    └── bookings/
        ├── components/
        │   ├── BookingCard.tsx
        │   └── BookingCard.test.tsx
        ├── services/
        │   ├── booking.service.ts
        │   └── booking.service.test.ts
        └── hooks/
            ├── useBookings.ts
            └── useBookings.test.ts
```

---

## 👥 Team Collaboration Benefits

### 1. Reduced Merge Conflicts
- Each developer works in their own feature folder
- Minimal overlap in file changes
- Clear ownership of features

### 2. Easy Onboarding
- New developers can focus on one feature
- Clear structure to understand
- Self-contained modules

### 3. Parallel Development
- Multiple features can be developed simultaneously
- Clear boundaries between features
- Easy to review PRs

### 4. Code Reusability
- Shared components prevent duplication
- Utils and hooks available to all
- Consistent patterns

---

## 📊 Example: Before vs After

### Before (Current)
```
pages/admin/
├── AdminDashboard.tsx
├── BookingManager.tsx
├── CustomerManager.tsx
├── WaitlistManager.tsx
└── PromoCodeManager.tsx

types.ts (500+ lines)
services/api.ts (700+ lines)
```

### After (Proposed)
```
features/
├── bookings/
│   ├── pages/
│   │   ├── BookingList.tsx
│   │   └── WaitlistManager.tsx
│   └── types/
│       └── booking.types.ts (50 lines)
│
├── customers/
│   ├── pages/
│   │   └── CustomerList.tsx
│   └── types/
│       └── customer.types.ts (30 lines)
│
└── marketing/
    ├── pages/
    │   └── PromoCodeManager.tsx
    └── types/
        └── promo.types.ts (40 lines)
```

---

## 🚀 Implementation Plan

### Step 1: Create New Structure (This session)
- [ ] Create feature folders
- [ ] Create shared folders
- [ ] Set up navigation config

### Step 2: Implement Sidebar (This session)
- [ ] Create Sidebar component
- [ ] Add collapsible menus
- [ ] Style with categories

### Step 3: Migrate Types (Next session)
- [ ] Split types.ts
- [ ] Move to feature folders
- [ ] Update imports

### Step 4: Migrate Components (Next session)
- [ ] Move pages to features
- [ ] Extract shared components
- [ ] Update routes

---

## ✅ Success Criteria

- ✅ Clear feature boundaries
- ✅ Easy to find code
- ✅ Minimal merge conflicts
- ✅ Fast onboarding
- ✅ Reusable components
- ✅ Scalable structure
- ✅ Clean navigation

---

**Ready to implement?** Let's start with the navigation structure and then move to file organization!
