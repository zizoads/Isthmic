
import { GoogleGenAI } from "@google/genai";
import { LaunchReadinessReport, SovereignAutopsyReport, EWSAlert, ComponentStatus } from "../types";
import { safeAICall } from "./ai/base";
import { LAUNCH_READINESS_SCHEMA } from "./ai/schemas";

/**
 * LaunchReadinessService: Strategic Production Controller.
 * Final Phase: Global Launch Logic & Safety Governance.
 * v13.1: Enhanced with Elite Threshold Monitoring.
 */
export class LaunchReadinessService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';
  private static readonly LATENCY_THRESHOLD_MS = 2000;
  private static readonly SHIELD_LATENCY_MAX_MS = 5; // Elite threshold
  private static readonly ERROR_BURST_THRESHOLD = 3;
  private static readonly MIN_PRECISION_ALPHA = 0.85; // 85% threshold

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
          - Decision Protocol:
            1. GO: Score >= 90 AND blockers = 0.
            2. GO_WITH_CONDITIONS: Score 80-89 OR blockers > 0 but non-critical.
            3. NO_GO: Score < 80 OR critical security flaw.
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
   * EWS: Real-time anomaly detection with added elite thresholds.
   */
  static monitorTelemetry(logs: any[]): { status: 'NOMINAL' | 'ALERT' | 'CRITICAL'; alerts: EWSAlert[] } {
    const alerts: EWSAlert[] = [];
    const recentLogs = logs.slice(0, 50);

    // 1. Detection: Network Latency Spikes
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

    // 2. Detection: Shield Performance Degradation (Elite Threshold)
    const shieldLogs = recentLogs.filter(l => l.agent === 'Shield' && l.actionPayload?.entropyLatency > this.SHIELD_LATENCY_MAX_MS);
    if (shieldLogs.length > 0) {
      alerts.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: 'Sovereign_Shield',
        type: 'SHIELD_ENTROPY_LOW',
        severity: 'CRITICAL',
        metric: `Local execution > ${this.SHIELD_LATENCY_MAX_MS}ms`
      });
    }

    // 3. Detection: System Failures
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

    // 4. Detection: Low Precision Inferences (Elite Threshold)
    const lowPrecision = recentLogs.filter(l => l.agent === 'Discovery' && l.actionPayload?.precision < this.MIN_PRECISION_ALPHA);
    if (lowPrecision.length > 5) {
      alerts.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: 'Intelligence_Core',
        type: 'INFERENCE_DRIFT',
        severity: 'WARNING',
        metric: `Precision dropped below ${this.MIN_PRECISION_ALPHA * 100}%`
      });
    }

    // Status Derivation
    let status: 'NOMINAL' | 'ALERT' | 'CRITICAL' = 'NOMINAL';
    if (alerts.some(a => a.severity === 'CRITICAL')) status = 'CRITICAL';
    else if (alerts.length > 0) status = 'ALERT';

    return { status, alerts };
  }
}
