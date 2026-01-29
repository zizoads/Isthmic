
import { GoogleGenAI } from "@google/genai";

/**
 * محرك الربط الأساسي - يضمن استخدام أحدث مفتاح API متوفر
 * ويقوم بالتحقق من وجوده قبل بدء أي عملية سيادية.
 */
export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // في بيئة الإنتاج، لا نريد كسر التطبيق بل تنبيه المستخدم
    console.error("ISTHMIC_CORE: MISSING_Sovereign_Key. Systems operating in logic-only mode.");
    throw new Error("API_KEY_REQUIRED");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * نظام المعالجة الآمن - يتضمن منطق إعادة المحاولة (Retry Logic) 
 * للتعامل مع ضغط الطلبات في بيئة العمل الفعلية.
 */
export async function safeAICall<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const msg = error.message || "";
    const status = error.status;
    
    // التعامل مع تجاوز حصة الاستخدام (Rate Limiting)
    if (status === 429 || msg.includes('429') || msg.includes('quota')) {
       console.warn("ISTHMIC_CORE: Rate limit hit. Initializing backoff protocol...");
       if (retries > 0) {
         await new Promise(r => globalThis.setTimeout(r, delay));
         return safeAICall(fn, retries - 1, delay * 2);
       }
       throw new Error("QUOTA_EXHAUSTED");
    }

    // التعامل مع انتهاء صلاحية المفتاح أو عدم وجوده
    if (status === 401 || msg.includes('not found') || msg.includes('API_KEY_INVALID')) {
       if (globalThis.aistudio) {
          globalThis.aistudio.openSelectKey();
       }
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
        tools,
        // إضافة إعدادات التفكير (Thinking Budget) للنماذج الاحترافية
        ...(modelName === 'gemini-3-pro-preview' ? { thinkingConfig: { thinkingBudget: 4000 } } : {})
      }
    });
    return JSON.parse(response.text || '{}') as T;
  });
}
