import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { readFile } from "fs/promises";
import { GoogleGenAI } from "@google/genai";
import { ProfessionalBrandGenerator } from "./services/ProfessionalBrandGenerator";
import { EventOrchestrator } from "../services/EventOrchestrator";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Brand Generator & Event Orchestrator
  const brandGen = ProfessionalBrandGenerator.getInstance();
  const orchestrator = EventOrchestrator.getInstance();
  try {
    await brandGen.init();
    await orchestrator.start();
    console.log("🎖️ [SYSTEM] Event Orchestrator active.");
  } catch (e) {
    console.error("System initialization failed:", e);
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
