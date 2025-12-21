# Customer Groups Feature - Implementation Guide

## 📋 Overview

The Customer Groups feature enables comprehensive customer segmentation, management, and analytics. This implementation includes manual and smart (auto-segmentation) groups with powerful tools for grouping, pricing, analytics, and bulk operations.

**Location**: `http://localhost:3000/#/admin/customers/groups`

## ✨ Features Implemented

### 1. **Custom Customer Segments**
- Create manual groups by selecting specific customers
- Support for VIPs, frequent travelers, and other custom segments
- Tag-based organization for flexible categorization
- Color-coded groups for easy visual identification

### 2. **Auto-Segmentation (Smart Groups)**
- Dynamic rules-based grouping
- Supports multiple conditions (AND/OR logic)
- Rule types:
  - **Numeric**: Total Bookings, Total Spent (equals, >, <, >=, <=, between)
  - **Temporal**: Last Booking Date, Registration Date (equals, >, <, between)
  - **Categorical**: Country, Tags (equals, in, contains)
- Quick templates for common segments (VIP, Frequent Travelers, etc.)
- Automatic member updates based on rule changes

### 3. **Group-Specific Pricing & Discounts**
- Default group-level discounts (percentage or fixed amount)
- Tour-specific pricing rules per group
- Flexible discount configuration
- Export-ready pricing data

### 4. **Bulk Actions on Customer Groups**
- **Activate/Deactivate**: Enable or disable multiple groups
- **Add Tags**: Apply tags to multiple groups at once
- **Apply Discounts**: Set default discounts for multiple groups
- **Delete**: Remove multiple groups (with confirmation)
- Batch processing with confirmation dialogs

### 5. **Group Analytics & Insights**
- **Overview Dashboard**:
  - Member count
  - Total revenue
  - Average revenue per member
  - Conversion rate
  - Customer lifetime value
  - Churn rate
  - Key insight visualizations

- **Revenue Analytics**:
  - Revenue breakdown by destination
  - Average booking value analysis
  - Revenue trends

- **Destination Insights**:
  - Top destination tours
  - Booking counts and revenue per tour
  - Destination preferences

- **Growth Tracking**:
  - Member growth trends
  - Revenue growth over time
  - Historical comparisons

### 6. **Export Group Data for Marketing**
- Export group member lists as CSV
- Includes customer names, emails, totals
- One-click download functionality
- Formatted for marketing campaigns

### 7. **Tag-Based Organization**
- Create and manage unlimited tags
- Apply multiple tags per group
- Search and filter by tags
- Tag-based smart group rules

### 8. **Smart Group Features**
- Rule builder interface with visual editor
- Template suggestions for quick setup
- Logic operators (AND/OR) for complex rules
- Real-time rule evaluation
- Automatic segmentation application

## 📁 File Structure

```
src/features/customers/
├── types/
│   ├── customer.types.ts (updated with group exports)
│   └── group.types.ts (NEW - Type definitions)
├── services/
│   ├── customer.service.ts (existing)
│   └── group.service.ts (NEW - Business logic)
├── pages/
│   └── components/
│       ├── GroupList.tsx (NEW - Main table view)
│       ├── GroupForm.tsx (NEW - Create/Edit dialog)
│       ├── GroupAnalytics.tsx (NEW - Analytics dashboard)
│       ├── SmartGroupBuilder.tsx (NEW - Rule builder)
│       ├── BulkActions.tsx (NEW - Bulk operations)
│       └── index.ts (NEW - Component exports)
└── pages.tsx (reference in admin pages)

pages/admin/customers/
└── CustomerGroups.tsx (UPDATED - Main integration component)
```

## 🔧 Type Definitions

### Core Types

**CustomerGroup**
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
  isActive: boolean;
  stats: { totalRevenue: number; avgBookingValue: number; /* ... */ };
}
```

**SmartGroupRule**
```typescript
interface SmartGroupRule {
  id: string;
  field: 'totalBookings' | 'totalSpent' | 'lastBookingDate' | /* ... */;
  operator: RuleOperator; // 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'between' | 'in'
  value: string | number | string[] | { min: number; max: number };
  logicOperator?: 'AND' | 'OR';
}
```

**GroupAnalytics**
```typescript
interface GroupAnalytics {
  groupId: string;
  memberCount: number;
  totalRevenue: number;
  avgRevenuePerMember: number;
  conversionRate: number;
  topDestinations: Array<{ tourId: string; bookingCount: number; revenue: number }>;
  growthTrend: Array<{ date: string; memberCount: number; revenue: number }>;
  // ... additional metrics
}
```

## 🚀 API Service Methods

### CustomerGroupService

```typescript
// CRUD Operations
CustomerGroupService.getAll() // Get all groups
CustomerGroupService.getById(id) // Get single group
CustomerGroupService.create(data) // Create new group
CustomerGroupService.update(id, updates) // Update group
CustomerGroupService.delete(id) // Delete group

// Member Management
CustomerGroupService.addMembers(groupId, memberIds)
CustomerGroupService.removeMembers(groupId, memberIds)

// Smart Segmentation
CustomerGroupService.applySmartSegmentation(groupId) // Apply rules

// Analytics & Export
CustomerGroupService.getAnalytics(groupId) // Get detailed analytics
CustomerGroupService.exportGroup(groupId) // Export as CSV data

// Bulk Operations
CustomerGroupService.bulkAction(request) // Execute bulk actions

