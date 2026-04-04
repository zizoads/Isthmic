
// @ts-ignore
import wordnet from 'wordnet';
import wordList from 'word-list';
import pkg from 'lodash';
const { shuffle } = pkg;
import { readFile } from 'fs/promises';

let commonWordsSet: Set<string> | null = null;

async function getCommonWords(): Promise<Set<string>> {
  if (!commonWordsSet) {
    console.log("[BRAND_GEN] Loading word list...");
    const data = await readFile(wordList, 'utf8');
    const array = data.split('\n');
    commonWordsSet = new Set(array.map(w => w.toLowerCase()));
    console.log("[BRAND_GEN] Word list loaded.");
  }
  return commonWordsSet;
}

const micro_niches: Record<string, Record<string, string[]>> = {
  ai: {
    general_ai: ['neural', 'deep', 'smart', 'cogno', 'mind', 'logic', 'brain', 'cortex', 'think', 'intel'],
    image_gen: ['vision', 'pixel', 'draw', 'paint', 'view', 'sight', 'lens', 'frame', 'canvas', 'art'],
    video_gen: ['motion', 'move', 'film', 'clip', 'flow', 'stream', 'live', 'scene', 'play', 'act'],
    code_gen: ['script', 'code', 'dev', 'build', 'stack', 'base', 'core', 'logic', 'node', 'flow'],
    nlp: ['vocal', 'talk', 'chat', 'word', 'text', 'speak', 'voice', 'lang', 'term', 'read'],
    ai_automation: ['bot', 'auto', 'flow', 'task', 'work', 'process', 'run', 'drive', 'shift', 'gear']
  },
  cybersecurity: {
    network_sec: ['firewall', 'gate', 'wall', 'shield', 'secure', 'defend', 'protect', 'guard', 'lock', 'key'],
    threat_intel: ['watch', 'scan', 'track', 'hunt', 'trace', 'spy', 'eye', 'alert', 'warn', 'check'],
    cloud_sec: ['cloud', 'sky', 'vault', 'base', 'safe', 'firm', 'hard', 'grid', 'net', 'zone']
  },
  fintech: {
    payments: ['pay', 'cash', 'coin', 'mint', 'gold', 'bolt', 'fast', 'swift', 'send', 'flow'],
    banking: ['bank', 'vault', 'safe', 'trust', 'bond', 'fund', 'base', 'core', 'save', 'hold'],
    crypto: ['block', 'chain', 'hash', 'node', 'crypt', 'bit', 'token', 'ledger', 'peer', 'link']
  },
  healthtech: {
    telemedicine: ['care', 'doc', 'link', 'visit', 'heal', 'well', 'pulse', 'vital', 'live', 'stay'],
    diagnostics: ['scan', 'test', 'check', 'view', 'spot', 'find', 'probe', 'lens', 'eye', 'sense']
  },
  greentech: {
    solar: ['sun', 'ray', 'beam', 'light', 'glow', 'warm', 'pure', 'clean', 'bright', 'star'],
    wind: ['air', 'flow', 'breeze', 'gust', 'wing', 'spin', 'turn', 'drift', 'wave', 'sky']
  },
  cloud: {
    infrastructure: ['base', 'core', 'grid', 'node', 'stack', 'firm', 'hard', 'rock', 'root', 'link'],
    storage: ['vault', 'keep', 'hold', 'safe', 'box', 'nest', 'hub', 'base', 'store', 'save']
  },
  iot: {
    smart_home: ['home', 'nest', 'hub', 'link', 'sync', 'stay', 'live', 'ease', 'flow', 'pure'],
    industrial_iot: ['gear', 'work', 'tool', 'mill', 'iron', 'steel', 'hard', 'firm', 'base', 'core']
  },
  edtech: {
    learning_platforms: ['learn', 'wise', 'know', 'mind', 'brain', 'book', 'read', 'grow', 'seed', 'path'],
    skills_training: ['skill', 'craft', 'build', 'forge', 'work', 'task', 'master', 'pro', 'expert', 'top']
  },
  future: {
    robotics: ['bot', 'mech', 'gear', 'arm', 'hand', 'move', 'act', 'run', 'drive', 'shift'],
    quantum: ['bit', 'wave', 'leap', 'jump', 'fast', 'deep', 'core', 'base', 'node', 'link']
  },
  nanotech: {
    materials: ['atom', 'tiny', 'small', 'micro', 'fine', 'pure', 'hard', 'firm', 'base', 'core'],
    medical_nano: ['heal', 'cure', 'fix', 'mend', 'care', 'aid', 'help', 'save', 'pure', 'vital']
  },
  biotech: {
    genetics: ['gene', 'code', 'base', 'root', 'seed', 'life', 'pure', 'core', 'link', 'sync'],
    pharma: ['cure', 'heal', 'drug', 'pill', 'care', 'aid', 'well', 'stay', 'live', 'pure']
  },
  medtech: {
    devices: ['tool', 'gear', 'aid', 'help', 'fix', 'mend', 'care', 'well', 'stay', 'live'],
    surgical: ['cut', 'fix', 'mend', 'pro', 'expert', 'top', 'pure', 'fine', 'hard', 'firm']
  },
  agritech: {
    farming: ['farm', 'grow', 'seed', 'soil', 'root', 'crop', 'leaf', 'green', 'pure', 'land'],
    irrigation: ['flow', 'pure', 'well', 'drop', 'rain', 'sky', 'blue', 'life', 'stay', 'live']
  },
  foodtech: {
    delivery: ['fast', 'swift', 'bolt', 'dash', 'run', 'move', 'way', 'path', 'link', 'sync'],
    nutrition: ['pure', 'well', 'good', 'best', 'top', 'pro', 'life', 'stay', 'live', 'grow']
  },
  cleantech: {
    recycling: ['loop', 'cycle', 'turn', 'spin', 'pure', 'clean', 'green', 'new', 'fresh', 'stay'],
    water: ['pure', 'well', 'flow', 'drop', 'blue', 'sky', 'life', 'stay', 'live', 'clean']
  },
  martech: {
    analytics: ['view', 'sight', 'lens', 'eye', 'spot', 'find', 'check', 'scan', 'track', 'path'],
    automation: ['auto', 'flow', 'sync', 'link', 'task', 'work', 'run', 'drive', 'shift', 'gear']
  },
  insurtech: {
    claims: ['aid', 'help', 'care', 'save', 'fix', 'mend', 'fast', 'swift', 'bolt', 'dash'],
    risk_assessment: ['wise', 'know', 'check', 'scan', 'view', 'sight', 'lens', 'eye', 'spot', 'find']
  },
  realestate: {
    proptech: ['home', 'stay', 'live', 'base', 'core', 'firm', 'hard', 'rock', 'root', 'land'],
    management: ['care', 'keep', 'hold', 'safe', 'vault', 'hub', 'nest', 'box', 'link', 'sync']
  },
  legaltech: {
    contracts: ['link', 'sync', 'bond', 'firm', 'hard', 'rock', 'root', 'base', 'core', 'stay'],
    research: ['wise', 'know', 'find', 'spot', 'view', 'sight', 'lens', 'eye', 'check', 'scan']
  },
  hrtech: {
    recruitment: ['find', 'spot', 'pick', 'top', 'pro', 'expert', 'best', 'good', 'well', 'stay'],
    payroll: ['pay', 'cash', 'coin', 'mint', 'gold', 'bolt', 'fast', 'swift', 'send', 'flow']
  },
  supplychain: {
    logistics: ['move', 'flow', 'way', 'path', 'link', 'sync', 'fast', 'swift', 'bolt', 'dash'],
    inventory: ['keep', 'hold', 'safe', 'vault', 'box', 'nest', 'hub', 'base', 'core', 'firm']
  },
  space: {
    satellites: ['sky', 'star', 'beam', 'ray', 'glow', 'light', 'view', 'sight', 'lens', 'eye'],
    exploration: ['leap', 'jump', 'way', 'path', 'far', 'deep', 'core', 'base', 'root', 'star']
  },
  gaming: {
    esports: ['play', 'win', 'top', 'pro', 'expert', 'best', 'good', 'fast', 'swift', 'bolt'],
    development: ['build', 'forge', 'craft', 'smith', 'mold', 'cast', 'base', 'core', 'firm', 'hard']
  },
  sports: {
    analytics: ['track', 'check', 'scan', 'view', 'sight', 'lens', 'eye', 'spot', 'find', 'pro'],
    training: ['work', 'task', 'build', 'forge', 'grow', 'path', 'way', 'leap', 'jump', 'fast']
  },
  fashion: {
    ecommerce: ['shop', 'pick', 'top', 'pro', 'best', 'good', 'well', 'stay', 'live', 'pure'],
    design: ['form', 'shape', 'mold', 'cast', 'smith', 'craft', 'forge', 'build', 'pure', 'fine']
  }
};

