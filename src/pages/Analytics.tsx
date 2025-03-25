import React from 'react';
import { BarChart, PieChart, LineChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
        <p className="text-gray-600">Detailed insights into content moderation metrics</p>
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
              <span className="text-sm font-medium text-gray-900">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Flagged Content</span>
              <span className="text-sm font-medium text-gray-900">22%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Response Time</h3>
            <LineChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">1.2s</span>
            <span className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              12%
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
            <span className="text-2xl font-bold">99.2%</span>
            <span className="flex items-center text-sm text-red-600">
              <ArrowDownRight className="w-4 h-4" />
              0.3%
            </span>
          </div>
          <p className="text-sm text-gray-600">Model accuracy this month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Content Type Distribution</h3>
          <div className="space-y-4">
            {['Text', 'Images', 'Videos', 'Links'].map((type, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-[60px]">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Moderation Actions</h3>
          <div className="space-y-4">
            {[
              { label: 'Approved', value: '45,231', change: '+12%' },
              { label: 'Rejected', value: '892', change: '-8%' },
              { label: 'Flagged for Review', value: '1,234', change: '+3%' },
            ].map((item, index) => (
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