import React, { useState } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import './toggle-switch.css';
import { PlatformIntegration } from '../hooks/useIntegrations';

interface AIAdminSettingsProps {
  platform: PlatformIntegration;
  onSave: (platformId: string, settings: AIAdminSettings) => void;
  initialSettings?: AIAdminSettings;
}

export interface AIAdminSettings {
  autoModeration: boolean;
  moderationLevel: 'low' | 'medium' | 'high';
  notifyOnFlagged: boolean;
  autoReplyToComments: boolean;
  contentFilters: string[];
  customRules?: string;
}

const defaultSettings: AIAdminSettings = {
  autoModeration: true,
  moderationLevel: 'medium',
  notifyOnFlagged: true,
  autoReplyToComments: false,
  contentFilters: ['hate_speech', 'violence', 'harassment'],
};

const availableContentFilters = [
  { id: 'hate_speech', label: 'Hate Speech' },
  { id: 'violence', label: 'Violence' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'self_harm', label: 'Self Harm' },
  { id: 'sexual_content', label: 'Sexual Content' },
  { id: 'spam', label: 'Spam' },
  { id: 'misinformation', label: 'Misinformation' },
];

const AIAdminSettings: React.FC<AIAdminSettingsProps> = ({ 
  platform, 
  onSave,
  initialSettings 
}) => {
  const [settings, setSettings] = useState<AIAdminSettings>(
    initialSettings || defaultSettings
  );

  const handleToggleChange = (field: keyof AIAdminSettings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'low' | 'medium' | 'high';
    setSettings(prev => ({
      ...prev,
      moderationLevel: value
    }));
  };

  const handleFilterToggle = (filterId: string) => {
    setSettings(prev => {
      const currentFilters = [...prev.contentFilters];
      if (currentFilters.includes(filterId)) {
        return {
          ...prev,
          contentFilters: currentFilters.filter(id => id !== filterId)
        };
      } else {
        return {
          ...prev,
          contentFilters: [...currentFilters, filterId]
        };
      }
    });
  };

  const handleCustomRulesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSettings(prev => ({
      ...prev,
      customRules: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(platform.id, settings);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">AI Administration Settings for {platform.name}</h3>
        <p className="text-sm text-gray-500">Configure how our AI should handle content on this platform</p>
      </div>

      <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md mb-6">
        <Info className="w-4 h-4" />
        <p>These settings determine how our AI will interact with your {platform.name} content</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Auto Moderation Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Auto Moderation</h4>
              <p className="text-xs text-gray-500">Automatically moderate content using AI</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="autoModeration"
                checked={settings.autoModeration}
                onChange={() => handleToggleChange('autoModeration')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="autoModeration" 
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.autoModeration ? 'bg-indigo-600' : 'bg-gray-300'}`}
              ></label>
            </div>
          </div>

          {/* Moderation Level */}
          <div>
            <label htmlFor="moderationLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Moderation Level
            </label>
            <select
              id="moderationLevel"
              value={settings.moderationLevel}
              onChange={handleLevelChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="low">Low - Flag only severe violations</option>
              <option value="medium">Medium - Balanced approach</option>
              <option value="high">High - Strict content policy</option>
            </select>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notify on Flagged Content</h4>
              <p className="text-xs text-gray-500">Receive notifications when content is flagged</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="notifyOnFlagged"
                checked={settings.notifyOnFlagged}
                onChange={() => handleToggleChange('notifyOnFlagged')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="notifyOnFlagged" 
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifyOnFlagged ? 'bg-indigo-600' : 'bg-gray-300'}`}
              ></label>
            </div>
          </div>

          {/* Auto Reply Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Auto-Reply to Comments</h4>
              <p className="text-xs text-gray-500">Let AI respond to common questions and comments</p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                id="autoReplyToComments"
                checked={settings.autoReplyToComments}
                onChange={() => handleToggleChange('autoReplyToComments')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="autoReplyToComments" 
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.autoReplyToComments ? 'bg-indigo-600' : 'bg-gray-300'}`}
              ></label>
            </div>
          </div>

          {/* Content Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Content Filters</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableContentFilters.map(filter => (
                <div key={filter.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filter-${filter.id}`}
                    checked={settings.contentFilters.includes(filter.id)}
                    onChange={() => handleFilterToggle(filter.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`filter-${filter.id}`} className="ml-2 block text-sm text-gray-700">
                    {filter.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Rules */}
          <div>
            <label htmlFor="customRules" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Rules (Optional)
            </label>
            <textarea
              id="customRules"
              value={settings.customRules || ''}
              onChange={handleCustomRulesChange}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter any custom moderation rules..."
            />
            <p className="mt-1 text-xs text-gray-500">Enter specific rules or keywords for your content moderation</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AIAdminSettings;