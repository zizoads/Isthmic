
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.38.0"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json();
    const { model, contents, config } = payload;
    
    // ستقوم بجلب هذا المفتاح من إعدادات Secrets في Supabase
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is missing in Supabase Secrets" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const formattedContents = typeof contents === 'string' 
      ? [{ role: 'user', parts: [{ text: contents }] }]
      : contents;

    const response = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: formattedContents,
      config: config || {}
    });

    return new Response(
      JSON.stringify({ text: response.text || "", candidates: response.candidates }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