const negativeWords: Set<string> = new Set([
  'hurt', 'pain', 'ache', 'sick', 'ill', 'dead', 'death', 'kill', 'destroy', 'ruin',
  'break', 'crash', 'fail', 'loss', 'lost', 'wrong', 'bad', 'terrible', 'awful',
  'horror', 'scare', 'fear', 'panic', 'anxiety', 'stress', 'tension', 'conflict',
  'war', 'battle', 'fight', 'struggle', 'suffer', 'misery', 'grief', 'sorrow',
  'tragedy', 'disaster', 'catastrophe', 'emergency', 'crisis', 'danger', 'risk',
  'threat', 'attack', 'virus', 'disease', 'infection', 'contagious', 'toxic'
]);

export class ProfessionalBrandGenerator {
  private static instance: ProfessionalBrandGenerator;
  private micro_niches = micro_niches;
  private negative_words: Set<string> = negativeWords;
  private similarity_cache: Map<string, number> = new Map();
  private markov_models: Map<string, Map<string, Map<string, number>>> = new Map();
  private expanded_niches: Record<string, Record<string, string[]>> = {};
  private initialized = false;

  private constructor() {}

  public static getInstance(): ProfessionalBrandGenerator {
    if (!ProfessionalBrandGenerator.instance) {
      ProfessionalBrandGenerator.instance = new ProfessionalBrandGenerator();
    }
    return ProfessionalBrandGenerator.instance;
  }

