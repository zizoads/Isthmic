
// @ts-ignore
import wordnet from 'wordnet';

export class ScoringEngine {
  public static phoneticPatternScore(first: string, second: string): number {
    let score = 0;
    if (first[0].toLowerCase() === second[0].toLowerCase()) score += 15;
    if (first.slice(-2).toLowerCase() === second.slice(-2).toLowerCase()) score += 15;
    return score;
  }

  public static async wordSimilarity(w1: string, w2: string, cache: Map<string, number>): Promise<number> {
    const key = `${w1.toLowerCase()}|${w2.toLowerCase()}`;
    if (cache.has(key)) return cache.get(key)!;
    try {
      const synsets1 = await wordnet.lookup(w1);
      const synsets2 = await wordnet.lookup(w2);
      if (synsets1.length === 0 || synsets2.length === 0) return 0;
      const sim = synsets1[0] === synsets2[0] ? 1.0 : 0.1;
      cache.set(key, sim);
      return sim;
    } catch { return 0; }
  }

  public static async nameQualityScore(
    first: string, 
    second: string, 
    cache: Map<string, number>,
    isNegative: (word: string) => boolean
  ): Promise<number> {
    let score = 0;
    const name = first + second;
    const semantic = (await this.wordSimilarity(first, second, cache)) * 30;
    const phonetic = this.phoneticPatternScore(first, second);
    const length = name.length;
    let lengthScore = (length >= 7 && length <= 10) ? 15 : 5;
    const negativePenalty = (isNegative(first) || isNegative(second)) ? -20 : 0;
    score = semantic + phonetic + lengthScore + negativePenalty;
    return Math.max(0, score);
  }

  public static isValidName(first: string, second: string, isNegative: (word: string) => boolean): boolean {
    if (first.toLowerCase() === second.toLowerCase()) return false;
    const name = first + second;
    const low = name.toLowerCase();
    if (low.length > 10) return false;
    if (/[^aeiou]{5,}/.test(low)) return false;
    const vowels = (low.match(/[aeiou]/g) || []).length;
    const ratio = vowels / low.length;
    if (ratio < 0.2 || ratio > 0.7) return false;
    if (/(.)\1{2,}/.test(low)) return false;
    if (isNegative(first) || isNegative(second)) return false;
    return true;
  }
}
