
import { GoogleGenAI } from "@google/genai";

/**
 * نتحقق من المفتاح فقط عند محاولة تنفيذ عملية ذكاء اصطناعي
 */
export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return null; 
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * دالة معالجة الأخطاء الذكية مع دعم التراجع الأسي (Exponential Backoff)
 * تم زيادة عدد المحاولات وتحسين الرسائل لمعالجة مشكلة انتهاء الحصة.
 */
export async function safeAICall<T>(fn: () => Promise<T>, retries = 4, delay = 3000): Promise<T> {
  const ai = getAIClient();
  if (!ai) {
    throw new Error("يرجى تفعيل مفتاح الذكاء الاصطناعي من الإعدادات لاستخدام هذه الميزة.");
  }

  try {
    return await fn();
  } catch (error: any) {
    const msg = error.message || "";
    const isQuotaError = msg.includes('429') || msg.includes('quota') || msg.toLowerCase().includes('exhausted');
    
    if (isQuotaError) {
       if (retries > 0) {
         console.warn(`ISTHMIC_RESILIENCE: Quota hit. Retrying in ${delay}ms... (${retries} retries left)`);
         await new Promise(r => globalThis.setTimeout(r, delay));
         // نضاعف وقت الانتظار في كل محاولة فاشلة
         return safeAICall(fn, retries - 1, delay * 2);
       }
       throw new Error("تجاوزت حد الاستخدام المسموح به (Quota Exceeded). يرجى الانتظار قليلاً أو تبديل مفتاح الـ API المستخدم من لوحة التحكم.");
    }
    
    // معالجة أخطاء المفتاح غير الصالحة
    if (msg.includes('API key not found') || msg.includes('invalid')) {
      throw new Error("مفتاح الـ API الحالي غير صالح أو غير مفعل. يرجى التحقق من إعدادات الفوترة.");
    }

    throw error;
  }
}

export async function generateStructuredAI<T>(
  modelName: 'gemini-3-pro-preview' | 'gemini-3-flash-preview' | 'gemini-2.5-flash',
  systemInstruction: string,
  prompt: string,
  schema: any,
  tools?: any[],
  signal?: AbortSignal
): Promise<T> {
  if (signal?.aborted) throw new Error("Aborted");
  
  return safeAICall(async () => {
    const ai = getAIClient();
    if (!ai) throw new Error("AI_KEY_MISSING");
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { 
        systemInstruction, 
        responseMimeType: "application/json", 
        responseSchema: schema, 
        tools,
        // تفعيل التفكير فقط للموديلات المتقدمة وبميزانية معقولة لتوفير التوكنز
        ...(modelName === 'gemini-3-pro-preview' ? { thinkingConfig: { thinkingBudget: 2000 } } : {})
      }
    });
    return JSON.parse(response.text || '{}') as T;
  });
}
