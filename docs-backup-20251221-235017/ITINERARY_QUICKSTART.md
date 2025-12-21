# Tour Itineraries Module - Quick Start Guide

## 🚀 Quick Links

- **Main Page:** `pages/admin/tours/Itineraries.tsx`
- **Components:** `src/features/tours/components/`
- **Types:** `src/features/tours/types/itinerary.types.ts`
- **Service:** `src/features/tours/services/itinerary.service.ts`

## 📋 Component Overview

### Core Components Hierarchy
```
ItineraryBuilder (Main Container)
├── ItineraryDayBuilder (for editing)
│   ├── ActivityForm
│   ├── MealForm
│   ├── AccommodationForm
│   ├── TransportationForm
│   └── GalleryManager
├── ItineraryDayCard (for display)
├── ItineraryPreview (preview mode)
└── ItineraryShareModal (sharing)
```

## 🎯 Using the Itinerary Builder

### Import
```typescript
import { ItineraryBuilder } from '../../../src/features/tours/components';
```

### Basic Usage
```typescript
<ItineraryBuilder
  tourId="tour-123"
  tourTitle="Thailand Adventure"
  durationDays={7}
  onBack={() => navigate(-1)}
  onSave={(itinerary) => {
    console.log('Saved:', itinerary);
  }}
/>
```

### Props
- **tourId** (string): Unique tour identifier
- **tourTitle** (string): Display name of the tour
- **durationDays** (number): Initial number of days
- **onBack** (function): Called when user clicks back
- **onSave** (function): Called with complete itinerary data

## 📝 Common Tasks

### Add an Activity
```
1. Click on a day (expand it)
2. Click "Add Activity" in the Activities section
3. Fill in the activity form:
   - Name, Type, Difficulty
   - Start/End times
   - Location, Guide, Group Size
   - Equipment list
4. Click "Save Activity"
```

### Add Accommodation
```
1. Click on a day (expand it)
2. Click "Add Accommodation" in the Accommodation section
3. Fill in:
   - Name, Type (Hotel, Hostel, etc.)
   - Location, Address
   - Check-in/out times
   - Amenities
4. Click "Save Accommodation"
```

### Add Meals
```
1. Click "Add Meal" in the Meals section
2. Select meal type (Breakfast, Lunch, Dinner, Snack)
3. Enter meal name and details
4. Add dietary options if needed
5. Click "Save Meal"
```

### Add Transportation
```
1. Click "Add Transportation"
2. Select type (Flight, Bus, Train, Car, Boat, etc.)
3. Enter:
   - Departure and arrival locations
   - Times (optional)
   - Duration and distance
   - Provider and booking reference
4. Click "Save Transportation"
```

### Add Photos
```
1. Click "Manage Gallery" in the Photos section
2. Click "Add Photo"
3. Enter image URL, alt text, caption
4. Add photographer credit (optional)
5. Click "Add Photo" button
6. Click "Save Photos" when done
```

### Share Itinerary
```
1. Click "Share" button in header
2. Choose sharing options:
   - Enable public link
   - Allow PDF download
   - Allow printing
3. Add customer emails to the list
4. Click "Share Itinerary"
```

### Generate PDF
```
1. Click "PDF" button in header
2. System generates and opens PDF in new window
```

### View Preview
```
1. Click "Preview" tab in the builder header
2. View the itinerary as customers will see it
3. Click "Builder" to return to editing
```

## 🔄 Data Flow

```
User Input (Forms)
    ↓
Component State (React useState)
    ↓
Service Methods (ItineraryService)
    ↓
API Endpoints (TO BE INTEGRATED)
    ↓
Database
```

## 💾 Service Methods

### Available Methods

