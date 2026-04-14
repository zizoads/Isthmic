
// @ts-ignore
import wordnet from 'wordnet';
import wordList from 'word-list';
import pkg from 'lodash';
const { shuffle } = pkg;
import { readFile } from 'fs/promises';
import { micro_niches, negativeWords } from './NicheData';
import { MarkovEngine } from './MarkovModel';
import { ScoringEngine } from './ScoringEngine';

let commonWordsSet: Set<string> | null = null;

async function getCommonWords(): Promise<Set<string>> {
  if (!commonWordsSet) {
    const data = await readFile(wordList, 'utf8');
    const array = data.split('\n');
    commonWordsSet = new Set(array.map(w => w.toLowerCase()));
  }
  return commonWordsSet;
}

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
    if (this.initialized) {
      return;
    }
    try {
      await Promise.all([wordnet.init(), getCommonWords()]);
      this.initialized = true;
    } catch {
      // Initialization failed
    }
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
    const model = MarkovEngine.buildModel(expanded_words, 2);
    
    this.markov_models.set(`${domain}|${niche}`, model);
    this.expanded_niches[domain][niche] = expanded_words;
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
      } catch {}
    }
    const result = Array.from(expanded);
    return shuffle(result);
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
      const new_word = MarkovEngine.generateWord(model, 3, 7);
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

  private async _generate_candidates(words_list: string[]): Promise<{ name: string; score: number }[]> {
    const candidates: { name: string; score: number }[] = [];
    for (const f of words_list) {
      for (const s of words_list) {
        if (ScoringEngine.isValidName(f, s, (w) => this._is_negative(w))) {
          const score = await ScoringEngine.nameQualityScore(f, s, this.similarity_cache, (w) => this._is_negative(w));
          const name = f.charAt(0).toUpperCase() + f.slice(1) + s.charAt(0).toUpperCase() + s.slice(1);
          candidates.push({ name, score });
        }
      }
    }
    return candidates;
  }

  private _filter_unique_candidates(candidates: { name: string; score: number }[]): { name: string; score: number }[] {
    const seen = new Set<string>();
    return candidates.filter(({ name }) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }

  async generate_for_niche(domain: string, niche: string, count = 5, use_markov = true, markov_ratio = 0.3): Promise<string[]> {
    if (!this.initialized) await this.init();
    
    if (!this.expanded_niches[domain] || !this.expanded_niches[domain][niche]) {
      await this._expand_niche(domain, niche);
    }
    
    if (!this.expanded_niches[domain] || !this.expanded_niches[domain][niche]) return [];
    const words_list = this._get_niche_words(domain, niche, use_markov, markov_ratio);
    if (words_list.length < 2) return [];

    const candidates = await this._generate_candidates(words_list);
    const unique = this._filter_unique_candidates(candidates);
    
    unique.sort((a, b) => b.score - a.score);
    const best = unique.slice(0, count * 2).map(c => c.name);
    return shuffle(best).slice(0, count);
  }
}
