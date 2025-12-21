# Tour Itineraries Module - Visual Reference

## 🎨 UI Component Map

### Main Builder Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back  |  ITINERARY TITLE - 7 days        [Builder] [Preview] │
│          |                    Thailand Tour        [PDF] [Share] │
│          |                                               [Save]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ITINERARY INFORMATION                                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Title: [_________________________]                          ││
│  │ Description: [____________________________]                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  DAYS (7) [+ Add Day]                                            │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ┏━ Day 1 ┓  Day 1: Arrival ▼                               ││
│  │ ┃   1    ┃  3 activities • Accommodation • 3 meals          ││
│  │ ┗━━━━━━━━┛  [✎] [⧉] [🗑] [⌄]                              ││
│  │                                                             ││
│  │  DAY INFO  Title: [___________________]                    ││
│  │  ▼ Description: [____________________________]              ││
│  │                                                             ││
│  │  ACTIVITIES (3)  [+ Add Activity]                          ││
│  │  ▼ 10:00-11:00 | Bangkok Temple Sightseeing               ││
│  │    📍 Grand Palace  | Moderate  [✎] [🗑]                  ││
│  │                                                             ││
│  │  MEALS (3)  [+ Add Meal]                                   ││
│  │  ▼ Breakfast: Thai Buffet 🍴 Restaurant                   ││
│  │    Lunch: Street Food Tour 🌶️                             ││
│  │    Dinner: Traditional Thai 🍜 (Paid)                      ││
│  │                                                             ││
│  │  ACCOMMODATION  [+ Add Accommodation]                      ││
│  │  ▼ Grand Hotel Bangkok ⭐⭐⭐⭐                             ││
│  │    Double Room • Free WiFi • Pool • Restaurant             ││
│  │                                                             ││
│  │  TRANSPORTATION (1)  [+ Add Transportation]                ││
│  │  ▼ Airport Transfer - Airport → Hotel                      ││
│  │    Bus • 30 minutes                                         ││
│  │                                                             ││
│  │  PHOTOS (4)  [Manage Gallery]                              ││
│  │  ▼ [📷] [📷] [📷] [📷]                                     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ┏━ Day 2 ┓  Day 2: Temple Tours        ▼                  ││
│  │ ┃   2    ┃  4 activities • Accommodation • 3 meals  [✎] [...] ││
│  │ ┗━━━━━━━━┛                                                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Day Builder Mode
```
┌─────────────────────────────────────────────────────┐
│ Edit Day 1  [Cancel] [Save Day]                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ▼ DAY INFORMATION                                   │
│   Title: [_________________]                        │
│   Description: [______________________________]      │
│   Highlight: [______________________________]        │
│   Distance: [_______] Elevation: [_______]         │
│                                                     │
│ ▼ ACTIVITIES (3)  [+ Add Activity]                 │
│   10:00-11:00 | Bangkok Temple Tour               │
│                📍 Grand Palace | Moderate [✎] [🗑] │
│   12:00-14:00 | Lunch Break                        │
│                Location | Easy [✎] [🗑]            │
│   14:30-16:00 | Shopping at Local Markets          │
│                📍 Weekend Market | Easy [✎] [🗑]    │
│                                                     │
│ ▼ MEALS (3)  [+ Add Meal]                          │
│   Breakfast: Thai Buffet 🍴 [✎] [🗑]              │
│   Lunch: Local Noodles 🍜 [✎] [🗑]                │
│   Dinner: Street Food 🌮 (Paid) [✎] [🗑]          │
│                                                     │
│ ▼ ACCOMMODATION [+ Add Accommodation]              │
│   Grand Hotel Bangkok ⭐⭐⭐⭐                      │
│   📝 Double Room | Check-in 14:00 | WiFi, Pool    │
│   [Edit] [Delete]                                  │
│                                                     │
│ ▼ TRANSPORTATION (1)  [+ Add Transportation]       │
│   Airport Transfer: Airport → Hotel (30min)        │
│   Bus | Included [✎] [🗑]                          │
│                                                     │
│ ▼ PHOTOS (4)  [Manage Gallery]                     │
│   [Photo Grid Preview - 4 images]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Activity Form
```
┌─────────────────────────────────────────────────────┐
│ Add Activity                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Activity Name * : [_____________________]           │
│ Description    : [_________________________]         │
│                                                     │
│ Type: [Hiking ▼]  Difficulty: [Moderate ▼]       │
│                                                     │
│ Start Time *: [10:00 ▼]  End Time *: [12:00 ▼]   │
│                                                     │
│ Location      : [_____________________]            │
│ Physical Level: [Moderate ▼]                       │
│                                                     │
│ Guide Name    : [_____________________]            │
│ Group Size    : [___]  Cost/Person: [$___]        │
│                                                     │
│ Equipment Needed:                                   │
│ [hiking boots_] [+ Add]                            │
│ [Hiking Boots] [Backpack] [Hat] [Water Bottle]    │
│                                                     │
│ Notes: [_________________________________]         │
│                                                     │
│ ☑ Included in tour price                          │
│ ☐ Mandatory activity                              │
│                                                     │
│ [Cancel] [Save Activity]                          │
└─────────────────────────────────────────────────────┘
```

### Preview Mode
```
┌─────────────────────────────────────────────────────┐
│                THAILAND ADVENTURE                   │
│          Thailand Adventure Tour • 7 Days          │
│                                                     │
│  HIGHLIGHTS                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │ Temples of   │  │ River Cruise │  │ Cooking      │
│  │ Bangkok      │  │              │  │ Class        │
│  └──────────────┘  └──────────────┘  └──────────────┘
│                                                     │
│  DAILY ITINERARY                                    │
│                                                     │
│  Day 1: Arrival in Bangkok                         │
│  ────────────────────────────────────               │
│  Welcome to Thailand's vibrant capital!            │
│                                                     │
│  ⏰ ACTIVITIES                                      │
│  • 10:00-11:00 | Bangkok Temple Sightseeing       │
│    📍 Grand Palace                                  │
│                                                     │
│  🍽️ MEALS                                          │
│  • Breakfast: Thai Buffet                          │
│  • Lunch: Street Food Tour                         │
│  • Dinner: Traditional Thai                        │
│                                                     │
│  🏨 ACCOMMODATION                                   │
│  Grand Hotel Bangkok (4⭐)                         │
│  Double Room • WiFi • Pool • Restaurant            │
│                                                     │
│  🚗 TRANSPORTATION                                  │
│  Airport Transfer: 30 minutes (Bus)                │
│                                                     │
│  📸 PHOTOS                                          │
│  [Photo Gallery Grid]                              │
│                                                     │
│  Day 2: Temple Tours                               │
│  [... continues for each day ...]                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Share Modal
```
┌─────────────────────────────────┐
│ Share Itinerary              [X]│
├─────────────────────────────────┤
│                                 │
│ Share "Thailand Adventure"      │
│ with customers                  │
│                                 │
│ SHARE OPTIONS                   │
│ ☑ Enable public sharing         │
│ ☑ Allow customers to download   │
│ ☑ Allow customers to print      │
│ Expires: [2025-01-15_]          │
│                                 │
│ SHAREABLE LINK                  │
│ [https://example.com/share/...] │
│ [Copy] ✓ Copied!               │
│                                 │
│ Share with customers via email  │
│ or messaging                    │
│                                 │
│ SEND TO CUSTOMERS               │
│ [customer@email.com_________] [+]
│                                 │
│ [customer@example.com] [×]      │
│ [john@company.com] [×]          │
│                                 │
│ Add emails to send itinerary    │
│ directly to customers            │
│                                 │
│ [Cancel] [Share Itinerary]      │
└─────────────────────────────────┘
```

