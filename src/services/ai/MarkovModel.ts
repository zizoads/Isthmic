
export class MarkovEngine {
  public static buildModel(wordsList: string[], order = 2): Map<string, Map<string, number>> {
    const model = new Map<string, Map<string, number>>();
    for (let word of wordsList) {
      word = word.toLowerCase();
      if (word.length <= order) continue;
      const padded = '^'.repeat(order) + word + '$';
      for (let i = 0; i < padded.length - order; i++) {
        const prefix = padded.slice(i, i + order);
        const nextChar = padded[i + order];
        if (!model.has(prefix)) model.set(prefix, new Map());
        const charMap = model.get(prefix)!;
        charMap.set(nextChar, (charMap.get(nextChar) || 0) + 1);
      }
    }
    return model;
  }

  public static generateWord(model: Map<string, Map<string, number>>, minLen = 3, maxLen = 8, temperature = 0.8): string | null {
    if (model.size === 0) return null;
    const order = Array.from(model.keys())[0].length;
    let prefix = '^'.repeat(order);
    const result: string[] = [];

    for (let _ = 0; _ < maxLen * 2; _++) {
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
      let nextChar = '';
      for (let i = 0; i < choices.length; i++) {
        cumulative += probs[i];
        if (rand <= cumulative) {
          nextChar = choices[i];
          break;
        }
      }
      if (nextChar === '$') break;
      result.push(nextChar);
      prefix = (prefix + nextChar).slice(-order);
    }

    const word = result.join('');
    if (word.length < minLen || word.length > maxLen) return null;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
