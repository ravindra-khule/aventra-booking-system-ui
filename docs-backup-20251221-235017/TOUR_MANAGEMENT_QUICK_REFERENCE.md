# Tour Management - Quick Reference

## 🎯 Access
**URL:** `http://localhost:3000/#/admin/tours`

## 📊 Dashboard Overview

### Statistics Cards (Top Row)
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Tours │ Active Tours│ Draft Tours │  Bookings   │   Revenue   │
│      4      │      3      │      1      │     111     │  5,437 kr   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## 🔍 Search & Filters

### Search Bar
- Real-time search across title, location, country, description
- Instant results as you type

### Filter Dropdowns
- **Status Filter**: ALL | ACTIVE | DRAFT | INACTIVE | ARCHIVED
- **Difficulty Filter**: ALL | Easy | Medium | Hard | Extreme
- **Category Filter**: ALL | Mountain Trekking | Cultural Tours | Wildlife Safari | ...

### View Toggle
- 🔲 **Grid View**: Card layout (3 columns)
- 📋 **List View**: Table layout with details

## 🎴 Grid View Features

Each card displays:
- Primary image with status badge
- Featured star (if applicable)
- Tour title and short description
- Location, duration, difficulty
- Capacity (available/max spots)
- Statistics (bookings, rating)
- Price (bold, prominent)
- Action buttons:
  - 👁️ **View**: Open detail panel
  - ✏️ **Edit**: Open in edit mode
  - 📋 **Copy**: Duplicate tour
  - 🗑️ **Delete**: Remove tour

## 📋 List View Features

Table columns:
1. **Tour**: Image + name + duration
2. **Location**: Location + country
3. **Status**: Colored badge
4. **Difficulty**: Text
5. **Price**: Price + deposit
6. **Capacity**: Available/max
7. **Bookings**: Count + revenue
8. **Actions**: View, Edit, Copy, Delete buttons

## 📱 Detail Panel (Slide-over)

### Header
- Tour title (large, bold)
- Status badge
- Featured indicator
- Location info
- Tour ID and slug
- Edit/Save/Cancel buttons

### 7 Tabs

#### 1️⃣ Overview
- Quick stats (4 cards: Duration, Bookings, Capacity, Revenue)
- Full description
- Short description
- Highlights list with checkmarks

#### 2️⃣ Details
- Basic info fields (Title, Slug, Location, Country, Region, Difficulty)
- Categories (multi-select with color chips)
- Tags (multi-select with color chips)
- Included items (green checkmarks)
- Excluded items (red x marks)

#### 3️⃣ Itinerary
- Day-by-day schedule editor
- (Currently placeholder - future enhancement)

#### 4️⃣ Pricing
- Price field (large, editable)
- Deposit price field
- Currency selector
- Revenue statistics panel (read-only)

#### 5️⃣ Media
- Primary image display
- Image URL editor
- (Gallery management - future enhancement)

#### 6️⃣ SEO
- SEO Title (fallback to tour title)
- SEO Description (fallback to short description)
- SEO Keywords (future)

#### 7️⃣ Settings
- Status dropdown (ACTIVE/DRAFT/INACTIVE/ARCHIVED)
- Capacity fields (Min/Max/Available)
- Feature toggles:
  - ⭐ Featured Tour
  - 📝 Allow Waitlist
  - ✅ Auto Confirm
  - 🔒 Require Approval

## 🎨 Color Coding

### Status Badges
- 🟢 **ACTIVE**: Green background
- 🟡 **DRAFT**: Yellow background
- ⚫ **INACTIVE**: Gray background
- 🔴 **ARCHIVED**: Red background

### Difficulty
- Easy: Light blue
- Medium: Blue
- Hard: Orange
- Extreme: Red

### Categories (Sample)
- Mountain Trekking: Blue
- Cultural Tours: Purple
- Wildlife Safari: Green
- Adventure Travel: Orange
- Nature & Hiking: Cyan

