# Company Information Settings - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### What You Get

A complete, production-ready Company Information Settings module with:
- ✅ 8 tabbed sections (Identity, Contact, Registration, Banking, Social, Hours, Description, Languages)
- ✅ Rich text editor with formatting
- ✅ Logo upload with drag-and-drop
- ✅ Time picker for business hours
- ✅ Multi-language support
- ✅ Responsive design
- ✅ No backend required

### Files Created

```
CompanyInformation.tsx
CompanySettings.tsx (updated)
components/
  ├── CompanyIdentitySection.tsx
  ├── ContactInformationSection.tsx
  ├── BusinessRegistrationSection.tsx
  ├── BankingInformationSection.tsx
  ├── SocialMediaSection.tsx
  ├── BusinessHoursSection.tsx
  ├── CompanyDescriptionSection.tsx
  ├── LanguageSection.tsx
  ├── RichTextEditor.tsx
  └── LogoUploadModal.tsx
types/
  └── companyInfo.ts
index.ts
```

### Use It Immediately

The component is already integrated into your `CompanySettings.tsx`. Just navigate to:

```
/admin/settings/company-information
```

Or in code:
```tsx
import { CompanyInformationSettings } from './pages/admin/settings';

<CompanyInformationSettings />
```

## 📋 Available Components

### Page Component
```tsx
<CompanyInformationSettings />
```
Main container with all 8 sections and navigation.

### Section Components
```tsx
<CompanyIdentity data={data} onChange={setData} onLogoModalOpen={handleModal} />
<ContactInformationSection data={data} onChange={setData} />
<BusinessRegistrationSection data={data} onChange={setData} />
<BankingInformationSection data={data} onChange={setData} />
<SocialMediaSection data={data} onChange={setData} />
<BusinessHoursSection data={data} onChange={setData} />
<CompanyDescriptionSection data={data} onChange={setData} />
<LanguageSection data={data} onChange={setData} />
```

### Helper Components
```tsx
<RichTextEditor value={text} onChange={setText} />
<LogoUploadModal isOpen={true} onClose={() => {}} onUpload={(preview, name) => {}} />
```

## 🎨 Key Features

### 1. **Company Identity**
```tsx
- Company name input
- Logo upload (drag-drop or file picker)
- Logo preview
- Replace/Remove options
```

### 2. **Contact Information**
```tsx
- Address (textarea)
- Phone number
- Email address
```

### 3. **Business Registration**
```tsx
- Business registration number
- VAT/Tax ID
- Additional statutory IDs (optional)
```

### 4. **Banking Information**
```tsx
- Bank name
- Account number
- IFSC/SWIFT code
- Branch name
```

### 5. **Social Media**
```tsx
- Facebook, Instagram, LinkedIn, Twitter/X, YouTube
- Each platform: icon + URL input
- Add/Remove dynamically
```

### 6. **Business Hours**
```tsx
- 7-day schedule
- Time pickers
- Closed toggle
- Auto-displays opening-closing time
```

### 7. **Description**
```tsx
- Rich text editor
- Bold, italic, lists, dividers
- Character counter
- Content guidelines
```

### 8. **Languages**
```tsx
- Add/remove 12 common languages
- Language tabs
- Copy content between languages
- Per-language: name, description, about text
```

## 💾 Data Structure

```typescript
{
  identity: {
    companyName: string;
    logo: string | null;        // Base64 image
    logoFileName?: string;
  };
  contact: {
    address: string;
    phoneNumber: string;
    emailAddress: string;
  };
  businessRegistration: {
    businessRegistrationNumber: string;
    vatTaxId: string;
    additionalStatutoryIds?: string;
  };
  banking: {
    bankName: string;
    accountNumber: string;
    ifscSwift: string;
    branchName: string;
  };
  socialMedia: Array<{
    platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube';
    url: string;
  }>;
  businessHours: Array<{
    day: 'monday' | ... | 'sunday';
    openingTime: string;        // HH:MM
    closingTime: string;        // HH:MM
    isClosed: boolean;
  }>;
  description: {
    aboutText: string;
  };
  languageContent: Array<{
    language: string;
    companyName: string;
    aboutText: string;
    description: string;
  }>;
}
```

