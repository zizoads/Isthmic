import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";
import { StrategicObjective, CausalRejectionModel } from "../../types";
import { OrchestrationService } from "./OrchestrationService";

const SOVEREIGN_PLATFORMS = {
  tier1_early: ['HackerNews', 'ArXiv', 'GitHub Trending', 'ProductHunt'],
  tier2_money: ['Crunchbase', 'AngelList', 'YCombinator', 'SEC EDGAR'],
  tier3_jobs: ['LinkedIn', 'Wellfound', 'Indeed'],
  tier4_patents: ['USPTO', 'Google Patents', 'WIPO'],
  tier5_media: ['TechCrunch', 'TheVerge', 'Wired', 'MIT Tech Review', 'VentureBeat', 'TechRadar', 'Betalist']
};

const TEMPORAL_CUTOFF = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const rigorousDiscoveryAI = (
  prompt: string,
  lang: 'en' = 'en',
  signal?: AbortSignal,
  objectives: StrategicObjective[] = [],
  causalModels: CausalRejectionModel[] = []
) => {
  const strategicContext = OrchestrationService.injectStrategicContext(objectives);
  const causalContext = causalModels.length > 0
    ? `\nCAUSAL INTELLIGENCE (LEARNED FROM PREVIOUS REJECTIONS):\n${causalModels.map(m => `- Logic: ${m.causalLogicChain} (Impact: ${m.severityIndex})`).join('\n')}`
    : "";

  return generateStructuredAI<any[]>(
    'gemini-2.5-pro-preview-03-25',
    `Strategic Market Miner (Sovereign Core).
     Your task: Find high-potential domains based on market gaps.
     MANDATORY COMPLIANCE:
     ${strategicContext}
     ${causalContext}

     TEMPORAL INTELLIGENCE PROTOCOL — CRITICAL:
     You MUST use Google Search grounding to find signals from the LAST 90 DAYS ONLY (after ${TEMPORAL_CUTOFF}).
     REJECT any trend that cannot be verified with a source dated within this window.
     Mark each result with firstSignalDate and recencyScore (0-100).
     Apply a -50 point penalty for any result older than 90 days.
     Apply a +30 point bonus for results confirmed across 3+ platform tiers simultaneously.

     PLATFORM INTELLIGENCE TIERS (search ALL tiers, weight by tier):
     TIER 1 — Early Signals (weight x4): ${SOVEREIGN_PLATFORMS.tier1_early.join(', ')}
     TIER 2 — Money Signals (weight x3): ${SOVEREIGN_PLATFORMS.tier2_money.join(', ')}
     TIER 3 — Job Market Signals (weight x3): ${SOVEREIGN_PLATFORMS.tier3_jobs.join(', ')}
     TIER 4 — Patent Signals (weight x2): ${SOVEREIGN_PLATFORMS.tier4_patents.join(', ')}
     TIER 5 — Media Confirmation (weight x1): ${SOVEREIGN_PLATFORMS.tier5_media.join(', ')}

     CROSS-SIGNAL VALIDATION RULE:
     A trend is CONFIRMED only if it appears in at least 3 different tiers.
     A trend appearing in only 1 tier = flag as SPECULATIVE.

     CRITICAL PRIORITY & ARCHITECTURAL NUCLEUS (SEMANTIC HAND-REG STRATEGY):
     1. STRICT TLD ENFORCEMENT: Only target ".com" extensions.
     2. COMPOSITION PHILOSOPHY: Focus on "Unconventional Semantic Pairings".
     3. LENGTH CONSTRAINT: Names MUST be <= 10 characters (excluding .com).
     4. AVAILABILITY TARGET: Hand-registration price range $10-$13 only.
     5. VALUE PROPOSITION: Identify high-liquidity assets missed by registry bots.
     6. TRAFFIC BONUS: Prioritize domains with existing traffic signals.

     Scoring: Assign strategicAlignmentScore (0-100).
     +25 bonus: Unconventional Semantic .com <= 10 chars available for hand-reg.
     +20 bonus: Confirmed by TIER 1 or TIER 2 signal.
     +15 bonus: Job market validation shows 500+ postings.
     -50 penalty: Signal older than 90 days.
     Language: ${lang}`,
    `Execute deep acquisition sweep for: ${prompt}.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          estimatedPrice: { type: Type.NUMBER },
          sector: { type: Type.STRING },
          justification: { type: Type.STRING },
          probability: { type: Type.NUMBER },
          strategicAlignmentScore: { type: Type.NUMBER },
          firstSignalDate: { type: Type.STRING, description: "Date when this trend first appeared — must be within last 90 days" },
          recencyScore: { type: Type.NUMBER, description: "0-100 score based on how recent the signal is" },
          trafficSignal: { type: Type.STRING, enum: ['none', 'low', 'medium', 'high'] },
          trafficSource: { type: Type.STRING },
          validationMatrix: {
            type: Type.OBJECT,
            properties: {
              mediaSignal: { type: Type.BOOLEAN },
              patentSignal: { type: Type.BOOLEAN },
              jobSignal: { type: Type.BOOLEAN },
              fundingSignal: { type: Type.BOOLEAN },
              earlySignal: { type: Type.BOOLEAN },
              confirmedValid: { type: Type.BOOLEAN, description: "true only if 3+ signals are true" }
            }
          },
          velocityScore: {
            type: Type.OBJECT,
            properties: {
              weeklyGrowthRate: { type: Type.NUMBER },
              searchVolumeTrajectory: { type: Type.STRING, enum: ['exploding', 'rising', 'stable', 'declining'] },
              peakPrediction: { type: Type.STRING },
              competitorDomainRegistrations: { type: Type.NUMBER }
            }
          },
          platformSources: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of specific platforms where this signal was found"
          }
        }
      }
    },
    [{ googleSearch: {} }],
    undefined,
    signal
  );
};

export const getDropSniperListAI = async (
  sector: string,
  objectives: StrategicObjective[] = []
) => {
  const strategicContext = OrchestrationService.injectStrategicContext(objectives);
  const res = await generateStructuredAI<any[]>(
    'gemini-2.5-pro-preview-03-25',
    `Domain drop scouting agent. Neural Link Active: ${strategicContext}
     TEMPORAL RULE: Only domains dropping within the next 30 days.
     PLATFORM SCAN: Check GoDaddy Auctions, NameJet, Snapnames, DropCatch, Dynadot.`,
    `Find domains about to drop in ${sector}. Rank by Strategic Alignment.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          estimatedValue: { type: Type.NUMBER },
          dropDate: { type: Type.STRING },
          backorderPlatform: { type: Type.STRING },
          reasonToSnipe: { type: Type.STRING },
          strategicAlignmentScore: { type: Type.NUMBER },
          jobMarketValidation: { type: Type.NUMBER, description: "Number of job postings found for this keyword" },
          fundingValidation: { type: Type.BOOLEAN, description: "Is there recent funding in this sector?" }
        }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};

