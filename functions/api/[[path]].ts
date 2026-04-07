interface Env {
  PYTHON_ENGINE_URL: string;
  GEMINI_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, params } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Proxy to Python Engine for specific routes
  const pythonRoutes = ["/api/crawl", "/api/trends", "/api/opportunities", "/api/health_proxy"];
  const PYTHON_ENGINE_URL = env.PYTHON_ENGINE_URL || "https://azeddinebeldjilali9-isthmic.hf.space";

  if (pythonRoutes.some(route => path.startsWith(route))) {
    const targetUrl = new URL(path + url.search, PYTHON_ENGINE_URL);
    
    // Create a new request to the target
    const newRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });

    try {
      const response = await fetch(newRequest);
      return response;
    } catch (e: any) {
      return new Response(JSON.stringify({ error: "Python engine unreachable", details: e.message }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Handle local API routes
  if (path === "/api/project/intelligence") {
    return new Response(JSON.stringify({
      useCases: "Brand Intelligence, Domain Acquisition, Strategic Mining, Market Analysis",
      refactorPlan: "1. Core Infrastructure Hardening\n2. Python Engine Integration\n3. Real-time Dashboard Implementation\n4. Multi-agent Coordination",
      platform: "Cloudflare Pages",
      env_status: {
        gemini: !!env.GEMINI_API_KEY,
        python: !!env.PYTHON_ENGINE_URL
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (path === "/api/generate-brands") {
    const niche = url.searchParams.get('niche') || 'general_ai';
    const count = parseInt(url.searchParams.get('count') || '5');

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured in Cloudflare environment." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const prompt = `Generate ${count} high-value brand names and domain opportunities for the niche: ${niche}. 
      Focus on semantic hand-reg .com assets. 
      Return ONLY a JSON object with a "names" array of strings.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API Error: ${err}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const result = JSON.parse(text);

      return new Response(JSON.stringify({ 
        names: result.names || [],
        source: "Gemini 1.5 Flash (Edge)"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: "Failed to generate brands via Gemini", details: e.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  if (path === "/api/ai-proxy") {
    if (request.method !== 'POST') return new Response("Method not allowed", { status: 405 });
    
    const body = await request.json() as any;
    const { model, systemInstruction, prompt, schema, tools, configOverrides } = body;

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500 });
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { 
            responseMimeType: "application/json", 
            responseSchema: schema,
            ...configOverrides
          },
          tools: tools
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Gemini API Error: ${err}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const grounding = data.candidates?.[0]?.groundingMetadata?.groundingChunks;

      return new Response(JSON.stringify({ 
        data: JSON.parse(text),
        grounding
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: "AI Proxy failed", details: e.message }), { status: 500 });
    }
  }

  // Fallback for other /api routes
  return new Response(JSON.stringify({ error: "Route not found on Edge" }), {
    status: 404,
    headers: { "Content-Type": "application/json" }
  });
};
