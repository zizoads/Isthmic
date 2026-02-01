
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.38.0"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // التعامل مع طلبات التحقق من الاتصال (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, contents, config } = await req.json()
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in Supabase project secrets");
    }

    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: contents,
      config: config
    })

    // استخراج النص يدوياً لضمان وصوله للواجهة بشكل سليم
    const textOutput = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({ ...result, text: textOutput }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
