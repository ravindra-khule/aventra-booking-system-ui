# Customer Groups - Visual Reference & User Guide

## 🎨 UI Layout Overview

### Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ [AppBar] Customer Groups                              [Refresh]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐      │
│  │ Total Groups│Active Groups│Total Members│Total Revenue│      │
│  │     15      │      12     │     450     │   $1.25M    │      │
│  └─────────────┴─────────────┴─────────────┴─────────────┘      │
│                                                                   │
│                                          [Bulk Actions] [New +]  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [Search box: Search groups by name...]                     │ │
│  ├────┬──────────────┬──────┬─────────┬────────┬──────┬──────┤ │
│  │ ☐  │ Group Name   │ Type │ Members │Revenue │ Tags │ ... │ │
│  ├────┼──────────────┼──────┼─────────┼────────┼──────┼──────┤ │
│  │ ☑  │ VIP Customers│Manual│    2    │ $45K  │●●    │👁️⏰🗑️ │ │
│  │ ☐  │ Frequent     │Smart │    3    │ $72K  │●●    │👁️⏰🗑️ │ │
│  │ ☐  │ ...          │      │         │       │      │      │ │
│  └────┴──────────────┴──────┴─────────┴────────┴──────┴──────┘ │
│                           [< Prev] [1 - 10 of 15] [Next >]      │
│                                                                   │
│                                              [+] Create New Group│
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Dialog Interfaces

### Create/Edit Group Form
```
┌──────────────────────────────────────────────────────────┐
│ Create New Customer Group                          [x]   │
├──────────────────────────────────────────────────────────┤
│ [Basic Info] [Members] [Pricing] [Tags & Settings]      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Group Name:   [VIP Customers            ]                │
│                                                           │
│ Description:  [High-value customers with...             │
│                premium bookings                          ]│
│                                                           │
│ Type:         [Manual ▼]  |  [Smart ▼]                 │
│                                                           │
│ Status:       [☑ Active]  Color: [████]  #4CAF50         │
│                                                           │
│                                                           │
│                           [Cancel] [Create Group]        │
└──────────────────────────────────────────────────────────┘
```

### Members Tab
```
┌──────────────────────────────────────────────────────────┐
│ Members Tab                                              │
│ Selected: 2 / 150 customers                             │
├──────────────────────────────────────────────────────────┤
│ ☑ John Smith                                             │
│   john.smith@email.com | Bookings: 5 | Spent: $12,500   │
│                                                           │
│ ☑ Jane Doe                                               │
│   jane.doe@email.com | Bookings: 8 | Spent: $18,300     │
│                                                           │
│ ☐ Robert Johnson                                         │
│   robert@email.com | Bookings: 3 | Spent: $8,200        │
│                                                           │
│ [scroll...]                                              │
│                                                           │
│                           [Cancel] [Update Group]        │
└──────────────────────────────────────────────────────────┘
```

### Analytics Dashboard
```
┌──────────────────────────────────────────────────────────┐
│ VIP Customers - Analytics                          [x]   │
├──────────────────────────────────────────────────────────┤
│ [Overview] [Revenue] [Destinations] [Growth]            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┬─────────────┬──────────┬──────────────┐ │
│  │Members      │Total Revenue│Avg Value │Conversion   │ │
│  │     2       │   $45,000   │  $2,500  │    85.5%    │ │
│  └─────────────┴─────────────┴──────────┴──────────────┘ │
│                                                           │
│  Revenue Potential:  ████░░░░░░ 45%  |  Engagement: 85.5%│
│  Retention:         ███████░░░░░░  93%                    │
│                                                           │
│ Key Insights:                                             │
│ • High revenue potential with strong engagement          │
│ • Low churn rate indicates loyal customers               │
│ • Top destinations: Europe Tours, Asia Adventures        │
│                                                           │
│                                                [Close]    │
└──────────────────────────────────────────────────────────┘
```

