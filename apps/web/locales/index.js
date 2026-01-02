import fr from './fr.json';
import en from './en.json';
import pt from './pt.json';
import ar from './ar.json';
import zh from './zh.json';
import de from './de.json';
import ru from './ru.json';
import es from './es.json';

export const messages = {
  fr,
  en,
  pt,
  ar,
  zh,
  de,
  ru,
  es,
};

export const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
];

export const defaultLocale = 'fr';
