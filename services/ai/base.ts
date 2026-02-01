
import { supabase } from "../SupabaseClient";

export async function safeAICall<T>(arg: any, retries = 2): Promise<T> {
  // إذا كان الوسيط دالة منطقية (Logic Wrapper)
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

  // استدعاء الـ Edge Function مباشرة بالاسم الصحيح: rapid-handler
  try {
    const { data, error } = await supabase.functions.invoke('rapid-handler', {
      body: arg
    });

    if (error) {
      console.error("EDGE_FUNCTION_INVOKE_ERR:", error);
      throw error;
    }

    if (!data) throw new Error("EMPTY_DATA_FROM_AI_PROXY");

    return data as T;
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

  const payload = {
    model: modelName,
    contents: prompt,
    config: { 
      systemInstruction, 
      responseMimeType: "application/json", 
      responseSchema: schema, 
      tools,
      toolConfig
    }
  };

  const response = await safeAICall<any>(payload);
  const text = response.text || "";
  
  try {
    const data = JSON.parse(text) as T;
    return { data, cached: false };
  } catch (e) {
    throw new Error("FAILED_TO_PARSE_AI_RESPONSE");
  }
}
