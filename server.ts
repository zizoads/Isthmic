import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API routes
  app.get("/api/trends", (req, res) => {
    res.json([
      { id: '1', keyword: 'AI-Sovereign', opportunity_score: 0.95, velocity: 0.88, platforms: ['TechCrunch', 'Product Hunt'] },
      { id: '2', keyword: 'Domain-Nexus', opportunity_score: 0.82, velocity: 0.75, platforms: ['AngelList', 'BetaList'] }
    ]);
  });

  app.get("/api/opportunities", (req, res) => {
    res.json([
      { 
        id: '1', 
        name: 'Sovereign.ai', 
        opportunity_score: 0.92, 
        positioning: 'Leading AI-driven domain acquisition platform.', 
        gap: 'Lack of automated negotiation tools.',
        supporting_evidence: ['AI', 'Domain', 'Negotiation']
      }
    ]);
  });

  app.post("/api/crawl", (req, res) => {
    console.log("Crawl mission started with payload:", req.body);
    res.json({ status: "started" });
  });

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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
