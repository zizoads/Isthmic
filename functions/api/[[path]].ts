interface Env {
  PYTHON_ENGINE_URL: string;
  GEMINI_API_KEY: string;
}

interface AIProxyBody {
  model?: string;
  systemInstruction?: string;
  prompt?: string;
  schema?: Record<string, unknown>;
  tools?: unknown[];
  configOverrides?: Record<string, unknown>;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] }[] };
  groundingMetadata?: { groundingChunks?: unknown[] };
}

const PYTHON_ROUTES = ["/api/crawl", "/api/trends", "/api/opportunities", "/api/health_proxy"];

async function handleProxy(request: Request, env: Env, path: string, url: URL): Promise<Response> {
  let PYTHON_ENGINE_URL = env.PYTHON_ENGINE_URL || "https://azeddinebeldjilali9-isthmic.hf.space";
  if (!PYTHON_ENGINE_URL.endsWith('/')) PYTHON_ENGINE_URL += '/';

  const relativePath = path.startsWith('/') ? path.slice(1) : path;
  const targetUrl = new URL(relativePath + url.search, PYTHON_ENGINE_URL);
  
  const newHeaders = new Headers(request.headers);
  newHeaders.set("Host", targetUrl.host);
  newHeaders.delete("cf-connecting-ip");
  newHeaders.delete("cf-ipcountry");
  newHeaders.delete("cf-ray");
  newHeaders.delete("cf-visitor");

  let body: ArrayBuffer | null = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.clone().arrayBuffer();
  }

  const newRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: newHeaders,
    body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(newRequest);
    if (!response.ok && (response.status === 404 || response.status === 502)) {
      throw new Error(`Python engine returned ${response.status}`);
    }
    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set("Access-Control-Allow-Origin", "*");
    return modifiedResponse;
  } catch (e: unknown) {
    console.warn(`Proxy Fallback for ${path}:`, e instanceof Error ? e.message : String(e));
    if (path === "/api/trends" || path === "/api/opportunities") {
      return await handleLocalGeminiFallback(request, env, path, url);
    }
    return new Response(JSON.stringify({ error: "Intelligence engine unreachable", details: e instanceof Error ? e.message : String(e) }), { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
}

async function handleLocalGeminiFallback(request: Request, env: Env, path: string, url: URL): Promise<Response> {
  const activeApiKey = request.headers.get('x-user-api-key') || env.GEMINI_API_KEY;
  if (!activeApiKey) return new Response(JSON.stringify({ error: "No API key" }), { status: 401 });

  const isTrends = path === "/api/trends";
  const prompt = isTrends 
    ? `Generate 5 emerging tech trends. Params: ${url.search}. Return JSON array of {id, keyword, opportunity_score, platforms, velocity}.`
    : `Generate 3 brand opportunities. Params: ${url.search}. Return JSON array of {id, name, opportunity_score, positioning, gap, supporting_evidence}.`;

  const fallbackRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    })
  });

  if (fallbackRes.ok) {
    const data = await fallbackRes.json() as { candidates?: { content?: { parts?: { text?: string }[] }[] }[] };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return new Response(text, { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
  return new Response(JSON.stringify({ error: "Local AI fallback failed" }), { status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
}

async function handleAiProxy(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return new Response("Method not allowed", { status: 405 });
  
  const body = await request.json() as AIProxyBody;
  const { model, systemInstruction, prompt, schema, tools, configOverrides } = body;

  const activeApiKey = request.headers.get('x-user-api-key') || env.GEMINI_API_KEY;
  if (!activeApiKey) return new Response(JSON.stringify({ error: "No API key" }), { status: 500 });

  let modelId = model || 'gemini-1.5-flash';
  if (!modelId.startsWith('models/')) modelId = `models/${modelId}`;

  const callGemini = async (mId: string) => {
    return await fetch(`https://generativelanguage.googleapis.com/v1beta/${mId}:generateContent?key=${activeApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema, ...configOverrides },
        tools
      })
    });
  };

  try {
    let response = await callGemini(modelId);
    if (response.status === 404 && modelId !== 'models/gemini-1.5-flash') {
      response = await callGemini('models/gemini-1.5-flash');
    }

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: "Gemini API Error", details: err }), { status: response.status, headers: { "Content-Type": "application/json" } });
    }

    const data = await response.json() as GeminiResponse;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return new Response(JSON.stringify({ error: "Empty response" }), { status: 500, headers: { "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ data: JSON.parse(text), grounding: data.groundingMetadata?.groundingChunks }), { headers: { "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: "AI Proxy failed", details: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  if (PYTHON_ROUTES.some(route => path.startsWith(route))) {
    return await handleProxy(request, env, path, url);
  }

  if (path === "/api/ai-proxy") return await handleAiProxy(request, env);

  if (path === "/api/project/intelligence") {
    return new Response(JSON.stringify({
      useCases: "Brand Intelligence, Domain Acquisition, Strategic Mining, Market Analysis",
      platform: "Cloudflare Pages",
      env_status: { gemini: Boolean(env.GEMINI_API_KEY), python: Boolean(env.PYTHON_ENGINE_URL) }
    }), { headers: { "Content-Type": "application/json" } });
  }

  if (path === "/api/generate-brands") {
    const niche = url.searchParams.get('niche') || 'general_ai';
    const count = parseInt(url.searchParams.get('count') || '5');
    if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });

    try {
      const prompt = `Generate ${count} high-value brand names for niche: ${niche}. Return ONLY JSON object with "names" array.`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } })
      });
      if (!response.ok) throw new Error("Gemini API Error");
      const data = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] }[] } };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text returned");
      const result = JSON.parse(text) as { names?: string[] };
      return new Response(JSON.stringify({ names: result.names || [], source: "Gemini 1.5 Flash (Edge)" }), { headers: { "Content-Type": "application/json" } });
    } catch (e: unknown) {
      return new Response(JSON.stringify({ error: "Failed to generate brands", details: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  return new Response(JSON.stringify({ error: "Route not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
};
