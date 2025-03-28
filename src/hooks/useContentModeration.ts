import { useState, useCallback } from 'react';
import { ContentAnalysisResult } from '../types/content-analysis';
import { analyzeContent as apiAnalyzeContent, batchAnalyzeContent } from '../api/ai-service-api';

export function useContentModeration() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysisResult | null>(null);

  const analyzeContent = useCallback(async (content: string) => {
    setIsAnalyzing(true);
    try {
      // Call the backend API for content analysis
      const result = await apiAnalyzeContent(content);
      
      setAnalysis(result);
      return result;
    } catch (error) {
      console.error('Content moderation failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const analyzeBatch = useCallback(async (contents: string[]) => {
    setIsAnalyzing(true);
    try {
      // Call the backend API for batch content analysis
      const results = await batchAnalyzeContent(contents);
      return results;
    } catch (error) {
      console.error('Batch content moderation failed:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyzeContent,
    analyzeBatch,
    isAnalyzing,
    analysis
  };
}