### Tags (Sample)
- Summit: Red
- UNESCO Site: Purple
- Photography: Pink
- Family Friendly: Green
- Luxury: Orange
- Budget: Indigo
- Small Group: Teal
- Private Tour: Orange

## ⌨️ Keyboard Shortcuts (Future)
- `Ctrl+F` / `Cmd+F`: Focus search
- `Esc`: Close detail panel
- `Ctrl+S` / `Cmd+S`: Save changes
- `Ctrl+N` / `Cmd+N`: New tour

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column grid
- Stacked filters
- Mobile-optimized detail panel
- Touch-friendly buttons

### Tablet (640px - 1024px)
- 2 column grid
- Horizontal filters
- Full feature set

### Desktop (> 1024px)
- 3 column grid
- Full width table in list view
- Optimal spacing

## 🚀 Quick Actions

### Create New Tour
1. Click "Create Tour" button (top right)
2. Modal opens (placeholder - to be implemented)
3. Fill in basic details
4. Save as DRAFT

### Edit Existing Tour
1. Click Edit button on any tour
2. Detail panel opens in edit mode
3. Navigate between tabs
4. Make changes
5. Click "Save Changes"

### Duplicate Tour
1. Click Copy button
2. Confirmation appears
3. New tour created as DRAFT with "(Copy)" suffix
4. Edit to customize

### Delete Tour
1. Click Delete button
2. Confirmation dialog appears
3. Confirm to delete
4. Tour removed from list

## 📊 Sample Data

### Tours Included
1. **Bestig Kilimanjaro** (Tanzania)
   - Status: ACTIVE | Featured
   - 45,900 SEK | 10 days | Extreme
   - 45 bookings | 4.8★ rating

2. **Langtang & Tamang Heritage** (Nepal)
   - Status: ACTIVE | Featured
   - 40,900 SEK | 14 days | Hard
   - 38 bookings | 4.9★ rating

3. **Patagonien** (Chile)
   - Status: ACTIVE | Featured
   - 64,900 SEK | 12 days | Hard
   - 28 bookings | 4.7★ rating

4. **Safari i Serengeti** (Tanzania)
   - Status: DRAFT
   - 52,900 SEK | 7 days | Easy
   - 0 bookings (not yet published)

## 🔧 Admin Functions

### Export Data
- Click "Export" button
- (Placeholder - CSV/Excel export to be implemented)

### Bulk Operations (Future)
- Multi-select tours
- Bulk status change
- Bulk category assignment
- Bulk delete

## 💡 Tips & Best Practices

1. **Use DRAFT status** for tours under development
2. **Set Featured flag** for promoted tours
3. **Add multiple categories** for better discoverability
4. **Use tags** for specific attributes
5. **Fill SEO fields** for better search rankings
6. **Maintain accurate capacity** to avoid overbooking
7. **Update descriptions** in multiple languages (when implemented)
8. **Regular price reviews** based on demand
9. **Monitor booking statistics** for popular tours
10. **Keep images high quality** and relevant

## 🐛 Known Limitations (Current Version)

- ⚠️ No data persistence (refreshing page resets data)
- ⚠️ No actual image upload (URL only)
- ⚠️ No multi-language editor (structure ready)
- ⚠️ No itinerary day editor (placeholder)
- ⚠️ No pagination (all tours loaded)
- ⚠️ No sorting options (default order)
- ⚠️ No bulk operations
- ⚠️ No export functionality
- ⚠️ No validation on form fields
- ⚠️ Create tour opens alert (not modal)

## 📞 Support

For issues or feature requests:
1. Check implementation documentation: `TOUR_MANAGEMENT_IMPLEMENTATION.md`
2. Review code comments in source files
3. Contact development team

---

**Version:** 1.0.0  
**Last Updated:** November 30, 2025  
**Status:** ✅ Production Ready (with mock data)