### Smart Rules Builder
```
┌──────────────────────────────────────────────────────────┐
│ Smart Group Builder - Auto-Segmentation Rules      [x]   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Rule 1:                                                   │
│  [Total Bookings ▼] [>= ▼] [3] [X]                      │
│  [AND ▼] (connects to next rule)                        │
│                                                           │
│ Rule 2:                                                   │
│  [Total Spent ▼] [> ▼] [5000] [X]                       │
│                                                           │
│                          [+ Add Rule]                    │
│                                                           │
│ Quick Templates:                                          │
│ [VIP ($5000+)] [Frequent (3+ bookings)] [Recent (30d)]  │
│                                                           │
│ ℹ️ AND = All rules must match (strict)                   │
│    OR = Any rule can match (broad)                       │
│                                                           │
│                     [Cancel] [Save Rules]                │
└──────────────────────────────────────────────────────────┘
```

### Bulk Actions Dialog
```
┌──────────────────────────────────────────────────────────┐
│ Bulk Actions - 3 Groups Selected                    [x]   │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ Select Action:                                            │
│ ◉ Activate Groups                                         │
│ ○ Deactivate Groups                                       │
│ ○ Add Tag                                                 │
│ ○ Apply Discount                                          │
│ ○ Delete Groups                                           │
│                                                           │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ [Input field depends on action]                      │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                           │
│ 📋 Action Preview:                                        │
│ Activate 3 selected groups                               │
│                                                           │
│                     [Cancel] [Execute Action]            │
└──────────────────────────────────────────────────────────┘
```

## 🎯 User Workflows

### Workflow 1: Create VIP Group (Manual)
```
START
  ↓
[Click "New Group" button]
  ↓
Enter group details:
  • Name: "VIP Customers"
  • Description: "High-value customers"
  • Type: "Manual"
  ↓
[Go to Members tab]
  ↓
Select customers:
  ☑ John Smith ($12,500 spent)
  ☑ Jane Doe ($18,300 spent)
  ↓
[Go to Pricing tab]
  ↓
Set discount:
  • Type: Percentage
  • Value: 10%
  ↓
[Go to Tags tab]
  ↓
Add tags:
  [+ Add "premium"]
  ↓
[Click "Create Group"]
  ↓
Group created! ✅
```

### Workflow 2: Create Auto-Segmenting Group
```
START
  ↓
[Click "New Group" button]
  ↓
Enter: Name = "Recent Bookers"
       Type = "Smart"
  ↓
[Go to Rules tab - opens Smart Group Builder]
  ↓
Add rule:
  • Field: Last Booking Date
  • Operator: Greater Than
  • Value: 30 days ago
  ↓
[Click "Save Rules"]
  ↓
Members automatically populated! 🎉
Group updated based on rule matches
```

### Workflow 3: View Analytics
```
START
  ↓
Find group in list
  ↓
Click "View Analytics" icon (📊)
  ↓
Analytics Dialog opens
  ↓
Browse tabs:
  [Overview] → Key metrics & insights
  [Revenue] → Breakdown by destination
  [Destinations] → Top tours & preferences
  [Growth] → Member & revenue trends
  ↓
[Close dialog]
```

### Workflow 4: Bulk Tag Groups
```
START
  ↓
Select multiple groups:
  ☑ VIP Customers
  ☑ Frequent Travelers
  ☑ Recent Bookers
  ↓
[Click "Bulk Actions (3)" button]
  ↓
Select action: "Add Tag"
  ↓
Enter tag: "seasonal"
  ↓
[Click "Execute Action"]
  ↓
All 3 groups tagged! ✅
Confirmation notification shown
```

