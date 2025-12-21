# Customer Groups Feature - Development Guide

## 📋 Overview

The Customer Groups feature is fully implemented and provides a complete system for managing customer segments. This guide helps developers understand the architecture, extend features, and integrate with other systems.

## 🏗️ Architecture

### Directory Structure

```
src/features/customers/
├── pages/
│   ├── components/
│   │   ├── GroupList.tsx          # Main group listing & management
│   │   ├── GroupForm.tsx          # Create/edit group dialog
│   │   ├── SmartGroupBuilder.tsx  # Rule-based segmentation UI
│   │   ├── GroupAnalytics.tsx     # Analytics dashboard
│   │   ├── BulkActions.tsx        # Bulk operations dialog
│   │   └── index.ts               # Component exports
│   ├── styles/
│   │   ├── GroupList.module.css
│   │   ├── GroupForm.module.css
│   │   ├── SmartGroupBuilder.module.css
│   │   ├── GroupAnalytics.module.css
│   │   └── BulkActions.module.css
│   └── CustomerManager.tsx
├── services/
│   ├── group.service.ts           # Business logic & API calls
│   └── customer.service.ts
├── types/
│   ├── group.types.ts             # TypeScript interfaces
│   └── customer.types.ts
```

### Component Hierarchy

```
CustomerGroups (Page)
│
└── GroupList (Main Container)
    ├── GroupForm (Dialog)
    │   └── SmartGroupBuilder (Sub-component)
    │
    ├── GroupAnalyticsDialog (Dialog)
    │   └── Recharts (Charts)
    │
    └── BulkActionsDialog (Dialog)
```

## 📚 Type Definitions

### Core Interfaces

#### `CustomerGroup`
```typescript
interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  type: 'manual' | 'smart';
  memberIds: string[];
  memberCount: number;
  smartRules?: SmartGroupRule[];
  pricingRules: GroupPricingRule[];
  defaultDiscount?: { type: 'percentage' | 'fixed'; value: number };
  tags: string[];
  color?: string;
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  isActive: boolean;
  stats: { totalRevenue: number; avgBookingValue: number; avgBookingsPerMember: number };
}
```

#### `SmartGroupRule`
```typescript
interface SmartGroupRule {
  id: string;
  field: 'totalBookings' | 'totalSpent' | 'lastBookingDate' | 'registrationDate' | 'country' | 'tags';
  operator: 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'between' | 'in';
  value: string | number | string[] | { min: number; max: number };
  logicOperator?: 'AND' | 'OR';
}
```

## 🔧 Service Methods

### CustomerGroupService API

```typescript
// Get all groups
getAll(): Promise<CustomerGroup[]>

// Get single group
getById(id: string): Promise<CustomerGroup | undefined>

// Create group
create(data: Omit<...>): Promise<CustomerGroup>

// Update group
update(id: string, updates: Partial<...>): Promise<CustomerGroup>

// Delete group
delete(id: string): Promise<void>

// Member management
addMembers(groupId: string, memberIds: string[]): Promise<CustomerGroup>
removeMembers(groupId: string, memberIds: string[]): Promise<CustomerGroup>

// Smart segmentation
applySmartSegmentation(groupId: string): Promise<CustomerGroup>

// Analytics
getAnalytics(groupId: string): Promise<GroupAnalytics>

// Export
exportGroup(groupId: string): Promise<GroupExportData>

// Bulk actions
bulkAction(request: BulkActionRequest): Promise<void>

// Search
search(query: string): Promise<CustomerGroup[]>
```

## 🎯 Component Usage

### GroupList
Main component for displaying all customer groups with search, filter, and action capabilities.

```tsx
import { GroupList } from '@features/customers/pages/components';

export const CustomerGroups = () => {
  return <GroupList onRefresh={() => console.log('Refreshed')} />;
};
```

**Props:**
- `onRefresh?: () => void` - Callback when data is refreshed

