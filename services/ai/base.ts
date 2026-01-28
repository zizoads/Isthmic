
import { GoogleGenAI, Type } from "@google/genai";

export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("CRITICAL_AUTH_FAILURE: API Key not detected.");
  return new GoogleGenAI({ apiKey });
};

/**
 * محرك استدعاء ذكي مع معالجة متقدمة للكوتا (Error 429)
 */
export async function safeAICall<T>(fn: () => Promise<T>, retries = 3, delay = 5000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStatus = error.status || (error.message?.includes('429') ? 429 : 0);
    const isQuotaError = errorStatus === 429 || error.message?.includes('RESOURCE_EXHAUSTED');

    if (isQuotaError) {
      console.warn(`[AI Quota] Resource exhausted. Retrying in ${delay}ms... (${retries} retries left)`);
      
      if (retries > 0) {
        // التراجع الأسي لإعطاء الخادم مساحة للتنفس
        await new Promise(r => setTimeout(r, delay));
        return safeAICall(fn, retries - 1, delay * 2);
      }
      
      // إرسال حدث مخصص لإبلاغ الواجهة الأمامية بتعطل الكوتا
      window.dispatchEvent(new CustomEvent('ai-quota-exhausted', { 
        detail: { message: "تم الوصول للحد الأقصى للطلبات المجانية. يرجى الانتظار قليلاً أو تبديل المفتاح." } 
      }));
    }

    if (error.message?.includes('Requested entity was not found') && window.aistudio) {
      window.aistudio.openSelectKey();
    }

    throw error;
  }
}

/**
 * المحرك الهيكلي الموحد - يضمن مخرجات JSON دقيقة مع دعم AbortSignal.
 */
export async function generateStructuredAI<T>(
  modelName: 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash',
  systemInstruction: string,
  prompt: string,
  schema: any,
  tools?: any[],
  signal?: AbortSignal
): Promise<T> {
  return safeAICall(async () => {
    if (signal?.aborted) throw new Error("Aborted");
    
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        tools: tools
      }
    });
    return JSON.parse(response.text || '{}') as T;
  });
}
