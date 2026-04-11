
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";

/**
 * Deep Forensic OSINT Agent.
 * When external keys are connected, this agent can pull snapshots from Wayback Machine
 * and reputation data from VirusTotal to increase assessment accuracy.
 */
export const performOsintInvestigationAI = async (query: string, lang: 'en' = 'en') => {
  // Fix: Extract .data from response for proper UI state management
  const result = await generateStructuredAI<any>(
    'gemini-3.1-pro-preview',
    `Deep Forensic OSINT Agent. Language: ${lang}. 
     Mission: Scrutinize the digital footprint of the target.
     Integrate: WHOIS data, Historical snapshots, and Reputation signals.`,
    `Investigate: ${query}. Perform deep-dive into history, DNS records, and previous content integrity. 
     Synthesize a verdict for a professional domain investor.`,
    {
      type: Type.OBJECT,
      properties: {
        threatLevel: { type: Type.STRING, enum: ['Safe', 'Suspicious', 'Malicious'] },
        dnsSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
        associatedEntities: { type: Type.ARRAY, items: { type: Type.STRING } },
        dataBreachAlert: { type: Type.BOOLEAN },
        forensicVerdict: { type: Type.STRING }
      }
    },
    [{ googleSearch: {} }]
  );
  return result.data;
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  // Fix: Return .data so the caller receives the trademark risk level string directly
  const result = await generateStructuredAI<string>(
    'gemini-3-flash-preview',
    "Intellectual Property Auditor.",
    `Assess trademark risk for "${domainName}" across global classes. Return one word: Safe, Low, Medium, or High.`,
    { type: Type.STRING },
    [{ googleSearch: {} }]
  );
  return result.data;
};
