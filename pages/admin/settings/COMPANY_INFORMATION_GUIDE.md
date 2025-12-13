# Company Information Settings Module - Implementation Guide

## Overview

A complete, production-ready Company Information Settings module for the Aventra Booking System admin panel. This is a **frontend-only implementation** with no backend dependencies.

## ✨ Features

### 1. **Company Identity**
- Company name input
- Logo upload with preview
- Logo replacement and removal
- Drag-and-drop or file selector
- File size validation (max 5MB)
- Format validation (PNG, JPG, SVG)
- Base64 encoding for storage

### 2. **Contact Information**
- Address (multiline textarea)
- Phone number
- Email address
- Input validation and helpful placeholders

### 3. **Business Registration Details**
- Business registration number
- VAT / Tax ID
- Additional statutory IDs (optional, multiline)
- Clean, organized layout

### 4. **Banking Information**
- Bank name
- Account number
- IFSC/SWIFT code
- Branch name
- Security notices for sensitive data

### 5. **Social Media Links**
- Support for 5 platforms: Facebook, Instagram, LinkedIn, Twitter/X, YouTube
- Platform icons with brand colors
- Add/remove links dynamically
- URL validation
- "Connected" status indicators

### 6. **Business Hours**
- Schedule for all 7 days of the week
- Opening and closing times with time pickers
- Toggle for "Closed for the day"
- Time display in HH:MM format
- Auto-initialization with all days

### 7. **Company Description**
- Rich text editor with formatting options
- Support for bold, italic, bullet lists, dividers
- Character counter
- Markdown-based formatting
- Helpful content guidelines

### 8. **Multi-Language Support**
- Add/remove languages from common list (12 languages)
- Language tabs for easy switching
- Copy content between languages
- Per-language fields:
  - Company name
  - Short description
  - About text (rich editor)

## 📁 File Structure

```
pages/admin/settings/
├── CompanyInformation.tsx           # Main page component
├── CompanySettings.tsx              # Updated wrapper component
├── index.ts                         # Exports
├── types/
│   └── companyInfo.ts               # TypeScript types and interfaces
└── components/
    ├── CompanyIdentitySection.tsx
    ├── ContactInformationSection.tsx
    ├── BusinessRegistrationSection.tsx
    ├── BankingInformationSection.tsx
    ├── SocialMediaSection.tsx
    ├── BusinessHoursSection.tsx
    ├── CompanyDescriptionSection.tsx
    ├── LanguageSection.tsx
    ├── RichTextEditor.tsx            # Reusable rich text component
    └── LogoUploadModal.tsx           # Reusable modal component
```

## 🚀 Component Structure

### Main Component: `CompanyInformationSettings`

**Location:** [CompanyInformation.tsx](CompanyInformation.tsx)

Manages:
- Tab navigation (8 tabs)
- All state management for company data
- Save/Reset functionality
- Success/Error notifications
- Modal controls

**Props:** None (standalone page)

**State:**
```typescript
{
  activeTab: TabType;
  logoModalOpen: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveMessage: string;
  data: CompanyInformationData;
}
```

### Section Components

Each section is a separate, reusable component:

#### `CompanyIdentity`
- Manages company name and logo
- Opens modal for logo upload
- Shows logo preview with replace/remove options

#### `ContactInformationSection`
- Structured input fields
- Icon indicators for each field
- Helpful placeholder text

#### `BusinessRegistrationSection`
- Registration and tax IDs
- Optional additional fields

#### `BankingInformationSection`
- Secure fields for banking information
- IFSC/SWIFT code guidance

#### `SocialMediaSection`
- Dynamic add/remove for 5 platforms
- Platform icons and brand colors
- Connected status badges

#### `BusinessHoursSection`
- 7-day schedule grid
- Time pickers for opening/closing
- Closed day toggle
- Auto-initialization

#### `CompanyDescriptionSection`
- Uses RichTextEditor component
- Content guidelines
- Character counter

#### `LanguageSection`
- Language tabs (add/remove)
- Copy between languages feature
- Per-language form fields
- Localization tips

### Helper Components

#### `RichTextEditor`
**Features:**
- Toolbar with formatting buttons (Bold, Italic, Lists, Dividers)
- Character counter
- Textarea with syntax highlighting support
- Markdown format output
- Customizable rows and placeholder

**Usage:**
```tsx
<RichTextEditor
  value={text}
  onChange={setText}
  placeholder="Enter text..."
  rows={8}
/>
```

#### `LogoUploadModal`
**Features:**
- Drag-and-drop support
- File input alternative
- Image preview
- File validation (type, size)
- Change/Upload actions
- Modal backdrop

**Usage:**
```tsx
<LogoUploadModal
  isOpen={isOpen}
  onClose={handleClose}
  onUpload={(preview, fileName) => {}}
/>
```

## 📝 TypeScript Types

### Main Types (in `types/companyInfo.ts`)