## 🛠️ How to Customize

### Change Colors
In any component file:
```tsx
// Primary button blue → purple
className="bg-blue-500" → className="bg-purple-500"

// Success green → teal
className="bg-green-100" → className="bg-teal-100"
```

### Add New Field
1. Update type in `types/companyInfo.ts`
2. Add input to relevant section component
3. Handle onChange in main component

Example:
```typescript
// types/companyInfo.ts
interface ContactInformation {
  address: string;
  phoneNumber: string;
  emailAddress: string;
  faxNumber: string;  // ← Add this
}
```

### Add New Section
1. Create new component file `components/NewSection.tsx`
2. Add tab in `tabs` array in `CompanyInformation.tsx`
3. Add condition to render section based on `activeTab`

### Add More Languages
Edit `LanguageSection.tsx`:
```typescript
const commonLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  // Add more here
];
```

## 🔌 Backend Integration

The component currently logs data to console. To save to backend:

In `CompanyInformation.tsx`, replace the setTimeout in `handleSave()`:

```typescript
const handleSave = async () => {
  setSaveStatus('saving');
  
  try {
    const response = await fetch('/api/company-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Save failed');
    
    setSaveStatus('success');
    setSaveMessage('Saved successfully!');
  } catch (error) {
    setSaveStatus('error');
    setSaveMessage(error.message);
  }
};
```

## 🎯 Common Tasks

### Pre-fill Data
```tsx
const [data, setData] = useState({
  ...initialData,  // Your API data here
});
```

### Read Current Data
```tsx
console.log(data);  // Check browser console after save
```

### Validate Before Save
Add to `handleSave()`:
```typescript
if (!data.identity.companyName.trim()) {
  errors.push('Company name is required');
}
```

### Change Save Button Text
In `CompanyInformation.tsx`:
```tsx
<button>
  <Save size={18} />
  Save Changes    {/* ← Change this */}
</button>
```

### Add Loading Message
```tsx
{saveStatus === 'saving' && (
  <div>Saving...</div>
)}
```

## 📱 Responsive Behavior

- **Mobile:** Single column, collapsed tabs
- **Tablet:** Two columns, scrollable tabs
- **Desktop:** Full layout, all visible

All components have responsive Tailwind classes built-in.

## ✨ UI/UX Highlights

✅ Clean, modern card-based design  
✅ Smooth transitions and hover effects  
✅ Clear status indicators (saving, success, error)  
✅ Helpful placeholder text and tooltips  
✅ Icon indicators for each field  
✅ Responsive on all devices  
✅ Accessible (proper labels, semantic HTML)  
✅ No dark mode needed (light theme only)

## 🐛 Troubleshooting

### Component not showing?
- Check import path
- Verify routing is correct
- Check browser console for errors

### Styles not applying?
- Ensure Tailwind CSS is properly configured
- Clear browser cache
- Rebuild project if needed

### Logo upload not working?
- Check file type (PNG, JPG, SVG only)
- Verify file size < 5MB
- Check browser console for errors

### Language switching not working?
- Ensure language code is valid
- Check that language is in `languageContent` array
- Verify `activeLanguage` state is updating

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `CompanyInformation.tsx` | Main page with tabs |
| `CompanyIdentitySection.tsx` | Company name + logo |
| `ContactInformationSection.tsx` | Address, phone, email |
| `BusinessRegistrationSection.tsx` | Registration numbers |
| `BankingInformationSection.tsx` | Bank details |
| `SocialMediaSection.tsx` | Social media links |
| `BusinessHoursSection.tsx` | 7-day schedule |
| `CompanyDescriptionSection.tsx` | About text |
| `LanguageSection.tsx` | Multi-language support |
| `RichTextEditor.tsx` | Text formatting |
| `LogoUploadModal.tsx` | Logo upload dialog |
| `types/companyInfo.ts` | TypeScript types |

## 🎓 Learning Path

1. **Start:** View the component in browser
2. **Explore:** Check each tab and try features
3. **Customize:** Change colors and text
4. **Integrate:** Connect to your backend
5. **Extend:** Add custom fields or sections

---

Need more help? Check `COMPANY_INFORMATION_GUIDE.md` for detailed documentation.
