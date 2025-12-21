# Company Information Settings - Components Reference

## Overview

This directory contains all components for the Company Information Settings module.

## File Listing

### Section Components (Main Sections)

#### 📦 `CompanyIdentitySection.tsx`
**Purpose:** Manages company name and logo

**Props:**
```typescript
interface CompanyIdentityProps {
  data: CompanyIdentity;
  onChange: (data: CompanyIdentity) => void;
  onLogoModalOpen: () => void;
}
```

**Features:**
- Company name text input
- Logo preview (if uploaded)
- Logo upload button (opens modal)
- Replace and remove logo options
- File size and format guidelines

**Example:**
```tsx
<CompanyIdentity
  data={data.identity}
  onChange={(identity) => setData({...data, identity})}
  onLogoModalOpen={() => setLogoModalOpen(true)}
/>
```

---

#### 📞 `ContactInformationSection.tsx`
**Purpose:** Manage contact details

**Props:**
```typescript
interface ContactInformationProps {
  data: ContactInformation;
  onChange: (data: ContactInformation) => void;
}
```

**Fields:**
- Address (textarea, multiline)
- Phone number
- Email address

**Features:**
- Icon indicators for each field
- Helpful placeholder text
- Input validation guidance

**Example:**
```tsx
<ContactInformationSection
  data={data.contact}
  onChange={(contact) => setData({...data, contact})}
/>
```

---

#### 📋 `BusinessRegistrationSection.tsx`
**Purpose:** Business registration and tax details

**Props:**
```typescript
interface BusinessRegistrationProps {
  data: BusinessRegistration;
  onChange: (data: BusinessRegistration) => void;
}
```

**Fields:**
- Business registration number
- VAT / Tax ID
- Additional statutory IDs (optional)

**Example:**
```tsx
<BusinessRegistrationSection
  data={data.businessRegistration}
  onChange={(reg) => setData({...data, businessRegistration: reg})}
/>
```

---

#### 🏦 `BankingInformationSection.tsx`
**Purpose:** Banking and payment details

**Props:**
```typescript
interface BankingInformationProps {
  data: BankingInformation;
  onChange: (data: BankingInformation) => void;
}
```

**Fields:**
- Bank name
- Account number (sensitive data warning)
- IFSC / SWIFT code
- Branch name

**Security Note:** Component includes warnings about sensitive data

**Example:**
```tsx
<BankingInformationSection
  data={data.banking}
  onChange={(banking) => setData({...data, banking})}
/>
```

---

#### 🔗 `SocialMediaSection.tsx`
**Purpose:** Social media links management

**Props:**
```typescript
interface SocialMediaSectionProps {
  data: SocialMediaLink[];
  onChange: (data: SocialMediaLink[]) => void;
}
```

**Supported Platforms:**
- Facebook
- Instagram
- LinkedIn
- Twitter / X
- YouTube

**Features:**
- Platform icons with brand colors
- Add/remove links dynamically
- "Connected" status badges
- URL validation

**Example:**
```tsx
<SocialMediaSection
  data={data.socialMedia}
  onChange={(social) => setData({...data, socialMedia: social})}
/>
```

---

#### ⏰ `BusinessHoursSection.tsx`
**Purpose:** Weekly business hours schedule

**Props:**
```typescript
interface BusinessHoursProps {
  data: BusinessHour[];
  onChange: (data: BusinessHour[]) => void;
}
```

**Features:**
- 7-day schedule (Mon-Sun)
- Time pickers for opening/closing times
- "Closed for the day" toggle
- Time range display (HH:MM - HH:MM)
- Auto-initialization on mount

**Time Format:** HH:MM (24-hour)

**Example:**
```tsx
<BusinessHoursSection
  data={data.businessHours}
  onChange={(hours) => setData({...data, businessHours: hours})}
/>
```

---

#### 📝 `CompanyDescriptionSection.tsx`
**Purpose:** Company about/description text

**Props:**
```typescript
interface CompanyDescriptionProps {
  data: CompanyDescription;
  onChange: (data: CompanyDescription) => void;
}
```

**Features:**
- Uses RichTextEditor component
- Markdown formatting support
- Content guidelines provided
- Character counter

**Example:**
```tsx
<CompanyDescriptionSection
  data={data.description}
  onChange={(desc) => setData({...data, description: desc})}
/>
```

---

#### 🌍 `LanguageSection.tsx`
**Purpose:** Multi-language content management

**Props:**
```typescript
interface LanguageSectionProps {
  data: LanguageContent[];
  onChange: (data: LanguageContent[]) => void;
}
```

**Supported Languages:** 12 common languages
- English, Spanish, French, German, Italian, Portuguese
- Dutch, Japanese, Chinese, Korean, Russian, Arabic

**Features:**
- Language tabs (add/remove)
- Copy content between languages
- Per-language fields:
  - Company name
  - Short description
  - About text (rich editor)
- Localization guidelines

**Example:**
```tsx
<LanguageSection
  data={data.languageContent}
  onChange={(langs) => setData({...data, languageContent: langs})}
/>
```

