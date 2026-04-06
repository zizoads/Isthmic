interface Env {
  PYTHON_ENGINE_URL: string;
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

  // Handle local API routes (mocking what's in api/index.ts)
  if (path === "/api/project/intelligence") {
    return new Response(JSON.stringify({
      useCases: "Brand Intelligence, Domain Acquisition, Strategic Mining, Market Analysis",
      refactorPlan: "1. Core Infrastructure Hardening\n2. Python Engine Integration\n3. Real-time Dashboard Implementation\n4. Multi-agent Coordination",
      platform: "Cloudflare Pages"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (path === "/api/generate-brands") {
    // Note: ProfessionalBrandGenerator logic would need to be ported or called via another service
    // For now, we return a placeholder or a simple implementation
    return new Response(JSON.stringify({ 
      names: ["alpha.ai", "nexus.io", "isthmic.pro", "sovereign.tech", "core.net"],
      note: "Porting complex logic to Edge requires specialized handling."
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // Fallback for other /api routes
  return new Response(JSON.stringify({ error: "Route not found on Edge" }), {
    status: 404,
    headers: { "Content-Type": "application/json" }
  });
};
