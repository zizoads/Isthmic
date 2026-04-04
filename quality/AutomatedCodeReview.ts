
import { AutopsyService } from "../services/ai/AutopsyService";
import { SovereignAutopsyReport } from "../types";

export class AutomatedCodeReview {
  private static readonly RISK_THRESHOLD = 70;

  static async reviewCodeChange(fileName: string, code: string): Promise<{
    decision: 'APPROVE' | 'REJECT' | 'NEEDS_HUMAN';
    riskScore: number;
    findings: string[];
  }> {
    const autopsy = await AutopsyService.performAutopsy(fileName, "internal", code);
    
    const riskScore = this.calculateRiskScore(autopsy);
    const decision = this.makeDecision(autopsy, riskScore);

    return {
      decision,
      riskScore,
      findings: autopsy.findings.map(f => f.description)
    };
  }

  private static calculateRiskScore(report: SovereignAutopsyReport): number {
    let score = 0;
    // انتهاك الأمان يرفع المخاطر فوراً
    if (report.metrics.securityScore < 90) score += 50;
    // ضعف المعمارية
    if (report.metrics.architecturalScore < 80) score += 30;
    // الدين التقني المرتفع
    if (report.technicalDebt.debtHours > 10) score += 20;

    return Math.min(100, score);
  }

  private static makeDecision(report: SovereignAutopsyReport, riskScore: number): 'APPROVE' | 'REJECT' | 'NEEDS_HUMAN' {
    if (report.findings.some(f => f.severity === 'CRITICAL')) return 'REJECT';
    if (riskScore > this.RISK_THRESHOLD) return 'REJECT';
    if (riskScore > 40) return 'NEEDS_HUMAN';
    return 'APPROVE';
  }
}
