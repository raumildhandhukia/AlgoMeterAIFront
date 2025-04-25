export type AnalysisResult = {
  time_complexity: string;
  space_complexity: string;
  explanation: string;
};

export type Indices = [x: number, y: number];

export interface Company {
  name: string;
  slug: string;
  logo?: string; // Optional logo URL
}

export type Difficulty = 'easy' | 'medium' | 'hard'; // Use lowercase

export type MatchType = 'all' | 'any'; // Export MatchType
