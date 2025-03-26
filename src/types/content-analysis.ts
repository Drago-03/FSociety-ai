export interface ContentFlags {
  adult: boolean;
  spam: boolean;
  hate: boolean;
  harassment: boolean;
}

export interface ContentAnalysisResult {
  toxicity: number;
  sentiment: number;
  categories: string[];
  flags: ContentFlags;
}