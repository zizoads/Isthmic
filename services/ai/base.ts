
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Preprocess Arabic text for better AI understanding.
 * Removes heavy diacritics and normalizes specific letters.
 */
const preprocessArabic = (text: string): string => {
  if (!/[\u0600-\u06FF]/.test(text)) return text;
  
  return text
    .replace(/[\u064B-\u0652]/g, "") // Remove Harakat
    .replace(/ـ+/g, "")             // Remove Tatweel (Kashida)
    .replace(/[أإآ]/g, "ا")         // Normalize Alef
    .replace(/ة/g, "ه")             // Normalize Teh Marbuta (optional, depends on precision needs)
    .trim();
};

export const getAIClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("CRITICAL_ERR: SOVEREIGN_KEY_NOT_LOCATED");
  return new GoogleGenAI({ apiKey });
};

export async function safeAICall<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  // Chaos Engineering Simulation
  if (localStorage.getItem('isthmic_chaos_mode') === 'true' && Math.random() < 0.2) {
    throw new Error("RESOURCES_EXHAUSTED: Synthetic Chaos Active");
  }

  try {
    return await fn();
  } catch (error: any) {
    const errorMsg = error.message || "";
    
    // Auth failures (401, 403)
    if (errorMsg.includes('401') || errorMsg.includes('403') || errorMsg.includes('Requested entity was not found')) {
      throw new Error("SOVEREIGN_KEY_EXPIRED");
    }

    // Rate limiting & Quota (429) - P1 Remediation: Jitter Implementation
    if ((errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCES_EXHAUSTED')) && retries > 0) {
      const attempt = 4 - retries;
      // Exponential backoff: 2^attempt * 1000ms + random jitter (0-1000ms)
      const baseDelay = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      const waitTime = baseDelay + jitter;
      
      console.warn(`[AI_BACKOFF] Attempt ${attempt} failed. Retrying in ${Math.round(waitTime)}ms...`);
      await new Promise(r => setTimeout(r, waitTime));
      return safeAICall(fn, retries - 1);
    }
    
    throw error;
  }
}

export async function generateStructuredAI<T>(
  modelName: string,
  systemInstruction: string,
  prompt: string,
  schema: any,
  tools?: any[],
  toolConfig?: any,
  signal?: AbortSignal
): Promise<{ data: T, cached: boolean }> {
  const cleanedPrompt = preprocessArabic(prompt);
  
  return safeAICall(async () => {
    if (signal?.aborted) throw new Error("Aborted");

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: modelName,
      contents: cleanedPrompt,
      config: { 
        systemInstruction, 
        responseMimeType: "application/json", 
        responseSchema: schema, 
        tools,
        toolConfig
      }
    });
    
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
