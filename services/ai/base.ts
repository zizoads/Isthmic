
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
  
  // Mandatory: obtain API key exclusively from process.env.API_KEY
  // Comment above fix: Direct initialization with process.env.API_KEY as per GenAI coding guidelines
  if (!process.env.API_KEY) throw new Error("AI_GATEWAY_FAILURE: process.env.API_KEY is not configured.");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
  try {
    if (typeof arg === 'function') {
      return await arg();
    }

    // Comment above fix: Direct initialization with process.env.API_KEY as per GenAI coding guidelines
    if (!process.env.API_KEY) throw new Error("AI_SAFE_CALL_FAILURE: process.env.API_KEY is not configured.");
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: arg.model || 'gemini-3-flash-preview',
      contents: arg.contents,
      config: arg.config || {}
    });
    
    // Safety check for text property
    const resultText = response.text;
    if (typeof arg === 'object' && arg.responseMimeType === 'application/json') {
       return JSON.parse(resultText || '{}') as T;
    }
    
    return response as unknown as T;
  } catch (error: any) {
    console.error("AI_SAFE_CALL_ERROR:", error);
    throw error;
  }
}
