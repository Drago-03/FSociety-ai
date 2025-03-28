import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { ContentAnalysis } from './nlp';

export interface DocumentVerificationResult {
  isAuthentic: boolean;
  confidence: number;
  issues: string[];
  category: string;
  metadata: Record<string, any>;
  analysis: ContentAnalysis | null;
}

export interface VerificationResult {
  document_id: string;
  filename: string;
  is_authentic: boolean;
  confidence: number;
  issues: string[];
  category: string;
  metadata?: Record<string, any>;
}

export interface DocumentMetadata {
  filename: string;
  fileSize: number;
  fileType: string;
  createdDate?: Date;
  modifiedDate?: Date;
  author?: string;
  pageCount?: number;
}

export class DocumentVerifier {
  private static instance: DocumentVerifier;
  private baseUrl = 'http://localhost:8000';

  private constructor() {}

  public static getInstance(): DocumentVerifier {
    if (!DocumentVerifier.instance) {
      DocumentVerifier.instance = new DocumentVerifier();
    }
    return DocumentVerifier.instance;
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
   * Verify a document for authenticity and detect potential issues
   * @param file The document file to verify
   * @returns Promise with verification result
   */
  public async verifyDocument(file: File): Promise<DocumentVerificationResult> {
    try {
      // Extract document metadata
      const metadata = await this.extractMetadata(file);
      
      const formData = new FormData();
      formData.append('document', file);
      
      const headers = await this.getAuthHeaders();
      
      try {
        const response = await axios.post(`${this.baseUrl}/documents/verify`, formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const result = response.data.result;
        return {
          isAuthentic: result.is_authentic,
          confidence: result.confidence,
          issues: result.issues,
          category: result.category,
          metadata: result.metadata || metadata,
          analysis: null
        };
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError);
        // For now, simulate a response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock verification result
        const result: DocumentVerificationResult = {
          isAuthentic: Math.random() > 0.3,
          confidence: Math.random() * 0.3 + 0.7,
          issues: this.generateMockIssues(file.type),
          category: this.detectDocumentCategory(file.name),
          metadata,
          analysis: null
        };
        
        return result;
      }
    } catch (error) {
      console.error('Error verifying document:', error);
      throw new Error('Document verification failed');
    }
  }
  
  /**
   * Extract metadata from a document file
   * @param file The document file
   * @returns Promise with document metadata
   */
  private async extractMetadata(file: File): Promise<DocumentMetadata> {
    // Basic metadata available from File object
    const metadata: DocumentMetadata = {
      filename: file.name,
      fileSize: file.size,
      fileType: file.type,
      modifiedDate: new Date(file.lastModified)
    };
    
    // In a real implementation, we would extract more metadata
    // based on file type (PDF, DOCX, etc.)
    
    return metadata;
  }
  
  /**
   * Detect the category of a document based on filename and content
   * @param filename The document filename
   * @returns The detected document category
   */
  private detectDocumentCategory(filename: string): string {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('contract') || lowerFilename.includes('agreement')) {
      return 'legal_document';
    } else if (lowerFilename.includes('report') || lowerFilename.includes('financial')) {
      return 'financial_document';
    } else if (lowerFilename.includes('policy') || lowerFilename.includes('handbook')) {
      return 'policy_document';
    } else if (lowerFilename.includes('id') || lowerFilename.includes('passport')) {
      return 'identity_document';
    } else {
      return 'general_document';
    }
  }
  
  /**
   * Generate mock issues for demonstration purposes
   * @param fileType The document file type
   * @returns Array of potential issues
   */
  private generateMockIssues(fileType: string): string[] {
    const allPossibleIssues = [
      'Inconsistent formatting',
      'Suspicious metadata',
      'Missing digital signature',
      'Potential content manipulation',
      'Unusual modification patterns',
      'Inconsistent author information',
      'Embedded macros detected',
      'Suspicious links found',
      'Inconsistent dates',
      'Unusual file structure'
    ];
    
    // Randomly select 0-3 issues
    const issueCount = Math.floor(Math.random() * 4);
    const shuffled = [...allPossibleIssues].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, issueCount);
  }
  
  /**
   * Verify information against trusted sources
   * @param text The text to verify
   * @returns Promise with verification result
   */
  public async verifyInformation(text: string): Promise<{
    is_verified: boolean;
    matched_sources: string[];
    confidence: number;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await axios.post(`${this.baseUrl}/verify-information`, 
        { text },
        { headers }
      );

      return response.data.result;
    } catch (error) {
      console.error('Error verifying information:', error);
      throw error;
    }
  }
}

export class DocumentScraper {
  /**
   * Extract text content from a document
   * @param file The document file
   * @returns Promise with extracted text
   */
  public static async extractText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          // For text files, we can directly use the result
          if (file.type === 'text/plain') {
            resolve(event.target.result as string);
            return;
          }
          
          // For other file types, we would need specific parsers
          // This is a simplified implementation
          resolve('Document text content would be extracted here');
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // For other file types, we would use appropriate methods
        // This is a simplified implementation
        reader.readAsArrayBuffer(file);
      }
    });
  }
  
  /**
   * Verify information in a document against trusted sources
   * @param text The document text content
   * @param sources Array of trusted source URLs
   * @returns Promise with verification results
   */
  public static async verifyInformation(text: string, sources: string[] = []): Promise<{
    verified: boolean;
    matchedSources: string[];
    confidence: number;
  }> {
    // In a real implementation, this would check the document content
    // against trusted sources to verify information accuracy
    
    // Simulate API call and processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      verified: Math.random() > 0.2,
      matchedSources: sources.filter(() => Math.random() > 0.5),
      confidence: Math.random() * 0.4 + 0.6
    };
  }
}