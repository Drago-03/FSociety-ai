import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { PlatformIntegration } from '../hooks/useIntegrations';
import { PlatformCredentials } from '../api/platform-integration-api';
import AIAdminSettings, { AIAdminSettings as AISettings } from './AIAdminSettings';

interface IntegrationConfigModalProps {
  platform: PlatformIntegration;
  onClose: () => void;
  onConnect: (platformId: string, credentials: PlatformCredentials, aiSettings?: AISettings) => Promise<boolean>;
  loading: boolean;
  initialAISettings?: AISettings;
}

const IntegrationConfigModal: React.FC<IntegrationConfigModalProps> = ({
  platform,
  onClose,
  onConnect,
  loading,
  initialAISettings
}) => {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [aiSettings, setAISettings] = useState<AISettings | undefined>(initialAISettings);
  const [step, setStep] = useState<'credentials' | 'ai-settings'>('credentials');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAISettingsSave = (platformId: string, settings: AISettings) => {
    setAISettings(settings);
    setStep('credentials');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) return;
    
    const success = await onConnect(platform.id, credentials, aiSettings);
    if (success) {
      onClose();
    }
  };

  const renderCredentialsForm = () => {
    switch (platform.id) {
      case 'facebook':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                name="appId"
                value={credentials.appId || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Secret
              </label>
              <input
                type="password"
                name="appSecret"
                value={credentials.appSecret || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token
              </label>
              <input
                type="password"
                name="accessToken"
                value={credentials.accessToken || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );
      case 'twitter':
        return (
          <>
            <div className="px-4 py-3 bg-blue-50 text-blue-800 mb-4 rounded-md text-sm">
              Configure your X (formerly Twitter) API credentials
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                name="apiKey"
                value={credentials.apiKey || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Secret
              </label>
              <input
                type="password"
                name="apiSecret"
                value={credentials.apiSecret || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token
              </label>
              <input
                type="password"
                name="accessToken"
                value={credentials.accessToken || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Token Secret
              </label>
              <input
                type="password"
                name="accessTokenSecret"
                value={credentials.accessTokenSecret || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );
      case 'wordpress':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site URL
              </label>
              <input
                type="url"
                name="siteUrl"
                value={credentials.siteUrl || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Password
              </label>
              <input
                type="password"
                name="appPassword"
                value={credentials.appPassword || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );
      case 'discord':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Token
              </label>
              <input
                type="password"
                name="botToken"
                value={credentials.botToken || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Server ID
              </label>
              <input
                type="text"
                name="serverId"
                value={credentials.serverId || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );
      case 'slack':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot User OAuth Token
              </label>
              <input
                type="password"
                name="botToken"
                value={credentials.botToken || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signing Secret
              </label>
              <input
                type="password"
                name="signingSecret"
                value={credentials.signingSecret || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workspace ID
              </label>
              <input
                type="text"
                name="workspaceId"
                value={credentials.workspaceId || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </>
        );
      default:
        return (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
            No configuration available for this platform.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {step === 'credentials' ? `Connect to ${platform.name}` : `AI Settings for ${platform.name}`}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {step === 'credentials' ? (
            <>
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md mb-4">
                  <AlertTriangle className="w-4 h-4" />
                  <p>Your credentials are securely stored and encrypted</p>
                </div>
                
                <h4 className="font-medium text-gray-700 mb-2">Required Permissions:</h4>
                <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
                  {platform.permissions.map((permission, index) => (
                    <li key={index}>{permission}</li>
                  ))}
                </ul>
              </div>
              
              <form onSubmit={handleSubmit}>
                {renderCredentialsForm()}
                
                <div className="flex justify-between space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep('ai-settings')}
                    className="px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Configure AI Settings
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <AIAdminSettings 
              platform={platform} 
              onSave={handleAISettingsSave}
              initialSettings={aiSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationConfigModal;