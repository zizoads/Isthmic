
import { GoogleGenAI } from "@google/genai";

/**
 * ⚡ SOVEREIGN AI CORE (Standard Path)
 * Integrated with strict environment key resolution for Gemini.
 */

export async function generateStructuredAI<T>(
  modelName: string,
  systemInstruction: string,
  prompt: string,
  schema: any,
  tools?: any[],
  configOverrides?: any,
  signal?: AbortSignal
): Promise<{ data: T, latency: number, grounding?: any[] }> {
  const startTime = performance.now();
  
  // In production, we prefer calling the backend to avoid exposing keys in the client bundle
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || !process.env.GEMINI_API_KEY)) {
    try {
      const response = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          systemInstruction,
          prompt,
          schema,
          tools,
          configOverrides
        }),
        signal
      });

      if (response.ok) {
        const result = await response.json();
        return {
          data: result.data,
          latency: Math.round(performance.now() - startTime),
          grounding: result.grounding
        };
      }
    } catch (e) {
      console.warn("AI_PROXY_FALLBACK_FAILED, attempting local call if key exists...", e);
    }
  }

  // Local call (Development or Fallback)
  if (!process.env.GEMINI_API_KEY) throw new Error("AI_GATEWAY_FAILURE: process.env.GEMINI_API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: { 
      systemInstruction, 
      responseMimeType: "application/json", 
      responseSchema: schema,
      tools: tools,
      ...configOverrides
    },
    // @ts-ignore
    signal: signal
  });

  // Mandatory: access .text as a property, not a method
  const text = response.text;
  if (!text) throw new Error("EMPTY_INFERENCE_RECEIVED");

  const data = JSON.parse(text) as T;
  const latency = Math.round(performance.now() - startTime);
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  return { data, latency, grounding };
}

export async function safeAICall<T>(arg: any): Promise<T> {
  // In production, we prefer calling the backend to avoid exposing keys in the client bundle
  if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'production' || !process.env.GEMINI_API_KEY)) {
    try {
      const response = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: arg.model || 'gemini-1.5-flash',
          systemInstruction: arg.systemInstruction || "AI Assistant",
          prompt: typeof arg.contents === 'string' ? arg.contents : JSON.stringify(arg.contents),
          schema: arg.config?.responseSchema,
          tools: arg.config?.tools || arg.tools,
          configOverrides: arg.config
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (arg.config?.responseMimeType === 'application/json') {
          return result.data as T;
        }
        return result as unknown as T;
      }
    } catch (e) {
      console.warn("AI_SAFE_PROXY_FALLBACK_FAILED, attempting local call if key exists...", e);
    }
  }

  try {
    if (typeof arg === 'function') {
      return await arg();
    }

    if (!process.env.GEMINI_API_KEY) throw new Error("AI_SAFE_CALL_FAILURE: process.env.GEMINI_API_KEY is not configured.");
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: arg.model || 'gemini-1.5-flash',
      contents: arg.contents,
      config: arg.config || {}
    });
    
    const resultText = response.text;
    if (typeof arg === 'object' && arg.config?.responseMimeType === 'application/json') {
       return JSON.parse(resultText || '{}') as T;
    }
    
    return response as unknown as T;
  } catch (error: any) {
    console.error("AI_SAFE_CALL_ERROR:", error);
    throw error;
  }
}
