
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Isthmic Pro - Sovereign AI Execution Base v5.0 (RC1)
 * يتم استدعاء هذا المحرك في كل عملية استنباط استراتيجي.
 */

export const getAIClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("CRITICAL_ERR: SOVEREIGN_KEY_NOT_LOCATED");
  return new GoogleGenAI({ apiKey });
};

/**
 * Safe AI Wrapper: يضمن استقرار الاتصال عبر تطبيق التراجع الأسي ومعالجة الأخطاء السيادية.
 */
export async function safeAICall<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  // Stress-Testing Chaos Monkey
  if (localStorage.getItem('isthmic_chaos_mode') === 'true' && Math.random() < 0.2) {
    console.warn("STRESS_PROTOCOL: Injecting synthetic instability (429)");
    throw new Error("RESOURCES_EXHAUSTED: Synthetic Chaos Active");
  }

  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message || "";
    
    // Auth failures - requires key reset
    if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('Requested entity was not found')) {
      console.error("SHIELD_ALERT: Sovereign key identity mismatch.");
      throw new Error("SOVEREIGN_KEY_EXPIRED");
    }

    // Rate limits or transient errors - trigger Backoff
    if ((errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCES_EXHAUSTED')) && retries > 0) {
      const waitTime = Math.pow(2, 4 - retries) * 1200;
      console.info(`SOVEREIGN_RECOVERY: Signal turbulence. Backing off for ${waitTime}ms...`);
      await new Promise(r => setTimeout(r, waitTime));
      return safeAICall(fn, retries - 1);
    }

    throw error;
  }
}

/**
 * دالة الاستنباط الهيكلي لضمان الحصول على JSON مطابق للمخطط.
 */
export async function generateStructuredAI<T>(
  modelName: string,
  systemInstruction: string,
  prompt: string,
  schema: any,
  tools?: any[],
  toolConfig?: any,
  signal?: AbortSignal
): Promise<{ data: T, cached: boolean }> {
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
        toolConfig
      }
    });
    
    // Fix: Moved 'text' declaration outside the try block so it is accessible in the catch block
    const text = response.text || '{}';
    try {
      const data = JSON.parse(text) as T;
      return { data, cached: false };
    } catch (e) {
      console.error("AI_INTEGRITY_ERR: Failed to parse neural payload", text);
      throw new Error("PAYLOAD_PARSING_FAILURE");
    }
  });
}
