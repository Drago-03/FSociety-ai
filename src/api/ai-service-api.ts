import { ContentAnalysisResult } from '../types/content-analysis';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export const analyzeContent = async (text: string): Promise<ContentAnalysisResult> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
};

export const batchAnalyzeContent = async (texts: string[]): Promise<ContentAnalysisResult[]> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/analyze-batch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ texts }),
    });

    if (!response.ok) {
      throw new Error(`Batch analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error batch analyzing content:', error);
    throw error;
  }
};

export const verifyDocument = async (file: File): Promise<any> => {
  try {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('document', file);
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/documents/verify`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Document verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error verifying document:', error);
    throw error;
  }
};

export const scrapeUrl = async (url: string): Promise<any> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/scrape?url=${encodeURIComponent(url)}`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error(`URL scraping failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw error;
  }
};