## 🔄 State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                 CustomerGroups Component                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ State Variables:                                         │
│  • groups: CustomerGroup[]                              │
│  • loading: boolean                                      │
│  • formOpen: boolean                                     │
│  • editingGroup: CustomerGroup | undefined              │
│  • analyticsOpen: boolean                               │
│  • selectedGroupIds: Set<string>                        │
│  • smartBuilderOpen: boolean                            │
│  • bulkActionsOpen: boolean                             │
│                                                          │
│ Effects:                                                 │
│  • useEffect(() => loadGroups(), [])                    │
│                                                          │
│ Handlers:                                                │
│  • loadGroups() → fetch from service                    │
│  • handleCreateGroup() → open form                      │
│  • handleSaveGroup() → service.create/update            │
│  • handleAnalytics() → open analytics                   │
│  • handleBulkActions() → service.bulkAction             │
│                                                          │
│ Child Components:                                        │
│  • GroupList → displays groups, emits events            │
│  • GroupForm → dialog for create/edit                   │
│  • GroupAnalytics → analytics dashboard                 │
│  • SmartGroupBuilder → rule editor                      │
│  • BulkActions → batch operations                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

```
┌────────────────────────┐
│  CustomerGroupService  │
│  (Mock Data Service)   │
└───────────┬────────────┘
            │
     ┌──────┴──────┬─────────┬───────────┬──────────┐
     │             │         │           │          │
  getAll()      create()  update()   delete()  bulkAction()
     │             │         │           │          │
     └──────┬──────┴────────┬┴─────────┬─┴──────────┘
            │               │         │
         Return        Return       Return
       Groups[]      Group|void    void
            │               │         │
     ┌──────v──────┬────────v────┬──v──────────┐
     │  GroupList  │  GroupForm  │ Bulk Dialog │
     │  (display)  │  (form)     │ (actions)   │
     └─────────────┴─────────────┴─────────────┘
            │
    ┌───────v──────────┐
    │  React Component │
    │  State Updates   │
    │  Re-render UI    │
    └──────────────────┘
```

## 🎬 Interactive Elements Reference

| Element | Type | Action | Result |
|---------|------|--------|--------|
| "New Group" | Button | Click | Opens GroupForm dialog |
| "Refresh" | Button | Click | Reloads groups from service |
| Group Row | Table Row | Click | Selects/deselects (checkbox) |
| Group Row | Table Row | Click (outside checkbox) | Edits group (opens form) |
| "View Analytics" | Icon Button | Click | Opens analytics dialog |
| "Export" | Icon Button | Click | Downloads CSV file |
| "Edit" | Icon Button | Click | Opens form for editing |
| "Delete" | Icon Button | Click | Shows delete confirmation |
| "Bulk Actions" | Button | Click | Opens bulk actions dialog |
| Search Field | TextField | Type | Filters groups in real-time |
| Pagination | Controls | Click | Changes table page |
| Tab Navigation | Tabs | Click | Switches dialog tabs |

## 🎨 Color Scheme

| Component | Color | Hex Code |
|-----------|-------|----------|
| Primary (Buttons) | Blue | #1976d2 |
| Success (Active) | Green | #4CAF50 |
| Warning (Inactive) | Orange | #FF9800 |
| Error (Delete) | Red | #d32f2f |
| Info (Secondary) | Light Blue | #2196F3 |
| Background | Light Gray | #fafafa |
| Card Background | White | #ffffff |
| Text Primary | Dark Gray | #000000 |
| Text Secondary | Medium Gray | #666666 |

## 📱 Responsive Behavior

```
Desktop (> 1200px):
  • Full table with all columns visible
  • 4-column statistics grid
  • Inline action buttons

Tablet (768-1200px):
  • Collapsible columns
  • 2-column statistics grid
  • Dropdown action menu

Mobile (< 768px):
  • Single column table
  • Stacked statistics
  • Bottom sheet for actions
  • Simplified dialogs
```

## 🔑 Keyboard Shortcuts (Planned)

```
Ctrl/Cmd + N    → New Group
Ctrl/Cmd + F    → Focus search
Ctrl/Cmd + E    → Export selected
Escape          → Close dialog
Enter           → Save/Submit
```

---

**Visual Reference Version**: 1.0  
**Last Updated**: December 12, 2025
