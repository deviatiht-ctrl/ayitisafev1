import { useLanguageStore } from '../store/languageStore';
import { translations } from './translations';

export function useTranslation() {
  const { language } = useLanguageStore();
  
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback to Kreyòl, then key itself
        value = translations.ht?.[key] || key;
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { t, language };
}

export default useTranslation;
