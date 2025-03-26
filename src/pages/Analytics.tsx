import React, { useState, useEffect } from 'react';
import { BarChart, PieChart, LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { aiService } from '../utils/ai-service';
import toast from 'react-hot-toast';

interface AnalyticsData {
  totalContent: number;
  flaggedContent: number;
  avgResponseTime: number;
  accuracyRate: number;
  contentTypes: {
    label: string;
    value: number;
  }[];
  moderationActions: {
    label: string;
    value: number;
    change: string;
  }[];
}

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalContent: 0,
    flaggedContent: 0,
    avgResponseTime: 0,
    accuracyRate: 0,
    contentTypes: [],
    moderationActions: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API integration
      const data: AnalyticsData = {
        totalContent: 45231,
        flaggedContent: 892,
        avgResponseTime: 1.2,
        accuracyRate: 99.2,
        contentTypes: [
          { label: 'Text', value: 65 },
          { label: 'Images', value: 20 },
          { label: 'Videos', value: 10 },
          { label: 'Links', value: 5 }
        ],
        moderationActions: [
          { label: 'Approved', value: 45231, change: '+12%' },
          { label: 'Rejected', value: 892, change: '-8%' },
          { label: 'Flagged for Review', value: 1234, change: '+3%' }
        ]
      };
      setAnalyticsData(data);
    } catch (error) {
      toast.error('Failed to load analytics data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
        <p className="text-gray-600">Detailed insights into content moderation metrics</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          {loading && <span className="text-sm text-gray-500">Refreshing...</span>}
        </div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          disabled={loading}
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Content Distribution</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Safe Content</span>
              <span className="text-sm font-medium text-gray-900">
                {((analyticsData.totalContent - analyticsData.flaggedContent) / analyticsData.totalContent * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Flagged Content</span>
              <span className="text-sm font-medium text-gray-900">
                {(analyticsData.flaggedContent / analyticsData.totalContent * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Response Time</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{analyticsData.avgResponseTime}s</span>
            <span className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              {analyticsData.avgResponseTime < 1.5 ? '+12%' : '-8%'}
            </span>
          </div>
          <p className="text-sm text-gray-600">Average response time this week</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Accuracy Rate</h3>
            <BarChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{analyticsData.accuracyRate}%</span>
            <span className="flex items-center text-sm text-red-600">
              <ArrowDownRight className="w-4 h-4" />
              {(100 - analyticsData.accuracyRate).toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-600">Model accuracy this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Content Type Distribution</h3>
          <div className="space-y-4">
            {analyticsData.contentTypes.map((type, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${type.value}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[60px]">{type.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Moderation Actions</h3>
          <div className="space-y-4">
            {analyticsData.moderationActions.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.value}</span>
                  <span className={`text-xs ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;