
import { GoogleGenAI } from "@google/genai";

/**
 * Sovereign AI Client Factory
 * يضمن دائماً استخدام أحدث مفتاح API من البيئة
 */
export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("CRITICAL_AUTH_FAILURE: API Key not detected.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Safe AI Call Wrapper
 * معالجة الأخطاء مع نظام إعادة محاولة ذكي (Exponential Backoff)
 */
export async function safeAICall<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message || "";
    const isQuotaError = errorMsg.includes('429') || error.status === 429;
    const isNotFoundError = errorMsg.includes('Requested entity was not found');

    if (isNotFoundError) {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        window.aistudio.openSelectKey();
      }
      throw new Error("API_KEY_INVALID: Please re-select a paid project key.");
    }

    if (retries > 0 && isQuotaError) {
      console.warn(`[AI_GATEWAY] Rate limited. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeAICall(fn, retries - 1, delay * 2);
    }
    
    console.error("[AI_GATEWAY_CRITICAL]", error);
    throw error;
  }
}