```typescript
// List operations
ItineraryService.getByTourId(tourId) → Promise<CompleteItinerary[]>
ItineraryService.getById(id) → Promise<CompleteItinerary>
ItineraryService.create(itinerary) → Promise<CompleteItinerary>
ItineraryService.update(itinerary) → Promise<CompleteItinerary>
ItineraryService.delete(id) → Promise<void>
ItineraryService.duplicate(id, newTourId) → Promise<CompleteItinerary>

// Publishing
ItineraryService.publish(id) → Promise<CompleteItinerary>

// PDF & Sharing
ItineraryService.generatePDF(id) → Promise<string> // returns URL
ItineraryService.share(id, emails, options) → Promise<string> // returns URL

// Utilities
ItineraryService.reorderDays(days, from, to) → ItineraryDayDetails[]
ItineraryService.reorderActivities(activities, from, to) → Activity[]
ItineraryService.calculateDayDuration(activities) → string
ItineraryService.validateItinerary(itinerary) → { isValid, errors }
```

## 🎨 Styling

### CSS Modules Used
- `ItineraryBuilder.module.css` - Main builder styles
- `ItineraryDayCard.module.css` - Day display styles
- `ItineraryDayBuilder.module.css` - Day editor styles
- `ActivityForm.module.css` - Activity form styles
- `MealForm.module.css` - Meal form styles
- `AccommodationForm.module.css` - Accommodation form styles
- `TransportationForm.module.css` - Transportation form styles
- `GalleryManager.module.css` - Gallery styles
- `ItineraryPreview.module.css` - Preview styles
- `ItineraryShareModal.module.css` - Modal styles

### Color Variables
```
Primary: #7c3aed (Purple)
Secondary: #6b7280 (Gray)
Success: #10b981 (Green)
Warning: #f59e0b (Amber)
Danger: #dc2626 (Red)
Background: #f9fafb (Off-white)
Borders: #e5e7eb (Light gray)
```

## 🔧 Integration with Backend

### Current Status
All service methods are UI-only placeholders. To integrate with backend:

1. **Update `itinerary.service.ts`:**
   ```typescript
   static async getAll(): Promise<CompleteItinerary[]> {
     const response = await fetch('/api/itineraries');
     return response.json();
   }
   ```

2. **Add API error handling:**
   ```typescript
   try {
     // API call
   } catch (error) {
     console.error('API Error:', error);
     throw new Error('Failed to save itinerary');
   }
   ```

3. **Implement authentication:**
   ```typescript
   const headers = {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   };
   ```

## ✅ Validation Rules

### Required Fields
- Itinerary title
- At least one day
- Each day must have a title
- Each day must have at least one activity
- Activity name, start time, end time
- Meal name and type
- Accommodation name
- Transportation description with locations

### Automatic Validations
- End time must be after start time
- Email validation for sharing
- Duplicate email prevention

## 🐛 Troubleshooting

### Form Not Submitting
- Check all required fields are filled
- Look for red validation error messages
- Ensure times are in valid HH:mm format

### Changes Not Saving
- Click "Save Day" after making changes in day builder
- Click main "Save" button to save complete itinerary
- Check browser console for any error messages

### Styles Not Displaying Correctly
- Verify CSS module is imported correctly
- Check className matches CSS selector
- Clear browser cache (Ctrl+Shift+R)

## 📚 Type Reference

### Key Interfaces
```typescript
// Complete itinerary
interface CompleteItinerary {
  id: string;
  tourId: string;
  title: string;
  description?: string;
  days: ItineraryDayDetails[];
  highlights: string[];
  isPublished: boolean;
  isSharedWithCustomers: boolean;
  pdfGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

// Single day
interface ItineraryDayDetails {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: Activity[];
  meals: Meal[];
  accommodation?: Accommodation;
  transportation: Transportation[];
  galleryImages: GalleryImage[];
}

// Activity
interface Activity {
  id: string;
  name: string;
  type: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme';
  location?: string;
  included: boolean;
  mandatory: boolean;
}
```

## 📞 Support

For issues or questions:
1. Check the main `ITINERARY_MODULE_COMPLETE.md` documentation
2. Review component comments and type definitions
3. Check TypeScript errors for type mismatches
4. Verify service method implementations

---

**Last Updated:** December 13, 2025  
**Status:** ✅ Production Ready for UI  
**Backend Ready:** Awaiting API Endpoints
