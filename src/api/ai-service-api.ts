import { ContentAnalysisResult } from '../types/content-analysis';

const API_BASE_URL = '/api/content';

export const analyzeContent = async (text: string): Promise<ContentAnalysisResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
};

export const batchAnalyzeContent = async (texts: string[]): Promise<ContentAnalysisResult[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texts }),
    });

    if (!response.ok) {
      throw new Error(`Batch analysis failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error batch analyzing content:', error);
    throw error;
  }
};