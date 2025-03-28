import { useState, useCallback } from 'react';
import { ContentModerator, ContentEnhancer, ModeratorQueue } from '../utils/nlp';
import { ContentAnalysis } from '../utils/nlp';

const moderator = new ContentModerator(process.env.GOOGLE_API_KEY || '');
const queue = ModeratorQueue.getInstance();

export function useContentModeration() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);

  const analyzeContent = useCallback(async (content: string) => {
    setIsAnalyzing(true);
    try {
      // Preprocess content
      const enhancedContent = ContentEnhancer.preprocessContent(content);
      
      // Extract additional features
      const features = ContentEnhancer.extractFeatures(content);
      
      // Perform analysis
      const result = await moderator.analyzeContent(enhancedContent);
      
      setAnalysis(result);
      return result;
    } catch (error) {
      console.error('Content moderation failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const queueContent = useCallback((content: string) => {
    const enhancedContent = ContentEnhancer.preprocessContent(content);
    queue.addToQueue(enhancedContent);
  }, []);

  return {
    analyzeContent,
    queueContent,
    isAnalyzing,
    analysis
  };
}