  async init() {
    if (this.initialized) return;
    console.log("[BRAND_GEN] Initializing WordNet...");
    await wordnet.init();
    await getCommonWords(); // Trigger lazy load
    this.initialized = true;
    console.log("[BRAND_GEN] WordNet initialized.");
  }

  private async _expand_niche(domain: string, niche: string) {
    if (this.expanded_niches[domain]?.[niche]) return;

    if (!this.expanded_niches[domain]) {
      this.expanded_niches[domain] = {};
    }

    const words_list = this.micro_niches[domain]?.[niche];
    if (!words_list) return;

    const clean_words = this._filter_negative(words_list);
    const expanded_words = await this._expand_wordlist(clean_words);
    const model = this._build_markov_model(expanded_words, 2);
    
    this.markov_models.set(`${domain}|${niche}`, model);
    this.expanded_niches[domain][niche] = expanded_words;
    console.log(`[BRAND_GEN] Expanded niche: ${domain}/${niche}`);
  }

  private _is_negative(word: string): boolean {
    return this.negative_words.has(word.toLowerCase());
  }

  private _filter_negative(words_list: string[]): string[] {
    return words_list.filter(w => !this._is_negative(w));
  }

  private async _expand_wordlist(words_list: string[]): Promise<string[]> {
    const common_words = await getCommonWords();
    const expanded: Set<string> = new Set(words_list.map(w => w.toLowerCase()));
    for (const word of words_list) {
      try {
        const synsets = await wordnet.lookup(word);
        for (const syn of synsets.slice(0, 3)) {
          if (syn.meta && syn.meta.words) {
            for (const wordObj of syn.meta.words) {
              const w = wordObj.word.replace(/_/g, ' ').split(' ')[0].toLowerCase();
              if (/^[a-z]+$/.test(w) && w.length >= 3 && w.length <= 8 && common_words.has(w) && !this._is_negative(w)) {
                expanded.add(w);
              }
            }
          }
        }
      } catch (e) {}
    }
    const result = Array.from(expanded);
    return shuffle(result);
  }

  private _build_markov_model(words_list: string[], order = 2): Map<string, Map<string, number>> {
    const model = new Map<string, Map<string, number>>();
    for (let word of words_list) {
      word = word.toLowerCase();
      if (word.length <= order) continue;
      const padded = '^'.repeat(order) + word + '$';
      for (let i = 0; i < padded.length - order; i++) {
        const prefix = padded.slice(i, i + order);
        const next_char = padded[i + order];
        if (!model.has(prefix)) model.set(prefix, new Map());
        const charMap = model.get(prefix)!;
        charMap.set(next_char, (charMap.get(next_char) || 0) + 1);
      }
    }
    return model;
  }

