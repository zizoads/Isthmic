import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { readFile } from "fs/promises";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ProfessionalBrandGenerator } from "./src/services/ai/ProfessionalBrandGenerator";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Brand Generator
  const brandGen = ProfessionalBrandGenerator.getInstance();
  try {
    await brandGen.init();
    console.log("[SERVER] Brand Generator initialized.");
  } catch (e) {
    console.error("[SERVER] Brand Generator init failed:", e);
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
      console.error("Project intelligence error:", e);
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
      console.error("Brand generation error:", e);
      res.status(500).json({ error: "Failed to generate brands" });
    }
  });

  // Proxy API requests to the Python engine (Render URL will go here)
  const PYTHON_ENGINE_URL = process.env.PYTHON_ENGINE_URL || "http://localhost:10000";

  const apiProxy = createProxyMiddleware({
    target: PYTHON_ENGINE_URL,
    changeOrigin: true,
    // Correct event handler for http-proxy-middleware v3
    on: {
      error: (err: Error, _req: any, res: any) => {
        console.error("[PROXY ERROR]", err.message);
        // Return JSON instead of letting it fall through to SPA fallback
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Python engine unreachable", details: err.message }));
      },
    }
  });

  // Apply proxy to specific endpoints
  app.use("/api/crawl", apiProxy);
  app.use("/api/trends", apiProxy);
  app.use("/api/opportunities", apiProxy);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
