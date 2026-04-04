
import { translations } from '../translations';

/**
 * useSovereignT: The elite translation hook for Isthmic Pro.
 * Ensures technical data (IDs, Domain Names) remains LTR and untranslated.
 */
export const useSovereignT = () => {
  const tFunc = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    
    // Deep find the value in the translation object (defaulting to English)
    let text: any = keys.reduce((obj: any, k) => obj?.[k], translations.en);
    
    // Fallback logic: check legacy flat keys if nested find fails
    if (text === undefined) {
      text = (translations.en as any)[key] || key;
    }

    if (typeof text !== 'string') return String(text);

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        // Data Preservation: Wrap technical entities in LTR spans
        const isTechnical = k.toLowerCase().includes('domain') || 
                            k.toLowerCase().includes('id') ||
                            (typeof v === 'string' && /^[a-zA-Z0-9-]+\.[a-z]{2,}$/.test(v));

        const displayValue = isTechnical 
          ? `<span class="force-ltr data-mono inline-block font-bold text-white ltr-inline" dir="ltr">${v}</span>` 
          : v;
        
        text = (text as string).replace(new RegExp(`{{${k}}}`, 'g'), String(displayValue));
      });
    }

    return text;
  };

  // Expose to window for strategic debugging/testing
  if (typeof window !== 'undefined') {
    (window as any)._translator = (window as any)._translator || {};
    (window as any)._translator['en'] = tFunc;
  }

  return tFunc;
};
