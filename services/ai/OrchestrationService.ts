
import { GoogleGenAI } from "@google/genai";
import { AlignmentReport, StrategicObjective, NegotiationThread, ObjectiveStatus } from "../../types";
import { safeAICall, generateStructuredAI } from "./base";
import { STRATEGIC_ALIGNMENT_SCHEMA } from "./schemas";
import { NegotiationService } from "./NegotiationService";

/**
 * OrchestrationService: The "Sovereign Chief of Staff".
 * Responsible for tactical calibration and strategic alignment audits.
 */
export class OrchestrationService {
  private static readonly MODEL = 'gemini-3-flash-preview';

  /**
   * evaluateStrategicAlignment: يقارن أداء الخدمة بالهدف الاستراتيجي.
   */
  static async evaluateStrategicAlignment(
    serviceData: any, 
    objective: StrategicObjective
  ): Promise<AlignmentReport> {
    return safeAICall(async () => {
      const result = await generateStructuredAI<AlignmentReport>(
        this.MODEL,
        `You are the Sovereign Alignment Monitor. 
         Your mission is to compare incoming operational data against the Commander's Strategic Objective.
         Detect deviations, risks, and suggest surgical corrections.`,
        `STRATEGIC_OBJECTIVE: ${objective.description} (Criteria: ${objective.evaluationPrompt})
         OPERATIONAL_DATA: ${JSON.stringify(serviceData)}
         
         Analyze: Does this data align with the objective? 
         Return a score (0-100), status, and reasoning.`,
        STRATEGIC_ALIGNMENT_SCHEMA
      );

      return result.data;
    });
  }

  /**
   * monitorNegotiationAlignment: Active Polling helper for Negotiation Hub.
   * Updates objective history and status in-place.
   */
  static async monitorNegotiationAlignment(
    thread: NegotiationThread,
    domainName: string,
    objective: StrategicObjective
  ): Promise<{ report: AlignmentReport; updatedObjective: StrategicObjective } | null> {
    if (!objective.linkedServices.includes('NEGOTIATION' as any)) return null;

    const snapshot = NegotiationService.getStrategicSnapshot(thread, domainName);
    if (snapshot.messageCount === 0) return null;

    const report = await this.evaluateStrategicAlignment(snapshot, objective);
    
    // تحديث الحالة بناءً على النتيجة
    let newStatus: ObjectiveStatus = 'TRACKING' as any;
    if (report.status === 'RED') newStatus = 'DEVIATED' as any;
    else if (report.status === 'YELLOW') newStatus = 'AT_RISK' as any;

    const updatedObjective: StrategicObjective = {
      ...objective,
      status: newStatus,
      lastEvaluated: new Date().toISOString(),
      alignmentHistory: [report, ...objective.alignmentHistory].slice(0, 10)
    };

    return { report, updatedObjective };
  }

  /**
   * injectStrategicContext: يحول الأهداف النشطة إلى تعليمات برمجية لمحرك الاكتشاف.
   */
  static injectStrategicContext(objectives: StrategicObjective[]): string {
    if (objectives.length === 0) return "";
    const constraints = objectives.map(o => `- ${o.description}: ${o.evaluationPrompt}`).join('\n');
    return `\nCRITICAL STRATEGIC CONSTRAINTS (MANDATORY):\n${constraints}\nDO NOT suggest items that violate these constraints.`;
  }

  /**
   * Phase 1 Mock: توليد أهداف وهمية للاختبار بناءً على الفلسفة الاستثمارية.
   */
  static async generateInitialObjectives(investmentThesis: string): Promise<StrategicObjective[]> {
    return [
      {
        id: 'obj_1',
        category: 'LIQUIDITY',
        description: 'تسييل سريع للأصول التقنية',
        targetValue: 5,
        currentValue: 2,
        unit: 'Units',
        status: 'TRACKING' as any,
        weight: 0.8,
        linkedServices: ['NEGOTIATION' as any],
        evaluationPrompt: 'التركيز على العروض التي تزيد عن 300% من سعر الاستحواذ مع دورة بيع أقل من 30 يوماً.',
        lastEvaluated: new Date().toISOString(),
        alignmentHistory: []
      },
      {
        id: 'obj_2',
        category: 'RISK_MITIGATION',
        description: 'تقليل مخاطر العلامات التجارية',
        targetValue: 100,
        currentValue: 95,
        unit: '%',
        status: 'TRACKING' as any,
        weight: 1.0,
        linkedServices: ['ACQUISITION' as any, 'DISCOVERY' as any],
        evaluationPrompt: 'منع أي استحواذ يحتوي على تشابه صوتي مع شركات Fortune 500.',
        lastEvaluated: new Date().toISOString(),
        alignmentHistory: []
      }
    ];
  }
}
