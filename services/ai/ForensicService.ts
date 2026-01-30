
import { Type } from "@google/genai";
import { generateStructuredAI } from "./base";

/**
 * Deep Forensic OSINT Agent.
 * عند ربط مفاتيح خارجية، يمكن لهذا الوكيل سحب لقطات من Wayback Machine
 * وبيانات السمعة من VirusTotal لرفع دقة التقييم.
 */
export const performOsintInvestigationAI = async (query: string, lang: 'ar' | 'en' = 'ar') => {
  return generateStructuredAI<any>(
    'gemini-3-pro-preview',
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
};

export const checkTrademarkRiskAI = async (domainName: string) => {
  return generateStructuredAI<string>(
    'gemini-3-flash-preview',
    "Intellectual Property Auditor.",
    `Assess trademark risk for "${domainName}" across global classes. Return one word: Safe, Low, Medium, or High.`,
    { type: Type.STRING },
    [{ googleSearch: {} }]
  );
};
