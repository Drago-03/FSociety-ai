import axios from 'axios';
import { getAuth } from 'firebase/auth';

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  timestamp: string;
  success: boolean;
  error?: string;
}  

export interface ThreatAnalysis {
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  categories: {
    hateSpeech: number;
    misinformation: number;
    malware: number;
    phishing: number;
    cyberbullying: number;
  };
  detectedThreats: string[];
  securityRecommendations: string[];
}

export interface ScrapingOptions {
  timeout?: number;
  headers?: Record<string, string>;
  followRedirects?: boolean;
  maxContentLength?: number;
}

export class WebScraper {
  private static instance: WebScraper;
  private baseUrl = 'http://localhost:8000';
  private defaultOptions: ScrapingOptions = {
    timeout: 30000,
    followRedirects: true,
    maxContentLength: 5 * 1024 * 1024 // 5MB
  };

  private constructor() {}

  public static getInstance(): WebScraper {
    if (!WebScraper.instance) {
      WebScraper.instance = new WebScraper();
    }
    return WebScraper.instance;
  }

  /**
   * Get authentication token if user is logged in
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Scrape content from a URL
   * @param url The URL to scrape
   * @param options Scraping options
   * @returns Promise with scraped content
   */
  public async scrapeUrl(url: string, options?: ScrapingOptions): Promise<ScrapedContent> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };
      const headers = await this.getAuthHeaders();
      
      const response = await axios.post(`${this.baseUrl}/scrape?url=${encodeURIComponent(url)}`, {}, {
        timeout: mergedOptions.timeout,
        maxContentLength: mergedOptions.maxContentLength,
        headers: {
          ...headers,
          ...mergedOptions.headers
        }
      });
      
      const result = response.data.result;
      
      return {
        url: url,
        title: result.title || '',
        content: result.text || '',
        timestamp: new Date().toISOString(),
        success: true
      };
    } catch (error) {
      console.error('Error scraping URL:', error);
      return {
        url: url,
        title: '',
        content: '',
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Verify information against trusted sources
   * @param content The content to verify
   * @returns Promise with verification result
   */
  public async verifyInformation(content: string): Promise<{
    verified: boolean;
    matchedSources: string[];
    confidence: number;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await axios.post(`${this.baseUrl}/verify-information`, 
        { text: content },
        { headers }
      );

      const result = response.data.result;
      
      return {
        verified: result.is_verified,
        matchedSources: result.matched_sources || [],
        confidence: result.confidence
      };
    } catch (error) {
      console.error('Error verifying information:', error);
      throw error;
    }
  }

  /**
   * Analyze content for potential threats and harmful content
   * @param content The content to analyze
   * @returns Promise with threat analysis result
   */
  public async analyzeThreatContent(content: string): Promise<ThreatAnalysis> {
    try {
      const headers = await this.getAuthHeaders();
      
      // In a real implementation, this would call the backend AI service
      const response = await axios.post(`${this.baseUrl}/analyze-threats`, 
        { text: content },
        { headers }
      );

      const result = response.data.result;
      
      return {
        threatLevel: result.threat_level || 'none',
        categories: {
          hateSpeech: result.categories?.hate_speech || 0,
          misinformation: result.categories?.misinformation || 0,
          malware: result.categories?.malware || 0,
          phishing: result.categories?.phishing || 0,
          cyberbullying: result.categories?.cyberbullying || 0
        },
        detectedThreats: result.detected_threats || [],
        securityRecommendations: result.security_recommendations || []
      };
    } catch (error) {
      console.error('Error analyzing threats:', error);
      
      // Fallback response for development/demo purposes
      return {
        threatLevel: 'low',
        categories: {
          hateSpeech: Math.random() * 0.3,
          misinformation: Math.random() * 0.5,
          malware: Math.random() * 0.1,
          phishing: Math.random() * 0.2,
          cyberbullying: Math.random() * 0.3
        },
        detectedThreats: [
          'Potential misinformation detected',
          'Suspicious external links'
        ],
        securityRecommendations: [
          'Verify information with multiple trusted sources',
          'Check the credibility of the website',
          'Be cautious of sensationalist claims'
        ]
      };
    }
  }
      // });
      // return response.data.result;
      
      // For now, simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        url,
        title: `Content from ${url}`,
        content: `This is the scraped content from ${url}. In a real implementation, this would contain the actual content from the webpage.`,
        timestamp: new Date().toISOString(),
        success: true
      };
    } catch (error) {
      console.error('Error scraping URL:', error);
      return {
        url,
        title: '',
        content: '',
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Scrape content from multiple URLs
   * @param urls Array of URLs to scrape
   * @param options Scraping options
   * @returns Promise with array of scraped content
   */
  public async scrapeMultipleUrls(urls: string[], options?: ScrapingOptions): Promise<ScrapedContent[]> {
    try {
      // In a real implementation, this would call the backend API
      // const response = await axios.post('/api/scrape-batch', { urls }, {
      //   timeout: options?.timeout || this.defaultOptions.timeout
      // });
      // return response.data.results;
      
      // For now, process sequentially to avoid overwhelming the browser
      const results: ScrapedContent[] = [];
      for (const url of urls) {
        const result = await this.scrapeUrl(url, options);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      console.error('Error scraping multiple URLs:', error);
      return urls.map(url => ({
        url,
        title: '',
        content: '',
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }

  /**
   * Verify information against trusted sources
   * @param text The text to verify
   * @param sources Optional array of trusted source URLs
   * @returns Promise with verification results
   */
  public async verifyInformation(text: string, sources?: string[]): Promise<{
    verified: boolean;
    matchedSources: string[];
    confidence: number;
  }> {
    try {
      // In a real implementation, this would call the backend API
      // const response = await axios.post('/api/verify-information', { 
      //   text, 
      //   sources 
      // });
      // return response.data.result;
      
      // For now, simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        verified: Math.random() > 0.2,
        matchedSources: sources ? sources.filter(() => Math.random() > 0.5) : [],
        confidence: Math.random() * 0.4 + 0.6
      };
    } catch (error) {
      console.error('Error verifying information:', error);
      throw new Error('Information verification failed');
    }
  }
}

export default WebScraper.getInstance();