// Search
CustomerGroupService.search(query) // Search by name, description, tags
```

## 💡 Usage Examples

### Create a Manual Group
```typescript
const newGroup = await CustomerGroupService.create({
  name: 'VIP Customers',
  description: 'High-value customers',
  type: 'manual',
  memberIds: ['c-001', 'c-002'],
  memberCount: 2,
  pricingRules: [],
  defaultDiscount: { type: 'percentage', value: 10 },
  tags: ['premium'],
  isActive: true,
  createdBy: 'admin',
  updatedDate: new Date().toISOString(),
});
```

### Create a Smart Group
```typescript
const smartGroup = await CustomerGroupService.create({
  name: 'Frequent Travelers',
  description: 'Customers with 3+ bookings',
  type: 'smart',
  memberIds: [],
  smartRules: [
    {
      id: 'r-1',
      field: 'totalBookings',
      operator: 'gte',
      value: 3,
    }
  ],
  // ... other properties
});

// Apply the rules to populate members
await CustomerGroupService.applySmartSegmentation(smartGroup.id);
```

### Get Group Analytics
```typescript
const analytics = await CustomerGroupService.getAnalytics(groupId);
// Returns detailed metrics, charts data, and insights
```

### Bulk Operations
```typescript
await CustomerGroupService.bulkAction({
  groupIds: ['g-001', 'g-002', 'g-003'],
  action: 'applyDiscount',
  payload: {
    discountType: 'percentage',
    discountValue: 15
  }
});
```

## 🎨 UI Components

### GroupList
- Table display of all groups
- Search and filter functionality
- Select multiple groups for bulk actions
- Edit, delete, analytics, export actions
- Pagination support

### GroupForm (Create/Edit)
- Multi-tab interface:
  - **Basic Info**: Name, description, type, status
  - **Members**: Customer selection
  - **Pricing**: Default discount configuration
  - **Tags & Settings**: Tag management and group settings

### GroupAnalytics
- 4 analytical tabs:
  - **Overview**: Key metrics and insights
  - **Revenue**: Revenue breakdown and trends
  - **Destinations**: Top tours and preferences
  - **Growth**: Member and revenue growth trends
- Visual charts using Recharts library
- Statistical cards and progress indicators

### SmartGroupBuilder
- Drag-and-drop style rule editor
- Visual rule builder with field/operator/value
- Logic operator selection (AND/OR)
- Quick templates for common segments
- Rule validation and explanations

### BulkActions
- Action selection with descriptions
- Context-sensitive inputs (tags, discounts)
- Confirmation dialogs for destructive actions
- Progress feedback

## 🔄 Workflow Examples

### Creating a VIP Group
1. Click "New Group"
2. Name: "VIPs"
3. Description: "High-value customers"
4. Type: "Manual"
5. Select customers with high spending
6. Set 10% default discount
7. Add "premium" tag
8. Save

### Creating an Auto-Segmenting Group
1. Click "New Group"
2. Name: "Recent Bookers"
3. Type: "Smart"
4. Setup rules: "Last Booking Date > 30 days ago"
5. Save
6. Members automatically populated based on rules

### Viewing Group Analytics
1. Open any group
2. Click "View Analytics"
3. Browse 4 tabs:
   - See revenue metrics
   - Check destination preferences
   - Track growth trends

### Bulk Tagging Groups
1. Select multiple groups
2. Click "Bulk Actions"
3. Choose "Add Tag"
4. Enter tag name
5. Execute

## 📊 Mock Data

The service includes 2 pre-configured demo groups:
- **VIP Customers**: Manual group with 2 members, $45,000 revenue
- **Frequent Travelers**: Smart group with 3 members, $72,000 revenue

Modify `MOCK_GROUPS` in `group.service.ts` to customize demo data.

## 🔐 Permissions & Security

Current implementation uses mock data. For production:
- Add role-based access control (admin only)
- Validate user permissions before actions
- Implement backend API calls
- Add audit logging for group changes
- Encrypt sensitive pricing data

## 🚦 Next Steps / Future Enhancements

1. **Backend Integration**
   - Replace mock service with REST API calls
   - Implement database persistence
   - Add real-time sync

2. **Advanced Analytics**
   - Custom date range selection
   - Predictive churn analysis
   - AI-powered recommendations

3. **Automation**
   - Scheduled automatic segmentation
   - Trigger-based group membership
   - Workflow automation

4. **Integration**
   - Email campaign integration
   - CRM sync
   - Marketing platform webhooks

5. **Performance**
   - Optimize large group operations
   - Add caching for analytics
   - Batch processing for bulk actions

## 📝 Code Standards

- **Components**: React FC with TypeScript
- **Styling**: Material-UI (MUI) components
- **State Management**: React hooks
- **Data Fetching**: Async/await with delay simulation
- **Error Handling**: Try-catch with user feedback

## 📚 Dependencies

- `@mui/material` - UI components
- `@mui/icons-material` - Icons
- `recharts` - Charts and visualizations
- React 18+
- TypeScript 5+

## ✅ Testing Checklist

- [ ] Create manual group with selected members
- [ ] Create smart group with auto-segmentation rules
- [ ] Update group information (name, description, tags)
- [ ] Add/remove members from groups
- [ ] Apply smart rules and verify member updates
- [ ] View analytics dashboard with all metrics
- [ ] Export group data as CSV
- [ ] Perform bulk actions on multiple groups
- [ ] Search and filter groups by criteria
- [ ] Delete groups with confirmation

---

**Last Updated**: December 12, 2025  
**Version**: 1.0 (Initial Implementation)  
**Status**: ✅ Feature Complete & Ready for Integration
