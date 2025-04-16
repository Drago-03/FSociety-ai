import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Link as LinkIcon, ExternalLink, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useIntegrations, PlatformIntegration } from '../hooks/useIntegrations';
import { PlatformCredentials } from '../api/platform-integration-api';
import IntegrationButton from '../components/IntegrationButton';
import IntegrationConfigModal from '../components/IntegrationConfigModal';
import { AIAdminSettings } from '../components/AIAdminSettings';


const Integrations = () => {
  const { user } = useAuth();
  const { integrations, loading: integrationsLoading, connect, disconnect, loadIntegrations } = useIntegrations();
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformIntegration | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  // For demonstration purposes, we'll keep this state for platforms that don't use the hook
  const [localIntegrations, setLocalIntegrations] = useState<PlatformIntegration[]>([
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
  
  const handleConfigurePlatform = (platform: PlatformIntegration) => {
    // This would typically open a configuration modal or navigate to a settings page
    toast.success(`Configure ${platform.name} settings`);
  };

  const handleViewActivity = (platform: PlatformIntegration) => {
    // This would typically navigate to an activity log or dashboard
    toast.success(`View ${platform.name} activity`);
  };

  const handleConnect = (platform: PlatformIntegration) => {
    setSelectedPlatform(platform);
    setShowModal(true);
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      await disconnect(platformId);
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      toast.error('Failed to disconnect platform');
    }
  };

  const handleConnectWithCredentials = async (
    platformId: string, 
    credentials: PlatformCredentials, 
    aiSettings?: AIAdminSettings
  ) => {
    setConnecting(true);
    try {
      const success = await connect(platformId, credentials, aiSettings);
      if (success) {
        setShowModal(false);
        toast.success(`Connected to ${platformId}`);
      }
      return success;
    } catch (error) {
      console.error('Error connecting to platform:', error);
      toast.error('Failed to connect to platform');
      return false;
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Integrations</h1>
        <p className="text-gray-600">Connect your external platforms for AI-powered content moderation</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {integrations.map((platform) => (
          <IntegrationButton
            key={platform.id}
            platform={platform}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onConfigure={handleConfigurePlatform}
            onViewActivity={handleViewActivity}
          />
        ))}
      </div>

      {/* Integration Configuration Modal */}
      {showModal && selectedPlatform && (
        <IntegrationConfigModal
          platform={selectedPlatform}
          onClose={() => setShowModal(false)}
          onConnect={handleConnectWithCredentials}
          loading={connecting}
          initialAISettings={selectedPlatform.aiSettings}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Integration Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Automated Content Moderation</h3>
              <p className="text-sm text-gray-600">Let our AI automatically moderate content across all your connected platforms</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Centralized Dashboard</h3>
              <p className="text-sm text-gray-600">Monitor and manage all your platforms from a single dashboard</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Advanced Analytics</h3>
              <p className="text-sm text-gray-600">Get insights into content performance and moderation activities</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Custom Rules</h3>
              <p className="text-sm text-gray-600">Create platform-specific moderation rules and policies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;