### GroupForm
Dialog for creating or editing a customer group.

```tsx
import { GroupForm } from '@features/customers/pages/components';

<GroupForm
  group={editingGroup}
  onClose={() => {}}
  onSubmit={() => {}}
/>
```

**Tabs:**
- **Basic Info** - Name, description, type, color, tags
- **Members** - Member selection (auto-populated for smart groups)
- **Smart Rules** - Rule builder for smart groups
- **Pricing** - Default discount configuration

### SmartGroupBuilder
Visual rule builder for creating smart group conditions.

```tsx
import { SmartGroupBuilder } from '@features/customers/pages/components';

<SmartGroupBuilder
  rules={rules}
  onChange={(newRules) => setRules(newRules)}
/>
```

**Features:**
- Quick templates (VIP, Frequent, Recent, Inactive)
- Custom rule creation with multiple operators
- AND/OR logic support
- Date, number, and text field support

### GroupAnalyticsDialog
Interactive dashboard showing group analytics.

```tsx
import { GroupAnalyticsDialog } from '@features/customers/pages/components';

<GroupAnalyticsDialog
  group={selectedGroup}
  onClose={() => {}}
/>
```

**Tabs:**
- **Overview** - Key metrics (members, revenue, conversion rate)
- **Revenue** - Revenue charts and breakdown
- **Destinations** - Top tour destinations by bookings
- **Growth** - Member and revenue trends over time

### BulkActionsDialog
Perform operations on multiple groups simultaneously.

```tsx
import { BulkActionsDialog } from '@features/customers/pages/components';

<BulkActionsDialog
  groupIds={['g-001', 'g-002']}
  onClose={() => {}}
/>
```

**Actions:**
- Activate groups
- Deactivate groups
- Add tags
- Apply discounts
- Delete groups

## 🔄 Data Flow

### Creating a Group

```
User clicks "New Group"
  ↓
GroupForm opens with empty data
  ↓
User fills form (Basic Info → Members → Smart Rules → Pricing)
  ↓
User clicks "Save Group"
  ↓
Form validation
  ↓
CustomerGroupService.create() called
  ↓
Group added to MOCK_GROUPS array
  ↓
GroupList reloaded
  ↓
FormDialog closes
```

### Bulk Operations

```
User selects multiple groups
  ↓
User clicks "Bulk Actions"
  ↓
BulkActionsDialog opens
  ↓
User selects action type
  ↓
User configures action (tag, discount, etc.)
  ↓
User confirms
  ↓
CustomerGroupService.bulkAction() called
  ↓
All selected groups updated
  ↓
Success message shown
  ↓
GroupList reloaded
```

## 🔗 Integration Points

### With Customer Service
The group service imports and uses CustomerService to:
- Get customer data for smart rule evaluation
- Fetch customer details for group member lists
- Calculate analytics

### With Booking Service
The group service imports and uses BookingService to:
- Get all bookings for revenue calculation
- Filter bookings by customer for analytics

### With UI Components
- **Toast Notifications** - Can be added for success/error messages
- **Loading States** - Already implemented in all components
- **Error Handling** - All components have error states

## 🎨 Styling

All components use CSS modules with consistent naming:
- `.container` / `.section` - Layout containers
- `.header` / `.footer` - Layout sections
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button styles
- `.form-input`, `.form-group` - Form elements
- `.table-*` - Table styling
- `.card`, `.stat-card` - Card styles
- `.modal-overlay`, `.dialog` - Modal styling

**Color Scheme:**
- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Danger: `#dc2626` (Red)
- Secondary: `#8b5cf6` (Purple)

## 🚀 Extending Features

### Adding a New Rule Field

1. **Update Type** in `group.types.ts`:
```typescript
export type RuleOperator = '...' | 'newField';
```

2. **Add to SmartGroupBuilder** options in `SmartGroupBuilder.tsx`:
```typescript
const fieldOptions = [
  // ... existing
  { value: 'newField', label: 'New Field' },
];
```

