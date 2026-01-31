import { GoogleGenAI } from "@google/genai";
import { LaunchReadinessReport, SovereignAutopsyReport, EWSAlert, ComponentStatus } from "../types";
import { safeAICall } from "./ai/base";
import { LAUNCH_READINESS_SCHEMA } from "./ai/schemas";

/**
 * LaunchReadinessService: Strategic Production Controller.
 * Final Phase: Global Launch Logic & Safety Governance.
 */
export class LaunchReadinessService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';
  private static readonly LATENCY_THRESHOLD_MS = 2000;
  private static readonly ERROR_BURST_THRESHOLD = 3;

  /**
   * Executive Synthesis of the platform's posture.
   */
  static async evaluateLaunchPosture(autopsies: SovereignAutopsyReport[]): Promise<LaunchReadinessReport> {
    return safeAICall(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const context = autopsies.map(a => ({
        id: a.id,
        name: a.specimen.name,
        health: a.metrics.overallHealthIndex,
        security: a.metrics.securityScore,
        performance: a.performance.executionTime,
        criticality: a.technicalDebt.criticality
      }));

      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `
          Role: FAANG Production Director.
          Mission: Approve global release of Isthmic Pro v13.0.
          
          COMPONENT AUDITS:
          ${JSON.stringify(context)}
          
          CALCULATION LOGIC:
          - Overall Score: (Avg Security * 0.4) + (Avg Health * 0.3) + (Stability * 0.3).
          - A component is "STABLE" if Security > 90 and Health > 85.
          - A component is "CRITICAL" if Security < 70 or has "CRITICAL" debt.
          - "authorizedForLaunch" is TRUE only if Overall Score >= 90 and blockers = 0.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: LAUNCH_READINESS_SCHEMA
        }
      });

      return JSON.parse(response.text || '{}');
    });
  }

  /**
   * EWS: Real-time anomaly detection.
   */
  static monitorTelemetry(logs: any[]): { status: 'NOMINAL' | 'ALERT' | 'CRITICAL'; alerts: EWSAlert[] } {
    const alerts: EWSAlert[] = [];
    const recentLogs = logs.slice(0, 50);

    // 1. Detection: Latency Spikes
    const spikes = recentLogs.filter(l => l.actionPayload?.latency > this.LATENCY_THRESHOLD_MS);
    if (spikes.length > 0) {
      alerts.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: spikes[0].agent,
        type: 'LATENCY_SPIKE',
        severity: 'WARNING',
        metric: `${spikes[0].actionPayload.latency}ms delta`
      });
    }

    // 2. Detection: System Failures (Simulated or Real)
    const failures = recentLogs.filter(l => l.type === 'critical' || l.message.includes('FAILURE'));
    if (failures.length >= this.ERROR_BURST_THRESHOLD) {
      alerts.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: 'Sovereign_Core',
        type: 'ERROR_BURST',
        severity: 'CRITICAL',
        metric: `${failures.length} systemic failures detected`
      });
    }

    // 3. Status Derivation
    let status: 'NOMINAL' | 'ALERT' | 'CRITICAL' = 'NOMINAL';
    if (alerts.some(a => a.severity === 'CRITICAL')) status = 'CRITICAL';
    else if (alerts.length > 0) status = 'ALERT';

    return { status, alerts };
  }
}