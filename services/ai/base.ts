
import { GoogleGenAI, Type } from "@google/genai";

export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("CRITICAL_AUTH_FAILURE: API Key not detected.");
  return new GoogleGenAI({ apiKey });
};

export async function safeAICall<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message || "";
    if (errorMsg.includes('Requested entity was not found') && window.aistudio) {
      window.aistudio.openSelectKey();
    }
    if (retries > 0 && (error.status === 429 || errorMsg.includes('429'))) {
      await new Promise(r => setTimeout(r, delay));
      return safeAICall(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * محرك الذكاء الاصطناعي الموحد (The Sovereign Engine)
 * يضمن مخرجات JSON دقيقة مع دعم كامل للبحث والتحقق
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
