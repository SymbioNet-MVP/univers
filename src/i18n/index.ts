import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import messages from './local/index';
import { detectInitialLang } from '@/lib/lang';

i18n.use(initReactI18next).init({
  lng: detectInitialLang(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'de'],
  nonExplicitSupportedLngs: true,
  debug: false,
  resources: messages,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;