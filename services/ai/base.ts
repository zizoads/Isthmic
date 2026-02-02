
import { GoogleGenAI } from "@google/genai";

/**
 * Sovereign AI Base: Direct SDK implementation.
 * Stable Version 1.1: Added telemetry tracking for performance monitoring.
 */

export async function safeAICall<T>(arg: any, retries = 2): Promise<T> {
  const startTime = performance.now();
  
  // Logic Wrapper execution
  if (typeof arg === 'function') {
    try {
      const result = await arg();
      return result;
    } catch (error: any) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        return safeAICall(arg, retries - 1);
      }
      throw error;
    }
  }

  // Direct SDK execution (Stable Path)
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: arg.model || 'gemini-3-flash-preview',
      contents: arg.contents,
      config: arg.config
    });

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    // تسجيل البيانات الوصفية للأداء في الاستجابة (بشكل غير مرئي للمستخدم النهائي)
    if (response) {
      (response as any)._telemetry = { latency };
    }

    if (!response) throw new Error("SOVEREIGN_CORE_EMPTY_RESPONSE");
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
): Promise<{ data: T, cached: boolean, latency: number }> {
  if (signal?.aborted) throw new Error("AbortError");
  const startTime = performance.now();

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

    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);

    const text = response.text || "";
    const data = JSON.parse(text) as T;
    return { data, cached: false, latency };
  } catch (e: any) {
    if (e.message === "AbortError") throw e;
    console.error("SOVEREIGN_STRUCTURED_SYNTHESIS_FAILURE:", e);
    throw new Error("FAILED_TO_SYNTHESIZE_DATA_IN_CURRENT_PULSE");
  }
}
