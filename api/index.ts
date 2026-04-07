import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { readFile } from "fs/promises";
import { createProxyMiddleware } from "http-proxy-middleware";
import { GoogleGenAI } from "@google/genai";
import { ProfessionalBrandGenerator } from "../src/services/ai/ProfessionalBrandGenerator";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Brand Generator
  const brandGen = ProfessionalBrandGenerator.getInstance();
  try {
    await brandGen.init();
  } catch (e) {
    console.error("Brand Generator initialization failed:", e);
  }

  // API Routes
  app.get("/api/project/intelligence", async (_req, res) => {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const metadataPath = path.join(process.cwd(), 'metadata.json');
      
      const [packageJson, metadata] = await Promise.all([
        readFile(packageJsonPath, 'utf8').then(JSON.parse),
        readFile(metadataPath, 'utf8').then(JSON.parse)
      ]);

      res.json({
        useCases: "Brand Intelligence, Domain Acquisition, Strategic Mining, Market Analysis",
        refactorPlan: "1. Core Infrastructure Hardening\n2. Python Engine Integration\n3. Real-time Dashboard Implementation\n4. Multi-agent Coordination",
        metadata,
        packageJson
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch project context" });
    }
  });

  app.get("/api/generate-brands", async (req, res) => {
    const { domain = 'ai', niche = 'general_ai', count = '5' } = req.query;
    try {
      const names = await brandGen.generate_for_niche(
        domain as string, 
        niche as string, 
        parseInt(count as string)
      );
      res.json({ names });
    } catch (e) {
      res.status(500).json({ error: "Failed to generate brands" });
    }
  });

  // Proxy API requests to the Python engine (Hugging Face Space URL)
  let PYTHON_ENGINE_URL = process.env.PYTHON_ENGINE_URL || "https://azeddinebeldjilali9-isthmic.hf.space";
  if (!PYTHON_ENGINE_URL.endsWith('/')) PYTHON_ENGINE_URL += '/';

  const apiProxy = createProxyMiddleware({
    target: PYTHON_ENGINE_URL,
    changeOrigin: true,
    pathRewrite: (path) => {
      // Remove /api prefix if the target engine doesn't expect it
      // But based on current setup, we just remove the leading slash
      return path.startsWith('/') ? path.slice(1) : path;
    },
    proxyTimeout: 60000, 
    timeout: 60000,
    headers: {
      'Connection': 'keep-alive',
    },
    on: {
      proxyReq: (proxyReq, req, _res) => {
        // Hugging Face often needs these to be correct
        proxyReq.setHeader('Origin', PYTHON_ENGINE_URL);
        proxyReq.setHeader('Referer', PYTHON_ENGINE_URL);
        
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      error: (err: Error, _req: any, res: any) => {
        console.error("Proxy Error:", err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: "Python engine unreachable", 
            details: err.message,
            target: PYTHON_ENGINE_URL
          }));
        }
      },
    }
  });

  app.use("/api/crawl", apiProxy);
  app.use("/api/trends", apiProxy);
  app.use("/api/opportunities", apiProxy);
  
  app.post("/api/ai-proxy", async (req, res) => {
    const { model, systemInstruction, prompt, schema, tools, configOverrides } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured on server" });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const modelId = model || 'gemini-1.5-flash';
      
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { 
          systemInstruction, 
          responseMimeType: "application/json", 
          responseSchema: schema,
          tools: tools,
          ...configOverrides
        }
      });

      const text = response.text;
      if (!text) throw new Error("EMPTY_INFERENCE_RECEIVED");

      res.json({ 
        data: JSON.parse(text),
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      });
    } catch (e: any) {
      console.error("AI Proxy Error:", e.message);
      res.status(500).json({ error: "AI Proxy failed", details: e.message });
    }
  });

  app.use("/api/health_proxy", async (_req, res) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(PYTHON_ENGINE_URL, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      res.json({ 
        status: "proxy_ok", 
        target: PYTHON_ENGINE_URL,
        reachable: response.ok,
        targetStatus: response.status
      });
    } catch (e: any) {
      res.status(503).json({ 
        status: "proxy_error", 
        target: PYTHON_ENGINE_URL,
        reachable: false,
        error: e.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(500).send("CORE_NEGOTIATION_FAILED: The production build is missing or unreachable.");
        }
      });
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

const appPromise = startServer();

export default async (req: any, res: any) => {
  const app = await appPromise;
  app(req, res);
};
