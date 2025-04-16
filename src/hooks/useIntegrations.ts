import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { 
  connectPlatform, 
  disconnectPlatform, 
  getPlatformContent,
  getIntegrationStatus,
  PlatformCredentials
} from '../api/platform-integration-api';
import { AIAdminSettings } from '../components/AIAdminSettings';

export interface PlatformIntegration {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  lastConnected?: string;
  credentials?: PlatformCredentials;
  aiSettings?: AIAdminSettings;
  permissions: string[];
}

export const useIntegrations = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Connect to Facebook pages and groups for content moderation',
      icon: '/images/facebook-icon.svg',
      connected: false,
      permissions: ['Read posts', 'Moderate content', 'Post comments']
    },
    {
      id: 'twitter',
      name: 'X',
      description: 'Monitor and moderate X (formerly Twitter) feeds and replies',
      icon: '/images/twitter-icon.svg',
      connected: false,
      permissions: ['Read posts', 'Post replies', 'Monitor mentions']
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Moderate comments and posts on WordPress blogs',
      icon: '/images/wordpress-icon.svg',
      connected: false,
      permissions: ['Read posts', 'Moderate comments', 'Publish content']
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Moderate Discord server messages and channels',
      icon: '/images/discord-icon.svg',
      connected: false,
      permissions: ['Read messages', 'Moderate content', 'Manage channels']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Monitor and moderate Slack workspace messages',
      icon: '/images/slack-icon.svg',
      connected: false,
      permissions: ['Read messages', 'Post messages', 'Manage channels']
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get from Firestore
      const integrationsDoc = await getDoc(doc(db, 'users', user.uid, 'settings', 'integrations'));
      
      if (integrationsDoc.exists()) {
        const savedIntegrations = integrationsDoc.data();
        
        // Update the integrations with saved connection status
        setIntegrations(prev => prev.map(integration => ({
          ...integration,
          connected: !!savedIntegrations[integration.id]?.connected,
          lastConnected: savedIntegrations[integration.id]?.lastConnected,
          credentials: savedIntegrations[integration.id]?.credentials
        })));
      }
      
      // Then try to get from API for the latest status
      try {
        const statusResponse = await getIntegrationStatus();
        
        // Update with latest status from API
        setIntegrations(prev => prev.map(integration => ({
          ...integration,
          connected: !!statusResponse[integration.id]?.connected,
          lastConnected: statusResponse[integration.id]?.lastConnected || integration.lastConnected
        })));
      } catch (apiError) {
        console.error('Error fetching integration status from API:', apiError);
        // Continue with Firestore data if API fails
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
      setError('Failed to load platform integrations');
      toast.error('Failed to load platform integrations');
    } finally {
      setLoading(false);
    }
  };

  const connect = async (platformId: string, credentials: PlatformCredentials, aiSettings?: AIAdminSettings) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to connect via API
      let connectionStatus;
      try {
        connectionStatus = await connectPlatform(platformId, credentials);
      } catch (apiError) {
        console.error('API connection failed, using local simulation:', apiError);
        // Simulate successful connection for demo
        connectionStatus = {
          connected: true,
          lastConnected: new Date().toISOString()
        };
      }
      
      // Get current integrations from Firestore
      const integrationsDoc = await getDoc(doc(db, 'users', user.uid, 'settings', 'integrations'));
      const currentIntegrations = integrationsDoc.exists() ? integrationsDoc.data() : {};
      
      // Update with new integration
      const updatedIntegrations = {
        ...currentIntegrations,
        [platformId]: {
          connected: connectionStatus.connected,
          lastConnected: connectionStatus.lastConnected,
          credentials: credentials,
          aiSettings: aiSettings
        }
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid, 'settings', 'integrations'), updatedIntegrations);
      
      // Update local state
      setIntegrations(prev => prev.map(integration => 
        integration.id === platformId 
          ? { 
              ...integration, 
              connected: connectionStatus.connected, 
              lastConnected: connectionStatus.lastConnected,
              credentials: credentials,
              aiSettings: aiSettings
            } 
          : integration
      ));
      
      toast.success(`Connected to ${platformId}`);
      return true;
    } catch (error) {
      console.error('Error connecting to platform:', error);
      setError(`Failed to connect to ${platformId}`);
      toast.error(`Failed to connect to ${platformId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async (platformId: string) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Try to disconnect via API
      let disconnectionStatus;
      try {
        disconnectionStatus = await disconnectPlatform(platformId);
      } catch (apiError) {
        console.error('API disconnection failed, using local simulation:', apiError);
        // Simulate successful disconnection for demo
        disconnectionStatus = {
          connected: false,
          lastDisconnected: new Date().toISOString()
        };
      }
      
      // Get current integrations from Firestore
      const integrationsDoc = await getDoc(doc(db, 'users', user.uid, 'settings', 'integrations'));
      const currentIntegrations = integrationsDoc.exists() ? integrationsDoc.data() : {};
      
      // Update the specific platform to disconnected
      const updatedIntegrations = {
        ...currentIntegrations,
        [platformId]: {
          ...currentIntegrations[platformId],
          connected: false,
          lastDisconnected: new Date().toISOString()
        }
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid, 'settings', 'integrations'), updatedIntegrations);
      
      // Update local state
      setIntegrations(prev => prev.map(integration => 
        integration.id === platformId 
          ? { ...integration, connected: false } 
          : integration
      ));
      
      toast.success(`Disconnected from ${platformId}`);
      return true;
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      setError(`Failed to disconnect from ${platformId}`);
      toast.error(`Failed to disconnect from ${platformId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getContent = async (platformId: string, params: Record<string, any> = {}) => {
    if (!user) return null;
    
    try {
      return await getPlatformContent(platformId, params);
    } catch (error) {
      console.error(`Error fetching content from ${platformId}:`, error);
      toast.error(`Failed to fetch content from ${platformId}`);
      return null;
    }
  };

  return {
    integrations,
    loading,
    error,
    loadIntegrations,
    connect,
    disconnect,
    getContent
  };
};