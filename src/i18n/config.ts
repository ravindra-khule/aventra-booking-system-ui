import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import commonEN from './locales/en/common.json';
import commonSV from './locales/sv/common.json';
import navEN from './locales/en/nav.json';
import navSV from './locales/sv/nav.json';
import homeEN from './locales/en/home.json';
import homeSV from './locales/sv/home.json';
import tourDetailsEN from './locales/en/tourDetails.json';
import tourDetailsSV from './locales/sv/tourDetails.json';
import bookingEN from './locales/en/booking.json';
import bookingSV from './locales/sv/booking.json';
import myPagesEN from './locales/en/myPages.json';
import myPagesSV from './locales/sv/myPages.json';
import waitlistEN from './locales/en/waitlist.json';
import waitlistSV from './locales/sv/waitlist.json';
import adminEN from './locales/en/admin.json';
import adminSV from './locales/sv/admin.json';
import footerEN from './locales/en/footer.json';
import footerSV from './locales/sv/footer.json';
import demoLoginEN from './locales/en/demoLogin.json';
import demoLoginSV from './locales/sv/demoLogin.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        common: commonEN,
        nav: navEN,
        home: homeEN,
        tourDetails: tourDetailsEN,
        booking: bookingEN,
        myPages: myPagesEN,
        waitlist: waitlistEN,
        admin: adminEN,
        footer: footerEN,
        demoLogin: demoLoginEN,
      },
      sv: {
        common: commonSV,
        nav: navSV,
        home: homeSV,
        tourDetails: tourDetailsSV,
        booking: bookingSV,
        myPages: myPagesSV,
        waitlist: waitlistSV,
        admin: adminSV,
        footer: footerSV,
        demoLogin: demoLoginSV,
      },
    },
    fallbackLng: 'en', // Fallback language
    defaultNS: 'common', // Default namespace
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator'],
      // Keys or params to lookup language from
      lookupLocalStorage: 'preferredLanguage',
      // Cache user language
      caches: ['localStorage'],
    },
  });

export default i18n;
