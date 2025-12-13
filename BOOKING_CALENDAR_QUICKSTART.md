# Booking Calendar - Quick Reference

## File Manifest

### Type Files
```
src/features/bookings/types/
├── booking.types.ts          (existing) - Booking & PaymentStatus enums, interfaces
└── calendar.types.ts         (NEW) - Calendar-specific types & enums
```

### Service Files
```
src/features/bookings/services/
├── booking.service.ts        (existing) - Booking CRUD operations
├── calendar.utils.ts         (NEW) - Calendar utility functions
└── calendar-export.service.ts (NEW) - Export to PDF/iCal/CSV
```

### Component Files
```
src/features/bookings/components/
├── BookingCalendar.tsx              (NEW) - Main calendar component
├── MonthView.tsx                    (NEW) - Month view
├── WeekView.tsx                     (NEW) - Week view
├── DayView.tsx                      (NEW) - Day view
├── FiltersPanel.tsx                 (NEW) - Filter controls
├── AvailabilityOverview.tsx         (NEW) - Capacity display
├── EventDetailModal.tsx             (NEW) - Event details modal
├── index.ts                         (UPDATED) - Export barrel file
├── BookingCalendar.module.css       (NEW) - Main styles
├── CalendarViews.module.css         (NEW) - View styles
├── CalendarFilters.module.css       (NEW) - Filter styles
├── AvailabilityOverview.module.css  (NEW) - Availability styles
└── EventDetailModal.module.css      (NEW) - Modal styles
```

### Page Files
```
pages/admin/bookings/
└── BookingCalendar.tsx              (UPDATED) - Integration page
```

## Import Examples

### Main Component
```typescript
import { BookingCalendar } from '@/src/features/bookings/components';
```

### Individual Components
```typescript
import { MonthView } from '@/src/features/bookings/components/MonthView';
import { FiltersPanel } from '@/src/features/bookings/components/FiltersPanel';
import { AvailabilityOverview } from '@/src/features/bookings/components/AvailabilityOverview';
```

### Types
```typescript
import {
  CalendarViewMode,
  CalendarEvent,
  CalendarFilters,
  ExportFormat,
  TourAvailability,
} from '@/src/features/bookings/types/calendar.types';
```

### Services
```typescript
import { generateTourColors, bookingsToCalendarEvents } from '@/src/features/bookings/services/calendar.utils';
import { exportCalendarEvents } from '@/src/features/bookings/services/calendar-export.service';
```

## Feature Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Month View | ✅ Complete | Full calendar grid with event badges |
| Week View | ✅ Complete | Hourly timeline layout |
| Day View | ✅ Complete | Detailed day view with timeline |
| View Switching | ✅ Complete | Toggle between M/W/D |
| Color Coding | ✅ Complete | 8-color palette for tours |
| Filtering | ✅ Complete | By tour, status, customer name |
| Availability Tracking | ✅ Complete | Real-time capacity calculations |
| PDF Export | ✅ Complete | Professional table layout |
| iCal Export | ✅ Complete | Standard .ics format |
| CSV Export | ✅ Complete | Spreadsheet compatible |
| Event Detail Modal | ✅ Complete | Full booking information |
| Drag-and-Drop | ⏳ Ready | Framework types defined, library needed |
| Quick Booking | ⏳ Ready | Callback interface prepared |
| Google Sync | ⏳ Ready | Type definitions prepared |
| Outlook Sync | ⏳ Ready | Type definitions prepared |

## Component Props

### BookingCalendar
```typescript
interface BookingCalendarProps {
  bookings: Booking[];
  tours: Tour[];
  onQuickBooking?: (tourId: string, tripDate: string) => void;
  onEditBooking?: (booking: Booking) => void;
  onDeleteBooking?: (bookingId: string) => void;
  onRescheduleBooking?: (booking: Booking, newDate: string) => void;
}
```

## Enum Values

### CalendarViewMode
```typescript
'month' | 'week' | 'day'
```

### ExportFormat
```typescript
'pdf' | 'ical' | 'csv'
```

### BookingStatus (from booking.types)
```typescript
'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
```

## Key Functions

### Calendar Utils
- `generateTourColors(tours)` - Create color mappings
- `bookingsToCalendarEvents(bookings, tours, colors)` - Convert to events
- `getEventsForDate(date, events)` - Get day's events
- `calculateTourAvailability(tourId, date, tour, bookings)` - Get capacity
- `formatDateToString(date)` - Date formatting
- `getWeekDateRange(date)` - Get week boundaries

### Export Service
- `exportCalendarEvents(events, format, fileName)` - Main export function
- `generatePDF(events, title)` - PDF generation
- `generateICal(events)` - iCal generation
- `generateCSV(events)` - CSV generation

## Styling Guide

### CSS Variables (Recommended to add)
```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-bg-light: #f9fafb;
}
```

### Responsive Breakpoints (in CSS)
- Mobile: `max-width: 768px`
- Tablet: `min-width: 768px, max-width: 1024px`
- Desktop: `min-width: 1024px`

## Date Formatting

### Supported Formats
- ISO: `YYYY-MM-DD` (used internally)
- Display: `DD Month YYYY`
- Short: `Mon, Jan 1`

## Error Handling

```typescript
try {
  const bookings = await BookingService.getAll();
  const tours = await TourService.getAll();
} catch (error) {
  console.error('Failed to load calendar data:', error);
  // Show error toast/message
}
```

## Performance Tips

1. **Memoization**: useMemo for expensive calculations
2. **Event Delegation**: Single handler for multiple elements
3. **Lazy Loading**: Load data on demand
4. **Virtual Scrolling**: For long event lists (future)
5. **Debouncing**: For filter changes (future)

## Next Steps

1. **Add Drag-and-Drop**
   - Install: `npm install react-beautiful-dnd`
   - Implement in calendar view components
   - Add drop zones for each time slot

2. **Add Quick Booking Modal**
   - Create `QuickBookingModal.tsx`
   - Add form with tour/date/participants
   - Integrate with calendar

3. **Add Calendar Sync**
   - Install OAuth library
   - Create Google/Outlook service files
   - Add sync controls to UI

4. **Add Real-time Updates**
   - Implement WebSocket connection
   - Add subscription to booking changes
   - Update calendar in real-time

## Testing Checklist

- [ ] Month view displays all bookings
- [ ] Week view shows hourly slots
- [ ] Day view shows detailed events
- [ ] Filters work independently and together
- [ ] Clear filters button resets all
- [ ] Availability numbers are accurate
- [ ] Exports create valid files
- [ ] Modal opens and closes properly
- [ ] Navigation buttons work
- [ ] Responsive on mobile

## Browser DevTools Tips

### Debug Events
```javascript
// In browser console
const events = document.querySelectorAll('[data-event]');
console.log('Total events:', events.length);
```

### Check Styles
```javascript
// Find specific element
const modal = document.querySelector('[class*="modal"]');
console.log(getComputedStyle(modal));
```

## FAQs

**Q: How do I add a new export format?**
A: Add to `ExportFormat` enum, then implement `generate[Format]()` function in `calendar-export.service.ts`

**Q: How do I customize colors?**
A: Edit the `colorPalette` array in `calendar.utils.ts` `generateTourColors()` function

**Q: How do I add more filters?**
A: Add fields to `CalendarFilters` interface, then implement in `FiltersPanel.tsx` and filtering logic in `BookingCalendar.tsx`

**Q: How do I implement drag-and-drop?**
A: Install `react-beautiful-dnd`, add `onDragStart`/`onDragEnd` to calendar views, implement rescheduling logic

---

Last Updated: December 13, 2025
