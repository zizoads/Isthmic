
import { AlignmentReport, StrategicObjective, PlatformStats, CausalRejectionModel, Domain } from "../../types";
import { generateStructuredAI, safeAICall } from "./base";
import { Type } from "@google/genai";

export class OrchestrationService {
  private static readonly MODEL = 'gemini-3-flash-preview';

  /**
   * Calculates Alignment Velocity using a weighted moving average.
   */
  static calculateAlignmentVelocity(history: AlignmentReport[]): number {
    if (!history || history.length < 2) return 0;
    const points = history.slice(0, 10);
    const changes = [];
    for (let i = 0; i < points.length - 1; i++) {
      const weight = (points.length - i) / points.length;
      changes.push((points[i].alignmentScore - points[i+1].alignmentScore) * weight);
    }
    if (changes.length === 0) return 0;
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    return Math.round(avgChange * 10) / 10;
  }

  /**
   * Stage 4: Adaptive Threshold Logic.
   * Adjusts the 80% "Elite" filter based on performance velocity and discovery density.
   */
  static calculateAdaptiveThreshold(stats: PlatformStats, velocity: number): number {
    let base = 80;
    
    // Rule 1: Low Velocity = Tighten (Requires higher precision)
    if (velocity < 5) base += 5;
    
    // Rule 2: High Latency = Tighten (Prioritize only top assets to save resources)
    if (stats.telemetry?.avgLatency && stats.telemetry.avgLatency > 2000) base += 5;
    
    // Rule 3: High Success Rate = Loosen (Explore more opportunities)
    if (stats.telemetry?.inferenceSuccessRate && stats.telemetry.inferenceSuccessRate > 98) base -= 3;

    return Math.max(70, Math.min(95, base));
  }

  /**
   * Stage 4: Proactive Viability Prediction.
   * Uses causal history to predict an asset's score BEFORE forensic audit.
   */
  static async predictAssetViability(
    assetName: string, 
    causalModels: CausalRejectionModel[]
  ): Promise<{ viability: number; penaltyReason?: string }> {
    return safeAICall(async () => {
      // Direct inference based on logic chains
      const context = causalModels.map(m => `- Pattern: ${m.reason} [Logic: ${m.causalLogicChain}]`).join('\n');
      
      const result = await generateStructuredAI<{score: number, reason?: string}>(
        this.MODEL,
        `Role: Causal Prediction Engine. History: ${context}`,
        `Predict viability (0-100) for asset: "${assetName}" based on historical causal patterns.`,
        {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          }
        }
      );
      
      return { 
        viability: result.data.score, 
        penaltyReason: result.data.score < 50 ? result.data.reason : undefined 
      };
    });
  }

  static async evaluateStrategicAlignment(
    snapshot: any, 
    objective: StrategicObjective
  ): Promise<AlignmentReport> {
    return safeAICall(async () => {
      const result = await generateStructuredAI<AlignmentReport>(
        this.MODEL,
        `Role: Sovereign Alignment Monitor. Objective: ${objective.description}`,
        `Snapshot: ${JSON.stringify(snapshot)}. Evaluate Score 0-100.`,
        {
          type: Type.OBJECT,
          properties: {
            alignmentScore: { type: Type.NUMBER },
            status: { type: Type.STRING, enum: ['GREEN', 'YELLOW', 'RED'] },
            reasoning: { type: Type.STRING },
            suggestedAdjustment: { type: Type.STRING }
          },
          required: ['alignmentScore', 'status', 'reasoning', 'suggestedAdjustment']
        }
      );
      return result.data;
    });
  }

  static injectStrategicContext(objectives: StrategicObjective[]): string {
    if (!objectives || objectives.length === 0) return "General high-alpha strategy.";
    return objectives
      .map(o => `- ${o.category} Objective: ${o.description} [Status: ${o.status}]`)
      .join('\n');
  }

  static async generateInitialObjectives(thesis: string): Promise<StrategicObjective[]> {
    return [
      {
        id: 'obj_liquidity',
        category: 'LIQUIDITY',
        description: 'Maximize exit velocity (Avg < 45 days)',
        targetValue: 45,
        currentValue: 0,
        unit: 'days',
        status: 'TRACKING',
        weight: 0.8,
        linkedServices: ['NEGOTIATION', 'LIQUIDATION'],
        evaluationPrompt: 'Reject buyers with low financial credibility.',
        lastEvaluated: new Date().toISOString(),
        alignmentHistory: []
      },
      {
        id: 'obj_alpha',
        category: 'ACQUISITION',
        description: 'Target Alpha Margin > 500%',
        targetValue: 500,
        currentValue: 0,
        unit: '%',
        status: 'TRACKING',
        weight: 1.0,
        linkedServices: ['DISCOVERY'],
        evaluationPrompt: 'Focus on high DA domains with search intent.',
        lastEvaluated: new Date().toISOString(),
        alignmentHistory: []
      }
    ];
  }
}
