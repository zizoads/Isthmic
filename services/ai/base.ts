
import { GoogleGenAI } from "@google/genai";

/**
 * Sovereign AI Base: Direct SDK implementation.
 * Bypasses intermediate Edge Functions to ensure high availability and protocol resilience.
 */

export async function safeAICall<T>(arg: any, retries = 2): Promise<T> {
  // If arg is a logic wrapper (function), execute it directly.
  if (typeof arg === 'function') {
    try {
      return await arg();
    } catch (error: any) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        return safeAICall(arg, retries - 1);
      }
      throw error;
    }
  }

  // Fallback direct SDK implementation for legacy structured calls if they pass a payload
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: arg.model || 'gemini-3-flash-preview',
      contents: arg.contents,
      config: arg.config
    });

    if (!response) throw new Error("EMPTY_RESPONSE_FROM_SOVEREIGN_ENGINE");

    // Return the response object to match expected behavior of legacy callers
    return response as unknown as T;
  } catch (error: any) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return safeAICall(arg, retries - 1);
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
  if (signal?.aborted) throw new Error("Aborted");

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: { 
        systemInstruction, 
        responseMimeType: "application/json", 
        responseSchema: schema, 
        tools,
        toolConfig
      },
    });

    const text = response.text || "";
    const data = JSON.parse(text) as T;
    return { data, cached: false };
  } catch (e: any) {
    if (e.message === "Aborted") throw e;
    console.error("SOVEREIGN_GEN_STRUCTURED_ERR:", e);
    throw new Error("FAILED_TO_SYNTHESIZE_STRUCTURED_DATA");
  }
}