  private _generate_markov_word(model: Map<string, Map<string, number>>, min_len = 3, max_len = 8, temperature = 0.8): string | null {
    if (model.size === 0) return null;
    const order = Array.from(model.keys())[0].length;
    let prefix = '^'.repeat(order);
    const result: string[] = [];

    for (let _ = 0; _ < max_len * 2; _++) {
      if (!model.has(prefix)) break;
      const charMap = model.get(prefix)!;
      const choices: string[] = [];
      const weights: number[] = [];
      for (const [char, count] of charMap.entries()) {
        choices.push(char);
        weights.push(Math.pow(count, 1 / temperature));
      }
      if (choices.length === 0) break;
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const probs = weights.map(w => w / totalWeight);
      const rand = Math.random();
      let cumulative = 0;
      let next_char = '';
      for (let i = 0; i < choices.length; i++) {
        cumulative += probs[i];
        if (rand <= cumulative) {
          next_char = choices[i];
          break;
        }
      }
      if (next_char === '$') break;
      result.push(next_char);
      prefix = (prefix + next_char).slice(-order);
    }

    const word = result.join('');
    if (word.length < min_len || word.length > max_len) return null;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  private _get_niche_words(domain: string, niche: string, use_markov = true, markov_ratio = 0.3): string[] {
    const base_words = [...(this.expanded_niches[domain]?.[niche] || [])];
    if (!use_markov) return base_words;

    const model = this.markov_models.get(`${domain}|${niche}`);
    if (!model) return base_words;

    const markov_words: string[] = [];
    const target_count = Math.max(1, Math.floor(base_words.length * markov_ratio));
    let attempts = 0;
    while (markov_words.length < target_count && attempts < 100) {
      const new_word = this._generate_markov_word(model, 3, 7);
      if (new_word && !base_words.some(w => w.toLowerCase() === new_word.toLowerCase()) && !markov_words.some(w => w.toLowerCase() === new_word.toLowerCase())) {
        if (!this._is_negative(new_word)) {
          markov_words.push(new_word);
        }
      }
      attempts++;
    }

    const combined = base_words.concat(markov_words);
    return shuffle(combined);
  }

  private _phonetic_pattern_score(first: string, second: string): number {
    let score = 0;
    if (first[0].toLowerCase() === second[0].toLowerCase()) score += 15;
    if (first.slice(-2).toLowerCase() === second.slice(-2).toLowerCase()) score += 15;
    return score;
  }

  private async _word_similarity(w1: string, w2: string): Promise<number> {
    const key = `${w1.toLowerCase()}|${w2.toLowerCase()}`;
    if (this.similarity_cache.has(key)) return this.similarity_cache.get(key)!;
    try {
      const synsets1 = await wordnet.lookup(w1);
      const synsets2 = await wordnet.lookup(w2);
      if (synsets1.length === 0 || synsets2.length === 0) return 0;
      const sim = synsets1[0] === synsets2[0] ? 1.0 : 0.1;
      this.similarity_cache.set(key, sim);
      return sim;
    } catch (e) { return 0; }
  }

  private async _name_quality_score(first: string, second: string): Promise<number> {
    let score = 0;
    const name = first + second;
    const semantic = (await this._word_similarity(first, second)) * 30;
    const phonetic = this._phonetic_pattern_score(first, second);
    const length = name.length;
    let length_score = (length >= 7 && length <= 10) ? 15 : 5;
    const negative_penalty = (this._is_negative(first) || this._is_negative(second)) ? -20 : 0;
    score = semantic + phonetic + length_score + negative_penalty;
    return Math.max(0, score);
  }

  private _is_valid_name(first: string, second: string): boolean {
    if (first.toLowerCase() === second.toLowerCase()) return false;
    const name = first + second;
    const low = name.toLowerCase();
    if (low.length > 10) return false;
    if (/[^aeiou]{5,}/.test(low)) return false;
    const vowels = (low.match(/[aeiou]/g) || []).length;
    const ratio = vowels / low.length;
    if (ratio < 0.2 || ratio > 0.7) return false;
    if (/(.)\1{2,}/.test(low)) return false;
    if (this._is_negative(first) || this._is_negative(second)) return false;
    return true;
  }

  async generate_for_niche(domain: string, niche: string, count = 5, use_markov = true, markov_ratio = 0.3): Promise<string[]> {
    if (!this.initialized) await this.init();
    
    if (!this.expanded_niches[domain] || !this.expanded_niches[domain][niche]) {
      await this._expand_niche(domain, niche);
    }
    
    if (!this.expanded_niches[domain] || !this.expanded_niches[domain][niche]) return [];
    const words_list = this._get_niche_words(domain, niche, use_markov, markov_ratio);
    if (words_list.length < 2) return [];
    const candidates: { name: string; score: number }[] = [];
    for (const f of words_list) {
      for (const s of words_list) {
        if (this._is_valid_name(f, s)) {
          const score = await this._name_quality_score(f, s);
          const name = f.charAt(0).toUpperCase() + f.slice(1) + s.charAt(0).toUpperCase() + s.slice(1);
          candidates.push({ name, score });
        }
      }
    }
    const seen = new Set<string>();
    const unique = candidates.filter(({ name }) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
    unique.sort((a, b) => b.score - a.score);
    const best = unique.slice(0, count * 2).map(c => c.name);
    return shuffle(best).slice(0, count);
  }
}