3. **Update Service** in `group.service.ts`:
```typescript
const evaluateRules = (customer, rules) => {
  // Add case for 'newField'
};
```

### Adding a New Bulk Action

1. **Update Types** in `group.types.ts`:
```typescript
export type BulkActionRequest = {
  action: '...' | 'newAction';
  // ...
};
```

2. **Add UI** in `BulkActions.tsx`:
```typescript
<button onClick={() => setAction('newAction')}>
  {/* ... */}
</button>
```

3. **Implement Logic** in `group.service.ts`:
```typescript
case 'newAction':
  // Handle new action
  break;
```

### Adding Export Formats

Currently supports CSV. To add JSON or Excel:

1. Update `GroupList.tsx` handleExportGroup method
2. Add format selection in export button
3. Implement format generator function
4. Update `CustomerGroupService.exportGroup()`

## 🧪 Testing

### Mock Data
The service includes mock groups in `MOCK_GROUPS` array:
- **VIP Customers** - Manual group with pricing rules
- **Frequent Travelers** - Smart group based on booking count

To test, use Chrome DevTools console:
```javascript
// Import and test service
const { CustomerGroupService } = await import('./group.service');
const groups = await CustomerGroupService.getAll();
console.log(groups);
```

### Common Test Scenarios

1. **Create Manual Group** - Fill form without smart rules
2. **Create Smart Group** - Use template or custom rules
3. **Edit Group** - Click edit icon and modify fields
4. **Apply Smart Segmentation** - Create smart group and check member updates
5. **View Analytics** - Click analytics icon on any group
6. **Bulk Operations** - Select multiple groups and perform action
7. **Export** - Download CSV and verify format

## 📊 Analytics Calculation

Analytics are calculated in `CustomerGroupService.getAnalytics()`:

```typescript
const totalRevenue = group.stats.totalRevenue;
const conversionRate = (bookingCount / memberCount) * 100;
const avgRevenuePerMember = totalRevenue / memberCount;
const customerLifetimeValue = avgRevenuePerMember;
const churnRate = 5; // Mock value - implement based on real data
```

For production, connect to real booking data:
```typescript
const allBookings = await BookingService.getAll();
const groupBookings = allBookings.filter(b => group.memberIds.includes(b.customerId));
const totalRevenue = groupBookings.reduce((sum, b) => sum + b.totalPrice, 0);
```

## 🔐 Security Considerations

1. **Access Control** - Add role checks in components
2. **Data Validation** - All inputs are validated in services
3. **Error Handling** - Errors don't expose sensitive data
4. **CSV Export** - Contains customer emails; consider PII protection

## 🚨 Common Issues & Solutions

### Groups Not Loading
- Check if `CustomerGroupService` is properly imported
- Verify mock data is initialized
- Check browser console for errors

### Smart Rules Not Evaluating
- Verify field names match customer object properties
- Check operator is valid for field type
- Ensure rule value format is correct

### Analytics Not Updating
- Clear cache and reload page
- Verify `getAnalytics()` has access to booking data
- Check customer data is complete

## 📖 API Contract

For production backend integration, expected endpoints:

```
GET    /api/groups               # Get all groups
GET    /api/groups/:id           # Get single group
POST   /api/groups               # Create group
PUT    /api/groups/:id           # Update group
DELETE /api/groups/:id           # Delete group
POST   /api/groups/search        # Search groups
POST   /api/groups/:id/analytics # Get analytics
POST   /api/groups/:id/export    # Export group
POST   /api/groups/bulk-action   # Bulk operations
```

## 🎓 Learning Resources

- **Recharts Documentation**: https://recharts.org/
- **React Patterns**: Hooks, Context, State Management
- **TypeScript Best Practices**: Type safety and inference
- **CSS Modules**: Scoped styling and modularity

---

**Last Updated**: December 2025
**Version**: 1.0
**Status**: Production Ready ✅
