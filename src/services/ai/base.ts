
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
  signal?: AbortSignal,
  userApiKey?: string
): Promise<{ data: T, latency: number, grounding?: any[] }> {
  const startTime = performance.now();
  
  // In browser, we prefer calling the backend to avoid exposing keys in the client bundle
  if (typeof window !== 'undefined') {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userApiKey) {
        headers['x-user-api-key'] = userApiKey;
      }

      const response = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelName,
          systemInstruction,
          prompt: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn("AI_PROXY_ERROR:", errorData);
        // Fallback to local call if proxy fails and key is available
        if (!process.env.GEMINI_API_KEY && !userApiKey) {
           throw new Error(`AI_PROXY_FAILURE: ${response.status} ${JSON.stringify(errorData)}`);
        }
      }
    } catch (e) {
      console.warn("AI_PROXY_FETCH_FAILED, attempting local call if key exists...", e);
      if (!process.env.GEMINI_API_KEY && !userApiKey) throw e;
    }
  }

  // Local call (Development or Fallback)
  const activeKey = userApiKey || process.env.GEMINI_API_KEY;
  if (!activeKey) throw new Error("AI_GATEWAY_FAILURE: No API key configured (neither user nor system).");

  const ai = new GoogleGenAI({ apiKey: activeKey });
  
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

  // Mandatory: access .text as a property
  const text = response.text;
  if (!text) throw new Error("EMPTY_INFERENCE_RECEIVED");

  const data = JSON.parse(text) as T;
  const latency = Math.round(performance.now() - startTime);
  const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  return { data, latency, grounding };
}

export async function safeAICall<T>(arg: any, userApiKey?: string): Promise<T> {
  // In browser, we prefer calling the backend to avoid exposing keys in the client bundle
  if (typeof window !== 'undefined') {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userApiKey) {
        headers['x-user-api-key'] = userApiKey;
      }

      const response = await fetch('/api/ai-proxy', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: arg.model || 'gemini-3-flash-preview',
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.warn("AI_SAFE_PROXY_ERROR:", errorData);
        if (!process.env.GEMINI_API_KEY && !userApiKey) {
          throw new Error(`AI_SAFE_PROXY_FAILURE: ${response.status} ${JSON.stringify(errorData)}`);
        }
      }
    } catch (e) {
      console.warn("AI_SAFE_PROXY_FETCH_FAILED, attempting local call if key exists...", e);
      if (!process.env.GEMINI_API_KEY && !userApiKey) throw e;
    }
  }

  try {
    if (typeof arg === 'function') {
      return await arg();
    }

    const activeKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!activeKey) throw new Error("AI_SAFE_CALL_FAILURE: No API key configured.");
    
    const ai = new GoogleGenAI({ apiKey: activeKey });
    
    const response = await ai.models.generateContent({
      model: arg.model || 'gemini-3-flash-preview',
      contents: arg.contents,
      config: arg.config || {}
    });
    
    const resultText = response.text;
    if (typeof arg === 'object' && arg.config?.responseMimeType === 'application/json') {
       return JSON.parse(resultText || '{}') as T;
    }
    
    return response as unknown as T;
  } catch (error: any) {
    const errorMsg = error?.message || '';
    if (errorMsg.includes('429') || errorMsg.includes('Quota exceeded')) {
      console.warn("AI_SAFE_CALL_WARNING (Rate Limit):", errorMsg);
    } else {
      console.error("AI_SAFE_CALL_ERROR:", error);
    }
    throw error;
  }
}
