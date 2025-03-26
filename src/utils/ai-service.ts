import { ContentAnalysisResult } from '../types/content-analysis';
import { analyzeContent, batchAnalyzeContent } from '../api/ai-service-api';

const TOXICITY_THRESHOLD = 0.7;
const NEGATIVE_SENTIMENT_THRESHOLD = -0.3;

class AIContentService {

  async analyzeContent(text: string): Promise<ContentAnalysisResult> {
    return analyzeContent(text);
  }

  async batchAnalyzeContent(texts: string[]): Promise<ContentAnalysisResult[]> {
    return batchAnalyzeContent(texts);
  }
}

export const aiService = new AIContentService();