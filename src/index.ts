import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uk from './locales/uk.json';
import en from './locales/en.json';
import ru from './locales/ru.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import pl from './locales/pl.json';
import cs from './locales/cs.json';

export const languages = [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
];

export const defaultLanguage = 'uk';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uk: { translation: uk },
      en: { translation: en },
      ru: { translation: ru },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      pl: { translation: pl },
      cs: { translation: cs },
    },
    fallbackLng: defaultLanguage,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;