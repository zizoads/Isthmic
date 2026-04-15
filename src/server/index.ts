import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { readFile } from "fs/promises";
import dns from "dns/promises";
import { GoogleGenAI } from "@google/genai";
import { ProfessionalBrandGenerator } from "./services/ProfessionalBrandGenerator";
import { EventOrchestrator } from "../services/EventOrchestrator";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize Brand Generator & Event Orchestrator
  const brandGen = ProfessionalBrandGenerator.getInstance();
  const orchestrator = EventOrchestrator.getInstance();
  try {
    await brandGen.init();
    await orchestrator.start();
  } catch {
    // Initialization failed
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
        refactorPlan: "1. Core Infrastructure Hardening\n2. Real-time Dashboard Implementation\n3. Multi-agent Coordination\n4. Sovereign Mesh Expansion",
        metadata,
        packageJson
      });
    } catch {
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
    } catch {
      res.status(500).json({ error: "Failed to generate brands" });
    }
  });

  // DNS-First Gateway for Domain Availability with Hijack Detection
  app.get("/api/check-domain", async (req, res) => {
    const { domain } = req.query;
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: "Domain is required" });
    }

    try {
      // 1. Detect DNS Hijacking (Common in some cloud/ISP environments)
      // We resolve a guaranteed non-existent domain to see if the environment returns a "Search Page" IP
      let hijackIp: string | null = null;
      try {
        const randomDomain = `isthmic-check-${Math.random().toString(36).substring(7)}.com`;
        const lookup = await dns.lookup(randomDomain);
        hijackIp = lookup.address;
      } catch {
        // No hijacking detected, this is good
      }

      let isRegistered = false;
      let resolvedIp: string | null = null;
      
      try {
        const lookup = await dns.lookup(domain);
        resolvedIp = lookup.address;
        
        // If it resolves to the same IP as our non-existent test, it's actually available
        if (hijackIp && resolvedIp === hijackIp) {
          isRegistered = false;
        } else {
          isRegistered = true;
        }
      } catch (error: unknown) {
        const err = error as { code?: string };
        // ENOTFOUND and ENODATA mean it's definitely available
        if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
          isRegistered = false;
        } else {
          // For other errors (timeout, etc.), we'll be optimistic to avoid false "TAKEN"
          isRegistered = false; 
        }
      }

      return res.json({ 
        domain, 
        available: !isRegistered, 
        reason: isRegistered ? 'DNS records found' : (resolvedIp ? 'DNS Hijack Detected (Likely available)' : 'No DNS records found')
      });
    } catch (_e) {
      return res.status(500).json({ error: "Failed to check domain" });
    }
  });

  // Alpha Mine Intelligence Routes (Local implementation using Gemini)
  app.get("/api/trends", async (req, res) => {
    const userApiKey = req.headers['x-user-api-key'] as string;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) return res.status(401).json({ error: "API Key required" });

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Generate 5 emerging technology trends based on these parameters: ${JSON.stringify(req.query)}. 
      Return ONLY a JSON array of objects with: id, keyword, opportunity_score (0-1), platforms (array), velocity (0-1).`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return res.json(JSON.parse(response.text || '{}'));
    } catch (e: unknown) {
      return res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  app.get("/api/opportunities", async (req, res) => {
    const userApiKey = req.headers['x-user-api-key'] as string;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) return res.status(401).json({ error: "API Key required" });

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `Generate 3 brand opportunities based on these parameters: ${JSON.stringify(req.query)}. 
      Return ONLY a JSON array of objects with: id, name, opportunity_score (0-100), positioning, gap, supporting_evidence (array).`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      return res.json(JSON.parse(response.text || '{}'));
    } catch (e: unknown) {
      return res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
    }
  });

  app.post("/api/ai-proxy", async (req, res) => {
    const { model, systemInstruction, prompt, schema, tools, configOverrides } = req.body;
    const userApiKey = req.headers['x-user-api-key'] as string;
    
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(401).json({ 
        error: "GEMINI_API_KEY not configured or invalid. Please provide a valid key in Settings or via header." 
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const modelId = model || 'gemini-3-flash-preview';
      
      const response = await ai.models.generateContent({
        model: modelId,
        contents: [{ role: 'user', parts: [{ text: typeof prompt === 'string' ? prompt : JSON.stringify(prompt) }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: schema,
          tools,
          ...configOverrides
        }
      });

      const text = response.text;
      
      if (!text) throw new Error("EMPTY_INFERENCE_RECEIVED");

      res.json({ 
        data: JSON.parse(text),
        grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      });
    } catch (e: unknown) {
      res.status(500).json({ error: "AI Synthesis failed", details: (e as Error).message });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      version: "2.3.5",
      engine: "Sovereign Core"
    });
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
    app.get('*all', (_req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(500).send("CORE_NEGOTIATION_FAILED: The production build is missing or unreachable.");
        }
      });
    });
  }

  if (!process.env.VERCEL) {
    const portNum = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
    app.listen(portNum, "0.0.0.0", () => {
      // Server started
    });
  }

  return app;
}

const appPromise = startServer();
appPromise.catch(() => console.error("Server start failed"));

export default async (req: express.Request, res: express.Response) => {
  const app = await appPromise;
  app(req, res);
};