## 📊 Component Interaction Diagram

```
User Opens Itineraries Page
         ↓
   [Create New Itinerary]
         ↓
  ItineraryBuilder Mounted
    ├─ Initialize with:
    │   ├─ tourId
    │   ├─ tourTitle
    │   └─ durationDays
    └─ Setup initial state
         ↓
    ┌─ Builder Tab ─┐  ┌─ Preview Tab ─┐
    │               │  │                │
    │ Day Manager   │  │ ItineraryView  │
    ├─ Add Day      │  │                │
    ├─ Edit Day ────→ ItineraryDay     │
    │ │              │ Builder         │
    │ ├─ Activities  │  └────────────────┘
    │ │ ├─ ActivityForm
    │ │ ├─ MealForm
    │ │ ├─ AccommodationForm
    │ │ ├─ TransportationForm
    │ │ └─ GalleryManager
    │ └─ Remove Day
    │
    ├─ Save → ItineraryService.create()
    ├─ PDF → ItineraryService.generatePDF()
    └─ Share → ItineraryShareModal
              └─ ItineraryService.share()
```

## 🎯 User Workflows

### Creating an Itinerary
```
1. Click "Create New Itinerary"
   ↓
2. Builder appears with 7 default days
   ↓
3. For each day:
   a. Click to expand day
   b. Add activities (times, locations, types)
   c. Add meals (types, restaurants)
   d. Add accommodation (hotel, amenities)
   e. Add transportation (flights, buses)
   f. Upload photos (gallery)
   ↓
4. Click "Save" to save complete itinerary
   ↓
5. Use Preview to see how it looks
   ↓
6. Click "PDF" to generate printable version
   ↓
7. Click "Share" to distribute to customers
```

