
import { GoogleGenAI } from "@google/genai";

export const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("CRITICAL_AUTH_FAILURE");
  return new GoogleGenAI({ apiKey });
};

export async function safeAICall<T>(fn: () => Promise<T>, retries = 1, delay = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const msg = error.message || "";
    const isQuota = error.status === 429 || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED');

    if (isQuota) {
      console.error("AI_QUOTA_EXHAUSTED");
      throw new Error("QUOTA_EXHAUSTED");
    }

    if (msg.includes('Requested entity was not found') && globalThis.aistudio) {
      globalThis.aistudio.openSelectKey();
    }

    if (retries > 0) {
      await new Promise(r => globalThis.setTimeout(r, delay));
      return safeAICall(fn, retries - 1, delay * 2);
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
      config: { systemInstruction, responseMimeType: "application/json", responseSchema: schema, tools }
    });
    return JSON.parse(response.text || '{}') as T;
  });
}
