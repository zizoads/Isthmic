
import { translations } from '../translations';

/**
 * useSovereignT: The elite translation hook for Isthmic Pro.
 * Ensures technical data (IDs, Domain Names) remains LTR and untranslated.
 */
export const useSovereignT = (lang: 'ar' | 'en') => {
  return (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    // Deep find the value in the translation object
    let text: any = keys.reduce((obj: any, k) => obj?.[k], translations[lang]) || key;

    if (typeof text !== 'string') return key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        // Data Preservation: Wrap technical entities in LTR spans
        const isTechnical = k.toLowerCase().includes('domain') || k.toLowerCase().includes('id');
        const displayValue = isTechnical 
          ? `<span class="force-ltr data-mono inline-block font-bold text-white">${v}</span>` 
          : v;
        
        text = (text as string).replace(`{{${k}}}`, displayValue);
      });
    }

    return text;
  };
};
