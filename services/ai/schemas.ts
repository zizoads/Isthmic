import { Type } from "@google/genai";

/**
 * Isthmic Pro - Sovereign Schema Registry v17.0
 */

export const LAUNCH_READINESS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallReadiness: { type: Type.NUMBER },
    authorizedForLaunch: { type: Type.BOOLEAN },
    blockers: { type: Type.NUMBER },
    ewsStatus: { type: Type.STRING, enum: ['NOMINAL', 'ALERT', 'CRITICAL'] },
    components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['CORE', 'AI_SERVICE', 'UI_HUB', 'INFRASTRUCTURE'] },
          status: { type: Type.STRING, enum: ['STABLE', 'REFINE', 'CRITICAL', 'LOCKED'] },
          phi: { type: Type.NUMBER },
          lastAudit: { type: Type.STRING },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  },
  required: ['overallReadiness', 'authorizedForLaunch', 'blockers', 'ewsStatus', 'components']
};

export const AUTOPSY_REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    metrics: {
      type: Type.OBJECT,
      properties: {
        architecturalScore: { type: Type.NUMBER },
        codeQualityScore: { type: Type.NUMBER },
        performanceScore: { type: Type.NUMBER },
        securityScore: { type: Type.NUMBER },
        testabilityScore: { type: Type.NUMBER },
        maintainabilityScore: { type: Type.NUMBER },
        overallHealthIndex: { type: Type.NUMBER },
        aiGeneratedCodeIndex: { type: Type.NUMBER }
      }
    },
    performance: {
      type: Type.OBJECT,
      properties: {
        executionTime: { type: Type.NUMBER },
        apiCallsCount: { type: Type.NUMBER },
        tokenConsumption: { type: Type.NUMBER }
      }
    },
    predictiveDebt: {
      type: Type.OBJECT,
      properties: {
        forecastedDebt30d: { type: Type.NUMBER },
        decayProbability: { type: Type.NUMBER },
        nextCriticalFailurePoint: { type: Type.STRING }
      }
    },
    automaticFixes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          description: { type: Type.STRING },
          patch: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          before: { type: Type.STRING },
          after: { type: Type.STRING }
        }
      }
    },
    technicalDebt: {
      type: Type.OBJECT,
      properties: {
        debtHours: { type: Type.NUMBER },
        debtCost: { type: Type.NUMBER },
        criticality: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }
      }
    },
    findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['MINOR', 'MAJOR', 'CRITICAL'] },
          description: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          fixExample: { type: Type.STRING },
          origin: { type: Type.STRING, enum: ['AI_PATTERNS', 'HUMAN_ERROR', 'ARCHITECTURAL_FLAW'] },
          patternId: { type: Type.STRING }
        }
      }
    },
    improvementRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.NUMBER },
          priority: { type: Type.STRING },
          action: { type: Type.STRING },
          expectedImpact: { type: Type.NUMBER },
          estimatedEffort: { type: Type.NUMBER }
        }
      }
    }
  },
  required: ['metrics', 'performance', 'automaticFixes', 'technicalDebt', 'findings', 'improvementRoadmap']
};

export const PROJECT_EXECUTIVE_SUMMARY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectHealthScore: { type: Type.NUMBER },
    totalDebtHours: { type: Type.NUMBER },
    debtTrend: { type: Type.STRING, enum: ['UP', 'DOWN', 'STABLE'] },
    improvedFiles: { type: Type.ARRAY, items: { type: Type.STRING } },
    degradedFiles: { type: Type.ARRAY, items: { type: Type.STRING } },
    strategicRisk: { type: Type.STRING },
    faangReadinessIndex: { type: Type.NUMBER }
  },
  required: ['projectHealthScore', 'totalDebtHours', 'debtTrend', 'improvedFiles', 'degradedFiles', 'strategicRisk', 'faangReadinessIndex']
};

export const PROBLEM_CATALOG_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    institutionalHealthIndex: { type: Type.NUMBER },
    patterns: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          severity: { type: Type.STRING },
          frequency: { type: Type.NUMBER },
          globalRecommendation: { type: Type.STRING }
        }
      }
    }
  }
};

export const NEGOTIATION_AUDIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    insight: {
      type: Type.OBJECT,
      properties: {
        sentimentScore: { type: Type.NUMBER },
        intent: { type: Type.STRING, enum: ['lowball', 'discovery', 'serious_offer', 'bluff', 'urgency'] },
        psychologicalMarkers: { type: Type.ARRAY, items: { type: Type.STRING } },
        redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestedAction: { type: Type.STRING }
      },
      required: ['sentimentScore', 'intent', 'psychologicalMarkers', 'redFlags', 'suggestedAction']
    },
    report: {
      type: Type.OBJECT,
      properties: {
        executiveSummary: { type: Type.STRING },
        quantitativeMetrics: {
          type: Type.OBJECT,
          properties: {
            buyerWeaknessIndex: { type: Type.NUMBER },
            suggestedDiscountRange: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            timePressureFactor: { type: Type.NUMBER },
            psychographicScore: { type: Type.NUMBER },
            tacticalWeaknessScore: { type: Type.NUMBER },
            financialUrgencyScore: { type: Type.NUMBER }
          }
        },
        leverageScore: { type: Type.NUMBER },
        riskFlags: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ['FINANCIAL', 'PSYCHOLOGICAL', 'TIMING'] },
              severity: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] },
              evidence: { type: Type.STRING }
            }
          }
        },
        recommendedActions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              expectedOutcome: { type: Type.STRING }
            }
          }
        }
      },
      required: ['executiveSummary', 'quantitativeMetrics', 'leverageScore', 'riskFlags', 'recommendedActions']
    }
  }
};