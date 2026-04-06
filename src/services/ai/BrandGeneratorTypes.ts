
export interface NicheData {
  [domain: string]: {
    [niche: string]: string[];
  };
}

export interface MarkovModel {
  [prefix: string]: {
    [nextChar: string]: number;
  };
}

export interface Candidate {
  name: string;
  score: number;
}
