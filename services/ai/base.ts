
import { GoogleGenAI } from "@google/genai";

/**
 * نتحقق من المفتاح فقط عند محاولة تنفيذ عملية ذكاء اصطناعي
 */
export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // لا نلقي خطأ هنا لكي لا تنهار الواجهة عند الدخول
    return null; 
  }
  return new GoogleGenAI({ apiKey });
};

export async function safeAICall<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  const ai = getAIClient();
  if (!ai) {
    throw new Error("يرجى تفعيل مفتاح الذكاء الاصطناعي من الإعدادات لاستخدام هذه الميزة.");
  }

  try {
    return await fn();
  } catch (error: any) {
    const msg = error.message || "";
    if (msg.includes('429') || msg.includes('quota')) {
       if (retries > 0) {
         await new Promise(r => globalThis.setTimeout(r, delay));
         return safeAICall(fn, retries - 1, delay * 2);
       }
       throw new Error("انتهت حصة الاستخدام المجانية للمفتاح الحالي.");
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
        ...(modelName === 'gemini-3-pro-preview' ? { thinkingConfig: { thinkingBudget: 4000 } } : {})
      }
    });
    return JSON.parse(response.text || '{}') as T;
  });
}
