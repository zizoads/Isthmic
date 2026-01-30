
import { GoogleGenAI } from "@google/genai";

/**
 * Singleton للوصول الموحد لتقليل الـ Overhead على الذاكرة
 */
let aiClientInstance: GoogleGenAI | null = null;

export const getAIClient = (): GoogleGenAI => {
  if (aiClientInstance) return aiClientInstance;
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("CRITICAL: API_KEY_MISSING");
  aiClientInstance = new GoogleGenAI({ apiKey });
  return aiClientInstance;
};

/**
 * معالج الطلبات الذكي: يضمن عدم توقف المحرك عند حدوث Quota Error
 */
export async function safeAICall<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRetryable = error.message?.includes('429') || error.message?.toLowerCase().includes('quota');
    if (isRetryable && retries > 0) {
      // Exponential backoff
      await new Promise(r => setTimeout(r, Math.pow(2, 4 - retries) * 1000));
      return safeAICall(fn, retries - 1);
    }
    throw error;
  }
}

// Updated signature to accept AbortSignal and toolConfig
export async function generateStructuredAI<T>(
  modelName: string,
  systemInstruction: string,
  prompt: string,
  schema: any,
  tools?: any[],
  signal?: AbortSignal,
  toolConfig?: any
): Promise<T> {
  return safeAICall(async () => {
    const ai = getAIClient();
    // Removed unsupported 'signal' property from generateContent call to fix known properties error.
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
    
    try {
      return JSON.parse(response.text || '{}') as T;
    } catch (e) {
      console.error("JSON_PARSE_ERR", response.text);
      throw new Error("FAILED_TO_PARSE_AI_RESPONSE");
    }
  });
}
