import React, { useState } from 'react';
import { Link as LinkIcon, ExternalLink, Check, X, AlertTriangle, Loader2, Settings } from 'lucide-react';
import { PlatformIntegration } from '../hooks/useIntegrations';
import { PlatformCredentials } from '../api/platform-integration-api';

interface IntegrationButtonProps {
  platform: PlatformIntegration;
  onConnect: (platform: PlatformIntegration) => void;
  onDisconnect: (platformId: string) => void;
  onConfigure?: (platform: PlatformIntegration) => void;
  onViewActivity?: (platform: PlatformIntegration) => void;
}

const IntegrationButton: React.FC<IntegrationButtonProps> = ({
  platform,
  onConnect,
  onDisconnect,
  onConfigure,
  onViewActivity
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
            {platform.icon ? (
              <img src={platform.icon} alt={platform.name} className="w-8 h-8" />
            ) : (
              <span className="text-xl font-bold text-gray-700">{platform.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
            <p className="text-sm text-gray-500">{platform.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {platform.connected ? (
            <>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="w-3 h-3 mr-1" />
                Connected
              </span>
              <button
                onClick={() => onDisconnect(platform.id)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => onConnect(platform)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              Connect
            </button>
          )}
        </div>
      </div>
      {platform.connected && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Last connected: {new Date(platform.lastConnected || '').toLocaleString()}
            </span>
            <div className="flex space-x-4">
              {onViewActivity && (
                <button 
                  onClick={() => onViewActivity(platform)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Activity
                </button>
              )}
              {onConfigure && (
                <button 
                  onClick={() => onConfigure(platform)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                >
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationButton;