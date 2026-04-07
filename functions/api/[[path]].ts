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
  let PYTHON_ENGINE_URL = env.PYTHON_ENGINE_URL || "https://azeddinebeldjilali9-isthmic.hf.space";
  if (!PYTHON_ENGINE_URL.endsWith('/')) PYTHON_ENGINE_URL += '/';

  if (pythonRoutes.some(route => path.startsWith(route))) {
    // Remove leading slash from path to join correctly with base URL
    const relativePath = path.startsWith('/') ? path.slice(1) : path;
    const targetUrl = new URL(relativePath + url.search, PYTHON_ENGINE_URL);
    
    // Create new headers to avoid host mismatch and other issues
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", targetUrl.host);
    newHeaders.delete("cf-connecting-ip");
    newHeaders.delete("cf-ipcountry");
    newHeaders.delete("cf-ray");
    newHeaders.delete("cf-visitor");

    // Clone request body if it exists
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.clone().arrayBuffer();
    }

    // Create a new request to the target
    const newRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers: newHeaders,
      body: body,
      redirect: 'follow'
    });

    try {
      const response = await fetch(newRequest);
      
      // Copy response to a new response object to ensure headers are correct
      const modifiedResponse = new Response(response.body, response);
      modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
      
      return modifiedResponse;
    } catch (e: any) {
      console.error(`Proxy Error for ${path}:`, e.message);
      return new Response(JSON.stringify({ 
        error: "Python engine unreachable", 
        details: e.message,
        target: targetUrl.toString()
      }), {
        status: 502,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
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

    // Ensure model name has the correct prefix
    let modelId = model || 'gemini-1.5-flash';
    if (!modelId.startsWith('models/')) {
      modelId = `models/${modelId}`;
    }

    const callGemini = async (mId: string) => {
      return await fetch(`https://generativelanguage.googleapis.com/v1beta/${mId}:generateContent?key=${env.GEMINI_API_KEY}`, {
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
    };

    try {
      let response = await callGemini(modelId);

      // Fallback if model not found
      if (response.status === 404 && modelId !== 'models/gemini-1.5-flash') {
        console.warn(`Model ${modelId} not found, falling back to gemini-1.5-flash`);
        response = await callGemini('models/gemini-1.5-flash');
      }

      if (!response.ok) {
        const err = await response.text();
        let parsedErr;
        try { parsedErr = JSON.parse(err); } catch { parsedErr = err; }
        return new Response(JSON.stringify({ error: "Gemini API Error", details: parsedErr }), { 
          status: response.status,
          headers: { "Content-Type": "application/json" }
        });
      }

      const data = await response.json() as any;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const grounding = data.candidates?.[0]?.groundingMetadata?.groundingChunks;

      if (!text) {
        return new Response(JSON.stringify({ error: "Empty response from Gemini", raw: data }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ 
        data: JSON.parse(text),
        grounding
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: "AI Proxy failed", details: e.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Fallback for other /api routes
  return new Response(JSON.stringify({ error: "Route not found on Edge" }), {
    status: 404,
    headers: { "Content-Type": "application/json" }
  });
};
