
import { AlignmentReport, StrategicObjective, PlatformStats } from "../../types";
import { generateStructuredAI, safeAICall } from "./base";
import { Type } from "@google/genai";

export class OrchestrationService {
  private static readonly MODEL = 'gemini-3-flash-preview';

  /**
   * Calculates Alignment Velocity using a weighted moving average.
   * Tracks how the platform's execution is converging with Commander Intent.
   */
  static calculateAlignmentVelocity(history: AlignmentReport[]): number {
    if (!history || history.length < 2) return 0;
    
    // Take up to last 10 points
    const points = history.slice(0, 10);
    const changes = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      // Recent reports (index 0) should have higher weight
      const weight = (points.length - i) / points.length;
      changes.push((points[i].alignmentScore - points[i+1].alignmentScore) * weight);
    }
    
    if (changes.length === 0) return 0;
    const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
    return Math.round(avgChange * 10) / 10;
  }

  /**
   * Evaluate a specific operational action against an objective.
   */
  static async evaluateStrategicAlignment(
    snapshot: any, 
    objective: StrategicObjective
  ): Promise<AlignmentReport> {
    return safeAICall(async () => {
      const result = await generateStructuredAI<AlignmentReport>(
        this.MODEL,
        `Role: Sovereign Alignment Monitor. 
         Objective: ${objective.description}. 
         Protocol: Judge operational snapshot vs Strategic Intent.`,
        `Snapshot: ${JSON.stringify(snapshot)}. 
         Is the current agent activity deviating from the mission? 
         Score: 0-100 (100 = Perfect Sync).`,
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

  /**
   * Inject current constraints into AI system instructions.
   */
  static injectStrategicContext(objectives: StrategicObjective[]): string {
    if (!objectives || objectives.length === 0) return "General high-alpha growth strategy.";
    return objectives
      .map(o => `- ${o.category} Constraint: ${o.description} [Status: ${o.status}]`)
      .join('\n');
  }

  static async generateInitialObjectives(thesis: string): Promise<StrategicObjective[]> {
    // Generate tailored objectives based on thesis
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
        evaluationPrompt: 'Reject buyers with low financial credibility or slow response cycles.',
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
        evaluationPrompt: 'Only accept domains with verified search console potential or historical DA > 20.',
        lastEvaluated: new Date().toISOString(),
        alignmentHistory: []
      }
    ];
  }
}
