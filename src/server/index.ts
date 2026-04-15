import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { readFile } from "fs/promises";
import { Resolver } from "dns/promises";
import { GoogleGenAI } from "@google/genai";
import { ProfessionalBrandGenerator } from "./services/ProfessionalBrandGenerator";
import { EventOrchestrator } from "../services/EventOrchestrator";

// Global error handlers to prevent unhandled rejections from crashing the SOC
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Initialize a dedicated DNS Resolver pointing to public global DNS
  const dnsResolver = new Resolver();
  try {
    dnsResolver.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    console.warn("Failed to set custom DNS servers, falling back to system default", e);
  }

  // Initialize Brand Generator & Event Orchestrator
  const brandGen = ProfessionalBrandGenerator.getInstance();
  const orchestrator = EventOrchestrator.getInstance();
  try {
    await brandGen.init();
    await orchestrator.start();
  } catch (e) {
    console.error("Core engine initialization failed", e);
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

  // DNS-First Gateway for Domain Availability with Global Resolver
  app.get("/api/check-domain", async (req, res) => {
    const { domain } = req.query;
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: "Domain is required" });
    }

    try {
      let isRegistered = false;
      let reason = "No DNS records found";
      
      try {
        // We use resolveAny to check for ANY record type (A, AAAA, MX, NS, TXT, etc.)
        // This is much more accurate than lookup()
        const records = await dnsResolver.resolveAny(domain);
        if (records && records.length > 0) {
          isRegistered = true;
          reason = "Active DNS records detected";
        }
      } catch (error: unknown) {
        const err = error as { code?: string };
        // ENOTFOUND means the domain definitely has no records in global DNS
        if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
          isRegistered = false;
          reason = "NXDOMAIN - Available for registration";
        } else {
          // For timeouts or other DNS errors, we assume it's available to avoid false positives
          isRegistered = false; 
          reason = `DNS Query Error: ${err.code}`;
        }
      }

      return res.json({ 
        domain, 
        available: !isRegistered, 
        reason
      });
    } catch (_e) {
      return res.status(500).json({ error: "Internal server error during DNS check" });
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
appPromise.catch((err) => console.error("Server start failed:", err));

export default async (req: express.Request, res: express.Response) => {
  try {
    const app = await appPromise;
    app(req, res);
  } catch (err) {
    console.error("Request failed because server failed to start:", err);
    res.status(500).send("Internal Server Error: Server failed to start");
  }
};