```typescript
interface CompanyInformationData {
  identity: CompanyIdentity;
  contact: ContactInformation;
  businessRegistration: BusinessRegistration;
  banking: BankingInformation;
  socialMedia: SocialMediaLink[];
  businessHours: BusinessHour[];
  description: CompanyDescription;
  languageContent: LanguageContent[];
  updatedAt?: string;
  updatedBy?: string;
}

interface CompanyIdentity {
  companyName: string;
  logo: string | null;
  logoFileName?: string;
}

interface ContactInformation {
  address: string;
  phoneNumber: string;
  emailAddress: string;
}

interface BusinessRegistration {
  businessRegistrationNumber: string;
  vatTaxId: string;
  additionalStatutoryIds?: string;
}

interface BankingInformation {
  bankName: string;
  accountNumber: string;
  ifscSwift: string;
  branchName: string;
}

interface SocialMediaLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube';
  url: string;
}

interface BusinessHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  openingTime: string; // HH:MM
  closingTime: string; // HH:MM
  isClosed: boolean;
}

interface CompanyDescription {
  aboutText: string;
}

interface LanguageContent {
  language: string;
  companyName: string;
  aboutText: string;
  description: string;
}
```

## 🎨 UI/UX Features

### Design System
- **Colors:** Blue for primary actions, green for success, red for warnings
- **Spacing:** Consistent padding and gaps throughout
- **Typography:** Clear hierarchy with heading levels
- **Icons:** Lucide React icons for visual cues
- **Responsive:** Mobile-first, works on all screen sizes

### Layout
- **Card-based sections** with shadow and borders
- **Tabs** for easy navigation between 8 sections
- **Modals** for complex interactions (logo upload)
- **Status indicators** (saved, unsaved, loading states)
- **Tooltips** and helper text throughout

### Interactions
- **Toast notifications** for success/error messages
- **Loading spinner** during save
- **Confirmation dialogs** before destructive actions
- **Real-time validation** as user types
- **Drag-and-drop** for file uploads

## 💾 Data Handling

### Storage
Currently logs data to browser console. To integrate with backend:

```javascript
// In CompanyInformation.tsx handleSave()
const response = await fetch('/api/company-info', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### State Management
- Uses React `useState` for local state
- Props drilling for parent-child communication
- No external state library required

### Validation
- Required field validation before save
- Email format validation
- File type/size validation for logo
- Phone number placeholder guidance

## 🔧 Customization Guide

### Adding a New Field

1. **Update the type** in `types/companyInfo.ts`
2. **Create/update component** in `components/`
3. **Add to main component** state
4. **Create new tab** or add to existing section

### Changing Colors

Modify Tailwind classes in components:
```tsx
// From:
className="bg-blue-500 text-white"

// To:
className="bg-purple-500 text-white"
```

### Adding Validation

Add to `handleSave()` in `CompanyInformation.tsx`:
```typescript
if (!data.fieldName) {
  errors.push('Field Name is required');
}
```

### Language Customization

Modify the language list in `LanguageSection.tsx`:
```typescript
const commonLanguages = [
  { code: 'en', name: 'English' },
  // Add more languages here
];
```

## 📱 Responsive Design

- **Mobile:** Single column, full-width inputs, stacked tabs
- **Tablet:** Two columns where appropriate
- **Desktop:** Optimal layout with sidebar (if applicable)
- **Large Screens:** Max-width container (7xl = 80rem)

## ♿ Accessibility

- Proper `<label>` elements for all inputs
- Semantic HTML structure
- ARIA attributes on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on interactive elements

## 🧪 Testing

To test locally:

1. Navigate to `/admin/settings/company`
2. Fill in all fields
3. Upload a logo
4. Switch tabs
5. Add multiple languages
6. Click Save (check browser console for data)

## 📦 Dependencies

Uses only existing project dependencies:
- **react** (^19.2.0)
- **react-dom** (^19.2.0)
- **lucide-react** (^0.555.0) - For icons
- **tailwindcss** - For styling

No additional packages required!

## 🚀 Integration Steps

### 1. **Copy All Files**
Files are already created in:
- `/pages/admin/settings/CompanyInformation.tsx`
- `/pages/admin/settings/components/*.tsx`
- `/pages/admin/settings/types/companyInfo.ts`

### 2. **Update Routing** (if needed)
```tsx
// In your router configuration
import { CompanySettings } from './pages/admin/settings/CompanySettings';

{
  path: '/admin/settings/company',
  element: <CompanySettings />
}
```

### 3. **Add to Navigation**
```tsx
// In sidebar or navigation component
<NavLink to="/admin/settings/company">Company Information</NavLink>
```

### 4. **Connect Backend** (Optional)
Replace the console.log in `handleSave()` with your API call.

## 💡 Usage Example

```tsx
import { CompanyInformationSettings } from './pages/admin/settings';

// In your admin layout
<CompanyInformationSettings />

// Or in your router
<Route path="/company-info" element={<CompanyInformationSettings />} />
```

## 🎯 Future Enhancements

- [ ] Image cropping for logo
- [ ] Business category/industry selector
- [ ] Multiple office locations support
- [ ] Team member management
- [ ] API integration
- [ ] Audit logs (who changed what and when)
- [ ] Logo optimization/compression
- [ ] Bulk language import/export
- [ ] QR code generation for social media
- [ ] Website URL field
- [ ] Map integration for address

## 📞 Support

All components are documented inline with JSDoc comments. Check individual component files for detailed prop documentation.

---

**Version:** 1.0.0  
**Last Updated:** December 12, 2025  
**Status:** Production Ready (Frontend Only)
