
import { GoogleGenAI } from "@google/genai";
import { Domain, PlatformStats, PlatformStrategy } from "../types";

export interface IntelligenceReport {
  id: string;
  timestamp: string;
  executiveSummary: string;
  strategicOpportunities: Array<{
    title: string;
    description: string;
    impactScore: number;
    actionRequired: string;
  }>;
  financialForecast: {
    projectedROI: string;
    liquidityOutlook: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  marketSentiment: string;
}

class SovereignReportService {
  private ai: any;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  public async synthesizeIntelligence(
    domains: Domain[],
    stats: PlatformStats,
    strategy: PlatformStrategy
  ): Promise<IntelligenceReport | null> {
    const context = {
      activeAssets: domains.map(d => ({ name: d.name, status: d.status, price: d.price })),
      performance: stats,
      investmentThesis: strategy.investmentThesis
    };

    const prompt = `As the Sovereign Intelligence Officer for Isthmic Pro, synthesize a high-level strategic report based on the following system state:
    ${JSON.stringify(context)}
    
    The report must include:
    1. An executive summary (max 3 sentences).
    2. 3 strategic opportunities found in the current asset pool.
    3. A financial forecast including projected ROI and risk level.
    4. Market sentiment analysis.
    
    Return ONLY a JSON object matching the IntelligenceReport interface.`;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const report = JSON.parse(response.text);
      return {
        ...report,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("Intelligence Synthesis Error:", error);
      return null;
    }
  }
}

export const sovereignReportService = new SovereignReportService();
