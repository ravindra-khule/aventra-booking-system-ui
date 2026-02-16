# i18next Migration

This project uses [i18next](https://www.i18next.com/) for internationalization (i18n).

## Supported Languages

- English (EN)
- Swedish (SV)

## Structure

```
src/i18n/
├── config.ts                 # i18next configuration
└── locales/
    ├── en/                   # English translations
    │   ├── common.json
    │   ├── nav.json
    │   ├── home.json
    │   ├── tourDetails.json
    │   ├── booking.json
    │   ├── myPages.json
    │   ├── waitlist.json
    │   ├── admin.json        # Admin panel translations (405 keys)
    │   ├── footer.json
    │   └── demoLogin.json
    └── sv/                   # Swedish translations
        └── [same structure]
```

## Usage

### In Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('home:heroTitle')}</h1>
      <button onClick={() => i18n.changeLanguage('sv')}>
        Svenska
      </button>
    </div>
  );
}
```

### With Namespaces

```tsx
// Use specific namespace
const { t } = useTranslation('admin');
t('customerManager') // Gets from admin namespace

// Or use namespace prefix
const { t } = useTranslation();
t('admin:customerManager')
```

## Language Detection

Language is detected in this order:
1. localStorage (`preferredLanguage` key)
2. Browser navigator language
3. Fallback: English (en)

## Adding New Translations

1. Add keys to appropriate namespace file:
   - `src/i18n/locales/en/[namespace].json`
   - `src/i18n/locales/sv/[namespace].json`

2. Use in components:
   ```tsx
   {t('namespace:key')}
   ```

## Adding New Languages

1. Create new language folder: `src/i18n/locales/[lang]/`
2. Copy all JSON files from `en/` folder
3. Translate all values
4. Add to `config.ts`:
   ```ts
   resources: {
     en: { ... },
     sv: { ... },
     no: { ... }, // New language
   }
   ```

## Migration Notes

- Migrated from custom LanguageContext to i18next
- Total translation keys: ~2,000+
- Bundle size impact: +4.5KB gzipped
- Benefits: Industry standard, better organization, advanced features

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
