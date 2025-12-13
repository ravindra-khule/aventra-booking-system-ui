# Language Switching Feature - Implementation Guide

## Overview
The Aventra Booking System supports language switching between English (EN) and Swedish (SV). Users can switch languages at any time by clicking the language button in the navigation bar.

## Architecture

### Components Involved

#### 1. **LanguageContext** ([context/LanguageContext.tsx](context/LanguageContext.tsx))
- Manages the current language state
- Provides translation function (`t()`) for accessing translations
- Persists language preference to browser's localStorage
- Available in the entire app via `useTranslation()` hook

#### 2. **Layout Component** ([components/Layout.tsx](components/Layout.tsx))
- Displays language toggle button in the header
- Desktop view: Shows "EN" or "SV" button with globe icon
- Mobile view: Shows full text like "Byt till Svenska (SV)" or "Switch to English (EN)"

#### 3. **AdminLayout Component** ([components/AdminLayout.tsx](components/AdminLayout.tsx))
- Same language toggle functionality for admin pages
- Integrated in the top header

## How to Use

### For Users

1. **On Desktop:**
   - Click the language button (Globe icon + "EN" or "SV") in the top navigation bar
   - The entire application will instantly switch to the selected language

2. **On Mobile:**
   - Click the menu button (hamburger icon)
   - Select "Byt till Svenska (SV)" or "Switch to English (EN)"
   - The app will switch languages immediately

3. **Language Persistence:**
   - Your language choice is automatically saved to your browser
   - If you return to the site later, it will remember your preference

### For Developers

#### Using Translations in Components

```tsx
import { useTranslation } from '../context/LanguageContext';

export const MyComponent = () => {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('nav.tours')}</h1>
      <p>{t('home.heroTitle')}</p>
      
      {/* Switch language */}
      <button onClick={() => setLanguage(language === 'en' ? 'sv' : 'en')}>
        Switch Language
      </button>
    </div>
  );
};
```

#### Adding New Translations

1. Open [context/LanguageContext.tsx](context/LanguageContext.tsx)
2. In the `translations` object, add entries to both `en` and `sv` sections:

```tsx
const translations = {
  en: {
    newSection: {
      newKey: "English text here",
    },
  },
  sv: {
    newSection: {
      newKey: "Swedish text here",
    },
  },
};
```

3. Use it in your component:
```tsx
const text = t('newSection.newKey');
```

## Translation Structure

The translations are organized hierarchically by feature/section:

- `common` - Common UI elements (Loading, Next, Back, Submit, etc.)
- `nav` - Navigation menu items
- `home` - Home page content
- `tourDetails` - Tour details page content
- `booking` - Booking wizard content
- `myPages` - User bookings page
- `waitlist` - Waitlist feature
- `footer` - Footer content

## Files Modified

1. **context/LanguageContext.tsx**
   - Added `useEffect` for localStorage persistence
   - Added `isInitialized` state to prevent hydration mismatch
   - Enhanced `setLanguage` to save preference

2. **components/Layout.tsx**
   - Improved language button styling (desktop)
   - Enhanced mobile language menu item
   - Added title attributes for better UX

3. **components/AdminLayout.tsx**
   - Already had language switching integrated

## How It Works Under the Hood

1. **Initialization:**
   - When the app loads, LanguageContext checks localStorage for a saved preference
   - If found, it loads that language; otherwise, defaults to English

2. **Language Switching:**
   - User clicks the language button
   - `setLanguage()` is called with the new language code
   - localStorage is updated with the new preference
   - All components using `useTranslation()` re-render with new translations

3. **Translation Lookup:**
   - The `t()` function takes a dotted path like `'nav.tours'`
   - It splits the path and traverses the translations object
   - Returns the translated string or logs a warning if not found

## Current Translation Coverage

### English (EN) ✓
- Complete coverage for all major features
- Includes tour, booking, admin, and footer content

### Swedish (SV) ✓
- Complete coverage for all major features
- Professional Swedish translations

## Browser Support

The language switching feature works in all modern browsers that support:
- localStorage API
- React Context API
- ES6+ JavaScript

## Testing the Feature

1. **Desktop Testing:**
   ```bash
   npm run dev
   # Navigate to the home page
   # Click the "EN" or "SV" button in the top navigation
   # Verify all text changes to the selected language
   ```

2. **Mobile Testing:**
   - Use browser DevTools responsive design mode
   - Click the hamburger menu
   - Select the language option
   - Verify the language switches

3. **Persistence Testing:**
   - Switch to Swedish
   - Refresh the page
   - Verify the app is still in Swedish

## Future Enhancements

- [ ] Add more languages (Norwegian, Danish, etc.)
- [ ] Implement server-side language persistence to user profile
- [ ] Add right-to-left (RTL) language support
- [ ] Create a language selector component for reuse
- [ ] Add keyboard shortcut for language switching

## Troubleshooting

**Q: Language doesn't persist after refresh**
A: Clear browser cache and check if localStorage is enabled in browser settings

**Q: Some text still shows in English even after switching to Swedish**
A: Check if the translation key exists in the Swedish section of translations object

**Q: Language switch is too subtle**
A: The button is designed to be minimal but clear. It includes:
   - Globe icon (universal symbol for language)
   - Language code (EN/SV)
   - Hover effect showing a background

## Related Documentation

- [App.tsx](App.tsx) - Main app component with LanguageProvider
- [context/AuthContext.tsx](context/AuthContext.tsx) - User authentication context
- [components/Sidebar.tsx](components/Sidebar.tsx) - Admin sidebar navigation
