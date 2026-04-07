
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { PlatformStats } from "../../types";

export class ExecutiveSynthesisService {
  static async synthesizeStrategicBriefing(stats: PlatformStats, sectors: string[]) {
    return generateStructuredAI<any>(
      'gemini-1.5-pro',
      "Role: Chief Strategy Officer. Task: Synthesize executive narrative.",
      `Context: Portfolio Value $${stats.estimatedPortfolioValue}. 
       Alignment Velocity: ${stats.alignmentVelocity}%. 
       Sectors: ${sectors.join(', ')}`,
      {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          capitalEfficiency: { type: Type.STRING },
          riskVerdict: { type: Type.STRING },
          projections: {
            type: Type.OBJECT,
            properties: {
              liquidityTimeline: { type: Type.STRING },
              projectedYield: { type: Type.NUMBER }
            }
          }
        }
      }
    );
  }
}
