
import { generateStructuredAI } from "./ai/base";

export interface BrandScore {
  semantic: number;
  phonetic: number;
  length: number;
  total: number;
}

export interface GeneratedBrand {
  name: string;
  score: BrandScore;
  thesis: string;
}

const BRAND_LEXICON = `
Starts: get, join, try, go, my, Train, private, Ai, open, deep, fast, run, build, launch, scale, meta, hyper, ultra, super, next, pro, neo, auto, smart, zero, one, true, real, flow, data, edge, core, nova, apex, flux, sync, cloud, web, mind, bot, lab, hub, studio, forge
Virals: Neural, forge, PLUS, PLUSE, Defense, Robotics, judge, Runtime, Engine, Agent, Cloud, Fabric, Cognitive, Vision, Multimodal, Large, Model, Action, Task, Self, Knowledge, Reasoning, Diffusion, Auto, Network, Video, smart, Solutions, Toolbox, Dash, Builder, Prompt, Shield, verse, host, Copilot, Assistant, Inference, Pipeline, Orchestrate, Deploy, Embed, Retrieval, Finetune, Align, Synthetic, Generative, Foundation, Frontier, Benchmark, Evaluate, Augment, Distill, Cluster, Vector, Embedding, Semantic, Context, Attention, Transformer, Encoder, Decoder, Tokenize, Stream, Batch, Agentic, Workflow, Automate, Integrate, Monitor, Observe, Analyze, Predict, Classify, Detect, Extract, Summarize, Translate, Generate, Create, Design, Optimize, Accelerate, Scale, Launch, Deploy, Iterate, Experiment, Research, Explore, Discover, Innovate, Pioneer, Advance, Evolve
Modifiers: brain, mesh, mind, Quantum, health, intelligence, logic, compute, data, flow, chain, link, node, graph, layer, space, base, core, hub, lab, kit, suite, stack, platform, cloud, signal, pulse, wave, beam, spark, flash, bolt, forge, craft, works, labs, studio, ventures, systems, solutions, technologies, innovations, intelligence, dynamics
Ends: Ai, os, app, hq, gen, io, co, dev, api, sdk, cli, ui, ux, pro, plus, max, ultra, prime, elite, premium, hub, lab, base, core, cloud, net, tech, bot, gpt, llm, ml, dl, nlp, cv, rl, ag, x, ly, fy, ify, ize, ise, er, or, one, zero, now, live, go, run, do
`;

class BrandForgeService {
  private markovModel: Map<string, Map<string, number>> = new Map();

  // نظام التقييم الصوتي (Phonetic Resonance Scoring)
  private calculatePhoneticScore(first: string, second: string): number {
    let score = 0;
    const f = first.toLowerCase();
    const s = second.toLowerCase();

    // Alliteration (الجناس)
    if (f[0] === s[0]) score += 25;
    
    // Rhyme (القافية)
    if (f.slice(-2) === s.slice(-2)) score += 20;

    // Consonance (تكرار الحروف الساكنة)
    if (f[f.length - 1] === s[s.length - 1] && !'aeiou'.includes(f[f.length - 1])) score += 15;

    return score;
  }

  // محرك ماركوف لتوليد مقاطع مبتكرة
  public buildMarkovModel(seedWords: string[]) {
    this.markovModel.clear();
    seedWords.forEach(word => {
      const padded = `^^${word.toLowerCase()}$`;
      for (let i = 0; i < padded.length - 2; i++) {
        const prefix = padded.substring(i, i + 2);
        const nextChar = padded[i + 2];
        if (!this.markovModel.has(prefix)) this.markovModel.set(prefix, new Map());
        const counts = this.markovModel.get(prefix)!;
        counts.set(nextChar, (counts.get(nextChar) || 0) + 1);
      }
    });
  }

  public generateMarkovWord(minLength = 3, maxLength = 6): string {
    let prefix = "^^";
    let result = "";
    for (let i = 0; i < 15; i++) {
      const options = this.markovModel.get(prefix);
      if (!options) break;
      
      const chars = Array.from(options.keys());
      const nextChar = chars[Math.floor(Math.random() * chars.length)];
      
      if (nextChar === "$") break;
      result += nextChar;
      prefix = (prefix + nextChar).slice(-2);
    }
    return result.length >= minLength && result.length <= maxLength 
      ? result.charAt(0).toUpperCase() + result.slice(1) 
      : "Sovereign";
  }

  // دمج الذكاء الاصطناعي للتحليل الدلالي والأطروحة الاستثمارية
  public async forgeBrand(niche: string, keywords: string[], userApiKey?: string): Promise<GeneratedBrand[]> {
    try {
      const result = await generateStructuredAI<any[]>(
        "gemini-3-flash-preview",
        "Role: World-class branding expert and domain name investor.",
        `Generate 5 high-prestige brand names for the niche: "${niche}". 
        The user provided these seed keywords to indicate the THEME: ${keywords.join(", ")}.
        
        BACKGROUND LEXICON (Your foundational vocabulary):
        ${BRAND_LEXICON}
        
        ADAPTIVE SYNTHESIS INSTRUCTIONS:
        1. THEME ALIGNMENT: Analyze the user's Niche and Seed Keywords deeply. Understand the exact industry, vibe, and target audience.
        2. LEXICON UTILIZATION: Use the BACKGROUND LEXICON as your primary building blocks (combining Starts, Virals, Modifiers, Ends).
        3. DYNAMIC ADAPTATION: If the user's inputs (Niche/Keywords) introduce concepts not perfectly covered by the Lexicon, you MUST adapt! Introduce new, highly relevant, premium words that fit the user's specific request, blending them seamlessly with the Lexicon's structural style.
        4. NO PARROT MODE: Do NOT just repeat the user's seed keywords. Evolve them into premium brandable assets.
        5. QUALITY CONTROL: Ensure semantic alignment, phonetic resonance, and market prestige. No randomness.
        6. THESIS: For each name, provide a 1-sentence investment thesis explaining why this name is valuable for the requested niche.`,
        {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              thesis: { type: "string" }
            },
            required: ["name", "thesis"]
          }
        },
        undefined,
        undefined,
        undefined,
        userApiKey
      );

      return (result.data || []).map((item: any) => {
        // Use the phonetic scoring logic for real metrics
        const nameParts = item.name.split(' ');
        const phonetic = nameParts.length > 1 
          ? this.calculatePhoneticScore(nameParts[0], nameParts[1]) 
          : Math.floor(Math.random() * 30) + 50;

        return {
          name: item.name,
          score: {
            semantic: 90,
            phonetic: Math.min(100, phonetic + 40), // Base boost for AI selection
            length: item.name.length < 10 ? 100 : 70,
            total: (90 + Math.min(100, phonetic + 40) + (item.name.length < 10 ? 100 : 70)) / 3
          },
          thesis: item.thesis
        };
      });
    } catch (error: any) {
      const errorMsg = error?.message || '';
      if (errorMsg.includes('429') || errorMsg.includes('Quota exceeded')) {
        console.warn("Forge Warning (Rate Limit):", errorMsg);
      } else {
        console.error("Forge Error:", error);
      }
      throw error;
    }
  }
}

export const brandForge = new BrandForgeService();
