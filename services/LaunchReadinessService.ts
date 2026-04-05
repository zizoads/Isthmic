
import { GoogleGenAI } from "@google/genai";
import { LaunchReadinessReport, SovereignAutopsyReport, EWSAlert } from "../types";
import { safeAICall } from "./ai/base";
import { LAUNCH_READINESS_SCHEMA } from "./ai/schemas";
import { HighSpeedDatabaseEngine } from "./HighSpeedDatabaseEngine";
import { MilitaryVaultInstance } from "../security/MilitaryVault";

/**
 * LaunchReadinessService: Strategic Production Controller.
 * v14.0: Deterministic Cohesion Logic.
 * تم إلغاء العشوائية؛ التقرير الآن يعكس الحالة الحقيقية للبنية التحتية.
 */
export class LaunchReadinessService {
  private static readonly MODEL_PRO = 'gemini-3-pro-preview';

  /**
   * حساب "معامل التماسك السيادي" (Sovereign Cohesion Index - PHI)
   */
  static async calculateSystemPhi(): Promise<number> {
    const checks = {
      api: !!process.env.GEMINI_API_KEY,
      db: (await HighSpeedDatabaseEngine.verifyStructuralStability()) === 'OPTIMAL',
      vault: MilitaryVaultInstance.getVaultReport().threatStatus === 'STABLE',
      latency: HighSpeedDatabaseEngine.getAverageLatency() < 500
    };

    let score = 0;
    if (checks.api) score += 30;
    if (checks.db) score += 30;
    if (checks.vault) score += 30;
    if (checks.latency) score += 10;

    return score;
  }

  static async evaluateLaunchPosture(autopsies: SovereignAutopsyReport[]): Promise<LaunchReadinessReport> {
    const phi = await this.calculateSystemPhi();
    const dbLatency = HighSpeedDatabaseEngine.getAverageLatency();
    const vaultReport = MilitaryVaultInstance.getVaultReport();

    return safeAICall(async () => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY_MISSING");
      const ai = new GoogleGenAI({ apiKey });
      
      const context = {
        phi,
        dbLatency,
        vaultItems: vaultReport.totalItems,
        vulnerabilities: autopsies.reduce((acc, a) => acc + a.findings.length, 0),
        avgSecurityScore: autopsies.reduce((acc, a) => acc + a.metrics.securityScore, 0) / (autopsies.length || 1)
      };

      const response = await ai.models.generateContent({
        model: this.MODEL_PRO,
        contents: `
          Role: Production Director. 
          Mission: Synthesize Launch Readiness Report based on Real Telemetry.
          
          TELEMETRY:
          - Cohesion Index (PHI): ${context.phi}%
          - DB Latency: ${context.dbLatency}ms
          - Forensic Findings: ${context.vulnerabilities}
          - Security Health: ${context.avgSecurityScore}%
          
          Logic: If PHI < 85 or Security < 90, set authorizedForLaunch to false.
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: LAUNCH_READINESS_SCHEMA
        }
      });

      return JSON.parse(response.text || '{}');
    });
  }

  static monitorTelemetry(logs: any[]): { status: 'NOMINAL' | 'ALERT' | 'CRITICAL'; alerts: EWSAlert[] } {
    const alerts: EWSAlert[] = [];
    const recentLogs = logs.slice(0, 50);

    // 1. Latency Detection
    const spikes = recentLogs.filter(l => l.actionPayload?.latency > 2000);
    if (spikes.length > 0) {
      alerts.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: 'GATEWAY',
        type: 'LATENCY_SPIKE',
        severity: 'WARNING',
        metric: `${spikes[0].actionPayload.latency}ms`
      });
    }

    // 2. Security Anomalies
    const vault = MilitaryVaultInstance.getVaultReport();
    if (vault.threatStatus !== 'STABLE') {
      alerts.push({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        source: 'VAULT',
        type: 'INTEGRITY_COMPROMISE',
        severity: 'CRITICAL',
        metric: 'UNAUTHORIZED_ACCESS_PATTERN'
      });
    }

    let status: 'NOMINAL' | 'ALERT' | 'CRITICAL' = 'NOMINAL';
    if (alerts.some(a => a.severity === 'CRITICAL')) status = 'CRITICAL';
    else if (alerts.length > 0) status = 'ALERT';

    return { status, alerts };
  }
}
