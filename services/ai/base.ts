
import { Type, GenerateContentResponse } from "@google/genai";
import { supabase } from "../SupabaseClient";

/**
 * Preprocess Arabic text for better AI understanding.
 */
const preprocessArabic = (text: string): string => {
  if (!/[\u0600-\u06FF]/.test(text)) return text;
  return text
    .replace(/[\u064B-\u0652]/g, "") 
    .replace(/ـ+/g, "")             
    .replace(/[أإآ]/g, "ا")         
    .replace(/ة/g, "ه")             
    .trim();
};

/**
 * safeAICall: Sovereign Resilience Wrapper.
 * يوجه الطلبات عبر Edge Function لضمان أمان المفاتيح.
 */
export async function safeAICall<T>(payload: any, retries = 3): Promise<T> {
  try {
    const { data, error } = await supabase.functions.invoke('secure-ai-proxy', {
      body: payload
    });

    if (error) {
      if (error.message?.includes('429') && retries > 0) {
        const waitTime = Math.pow(2, 4 - retries) * 1000 + Math.random() * 1000;
        await new Promise(r => setTimeout(r, waitTime));
        return safeAICall(payload, retries - 1);
      }
      throw error;
    }

    return data as T;
  } catch (error: any) {
    if (error.message?.includes('SOVEREIGN_KEY_EXPIRED') || error.status === 401) {
      throw new Error("SOVEREIGN_KEY_EXPIRED");
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
  
  if (signal?.aborted) throw new Error("Aborted");

  const payload = {
    model: modelName,
    contents: cleanedPrompt,
    config: { 
      systemInstruction, 
      responseMimeType: "application/json", 
      responseSchema: schema, 
      tools,
      toolConfig
    }
  };

  // الرد القادم من Edge Function هو JSON خام، لذا نستخرج النص منه يدوياً
  const response = await safeAICall<any>(payload);
  
  const text = response.text || response.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text || '{}';
  try {
    const data = JSON.parse(text) as T;
    return { data, cached: false };
  } catch (e) {
    console.error("AI_INTEGRITY_ERR: Failed to parse neural payload", text);
    throw new Error("PAYLOAD_PARSING_FAILURE");
  }
}

// تعطيل الوصول المباشر لـ SDK نهائياً للأمان
export const getAIClient = (): any => {
  throw new Error("SECURITY_VIOLATION: Direct SDK access is disabled. Use Edge Proxy.");
};