---

### Helper Components (Utilities)

#### ✏️ `RichTextEditor.tsx`
**Purpose:** Text formatting and editing with markdown support

**Props:**
```typescript
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}
```

**Features:**
- Formatting toolbar (Bold, Italic, Lists, Dividers)
- Character counter
- Markdown format output
- Customizable height (rows)
- Custom placeholder

**Supported Formatting:**
- `**text**` → Bold
- `*text*` → Italic
- `• ` → Bullet list
- `---` → Horizontal divider

**Example:**
```tsx
<RichTextEditor
  value={description}
  onChange={setDescription}
  placeholder="Write your description..."
  rows={8}
/>
```

---

#### 📤 `LogoUploadModal.tsx`
**Purpose:** Logo file upload with preview

**Props:**
```typescript
interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (preview: string, fileName: string) => void;
}
```

**Features:**
- Modal with overlay
- Drag-and-drop support
- File input selector
- Image preview
- File validation:
  - Type: PNG, JPG, SVG only
  - Size: Max 5MB
- Change/Upload buttons

**Returns:** Base64 encoded image + filename

**Example:**
```tsx
const [modalOpen, setModalOpen] = useState(false);

<LogoUploadModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onUpload={(preview, fileName) => {
    setData({...data, identity: {...data.identity, logo: preview, logoFileName: fileName}});
  }}
/>
```

---

## Component Styling

All components use **Tailwind CSS** with:

### Color Scheme
- **Primary:** Blue (`bg-blue-500`, `text-blue-600`)
- **Success:** Green (`bg-green-100`, `text-green-800`)
- **Warning:** Amber (`bg-amber-50`, `text-amber-900`)
- **Error:** Red (`bg-red-50`, `text-red-600`)
- **Neutral:** Gray (`bg-gray-100`, `text-gray-700`)

### Responsive Classes
- Mobile-first approach
- `sm:` for tablets (640px+)
- `md:` for small desktops (768px+)
- `lg:` for desktops (1024px+)

### Common Patterns
```tsx
// Card container
className="bg-white rounded-lg shadow-sm p-6"

// Input field
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"

// Button
className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"

// Textarea
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
```

---

## State Management

All components use **controlled components** pattern:

```tsx
// Parent component
const [data, setData] = useState(initialData);

// Child component
<ChildComponent
  data={data.field}
  onChange={(newData) => setData({...data, field: newData})}
/>
```

No external state management library required.

---

## Icons

Components use **Lucide React** icons:

```tsx
import { 
  Upload,        // For upload actions
  X,             // For close/remove
  Save,          // For save button
  Clock,         // For business hours
  Globe,         // For languages
  DollarSign,    // For banking
  // ... etc
} from 'lucide-react';
```

Complete icon list available in Lucide documentation.

---

## Data Flow

```
CompanyInformation.tsx (Main State)
    ↓
[Component Props]
    ↓
CompanyIdentitySection
ContactInformationSection
BusinessRegistrationSection
BankingInformationSection
SocialMediaSection
BusinessHoursSection
CompanyDescriptionSection
LanguageSection
    ↓
[onChange Callbacks]
    ↓
CompanyInformation.tsx (Update State)
```

---

## Accessibility Features

✅ Proper `<label>` associations  
✅ Semantic HTML elements  
✅ Focus indicators on interactive elements  
✅ Color contrast compliance (WCAG AA)  
✅ ARIA attributes where needed  
✅ Keyboard navigation support  

---

## Performance Considerations

- Components are **memoized** where appropriate
- **Controlled components** prevent unnecessary re-renders
- Time picker and rich editor are **optimized**
- No external API calls in components
- Image upload uses **FileReader API**

---

## Testing

### Unit Testing Example
```tsx
import { render, screen } from '@testing-library/react';
import { CompanyIdentitySection } from './CompanyIdentitySection';

test('renders company name input', () => {
  const data = { companyName: 'Test', logo: null };
  render(
    <CompanyIdentitySection 
      data={data} 
      onChange={jest.fn()} 
      onLogoModalOpen={jest.fn()}
    />
  );
  expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
});
```

---

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Common Use Cases

### Pre-fill with Existing Data
```tsx
const [data, setData] = useState(fetchedData);
```

### Disable Editing
```tsx
<input disabled value={data.field} />
```

### Custom Validation
```tsx
const errors = validateData(data);
if (errors.length > 0) {
  // Show errors
}
```

### Local Storage
```tsx
useEffect(() => {
  localStorage.setItem('companyInfo', JSON.stringify(data));
}, [data]);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Styles not showing | Ensure Tailwind CSS is configured |
| Icons not displaying | Verify lucide-react is installed |
| Modal not appearing | Check `isOpen` prop is true |
| Time picker not working | Use HH:MM format (24-hour) |
| Logo upload fails | Check file < 5MB and correct type |
| Language switching fails | Verify language code in array |

---

**Last Updated:** December 12, 2025