export const analyzeSnipeOpportunityAI = async (domainName: string) => {
  const res = await generateStructuredAI<Record<string, unknown>>(
    'gemini-2.5-pro-preview-03-25',
    'Expert drop analyzer. Cross-validate against patent filings, job market, and funding data.',
    `Analyze value for ${domainName}. Check USPTO for related patents. Check LinkedIn for job demand. Check Crunchbase for sector funding.`,
    {
      type: Type.OBJECT,
      properties: {
        verdict: { type: Type.STRING, enum: ['Golden', 'Silver', 'Bronze', 'Trash'] },
        flipProbability: { type: Type.NUMBER },
        maxBackorderBid: { type: Type.NUMBER },
        tacticalIntelligence: { type: Type.STRING },
        patentActivity: { type: Type.STRING, description: "Recent USPTO/WIPO activity related to this domain" },
        jobDemand: { type: Type.NUMBER, description: "Estimated job postings count for this keyword" },
        sectorFunding: { type: Type.STRING, description: "Recent funding rounds in this sector from Crunchbase" }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};

export const registrarInquiryAI = async (domainName: string) => {
  const res = await generateStructuredAI<Record<string, unknown>>(
    'gemini-2.5-pro-preview-03-25',
    "Real-time registrar status scout.",
    `Check availability and price for ${domainName}.`,
    {
      type: Type.OBJECT,
      properties: {
        available: { type: Type.BOOLEAN },
        price: { type: Type.NUMBER }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};

export const findLocalBuyersAI = async (domainName: string, sector: string) => {
  const res = await generateStructuredAI<any[]>(
    'gemini-2.5-pro-preview-03-25',
    "Expert lead generation agent. Identify potential buyers for a domain based on local market data, LinkedIn job postings, and Crunchbase funding.",
    `Find 5 potential buyers for ${domainName} in the ${sector} sector. Focus on companies with recent funding or high job demand.`,
    {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          reason: { type: Type.STRING },
          contactRole: { type: Type.STRING },
          estimatedBudget: { type: Type.STRING },
          linkedinSignal: { type: Type.STRING },
          fundingSignal: { type: Type.STRING }
        }
      }
    },
    [{ googleSearch: {} }]
  );
  return res.data;
};
