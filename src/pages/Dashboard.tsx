import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      icon: Shield,
      label: 'Total Content Processed',
      value: '124,892',
      change: '+14.2%',
      positive: true
    },
    {
      icon: AlertTriangle,
      label: 'Flagged Content',
      value: '1,204',
      change: '-5.1%',
      positive: true
    },
    {
      icon: CheckCircle,
      label: 'Accuracy Rate',
      value: '99.2%',
      change: '+0.8%',
      positive: true
    },
    {
      icon: Clock,
      label: 'Avg. Response Time',
      value: '1.2s',
      change: '-0.3s',
      positive: true
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Moderation Dashboard</h1>
        <p className="text-gray-600">Real-time overview of content moderation metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-6 h-6 text-indigo-600" />
                <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Flagged Content</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Content ID: #1234{item}</p>
                  <p className="text-xs text-gray-600">Flagged for: Inappropriate content</p>
                </div>
                <button className="text-xs text-indigo-600 font-medium">Review</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Response Time</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Queue Processing</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ML Model Performance</span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;