### Editing an Itinerary
```
1. Click on itinerary (future feature)
   ↓
2. Click "Edit" to enter builder
   ↓
3. Modify any section
   ↓
4. Save changes
```

### Sharing with Customers
```
1. Click "Share" button
   ↓
2. Choose sharing options
   ↓
3. Add customer emails or generate public link
   ↓
4. Click "Share Itinerary"
   ↓
5. Customers receive email with link or access link
```

## 🎨 Color Usage in UI

```
Activity Items
├─ Left Border: Purple (#7c3aed)
├─ Background: Off-white (#f9fafb)
├─ Difficulty Badges:
│  ├─ Easy: Green (#d1fae5)
│  ├─ Moderate: Blue (#dbeafe)
│  ├─ Difficult: Amber (#fed7aa)
│  └─ Extreme: Red (#fecaca)
└─ Time Display: Purple (#7c3aed)

Meal Items
├─ Left Border: Amber (#f59e0b)
├─ Type Badge: Amber (#fed7aa)
└─ Background: Off-white (#f9fafb)

Transportation Items
├─ Left Border: Blue (#3b82f6)
├─ Type Badge: Blue (#dbeafe)
└─ Background: Off-white (#f9fafb)

Accommodation Items
├─ Border: Gray (#e5e7eb)
├─ Background: Off-white (#f9fafb)
└─ Type Text: Gray (#9ca3af)

Buttons
├─ Primary: Purple (#7c3aed)
├─ Hover: Darker Purple (#6d28d9)
├─ Secondary: White (#ffffff) with border
└─ Danger: Red (#dc2626)
```

## 📱 Responsive Breakpoints

```
Mobile (< 640px)
├─ Single column layout
├─ Full-width inputs
└─ Stacked sections

Tablet (640px - 1024px)
├─ 2-column grid
├─ Adjusted padding
└─ Compact forms

Desktop (> 1024px)
├─ 3-column grid (activities, meals, accommodation)
├─ Full spacing
└─ Optimal readability
```

## 🔄 State Flow Diagram

```
┌──────────────────────────────────┐
│   User Input (Form)              │
└────────────┬─────────────────────┘
             │
             ↓
┌──────────────────────────────────┐
│   Component State (useState)      │
│   ├─ itinerary                   │
│   ├─ expandedDays                │
│   ├─ editingDayId                │
│   └─ showShareModal              │
└────────────┬─────────────────────┘
             │
             ↓
┌──────────────────────────────────┐
│   Validation                      │
│   ├─ Required fields             │
│   ├─ Time logic                  │
│   └─ Email format                │
└────────────┬─────────────────────┘
             │
             ↓
┌──────────────────────────────────┐
│   Service Call                    │
│   ├─ ItineraryService.create()   │
│   ├─ ItineraryService.update()   │
│   └─ ItineraryService.share()    │
└────────────┬─────────────────────┘
             │
             ↓
┌──────────────────────────────────┐
│   [API Endpoint - TO BE ADDED]    │
│   ├─ POST /api/itineraries       │
│   ├─ PUT /api/itineraries/:id    │
│   └─ POST /api/itineraries/share │
└────────────┬─────────────────────┘
             │
             ↓
┌──────────────────────────────────┐
│   Success/Error Response          │
│   ├─ Update local state           │
│   ├─ Show success message         │
│   └─ Clear form                   │
└──────────────────────────────────┘
```

---

**This visual reference helps understand the UI structure and interaction patterns of the Tour Itineraries module.**
