
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenAI } from "https://esm.sh/@google/genai@1.38.0"

// Fix: Declare Deno global for environments where types aren't explicitly loaded
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // التعامل مع طلبات CORS التمهيدية
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { model, contents, config } = await req.json()

    // تهيئة SDK باستخدام المفتاح المخزن في أسرار Supabase
    // ملاحظة: يتم جلب المفتاح حصرياً من البيئة الآمنة للدالة
    const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY") || "" })

    // تنفيذ الطلب عبر نموذج Gemini
    const response = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: contents,
      config: config
    })

    return new Response(
      JSON.stringify(response),
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
