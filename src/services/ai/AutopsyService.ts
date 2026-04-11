import { 
  SovereignAutopsyReport, 
  AutomaticFix, 
  ProjectExecutiveSummary, 
  FixImpactReport, 
  ProblemCatalog 
} from "../../types";
import { safeAICall } from "./base";
import { 
  AUTOPSY_REPORT_SCHEMA, 
  PROJECT_EXECUTIVE_SUMMARY_SCHEMA, 
  PROBLEM_CATALOG_SCHEMA 
} from "./schemas";

/**
 * AutopsyService: Forensic Software Anatomy Engine v1.8.
 * Phase 1.8: Comprehensive Batching, Problem Cataloging, and Predictive Analytics.
 */
export class AutopsyService {
  private static readonly MODEL_PRO = 'gemini-3.1-pro-preview';

  private static async computeHash(str: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async performAutopsy(
    fileName: string, 
    filePath: string, 
    sourceCode: string
  ): Promise<SovereignAutopsyReport> {
    const startTime = performance.now();
    const hash = await this.computeHash(sourceCode);
    
    return safeAICall(async () => {
      const loc = sourceCode.split('\n').length;

      const response = await safeAICall<any>({
        model: this.MODEL_PRO,
        contents: `
          System: Chief Forensic Software Architect (FAANG).
          Mission: Dissect specimen "${fileName}" [Hash: ${hash}].
          
          INSTITUTIONAL OBJECTIVES:
          1. Calculate Metrics: Architectural, Code Quality, Performance, Security, Testability, Maintainability.
          2. Calculate AGCI (AI Generated Code Index).
          3. Generate 3 "Automatic Fixes" with UUIDs.
          4. Map findings to standardized ProblemPattern IDs (e.g., PATTERN_AI_REPETITION, PATTERN_SOLID_VIOLATION).
          5. Predict 30-day "Debt Decay" based on pattern density and complexity.
          
          SPECIMEN:
          ${sourceCode}
        `,
        config: {
          responseMimeType: "application/json",
          responseSchema: AUTOPSY_REPORT_SCHEMA
        }
      });

      const endTime = performance.now();
      const raw = response;
      
      return {
        id: crypto.randomUUID(),
        contentHash: hash,
        specimen: {
          name: fileName,
          filePath: filePath,
          linesOfCode: loc,
          aiGeneratedEstimate: raw.metrics?.aiGeneratedCodeIndex || 0,
          lastModified: new Date().toISOString()
        },
        ...raw,
        performance: {
          executionTime: Math.round(endTime - startTime),
          apiCallsCount: 1,
          tokenConsumption: sourceCode.length / 4
        }
      };
    });
  }

  /**
   * Surgical Validation Protocol: Applies a patch in isolation and measures delta.
   */
  static async validateRemediation(
    report: SovereignAutopsyReport,
    fix: AutomaticFix,
    originalCode: string
  ): Promise<FixImpactReport> {
    const patchedCode = originalCode.replace(fix.before, fix.after);
    const newReport = await this.performAutopsy(report.specimen.name, report.specimen.filePath, patchedCode);

    const m0 = report.metrics;
    const m1 = newReport.metrics;

    return {
      before: m0,
      after: m1,
      improvementPercentage: Math.round(m1.overallHealthIndex - m0.overallHealthIndex),
      performanceGain: report.performance.executionTime - newReport.performance.executionTime,
      readabilityGain: m1.codeQualityScore - m0.codeQualityScore,
      maintainabilityGain: m1.maintainabilityScore - m0.maintainabilityScore,
      isSuccessful: m1.overallHealthIndex > m0.overallHealthIndex && m1.securityScore >= m0.securityScore
    };
  }

  /**
   * Institutional Pattern Synthesis: Creates a catalog of recurring flaws across multiple files.
   */
  static async synthesizeProblemCatalog(reports: SovereignAutopsyReport[]): Promise<ProblemCatalog> {
    return safeAICall(async () => {
      const context = reports.map(r => ({
        file: r.specimen.name,
        findings: r.findings.map(f => ({ 
          category: f.category, 
          patternId: f.patternId,
          severity: f.severity 
        }))
      }));

      const response = await safeAICall<any>({
        model: this.MODEL_PRO,
        contents: `Aggregate findings into a standardized Problem Catalog. Frequency must reflect occurrence in these files: ${JSON.stringify(context)}. Calculate institutional health index.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: PROBLEM_CATALOG_SCHEMA
        }
      });

      return {
        ...response,
        lastUpdated: new Date().toISOString(),
        totalFilesAnalyzed: reports.length
      };
    });
  }

  /**
   * Aggregates multiple reports into a high-level strategic briefing.
   */
  static async synthesizeExecutiveSummary(reports: SovereignAutopsyReport[]): Promise<ProjectExecutiveSummary> {
    return safeAICall(async () => {
      const context = reports.map(r => ({
        file: r.specimen.name,
        health: r.metrics.overallHealthIndex,
        debt: r.technicalDebt.debtHours,
        agci: r.metrics.aiGeneratedCodeIndex,
        readiness: r.metrics.architecturalScore // Proxy for readiness
      }));

      const response = await safeAICall<any>({
        model: this.MODEL_PRO,
        contents: `Analyze these code audit reports and synthesize an executive summary. Calculate FAANG readiness index based on architecture, quality, and security: ${JSON.stringify(context)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: PROJECT_EXECUTIVE_SUMMARY_SCHEMA
        }
      });

      return response;
    });
  }
}