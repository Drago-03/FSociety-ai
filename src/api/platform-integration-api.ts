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

export interface PlatformCredentials {
  [key: string]: string;
}

export interface IntegrationStatus {
  connected: boolean;
  lastConnected?: string;
  error?: string;
}

/**
 * Connect to a platform using provided credentials
 */
export const connectPlatform = async (
  platformId: string,
  credentials: PlatformCredentials
): Promise<IntegrationStatus> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/integrations/connect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ platformId, credentials }),
    });

    if (!response.ok) {
      throw new Error(`Connection failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error(`Error connecting to ${platformId}:`, error);
    throw error;
  }
};

/**
 * Disconnect from a platform
 */
export const disconnectPlatform = async (platformId: string): Promise<IntegrationStatus> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/integrations/disconnect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ platformId }),
    });

    if (!response.ok) {
      throw new Error(`Disconnection failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error(`Error disconnecting from ${platformId}:`, error);
    throw error;
  }
};

/**
 * Get content from a connected platform
 */
export const getPlatformContent = async (
  platformId: string,
  params: Record<string, any> = {}
): Promise<any> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    const url = `${API_BASE_URL}/integrations/${platformId}/content${queryParams ? `?${queryParams}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(`Error fetching content from ${platformId}:`, error);
    throw error;
  }
};

/**
 * Perform moderation action on platform content
 */
export const moderateContent = async (
  platformId: string,
  contentId: string,
  action: 'approve' | 'reject' | 'hide' | 'delete',
  reason?: string
): Promise<any> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/integrations/${platformId}/moderate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ contentId, action, reason }),
    });

    if (!response.ok) {
      throw new Error(`Moderation action failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`Error moderating content on ${platformId}:`, error);
    throw error;
  }
};

/**
 * Get integration status for all platforms
 */
export const getIntegrationStatus = async (): Promise<Record<string, IntegrationStatus>> => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/integrations/status`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch integration status: ${response.statusText}`);
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Error fetching integration status:', error);
    throw error;
  }
};